# Autonomous Content Engine
## v2.1 — Personal Stack Edition
**Prepared May 2026 · Confidential**

| Attribute | Value |
|---|---|
| Version | 2.1 |
| Prepared | May 2026 |
| Compatibility | Any Lovable project with Supabase enabled |
| Default LLM | Gemini 2.5 Flash (switchable via admin panel — see LLM Abstraction Layer) |
| Pairs with | Quality Gateway v1.0, Smart Admin Dashboard v1.1, pSEO Engine v1.0, Monetization Engine v1.0, Audience Engine v1.0, CRO Engine v1.0, LLM Abstraction Layer v1.0, Data Quality Guardian v1.0, System Health Monitor v1.0 |
| Network scope | 4–6 sites, each with its own Lovable project and Supabase instance |

---

## What changed in v2.1

v2.0 introduced the Quality Gateway decision engine. v2.1 makes five additional fixes required for the full stack to operate correctly across a 4–6 site network.

| Change | What it fixes |
|---|---|
| LLM abstraction | All API calls route through the LLM Abstraction Layer. Switch models per-engine from the admin panel without touching code. |
| `monetization_priority` awareness | Affiliate CTA selection now reads `affiliate_links.monetization_priority` set by the Monetization Engine. |
| CRO pattern library integration | Generation prompt queries `cro_pattern_library` for proven patterns before writing. |
| `network_reports` extended fields | Acknowledges `revenue_this_week` and `top_earning_tool` fields written by the Monetization Engine. |
| Data Quality Guardian pre-check | Before each generation run, checks Data Quality Guardian clearance. Halts if tools table health is below threshold. |

---

## Contents

| Section | Title |
|---|---|
| 01 | How to use this document |
| 02 | Setup — three questions |
| 03 | The Lovable activation prompt |
| 04 | The admin control panel |
| 05 | The quality gateway |
| 06 | The generation prompt system |
| 07 | Affiliate link system |
| 08 | The keyword queue |
| 09 | Content refresh system |
| 10 | Newsletter automation |
| 11 | Failure handling and alerts |
| 12 | Multi-site reporting |
| 13 | Replicating to additional sites |
| 14 | Database schema |
| 15 | Troubleshooting |
| 16 | Environment variables checklist |

---

## Section 01 — How to use this document

Upload this document to a Lovable project with Supabase enabled. Lovable reads the spec and builds everything described. Answer three questions and paste one prompt.

**Install order matters.** This is the foundation. Every other engine in the stack depends on tables this engine creates. Always activate this first.

If upgrading from v2.0: the activation prompt detects what exists, applies the v2.1 changes, and skips everything already working. No existing data is lost.

### What this builds

- **Content generation engine** — calls your configured LLM daily, writes articles from your keyword queue, publishes to real indexable URLs.
- **Quality decision engine** — scores every article on 10 dimensions, classifies failure reasons, triggers targeted retries, learns from publishing outcomes.
- **Voice baseline system** — builds a statistical fingerprint of your site's voice from the first 20 published articles. Detects drift before it becomes a footprint.
- **Admin control panel** — private dashboard at `/content-admin` controlling everything: prompts, schedule, keywords, affiliate links, quality threshold, LLM selection.
- **Affiliate link system** — table of tool names and affiliate URLs. Engine inserts links naturally. Respects `monetization_priority` ordering set by the Monetization Engine.
- **Keyword queue** — database of topics including intent classification and CRO pattern hints.
- **Content refresh agent** — weekly scan for stale or declining articles. Rewrites automatically.
- **Newsletter automation** — weekly email to subscribers featuring best articles. Fully automated.
- **Failure handling** — targeted retry, email alerts via Resend, failure log, daily API ceiling.
- **Multi-site reporting** — writes run stats to `network_reports` for the master dashboard.

---

## Section 02 — Setup — three questions

### Question 1 — Your LLM configuration

