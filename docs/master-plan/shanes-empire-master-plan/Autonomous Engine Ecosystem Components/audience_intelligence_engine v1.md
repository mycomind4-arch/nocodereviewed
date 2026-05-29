# AUTONOMOUS Audience & Traffic Intelligence Engine
## Reader Intelligence Spec v1.0 — Stupid People Edition
**Prepared May 2026 · Confidential**

> The rest of the stack knows what it publishes and what it earns.  
> This engine knows who is reading, where they came from, and why some of them buy.

| Attribute | Value |
|---|---|
| Version | 1.0 — Stupid People Edition |
| Prepared | May 2026 |
| Lovable credits | 2–3 |
| New API keys | 0 |
| New ongoing cost | $0/mo |
| Daily intervention | 0 |
| Pairs with | Content Engine v2.1, pSEO Engine v1.0, Quality Gateway v1.0, Smart Admin Dashboard v1.1, Monetization Engine v1.0 |
| Classification | Confidential |

---

## Contents

| Section | Title |
|---|---|
| 01 | What This Is |
| 02 | Architecture Overview |
| 03 | Layer 1 — Capture |
| 04 | Layer 2 — Segment |
| 05 | Layer 3 — Analyse |
| 06 | Layer 4 — Feed |
| 07 | Admin Panel Additions |
| 08 | Integration with Existing Specs |
| 09 | Database Schema |
| 10 | Activation Prompt |
| 11 | Setup — Two Questions |
| 12 | Troubleshooting |

---

## SECTION 01 — What This Is

The stack currently has a blind spot at the top of the funnel. It knows an article was published, that it passed the Quality Gateway, that it received some number of impressions from Google Search Console, and eventually that someone clicked an affiliate link. What it does not know is anything about the reader between arrival and conversion — or departure.

This means every decision about what to write, what to promote, and what to improve is made without knowing who the audience actually is. The Content Engine writes for a described persona in a site identity block. Whether that persona matches the real readers is unknown. The Monetization Engine scores pages by revenue efficiency but cannot explain why two pages with identical RES scores convert at different rates for different traffic sources.

This engine fills that gap. It builds a persistent, growing model of your actual audience — where they come from, what they engage with, which content drives them to convert, and which content loses them. It feeds those signals back into every other engine in the stack so decisions are made from real reader behaviour, not assumptions.

### What the other specs do not cover

- Connecting traffic source (organic search, newsletter, social, direct, referral) to downstream affiliate conversion
- Measuring content engagement beyond pageviews — scroll depth, time on page, return visits
- Identifying which reader segments exist and what content each segment engages with most
- Understanding why readers subscribe to the newsletter vs leave without subscribing
- Detecting when a traffic source's audience quality is declining before it shows up in revenue
- Providing the CRO Engine with the behavioural baseline it needs to run meaningful tests

> **INFO:** This engine does not use cookies or third-party tracking. All measurement is first-party, session-based, and privacy-safe. No GDPR consent banner is required for the data this engine collects, because it does not track individuals across sessions or sites.

---

## SECTION 02 — Architecture Overview

Four layers. One persistent audience model. Signals flowing to every other engine.

| Layer | Name | What it does | When it runs |
|---|---|---|---|
| 1 | Capture | Records session events: arrivals, scroll depth, time on page, clicks, exits. Lightweight client-side script, edge function storage. | Real-time, on every session |
| 2 | Segment | Groups sessions into behavioural cohorts based on traffic source, engagement pattern, and content type. Updates cohort assignments weekly. | Weekly, Sunday 04:00 UTC |
| 3 | Analyse | Calculates per-cohort conversion rates, content performance by segment, traffic source quality scores, and newsletter subscriber intent signals. | Weekly, Sunday 04:30 UTC |
| 4 | Feed | Writes audience intelligence signals back to other engines: content authority scores, keyword priority adjustments, newsletter segment lists, Smart Suggestions context. | Weekly, Sunday 05:00 UTC (before Monetization Engine Score layer at 06:00 UTC) |

### Output streams

| Stream | What it contains | Where it goes |
|---|---|---|
| Engine feeds | Cohort conversion rates, traffic source quality scores, content engagement signals | Monetization Engine RES calculation, Content Engine keyword priority, newsletter segmentation |
| Dashboard output | AUDIENCE section in Smart Admin Dashboard, reader profile cards, traffic source quality panel | `/admin` — detected and activated automatically |
| Weekly digest | Audience health summary: top cohort, best-performing traffic source, highest-converting content type, newsletter growth rate | `ALERT_EMAIL` via existing Resend integration, Sunday 09:30 UTC |

> **INFO:** The Audience Engine runs before the Monetization Engine's Score layer (Sunday 04:00–05:00 UTC vs 06:00 UTC). This ordering is intentional — audience signals are available to RES calculations on the same Sunday they are computed.

---

## SECTION 03 — Layer 1 — Capture

### Session tracking script

A lightweight JavaScript snippet (under 3KB, no external dependencies) is injected into every page on the site. It fires on page load and records events as the reader interacts with the page. All data is sent to a single edge function endpoint and stored in `audience_sessions` and `audience_events`.

No personally identifiable information is collected. Sessions are identified by an anonymous session token (random UUID stored in sessionStorage — cleared when the browser tab closes, not a persistent cookie).

