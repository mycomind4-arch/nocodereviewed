# AUTONOMOUS Monetization Engine
## Revenue Intelligence Spec v1.0 — Stupid People Edition
**Prepared May 2026 · Confidential**

> Drop this document into any Lovable project running the Content Engine.  
> It tracks every click, scores every offer, and tells you exactly where the money is and where it should be.

| Attribute | Value |
|---|---|
| Version | 1.0 — Stupid People Edition |
| Prepared | May 2026 |
| Lovable credits | 2–3 |
| New API keys | 0 |
| New ongoing cost | $0/mo |
| Daily intervention | 0 |
| Pairs with | Content Engine v2.1, pSEO Engine v1.0, Quality Gateway v1.0, Smart Admin Dashboard v1.1 |
| Classification | Confidential |

---

## Contents

| Section | Title |
|---|---|
| 01 | What This Is |
| 02 | Architecture Overview |
| 03 | Layer 1 — Track |
| 04 | Layer 2 — Score |
| 05 | Layer 3 — Optimize |
| 06 | Layer 4 — Report |
| 07 | Admin Panel Additions |
| 08 | Integration with Existing Specs |
| 09 | Database Schema |
| 10 | Activation Prompt |
| 11 | Setup — Three Questions |
| 12 | Troubleshooting |

---

## SECTION 01 — What This Is

The existing stack generates content, assembles SEO pages, enforces quality, and reports on its own health. None of it knows whether the content is making money — or why.

The affiliate link system in the Content Engine is a table of URLs. It inserts links. It does not know which links are converting, which article types drive the most revenue, which offers are decaying, which tools have commission structures worth promoting more aggressively, or what the highest-leverage next action is on the monetization side of the operation.

This engine closes that gap. It is the revenue layer of the stack.

### What the other specs do not cover

- Tracking which specific articles and pSEO pages generate affiliate clicks and attributing revenue to them
- Monitoring affiliate program terms for commission changes, cookie window changes, or program shutdowns
- Scoring offers by effective revenue per visitor so the Content Engine can prioritise the right tools
- Detecting when a high-traffic article has no monetization and automatically surfacing it for action
- Managing sponsor placements, direct deals, and newsletter ad slots as a separate revenue stream
- Building the weekly revenue picture that tells you whether the operation is moving toward its financial targets

This engine adds all of that. It operates alongside the existing engines — it does not replace any existing component. The affiliate link table stays where it is. This engine reads it, extends it, and wraps it with intelligence.

> **INFO:** No new environment variables are required. No new API services. No new monthly costs. Everything runs on the same Gemini API key, the same Resend key, and the same Supabase instance already set up by the other specs.

---

## SECTION 02 — Architecture Overview

Four layers. Two output streams. One revenue picture.

| Layer | Name | What it does | When it runs |
|---|---|---|---|
| 1 | Track | Captures every affiliate click, correlates it to the article or pSEO page that generated it, and stores it against the content record. | Real-time, on every click |
| 2 | Score | Assigns every monetizable page a Revenue Efficiency Score (RES). Surfaces mismatches: high-traffic pages with weak monetization, decaying offers, content gaps. | Weekly, Sunday 06:00 UTC |
| 3 | Optimize | Acts on Score output. Adjusts affiliate link priority, injects keywords into the Content Engine queue, manages the sponsor pipeline. | Weekly, Sunday 06:30 UTC |
| 4 | Report | Produces the daily revenue brief (one number, two actions) and the weekly monetization summary. | Daily 07:00 UTC + weekly Sunday 09:00 UTC |

### Output streams

| Stream | What it contains | Where it goes |
|---|---|---|
| Email output | Daily revenue brief + weekly monetization summary | `ALERT_EMAIL` via existing Resend integration |
| Dashboard output | MONETIZATION section in Smart Admin Dashboard, homepage widgets, gap cards | `/admin` — detected and activated automatically |

> **INFO:** The Monetization Engine never generates content, never calls Gemini independently, and never creates its own scheduler. It piggybacks on the existing infrastructure — extending the Smart Suggestions call, extending the `network_reports` row, and extending the newsletter slot. It is additive by design.

---

## SECTION 03 — Layer 1 — Track

### Click attribution

Every affiliate link click is captured and attributed to the specific page, article type, and tool. The click event fires client-side via a lightweight edge function call on click and stores in `monetization_clicks`.

| Field | Type | Description |
|---|---|---|
| click_id | uuid | Primary key |
| affiliate_link_id | uuid | FK to `affiliate_links` table |
| tool_slug | text | Which tool the link points to |
| source_url | text | The page URL where the click happened |
| source_type | text | `article` / `pseo_page` / `newsletter` / `sidebar` |
| article_id | uuid | FK to `articles` table (null for pSEO pages) |
| pseo_page_id | uuid | FK to `pseo_pages` table (null for articles) |
| article_type | text | `tool_review` / `comparison` / `tutorial` / `best_of_list` / pSEO type |
| click_position | text | `in_body` / `see_also` / `cta_button` / `sidebar` |
| session_id | text | Anonymous session ID for deduplication |
| clicked_at | timestamp | |
| site_id | text | Which site (for multi-site networks) |