The Content Engine routes all API calls through the LLM Abstraction Layer. The default model is Gemini 2.5 Flash. You can change this per-engine from the admin panel at any time without redeploying.

Set these environment variables before activation:

```
GEMINI_API_KEY        — from aistudio.google.com (required, used as default)
ANTHROPIC_API_KEY     — from console.anthropic.com (optional, for Claude fallback)
OPENAI_API_KEY        — from platform.openai.com (optional, for GPT-4o fallback)
```

The LLM Abstraction Layer doc covers the full provider configuration. For this engine, Gemini 2.5 Flash is the default for both generation and scoring. You can set generation and scoring to different models independently in the admin panel.

### Question 2 — Your site identity block

Five sentences answering:
- This site is about: [what tools/topics do you review?]
- Our primary reader is: [who are they, what do they want to accomplish?]
- Our perspective is: [honest, experienced, opinionated?]
- Our tone is: [direct? friendly? technical?]
- What makes us different: [one thing that sets your reviews apart]

This block seeds every generation prompt and the voice baseline system. The more specific and distinctive, the better the baseline.

### Question 3 — Your publishing schedule

| Articles/day | Keywords/month | Best for |
|---|---|---|
| 1 | ~30 | New sites, tight keyword lists |
| 2 | ~60 | Growing sites, moderate volume |
| 4 (default) | ~120 | Established sites, competitive niches |
| 8 | ~240 | Aggressive scaling, large queues |

Default fire time: 06:00 UTC.

---

## Section 03 — The Lovable activation prompt

Replace the four `[BRACKETED]` sections with your answers. Paste the entire block as a single message.

