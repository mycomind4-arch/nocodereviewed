# Autonomous Monetization Engine
## Revenue Intelligence Spec v1.1 — Personal Stack Edition
**Prepared May 2026 · Confidential**

| Attribute | Value |
|---|---|
| Version | 1.1 |
| Prepared | May 2026 |
| Pairs with | Content Engine v2.1, pSEO Engine v1.1, Quality Gateway v1.1, Smart Admin Dashboard v1.2, LLM Abstraction Layer v1.0 |
| New API keys | 0 |
| New ongoing cost | $0/mo |
| Default LLM | No independent LLM calls — piggybacks on existing Smart Suggestions call only |

---

## What changed in v1.1

| Change | What it fixes |
|---|---|
| Version references corrected | All references updated to current spec versions (v2.1, v1.1) |
| `gateway_scores` fallback hardened | If `gateway_scores` table missing, RES conversion_fit cap skips gracefully with health log warning rather than silently failing |
| LLM Abstraction Layer noted | Smart Suggestions extension uses `engine='suggestions'` from `llm_config` — no separate API call |
| Sunday timing conflict resolved | Explicit ordering documented and verified: Audience Feed (05:00) → Monetization Score (06:00) → Gateway Learn (07:00) |
| Product-sale framing removed | Spec is for personal network operation only |

---

## Contents

| Section | Title |
|---|---|
| 01 | What this is |
| 02 | Architecture overview |
| 03 | Layer 1 — Track |
| 04 | Layer 2 — Score |
| 05 | Layer 3 — Optimize |
| 06 | Layer 4 — Report |
| 07 | Admin panel additions |
| 08 | Integration with existing specs |
| 09 | Database schema |
| 10 | Activation prompt |
| 11 | Setup — three questions |
| 12 | Troubleshooting |

---

## Section 01 — What this is

The affiliate link system in the Content Engine is a table of URLs. It inserts links. It does not know which links are converting, which article types drive the most revenue, which offers are decaying, or what the highest-leverage next action is on the monetization side.

This engine closes that gap. It is the revenue layer of the stack.

### What the other specs do not cover

- Tracking which articles and pSEO pages generate affiliate clicks and attributing revenue to them
- Monitoring affiliate program terms for commission changes, cookie window changes, or program shutdowns
- Scoring offers by effective revenue per visitor so the Content Engine can prioritise the right tools
- Detecting when a high-traffic article has no monetization and automatically surfacing it for action
- Managing sponsor placements, direct deals, and newsletter ad slots
- Building the weekly revenue picture that tells you whether the operation is moving toward its financial targets

This engine adds all of that. It operates alongside the existing engines and does not replace any existing component. The affiliate link table stays where it is. This engine reads it, extends it, and wraps it with intelligence.

**No new environment variables required. No new API services. No new monthly costs.** Everything runs on the same API keys and Supabase instance already set up by the other specs.

---

## Section 02 — Architecture overview

Four layers. Two output streams. One revenue picture.

| Layer | Name | What it does | When it runs |
|---|---|---|---|
| 1 | Track | Captures every affiliate click, correlates it to the article or pSEO page that generated it. | Real-time, on every click |
| 2 | Score | Assigns every monetizable page a Revenue Efficiency Score (RES). Surfaces mismatches. | Sunday 06:00 UTC |
| 3 | Optimize | Acts on Score output. Adjusts affiliate link priority, injects keywords into Content Engine queue. | Sunday 06:30 UTC |
| 4 | Report | Daily revenue brief (one number, two actions) and weekly monetization summary. | Daily 07:00 UTC + Sunday 09:00 UTC |

### Output streams

| Stream | What it contains | Where it goes |
|---|---|---|
| Email output | Daily revenue brief + weekly monetization summary | `ALERT_EMAIL` via existing Resend integration |
| Dashboard output | MONETIZATION section in Smart Admin Dashboard | `/admin` — detected automatically |

