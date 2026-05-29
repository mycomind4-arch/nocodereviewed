# Autonomous Conversion Rate Optimisation Engine
## CRO Intelligence Spec v1.1 — Personal Stack Edition
**Prepared May 2026 · Confidential**

| Attribute | Value |
|---|---|
| Version | 1.1 |
| Prepared | May 2026 |
| Requires | Audience Engine v1.1 (for baselines — 2 weeks minimum), Monetization Engine v1.1 (for RES scores) |
| Pairs with | Content Engine v2.1, pSEO Engine v1.1, Quality Gateway v1.1, Smart Admin Dashboard v1.2, LLM Abstraction Layer v1.0 |
| New API keys | 0 |
| New ongoing cost | $0/mo |
| LLM calls | 1 per test design (variant generation via Gemini 2.5 Flash) |

---

## What changed in v1.1

| Change | What it fixes |
|---|---|
| Version references corrected | Updated to current spec versions throughout |
| Activation guard hardened | Activation prompt now checks `audience_content_baselines` row count AND sets `cro_engine_status = 'awaiting_baseline'` in `dashboard_settings` if insufficient data. Select layer does not run until status is changed to `active`. |
| LLM abstraction noted | Variant generation uses `engine='cro_design'` from `llm_config`. Switch model independently from content generation. |
| Daily ceiling noted | CRO variant generation calls count toward the 50-call daily ceiling — documented explicitly. |
| Product-sale framing removed | |

---

## Contents

| Section | Title |
|---|---|
| 01 | What this is |
| 02 | Architecture overview |
| 03 | Layer 1 — Select |
| 04 | Layer 2 — Design |
| 05 | Layer 3 — Run |
| 06 | Layer 4 — Measure |
| 07 | Layer 5 — Apply |
| 08 | What can be tested |
| 09 | Admin panel additions |
| 10 | Integration with existing specs |
| 11 | Database schema |
| 12 | Activation prompt |
| 13 | Setup — two questions |
| 14 | Troubleshooting |

---

## Section 01 — What this is

The Monetization Engine scores every page's revenue efficiency and surfaces gaps. The Audience Engine explains which reader cohorts are engaging with which content. What neither engine does is systematically change anything on the page and measure whether the change improved conversion.

Without testing, the stack can identify that a page is underperforming but cannot learn what would make it perform better. Every optimisation decision is made by assumption. Some assumptions are right. Many are wrong. None are ever confirmed.

This engine closes that loop. It selects pages worth testing, designs variants based on what the data suggests might be wrong, runs controlled tests with proper statistical handling, measures outcomes against established baselines, and applies winning variants automatically. It then feeds what it learned back into the Content Engine so future articles are generated with proven patterns rather than assumptions.

**Critical prerequisite:** The Audience Engine must have been running for at least 2 weeks before this engine can run its first test. The `audience_content_baselines` table is the control group — without a stable baseline, there is no meaningful control to test against.

---

## Section 02 — Architecture overview

Five layers. One test at a time per page. A growing pattern library applied to every future article.

| Layer | Name | What it does | When it runs |
|---|---|---|---|
| 1 | Select | Identifies test candidates by traffic, RES, and baseline stability. Prioritises by revenue impact. | Sunday 05:30 UTC |
| 2 | Design | Generates one variant per selected test using Gemini. One element per test. | Sunday 05:45 UTC |
| 3 | Run | Serves variant to a statistically defined split of sessions. Server-side rendering — no flicker. | Continuous during test period |
| 4 | Measure | Checks running tests weekly for statistical significance. | Sunday 05:30 UTC (before Select) |
| 5 | Apply | Applies winning variants permanently. Writes winning pattern to pattern library. Feeds proven patterns into Content Engine. | On significance confirmation |

### What this engine does NOT do

- Run multiple simultaneous tests on the same page
- Test structural changes that would affect Quality Gateway scores
- Automatically discard losing variants without admin visibility
- Use third-party A/B testing JavaScript libraries

