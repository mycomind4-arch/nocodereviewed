# Autonomous Smart Admin Dashboard
## v1.2 — Personal Stack Edition
**Prepared May 2026 · Confidential**

| Attribute | Value |
|---|---|
| Version | 1.2 |
| Prepared | May 2026 |
| Compatibility | Any Lovable project with Supabase enabled |
| Pairs with | All stack engines — this is the unified control center |
| Network scope | 4–6 sites |
| Operating mode | Multi-site (aggregates data from all sites in the network) |

---

## What changed in v1.2

| Change | What it fixes |
|---|---|
| Detection for 3 new engines | Monetization, Audience, and CRO engines now detected and activate their sections automatically |
| LLM Settings section | Full per-engine model management, cost tracking, and provider switching |
| `network_reports` schema updated | Surfaces `revenue_this_week`, `top_earning_tool`, `estimated_api_cost_usd`, `llm_model_used` |
| Smart Suggestions updated | Includes gateway health, audience signals, monetization gaps |
| Network Backlink Manager retained | Full spec included — valuable for multi-site network |
| Data Quality Guardian section | New detection and display for DQG health scores |
| System Health Monitor section | New detection for the independent watchdog engine |

---

## Contents

| Section | Title |
|---|---|
| 01 | How to use this document |
| 02 | What this builds |
| 03 | Setup — three questions |
| 04 | The Lovable activation prompt |
| 05 | Detection & auto-wiring system |
| 06 | Universal dashboard overview |
| 07 | Modular sections |
| 08 | LLM settings section |
| 09 | Smart cross-system features |
| 10 | Quality gateway integration |
| 11 | Multi-site network mode |
| 12 | Database schema |
| 13 | Security & access control |
| 14 | Network backlink manager |
| 15 | Troubleshooting |

---

## Section 01 — How to use this document

Upload to a Lovable project that already has the Content Engine installed. This dashboard scans your entire Supabase schema, detects every engine that has been activated, and builds a unified command center at `/admin`.

**Install order:** Activate after Content Engine and Quality Gateway. The dashboard detects whatever engines are present at activation time — engines installed later are detected automatically on the next login (detection runs on every login).

If upgrading from v1.1: the activation prompt includes detection logic. It upgrades what exists and skips what is already working.

---

## Section 02 — What this builds

| Component | Description |
|---|---|
| Admin dashboard | Responsive UI at `/admin`, protected by Supabase Auth. Dark-mode-first, professional sidebar. |
| Detection engine | Scans entire Supabase schema on activation and on every login. Finds every engine, wires them together. |
| Unified overview | Real-time widgets: daily pulse, quality health, revenue summary, content funnel, queue status, top performers, alerts. |
| Modular sections | Dynamic menu showing only sections relevant to detected engines. |
| LLM settings | Per-engine model management, cost tracking, provider switching — one place to control all API usage. |
| Smart automation | Cross-system tools working across all engines. |
| Aggregated logging | All failure logs, generation logs, quality scores, indexing status in one searchable place. |
| Multi-site reporting | Network-wide metrics across all 4–6 sites. |

---

## Section 03 — Setup — three questions

### Question 1 — Dashboard name

What should the dashboard be called? Appears in the sidebar header, browser tab, and email alerts.

Example: `NoCode Network Command Center`

### Question 2 — Site identity block

Paste your primary site's five-sentence identity block. Used by Smart Suggestions to generate context-aware recommendations.

### Question 3 — Operating mode

Set to `multi-site`. You are running a 4–6 site network. All stats and controls are available per-site and aggregated across the network.

---

## Section 04 — The Lovable activation prompt

Replace the three `[BRACKETED]` sections. Paste as a single message.