The Monetization Engine never generates content independently, never calls an LLM independently, and never creates its own scheduler. It extends the Smart Suggestions call, extends the `network_reports` row, and extends the newsletter slot. It is additive by design.

---

## Section 03 — Layer 1 — Track

### Click attribution

Every affiliate link click is captured and attributed to the specific page, article type, and tool. The click event fires client-side via a lightweight edge function call and stores in `monetization_clicks`.

| Field | Type | Description |
|---|---|---|
| click_id | uuid | Primary key |
| affiliate_link_id | uuid | FK to `affiliate_links` |
| tool_slug | text | Which tool the link points to |
| source_url | text | The page URL where the click happened |
| source_type | text | `article` / `pseo_page` / `newsletter` / `sidebar` |
| article_id | uuid | FK to `articles` (null for pSEO pages) |
| pseo_page_id | uuid | FK to `pseo_pages` (null for articles) |
| article_type | text | Content type |
| click_position | text | `in_body` / `see_also` / `cta_button` / `sidebar` |
| session_id | text | Anonymous session ID for deduplication |
| clicked_at | timestamp | |
| site_id | text | |

Session deduplication: multiple clicks from the same session to the same affiliate URL within 30 minutes are counted as one click.

### Revenue entry

Affiliate programs do not share conversion data in real time. Revenue is entered in three ways:

| Method | How it works |
|---|---|
| Manual entry | Pull payout reports from affiliate dashboards monthly. Enter totals via admin form. Engine correlates payouts against click volume to estimate conversion rates. |
| CSV import | Paste or upload CSV from Impact, ShareASale, PartnerStack, or direct programs. Engine parses and matches by tool name or domain. |
| Estimated revenue | Where commission rate and historical conversion rate are known, the engine calculates projected monthly revenue automatically. |

### Offer monitoring

Every affiliate program is tracked for changes. Offers must be manually confirmed every 30 days — the engine does not scrape program pages. It prompts the admin weekly and flags unconfirmed offers.

| Field | Description |
|---|---|
| offer_id | uuid primary key |
| tool_slug | FK to tools |
| program_name | e.g. PartnerStack, Impact, ShareASale, Direct |
| commission_type | `percentage` / `flat` / `recurring` |
| commission_rate | Decimal 0.0–1.0 |
| commission_flat | Dollar amount for flat-fee programs |
| cookie_window_days | Attribution window in days — directly affects offer quality score |
| recurring_months | For recurring structures — how many months it pays |
| status | `active` / `paused` / `terminated` / `unconfirmed` |
| last_confirmed_at | When admin last confirmed terms are current |

`unconfirmed` for 30+ days triggers amber alert. `terminated` triggers red alert and flags all affected affiliate links for replacement. Cookie window below 7 days flags the offer as weak-attribution.

---

## Section 04 — Layer 2 — Score

Runs weekly, Sundays at 06:00 UTC — after Audience Engine Feed layer (05:00 UTC) and before Quality Gateway Learn layer (07:00 UTC).

### Revenue Efficiency Score (RES)

Every article and pSEO page with at least one affiliate link receives a Revenue Efficiency Score.

```
RES = (clicks_per_1000_visitors × offer_quality_score × content_authority_score) / 100
```

| Input | What it is | How it's calculated |
|---|---|---|
| clicks_per_1000_visitors | Affiliate click rate | Clicks (28 days) ÷ sessions (28 days) × 1,000. If Audience Engine is running: multiplied by `traffic_quality_multiplier` from `audience_res_adjustments`. If no traffic data: uses `quality_score` rank as proxy. |
| offer_quality_score (0–100) | Composite offer value | Commission rate 35pts + cookie window 20pts + recurring structure 25pts + program stability 20pts. |
| content_authority_score (0–100) | Content quality signal | `gateway_scores.total` scaled to 100 (÷ 1.06). If `gateway_scores` table does not exist or has no row for this page: use `quality_score / 1.06` as proxy and log `gateway_scores_missing` warning to `system_health_log`. |

### Offer quality score breakdown

