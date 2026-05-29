# Autonomous Audience & Traffic Intelligence Engine
## Reader Intelligence Spec v1.1 — Personal Stack Edition
**Prepared May 2026 · Confidential**

| Attribute | Value |
|---|---|
| Version | 1.1 |
| Prepared | May 2026 |
| Pairs with | Content Engine v2.1, pSEO Engine v1.1, Quality Gateway v1.1, Smart Admin Dashboard v1.2, Monetization Engine v1.1 |
| New API keys | 0 |
| New ongoing cost | $0/mo |

---

## What changed in v1.1

| Change | What it fixes |
|---|---|
| Version references corrected | Updated to current spec versions throughout |
| Feed layer timing made explicit | Feed layer writes keyword priority adjustments before 05:30 UTC so Monday's Content Engine refresh inherits them |
| `audience_res_adjustments` timing documented | Explicit note that this must be written before 06:00 UTC Monetization Score layer |
| CRO Engine baseline dependency noted | Feed layer produces `audience_content_baselines` — CRO Engine cannot run meaningful tests without this |
| Product-sale framing removed | Spec is for personal network operation only |

---

## Contents

| Section | Title |
|---|---|
| 01 | What this is |
| 02 | Architecture overview |
| 03 | Layer 1 — Capture |
| 04 | Layer 2 — Segment |
| 05 | Layer 3 — Analyse |
| 06 | Layer 4 — Feed |
| 07 | Admin panel additions |
| 08 | Integration with existing specs |
| 09 | Database schema |
| 10 | Activation prompt |
| 11 | Setup — two questions |
| 12 | Troubleshooting |

---

## Section 01 — What this is

The stack knows an article was published, that it passed the Quality Gateway, that it received impressions from Google Search Console, and that someone clicked an affiliate link. What it does not know is anything about the reader between arrival and conversion.

This engine fills that gap. It builds a persistent, growing model of your actual audience — where they come from, what they engage with, which content drives conversion, and which content loses readers. It feeds those signals back into every other engine so decisions are made from real reader behaviour, not assumptions.

### What the other specs do not cover

- Connecting traffic source to downstream affiliate conversion
- Measuring engagement beyond pageviews — scroll depth, time on page, return visits
- Identifying which reader segments exist and what content each engages with most
- Understanding why readers subscribe to the newsletter vs leave without subscribing
- Detecting when a traffic source's quality is declining before it shows up in revenue
- Providing the CRO Engine with the behavioural baseline it needs to run meaningful tests

**No cookies. No third-party tracking. All measurement is first-party, session-based, and privacy-safe.** No GDPR consent banner required for the data this engine collects.

---

## Section 02 — Architecture overview

Four layers. One persistent audience model.

| Layer | Name | What it does | When it runs |
|---|---|---|---|
| 1 | Capture | Records session events: arrivals, scroll depth, time on page, clicks, exits. | Real-time, on every session |
| 2 | Segment | Groups sessions into behavioural cohorts. Updates cohort assignments weekly. | Sunday 04:00 UTC |
| 3 | Analyse | Calculates per-cohort conversion rates, traffic source quality scores, newsletter subscriber intent signals. | Sunday 04:30 UTC |
| 4 | Feed | Writes audience intelligence signals back to other engines. Must complete by 05:30 UTC. | Sunday 05:00 UTC |

### Output streams

| Stream | What it contains | Where it goes |
|---|---|---|
| Engine feeds | Cohort conversion rates, traffic quality scores, content engagement signals | Monetization Engine RES (06:00 UTC), Content Engine keyword priority, newsletter segmentation, CRO baselines |
| Dashboard output | AUDIENCE section in Smart Admin Dashboard | `/admin` — detected automatically |
| Weekly digest | Audience health summary | `ALERT_EMAIL` via Resend, Sunday 09:30 UTC |

**Critical timing:** The Feed layer must complete by 05:30 UTC so that `audience_res_adjustments` and `keyword_queue` priority updates are available before the Monetization Engine Score layer (06:00 UTC) and before Monday's Content Engine keyword queue refresh.

---

## Section 03 — Layer 1 — Capture

### Session tracking script

A JavaScript snippet under 3KB, zero external dependencies, injected into every page. All data sent to a single edge function endpoint. No PII collected. Sessions identified by an anonymous token (random UUID stored in sessionStorage — cleared when the browser tab closes, not a persistent cookie).