> **INFO:** Session deduplication: multiple clicks from the same session to the same affiliate URL within 30 minutes are counted as one click. This prevents inflated counts from multi-tab browsing.

### Revenue entry

Affiliate programs do not share conversion data in real time. Revenue is entered in one of three ways:

| Method | How it works | Best for |
|---|---|---|
| Manual entry | Pull payout reports from affiliate dashboards monthly. Enter totals via admin form. Engine correlates payouts against click volume to estimate conversion rates. | All programs |
| CSV import | Paste or upload CSV from any major network (Impact, ShareASale, PartnerStack, direct). Engine parses and matches by tool name or domain. | High-volume programs |
| Estimated revenue | Where commission rate and historical conversion rate are known, the engine calculates projected monthly revenue per program automatically. | Ongoing projection between payout reports |

### Offer monitoring

Every affiliate program registered in the system is tracked for changes. Offers must be manually confirmed every 30 days — the engine does not scrape program pages (which would violate most program terms). Instead it prompts the admin weekly and flags unconfirmed offers.

| Field | Description |
|---|---|
| offer_id | uuid primary key |
| tool_slug | FK to tools table |
| program_name | e.g. PartnerStack, Impact, ShareASale, Direct |
| commission_type | `percentage` / `flat` / `recurring` |
| commission_rate | Decimal 0.0–1.0 for percentage programs |
| commission_flat | Dollar amount for flat-fee programs |
| cookie_window_days | Attribution window in days — directly affects offer quality score |
| recurring_months | For recurring commission structures — how many months it pays out |
| payout_threshold | Minimum balance before payout is triggered |
| status | `active` / `paused` / `terminated` / `unconfirmed` |
| last_confirmed_at | When admin last confirmed terms are current |

> **IMPORTANT:** Status `unconfirmed` for 30+ days triggers an amber alert in the admin panel. Status `terminated` triggers a red alert and flags all affected affiliate links for replacement. Cookie window below 7 days flags the offer as weak-attribution and deprioritises it in scoring.

---

## SECTION 04 — Layer 2 — Score

Runs weekly, Sundays at 06:00 UTC — before the newsletter send and before the Quality Gateway learn cycle.

### Revenue Efficiency Score (RES)

Every article and pSEO page with at least one affiliate link receives a Revenue Efficiency Score. This is the primary signal the Optimize layer acts on.

#### RES formula

```
RES = (clicks_per_1000_visitors × offer_quality_score × content_authority_score) / 100
```

| Input | What it is | How it's calculated |
|---|---|---|
| clicks_per_1000_visitors | Affiliate click rate | Clicks (28 days) ÷ sessions (28 days) × 1,000. If no traffic data: uses `quality_score` rank as proxy. |
| offer_quality_score (0–100) | Composite offer value | Commission rate 35pts + cookie window 20pts + recurring structure 25pts + program stability 20pts. |
| content_authority_score (0–100) | Content quality signal | `gateway_scores.total` scaled to 100 (÷1.06). A quality improvement directly improves RES. |

#### Offer quality score breakdown

| Dimension | Points | What is scored |
|---|---|---|
| Commission rate | 35 pts | Benchmarked against stored category averages. Top 25% = 35. Middle 50% = 20. Bottom 25% = 8. |
| Cookie window | 20 pts | 90+ days = 20, 30–89 days = 14, 7–29 days = 7, under 7 days = 0. |
| Recurring structure | 25 pts | Monthly recurring = 25, annual recurring = 15, one-time = 0. |
| Program stability | 20 pts | Confirmed active within 30 days = 20, 31–60 days = 10, 60+ days = 0. |

#### RES interpretation

| RES range | Classification | Action |
|---|---|---|
| 0–15 | Dead weight | High traffic or quality but not converting. Flag for monetization audit. |
| 16–35 | Underperforming | Some conversion but below category average. Review offer fit and CTA placement. |
| 36–65 | Healthy | Operating in expected range. Monitor for decay. |
| 66–85 | Strong | Above average. Protect with content refresh. Replicate the pattern. |
| 86–100 | Flagship | Your best content. Most linked, most refreshed, most protected asset. |

> **IMPORTANT:** The `conversion_fit` ceiling: articles that score 0 on the Quality Gateway's `conversion_fit` dimension are capped at RES 35 regardless of offer quality. This prevents high-commission tools from scoring well on content that does not actually sell. This directly integrates with the Quality Gateway v1.0 10-dimension scoring model — the `conversion_fit` dimension score (0–4 pts) is read by the Monetization Engine from `gateway_scores` to apply this cap.

### Monetization gap detection

Beyond scoring existing content, the Score layer runs a gap analysis each week. Four gap types are detected:

| Gap type | Condition | Action triggered |
|---|---|---|
| Type 1 — Unmonetized high performers | Top 25% traffic pages with zero affiliate clicks in 28 days | Flag in admin panel monetization gaps tab |
| Type 2 — Strong offer, thin content | Tools with `offer_quality_score` ≥ 70 and fewer than 3 published pages | Inject `[tool] review` into keyword queue at priority 80 |
| Type 3 — Offer decay | Pages with RES drop > 25 points vs 90 days ago | Flag in admin panel for offer audit |
| Type 4 — pSEO to article conversion | pSEO pages with 500+ monthly impressions and no deep Content Engine article | Inject `[tool] review` into keyword queue at priority 85 |