### Events captured

| Event | When it fires | Data stored |
|---|---|---|
| `page_enter` | On page load | session_id, page_url, page_type, referrer_url, utm_source, utm_medium, utm_campaign, utm_content, device_type, viewport_width, timestamp |
| `scroll_depth` | At 25%, 50%, 75%, 100% scroll milestones | session_id, page_url, depth_pct, time_to_depth_seconds |
| `time_on_page` | Every 30 seconds while page is visible (Page Visibility API) | session_id, page_url, seconds_active |
| `affiliate_click` | On affiliate link click (joins with `monetization_clicks`) | session_id, affiliate_link_id, tool_slug, click_position, page_url |
| `newsletter_signup` | On newsletter form submission | session_id, page_url, signup_source (inline / exit_intent / sidebar) |
| `internal_link` | On click of any internal link | session_id, from_url, to_url, link_text |
| `page_exit` | On page unload or visibility change to hidden | session_id, page_url, total_seconds_active, max_scroll_depth, did_click_affiliate (boolean), did_signup (boolean) |

### Traffic source classification

Every session is classified into one of six traffic sources based on referrer and UTM parameters:

| Source | Classification logic |
|---|---|
| `organic_search` | Referrer matches Google, Bing, DuckDuckGo, etc. OR no UTM and no referrer (direct with likely search origin for new visitors) |
| `newsletter` | UTM source = newsletter OR referrer matches your Resend send domain |
| `social` | Referrer matches Twitter/X, LinkedIn, Facebook, Reddit, etc. OR utm_medium = social |
| `referral` | Referrer is an external domain not matching search engines or social platforms |
| `network` | Referrer matches any domain in `network_domains` (cross-site internal traffic) |
| `direct` | No referrer, no UTM, returning visitor session token seen before |

### Session assembly

Raw events are assembled into complete session records every hour by a background job. A session is considered complete when a `page_exit` event is received or when no new events have been recorded for 30 minutes.

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| session_token | text | Anonymous session identifier |
| traffic_source | text | One of six source classifications |
| utm_source | text | Raw UTM source if present |
| utm_campaign | text | Raw UTM campaign if present |
| entry_page_url | text | First page of session |
| entry_page_type | text | `article` / `pseo_page` / `homepage` / `tools_page` / `other` |
| entry_article_id | uuid | FK to articles if entry page is an article |
| entry_pseo_page_id | uuid | FK to pseo_pages if entry page is a pSEO page |
| pages_viewed | integer | Total pages in session |
| total_seconds_active | integer | Sum of active time across all pages |
| max_scroll_depth_pct | integer | Highest scroll milestone reached on any page |
| did_click_affiliate | boolean | Whether session included an affiliate click |
| affiliate_tool_slug | text | Which tool was clicked (first click if multiple) |
| did_signup_newsletter | boolean | Whether session ended with a newsletter signup |
| device_type | text | `desktop` / `mobile` / `tablet` |
| started_at | timestamp | |
| completed_at | timestamp | |
| site_id | text | |

---

## SECTION 04 — Layer 2 — Segment

Runs weekly, Sundays at 04:00 UTC. Assigns every session from the past 28 days to a behavioural cohort.

### Cohort model

Sessions are grouped along three dimensions. The intersection of these dimensions defines a cohort.

**Dimension 1 — Traffic source** (six values: organic_search, newsletter, social, referral, network, direct)

**Dimension 2 — Engagement tier**

| Tier | Criteria |
|---|---|
| `deep` | max_scroll_depth_pct ≥ 75 AND total_seconds_active ≥ 90 |
| `engaged` | max_scroll_depth_pct ≥ 50 AND total_seconds_active ≥ 45 |
| `shallow` | max_scroll_depth_pct < 50 OR total_seconds_active < 45 |
| `bounce` | pages_viewed = 1 AND total_seconds_active < 15 |

**Dimension 3 — Content affinity** (assigned from entry page and internal navigation pattern)

| Affinity | Criteria |
|---|---|
| `tool_evaluator` | Entry on tool_review or comparison page, OR navigated to 2+ tool pages in session |
| `researcher` | Entry on tutorial or best_of_list page, majority of session on informational content |
| `price_checker` | Entry on pricing pSEO page, OR navigated to pricing page during session |
| `category_browser` | Entry on category_best pSEO page, majority of session on category/list pages |
| `return_reader` | Session token seen in previous week's sessions (returning visitor) |

### Cohort assignment

The combination of these three dimensions produces up to 120 distinct cohorts, though in practice most sites will have 15–25 active cohorts with meaningful session counts. Cohorts with fewer than 10 sessions in the past 28 days are merged into a `low_volume` cohort for that source/tier combination.

Cohort records are stored in `audience_cohorts` and updated weekly. Individual session-to-cohort assignments are stored in `audience_session_cohorts`.

---

## SECTION 05 — Layer 3 — Analyse

Runs weekly, Sundays at 04:30 UTC, after segmentation completes.

### Traffic source quality score

Every traffic source receives a quality score (0–100) based on the behavioural profile of sessions from that source. This score is the primary signal the Feed layer uses to influence other engines.