```
Build and activate Autonomous Content Engine v2.1 for this Lovable project.

Before building anything, audit the existing codebase for: (1) LLM Abstraction
Layer integration, (2) existing Gemini API calls, (3) content scheduler,
(4) quality gateway logic, (5) keyword_queue table, (6) generation_prompt_version
in site_settings, (7) phrase_frequency_log table, (8) cro_pattern_library table,
(9) affiliate_links.monetization_priority column.

For each component found working: skip it and log "found existing".
For each component missing or needing v2.1 upgrade: build or upgrade it.

SITE IDENTITY BLOCK:
[PASTE YOUR FIVE-SENTENCE SITE IDENTITY BLOCK HERE]

PUBLISHING SCHEDULE: [ARTICLES PER DAY] articles per day at [UTC TIME] UTC

DEFAULT LLM: gemini-2.5-flash (routed via LLM Abstraction Layer)

BUILD / UPGRADE THE FOLLOWING:

1. LLM ABSTRACTION LAYER INTEGRATION
All API calls MUST route through the LLM Abstraction Layer (llm_config table in
Supabase). Do not call any LLM API directly. Use the abstraction wrapper function
that reads provider, model, and API key from llm_config where engine = 'content'
and active = true. If llm_config table does not exist, create it with columns:
id (uuid), engine (text), provider (text: gemini/anthropic/openai),
model_name (text), api_key_env_var (text), active (bool), cost_per_1k_tokens
(decimal), created_at (timestamp). Seed with one row:
engine='content', provider='gemini', model_name='gemini-2.5-flash',
api_key_env_var='GEMINI_API_KEY', active=true, cost_per_1k_tokens=0.00015.

2. DATA QUALITY GUARDIAN PRE-CHECK
Before each generation run, call the Data Quality Guardian health endpoint.
If guardian_status.tools_health < 0.7 (tools table completeness below 70%),
log a warning to generation_log and skip generation for any keyword whose
primary tool has completeness below 60%. Do not halt the entire run — only
skip affected keywords. Log skipped keywords to generation_log with
reason='dqg_tools_incomplete'.

3. METADATA ENVELOPE
Before every gateway submission, attach: source='content_engine', keyword,
article_type, tools_referenced (parsed from body against tools table),
generation_prompt_version (from site_settings), word_count, submitted_at,
llm_provider, llm_model (from llm_config).

4. KEYWORD INTENT CLASSIFICATION
When any keyword is added to keyword_queue, run a single lightweight LLM call
(via abstraction layer) to classify intent as: informational, navigational,
commercial, or transactional. Store as keyword_queue.intent. Skip if already
populated.

5. DAILY SCHEDULER
Fire at specified UTC time daily. Pull next N keywords from keyword_queue where
status = pending, ordered by priority DESC then created_at ASC. Generate one
article per keyword. Rotate article types: tool_review, comparison, tutorial,
best_of_list. Log each run to generation_log including llm_model used.

6. CRO PATTERN LIBRARY INTEGRATION
Before generating each article, query cro_pattern_library WHERE article_type
matches AND status = 'winning' ORDER BY lift_percentage DESC LIMIT 3.
If results exist, append to generation prompt: "Apply these proven patterns
for this article type: [pattern descriptions]". If cro_pattern_library table
does not exist, skip this step silently and log 'cro_patterns_unavailable'
to generation_log.

7. GENERATION PROMPT SYSTEM
SYSTEM: [Site identity block]. You are an expert no-code software reviewer.
Write honest, opinionated articles. Always give a clear verdict. Always include
genuine limitations. Never use banned phrases. Write minimum 1000 words.
Include "Last verified: [current month year]". Format in clean markdown with
H2 subheadings.
USER: Write a [article_type] article for this keyword: [keyword].
Intent: [keyword.intent]. Relevant tools: [top 5 tools from tools table].
Affiliate URLs: [from affiliate_links ordered by monetization_priority DESC,
then active = true]. Insert affiliate links naturally — maximum 3 per article,
minimum 1 per article if any tool has an entry.
[CRO patterns if available from step 6]

8. PROMPT VERSION TRACKING
Add generation_prompt_version integer to site_settings (default 1). Increment
automatically whenever site_identity_block or master_generation_prompt is edited
in the admin panel. Attach current version to every generation_log row.

9. QUALITY GATEWAY (10 dimensions — 106 point scale)
Submit every article to Quality Gateway with metadata envelope. Dimensions:
specificity (18pts), verdict_clarity (18pts), original_angle (14pts),
limitations (14pts), structure (12pts), no_banned_phrases (12pts),
voice_drift_delta (6pts), pricing_accuracy (4pts), footprint_signal (4pts),
conversion_fit (4pts). Pass threshold: 72/106.
The Quality Gateway scoring call uses the model assigned to engine='gateway'
in llm_config (defaults to gemini-2.5-flash).

10. TARGETED RETRY
If article scores 55–threshold: fetch dimension justifications from
gateway_scores. Build targeted re-prompt injecting failed dimensions with
their justification strings. Gemini edits, not rewrites. One retry maximum.
If retry fails: escalate to kill_alert.

11. ROUTE OUTCOMES
Publish (score >= threshold) | Targeted retry (55–threshold, first attempt) |
Hold data gap (pricing_unverifiable or tools_table_empty_fields) |
Kill and alert (score < 55, or second failure, or hard pre-gate fail).

12. VOICE BASELINE
After 20th article published: build voice baseline from those 20 articles.
Measure avg_sentence_length, type_token_ratio, adverb_density,
passive_voice_rate, top_phrases (top 50 non-stopword phrases).
Store in voice_baseline table. Show completion notification in admin overview.

13. FOOTPRINT LOG
Before each daily generation run: query last 7 days of published articles.
Extract top 50 most-frequent phrases (3–6 words, non-stopword). Store in
phrase_frequency_log. Gateway reads this for footprint_signal scoring.

14. AFFILIATE LINK SYSTEM
Pull affiliate URLs from affiliate_links table by tool_name match.
Order by monetization_priority DESC (field added by Monetization Engine —
if column does not exist yet, use insertion order). Fallback to
tools.affiliate_url. Use default_fallback from affiliate_links if no match.
CTA text: "Try [Tool] Free" if free plan exists, else "View [Tool]".
Max 3 affiliate links per article, min 1 if any match exists.

15. ADMIN CONTROL PANEL
Build at /content-admin protected by Supabase Auth. Sections:
OVERVIEW, LLM SETTINGS (new — see below), CONTENT SETTINGS,
QUALITY GATEWAY, AFFILIATE LINKS, KEYWORD QUEUE, SCHEDULE,
FAILURE LOG, REFRESH SETTINGS.

LLM SETTINGS section must include:
- Per-engine model selector: content generation, quality scoring, intent
  classification, smart suggestions. Each shows current provider/model,
  dropdown to switch, estimated cost per 1000 calls.
- API key status indicators: green = key present and tested, red = missing.
- Cost tracker: total estimated API spend this month across all engines,
  broken down by engine and provider.
- "Test connection" button per provider that sends a 10-word test prompt
  and confirms response.

16. CONTENT REFRESH AGENT
Run weekly Mondays 07:00 UTC.
Trigger A: position drop >5 in 30 days (requires GSC token).
Trigger B: live >90 days, zero impressions.
Trigger C: CTR below 2% (requires GSC token).

17. NEWSLETTER AUTOMATION
Every Sunday 08:00 UTC: select top 3 articles by quality_score or CTR.
Generate two subject line variants. Send via Resend API.
Log to newsletter_issues table.

18. FAILURE HANDLING
Targeted retry on first failure. Escalate on second. After 3 failures:
mark failed, send alert to ALERT_EMAIL. Hard ceiling: 50 LLM calls/day
PER SITE (not per network). All failures logged to generation_log.

19. MULTI-SITE REPORTING
After each run, write to network_reports:
site_id, run_date, articles_published, articles_failed,
articles_targeted_retried, articles_held_data_gap, gateway_pass_rate,
keywords_remaining, llm_model_used, estimated_api_cost_usd.
Note: Monetization Engine will add revenue_this_week and top_earning_tool
to this table. Do not conflict with those columns.

20. DATABASE TABLES
Create if not existing: keyword_queue (with intent column), articles,
affiliate_links (with monetization_priority integer column, default 50),
generation_log (with prompt_version, llm_model, estimated_cost columns),
site_settings (with generation_prompt_version column), network_reports,
phrase_frequency_log, voice_baseline, gateway_scores, llm_config.
Seed keyword_queue with 10 starter keywords (see Section 08).
Seed llm_config with default Gemini 2.5 Flash row per engine.

AFTER BUILDING: Provide a build report listing every component built or
upgraded, the admin panel URL, and confirmation that LLM Abstraction Layer
is wired to all API calls.
```