---

## SECTION 05 — Layer 3 — Optimize

Acts on Score layer output. Runs weekly after Score completes — Sundays at 06:30 UTC.

### Offer priority adjustment

The Monetization Engine adds a `monetization_priority` integer field to the `affiliate_links` table. The Content Engine and pSEO Engine read this field when selecting which affiliate CTAs to include in content that references multiple tools.

| Condition | Priority set to | Effect |
|---|---|---|
| RES ≥ 66 AND offer_quality_score ≥ 70 | 90 (highest) | Tool's CTA is preferred when article can include only 1–2 links |
| Offer status = terminated | 0 (excluded) | Tool excluded from new CTA insertions. Existing links flagged, not auto-removed. |
| offer_quality_score < 30 | –10 per week (floor: 20) | Gradual deprioritisation of weak-commission programs |
| New tool, no offer data | 50 (neutral) | Held at neutral until an offer is registered and confirmed |

> **INFO:** All priority changes are logged to `monetization_priority_log` with the reason. Admins can view and override any automated adjustment from the Offer Manager tab.

### Keyword queue injection

The Optimize layer adds keywords directly to the Content Engine's `keyword_queue` when monetization signals indicate a content gap. Injected keywords are distinguished by `added_by = 'monetization_engine'` and pre-classified as commercial intent — no keyword intent classification Gemini call is needed, bypassing the one-call-per-keyword step the Content Engine v2.1 runs for manually added keywords.

| Trigger | Keyword injected | Priority |
|---|---|---|
| Gap type 2 (strong offer, thin content) | `[tool name] review` | 80 |
| Gap type 4 (pSEO impressions, no deep review) | `[tool name] review` | 85 |
| Tool with recurring commission and zero reviews | `[tool name] review` | 75 |
| pSEO comparison page with 500+ impressions/mo and no article | `[tool A] vs [tool B]` | 80 |
| Category RES average above 60, category has < 5 articles | `best [category] tools` | 70 |

### Sponsor pipeline manager

Direct sponsorships and sponsored placements are managed as a separate revenue stream from affiliate. The pipeline tracks opportunities from initial contact through to completed payment.

| Stage | Description |
|---|---|
| Prospect | Tool or brand identified as potential sponsor. Not yet contacted. |
| Contacted | Outreach sent. Awaiting response. |
| Negotiating | In discussion. Rate and placement agreed in principle. |
| Confirmed | Deal signed or verbally agreed. Placement date scheduled. |
| Live | Sponsored content or placement is currently active. |
| Completed | Placement period ended. Invoice sent or payment received. |
| Declined | Did not proceed. Reason logged for future reference. |

#### Disclosure compliance

Any sponsored content flagged in the pipeline automatically adds a disclosure flag to the corresponding article or pSEO page record. The Content Engine checks `disclosure_required = true` and prepends the appropriate FTC/ASA disclosure text when the article is generated or refreshed. This removes the manual step and eliminates the risk of accidental non-disclosure.

### Newsletter monetization slot

The weekly newsletter has one optional sponsor slot between article 1 and article 2. If a sponsor is in Live stage for that week, their placement text is inserted automatically. If no sponsor is booked, the slot is filled with the highest-RES tool's affiliate CTA — chosen by the Monetization Engine, not randomly. Newsletter CTA clicks are tracked separately as `source_type = newsletter`.

---

## SECTION 06 — Layer 4 — Report

### Daily revenue brief

Sent every morning at 07:00 UTC. One email. Under 100 words. Three components:

| Component | What it contains |
|---|---|
| Yesterday's number | Total estimated affiliate revenue for the previous day, based on click volume × estimated conversion rate × average commission. Trend indicator vs 7-day average. |
| One alert | The single highest-priority monetization alert from the past 24 hours. Examples: terminated offer affecting 12 links; unmonetized page with 340 sessions. |
| One action | A single recommended action from the Optimize layer. Examples: add keyword, confirm offer terms, review CTA placement on a flagged page. |

> **INFO:** The daily brief goes to `ALERT_EMAIL` via the same Resend integration as Content Engine failure alerts. No new API key or configuration is needed.

### Weekly monetization summary

Every Sunday at 09:00 UTC, after Score and Optimize have run. The full picture.

| Section | What it shows |
|---|---|
| Revenue by channel | Estimated revenue from articles, pSEO pages, newsletter CTAs, and sponsor placements — broken out separately with % change vs prior 4-week average. |
| Revenue by tool | Top 10 tools by estimated revenue: commission rate, click volume, estimated conversion rate, estimated revenue. Ordered by revenue descending. |
| Revenue by article type | Which article types generate the most revenue. `tool_review`, `comparison`, `tutorial`, `best_of_list`, and each pSEO page type broken out. |
| Monetization health | Average RES across all content, % of top-50 pages with active affiliate links, unconfirmed offer count, sponsor pipeline value. |
| 30-day trajectory | Projected monthly revenue at current trend vs `monthly_revenue_target`. Green = on track. Amber = within 20% below. Red = more than 20% below target. |