### Events captured

| Event | When it fires | Data stored |
|---|---|---|
| `page_enter` | On page load | session_id, page_url, page_type, referrer_url, utm_source, utm_medium, utm_campaign, device_type, viewport_width, timestamp |
| `scroll_depth` | At 25%, 50%, 75%, 100% scroll milestones | session_id, page_url, depth_pct, time_to_depth_seconds |
| `time_on_page` | Every 30 seconds while page is visible | session_id, page_url, seconds_active |
| `affiliate_click` | On affiliate link click (joins with `monetization_clicks`) | session_id, affiliate_link_id, tool_slug, click_position, page_url |
| `newsletter_signup` | On newsletter form submission | session_id, page_url, signup_source (inline / exit_intent / sidebar) |
| `internal_link` | On click of any internal link | session_id, from_url, to_url, link_text |
| `page_exit` | On page unload or visibility change to hidden | session_id, page_url, total_seconds_active, max_scroll_depth, did_click_affiliate, did_signup |

### Traffic source classification

| Source | Classification logic |
|---|---|
| `organic_search` | Referrer matches Google, Bing, DuckDuckGo, etc. OR no UTM and no referrer |
| `newsletter` | UTM source = newsletter OR referrer matches Resend send domain |
| `social` | Referrer matches Twitter/X, LinkedIn, Facebook, Reddit, Instagram, etc. OR utm_medium = social |
| `referral` | Referrer is external non-search non-social |
| `network` | Referrer matches any domain in `network_domains` |
| `direct` | No referrer, no UTM, returning visitor session token |

### Session assembly

Raw events assembled into complete session records every hour. A session is complete when a `page_exit` event is received or when no new events have been recorded for 30 minutes.

---

## Section 04 — Layer 2 — Segment

Runs weekly, Sundays at 04:00 UTC. Assigns every session from the past 28 days to a behavioural cohort.

### Cohort dimensions

**Dimension 1 — Traffic source** (six values)

**Dimension 2 — Engagement tier**

| Tier | Criteria |
|---|---|
| `deep` | max_scroll_depth_pct ≥ 75 AND total_seconds_active ≥ 90 |
| `engaged` | max_scroll_depth_pct ≥ 50 AND total_seconds_active ≥ 45 |
| `shallow` | max_scroll_depth_pct < 50 OR total_seconds_active < 45 |
| `bounce` | pages_viewed = 1 AND total_seconds_active < 15 |

**Dimension 3 — Content affinity**

| Affinity | Criteria |
|---|---|
| `tool_evaluator` | Entry on tool_review or comparison page, OR navigated to 2+ tool pages in session |
| `researcher` | Entry on tutorial or best_of_list page, majority of session on informational content |
| `price_checker` | Entry on pricing pSEO page, OR navigated to pricing page during session |
| `category_browser` | Entry on category_best pSEO page, majority of session on category/list pages |
| `return_reader` | Session token seen in previous week's assembled sessions |

### Cohort assignment

Up to 120 distinct cohorts possible; in practice 15–25 active cohorts for most sites. Cohorts with fewer than 10 sessions in the past 28 days merged into a `low_volume` cohort.

---

## Section 05 — Layer 3 — Analyse

Runs weekly, Sundays at 04:30 UTC, after segmentation completes.

### Traffic source quality score (0–100)

| Dimension | Weight | What is measured |
|---|---|---|
| Engagement rate | 30 pts | % of sessions reaching `engaged` or `deep` tier |
| Conversion rate | 35 pts | % of sessions with `did_click_affiliate = true` |
| Scroll completion | 15 pts | Average `max_scroll_depth_pct` |
| Return rate | 20 pts | % of sessions where `return_reader` affinity is true |

| Quality score | Classification |
|---|---|
| 0–25 | Low quality — leaves quickly, doesn't convert |
| 26–50 | Below average — some engagement, weak conversion |
| 51–75 | Healthy — above-average engagement and conversion |
| 76–100 | High quality — your best traffic source |

### Content performance by cohort

For each active cohort with 10+ sessions, the analysis layer calculates: cohort conversion rate, best-performing content (highest conversion rate, min 20 sessions on the page), worst-performing content (high session count, zero conversions), average engagement score.