---

## Section 04 — The admin control panel

Lives at `/content-admin`, accessible only to authenticated users.

### Overview dashboard

Articles published today, this week, and total. Quality gateway pass rate. Keywords remaining in queue. Last run timestamp and next scheduled run. Active failures shown in red. Voice baseline status and current 7-day drift delta. Estimated API cost this month.

### LLM settings

Central control for all model assignments. Switch any engine between Gemini 2.5 Flash, Gemini 2.5 Pro, Claude Sonnet, or GPT-4o without redeploying. Cost estimates update live when you change models. API key status shown per provider.

This is the primary place to manage LLM costs. If Gemini Flash is producing low quality scores, upgrade the generation model to Gemini Pro here. If you want cheaper scoring, downgrade the gateway model independently.

### Content settings

Site identity block — large text area. Edit here; changes apply to next run and increment `generation_prompt_version`. Master generation prompt — full template with identity block inserted. Reset button restores default.

Article type rotation toggles — disable any type you don't want.

### Quality gateway controls

Pass threshold slider (60–95). Default 72. Banned phrases list. Recent gateway scores — last 20 articles with dimension scores. Dimension weight editor — sliders for all 10 dimensions. Voice baseline viewer — fingerprint stats and 30-day drift trend chart. Phrase harvest queue — candidate banned phrases for review.

### Keyword queue manager