---

## Section 03 — Layer 1 — Select

Runs Sundays at 05:30 UTC, after Audience Engine Feed completes at 05:00 UTC. Measure runs first, then Select.

### Candidate qualification criteria

| Criterion | Requirement | Why |
|---|---|---|
| Traffic volume | Minimum 200 sessions in past 28 days | Below this, tests run for months and still don't reach significance |
| Baseline stability | At least 2 weeks of data in `audience_content_baselines` with < 20% week-over-week variance | Unstable baselines produce false signals |
| No active test | `cro_tests.status != 'running'` for this page | One test per page at a time |
| Not recently tested | No completed test in past 60 days | Allow organic behaviour to stabilise before re-testing |

### Test prioritisation

```
test_priority_score = (1 - (res_score / 100)) × session_count_28d × traffic_quality_multiplier
```

`traffic_quality_multiplier` read from `audience_res_adjustments`. A high-traffic page with low RES and high-quality traffic is the highest priority test target.

Engine selects top 3 candidates per weekly cycle. If test backlog already has 3+ pending tests, no new tests are created until backlog clears.

### Test type assignment

| Condition | Test type | Reasoning |
|---|---|---|
| `conversion_fit` score = 0 or low | `cta_placement` | CTA isn't visible or well-positioned |
| High scroll depth but low conversion | `cta_copy` | Readers consuming but not clicking — CTA copy issue |
| High bounce rate | `headline` | Headline isn't matching reader expectation |
| Low scroll depth (< 40% average) | `article_structure` | Readers leaving before CTA is seen |
| Strong content but weak offer metrics | `offer_positioning` | Offer not being presented compellingly |
| pSEO page with low quality_score | `template_section` | Template element underperforming |

---

## Section 04 — Layer 2 — Design

Runs Sundays at 05:45 UTC.

### Variant generation

For each newly selected test, one variant is generated using Gemini via the LLM Abstraction Layer (`engine='cro_design'` from `llm_config`). If no `cro_design` row exists in `llm_config`, create one defaulting to Gemini 2.5 Flash.

**LLM calls count toward the 50-call daily ceiling per site.** At 3 active tests per cycle, variant design adds a maximum of 3 calls per Sunday. This is within the ceiling for standard publishing schedules. If the ceiling is regularly being hit, raise `site_settings.daily_llm_ceiling` in the admin panel.

#### Variant generation prompt structure

```
You are generating a single variant for an A/B test on a content affiliate site.

PAGE CONTEXT:
- Article type: [article_type]
- Primary tool reviewed: [tool_slug]
- Current conversion rate: [X]% (site average: [Y]%)
- Primary reader cohort: [cohort_description]
- Test type: [test_type]

CURRENT ELEMENT:
[current element text/HTML]

PATTERN LIBRARY (previously winning variants for this test type):
[top 3 winning patterns from cro_pattern_library for this test_type and article_type]

CONSTRAINTS:
- Match the existing article's voice exactly
- Do not introduce any banned phrases from site_settings.banned_phrases
- Do not change the article's factual claims
- The variant must be clearly different from the control — not a minor wording tweak
- Do not add more than 50 words to the element being tested

Generate exactly one variant. Return only the variant text/HTML with no explanation.
```

Variants stored in `cro_variants` with status `pending_review`.

### Admin approval gate

All variants require admin approval before the test goes live. This is not optional.

1. Gemini occasionally produces variants that are technically different but practically meaningless
2. Some variants may conflict with sponsor agreements or brand guidelines
3. You should know what is being tested on your site

The TESTS tab shows all pending variants with control vs variant side-by-side. One-click approve or reject. Tests do not start automatically — they start when you approve the variant. Reviewing all pending variants takes approximately 2 minutes per test once per week.

---

## Section 05 — Layer 3 — Run