### Newsletter subscriber intent signals

| Signal | How detected | Segment assigned |
|---|---|---|
| `high_intent_buyer` | Signed up after comparison or pricing page | Monetization-focused emails |
| `researcher` | Signed up after tutorial or best_of_list page | Educational emails |
| `tool_evaluator` | Signed up after tool_review page | Tool-specific emails |
| `unknown` | Signed up from homepage or unclear pattern | Default newsletter list |

### Engagement decay detection

| Decay type | Condition | Action |
|---|---|---|
| Engagement decay | Avg scroll depth dropped > 20 pct points vs 8-week average | Flag for Content Refresh Agent |
| Conversion decay | Conversion rate dropped > 40% vs 8-week average | Flag for Monetization Engine offer audit + Content Refresh |
| Traffic source shift | Primary traffic source changed significantly | Flag in admin panel |

---

## Section 06 — Layer 4 — Feed

Runs weekly, Sundays at 05:00 UTC. Must complete by 05:30 UTC.

**Timing is critical for two reasons:**
1. `audience_res_adjustments` must be written before the Monetization Engine Score layer at 06:00 UTC
2. `keyword_queue` priority updates must be written before 05:30 UTC so that Monday's Content Engine refresh (07:00 UTC) inherits updated priorities

### Feed 1 — Monetization Engine RES adjustment

```
traffic_quality_multiplier = traffic_source_quality_score / 50
  where 50 = baseline (no adjustment)
  quality score 75 = 1.5× multiplier
  quality score 25 = 0.5× multiplier
```

Written to `audience_res_adjustments`. Read by Monetization Engine Score layer during 06:00 UTC calculations. A page with identical raw click rates but driven by high-quality newsletter traffic will score higher than one driven by low-quality social traffic.

### Feed 2 — Content Engine keyword priority

| Signal | Keyword queue adjustment |
|---|---|
| `tool_evaluator` cohort is highest-converting | Boost pending `tool_review` and `comparison` keywords by +10 |
| `researcher` cohort has highest engagement but low conversion | Add note to `best_of_list` and `tutorial` keywords about CTA structure |
| Content affinity high for specific tool category | Surface pending keywords in that category to priority 70+ |
| Article engagement decay detected | Add article's keyword to queue at priority 75 with `status = refresh_candidate` |

All priority adjustments logged to `audience_keyword_adjustments`. Adjustments are additive — they increment or decrement existing priority values, not overwrite them.

**Deadline:** All `keyword_queue` updates must be written before 05:30 UTC.

### Feed 3 — Newsletter segmentation

Segment assignments written to `audience_newsletter_segments`. Newsletter automation reads this table and sends conditionally:

- `high_intent_buyer` — receives sponsor slot or highest-RES tool CTA
- `researcher` — receives tutorial or best_of_list article as lead item
- `tool_evaluator` — receives most recent tool review as lead item
- `unknown` — receives default newsletter (highest quality score article)

One email per segment using the same template with swapped content blocks. Segment counts logged to `newsletter_issues`.

### Feed 4 — Smart Suggestions context

Weekly audience summary written to `audience_smart_suggestions_context`:

```
Audience intelligence (past 7 days):
- Highest quality traffic source: [source] (quality score: [X])
- Lowest quality traffic source: [source] (quality score: [X])
- Highest converting cohort: [cohort description] ([X]% conversion rate)
- Content type with highest engagement this week: [type]
- Pages with engagement decay this week: [count] ([list top 3 by traffic])
- Newsletter segment breakdown: [X]% high_intent_buyer, [X]% researcher
Include one audience-specific recommendation in your output.
```

Smart Suggestions reads this table — do not modify the Smart Suggestions call itself.

### Feed 5 — CRO Engine baseline

Weekly content baseline snapshot written to `audience_content_baselines` — one row per article and pSEO page with 4-week rolling averages for engagement metrics. The CRO Engine reads these baselines as its control group. **The CRO Engine cannot run meaningful tests until this feed has been running for at least 2 weeks.**

---

## Section 07 — Admin panel additions

AUDIENCE section detected via presence of `audience_sessions` table. Placement: between CONTENT ENGINE and QUALITY GATEWAY in sidebar.

One new homepage widget: **Audience pulse** — this week's session count, conversion rate, and top traffic source quality score.

### Four tabs in the AUDIENCE section