```
Build and activate Autonomous Smart Admin Dashboard v1.2 for this Lovable project.

First perform full system detection for:
- Content Engine components (articles, keyword_queue, generation_log, site_settings,
  phrase_frequency_log, voice_baseline, gateway_scores)
- Programmatic SEO Engine (pseo_pages, tools table, pseo_quality_log)
- Quality Gateway (gateway_scores, gateway_weight_log, phrase_harvest_queue)
- Monetization Engine (monetization_clicks, monetization_offers, monetization_gaps)
- Audience Engine (audience_sessions, audience_cohorts, audience_content_baselines)
- CRO Engine (cro_tests, cro_variants, cro_pattern_library)
- Data Quality Guardian (dqg_tools_health, dqg_run_log)
- System Health Monitor (system_health_log, health_alerts)
- LLM Abstraction Layer (llm_config table)
- Affiliate links system (affiliate_links table with monetization_priority)
- Network Backlink Manager (network_domains, network_links)
- Existing admin routes or panels
- All network_reports rows and what columns are present

For every system found: intelligently integrate and upgrade into the new dashboard.
For anything missing: build clean foundational components with "Install this engine"
cards pointing to the relevant spec document.

DASHBOARD NAME: [YOUR DASHBOARD NAME]
SITE IDENTITY BLOCK: [PASTE YOUR PRIMARY SITE'S FIVE SENTENCES]
MODE: multi-site

Build the dashboard at /admin, protected by Supabase Auth.

CREATE THE FOLLOWING SECTIONS:

1. COMMAND CENTER (homepage — always present)
Real-time widgets:
- Daily Pulse: articles + pSEO pages published today and this week. Trend vs same
  day last week. Per-site breakdown in multi-site mode.
- Quality Health: overall gateway pass rate %. 7-day trend chart. Amber below 70%.
  Shows per-engine breakdown (Content Engine vs pSEO Engine).
- Revenue Summary: total estimated revenue this week from network_reports.
  Top earning tool. Total affiliate clicks today. (Shows only if Monetization
  Engine detected.)
- Content Funnel: pSEO impressions → article traffic → affiliate conversions.
  Requires GSC token.
- Queue Status: keywords pending in Content Engine queue. pSEO page generations
  queued. Days of runway remaining.
- Top Performers: combined ranking by traffic and affiliate clicks.
- Active Alerts: red/yellow/green summary. Click any alert to jump to failure log.
- System Health: all engines status, last run times, next scheduled runs,
  API ceiling status, current month estimated API cost.
- API Cost Widget: total estimated LLM spend this month across all engines and
  sites. Breakdown by provider. (Reads from generation_log.estimated_cost_usd.)

2. LLM SETTINGS (always present)
Critical section — surfaces in sidebar above Content Settings.

Per-engine model selector table:
- Rows: Content generation, Quality scoring, Intent classification,
  Smart suggestions, pSEO assembly (if detected), Newsletter generation
- Columns: current provider, current model, estimated cost/1000 calls,
  switch dropdown, test button
- Switch dropdown options: Gemini 2.5 Flash, Gemini 2.5 Pro,
  Claude Sonnet (claude-sonnet-4-20250514), GPT-4o (gpt-4o-2024-11-20)
- Switching any model writes to llm_config table and takes effect on next run.
  No redeployment needed.

API key status panel:
- Gemini: green if GEMINI_API_KEY set and tested, red if missing
- Anthropic: green if ANTHROPIC_API_KEY set and tested, grey if not configured
- OpenAI: green if OPENAI_API_KEY set and tested, grey if not configured

Cost tracker:
- This month's total across all engines and all sites
- Breakdown: by engine, by provider, by site
- Projected monthly total based on current daily average
- 30-day trend chart

Model performance comparison (populated after 30+ articles per model):
- Pass rate by model (gateway pass rate for articles generated by each model)
- Average quality score by model
- Average targeted retry rate by model

3. TOOLS DATABASE MANAGER (always present)
Single source of truth for all tools data. Powers Content Engine and pSEO Engine.
- Full tools table with inline editing
- Completeness score per tool (0–100%) — fields populated / total fields
- Fields missing highlighted amber
- Data Quality Guardian scores per tool (if DQG detected)
- Generate pSEO pages button per tool
- Bulk CSV import

4. AFFILIATE LINK MANAGER (always present)
- Full affiliate_links table
- monetization_priority field visible and editable
- Click tracking summary per tool (from monetization_clicks if Monetization
  Engine detected)
- Active/inactive toggle
- Default fallback toggle

5. UNIFIED SCHEDULE & AUTOMATION (always present)
All cron jobs and schedulers in one view.
- Content Engine scheduler (fire time, articles/day, pause/resume)
- pSEO weekly refresh
- Newsletter send
- Quality Gateway Learn layer (Sunday 07:00 UTC)
- Monetization Score layer (Sunday 06:00 UTC)
- Audience Engine layers (Sunday 04:00–05:00 UTC)
- CRO Engine layers (Sunday 05:30–05:45 UTC)
- System Health Monitor checks
- Manual trigger button per scheduler
Show schedule conflicts: flag if two heavyweight processes are scheduled within
15 minutes of each other.

6. CONTENT ENGINE SECTION (if detected)
- Generation controls: pause/resume, manual trigger, articles/day slider
- Site identity editor: text area, changes apply to next run
- Article type rotation toggles
- Quality gateway controls (threshold, banned phrases, recent scores)
- Keyword queue manager: view, add, reorder, retry failed
- Newsletter settings: schedule, override, preview

7. PSEO ENGINE SECTION (if detected)
- Page counts by type: published, draft, suppressed, with failure reasons
- Generation controls: manual regenerate per tool, bulk regenerate all
- Thin content warnings with fix suggestions
- Bulk actions: suppress, regenerate, prioritise
- Indexing status: IndexNow queue, GSC confirmation
- Top performing pSEO pages (if GSC token available)

8. QUALITY GATEWAY SECTION (if detected)
- Gateway intelligence panel (full spec from Quality Gateway doc Section 07)
- Dimension weight editor
- Voice baseline viewer with 30-day drift trend
- Phrase harvest queue
- Threshold optimizer panel
- Conversion intent map
- Cross-engine gateway view: combined pass rate, failure reason breakdown,
  dimension averages across Content Engine + pSEO Engine
- Gateway LLM indicator with link to LLM Settings

9. MONETIZATION SECTION (if detected)
- Revenue efficiency scores for all monetized pages
- Top earners ranked by RES
- Monetization gap cards: Type 1 (unmonetized high performers), Type 2
  (strong offer thin content), Type 3 (offer decay), Type 4 (pSEO to article)
- Offer status dashboard: active, unconfirmed (amber), terminated (red)
- Revenue entry form for manual payout input
- Weekly revenue summary

10. AUDIENCE SECTION (if detected)
- Traffic source quality scores (0–100) per source
- Cohort breakdown: top 10 active cohorts by session count
- Conversion rate by cohort
- Newsletter subscriber growth trend
- Weekly audience digest preview

11. CRO SECTION (if detected)
- Active tests: page, element being tested, days running, current conversion
  rates for control vs variant
- Pending variants awaiting approval (side-by-side comparison, approve/reject)
- Completed tests: winner, lift percentage, confidence level
- Pattern library: all winning patterns available for Content Engine to use

12. DATA QUALITY GUARDIAN SECTION (if detected)
- Network-wide tools table health: completeness % per site
- Tools below 60% completeness flagged red
- Tools 60–80% flagged amber
- articles_held_data_gap count per site (from network_reports)
- Quick-fill suggestions: which fields are most commonly empty
- DQG last run timestamp and next scheduled run

13. SYSTEM HEALTH MONITOR SECTION (if detected)
- Overall system health score (0–100) across all engines
- Per-engine status: last run, next run, success rate, current issues
- Cascade failure alerts: if multiple engines show degraded status
- Health check history: 30-day trend
- Manual health check trigger button

14. NETWORK REPORTS (always present in multi-site mode)
- Per-site row: articles published, failed, gateway pass rate, queue depth,
  estimated API cost, revenue this week, pSEO page count
- Site health indicators: amber if queue < 10 keywords, red if failures today
- Network totals row

15. FAILURE LOG (always present)
- All API failures, gateway rejections, scheduler errors across all engines
- Searchable and filterable by engine, site, date, failure type
- Broken link detections from Network Backlink Manager
- DQG and System Health Monitor alerts

16. SMART SUGGESTIONS (daily, 07:30 UTC)
One Gemini call per day per site (uses engine='suggestions' from llm_config).
Analyse and include one recommendation from each active category:
- Queue: "Queue runs empty in X days" or keyword gaps
- Gateway: dimension weight drift, declining pass rate, pending phrase harvest
- Monetization: top monetization gap, decaying offer alert
- Audience: traffic source quality change, cohort shift
- CRO: test ready to approve, winning pattern available
- Network: sites with degraded status, backlink opportunities

System prompt for Smart Suggestions must include gateway health signals:
  "Analyse: current dimension weights vs defaults (flag >2pt drift),
  7-day pass rate trend (flag if declining week-over-week),
  phrase harvest queue (flag if 5+ pending),
  most common failure reason past 7 days,
  revenue_this_week vs prior week,
  traffic source quality score changes,
  any cro_tests awaiting approval."

17. MULTI-SITE NETWORK VIEW
When in multi-site mode, a NETWORK tab appears in the sidebar.
Shows aggregated data from all sites' network_reports tables.
Metrics: total articles published today across network, combined affiliate
clicks, network gateway pass rate, network total estimated API cost,
lowest queue depth (which site needs keywords most urgently).
Site distress indicators: amber = queue below 10, red = failures today.
Network link graph: visual of cross-site backlinks (if Network Backlink
Manager detected).

18. DATABASE TABLES
Create if not existing:
- dashboard_settings: single-row, stores dashboard name, mode, identity,
  theme preferences, last_viewed
- system_health_log: timestamped health check results
- smart_actions_log: audit trail of Smart Suggestion actions taken

AFTER BUILDING: Provide a build report listing every system detected, every
component built, and the URL of the admin panel.
```