### Traffic splitting

50/50 split. Server-side rendering — split decision made at edge function level before page HTML is assembled. No client-side content swap. No layout shift.

```
test_group = (hash(session_token + test_id) % 100) < 50 ? 'control' : 'variant'
```

Session token ensures each visitor sees the same version throughout a session. Test ID in the hash ensures different tests on different pages assign traffic independently.

### Elements that can be swapped server-side

| Test type | Element location | How it's swapped |
|---|---|---|
| `cta_placement` | CTA button position (in_body / see_also / end_of_article) | CSS class swap per group |
| `cta_copy` | CTA button text and surrounding sentence | Text node replacement |
| `headline` | H1 and meta title | String replacement |
| `article_structure` | Section order (verdict first vs last) | Section block reordering |
| `offer_positioning` | Affiliate offer presentation block | Block HTML replacement |
| `template_section` | pSEO page section | Section HTML replacement |

### Test duration

- Minimum: 14 days regardless of significance (prevents false positives from day-of-week effects)
- Maximum: 56 days (tests not reaching significance after 8 weeks logged as `inconclusive`)
- Minimum sessions per group before significance check: 100

---

## Section 06 — Layer 4 — Measure

Runs Sundays at 05:30 UTC, before Select.

### Primary metric

`affiliate_conversion_rate` — percentage of sessions on the test page that include at least one affiliate click.

```
relative_lift = (conversion_rate_variant - conversion_rate_control) / conversion_rate_control
```

### Statistical significance

Two-proportion z-test. Runs in Supabase — no LLM call.

```
p_value = two_proportion_z_test(
  conversions_control, sessions_control,
  conversions_variant, sessions_variant
)
```

Significance threshold: p < 0.05.

**Positive conclusion:** p < 0.05 AND minimum 14 days elapsed AND both groups have ≥ 100 sessions AND relative_lift ≥ +5%.

**Negative conclusion:** p < 0.05 with negative lift AND minimum 14 days elapsed, OR maximum duration (56 days) elapsed without significance.

### Secondary metrics (recorded but don't determine outcome)

| Metric | Source | What it tells you |
|---|---|---|
| Average scroll depth | `audience_events` by test group | Whether variant changes engagement depth |
| Average time on page | `audience_events` by test group | Whether variant speeds or slows the buyer journey |
| Newsletter signup rate | `audience_sessions.did_signup_newsletter` by group | Whether a CTA change affects signups — a CTA that improves affiliate clicks but kills signups is a net loss |
| Bounce rate | Single-page sessions / total sessions by group | Whether variant affects first impressions |

---

## Section 07 — Layer 5 — Apply

Triggered on significance conclusion — not on a fixed schedule.

### When variant wins

1. Variant element permanently replaces control in `articles.body_html` or `pseo_pages.body_html` for that specific element only
2. Test marked `status = applied`
3. Winning variant written to `cro_pattern_library` with `outcome = 'winner'`
4. Pattern instruction written to `cro_content_engine_patterns`
5. Pattern instruction appended to `site_settings.master_generation_prompt` for the relevant article type. `generation_prompt_version` incremented.
6. If pSEO page type test: written to `cro_pseo_template_patterns`. All pSEO pages of that type flagged for regeneration in next weekly refresh.
7. Estimated monthly revenue impact calculated: `sessions_per_month × (cvr_variant - cvr_control) × avg_commission`
8. Win alert sent to `ALERT_EMAIL` with lift, significance, revenue impact estimate

### When control wins

1. No page change
2. Test marked `status = applied`
3. Losing pattern written to `cro_pattern_library` with `outcome = 'loser'`
4. Result alert sent to `ALERT_EMAIL`

### The pattern library

Every test result — winner or loser — is written to `cro_pattern_library`. Losers are just as valuable as winners because they prevent repeating failures.

### Feeding winners into the Content Engine