| Dimension | Weight | What is measured |
|---|---|---|
| Engagement rate | 30 pts | % of sessions reaching `engaged` or `deep` tier. Benchmark: 35% for organic search. |
| Conversion rate | 35 pts | % of sessions with `did_click_affiliate = true`. Benchmarked against site average. |
| Scroll completion | 15 pts | Average `max_scroll_depth_pct` for sessions from this source. |
| Return rate | 20 pts | % of sessions from this source where `return_reader` affinity is true. |

**Total: 100 points.** Scores update weekly. Score history is retained for trend analysis.

| Quality score | Classification | Meaning |
|---|---|---|
| 0–25 | Low quality | Sessions from this source leave quickly and don't convert. Deprioritise in marketing spend. |
| 26–50 | Below average | Some engagement but weak conversion. Content or landing experience may not match audience expectation. |
| 51–75 | Healthy | Above-average engagement and conversion. Worth growing. |
| 76–100 | High quality | Your best traffic source. Content resonates, converts, and returns. Prioritise heavily. |

### Content performance by cohort

For each active cohort with 10+ sessions, the analysis layer calculates:

- **Cohort conversion rate:** % of sessions in this cohort that clicked an affiliate link
- **Best-performing content:** Articles and pSEO pages with the highest conversion rate for this cohort (minimum 20 sessions on the page)
- **Worst-performing content:** Pages with high session counts from this cohort but zero conversions
- **Average engagement score:** Mean of (scroll_depth × 0.5 + time_on_page_normalised × 0.5) for the cohort

These are stored in `audience_content_performance` and surfaced in the admin panel AUDIENCE section.

### Newsletter subscriber intent signals

Every newsletter signup session is analysed for intent signals that can be used for segmentation:

| Signal | How it's detected | Segment assigned |
|---|---|---|
| `high_intent_buyer` | Signed up after viewing a comparison or pricing page | Monetization-focused emails |
| `researcher` | Signed up after viewing a tutorial or best_of_list page | Educational content emails |
| `tool_evaluator` | Signed up after viewing a tool_review page | Tool-specific emails |
| `unknown` | Signed up from homepage or no clear content pattern | Default newsletter list |

Signals are written to `audience_newsletter_segments` and are readable by the newsletter automation system.

### Engagement decay detection

The analysis layer compares each content item's engagement metrics this week against its 8-week rolling average. Items showing significant decay are flagged:

| Decay type | Condition | Action |
|---|---|---|
| Engagement decay | Average scroll depth dropped > 20 percentile points vs 8-week average | Flag in admin panel. Candidate for Content Refresh Agent. |
| Conversion decay | Conversion rate dropped > 40% vs 8-week average | Flag for Monetization Engine offer audit + Content Refresh. |
| Traffic source shift | Primary traffic source changed (e.g. was mostly organic, now mostly social) | Flag in admin panel — audience profile for this page has changed. |

---

## SECTION 06 — Layer 4 — Feed

Runs weekly, Sundays at 05:00 UTC. Writes audience intelligence signals into other engines so they make decisions from real reader data.

### Feed 1 — Monetization Engine RES adjustment

The Monetization Engine's RES formula uses `clicks_per_1000_visitors` as its traffic input. The Feed layer extends this with a `traffic_quality_multiplier` that weights clicks from high-quality sources more heavily than clicks from low-quality sources.

```
adjusted_clicks_per_1000 = clicks_per_1000 × traffic_quality_multiplier

traffic_quality_multiplier = (traffic_source_quality_score / 50)
  where 50 = baseline (quality score of 50 = no adjustment)
  quality score 75 = 1.5x multiplier
  quality score 25 = 0.5x multiplier
```

This field is written to `audience_res_adjustments` and read by the Monetization Engine's Score layer during Sunday 06:00 UTC calculations. A page with identical raw click rates but driven by high-quality newsletter traffic will score higher than one driven by low-quality social traffic that bounces without engaging.

### Feed 2 — Content Engine keyword priority

The Feed layer reads the content performance analysis and adjusts keyword priorities in `keyword_queue` based on which content types are converting best for the current audience:

| Signal | Keyword queue adjustment |
|---|---|
| `tool_evaluator` cohort is highest-converting | Boost priority of pending `tool_review` and `comparison` keywords by +10 |
| `researcher` cohort has highest engagement but low conversion | Add note to `best_of_list` and `tutorial` keywords: "researcher audience — consider stronger CTA structure" |
| Content affinity for specific tool category is high | Surface any pending keywords in that tool category to priority 70+ |
| A specific article's engagement decay is detected | Add that article's keyword to queue at priority 75 with `status = refresh_candidate` |

Priority adjustments are logged to `audience_keyword_adjustments` with the reason. Adjustments are additive — they do not overwrite existing priority values, they increment or decrement them.

### Feed 3 — Newsletter segmentation

The newsletter automation in the Content Engine currently sends one email to all subscribers. The Feed layer writes segment assignments to `audience_newsletter_segments`, enabling conditional content blocks in the newsletter:

- Subscribers in `high_intent_buyer` segment receive the sponsor slot or highest-RES tool CTA
- Subscribers in `researcher` segment receive the tutorial or best_of_list article as the lead item
- Subscribers in `tool_evaluator` segment receive the most recent tool review as the lead item
- `unknown` segment receives the default newsletter (highest quality score article)