---

## Section 05 — Detection & auto-wiring

The detection engine runs on activation and on every login. It scans Supabase and wires detected systems automatically.

### Detection signals

| System signal | Dashboard effect |
|---|---|
| `articles` table | Content Engine detected — activates Content section |
| `pseo_pages` table | pSEO Engine detected — activates pSEO section |
| `tools` table | Tools database present — activates Tools Manager |
| `keyword_queue` table | Content Engine keyword queue — activates Queue Manager |
| `generation_log` table | Generation logging active — activates Failure Log |
| `gateway_scores` table | Quality Gateway decision engine active — activates full Gateway section |
| `pseo_quality_log` | pSEO quality controls active — activates quality section |
| `affiliate_links` table | Affiliate system present — activates Affiliate Manager |
| `monetization_clicks` table | Monetization Engine installed — activates Monetization section |
| `audience_sessions` table | Audience Engine installed — activates Audience section |
| `cro_tests` table | CRO Engine installed — activates CRO section |
| `dqg_tools_health` table | Data Quality Guardian installed — activates DQG section |
| `system_health_log` table | System Health Monitor installed — activates Health section |
| `llm_config` table | LLM Abstraction Layer active — activates LLM Settings (always shown) |
| `network_domains` table | Network Backlink Manager active — activates Backlinks section |
| `network_reports` table with multiple `site_id` values | Multi-site mode confirmed |
| Active cron/schedulers | Detected firing times shown in Schedule section |