| Dimension | Points | What is scored |
|---|---|---|
| Commission rate | 35 pts | Benchmarked against stored category averages. Top 25% = 35. Middle 50% = 20. Bottom 25% = 8. |
| Cookie window | 20 pts | 90+ days = 20, 30–89 days = 14, 7–29 days = 7, under 7 days = 0. |
| Recurring structure | 25 pts | Monthly recurring = 25, annual recurring = 15, one-time = 0. |
| Program stability | 20 pts | Confirmed active within 30 days = 20, 31–60 days = 10, 60+ days = 0. |

### RES interpretation

| RES range | Classification | Action |
|---|---|---|
| 0–15 | Dead weight | High traffic or quality but not converting. Flag for monetization audit. |
| 16–35 | Underperforming | Some conversion but below category average. Review offer fit and CTA placement. |
| 36–65 | Healthy | Operating in expected range. Monitor for decay. |
| 66–85 | Strong | Above average. Protect with content refresh. Replicate the pattern. |
| 86–100 | Flagship | Your best content. Most linked, most refreshed, most protected asset. |

### The conversion_fit ceiling

Articles that score 0 on the Quality Gateway's `conversion_fit` dimension are capped at RES 35 regardless of offer quality. This prevents high-commission tools from scoring well on content that does not actually sell.

**Implementation:** Read `gateway_scores.dimension_reasons` JSONB for the `conversion_fit` score. If 0, apply RES 35 cap.

**Fallback:** If `gateway_scores` table does not exist or has no row for this article, skip the cap and log a warning to `system_health_log`: `conversion_fit_cap_skipped_no_gateway_data`. Do not fail the scoring run.

### Monetization gap detection

Four gap types detected weekly:

| Gap type | Condition | Action triggered |
|---|---|---|
| Type 1 — Unmonetized high performers | Top 25% traffic pages with zero affiliate clicks in 28 days | Flag in admin panel |
| Type 2 — Strong offer, thin content | Tools with `offer_quality_score` ≥ 70 and fewer than 3 published pages | Inject `[tool] review` into keyword queue at priority 80, `added_by='monetization_engine'`, `intent='commercial'` |
| Type 3 — Offer decay | Pages with RES drop > 25 points vs 90 days ago | Flag in admin panel for offer audit |
| Type 4 — pSEO to article conversion | pSEO pages with 500+ monthly impressions and no Content Engine article | Inject `[tool] review` into keyword queue at priority 85 |

---

## Section 05 — Layer 3 — Optimize

Runs Sundays at 06:30 UTC, after Score completes.

### Offer priority adjustment

The Monetization Engine manages `monetization_priority` on the `affiliate_links` table. The Content Engine and pSEO Engine read this field when selecting affiliate CTAs.

| Condition | Priority set to | Effect |
|---|---|---|
| RES ≥ 66 AND offer_quality_score ≥ 70 | 90 (highest) | Tool's CTA preferred when article can include only 1–2 links |
| Offer status = `terminated` | 0 (excluded) | Tool excluded from new CTA insertions. Existing links flagged, not auto-removed. |
| `offer_quality_score` < 30 | −10 per week (floor: 20) | Gradual deprioritisation of weak programs |
| New tool, no offer data | 50 (neutral) | Held neutral until an offer is registered and confirmed |

All priority changes logged to `monetization_priority_log`. Admins can view and override from the Offer Manager tab.

### Keyword queue injection

Injected keywords are pre-classified as `intent='commercial'` — no separate intent classification LLM call needed, saving API usage.

| Trigger | Keyword | Priority |
|---|---|---|
| Gap type 2 (strong offer, thin content) | `[tool name] review` | 80 |
| Gap type 4 (pSEO impressions, no deep review) | `[tool name] review` | 85 |
| Tool with recurring commission and zero reviews | `[tool name] review` | 75 |
| pSEO comparison page with 500+ impressions/mo, no article | `[tool A] vs [tool B]` | 80 |
| Category RES average above 60, category has < 5 articles | `best [category] tools` | 70 |