| Tab | What it contains |
|---|---|
| Traffic Sources | Quality score per active source. 8-week trend chart. Session count, engagement rate, conversion rate, return rate broken out. "Best traffic source" callout at top. |
| Reader Segments | All active cohorts with session counts. Conversion rate per cohort. Best and worst performing content per cohort. Cohort trend: growing or shrinking? |
| Content Engagement | All articles and pSEO pages with engagement metrics: avg scroll depth, avg time on page, conversion rate, return visit rate. Filter by content type, date range, traffic source. Decay flags shown in amber. |
| Newsletter Audience | Subscriber segment breakdown. Growth rate by segment. Which pages generate the most signups. Signup source breakdown. 8-week subscriber growth chart. |

---

## Section 08 — Integration with existing specs

### Content Engine v2.1 — 3 integration points

| Integration | What it does |
|---|---|
| Keyword priority adjustments | Feed layer increments/decrements `keyword_queue.priority` based on which content types are converting best. Content Engine reads priority at generation time — no change to generation logic required. |
| Newsletter segmentation | Feed layer writes segment assignments to `audience_newsletter_segments`. Newsletter automation reads this table when assembling weekly send and swaps content blocks per segment. |
| Refresh candidate flagging | Pages with engagement decay written to `keyword_queue` with `status = refresh_candidate`, `added_by = 'audience_engine'`. Content Refresh Agent reads this queue — no logic change required. |

### pSEO Engine v1.1 — 2 integration points

| Integration | What it does |
|---|---|
| pSEO page engagement tracking | Session tracking fires on pSEO pages identically to articles. `entry_pseo_page_id` populated from URL pattern. pSEO engagement appears in Content Engagement tab. |
| pSEO impression to engagement correlation | Analysis layer correlates GSC impression data with actual session engagement. High impressions but low engagement signals a title/meta mismatch. Flagged separately from standard engagement decay. |

### Quality Gateway v1.1 — 1 integration point

| Integration | What it does |
|---|---|
| Post-publish performance feedback | Analysis layer reads engagement data for articles published in past 30 days and writes `engagement_score` (0–100) to `gateway_scores` as a post-hoc field. Not used for pass/fail decisions — used by Quality Gateway Learn layer as a performance signal when adjusting dimension weights. |

### Monetization Engine v1.1 — 2 integration points

| Integration | What it does |
|---|---|
| Traffic quality multiplier | Feed layer writes `traffic_quality_multiplier` per page to `audience_res_adjustments` before 05:30 UTC. Monetization Engine reads this at 06:00 UTC. No change to RES formula structure — multiplier is applied to `clicks_per_1000_visitors` before formula runs. |
| Cohort conversion data | Analysis layer writes per-page cohort conversion rates to `audience_content_performance`. Monetization Engine reads the highest-converting cohort for each page for weekly summary context. |

### CRO Engine v1.0 — 1 integration point (REQUIRED for CRO)

| Integration | What it does |
|---|---|
| Engagement baselines | Feed layer writes weekly content baselines to `audience_content_baselines`. CRO Engine reads these as its control group measurements. **This feed must be running for at least 2 weeks before the CRO Engine can run a meaningful test on any page.** |

---

## Section 09 — Database schema

### New tables

**audience_sessions** — session records with full fields as specified in Layer 1.

**audience_events** — raw event log (session_id, event_type, page_url, event_data JSONB, fired_at, site_id).

**audience_cohorts** — cohort snapshots (cohort_key, traffic_source, engagement_tier, content_affinity, session_count_28d, conversion_rate, avg_scroll_depth, avg_time_on_page, return_rate, week_start, site_id).

**audience_traffic_source_scores** — weekly quality scores per source (traffic_source, quality_score, engagement_rate, conversion_rate, scroll_completion_avg, return_rate, session_count_28d, scored_at, site_id).

**audience_content_performance** — per-page per-cohort metrics (source_id, source_type, cohort_key, session_count, conversion_rate, avg_scroll_depth, avg_time_on_page, engagement_decay_flag, decay_type, week_start, site_id).

**audience_newsletter_segments** — subscriber segment assignments (subscriber_email_hash, segment, signup_page_url, signup_source, assigned_at, last_updated, site_id).