### What detection results in

- Connected systems show a "Connected" badge with live health metrics
- Detected sections appear automatically in sidebar navigation
- Pre-configured widgets load with appropriate data
- Missing systems show "Install this engine" cards — not errors

---

## Section 06 — Universal dashboard overview

The homepage is a command center. Every widget shows something actionable. Red = needs attention. Green = running correctly. You should be able to assess the entire operation in under 30 seconds.

| Widget | What it shows |
|---|---|
| Daily Pulse | Articles + pSEO pages published today and this week. Trend vs prior week. |
| Quality Health | Gateway pass rate %. 7-day trend. Amber below 70%. |
| Revenue Summary | Estimated revenue this week. Top earning tool. Total clicks today. |
| API Cost | Total LLM spend this month. Daily average. Projected monthly total. |
| Content Funnel | pSEO impressions → article traffic → affiliate conversions. |
| Queue Status | Keywords pending. pSEO pages queued. Days of runway. |
| Top Performers | Best pages by traffic and affiliate clicks. Combined ranking. |
| Active Alerts | Red/yellow/green failure summary. Click to jump to failure log. |
| System Health | All engine statuses. Last/next run times. API ceiling status. |

---

## Section 07 — Modular sections

### Core sections (always present)

| Section | Purpose |
|---|---|
| Command Center | Homepage. Always the entry point. |
| LLM Settings | Per-engine model management, cost tracking. Sidebar priority. |
| Tools Database Manager | Source of truth for tools data. |
| Affiliate Link Manager | Affiliate URLs, priority, click tracking. |
| Unified Schedule & Automation | All schedulers in one view. |
| Network Reports | Site-level stats and network aggregation. |
| Failure Log | All errors in one searchable place. |