After each winning variant is applied, a plain-language pattern instruction is written to `cro_content_engine_patterns`. The Content Engine reads this table when generating new articles of the same type.

Examples:

| Test result | Pattern written | Effect on Content Engine |
|---|---|---|
| Moving verdict to top of article improved conversion 23% | `article_structure: verdict_first = winner for tool_review` | Generation prompt: "Lead with verdict in first 150 words." |
| CTA copy "Try [Tool] free — no credit card" outperformed "Visit [Tool]" by 31% | `cta_copy: free_trial_emphasis = winner` | Affiliate CTA template updated with winning copy pattern |
| Pricing table before pros/cons improved conversion 18% for `price_checker` cohort | `article_structure: pricing_table_position = early for price_checker cohort` | Generation prompt includes pricing placement instruction for commercial-intent keywords |

**Pattern application to the Content Engine prompt increments `generation_prompt_version` automatically.** The Quality Gateway's Learn layer can then correlate the prompt version change with any subsequent changes in pass rates or conversion performance.

If `network_pattern_sharing = 'network'` (set in Section 13 Question 2), winning pattern instructions are broadcast to all sites in `network_domains` via the `network_reports` shared table. Pattern instruction text only is shared — not the specific variant HTML. Each site's Content Engine generates its own implementation in its own voice.

---

## Section 08 — What can be tested

### Content Engine articles

| Test type | What changes | What does not change |
|---|---|---|
| `cta_placement` | Position of affiliate CTA button | Article body text, headline, meta description |
| `cta_copy` | CTA button text and surrounding sentence | Article body, destination URL |
| `headline` | H1 tag and meta title | Article body, meta description |
| `article_structure` | Order of major sections | Section content, headline, CTAs |
| `offer_positioning` | How the affiliate offer is framed in body | Factual accuracy of pricing claims (validated against tools table) |

### pSEO pages

| Test type | What changes | What does not change |
|---|---|---|
| `template_section` | Order or emphasis of a template section | Factual data from tools table |
| `cta_copy` | CTA button text on primary affiliate button | Destination URL |
| `headline` | H1 and meta title pattern for a page type | Winning pattern applied to all pages of that type on next weekly refresh |

**pSEO headline test leverage:** A winning headline pattern for a page type (e.g. `tool_vs_tool`) is applied to all pages of that type on the next weekly refresh. One test result improves hundreds of pages.

### What cannot be tested

- Factual content claims — pricing, features, pros/cons come from the tools table
- Quality Gateway dimensions — tests constrained to elements outside scored content body
- Sponsored content disclosure — legally required disclosures cannot be tested
- Multiple elements simultaneously — one element per test per page

---

## Section 09 — Admin panel additions

CRO section detected via presence of `cro_tests` table. Placement: between MONETIZATION and NETWORK REPORTS.

### Four tabs in the CRO section

| Tab | What it contains |
|---|---|
| Tests | All active, pending, and recently completed tests. Pending variants show control vs variant with Approve / Reject buttons. Current sessions per group, conversion rates, p-value, days running. |
| Results | All completed tests: lift, significance, secondary metrics, control and variant elements. Filter by test type, article type, outcome. "Apply to Content Engine prompt" button for winners not yet applied. |
| Pattern Library | All `cro_pattern_library` entries: winners and losers organised by test type and article type. Shows how many articles have been generated using each winning pattern. Export as JSON. |
| Settings | Minimum session threshold (default 200). Minimum test duration (default 14 days). Maximum test duration (default 56 days). Significance threshold (default p < 0.05). Minimum lift for positive conclusion (default 5%). Pause all tests toggle. |

---

## Section 10 — Integration with existing specs

### Audience Engine v1.1 — 2 integration points (REQUIRED)