**audience_res_adjustments** — traffic quality multipliers for Monetization Engine (source_id, source_type, primary_traffic_source, traffic_quality_multiplier, traffic_source_quality_score, calculated_at, site_id).

**audience_content_baselines** — 4-week rolling averages for CRO Engine (source_id, source_type, avg_scroll_depth, avg_time_on_page, conversion_rate, session_count_28d, baseline_date, site_id).

**audience_keyword_adjustments** — log of priority adjustments (keyword_id, adjustment_amount, reason, signal_source, applied_at).

**audience_smart_suggestions_context** — weekly summary JSON for Smart Suggestions.

### Extended tables (existing — columns added only)

| Table | Columns added |
|---|---|
| `articles` | `avg_scroll_depth` (decimal), `avg_time_on_page` (decimal), `audience_conversion_rate` (decimal), `primary_traffic_source` (text), `engagement_decay_flag` (boolean) |
| `pseo_pages` | Same five columns as articles |
| `gateway_scores` | `engagement_score` (integer 0–100) — post-hoc field, written after 30 days of publish data |
| `newsletter_issues` | `segment_counts` (jsonb) — breakdown of how many subscribers received each content variant |

---

## Section 10 — Activation prompt

Paste into your Lovable project after Content Engine v2.1, pSEO Engine v1.1, Monetization Engine v1.1, and Smart Admin Dashboard v1.2 are installed.