### Sponsor pipeline manager

Direct sponsorships tracked from prospect to payment:

| Stage | Description |
|---|---|
| Prospect | Potential sponsor identified. Not yet contacted. |
| Contacted | Outreach sent. Awaiting response. |
| Negotiating | In discussion. Rate and placement agreed in principle. |
| Confirmed | Deal agreed. Placement date scheduled. |
| Live | Sponsored content currently active. |
| Completed | Placement ended. Invoice sent or payment received. |
| Declined | Did not proceed. Reason logged. |

Any sponsored content flagged in the pipeline automatically adds a disclosure flag to the corresponding article record. The Content Engine checks `disclosure_required = true` and prepends FTC/ASA disclosure text before the article body at publish or refresh time. This happens outside the gateway-scored content body and does not affect quality scores.

### Newsletter monetization slot

The weekly newsletter has one optional sponsor slot between article 1 and article 2. If a sponsor is in Live stage for that week, their placement text is inserted automatically. If no sponsor is booked, the slot fills with the highest-RES tool's affiliate CTA. Newsletter CTA clicks tracked as `source_type = 'newsletter'`.

---

## Section 06 — Layer 4 — Report

### Daily revenue brief

Sent every morning at 07:00 UTC. One email. Under 100 words.

| Component | What it contains |
|---|---|
| Yesterday's number | Estimated affiliate revenue for the previous day. Trend indicator vs 7-day average. |
| One alert | The single highest-priority monetization alert from the past 24 hours. |
| One action | A single recommended action from the Optimize layer. |

Uses existing `RESEND_API_KEY` and `ALERT_EMAIL`. No new configuration.

### Weekly monetization summary

Every Sunday at 09:00 UTC, after Score and Optimize have run.

| Section | What it shows |
|---|---|
| Revenue by channel | Articles, pSEO pages, newsletter CTAs, and sponsor placements — with % change vs prior 4-week average. |
| Revenue by tool | Top 10 tools by estimated revenue: commission rate, click volume, estimated conversion rate, estimated revenue. |
| Revenue by article type | Which article types generate the most revenue — all types broken out. |
| Monetization health | Average RES, % of top-50 pages with active affiliate links, unconfirmed offer count, sponsor pipeline value. |
| 30-day trajectory | Projected monthly revenue vs `monthly_revenue_target`. Green = on track. Amber = within 20% below. Red = more than 20% below. |

---

## Section 07 — Admin panel additions

The Smart Admin Dashboard gains a **MONETIZATION** section detected automatically via presence of `monetization_clicks` table. Placement: between QUALITY GATEWAY and NETWORK REPORTS.

Two new homepage widgets:
- **Revenue pulse:** Yesterday's estimated revenue and 7-day trend sparkline.
- **Monetization alerts:** Count of active alerts with severity colour.

### Five tabs in the MONETIZATION section

| Tab | What it contains |
|---|---|
| Revenue Overview | Today / week / month estimates. 12-week revenue trend chart. Active alerts. Monthly revenue target input and trajectory indicator. |
| Top Performers | Top 20 articles and top 20 pSEO pages by RES. Filter by tool, article type, date range. "Protect this page" and "Replicate pattern" buttons. |
| Monetization Gaps | All four gap types as actionable cards. Page title, traffic, current RES, gap type, one-click action. Dismissible for 30 days. |
| Offer Manager | Full offer list with status, commission details, last confirmed date. Confirm terms button. Commission comparison view. |
| Sponsor Pipeline | Kanban view across 7 stages. Add prospect, update stage, log notes. Revenue tracker. Rate card builder. Disclosure status for live placements. |

---

## Section 08 — Integration with existing specs

### Content Engine v2.1 — 4 integration points