All keywords with status, intent classification, priority. Add one at a time or bulk import. Failed keywords show failure reason with retry button. CRO pattern hints shown where available.

### Affiliate links

Full table of tool → affiliate URL mappings. `monetization_priority` field visible and editable (Monetization Engine also writes to this). Toggle links active/inactive. Default fallback toggle.

### Schedule settings

Articles per day (1–8). Generation time UTC. Pause toggle. Manual trigger button.

### Failure log

Every API failure, quality gateway failure, and scheduler error. Targeted retry attempts visible with injected re-prompt for debugging. LLM model shown per attempt.

---

## Section 05 — The quality gateway

Every article passes through the gateway before publishing. No exceptions. The gateway scoring call uses whatever model is assigned to `engine='gateway'` in `llm_config`.

### Ten scoring dimensions

| Dimension | Points | What is scored |
|---|---|---|
| Specificity | 18 pts | Names specific use cases, user types, scenarios. Generic benefits score zero. |
| Verdict clarity | 18 pts | Clear recommendation present. Who this is best for and who should avoid it. |
| Original angle | 14 pts | Non-obvious perspective. Vendor feature list restated scores zero. |
| Limitations | 14 pts | Genuine cons acknowledged. Substantive, not softened. |
| Structure | 12 pts | Logical flow. Scannable headers. Tight content scores higher than filler. |
| No banned phrases | 12 pts | Zero Category A phrases. Each instance deducts 8 points. |
| Voice drift delta | 6 pts | Distance from site voice baseline. High drift = low score. |
| Pricing accuracy | 4 pts | Pricing claims verified against tools table. Unverifiable = 2 pts. |
| Footprint signal | 4 pts | Inverse of cross-article phrase repetition score. |
| Conversion fit | 4 pts | Article tone and CTA match keyword intent. |

**Total: 106 points. Pass threshold: 72.**

### Important: gateway independence

The gateway scores using the same underlying LLM that generated the content. This is an acknowledged limitation. The gateway rubric is specific enough to partially compensate, but be aware that pass rates measure rubric compliance, not absolute quality. Monitor your published content directly — if articles are passing but feel generic, tighten the banned phrases list and reduce the specificity dimension weight floor before raising the threshold.

### Route outcomes

| Outcome | Trigger | Action |
|---|---|---|
| Publish | Score ≥ 72 | Publish, IndexNow, sitemap, newsletter queue, network_reports. |
| Targeted retry | Score 55–72, first attempt | Inject failed dimension justifications into re-prompt. One retry max. |
| Hold — data gap | `pricing_unverifiable` or tools data missing | Mark `held_data_gap`. Auto-regenerate when data is fixed. |
| Kill and alert | Score < 55, or second failure, or hard pre-gate fail | Mark failed. Resend alert. Move to next keyword. |

### Default banned phrases

In today's digital landscape · As we can see · It's worth noting · game-changer · seamlessly · cutting-edge · robust solution · In conclusion · To summarize · At the end of the day · It goes without saying · Needless to say · In the world of · In the realm of · transformative · revolutionary · leverage · utilize · synergy · empower · unlock your potential · take your [X] to the next level · delve into · navigate the complexities

---

## Section 06 — The generation prompt system

The generation prompt is editable in the admin panel. Editing it increments `generation_prompt_version` automatically, tying every published article to the exact prompt version that generated it.

### Article type rotation

| Type | Keyword pattern | Why it matters |
|---|---|---|
| Tool review | [tool name] review | Highest affiliate conversion |
| Comparison | [tool A] vs [tool B] | Highest buyer intent |
| Tutorial | how to [do X] with [tool] | Long-tail traffic, builds trust |
| Best-of list | best [tools] for [use case] | High volume, broad intent |

### Keyword intent injection

The keyword's classified intent is injected into every generation prompt.

| Intent | Prompt injection |
|---|---|
| Informational | Focus on education. No CTA in opening section. |
| Commercial | Include clear verdict and price mention. One direct affiliate CTA. |
| Transactional | Lead with verdict. Prioritise pricing accuracy. CTA in first 200 words. |