```
Build and activate the Autonomous Audience & Traffic Intelligence Engine v1.1
for this Lovable project.

Before building anything, audit for: (1) articles table, (2) pseo_pages table,
(3) keyword_queue table, (4) monetization_clicks table,
(5) monetization_res_scores table, (6) gateway_scores table,
(7) network_reports table, (8) existing /admin route, (9) newsletter_issues table,
(10) network_domains table (for network traffic source classification).

For each found: extend with new columns only. Do not overwrite existing data.
For each missing: build foundational version.

1. SESSION TRACKING SCRIPT
   Create a JavaScript module (under 3KB, zero external dependencies) that fires:
   - page_enter: captures page_url, page_type (detect from URL: /compare/
     /alternatives/ /best/ /pricing/ /features/ = pseo_page, /blog/ = article,
     / = homepage), referrer, UTM params from window.location.search, device_type.
   - scroll_depth: at 25%, 50%, 75%, 100% using IntersectionObserver on sentinel
     elements at each quartile of page body height.
   - time_on_page: every 30 seconds while document.visibilityState = 'visible'.
   - affiliate_click: when any link with data-affiliate="true" is clicked.
     Add data-affiliate="true" to all affiliate CTA elements site-wide.
   - newsletter_signup: on newsletter form submit success.
   - internal_link: on click of any <a> tag pointing to same domain.
   - page_exit: on visibilitychange to 'hidden' or beforeunload.
   - Anonymous session token: crypto.randomUUID() stored in sessionStorage.
   - All events POST to /api/audience-event (non-blocking, fire-and-forget).
   Inject this script into every page template in the project.

2. EVENT INGESTION EDGE FUNCTION
   Create /api/audience-event accepting: session_token, event_type, page_url,
   event_data (jsonb). Write to audience_events. Return 200 immediately.
   Rate limit: max 60 events per session_token per minute.

3. SESSION ASSEMBLY JOB (runs hourly)
   Query audience_events for session_tokens with page_exit received OR
   last event > 30 minutes ago. Assemble into audience_sessions records.
   Classify traffic_source from referrer and UTM params.
   Set entry_article_id or entry_pseo_page_id from entry_page_url.
   Mark assembled session_tokens as processed.

4. TRAFFIC SOURCE CLASSIFICATION
   - Referrer matches search engine domains: organic_search
   - UTM source = 'newsletter' OR referrer matches resend send domain: newsletter
   - Referrer matches social platforms: social
   - Referrer matches any domain in network_domains: network
   - Referrer is external non-search non-social: referral
   - No referrer, no UTM, returning session pattern: direct

5. WEEKLY SEGMENTATION (Sundays 04:00 UTC)
   Assign engagement_tier and content_affinity for all sessions past 28 days.
   Build cohort_key = traffic_source + '_' + engagement_tier + '_' + content_affinity.
   Write to audience_cohorts. Merge cohorts < 10 sessions into low_volume.

6. WEEKLY ANALYSIS (Sundays 04:30 UTC)
   A. Traffic source quality scores — write to audience_traffic_source_scores.
   B. Content performance by cohort — write to audience_content_performance.
      Update articles and pseo_pages with engagement columns.
      Flag engagement_decay_flag = true where decay threshold met.
   C. Newsletter subscriber intent — classify and write to audience_newsletter_segments.
   D. Engagement decay detection — flag articles/pseo_pages with decay.

7. WEEKLY FEED (Sundays 05:00 UTC — MUST COMPLETE BY 05:30 UTC)
   A. MONETIZATION ENGINE FEED — DEADLINE 05:30 UTC
      For each article/pseo_page, compute traffic_quality_multiplier =
      primary_traffic_source quality_score / 50.
      Write to audience_res_adjustments.
      CRITICAL: This table must be populated before Monetization Engine Score
      layer runs at 06:00 UTC. Log completion timestamp to system_health_log.

   B. CONTENT ENGINE KEYWORD PRIORITY FEED — DEADLINE 05:30 UTC
      Read highest-converting cohort. Adjust keyword_queue.priority per spec rules.
      Log adjustments to audience_keyword_adjustments.
      For pages with engagement_decay_flag = true: add keyword to keyword_queue
      with status = refresh_candidate, added_by = 'audience_engine', priority 75.
      CRITICAL: These updates must be written before 05:30 UTC so Monday's
      Content Engine refresh (07:00 UTC) inherits updated priorities.

   C. NEWSLETTER SEGMENTATION FEED
      Ensure audience_newsletter_segments is current.
      Update newsletter_issues.segment_counts after each weekly send.

   D. CRO ENGINE BASELINES FEED
      For each article/pseo_page with >= 10 sessions, calculate 4-week rolling
      averages for scroll_depth, time_on_page, conversion_rate.
      Write to audience_content_baselines. CRO Engine reads this table.
      Note: CRO Engine requires at least 2 weeks of baseline data before it
      can run meaningful tests. Log baseline_row_count to system_health_log.

   E. SMART SUGGESTIONS CONTEXT FEED
      Write weekly audience summary JSON to audience_smart_suggestions_context.
      Smart Suggestions reads this table — do not modify the Smart Suggestions
      LLM call directly.

   F. FEED COMPLETION LOG
      After all feeds complete, write feed_completed_at timestamp to
      system_health_log with status = 'audience_feed_complete'.
      This allows the Monetization Engine to verify feeds ran before scoring.

8. POST-PUBLISH GATEWAY FEEDBACK (runs monthly, first Sunday)
   For articles published 30–60 days ago with gateway_scores records:
   Calculate engagement_score = (avg_scroll_depth * 0.4 +
     time_on_page_normalised * 0.3 + audience_conversion_rate_normalised * 0.3) * 100.
   Write to gateway_scores.engagement_score (post-hoc field only).

9. ADMIN PANEL — AUDIENCE SECTION
   Detect via audience_sessions table. Add AUDIENCE to Smart Admin Dashboard
   sidebar between CONTENT ENGINE and QUALITY GATEWAY. Four tabs: Traffic Sources,
   Reader Segments, Content Engagement, Newsletter Audience.
   Add Audience pulse widget to homepage.

10. WEEKLY AUDIENCE DIGEST (Sundays 09:30 UTC via Resend to ALERT_EMAIL)
    Use existing RESEND_API_KEY and ALERT_EMAIL.
    Under 150 words: top traffic source + quality score, highest converting cohort,
    best engagement content type, newsletter growth, one decay flag if any.

11. DATABASE TABLES
    Create: audience_sessions, audience_events, audience_cohorts,
    audience_traffic_source_scores, audience_content_performance,
    audience_newsletter_segments, audience_res_adjustments,
    audience_content_baselines, audience_keyword_adjustments,
    audience_smart_suggestions_context.
    Extend: articles, pseo_pages, gateway_scores, newsletter_issues.

SUNDAY TIMING SEQUENCE:
   04:00 UTC — Audience segmentation
   04:30 UTC — Audience analysis
   05:00 UTC — Audience feed starts (MUST complete by 05:30 UTC)
   05:30 UTC — CRO Select + Measure (reads audience data)
   05:45 UTC — CRO Design
   06:00 UTC — Monetization Score layer (reads audience_res_adjustments)
   06:15 UTC — Monetization gap detection
   06:30 UTC — Monetization Optimize layer
   07:00 UTC — Quality Gateway Learn layer
   08:00 UTC — Newsletter send (reads audience segments)
   09:00 UTC — Monetization weekly summary
   09:30 UTC — Audience weekly digest

AFTER BUILDING: confirm session tracking script is injected into ALL page
templates (not just article template — also pSEO pages, homepage, category pages).
Confirm /api/audience-event is live. Confirm audience_res_adjustments will be
written before 06:00 UTC. List all tables created/extended.
```