| Integration | What it does |
|---|---|
| `monetization_priority` field | Content Engine reads `affiliate_links.monetization_priority` when selecting CTAs. Higher priority tools preferred when article is at its maximum of 3 CTAs. |
| Keyword queue injection | Monetization Engine writes to `keyword_queue` with `added_by='monetization_engine'` and `intent='commercial'`. These keywords skip the per-keyword intent classification LLM call — intent is pre-set at injection time. |
| Sponsored content disclosure | Articles with `sponsored=true` receive `disclosure_required=true` on their `keyword_queue` row. Content Engine prepends FTC/ASA disclosure before the article body at publish time, outside the scored content body. |
| Revenue brief via Resend | Uses same Resend integration as Content Engine failure alerts. Same `ALERT_EMAIL`. No additional configuration. |

### pSEO Engine v1.1 — 3 integration points

| Integration | What it does |
|---|---|
| RES on pSEO pages | Score layer reads `pseo_pages.search_impressions` and `search_clicks` to calculate traffic-based RES. Falls back to `quality_score` without GSC data. |
| Affiliate CTA priority on pSEO templates | Template engine reads `monetization_priority` when selecting which CTAs to render. |
| pSEO impression threshold injection | When a pSEO page crosses 500 monthly impressions with no corresponding Content Engine article, Gap Type 4 keyword injection fires. |

### Quality Gateway v1.1 — 3 integration points

| Integration | What it does |
|---|---|
| `content_authority_score` | Score layer reads `gateway_scores.total` to calculate content authority. A targeted retry that raises the gateway score directly improves the page's RES. |
| `conversion_fit` ceiling | Score layer reads `gateway_scores.dimension_reasons` for the `conversion_fit` dimension. An article scoring 0 on conversion_fit is capped at RES 35. If `gateway_scores` row does not exist, skip the cap and log a warning — do not fail the scoring run. |
| Learn layer alignment | Monetization Score (06:00 UTC) and Optimize (06:30 UTC) complete before Quality Gateway Learn (07:00 UTC). Revenue signals are not influenced by mid-cycle weight changes. |

### Audience Engine v1.0 — 2 integration points

| Integration | What it does |
|---|---|
| Traffic quality multiplier | Monetization Engine reads `audience_res_adjustments.traffic_quality_multiplier` for each page during Score layer. Audience Feed (05:00 UTC) writes this before Monetization Score (06:00 UTC). |
| Cohort conversion data | Monetization Engine reads per-page cohort conversion rates from `audience_content_performance` for weekly summary email context. |

### Smart Admin Dashboard v1.2 — 3 integration points

| Integration | What it does |
|---|---|
| MONETIZATION sidebar section | Dashboard detects `monetization_clicks` table and activates section automatically. |
| Homepage widgets | Revenue pulse and Monetization alerts widgets added. |
| Smart Suggestions extension | Daily Gemini Smart Suggestions call extended with monetization context: high-offer tools with no articles, unmonetized traffic pages, unconfirmed offers, revenue trajectory. Uses `engine='suggestions'` from `llm_config`. |

### Network Backlink Manager — 1 integration point

Pages with RES above 60 are link-receiving priority targets within the network. Backlink Manager deprioritises these pages as link sources and prioritises them as link targets.

---

## Section 09 — Database schema

### New tables created by this spec

**monetization_clicks** — full schema in Section 03 above.

**monetization_offers** — full schema in Section 03 above.

**monetization_res_scores**

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| source_id | uuid | FK to `articles.id` or `pseo_pages.id` |
| source_type | text | `article` / `pseo_page` |
| res_score | decimal | 0–100 |
| clicks_per_1000 | decimal | |
| offer_quality_score | integer | |
| content_authority_score | integer | |
| conversion_fit_score | integer | From `gateway_scores` |
| conversion_fit_cap_applied | boolean | Whether the RES 35 cap was applied |
| scored_at | timestamp | |
| site_id | text | |

**monetization_gaps, monetization_sponsors, monetization_revenue, monetization_weekly_reports, monetization_priority_log** — see original spec for full field lists. All structure unchanged from v1.0.

### Extended tables (existing — columns added only)