| Integration | What it does |
|---|---|
| Baseline data | `audience_content_baselines` provides pre-test conversion rate, scroll depth, and time on page for every candidate page. Without at least 2 weeks of baseline data, no test can run. |
| Cohort context for variant design | Design layer reads the page's primary cohort from `audience_content_performance` and includes it in the variant generation prompt. A `price_checker` page gets a differently designed variant than a `researcher` page. |

### Monetization Engine v1.1 — 2 integration points

| Integration | What it does |
|---|---|
| Test candidate prioritisation | `monetization_res_scores.res_score` is the primary input to `test_priority_score`. Low-RES, high-traffic pages are highest priority. |
| Revenue impact calculation | When a test reaches significance, estimated monthly revenue impact is calculated using `monetization_offers.avg_commission`. Shown in win alert and test results. |

### Content Engine v2.1 — 2 integration points

| Integration | What it does |
|---|---|
| Pattern library feed | Winning variants written to `cro_content_engine_patterns`. Content Engine reads this table when generating articles of the corresponding type. Prompt version increments on each pattern application. |
| Headline test constraints | Headline test variants are generated using Content Engine's banned phrases list and voice baseline. Variants that would trigger quality gateway failures are rejected at design time. |

### Quality Gateway v1.1 — 1 integration point

| Integration | What it does |
|---|---|
| Variant pre-screening | Before any variant goes to admin approval, it is pre-screened against the Gateway's banned phrases list and structural minimums. Variants that would fail the gateway are rejected at design time and regenerated once. This prevents a winning CTA copy from accidentally containing a banned phrase that would contaminate future generated content using that pattern. |

### pSEO Engine v1.1 — 1 integration point

| Integration | What it does |
|---|---|
| pSEO template pattern application | Winning `template_section` and `headline` test variants applied to all pSEO pages of the same type during the next weekly refresh. pSEO Engine's weekly refresh agent reads `cro_pseo_template_patterns` before regenerating pages. |

### Smart Admin Dashboard v1.2 — 2 integration points

| Integration | What it does |
|---|---|
| CRO sidebar section | Detection engine scans for `cro_tests` table and activates CRO section. |
| Smart Suggestions extension | Weekly pattern library summary appended to Smart Suggestions context: active test count, most recent win/loss, highest-lift pattern, pages awaiting first test. |

---

## Section 11 — Database schema

### New tables

**cro_tests** — test records (source_id, source_type, test_type, article_type, status, test_priority_score, started_at, ended_at, site_id).

**cro_variants** — control and variant elements (test_id, group_name, element_type, element_content, created_by, approved_at, approved_by).

**cro_session_assignments** — session-to-test-group assignments (test_id, session_id, group_name, converted, scroll_depth, time_on_page, did_signup, assigned_at).

**cro_test_results** — statistical results snapshots (test_id, sessions_control, sessions_variant, conversions_control, conversions_variant, conversion_rate_control, conversion_rate_variant, relative_lift, p_value, secondary_metrics JSONB, calculated_at, is_final).

**cro_pattern_library** — all test outcomes (test_type, article_type, control_element, variant_element, relative_lift, p_value, sessions_in_test, primary_traffic_source, outcome, applied_to_prompt, articles_generated_with_pattern, site_id, completed_at).

**cro_content_engine_patterns** — plain-language instructions for Content Engine prompt (pattern_library_id, article_type, pattern_instruction, prompt_version_applied, active, created_at).

**cro_pseo_template_patterns** — winning pSEO section templates (pattern_library_id, pseo_page_type, section_name, winning_template_html, pages_updated_count, applied_at).

### Extended tables (existing — columns added only)

| Table | Columns added |
|---|---|
| `articles` | `active_test_id` (uuid FK to cro_tests), `cro_lift_history` (jsonb) |
| `pseo_pages` | Same two columns |
| `site_settings` | `cro_patterns_applied_count` (integer), `cro_engine_status` (text: `awaiting_baseline` / `active`) |

---

## Section 12 — Activation prompt