### Conditional sections (activated on detection)

Content Engine · pSEO Engine · Quality Gateway · Monetization · Audience · CRO · Data Quality Guardian · System Health Monitor · Network Backlink Manager

---

## Section 08 — LLM settings section

This is the single most important operational section for cost and quality management. It surfaces in the sidebar above Content Settings.

### Per-engine model table

| Engine | Default | Options |
|---|---|---|
| Content generation | Gemini 2.5 Flash | Gemini 2.5 Flash, Gemini 2.5 Pro, Claude Sonnet, GPT-4o |
| Quality scoring | Gemini 2.5 Flash | Same options |
| Intent classification | Gemini 2.5 Flash | Same options |
| Smart Suggestions | Gemini 2.5 Flash | Same options |
| Newsletter generation | Gemini 2.5 Flash | Same options |

**How to use this for cost control:**
- Use Flash for everything by default
- If gateway pass rates are low and prompts are strong, upgrade generation to Pro temporarily
- If you want independent evaluation, set scoring to a different provider than generation
- Flash scoring is fast enough — upgrade scoring only if you're testing Pro generation

**How to use this for quality control:**
- Setting content generation and quality scoring to different providers catches more issues
- Claude Sonnet tends to score more strictly on specificity and verdict clarity
- Switching scoring to Claude while keeping Gemini for generation provides a partial independence check on the self-evaluation limitation

### API key status

Shows green/red/grey per provider. Test connection button per provider sends a 10-word test prompt and confirms response. If a key fails, affected engines show amber status until key is fixed.

### Cost tracking

All cost estimates read from `generation_log.estimated_cost_usd`. The LLM Abstraction Layer writes cost estimates based on token counts and the `llm_config.cost_per_1k_tokens` field. Update this field when provider pricing changes.

---

## Section 09 — Smart cross-system features

These features exist only because all engines share the same dashboard.

| Feature | What it does |
|---|---|
| Sync Tools ↔ Content | Updates tools table from new articles. Bidirectional. |
| Find Content Gaps | Shows high-impression pSEO pages without a deep review. |
| Promote to Full Article | Sends a strong pSEO page to the Content Engine queue at high priority. |
| Bulk Regenerate | Refresh stale pSEO pages or articles not updated in 90+ days. |
| Health Check | Full audit of every table, scheduler, API connection. Writes to system_health_log. |
| Smart Suggestions | Daily AI analysis of operation health with one prioritised recommendation per category. |
| LLM Cost Optimiser | Compares pass rates and quality scores by model to suggest cost/quality tradeoffs. |

---

## Section 10 — Quality gateway integration

The dashboard is the single control center for the Quality Gateway that governs both engines. Changes apply to both simultaneously unless per-engine overrides are configured.

Default scoring dimensions: specificity (18) · verdict clarity (18) · original angle (14) · limitations (14) · structure (15) · no banned phrases (15) · voice drift delta (6) · pricing accuracy (4) · footprint signal (4) · conversion fit (4)

---

## Section 11 — Multi-site network mode

The network tab aggregates data from all sites via a shared `network_reports` table. All sites must write to the same Supabase instance's `network_reports` table (shared database required).

### Per-site reporting fields