| Table | Columns added |
|---|---|
| `affiliate_links` | `monetization_priority` (int, default 50), `offer_id` (uuid FK to `monetization_offers`), `click_count_lifetime` (int), `last_clicked_at` (timestamp) |
| `articles` | `res_score` (decimal), `monetization_flag` (text), `disclosure_required` (boolean) |
| `pseo_pages` | `res_score` (decimal), `monetization_flag` (text) |
| `network_reports` | `estimated_revenue_weekly` (decimal), `avg_res_score` (decimal), `active_sponsor_count` (int) |
| `site_settings` | `monthly_revenue_target` (decimal) |

---

## Section 10 — Activation prompt

Paste into your Lovable project after Content Engine v2.1, pSEO Engine v1.1, Quality Gateway v1.1, and Smart Admin Dashboard v1.2 are installed.

```
Build and activate the Autonomous Monetization Engine v1.1 for this Lovable project.

Before building anything, audit for: (1) affiliate_links table,
(2) articles table, (3) pseo_pages table, (4) generation_log table,
(5) site_settings table, (6) existing /admin route,
(7) keyword_queue table, (8) gateway_scores table,
(9) pseo_pages.search_impressions field, (10) llm_config table,
(11) audience_res_adjustments table (Audience Engine — may not be present yet).

For each found: extend with new columns only. Do not overwrite existing data.
For each missing: build foundational version.

1. CLICK TRACKING
   Add edge function at /api/affiliate-click accepting:
   affiliate_link_id, source_url, source_type, article_id (nullable),
   pseo_page_id (nullable), session_id.
   Update all affiliate CTAs to call this endpoint on click before redirecting.
   Redirect still happens — tracking is non-blocking.
   Deduplicate: same session_id + affiliate_link_id within 30 minutes = one click.
   Store in monetization_clicks. Update affiliate_links.click_count_lifetime.

2. OFFER REGISTRY
   Create monetization_offers table. Build offer entry form in admin panel.
   Calculate offer_quality_score weekly. New offers default to 'unconfirmed'.
   Add monetization_priority (int, default 50) to affiliate_links if not present.
   Add offer_id FK to affiliate_links.

3. REVENUE EFFICIENCY SCORING (Sundays 06:00 UTC)
   For every article and pseo_page with at least one affiliate link:
   A. clicks_per_1000 = (clicks 28 days / sessions 28 days) * 1000.
      If audience_res_adjustments table exists and has a row for this source_id:
      multiply clicks_per_1000 by traffic_quality_multiplier from that table.
      If table does not exist: use raw clicks_per_1000 without multiplier.
      If no traffic data at all: use quality_score rank as proxy.
   B. offer_quality_score = best monetization_offers record for tools on this page.
   C. content_authority_score: query gateway_scores.total for this page.
      If found: content_authority_score = gateway_scores.total / 1.06.
      If gateway_scores table does not exist OR has no row for this page:
      use quality_score / 1.06 as proxy AND log 'gateway_scores_missing' warning
      to system_health_log. Do not fail the scoring run.
   D. conversion_fit ceiling: read gateway_scores.dimension_reasons JSONB
      for the conversion_fit field. If conversion_fit = 0, cap RES at 35.
      If gateway_scores row does not exist: skip cap, log
      'conversion_fit_cap_skipped_no_gateway_data' to system_health_log.
   E. RES = (clicks_per_1000 * offer_quality_score * content_authority_score) / 100.
   F. Write to monetization_res_scores with conversion_fit_cap_applied boolean.
      Update articles.res_score, pseo_pages.res_score.

4. GAP DETECTION (Sundays 06:15 UTC)
   Type 1: top 25% traffic pages with 0 clicks in 28 days — create gap record.
   Type 2: tools with offer_quality_score >= 70 and < 3 published pages —
     create gap, inject '[tool] review' to keyword_queue priority 80,
     added_by='monetization_engine', intent='commercial'.
     Do NOT run keyword intent classification LLM call — intent is pre-set.
   Type 3: pages with res_score drop >25 pts vs 90 days ago — create gap.
   Type 4: pseo_pages with search_impressions > 500/mo and no CE article —
     create gap, inject '[tool] review' to keyword_queue priority 85,
     added_by='monetization_engine', intent='commercial'.

5. OFFER PRIORITY ADJUSTMENT (Sundays 06:30 UTC)
   RES >= 66 AND offer_quality_score >= 70: monetization_priority = 90.
   Status = 'terminated': monetization_priority = 0,
     flag articles.monetization_flag = 'offer_terminated'.
   offer_quality_score < 30: decrement priority by 10 (floor: 20).
   Log all changes to monetization_priority_log with reason.
   Content Engine and pSEO Engine read monetization_priority at generation time.

6. SPONSOR PIPELINE
   Create monetization_sponsors table. Add Sponsor Pipeline tab to MONETIZATION
   section with kanban view. When sponsor moves to 'live' with placement_target_id:
   flag article disclosure_required = true. Content Engine prepends FTC/ASA
   disclosure text before article body at next refresh — outside gateway-scored
   content body so quality scores are not affected.
   Newsletter slot: check for live sponsor on generation. If found, insert text
   between article 1 and 2. If not found, insert highest-RES tool CTA.
   Track newsletter clicks as source_type = 'newsletter'.

7. REVENUE ENTRY
   Add revenue entry form to admin: period, tool, program, clicks, conversions, payout.
   Store to monetization_revenue with source='manual'.
   Add CSV import with source='csv_import'.
   Estimated revenue: clicks_28_days * 0.02 * (avg_tool_price * commission_rate).
   Store as source='estimated'. Show in amber until actuals entered.

8. DAILY REVENUE BRIEF (07:00 UTC via Resend to ALERT_EMAIL)
   Use existing RESEND_API_KEY and ALERT_EMAIL — do not create new variables.
   Under 100 words: yesterday's estimated revenue + trend,
   highest priority active alert, one recommended action from Optimize output.

9. WEEKLY SUMMARY (Sundays 09:00 UTC via Resend)
   Revenue by channel, top 10 tools, revenue by article type,
   monetization health indicators, 30-day trajectory vs monthly_revenue_target.
   Store to monetization_weekly_reports.

10. ADMIN PANEL — MONETIZATION SECTION
    Detect via presence of monetization_clicks table at dashboard login.
    Add to Smart Admin Dashboard sidebar between QUALITY GATEWAY and NETWORK REPORTS.
    Five tabs: Revenue Overview, Top Performers, Monetization Gaps, Offer Manager,
    Sponsor Pipeline. Add Revenue pulse and Monetization alerts widgets to homepage.

11. SMART SUGGESTIONS EXTENSION
    Extend the Smart Suggestions call (uses engine='suggestions' from llm_config —
    do not create a new LLM call). Append to existing Smart Suggestions system
    prompt — do not replace existing signals:
    "Also analyse: top 3 high-offer tools (offer_quality_score >= 70) with no CE
    articles; top 3 unmonetized pages by traffic; unconfirmed offers >21 days;
    revenue trajectory vs monthly_revenue_target. Include one monetization
    recommendation in your output."
    Only inject monetization context if monetization_clicks has at least one row.

12. BACKLINK MANAGER INTEGRATION
    Pages with res_score > 60: add link_target_priority = 'high' flag readable
    by Network Backlink Manager. These pages are link targets, not link sources.

13. DATABASE TABLES
    Create: monetization_clicks, monetization_offers, monetization_res_scores,
    monetization_gaps, monetization_revenue, monetization_sponsors,
    monetization_weekly_reports, monetization_priority_log.
    Extend: affiliate_links, articles, pseo_pages, network_reports, site_settings.

SUNDAY TIMING SEQUENCE:
   05:00 UTC — Audience Feed layer (writes traffic_quality_multiplier — must run first)
   06:00 UTC — Monetization Score layer
   06:15 UTC — Gap detection
   06:30 UTC — Optimize layer (priority adjustment + keyword injection)
   07:00 UTC — Quality Gateway Learn layer
   08:00 UTC — Newsletter send
   09:00 UTC — Monetization weekly summary
   09:30 UTC — Audience weekly digest

AFTER BUILDING: list every table created/extended, every admin section added,
the click tracking endpoint URL. Confirm affiliate CTAs are wired to tracker.
Confirm monetization_priority is readable by Content Engine CTA selection logic.
Confirm gateway_scores.conversion_fit is readable by RES scoring.
Confirm gateway_scores fallback is implemented and logs to system_health_log.
```