This does not require a new email service. The existing Resend integration sends one email per segment using the same template with swapped content blocks. Segment counts are logged to `newsletter_issues` alongside existing send stats.

### Feed 4 — Smart Suggestions context

The Feed layer appends a weekly audience summary to the Smart Suggestions Gemini call context:

```
Audience intelligence (past 7 days):
- Highest quality traffic source: [source] (quality score: [X])
- Lowest quality traffic source: [source] (quality score: [X])
- Highest converting cohort: [cohort description] ([X]% conversion rate)
- Content type with highest engagement this week: [type]
- Pages with engagement decay this week: [count] ([list top 3 by traffic])
- Newsletter segment breakdown: [X]% high_intent_buyer, [X]% researcher, [X]% tool_evaluator
Include one audience-specific recommendation in your output.
```

### Feed 5 — CRO Engine baseline

The Feed layer writes a weekly content baseline snapshot to `audience_content_baselines` — one row per article and pSEO page with current engagement metrics. The CRO Engine reads these baselines as its control group when running A/B tests. Without this feed, the CRO Engine has no stable baseline to test against.

---

## SECTION 07 — Admin Panel Additions

The Smart Admin Dashboard gains an **AUDIENCE** section in the sidebar navigation. It appears automatically when `audience_sessions` table is detected. Placement: between CONTENT ENGINE and QUALITY GATEWAY.

One new widget is added to the dashboard homepage:

- **Audience pulse:** This week's session count, conversion rate, and top traffic source quality score. Click to go to the Traffic Sources tab.

### Four tabs in the AUDIENCE section

| Tab | What it contains |
|---|---|
| Traffic Sources | Quality score for each active traffic source. 8-week trend chart per source. Session count, engagement rate, conversion rate, return rate broken out per source. "Best traffic source" callout card at top. |
| Reader Segments | All active cohorts with session counts. Conversion rate per cohort. Best and worst performing content per cohort. Cohort trend: is this segment growing or shrinking week-over-week? |
| Content Engagement | All articles and pSEO pages with engagement metrics: avg scroll depth, avg time on page, conversion rate, return visit rate. Filter by content type, date range, traffic source. Decay flags shown in amber. |
| Newsletter Audience | Subscriber segment breakdown. Growth rate by segment. Which pages are generating the most signups. Signup source breakdown (inline / exit_intent / sidebar). 8-week subscriber growth chart. |

---

## SECTION 08 — Integration with Existing Specs

### Content Engine v2.1 — 3 integration points

| Integration | What it does |
|---|---|
| Keyword priority adjustments | The Feed layer increments or decrements `keyword_queue.priority` based on which content types are converting best. Adjustments are logged with reason. The Content Engine reads priority at generation time — no change to generation logic required. |
| Newsletter segmentation | The Feed layer writes segment assignments to `audience_newsletter_segments`. The newsletter automation reads this table when assembling the weekly send and swaps content blocks per segment. The send still happens via existing Resend integration — only the content selection logic changes. |
| Refresh candidate flagging | Pages with detected engagement decay are written to `keyword_queue` with `status = refresh_candidate` and `added_by = 'audience_engine'`. The Content Refresh Agent already reads this queue — no logic change required. |

### Programmatic SEO Engine v1.0 — 2 integration points

| Integration | What it does |
|---|---|
| pSEO page engagement tracking | The session tracking script fires `page_enter`, `scroll_depth`, and `page_exit` events on pSEO pages identically to Content Engine articles. `entry_pseo_page_id` is populated from the URL pattern. pSEO page engagement metrics appear in the Content Engagement tab alongside article metrics. |
| pSEO impression to engagement correlation | The analysis layer correlates GSC impression data (already in `pseo_pages.search_impressions`) with actual session engagement. A pSEO page with high impressions but low engagement scores signals a title/meta mismatch — the page is ranking but disappointing readers. These are flagged separately from standard engagement decay. |

### Quality Gateway v1.0 — 1 integration point

| Integration | What it does |
|---|---|
| Post-publish performance feedback | The analysis layer reads engagement data for articles published in the past 30 days and writes an `engagement_score` (0–100) to `gateway_scores` as a post-hoc field. This is not used for pass/fail decisions — it is used by the Quality Gateway's Learn layer as a performance signal when adjusting dimension weights. Articles that pass the gateway but have poor engagement scores provide a signal that current weights may be over-optimising for the wrong dimensions. |

### Monetization Engine v1.0 — 2 integration points

| Integration | What it does |
|---|---|
| Traffic quality multiplier | The Feed layer writes `traffic_quality_multiplier` per page to `audience_res_adjustments`. The Monetization Engine reads this during Sunday 06:00 UTC RES calculations, after the Audience Engine's Feed layer (05:00 UTC) has completed. No change to the RES formula structure — the multiplier is applied to `clicks_per_1000_visitors` before the formula runs. |
| Cohort conversion data | The analysis layer writes per-page cohort conversion rates to `audience_content_performance`. The Monetization Engine reads the highest-converting cohort for each page and includes it in the weekly summary email: "This page converts best with [cohort description] readers." |

### Smart Admin Dashboard v1.1 — 2 integration points