### CRO pattern injection

If `cro_pattern_library` has winning patterns for this article type, they are appended as constraints to the generation prompt. This is how the CRO Engine's findings compound over time — each winning variant makes future articles more likely to convert without manual intervention.

---

## Section 07 — Affiliate link system

### How links are inserted

- Maximum 3 affiliate links per article
- Minimum 1 if any reviewed tool has a matching entry
- Links inserted naturally within sentences, never as bare URLs
- Same tool never linked more than once per article
- Descriptive anchor text always — never "click here"
- If tool has no affiliate link, default fallback URL is used
- **Link order follows `monetization_priority` DESC** — the Monetization Engine sets this field based on commission quality, conversion rate, and offer stability. Higher priority tools get CTA preference when multiple tools qualify.

### The affiliate table

| Field | Type | Description |
|---|---|---|
| tool_name | text | Exact tool name as it appears in articles |
| affiliate_url | text | Full affiliate URL with tracking parameters |
| active | boolean | Toggle off without deleting |
| commission_note | text | Your notes on commission rate/type |
| default_fallback | boolean | Mark one row as default for unmatched tools |
| monetization_priority | integer | 0–100. Set by Monetization Engine. Higher = preferred CTA. Default 50. |

---

## Section 08 — The keyword queue

Intent classification runs once per keyword as a lightweight LLM call (not at generation time). The classified intent travels with the keyword through the entire pipeline.

### 10 starter keywords (seeded automatically)

| Keyword | Article type | Priority | Intent |
|---|---|---|---|
| best no-code app builder 2026 | best_of_list | high | commercial |
| webflow vs framer | comparison | high | commercial |
| bubble review | tool_review | high | commercial |
| zapier alternatives | comparison | high | commercial |
| best no-code tools for agencies | best_of_list | high | commercial |
| lovable review | tool_review | high | commercial |
| airtable vs notion | comparison | medium | commercial |
| shopify vs webflow | comparison | medium | commercial |
| no-code for beginners | tutorial | medium | informational |
| make vs zapier | comparison | medium | commercial |

---

## Section 09 — Content refresh system

Runs weekly Mondays 07:00 UTC.

**Trigger A — Ranking drop:** Article dropped more than 5 Search Console positions in 30 days. Action: expand with updated information, check all pricing and feature claims, update Last Verified date. Requires `GOOGLE_SEARCH_CONSOLE_TOKEN`.

**Trigger B — Zero impressions after 90 days:** Action: complete rewrite with stronger angle, different keyword targeting, improved title. Original archived, not deleted.

**Trigger C — Low CTR:** Article has impressions but CTR below 2%. Action: rewrite title and meta description only. Generates 3 variants, picks strongest. Requires GSC token.

The Last Verified date stamp updates automatically on every refresh.

---

## Section 10 — Newsletter automation

Every Sunday at 08:00 UTC:
- Selects top 3 articles published that week
- Early stage (no GSC data): ranked by quality gateway score
- Growth stage (GSC connected): ranked by CTR
- LLM writes a two-sentence summary per article
- LLM generates two subject line variants for A/B testing
- Sent via Resend to all active subscribers
- Stats logged to `newsletter_issues` table

Preview button in admin panel shows what will send before it goes. Override articles option allows manual selection.

---

## Section 11 — Failure handling and alerts

### Targeted retry

When an article fails the gateway with a score between 55 and the pass threshold, the engine builds a targeted re-prompt including the original article body and the specific failed dimensions with their justification strings from `gateway_scores.dimension_reasons`. The LLM edits the article rather than rewriting from scratch. One targeted retry per keyword maximum.

### Daily API ceiling

Hard limit: **50 LLM calls per day per site.** This is enforced at the site level, not the network level. A 6-site network has a ceiling of 300 calls/day total. If a site hits its ceiling, generation stops for that site, a failure alert is sent, and other sites are not affected. The ceiling is configurable per site in `site_settings.daily_llm_ceiling`.