---

## Section 11 — Setup — three questions

### Question 1 — Monthly revenue target

What is your monthly revenue target for this site? Set in `site_settings.monthly_revenue_target`. Editable at any time in the Revenue Overview tab — you do not have to get this right on day one.

### Question 2 — Your primary affiliate model

| Model | Select | Typical niches |
|---|---|---|
| Monthly recurring SaaS commissions | `saas_recurring` | No-code tools, marketing software, project management |
| SaaS one-time or annual payout | `saas_onetime` | Design tools, certain developer tools |
| High-ticket flat fee programs | `high_ticket_flat` | Enterprise software, financial tools |
| Mixed or unclear | `mixed` | Multiple categories or early-stage sites |

### Question 3 — Sponsor readiness

| Status | Select | What activates |
|---|---|---|
| Not ready | `pipeline_only` | Sponsor pipeline built but rate card and outreach tools disabled until manually enabled. |
| Ready | `active` | Full sponsor pipeline activated from day one. |
| Already have sponsors | `active` | Select active, then add existing sponsors manually in Sponsor Pipeline tab after setup. |

---

## Section 12 — Troubleshooting

**Before spending a Lovable credit on a fix prompt:** check `monetization_priority_log` and `monetization_gaps` tables in Supabase. These contain more specific diagnostic information than what appears in the admin UI.