| Integration | What it does |
|---|---|
| AUDIENCE sidebar section | Detection engine scans for `audience_sessions` table on login. If found, activates AUDIENCE section in sidebar between CONTENT ENGINE and QUALITY GATEWAY. |
| Smart Suggestions extension | Feed layer appends audience summary to the daily Gemini Smart Suggestions context. Appended after existing gateway health and monetization context — does not replace either. Only injected if `audience_sessions` has data from the past 7 days. |

### CRO Engine v1.0 — 1 integration point

| Integration | What it does |
|---|---|
| Engagement baselines | The Feed layer writes weekly content baselines to `audience_content_baselines`. The CRO Engine reads these as its control group measurements. Without this feed, the CRO Engine has no stable pre-test baseline to calculate lift against. This feed must be running for at least 2 weeks before the CRO Engine can run a meaningful test on any page. |

---

## SECTION 09 — Database Schema

### New tables

#### audience_sessions

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| session_token | text | Anonymous session identifier (not stored beyond session) |
| traffic_source | text | `organic_search` / `newsletter` / `social` / `referral` / `network` / `direct` |
| utm_source | text | Raw UTM source |
| utm_medium | text | Raw UTM medium |
| utm_campaign | text | Raw UTM campaign |
| entry_page_url | text | First page of session |
| entry_page_type | text | `article` / `pseo_page` / `homepage` / `other` |
| entry_article_id | uuid | FK to articles |
| entry_pseo_page_id | uuid | FK to pseo_pages |
| pages_viewed | integer | |
| total_seconds_active | integer | |
| max_scroll_depth_pct | integer | 0–100 |
| did_click_affiliate | boolean | |
| affiliate_tool_slug | text | First affiliate click in session |
| did_signup_newsletter | boolean | |
| device_type | text | `desktop` / `mobile` / `tablet` |
| started_at | timestamp | |
| completed_at | timestamp | |
| site_id | text | |

#### audience_events

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| session_id | uuid | FK to audience_sessions |
| event_type | text | `page_enter` / `scroll_depth` / `time_on_page` / `affiliate_click` / `newsletter_signup` / `internal_link` / `page_exit` |
| page_url | text | |
| event_data | jsonb | Event-specific fields (depth_pct, seconds_active, to_url, etc.) |
| fired_at | timestamp | |
| site_id | text | |

#### audience_cohorts

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| cohort_key | text | Composite key: `[traffic_source]_[engagement_tier]_[content_affinity]` |
| traffic_source | text | |
| engagement_tier | text | `deep` / `engaged` / `shallow` / `bounce` |
| content_affinity | text | `tool_evaluator` / `researcher` / `price_checker` / `category_browser` / `return_reader` |
| session_count_28d | integer | Sessions in past 28 days |
| conversion_rate | decimal | Affiliate click rate for this cohort |
| avg_scroll_depth | decimal | |
| avg_time_on_page | decimal | Seconds |
| return_rate | decimal | |
| week_start | date | Week this snapshot covers |
| site_id | text | |

#### audience_traffic_source_scores

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| traffic_source | text | |
| quality_score | integer | 0–100 |
| engagement_rate | decimal | |
| conversion_rate | decimal | |
| scroll_completion_avg | decimal | |
| return_rate | decimal | |
| session_count_28d | integer | |
| scored_at | date | Sunday of calculation |
| site_id | text | |

#### audience_content_performance

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| source_id | uuid | FK to articles or pseo_pages |
| source_type | text | `article` / `pseo_page` |
| cohort_key | text | FK to audience_cohorts.cohort_key |
| session_count | integer | Sessions on this page from this cohort |
| conversion_rate | decimal | |
| avg_scroll_depth | decimal | |
| avg_time_on_page | decimal | |
| engagement_decay_flag | boolean | True if decay detected this week |
| decay_type | text | `engagement` / `conversion` / `traffic_source_shift` / null |
| week_start | date | |
| site_id | text | |

#### audience_newsletter_segments

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| subscriber_email_hash | text | SHA-256 hash of email — for matching without storing PII |
| segment | text | `high_intent_buyer` / `researcher` / `tool_evaluator` / `unknown` |
| signup_page_url | text | Page where they signed up |
| signup_source | text | `inline` / `exit_intent` / `sidebar` |
| assigned_at | timestamp | |
| last_updated | timestamp | |
| site_id | text | |

#### audience_res_adjustments

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| source_id | uuid | FK to articles or pseo_pages |
| source_type | text | `article` / `pseo_page` |
| primary_traffic_source | text | Dominant traffic source for this page (past 28 days) |
| traffic_quality_multiplier | decimal | Applied to clicks_per_1000 in RES calculation |
| traffic_source_quality_score | integer | Score of primary source at calculation time |
| calculated_at | date | |
| site_id | text | |

#### audience_content_baselines

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| source_id | uuid | FK to articles or pseo_pages |
| source_type | text | |
| avg_scroll_depth | decimal | 4-week rolling average |
| avg_time_on_page | decimal | 4-week rolling average |
| conversion_rate | decimal | 4-week rolling average |
| session_count_28d | integer | |
| baseline_date | date | Sunday of calculation |
| site_id | text | |

#### audience_keyword_adjustments

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| keyword_id | uuid | FK to keyword_queue |
| adjustment_amount | integer | Positive or negative integer added to priority |
| reason | text | Human-readable explanation |
| signal_source | text | `cohort_conversion` / `engagement_decay` / `content_affinity` |
| applied_at | timestamp | |