Paste into your Lovable project after Content Engine v2.1, pSEO Engine v1.1, Monetization Engine v1.1, Audience Engine v1.1, and Smart Admin Dashboard v1.2 are installed, AND after the Audience Engine has been running for at least 2 weeks.

```
Build and activate the Autonomous CRO Engine v1.1 for this Lovable project.

Before building anything, audit for: (1) audience_content_baselines table,
(2) audience_sessions table, (3) monetization_res_scores table,
(4) articles table, (5) pseo_pages table, (6) keyword_queue table,
(7) site_settings table with generation_prompt_version, (8) gateway_scores table,
(9) existing /admin route, (10) llm_config table.

CRITICAL PRE-CHECK:
Query audience_content_baselines for rows where
baseline_date <= (NOW() - INTERVAL '14 days').
Count the distinct source_id values with at least 2 baseline rows.
If count = 0: build all tables and admin panel but set
  dashboard_settings.cro_engine_status = 'awaiting_baseline'
  AND site_settings.cro_engine_status = 'awaiting_baseline'.
  Do NOT activate the Select layer or Design layer schedulers.
  Display prominent notice in CRO admin panel:
  "Waiting for Audience Engine baseline data.
  Select and Design layers will activate automatically once 2 weeks of
  baselines are available. Check back next Sunday."
  Set up a check that runs every Sunday before 05:30 UTC: if
  audience_content_baselines now has qualifying rows, set
  cro_engine_status = 'active' and activate the schedulers.
If count > 0: proceed with full activation.

For each found component: extend with new columns only.
For each missing: build foundational version.

1. SERVER-SIDE TEST RENDERING
   Modify page rendering for /blog/[slug] and all pSEO routes.
   On each page request:
   - Query cro_tests for any test with source_id matching this page
     and status = 'running'. Only runs if cro_engine_status = 'active'.
   - If test found: compute test_group = (hash(session_token + test_id) % 100)
     < 50 ? 'control' : 'variant'. Read session_token from sessionStorage via
     first-paint inline script (< 100 bytes) passed as request header.
   - Look up or create cro_session_assignments row for this session+test.
   - If group = 'variant': swap element defined in cro_variants for this test.
     Swap is server-side string/block replacement — no client JS, no flicker.
   - If no test running: render page normally.

2. CONVERSION EVENT LISTENER
   When audience_events.affiliate_click fires for a session that has a
   cro_session_assignments record: update cro_session_assignments.converted = true.

3. TEST SELECT + MEASURE (Sundays 05:30 UTC — only runs if cro_engine_status = 'active')
   MEASURE FIRST:
   For all tests with status = 'running':
     Count sessions and conversions per group from cro_session_assignments.
     If both groups have >= 100 sessions AND >= 14 days elapsed:
       Run two-proportion z-test on conversion rates.
       If p < 0.05 AND relative_lift >= 0.05: status = 'significant_positive'.
       If p < 0.05 AND relative_lift < 0: status = 'significant_negative'.
       If days elapsed >= 56: status = 'inconclusive'.
       Write to cro_test_results with is_final = true.
       Trigger Apply layer immediately (see step 5).

   THEN SELECT:
   Query articles and pseo_pages for test candidates:
     Session count >= 200 from audience_sessions in past 28 days.
     At least 2 baseline rows in audience_content_baselines, both
     with baseline_date more than 14 days ago.
     No cro_test with status in ('running', 'pending_approval') for this page.
     No cro_test completed in past 60 days for this page.
   Score: (1 - res_score/100) * session_count_28d *
     coalesce(traffic_quality_multiplier from audience_res_adjustments, 1.0).
   Select top 3 by score. Create cro_tests with status = 'pending_approval'.
   Assign test_type based on RES breakdown and audience cohort data.

4. VARIANT DESIGN (Sundays 05:45 UTC — only runs if cro_engine_status = 'active')
   For each new test with status = 'pending_approval':
   A. Read current element based on test_type.
   B. Read primary cohort from audience_content_performance for this page.
   C. Read top 3 winning patterns from cro_pattern_library for this test_type
      and article_type where outcome = 'winner'.
   D. Read banned_phrases from site_settings.
   E. Call LLM via llm_config where engine = 'cro_design' (default: gemini-2.5-flash).
      If no cro_design row in llm_config, create one defaulting to gemini-2.5-flash.
      This call counts toward site_settings.daily_llm_ceiling.
   F. Pre-screen variant against banned phrases and structural minimums.
      If variant fails: regenerate once. If fails again: mark test 'design_failed',
      notify admin in CRO panel.
   G. Write control and variant to cro_variants with status = 'pending_review'.
   H. Send alert to ALERT_EMAIL listing pages and test types awaiting approval.

5. APPLY LAYER (triggered immediately on significance conclusion)
   IF significant_positive:
     A. Swap variant element permanently into body_html for specific element only.
     B. Mark test status = 'applied'.
     C. Write to cro_pattern_library with outcome = 'winner'.
     D. Generate pattern_instruction. Write to cro_content_engine_patterns.
     E. Append pattern_instruction to master_generation_prompt for the article_type.
        Increment generation_prompt_version in site_settings.
     F. If pseo page type test: write to cro_pseo_template_patterns.
        Flag all pseo_pages of that type for regeneration next weekly refresh.
     G. If site_settings.network_pattern_sharing = 'network':
        Write pattern_instruction to network_reports as network_cro_pattern
        for broadcast to other sites in network_domains.
     H. Calculate revenue impact. Send win alert to ALERT_EMAIL.

   IF significant_negative OR inconclusive:
     No page change. Mark 'applied'. Write to pattern_library. Send result alert.

6. ADMIN PANEL — CRO SECTION
   Detect via cro_tests table. Add CRO between MONETIZATION and NETWORK REPORTS.
   Four tabs: Tests, Results, Pattern Library, Settings.
   If cro_engine_status = 'awaiting_baseline': show prominent status panel
   at the top of all tabs explaining that tests will activate once baselines
   are established. Show current baseline_date count and required count.
   Tests tab shows pending approvals prominently with Approve/Reject buttons.

7. SMART SUGGESTIONS CONTEXT
   Write weekly CRO summary readable by Smart Suggestions:
   active test count, tests awaiting approval, most recent win with lift,
   highest-lift pattern, pages with no test in 60+ days.

8. DATABASE TABLES
   Create: cro_tests, cro_variants, cro_session_assignments, cro_test_results,
   cro_pattern_library, cro_content_engine_patterns, cro_pseo_template_patterns.
   Extend: articles, pseo_pages, site_settings (add cro_engine_status column).

FULL SUNDAY TIMING SEQUENCE:
   04:00 UTC — Audience segmentation
   04:30 UTC — Audience analysis
   05:00 UTC — Audience feed (must complete by 05:30 UTC)
   05:30 UTC — CRO Measure + CRO Select
   05:45 UTC — CRO Design
   06:00 UTC — Monetization Score layer
   06:15 UTC — Monetization gap detection
   06:30 UTC — Monetization Optimize layer
   07:00 UTC — Quality Gateway Learn layer
   08:00 UTC — Newsletter send
   09:00 UTC — Monetization weekly summary
   09:30 UTC — Audience weekly digest

AFTER BUILDING: confirm server-side test rendering active on /blog/[slug] and
all pSEO routes. Confirm cro_engine_status is set correctly based on baseline
check. Confirm cro_session_assignments is populated when sessions hit pages
with running tests. Confirm variant generation calls count toward daily ceiling.
Confirm pattern application increments generation_prompt_version.
```