---

## SECTION 07 — Admin Panel Additions

The Smart Admin Dashboard gains a **MONETIZATION** section in the sidebar navigation. It appears automatically when the Monetization Engine is detected (via presence of the `monetization_clicks` table). Placement: between QUALITY GATEWAY and NETWORK REPORTS.

Two new widgets are added to the dashboard homepage:

- **Revenue pulse:** Yesterday's estimated revenue and a 7-day trend sparkline. Click to go to Revenue Overview tab.
- **Monetization alerts:** Count of active alerts with severity colour (red / amber / green). Click to go to Monetization Gaps tab.

### Five tabs in the MONETIZATION section

| Tab | What it contains |
|---|---|
| Revenue Overview | Today / week / month estimates. 12-week revenue trend chart. Active alerts panel. Monthly revenue target input and trajectory indicator. |
| Top Performers | Top 20 articles and top 20 pSEO pages by RES. Filter by tool, article type, date range. "Protect this page" button (sets `monetization_flag = protected`). "Replicate pattern" button (adds similar keyword to queue). |
| Monetization Gaps | All four gap types as actionable cards. Each card shows: page title, traffic, current RES, gap type, one-click action. Gaps are dismissible for 30 days. |
| Offer Manager | Full list of registered offers with status, commission details, last confirmed date. Confirm terms button. Commission comparison view. Find-higher-commission note field per offer. |
| Sponsor Pipeline | Kanban view of all sponsor opportunities across 7 stages. Add prospect, update stage, log outreach notes. Revenue tracker. Rate card builder. Disclosure status for all live placements. |

---

## SECTION 08 — Integration with Existing Specs

### Content Engine v2.1 — 4 integration points

| Integration | What it does |
|---|---|
| `monetization_priority` field | The Content Engine reads `affiliate_links.monetization_priority` when selecting which affiliate CTAs to include in articles referencing multiple tools. Higher priority tools are preferred when the article is at its maximum of 3 CTAs. |
| Keyword queue injection | The Monetization Engine writes directly to `keyword_queue` with `added_by = 'monetization_engine'` and `intent = 'commercial'`. These keywords skip the per-keyword intent classification Gemini call that the Content Engine v2.1 runs on manually added keywords — intent is pre-set at injection time. |
| Sponsored content disclosure | Articles with `sponsored = true` in the sponsor pipeline receive `disclosure_required = true` on their `keyword_queue` row. The Content Engine prepends FTC/ASA disclosure text before the article body at publish time. This integrates with the Content Engine's generation prompt system — the disclosure prepend happens before the article body, outside the scored content, so it does not affect gateway scoring. |
| Revenue brief via Resend | The daily revenue brief uses the same Resend integration as Content Engine failure alerts. Same `ALERT_EMAIL`. No additional configuration. |

### Programmatic SEO Engine v1.0 — 3 integration points

| Integration | What it does |
|---|---|
| RES on pSEO pages | The Score layer reads `pseo_pages.search_impressions` and `search_clicks` (populated by the GSC integration) to calculate traffic-based RES. pSEO pages without GSC data fall back to `quality_score`. |
| Affiliate CTA priority on pSEO templates | pSEO templates include up to 2 affiliate CTAs. The `monetization_priority` field is read by the template engine when selecting which CTAs to render. |
| pSEO impression threshold injection | When a pSEO page crosses 500 monthly impressions with no corresponding Content Engine article, the Monetization Engine triggers a Gap Type 4 keyword injection. This is the primary mechanism for converting pSEO surface area into high-value deep content. |

### Quality Gateway v1.0 — 3 integration points

| Integration | What it does |
|---|---|
| `content_authority_score` | The Monetization Engine reads `gateway_scores.total` to calculate `content_authority_score`. A content quality improvement — e.g. a targeted retry that raises the gateway score — directly improves the page's RES. The relationship is linear: every point gained on the Quality Gateway (÷ 1.06) becomes a point of `content_authority_score`, which feeds directly into the RES formula. |
| `conversion_fit` ceiling | The Quality Gateway scores `conversion_fit` as one of its 10 dimensions (0–4 pts). The Monetization Engine reads this dimension separately from `gateway_scores`. An article that scores 0 on `conversion_fit` cannot score above RES 35 regardless of offer quality. This ceiling is applied during Score layer calculations — it is not a penalty applied to the gateway score itself. |
| Learn layer alignment | The Quality Gateway's Learn layer runs Sundays at 07:00 UTC. The Monetization Engine's Score layer runs at 06:00 UTC and Optimize at 06:30 UTC. This ordering is intentional: Score and Optimize complete before the Quality Gateway weight updates, ensuring revenue signals are not influenced by mid-cycle weight changes. |

### Smart Admin Dashboard v1.1 — 3 integration points