### Extended tables (existing — columns added only)

| Table | Columns added |
|---|---|
| articles | `avg_scroll_depth` (decimal), `avg_time_on_page` (decimal), `audience_conversion_rate` (decimal), `primary_traffic_source` (text), `engagement_decay_flag` (boolean) |
| pseo_pages | Same five columns as articles |
| gateway_scores | `engagement_score` (integer 0–100) — post-hoc field written by Audience Engine after 30 days of publish data |
| newsletter_issues | `segment_counts` (jsonb) — breakdown of how many subscribers received each content variant |

---

## SECTION 10 — Activation Prompt

Paste this entire block into your Lovable project after the Content Engine, pSEO Engine, Monetization Engine, and Smart Admin Dashboard are installed.

> **IMPORTANT:** This prompt uses approximately 2–3 Lovable credits. It detects your existing installation and extends it. It will not overwrite any existing tables, routes, or components. The session tracking script requires a frontend code change — confirm in the build report that it was injected into all page templates.

---

```
Build and activate the Autonomous Audience & Traffic Intelligence Engine v1.0
for this Lovable project.

Before building anything, audit for: (1) articles table, (2) pseo_pages table,
(3) keyword_queue table, (4) monetization_clicks table (Monetization Engine),
(5) monetization_res_scores table (Monetization Engine),
(6) gateway_scores table (Quality Gateway), (7) network_reports table,
(8) existing /admin route, (9) newsletter_issues table.

For each found: extend with new columns only. Do not overwrite existing data.
For each missing: build foundational version.

1. SESSION TRACKING SCRIPT
   Create a JavaScript module (under 3KB, zero external dependencies) that:
   - Fires page_enter event on load: captures page_url, page_type (detect from
     URL pattern: /compare/ /alternatives/ /best/ /pricing/ /features/ = pseo_page,
     /blog/ = article, / = homepage), referrer, UTM params from URL, device_type,
     viewport_width.
   - Fires scroll_depth events at 25%, 50%, 75%, 100% using IntersectionObserver
     on a sentinel element at each quartile of page body height.
   - Fires time_on_page every 30 seconds while document.visibilityState = 'visible'.
   - Fires affiliate_click when any link with data-affiliate="true" is clicked.
     Add data-affiliate="true" to all affiliate CTA elements site-wide.
   - Fires newsletter_signup on newsletter form submit success.
   - Fires internal_link on click of any <a> tag pointing to same domain.
   - Fires page_exit on visibilitychange to 'hidden' or beforeunload.
   - Uses anonymous session token: crypto.randomUUID() stored in sessionStorage.
   - All events POST to /api/audience-event (non-blocking, fire-and-forget).
   Inject this script into every page template in the project.

2. EVENT INGESTION EDGE FUNCTION
   Create edge function at /api/audience-event accepting:
   session_token, event_type, page_url, event_data (jsonb).
   Write to audience_events. Non-blocking — return 200 immediately.
   Rate limit: max 60 events per session_token per minute (prevent loops).

3. SESSION ASSEMBLY JOB (runs hourly)
   Query audience_events for session_tokens with page_exit received OR
   last event > 30 minutes ago. Assemble into audience_sessions record:
   - Classify traffic_source from referrer and UTM params per spec rules.
   - Set entry_article_id or entry_pseo_page_id from entry_page_url.
   - Calculate pages_viewed, total_seconds_active, max_scroll_depth_pct.
   - Set did_click_affiliate and affiliate_tool_slug from affiliate_click events.
   - Set did_signup_newsletter from newsletter_signup events.
   Mark assembled session_tokens as processed. Do not re-assemble.

4. TRAFFIC SOURCE CLASSIFICATION
   Classify traffic_source from referrer and UTM:
   - Referrer matches search engine domains: organic_search
   - UTM source = 'newsletter' OR referrer matches resend send domain: newsletter
   - Referrer matches social platforms (twitter.com, x.com, linkedin.com,
     facebook.com, reddit.com, instagram.com): social
   - Referrer matches any domain in network_domains table: network
   - Referrer is external non-search non-social: referral
   - No referrer, no UTM, returning session_token pattern: direct

5. WEEKLY SEGMENTATION (Sundays 04:00 UTC)
   For all sessions in past 28 days, assign engagement_tier:
   - deep: max_scroll_depth_pct >= 75 AND total_seconds_active >= 90
   - engaged: max_scroll_depth_pct >= 50 AND total_seconds_active >= 45
   - shallow: max_scroll_depth_pct < 50 OR total_seconds_active < 45
   - bounce: pages_viewed = 1 AND total_seconds_active < 15
   Assign content_affinity from entry_page_type and internal_link events:
   - tool_evaluator: entry on tool_review/comparison/pseo tool_vs_tool OR
     navigated to 2+ tool pages
   - researcher: entry on tutorial/best_of_list/category_best AND majority of
     internal links to informational content
   - price_checker: entry on pricing pseo_page OR navigated to pricing page
   - category_browser: entry on category_best AND majority of links to category
   - return_reader: session_token appears in previous week's assembled sessions
   Build cohort_key = traffic_source + '_' + engagement_tier + '_' + content_affinity.
   Write to audience_cohorts. Merge cohorts with < 10 sessions into low_volume.

6. WEEKLY ANALYSIS (Sundays 04:30 UTC)
   A. TRAFFIC SOURCE QUALITY SCORES
      For each traffic_source with >= 20 sessions in past 28 days:
      engagement_rate = % sessions with engagement_tier in (deep, engaged)
      conversion_rate = % sessions with did_click_affiliate = true
      scroll_completion_avg = avg(max_scroll_depth_pct)
      return_rate = % sessions with content_affinity = return_reader
      quality_score = (engagement_rate * 30) + (conversion_rate_normalised * 35) +
                      (scroll_completion_avg / 100 * 15) + (return_rate * 20)
      Write to audience_traffic_source_scores.

   B. CONTENT PERFORMANCE BY COHORT
      For each article and pseo_page with >= 20 sessions in past 28 days,
      per cohort: calculate conversion_rate, avg_scroll_depth, avg_time_on_page.
      Compare to 8-week rolling average. Flag engagement_decay_flag = true if
      avg_scroll_depth dropped > 20 pct points OR conversion_rate dropped > 40%.
      Write to audience_content_performance.
      Update articles.avg_scroll_depth, articles.avg_time_on_page,
      articles.audience_conversion_rate, articles.primary_traffic_source.

   C. NEWSLETTER SUBSCRIBER INTENT
      For each newsletter_signup event in past 28 days, classify segment:
      - Signed up after viewing comparison/pricing/tool_review: high_intent_buyer
      - Signed up after viewing tutorial/best_of_list: researcher
      - Signed up after viewing tool_review: tool_evaluator
      - Otherwise: unknown
      Write/update audience_newsletter_segments by subscriber_email_hash.

   D. ENGAGEMENT DECAY
      Flag articles and pseo_pages where engagement metrics dropped significantly
      vs 8-week rolling average. Write decay_type to audience_content_performance.

7. WEEKLY FEED (Sundays 05:00 UTC — before Monetization Engine Score at 06:00 UTC)
   A. MONETIZATION ENGINE FEED
      For each article/pseo_page, read primary_traffic_source and its quality_score.
      traffic_quality_multiplier = quality_score / 50 (50 = neutral, no adjustment).
      Write to audience_res_adjustments. Monetization Engine reads this table
      during RES calculation — do not write directly to monetization_res_scores.

   B. CONTENT ENGINE KEYWORD PRIORITY FEED
      Read cohort with highest conversion_rate this week.
      If content_affinity = tool_evaluator: boost pending tool_review and comparison
      keywords by +10 in keyword_queue. Log to audience_keyword_adjustments.
      For pages with engagement_decay_flag = true: add keyword to keyword_queue
      with status = refresh_candidate, added_by = 'audience_engine', priority 75.

   C. NEWSLETTER SEGMENTATION FEED
      Ensure audience_newsletter_segments is populated and current.
      Newsletter automation reads this table — no direct change to Resend calls.
      Update newsletter_issues.segment_counts after each weekly send.

   D. CONTENT BASELINES FEED
      For each article and pseo_page with >= 10 sessions, calculate 4-week rolling
      averages for scroll_depth, time_on_page, conversion_rate.
      Write to audience_content_baselines. CRO Engine reads this table.

   E. SMART SUGGESTIONS CONTEXT FEED
      Write weekly audience summary JSON to audience_smart_suggestions_context:
      top traffic source and score, lowest quality source, highest converting cohort,
      top content type by engagement, decay page count and top 3 pages,
      newsletter segment breakdown. Smart Suggestions reads this table — do not
      modify the Smart Suggestions call itself.

8. POST-PUBLISH GATEWAY FEEDBACK (runs monthly, first Sunday)
   For all articles published 30–60 days ago with gateway_scores records:
   Calculate engagement_score = (avg_scroll_depth * 0.4 + 
     time_on_page_normalised * 0.3 + audience_conversion_rate_normalised * 0.3) * 100.
   Write to gateway_scores.engagement_score (post-hoc field only).
   Quality Gateway Learn layer reads this field — do not trigger Learn layer directly.

9. ADMIN PANEL — AUDIENCE SECTION
   Detect via presence of audience_sessions table at dashboard login.
   Add AUDIENCE to Smart Admin Dashboard sidebar between CONTENT ENGINE
   and QUALITY GATEWAY.
   Four tabs: Traffic Sources, Reader Segments, Content Engagement,
   Newsletter Audience (see spec Section 07).
   Add to homepage: Audience pulse widget (session count + conversion rate +
   top traffic source quality score).

10. WEEKLY AUDIENCE DIGEST EMAIL (Sundays 09:30 UTC via Resend to ALERT_EMAIL)
    After Monetization Engine weekly summary (09:00 UTC).
    Use existing RESEND_API_KEY and ALERT_EMAIL — do not create new variables.
    Subject: "[Site name] Audience Brief — [date]"
    Under 150 words: top traffic source this week + quality score,
    highest converting cohort, content type with best engagement,
    newsletter growth (new subscribers this week), one decay flag if any.

11. DATABASE TABLES
    Create: audience_sessions, audience_events, audience_cohorts,
    audience_traffic_source_scores, audience_content_performance,
    audience_newsletter_segments, audience_res_adjustments,
    audience_content_baselines, audience_keyword_adjustments,
    audience_smart_suggestions_context.
    Extend: articles, pseo_pages, gateway_scores, newsletter_issues.

SUNDAY TIMING SEQUENCE (this engine's place in the full stack):
   04:00 UTC — Audience segmentation
   04:30 UTC — Audience analysis
   05:00 UTC — Audience feed (writes multipliers for Monetization Engine)
   06:00 UTC — Monetization Engine Score layer (reads audience multipliers)
   06:15 UTC — Monetization gap detection
   06:30 UTC — Monetization Optimize layer
   07:00 UTC — Quality Gateway Learn layer
   08:00 UTC — Newsletter send (reads audience segments)
   09:00 UTC — Monetization weekly summary
   09:30 UTC — Audience weekly digest

AFTER BUILDING: confirm session tracking script is injected into all page
templates. Confirm /api/audience-event edge function is live. Confirm
audience_sessions is receiving data. List all tables created/extended.
Confirm traffic_quality_multiplier is written before Monetization Engine
Sunday schedule begins.
```