---

## Section 11 — Setup — two questions

### Question 1 — Newsletter platform

| Answer | Select | What happens |
|---|---|---|
| Supabase (Content Engine default) | `supabase` | Segment assignments written directly to subscriber rows. Newsletter automation reads segments at send time. Fully automated segmented sends. |
| External platform (Mailchimp, ConvertKit, Beehiiv, etc.) | `external` | Segment assignments written to `audience_newsletter_segments` only. Export the segment list from admin panel and import to your platform manually. Automated segmented sends are not possible. |

### Question 2 — Minimum session threshold for analysis

| Traffic level | Select | Effect |
|---|---|---|
| Early stage (under 500 sessions/week) | `low` | Minimum cohort size reduced to 5 sessions. Traffic source quality scores calculated from minimum 10 sessions. More cohorts in `low_volume` group. Less precise but still useful. |
| Growing (500–5,000 sessions/week) | `medium` | Default thresholds as specified. |
| Established (5,000+ sessions/week) | `high` | Minimum cohort size raised to 25 sessions. More precise cohort boundaries. Sub-source analysis enabled (Google vs Bing vs DuckDuckGo as separate organic sources). |

---

## Section 12 — Troubleshooting

**The most common failure mode is the session tracking script not being injected into all page templates.** Check the build report specifically for confirmation the script was added to every template — article, pSEO pages, homepage, and category pages.

**No sessions in `audience_sessions`** — Check `/api/audience-event` edge function returns 200 in Supabase logs. Open browser DevTools on any page — look for POST requests to `/api/audience-event` in the Network tab. If requests fire but `audience_sessions` is empty, the hourly assembly job hasn't run yet — wait up to 1 hour. Verify tracking script is loaded on all page types.

**Sessions appearing but traffic source is all `direct`** — Check UTM parameter parsing reads from `window.location.search`. Verify newsletter Resend sends include `utm_source=newsletter` parameters in all links. Social posts need UTM parameters added manually.

**Cohorts not forming (all in `low_volume`)** — Check traffic level setting. Cohorts require 28 days of session data — the first Sunday run after 28 days produces proper cohorts. Check `audience_events` has scroll_depth and page_exit events, not just page_enter.

**`traffic_quality_multiplier` not affecting RES scores** — Check `audience_res_adjustments` has rows after 05:00 UTC Sunday. Check `system_health_log` for `audience_feed_complete` entry. If Monetization Engine was installed before the Audience Engine, its RES calculation may not have been updated to read this table. Run targeted follow-up prompt: "Update Monetization Engine RES calculation to read traffic_quality_multiplier from audience_res_adjustments table before calculating RES."

**Newsletter segments not used in sends** — Check `audience_newsletter_segments` has rows. Verify newsletter automation reads the segment table before assembling content. If using an external newsletter platform, automated segmented sends are not possible — export manually.

**Feed layer timing failures** — Check `system_health_log` for `audience_feed_complete` entries. If feed is not completing by 05:30 UTC, check Supabase cron job timing and ensure the segmentation (04:00) and analysis (04:30) jobs are completing on time. If early-stage site with very few sessions, all jobs will complete quickly.

---

## Environment variables — no new keys required

| Variable | Set by | Used for |
|---|---|---|
| `RESEND_API_KEY` | Content Engine | Weekly audience digest email |
| `ALERT_EMAIL` | Content Engine | Audience digest recipient |
| `SITE_ID` | Content Engine | Multi-site session attribution |
| `SUPABASE_URL` | Prior specs | All database operations |
| `SUPABASE_ANON_KEY` | Prior specs | All database operations |
| `GOOGLE_SEARCH_CONSOLE_TOKEN` | Optional (pSEO Engine) | Correlating GSC impressions with engagement data |