### Alert routing

All failure alerts send via Resend to `ALERT_EMAIL`. Alert types:
- `gateway_kill` — article killed after retries
- `ceiling_hit` — daily API ceiling reached
- `scheduler_miss` — scheduled run did not fire
- `dqg_warning` — Data Quality Guardian flagged tools data issues

---

## Section 12 — Multi-site reporting

After each run, writes to `network_reports`:

| Field | Description |
|---|---|
| site_id | Matches `SITE_ID` environment variable |
| run_date | Timestamp of run completion |
| articles_published | Count published this run |
| articles_failed | Count failed after retries |
| articles_targeted_retried | Count that went through targeted retry |
| articles_held_data_gap | Count held for data quality issues |
| gateway_pass_rate | Decimal 0.0–1.0 |
| keywords_remaining | Queue depth at run time |
| llm_model_used | Model name from llm_config |
| estimated_api_cost_usd | Estimated cost for this run |

The Monetization Engine adds `revenue_this_week` and `top_earning_tool` to this table. Do not create columns with those names — let the Monetization Engine own them.

---

## Section 13 — Replicating to additional sites

Each site in your 4–6 site network gets its own Lovable project with this spec activated independently.

**Per-site configuration that must differ:**
- `SITE_ID` — unique identifier (e.g. `nocode-tools`, `automation-hub`)
- Site identity block — each site needs its own distinctive voice
- Keyword queue — seeded with site-appropriate topics
- `ALERT_EMAIL` — can be the same across all sites

**Shared infrastructure:**
- Same Supabase project can be used for `network_reports` aggregation (multi-site master dashboard reads from here)
- Same affiliate links table structure (but each site maintains its own data)
- Same `llm_config` table structure (but each site can have different model assignments)

**Replication steps:**
1. Open target Lovable project (must have Supabase enabled)
2. Set environment variables: `GEMINI_API_KEY`, `SITE_ID`, `ALERT_EMAIL`, `RESEND_API_KEY`
3. Upload this document to Lovable chat
4. Answer the three setup questions for the new site
5. Paste the activation prompt with new site's answers
6. After build: populate keyword queue with site-specific topics

---

## Section 14 — Database schema

### Tables created or extended by this spec

**keyword_queue**

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| keyword | text | The topic to write about |
| article_type | text | tool_review / comparison / tutorial / best_of_list |
| status | text | pending / generating / published / failed / held_data_gap |
| priority | integer | Higher = generates first |
| intent | text | informational / navigational / commercial / transactional |
| created_at | timestamp | |
| updated_at | timestamp | |

**articles**

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| keyword_id | uuid | FK to keyword_queue |
| title | text | |
| slug | text | Unique URL slug |
| body_markdown | text | Full article content |
| status | text | draft / published / archived |
| quality_score | integer | Final gateway score 0–106 |
| gateway_pass | boolean | |
| published_at | timestamp | |
| last_verified_at | timestamp | Updated by refresh agent |
| llm_model | text | Model used for generation |
| prompt_version | integer | From site_settings.generation_prompt_version |
| word_count | integer | |
| site_id | text | |

**affiliate_links**

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| tool_name | text | |
| affiliate_url | text | |
| active | boolean | Default true |
| commission_note | text | Optional |
| default_fallback | boolean | Default false |
| monetization_priority | integer | Default 50. Written by Monetization Engine. |

**generation_log**

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| keyword_id | uuid | FK to keyword_queue |
| run_at | timestamp | |
| outcome | text | published / retried / held / failed |
| gateway_score | integer | |
| pre_gate_status | text | passed / rejected with reason |
| retry_count | integer | |
| llm_model | text | Model used |
| estimated_cost_usd | decimal | |
| prompt_version | integer | |
| error_message | text | If failed |