**Click tracking not recording** — Check `/api/affiliate-click` edge function exists and returns 200 in Supabase logs. Check `monetization_clicks` — if empty after known clicks, the edge function call is failing. The redirect still happens even if tracking fails — tracking is non-blocking by design.

**RES scores not appearing** — RES scoring runs Sundays at 06:00 UTC. Check Supabase cron log. If no traffic data available and no GSC token, scores calculate using `quality_score` as proxy. Offers must be in `active` status. Use "Run scoring now" button in Offer Manager to force a manual run.

**`conversion_fit` cap not applying** — Check that `gateway_scores` has rows for your articles. If Quality Gateway v1.1 has not yet run on a page, no `conversion_fit` score is stored and the cap is skipped. A warning appears in `system_health_log` — check there for details.

**`monetization_priority` not affecting CTA selection** — Verify build report confirms Content Engine CTA selection logic reads `affiliate_links.monetization_priority`. Check that `affiliate_links` rows have `monetization_priority` populated (default 50, not null). Priority is read at article generation time — articles already queued use the priority value current when they generate.

**Revenue estimates diverge from actuals** — Estimated revenue uses a 2% default conversion rate. Enter at least one month of actual payout data via Revenue Entry form — engine calibrates its estimate to your site's real rate. For high-ticket, low-conversion programs, the 2% default significantly overestimates.

**Sunday schedule conflicts** — Recommended sequence: 05:00 Audience → 06:00 Monetization Score → 06:30 Optimize → 07:00 Gateway Learn → 08:00 Newsletter → 09:00 Summary. Confirm each job has at least 10 minutes buffer in Supabase cron configuration.

---

## Environment variables — no new keys required

| Variable | Set by | Used for |
|---|---|---|
| `GEMINI_API_KEY` | Content Engine | Smart Suggestions extension |
| `RESEND_API_KEY` | Content Engine | Daily brief and weekly summary emails |
| `ALERT_EMAIL` | Content Engine | All monetization email output |
| `SITE_ID` | Content Engine | Multi-site revenue attribution |
| `SUPABASE_URL` | Prior specs | All database operations |
| `SUPABASE_ANON_KEY` | Prior specs | All database operations |