---

## SECTION 11 — Setup — Two Questions

### Question 1 — Newsletter platform

Is your newsletter list stored in Supabase (via the Content Engine's subscriber table) or in an external platform?

| Answer | Select | What happens |
|---|---|---|
| Supabase (Content Engine default) | `supabase` | Segment assignments are written directly to subscriber rows. Newsletter automation reads segments at send time. |
| External platform (Mailchimp, ConvertKit, Beehiiv, etc.) | `external` | Segment assignments are written to `audience_newsletter_segments` only. You export the segment list from the admin panel and import to your platform manually. Automated segmented sends are not possible without the Supabase-native setup. |

> **INFO:** If you are using an external newsletter platform, the audience segmentation data is still collected and visible in the admin panel. You just won't get automated segmented sends — you'll need to export the list periodically. Consider migrating to the Supabase-native newsletter setup to unlock full automation.

### Question 2 — Minimum session threshold for analysis

How much traffic does your site currently receive? This sets the minimum session count for cohort formation and content performance analysis.

| Traffic level | Select | Effect |
|---|---|---|
| Early stage (under 500 sessions/week) | `low` | Minimum cohort size reduced to 5 sessions. Traffic source quality scores calculated with a minimum of 10 sessions. More cohorts will be in the `low_volume` merged group. Analysis is less precise but still useful. |
| Growing (500–5,000 sessions/week) | `medium` | Default thresholds as specified. Most analysis features active. |
| Established (5,000+ sessions/week) | `high` | Minimum cohort size raised to 25 sessions. More precise cohort boundaries. Sub-source analysis enabled (e.g. Google vs Bing vs DuckDuckGo as separate organic sources). |

---

## SECTION 12 — Troubleshooting

> **IMPORTANT:** The most common failure mode is the session tracking script not being injected into all page templates. Check the build report specifically for confirmation that the script was added to every template, not just the article template.

### No sessions appearing in audience_sessions

- Check `/api/audience-event` edge function exists and is returning 200 in Supabase logs
- Open browser DevTools on any page — look for POST requests to `/api/audience-event` in the Network tab
- If requests are firing but `audience_sessions` is empty, the session assembly hourly job may not have run yet — wait up to 1 hour after first events appear in `audience_events`
- Verify the tracking script is loaded on all page types: article, pSEO pages, homepage. Check the build report for which templates it was added to

### Sessions appearing but traffic source is all `direct`

- Check that UTM parameter parsing is reading from `window.location.search`, not from the referrer
- Verify the newsletter sends from Resend include `utm_source=newsletter` parameters in all links — add these to your Resend template if missing
- Social posts need UTM parameters added manually — sessions from social without UTMs will be classified incorrectly

### Cohorts not forming (all sessions in `low_volume`)

- Check your traffic level setting — if site is early-stage, set Question 2 to `low`
- Cohorts require 28 days of session data before meaningful formation — the first Sunday segmentation run after 28 days will produce proper cohorts
- Check `audience_events` has scroll_depth and page_exit events — if only page_enter events are recording, the scroll/exit tracking is not firing

### traffic_quality_multiplier not affecting RES scores

- Check `audience_res_adjustments` has rows for Sunday after 05:00 UTC
- Verify the Monetization Engine activation prompt build report confirmed it reads `audience_res_adjustments` — if the Monetization Engine was installed before the Audience Engine, its RES calculation may not have been updated to read this table. Run a targeted follow-up prompt: "Update Monetization Engine RES calculation to read traffic_quality_multiplier from audience_res_adjustments table before calculating RES. Multiply clicks_per_1000 by this value where a record exists for the source_id."

### Newsletter segments not being used in sends

- Check `audience_newsletter_segments` has rows — if no newsletter signups have occurred, the table is empty and the newsletter falls back to default send
- Verify the newsletter automation reads the segment table before assembling content — check the build report confirms this logic was added
- If using an external newsletter platform (Question 1 = `external`), automated segmented sends are not possible — export the segment list from the admin panel manually

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

---

## No new API keys. No new monthly costs.

Drop this into any Lovable project running the Content Engine and Monetization Engine. Answer two questions. Paste one prompt. Walk away.

---

*Autonomous Audience & Traffic Intelligence Engine — Reader Intelligence Spec v1.0 · Stupid People Edition · May 2026*