---

## Section 13 — Setup — two questions

### Question 1 — Test aggressiveness

| Setting | Select | What it means |
|---|---|---|
| Conservative — 1 active test at a time | `conservative` | Only the single highest-priority candidate is tested. Slower learning but cleaner data. |
| Standard — 3 active tests at a time | `standard` | Default. Top 3 candidates run simultaneously on different pages. Tests on different pages do not share sessions. |
| Aggressive — 5 active tests at a time | `aggressive` | For high-traffic sites (5,000+ sessions/week). Pattern library fills faster. Only select this with consistent traffic across many pages. |

### Question 2 — Pattern application scope

| Setting | Select | What it means |
|---|---|---|
| This site only | `site` | Winning patterns applied to this site's Content Engine prompt and pSEO templates only. |
| All sites in network | `network` | Winning patterns broadcast to all sites in `network_domains` via `network_reports`. Each site's Content Engine generates its own implementation in its own voice. |

Network pattern sharing sends the pattern instruction text only — not the specific variant HTML. A "verdict-first" pattern discovered on Site A instructs Site B's Gemini to lead with the verdict in its own voice, not to copy Site A's exact wording.

---

## Section 14 — Troubleshooting

**Before spending a Lovable credit on a fix prompt:** check `cro_test_results` and `cro_session_assignments` in Supabase. Most test anomalies are explained by uneven traffic split or tests starting during unusual traffic periods.