| Field | Description |
|---|---|
| site_id | Matches `SITE_ID` environment variable on each Lovable project |
| run_date | When generation run completed |
| articles_published | Count published this run |
| articles_failed | Count failed after retries |
| gateway_pass_rate | Decimal 0.0–1.0 |
| keywords_remaining | Queue depth at report time |
| pseo_page_count | Total published pSEO pages |
| estimated_api_cost_usd | Estimated LLM cost for this run |
| llm_model_used | Model name from llm_config |
| revenue_this_week | Written by Monetization Engine |
| top_earning_tool | Written by Monetization Engine |
| next_run_scheduled | When next run fires |

### Network health thresholds

- Queue below 10 keywords → amber alert for that site
- Any failures today → red alert
- Gateway pass rate below 60% for 3+ consecutive days → amber alert
- Estimated API cost more than 2× daily average → amber alert

---

## Section 12 — Database schema

### New tables created by this spec

| Table | Purpose |
|---|---|
| `dashboard_settings` | Single-row. Dashboard name, mode, identity, theme preferences, last_viewed. |
| `system_health_log` | Timestamped health check results. Each manual or scheduled check writes one row. |
| `smart_actions_log` | Audit trail of all Smart Suggestion actions taken via dashboard. |

---

## Section 13 — Security & access control

| Control | Detail |
|---|---|
| Supabase Auth | All `/admin` routes protected. Unauthenticated requests redirect to login. Magic link recommended. |
| Role-based access | Admin: full control including LLM settings. Editor: content and keywords only. Viewer: read-only stats. |
| Audit log | Every admin action logged with timestamp, user ID, action type. Viewable under Settings. |
| Session timeout | Inactive sessions expire after 2 hours. Configurable in `dashboard_settings`. |
| API key protection | All API keys stored as Supabase Edge Function environment variables. Never exposed to client. |
| Row-level security | Supabase RLS applied to all tables. |

---

## Section 14 — Network backlink manager

Manages cross-site internal links across your 4–6 site network. Internal network links are the highest-quality backlinks you control — you own the anchor text, placement, relevance, and timing.

### Domain registration

Register each domain in your network. The system reads each site's identity block to build a topical profile used to score relevance between pages before any link is suggested.

| Field | Purpose |
|---|---|
| domain | Full domain (e.g. nocodereviewed.com) |
| site_identity_block | Five-sentence identity. Drives relevance scoring. |
| primary_topics | Auto-extracted from identity block and articles. Used for matching. |
| site_id | Must match `SITE_ID` environment variable on that Lovable project. |
| active | Toggle off to exclude from all backlink operations. |
| authority_tier | 1 = anchor site (highest authority), 2 = supporting, 3 = new/thin. |

### Relevance scoring (0–100)

| Dimension | Weight |
|---|---|
| Topic overlap | 40 pts |
| Keyword co-occurrence | 25 pts |
| Category match | 20 pts |
| Audience match | 15 pts |

Default relevance threshold: 65/100. Configurable per site pair in the admin panel.

### Link insertion rules

| Link type | Rules |
|---|---|
| Contextual in-content | Inserted where keyword appears naturally. Max 2 per article. Highest SEO value. |
| See Also / Related Tools | Appended as structured section at end of relevant articles. Max 3 links per section. |
| Category hub links | Best-of and category pages link to deeper reviews on specialist sites. |
| Sidebar / footer network | Static placement. Lowest SEO weight. Brand discovery. Configurable per site. |

**Hard limits (always enforced):**
- Maximum 3 cross-network links per page across all link types combined
- Never link from lower-authority to higher-authority site on same topic
- Minimum 400 words before any link is inserted
- No more than 1 link to any single external domain per page
- Links only to domains in `network_domains` table

### Link velocity limits

| Site stage | Weekly limit |
|---|---|
| New site (<90 days) | 3 new cross-network links per week |
| Established (90–365 days) | 10 per week |
| Mature (365+ days) | 25 per week |
| Manual override | Up to 2× weekly limit for one week (admin approval required) |

### Broken link monitoring

Checks all cross-network links weekly. HTTP status handling:

| Status | Action |
|---|---|
| 200 OK | No action. |
| 301/302 | Auto-repair: update stored URL to final destination. |
| 404 | Search articles for replacement on same topic. Update if found. Remove and re-queue keyword if not. |
| 500/timeout | Retry 3× over 24 hours. Flag as broken and alert if still failing. |
| Domain unreachable | Mark entire domain degraded. Suspend all outbound links. Alert. |

### Emergency procedure

If you receive a Google Manual Action for unnatural links: go to Network Backlink Manager → Safety Controls → Emergency Pause. This immediately suspends all cross-network link insertion and generates a disavow file for all links added in the last 90 days. Do not delete links manually — let the disavow file handle it.

### Network link graph

| View | What it shows |
|---|---|
| Link count by site pair | Active links from Site A to Site B and vice versa |
| Authority flow indicator | Direction authority is flowing. Red = imbalanced. Green = healthy bidirectional. |
| Relevance score distribution | Histogram of all active link scores. Tail of low scores = early warning. |
| Top linked pages | Most-linked-to pages across network — highest authority assets. |
| Link gap report | Pages that should have cross-network links but don't. Prioritised opportunity list. |
| Strengthen Network button | One-click: builds topical link clusters across up to 3 selected sites using next week's velocity budget. |

### Database schema for backlink manager

| Table | Key fields |
|---|---|
| `network_domains` | id, domain, site_id, site_identity_block, primary_topics (text[]), authority_tier (int), active (bool), registered_at, last_scanned |
| `network_links` | id, source_domain, source_url, target_domain, target_url, link_type, anchor_text, relevance_score, inserted_at, last_checked, status |
| `network_link_log` | id, link_id (fk), event_type, old_url, new_url, logged_at, auto_resolved (bool) |
| `network_velocity_log` | id, site_id, week_start, links_inserted, links_removed, velocity_limit, logged_at |

---

## Section 15 — Troubleshooting

**Dashboard not loading at /admin**
Confirm Supabase Auth is configured. Verify `/admin` route was created and redirects unauthenticated users to `/login`. Use follow-up prompt: "The /admin route is not loading. Fix routing and confirm Supabase Auth protection."

**Systems not being detected**
Open Supabase and confirm relevant tables exist. Detection runs on every login — log out and back in to force re-scan. Run the Health Check button to force a full re-audit.

**LLM Settings section not showing correct cost estimates**
Check that `generation_log.estimated_cost_usd` is being written by the LLM Abstraction Layer. If the column is missing from generation_log, the Content Engine needs to be re-activated with the v2.1 prompt. Cost estimates are only as accurate as the `llm_config.cost_per_1k_tokens` values — update these when provider pricing changes.

**Smart Suggestions not appearing**
Smart Suggestions use `engine='suggestions'` from `llm_config`. Check that this row exists and the API key is valid. Suggestions generate once per day at 07:30 UTC — they won't appear until the first run completes. Check `smart_actions_log` in Supabase for error messages.

**Multi-site mode showing no data from other sites**
All sites must write to the same Supabase project (shared database for `network_reports`). Verify `SITE_ID` is unique on each site. Check `network_reports` table — rows from each site should appear after each generation run.

**Before spending a Lovable credit on a fix:** check `system_health_log` in Supabase first. Health checks write detailed error messages more specific than what appears in the UI. Most issues can be diagnosed and fixed with a targeted prompt under 20 words once you know the exact error.

---

## Environment variables checklist

| Variable | Where to get it | Required? |
|---|---|---|
| `GEMINI_API_KEY` | aistudio.google.com | YES |
| `ANTHROPIC_API_KEY` | console.anthropic.com | Optional |
| `OPENAI_API_KEY` | platform.openai.com | Optional |
| `RESEND_API_KEY` | resend.com | YES |
| `ALERT_EMAIL` | Your email | YES |
| `SITE_ID` | Set manually | YES |
| `SUPABASE_URL` | Supabase project settings | YES |
| `SUPABASE_ANON_KEY` | Supabase project settings | YES |
| `GOOGLE_SEARCH_CONSOLE_TOKEN` | Google Search Console API | Optional |
| `INDEXNOW_KEY` | indexnow.org (free) | Recommended |