**site_settings** (single-row table)

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| site_identity_block | text | Five-sentence identity |
| master_generation_prompt | text | Full prompt template |
| generation_prompt_version | integer | Auto-incremented on edit |
| banned_phrases | text[] | Array of banned phrases |
| quality_threshold | integer | Default 72 |
| articles_per_day | integer | Default 4 |
| generation_time_utc | text | Default '06:00' |
| scheduler_paused | boolean | Default false |
| daily_llm_ceiling | integer | Default 50 |
| voice_baseline | jsonb | Built after 20 articles |

**llm_config**

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| engine | text | content / gateway / intent / suggestions |
| provider | text | gemini / anthropic / openai |
| model_name | text | e.g. gemini-2.5-flash |
| api_key_env_var | text | Name of env var holding key |
| active | boolean | |
| cost_per_1k_tokens | decimal | For cost tracking |

**network_reports** (extended by other engines)

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| site_id | text | |
| run_date | timestamp | |
| articles_published | integer | |
| articles_failed | integer | |
| articles_targeted_retried | integer | |
| articles_held_data_gap | integer | |
| gateway_pass_rate | decimal | |
| keywords_remaining | integer | |
| llm_model_used | text | |
| estimated_api_cost_usd | decimal | |
| revenue_this_week | decimal | Written by Monetization Engine |
| top_earning_tool | text | Written by Monetization Engine |
| pseo_page_count | integer | Written by pSEO Engine |
| dashboard_last_viewed | timestamp | Written by Smart Admin Dashboard |

**phrase_frequency_log, voice_baseline, gateway_scores** — see Quality Gateway spec for schema.

---

## Section 15 — Troubleshooting

**Articles generating but gateway pass rate is very low**
Check `gateway_scores` in Supabase for which dimensions are consistently failing. If `specificity` is the problem, the site identity block may be too generic — make it more specific about your actual audience. If `voice_drift_delta` is failing before 20 articles are published, the baseline hasn't been built yet — this dimension scores full marks until the baseline exists.

**LLM calls failing silently**
Check `llm_config` table — confirm `active = true` and `api_key_env_var` matches an environment variable that is actually set. Use the "Test connection" button in LLM Settings to confirm. Check `generation_log.error_message` for the exact error.

**Targeted retry not improving scores**
The retry re-prompt includes the original article. If the original article is fundamentally off-topic or very short, editing it won't fix the core problem. Check `gateway_scores.dimension_reasons` for the failed dimensions — if the justification says "content too thin" rather than a specific fixable issue, the keyword may need a different article type.

**Articles held in data_gap status**
Open the Data Quality Guardian admin panel, check which tools have completeness below 60%, and fill the missing fields. Articles held for data gaps regenerate automatically when the tool's `updated_at` timestamp changes.

**Daily ceiling hit before all keywords are processed**
Raise `site_settings.daily_llm_ceiling` or reduce `articles_per_day`. Alternatively, switch the scoring model to a cheaper option (Gemini Flash is already the cheapest) — the ceiling counts all LLM calls including scoring and intent classification, not just generation.

---

## Section 16 — Environment variables checklist

| Variable | Where to get it | Required? |
|---|---|---|
| `GEMINI_API_KEY` | aistudio.google.com | YES — default provider |
| `ANTHROPIC_API_KEY` | console.anthropic.com | Optional — for Claude fallback |
| `OPENAI_API_KEY` | platform.openai.com | Optional — for GPT-4o fallback |
| `RESEND_API_KEY` | resend.com | YES — for alerts and newsletter |
| `ALERT_EMAIL` | Your email address | YES |
| `SITE_ID` | Set manually (e.g. `nocode-tools`) | YES |
| `SUPABASE_URL` | Your Supabase project settings | YES |
| `SUPABASE_ANON_KEY` | Your Supabase project settings | YES |
| `GOOGLE_SEARCH_CONSOLE_TOKEN` | Google Search Console API | Optional — for refresh triggers |
| `INDEXNOW_KEY` | indexnow.org (free) | Optional — for fast indexing |