**Tests not being selected** — Check `audience_content_baselines` has at least 2 rows per page with dates more than 14 days apart. Check `monetization_res_scores` has rows — pages without RES scores have no priority score. Check `cro_engine_status = 'active'` in `site_settings`. If site traffic is below 200 sessions/page in 28 days, lower the minimum threshold in CRO Settings tab.

**Variants not appearing (control always served)** — Check `cro_tests.status` — if `pending_approval`, admin has not approved it yet. Verify server-side rendering modification was applied to page routes. Check `cro_session_assignments` in Supabase — if no rows, assignment logic is not running.

**Tests not reaching significance after many weeks** — Check session counts per group in `cro_test_results`. If both groups have fewer than 100 sessions after 4+ weeks, the page has insufficient traffic. Stop test and lower minimum threshold. A p-value stuck above 0.3 after 500+ sessions per group means the variant isn't different enough from the control to produce a detectable effect. Design a more distinctive variant.

**Winning pattern not appearing in Content Engine output** — Check `cro_content_engine_patterns.active = true`. Verify `generation_prompt_version` incremented when pattern was applied. Check `master_generation_prompt` in site_settings contains the pattern instruction. New articles generated after the prompt version increment will use the pattern — articles already in the queue will not, unless re-queued.

**pSEO pages not updating after template pattern win** — Template pattern wins applied during next weekly refresh (Mondays 08:00 UTC). Check `cro_pseo_template_patterns` has a row with the correct `pseo_page_type`. Verify pSEO Engine refresh agent reads `cro_pseo_template_patterns`.

**`cro_engine_status` stuck at `awaiting_baseline`** — Check `audience_content_baselines` in Supabase. The weekly check runs every Sunday before 05:30 UTC. If baselines are present but status hasn't updated, trigger a manual status check by running the pre-check query: `SELECT COUNT(DISTINCT source_id) FROM audience_content_baselines WHERE baseline_date <= NOW() - INTERVAL '14 days'`. If count > 0, update `site_settings.cro_engine_status = 'active'` directly in Supabase.

---

## Environment variables — no new keys required

| Variable | Set by | Used for |
|---|---|---|
| `GEMINI_API_KEY` | Content Engine | Variant generation (1 call per test design) |
| `RESEND_API_KEY` | Content Engine | Test approval notifications and win alerts |
| `ALERT_EMAIL` | Content Engine | All CRO email output |
| `SITE_ID` | Content Engine | Multi-site pattern sharing |
| `SUPABASE_URL` | Prior specs | All database operations |
| `SUPABASE_ANON_KEY` | Prior specs | All database operations |