| Integration | What it does |
|---|---|
| MONETIZATION sidebar section | The dashboard detection engine scans for `monetization_clicks` table on login. If found, activates MONETIZATION in the sidebar between QUALITY GATEWAY and NETWORK REPORTS. |
| Homepage widgets | Revenue pulse widget (yesterday's revenue + sparkline) and Monetization alerts widget (alert count with severity colour) are added to the command center homepage. |
| Smart Suggestions extension | The daily Gemini Smart Suggestions call is extended with monetization context: high-offer tools with no articles, unmonetized traffic pages, unconfirmed offers, revenue trajectory. One monetization recommendation is included in daily output. The monetization extension is appended to the existing Smart Suggestions system prompt — it does not replace the existing gateway health and queue depth signals. |

### Network Backlink Manager — 1 integration point

Pages with RES above 60 are treated as link-receiving priority targets within the network. The Backlink Manager deprioritises these pages as link *sources* (no point sending authority away from your highest-converting pages) and prioritises them as link *targets* (sending authority toward your most valuable pages compounds their performance).

---

## SECTION 09 — Database Schema

### New tables

#### monetization_clicks

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| affiliate_link_id | uuid | FK to `affiliate_links` |
| tool_slug | text | Tool the link points to |
| source_url | text | Page that generated the click |
| source_type | text | `article` / `pseo_page` / `newsletter` / `sidebar` |
| article_id | uuid | FK to `articles` (null for pSEO) |
| pseo_page_id | uuid | FK to `pseo_pages` (null for articles) |
| article_type | text | Type of content that generated the click |
| click_position | text | `in_body` / `see_also` / `cta_button` / `sidebar` |
| session_id | text | Anonymous session for deduplication |
| clicked_at | timestamp | |
| site_id | text | |

#### monetization_offers

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| tool_slug | text | FK to tools |
| program_name | text | Name of affiliate program |
| commission_type | text | `percentage` / `flat` / `recurring` |
| commission_rate | decimal | 0.0–1.0 for percentage programs |
| commission_flat | decimal | Dollar amount for flat programs |
| cookie_window_days | integer | Attribution window |
| recurring_months | integer | Null for non-recurring |
| offer_quality_score | integer | 0–100, calculated weekly by Score layer |
| status | text | `active` / `paused` / `terminated` / `unconfirmed` |
| last_confirmed_at | timestamp | |
| notes | text | Free text for unusual program terms |

#### monetization_res_scores

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| source_id | uuid | FK to `articles.id` or `pseo_pages.id` |
| source_type | text | `article` / `pseo_page` |
| res_score | decimal | 0–100 |
| clicks_per_1000 | decimal | Click rate input |
| offer_quality_score | integer | Best offer on this page at scoring time |
| content_authority_score | integer | Scaled from `gateway_scores.total` |
| conversion_fit_score | integer | From `gateway_scores` `conversion_fit` dimension |
| scored_at | timestamp | |
| site_id | text | |

#### monetization_gaps

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| gap_type | integer | 1 / 2 / 3 / 4 — see Layer 2 |
| source_id | uuid | Page or tool this gap relates to |
| source_type | text | `article` / `pseo_page` / `tool` |
| description | text | Human-readable description of the gap |
| recommended_action | text | What the engine recommends |
| keyword_injected | text | If a keyword was added to queue, which one |
| status | text | `active` / `dismissed` / `resolved` |
| detected_at | timestamp | |
| resolved_at | timestamp | |

#### monetization_sponsors

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| brand_name | text | Sponsor company name |
| placement_type | text | `newsletter` / `article` / `pseo_page` / `sidebar` / `featured_listing` |
| placement_target_id | uuid | FK to article or pseo_page (null for newsletter) |
| stage | text | `prospect` / `contacted` / `negotiating` / `confirmed` / `live` / `completed` / `declined` |
| rate_agreed | decimal | Dollar amount agreed |
| period_start | date | When placement begins |
| period_end | date | When placement ends |
| disclosure_active | boolean | Whether disclosure flag is set on the article |
| invoice_sent_at | timestamp | |
| payment_received_at | timestamp | |

#### monetization_revenue

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| period_start | date | Revenue period start |
| period_end | date | Revenue period end |
| tool_slug | text | FK to tools |
| program_name | text | Affiliate program |
| clicks | integer | Click volume for period |
| conversions | integer | Confirmed conversions (null if estimated) |
| payout | decimal | Actual or estimated revenue |
| source | text | `manual` / `csv_import` / `estimated` |
| entered_at | timestamp | |
| site_id | text | |

#### monetization_weekly_reports

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| report_date | date | Sunday of the reporting week |
| revenue_affiliate_articles | decimal | Estimated from article clicks |
| revenue_affiliate_pseo | decimal | Estimated from pSEO clicks |
| revenue_affiliate_newsletter | decimal | Estimated from newsletter clicks |
| revenue_sponsored | decimal | Confirmed sponsor revenue |
| revenue_total_estimated | decimal | Sum of all channels |
| avg_res_score | decimal | Average RES across all scored content |
| pct_pages_monetized | decimal | Fraction of top-50 pages with active links |
| unconfirmed_offers_count | integer | |
| monthly_target | decimal | Target stored at report time |
| trajectory_status | text | `on_track` / `warning` / `off_track` |
| site_id | text | |

#### monetization_priority_log

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| affiliate_link_id | uuid | FK to `affiliate_links` |
| tool_slug | text | |
| old_priority | integer | Previous value |
| new_priority | integer | New value |
| reason | text | Why the change was made |
| changed_at | timestamp | |
| admin_override | boolean | True if manually set by admin |

### Extended tables (existing — columns added only)

| Table | Columns added |
|---|---|
| affiliate_links | `monetization_priority` (int, default 50), `offer_id` (uuid FK to `monetization_offers`), `click_count_lifetime` (int), `last_clicked_at` (timestamp) |
| articles | `res_score` (decimal), `monetization_flag` (text: null / `unmonetized_gap` / `offer_terminated` / `protected`), `disclosure_required` (boolean) |
| pseo_pages | `res_score` (decimal), `monetization_flag` (text — same values as articles) |
| network_reports | `estimated_revenue_weekly` (decimal), `avg_res_score` (decimal), `active_sponsor_count` (int) |
| site_settings | `monthly_revenue_target` (decimal) — your 90-day revenue target for trajectory tracking |

---

## SECTION 10 — Activation Prompt

Paste this entire block into your Lovable project that already has the Content Engine, pSEO Engine, and Smart Admin Dashboard installed. The prompt detects what exists and adds only what is missing.

> **IMPORTANT:** This prompt uses approximately 2–3 Lovable credits. It detects your existing installation and extends it. It will not overwrite any existing tables, routes, or components.

---

```
Build and activate the Autonomous Monetization Engine v1.0 for this Lovable project.

Before building anything, audit for: (1) affiliate_links table, (2) articles table,
(3) pseo_pages table, (4) generation_log table, (5) site_settings table,
(6) existing /admin route from the Smart Admin Dashboard,
(7) keyword_queue table (Content Engine v2.1),
(8) gateway_scores table (Quality Gateway v1.0),
(9) pseo_pages.search_impressions field (pSEO Engine).

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
   Calculate offer_quality_score weekly:
   Commission rate: top 25% = 35pts, middle 50% = 20pts, bottom 25% = 8pts.
   Cookie window: 90+ days = 20, 30-89 = 14, 7-29 = 7, <7 days = 0.
   Recurring: monthly = 25, annual = 15, one-time = 0.
   Stability: confirmed <30 days = 20, 31-60 = 10, >60 days = 0.
   New offers default to status = 'unconfirmed'.
   Add monetization_priority (int, default 50) to affiliate_links.
   Add offer_id FK to affiliate_links.

3. REVENUE EFFICIENCY SCORING (Sundays 06:00 UTC)
   For every article and pseo_page with at least one affiliate link:
   A. clicks_per_1000 = (clicks 28 days / sessions 28 days) * 1000.
      No traffic data: use quality_score rank as proxy.
   B. offer_quality_score = best monetization_offers record for tools on this page.
   C. content_authority_score = gateway_scores.total / 1.06 (scaled to 100).
      Read gateway_scores table. If no gateway score exists, use quality_score / 1.06.
   D. If gateway_scores.conversion_fit = 0 for this page, cap RES at 35.
      Read conversion_fit field from gateway_scores.dimension_reasons JSONB.
   E. RES = (clicks_per_1000 * offer_quality_score * content_authority_score) / 100.
   F. Write to monetization_res_scores. Update articles.res_score, pseo_pages.res_score.

4. GAP DETECTION (runs after scoring, Sundays 06:15 UTC)
   Type 1: top 25% traffic pages with 0 clicks in 28 days — create gap record.
   Type 2: tools with offer_quality_score >= 70 and < 3 published pages —
     create gap, inject '[tool] review' to keyword_queue priority 80,
     added_by='monetization_engine', intent='commercial'.
     Skip keyword intent classification Gemini call — intent is pre-set.
   Type 3: pages with res_score drop >25 pts vs 90 days ago — create gap.
   Type 4: pseo_pages with search_impressions > 500/mo and no CE article —
     create gap, inject '[tool] review' to keyword_queue priority 85,
     added_by='monetization_engine', intent='commercial'.

5. OFFER PRIORITY ADJUSTMENT (Sundays 06:30 UTC)
   RES >= 66 AND offer_quality_score >= 70: monetization_priority = 90.
   Status = 'terminated': monetization_priority = 0,
     set articles.monetization_flag = 'offer_terminated' for affected articles.
   offer_quality_score < 30: decrement priority by 10 (floor: 20).
   Log all changes to monetization_priority_log with reason.
   Content Engine reads monetization_priority when selecting CTAs at generation time.
   pSEO Engine reads monetization_priority when rendering template CTA slots.

6. SPONSOR PIPELINE
   Create monetization_sponsors table. Add Sponsor Pipeline tab to MONETIZATION
   section with kanban view (7 stages: prospect/contacted/negotiating/confirmed/
   live/completed/declined).
   When sponsor moves to 'live': if placement_target_id set, flag article
   disclosure_required = true. The Content Engine prepends FTC/ASA disclosure
   text before the article body at next refresh — this happens outside the
   gateway scoring payload so it does not affect quality scores.
   If newsletter type, flag newsletter agent to include sponsor slot for weeks
   within period_start to period_end.
   Newsletter slot: check for live sponsor on generation. If found, insert their
   text between article 1 and 2. If not found, insert highest-RES tool CTA.
   Track newsletter clicks as source_type = 'newsletter'.

7. REVENUE ENTRY
   Add revenue entry form to admin: period, tool, program, clicks, conversions, payout.
   Store to monetization_revenue with source='manual'.
   Add CSV import: accept pasted CSV, match to tools by program_name,
   store with source='csv_import'.
   Estimated revenue: clicks_28_days * 0.02 * (avg_tool_price * commission_rate).
   Store as source='estimated'. Show in amber until actuals entered.

8. DAILY REVENUE BRIEF (07:00 UTC via Resend to ALERT_EMAIL)
   Use existing RESEND_API_KEY and ALERT_EMAIL environment variables.
   Do not create new variables.
   Subject: "[Site name] Revenue Brief — [date]"
   Under 100 words: yesterday's estimated revenue + trend vs 7-day average,
   highest priority active alert, one recommended action from Optimize output.

9. WEEKLY SUMMARY (Sundays 09:00 UTC via Resend)
   Runs after Quality Gateway Learn layer (07:00 UTC) completes.
   Revenue by channel, top 10 tools by estimated revenue, revenue by article type,
   monetization health indicators, 30-day trajectory vs site_settings.monthly_revenue_target.
   Store to monetization_weekly_reports.

10. ADMIN PANEL — MONETIZATION SECTION
    Detect via presence of monetization_clicks table at dashboard login.
    Add to Smart Admin Dashboard sidebar between QUALITY GATEWAY and NETWORK REPORTS.
    Five tabs: Revenue Overview, Top Performers, Monetization Gaps, Offer Manager,
    Sponsor Pipeline (see spec Section 07 for full tab descriptions).
    Add to dashboard homepage: Revenue pulse widget + Monetization alerts widget.

11. SMART SUGGESTIONS EXTENSION
    Extend daily Gemini Smart Suggestions call with monetization context.
    Append to existing Smart Suggestions system prompt — do not replace existing
    gateway health and queue depth signals:
    "Also analyse: top 3 high-offer tools (offer_quality_score >= 70) with no CE
    articles; top 3 unmonetized pages by traffic; unconfirmed offers >21 days;
    revenue trajectory vs monthly_revenue_target. Include one monetization
    recommendation in your output."
    Monetization context is only injected if monetization_clicks table exists and
    has at least one row. Skip silently if table is empty.

12. BACKLINK MANAGER INTEGRATION
    Query monetization_res_scores for pages with res_score > 60.
    Write these page IDs to a view or flag in articles/pseo_pages readable by the
    Network Backlink Manager. High-RES pages are link targets, not link sources.

13. DATABASE TABLES
    Create: monetization_clicks, monetization_offers, monetization_res_scores,
    monetization_gaps, monetization_revenue, monetization_sponsors,
    monetization_weekly_reports, monetization_priority_log.
    Extend: affiliate_links, articles, pseo_pages, network_reports, site_settings.

TIMING SEQUENCE (all Sundays):
   06:00 UTC — Score layer (RES calculation)
   06:15 UTC — Gap detection
   06:30 UTC — Optimize layer (priority adjustment + keyword injection)
   07:00 UTC — Quality Gateway Learn layer (existing — not modified)
   08:00 UTC — Newsletter send (existing Content Engine scheduler)
   09:00 UTC — Weekly monetization summary email

AFTER BUILDING: list every table created/extended, every admin section added,
and the click tracking endpoint URL. Confirm affiliate CTAs are wired to tracker.
Confirm monetization_priority is readable by Content Engine CTA selection logic.
Confirm gateway_scores.conversion_fit is readable by RES scoring calculation.
```

---

## SECTION 11 — Setup — Three Questions

Before pasting the activation prompt, answer these three questions. Your answers configure the revenue targets and commission benchmarks used throughout the engine.

### Question 1 — Monthly revenue target

What is your monthly revenue target for this site? This number appears in the weekly summary's trajectory calculation and in the Smart Admin Dashboard revenue health indicator. Set a realistic target for where you want to be in 90 days.

> **INFO:** Add to `site_settings.monthly_revenue_target` before or during the activation prompt run. The admin panel Revenue Overview tab includes a target input field where you can update this at any time — you do not have to get this right on day one.

### Question 2 — Your primary affiliate model

Which commission structure is most common in your niche? This seeds the category benchmarks used by `offer_quality_score` calculations.

| Model | Select | Typical niches |
|---|---|---|
| Monthly recurring SaaS commissions | `saas_recurring` | No-code tools, marketing software, project management |
| SaaS one-time or annual payout | `saas_onetime` | Design tools, certain developer tools |
| High-ticket flat fee programs | `high_ticket_flat` | Enterprise software, financial tools |
| E-commerce percentage commissions | `ecommerce_pct` | Physical products, marketplace platforms |
| Mixed or unclear | `mixed` | Multiple categories or early-stage sites |

### Question 3 — Sponsor readiness

| Status | Select | What activates |
|---|---|---|
| Not ready — traffic too low for direct deals | `pipeline_only` | Sponsor pipeline is built but rate card and outreach tools are disabled until you enable them manually. |
| Ready — traffic established | `active` | Full sponsor pipeline activated from day one, including rate card builder and outreach tracking. |
| Already have sponsors | `active` | Select active, then add existing sponsors manually in the Sponsor Pipeline tab after setup. |

---

## SECTION 12 — Troubleshooting

> **IMPORTANT:** Before spending a Lovable credit on a fix prompt, always check Supabase directly. The `monetization_priority_log` and `monetization_gaps` tables contain more specific diagnostic information than what appears in the admin UI. Most issues can be diagnosed and fixed with a targeted follow-up prompt of under 20 words once you know the exact error.

### Click tracking not recording

- Check that the `/api/affiliate-click` edge function was created — verify in Lovable's edge functions list
- Verify all affiliate CTAs in the frontend are calling this endpoint on click (check the build report)
- Open Supabase and check `monetization_clicks` — if empty after known clicks, the edge function call is failing
- Check Supabase edge function logs for error messages
- The click redirect still happens even if tracking fails — tracking is non-blocking by design

### RES scores not appearing

- RES scoring runs Sundays at 06:00 UTC — check the Supabase cron log for a successful run
- If no traffic data is available (no GSC token), scores still calculate using `quality_score` as proxy — check that articles have `gateway_scores` entries
- Offers must be in `active` status for `offer_quality_score` to contribute — confirm your offers in the Offer Manager tab
- Use the "Run scoring now" button in the Offer Manager tab to force a manual score calculation outside the Sunday schedule

### `conversion_fit` cap not applying

- The RES 35 cap requires `gateway_scores` to exist for the article. If the Quality Gateway v1.0 has not run on a page, no `conversion_fit` score is stored and the cap is not applied
- Check that `gateway_scores` has rows for your articles in Supabase — run a Health Check in the dashboard if the table is empty
- The `conversion_fit` dimension is only present if the Quality Gateway v1.0 upgrade has been applied. If running an older gateway, the cap is skipped and a warning appears in the Offer Manager tab

### `monetization_priority` not affecting Content Engine CTA selection

- Verify the activation prompt build report confirms Content Engine CTA selection logic was updated to read `affiliate_links.monetization_priority`
- Check that `affiliate_links` rows have `monetization_priority` populated — default is 50, not null
- The priority field is read at article generation time, not at publish time. Articles already in the queue will use the priority value set when they generate, not when they were added

### Revenue estimates diverge from actuals

- Estimated revenue uses a 2% default conversion rate until actuals are entered — this is a rough proxy and will diverge from reality for most programs
- Enter at least one month of actual payout data via the Revenue Entry form — the engine calibrates its conversion rate estimate to your site's real rate
- For programs with high ticket values and low conversion rates (enterprise software), the 2% default significantly overestimates revenue — enter actuals as soon as your first payout arrives

### Sponsor disclosure not appearing on articles

- Check that the sponsor is in `live` stage and `period_start` is today or earlier in Supabase
- Verify `disclosure_required = true` is set on the `articles` record in Supabase
- The disclosure text is prepended at the next Content Refresh Agent run — force a refresh of the specific article to apply it immediately
- Confirm the disclosure prepend occurs before the scored content body. If it appears inside the article body, the Quality Gateway may count it against the `no_banned_phrases` dimension — it should be a pre-body header

### Smart Suggestions not including monetization recommendations

- Smart Suggestions requires `GEMINI_API_KEY` and runs once per day at midnight UTC
- Check `smart_actions_log` in Supabase for error messages from the extended prompt
- Monetization context is only included if `monetization_clicks` table exists and has at least one row — the extension is skipped silently if the table is empty or missing

### Sunday schedule conflicts

The recommended timing sequence is: 06:00 Score → 06:15 Gap detection → 06:30 Optimize → 07:00 Gateway Learn → 08:00 Newsletter → 09:00 Weekly summary. If jobs are overlapping, check the Supabase cron configuration and ensure each job has a clear start time with at least 10 minutes of buffer.

---

## Environment variables — no new keys required

| Variable | Set by | Used for |
|---|---|---|
| `GEMINI_API_KEY` | Content Engine | Smart Suggestions extension |
| `RESEND_API_KEY` | Content Engine | Daily revenue brief and weekly summary emails |
| `ALERT_EMAIL` | Content Engine | All monetization email output |
| `SITE_ID` | Content Engine | Multi-site revenue attribution in `network_reports` |
| `SUPABASE_URL` | Prior specs | All database operations |
| `SUPABASE_ANON_KEY` | Prior specs | All database operations |

---

## No new API keys. No new monthly costs.

Drop this into any Lovable project running the Content Engine. Answer three questions. Paste one prompt. Walk away.

---

*Autonomous Monetization Engine — Revenue Intelligence Spec v1.0 · Stupid People Edition · May 2026*
