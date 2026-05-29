# Autonomous Programmatic SEO Engine
## v1.1 — Personal Stack Edition
**Prepared May 2026 · Confidential**

| Attribute | Value |
|---|---|
| Version | 1.1 |
| Prepared | May 2026 |
| Compatibility | Lovable project with Content Engine v2.1 already installed |
| Pairs with | Content Engine v2.1, Quality Gateway v1.1, Smart Admin Dashboard v1.2, Monetization Engine v1.0, LLM Abstraction Layer v1.0, Data Quality Guardian v1.0 |
| Default LLM | No LLM per page (assembly-based). LLM used only for quality scoring via Quality Gateway. |

---

## What changed in v1.1

| Change | What it fixes |
|---|---|
| Quality Gateway integration | Four pSEO-specific gateway behaviours now explicitly in the activation prompt. Previously missing. |
| `monetization_priority` awareness | Affiliate CTA selection now reads `affiliate_links.monetization_priority` set by Monetization Engine. |
| LLM abstraction | Scoring calls route through LLM Abstraction Layer (engine='gateway' from llm_config). |
| Data Quality Guardian pre-check | Generation skips tools with completeness below 60% rather than producing thin pages. |
| Metadata envelope | pSEO pages now emit correct envelope before gateway submission. |

---

## Contents

| Section | Title |
|---|---|
| 01 | How this engine works |
| 02 | What you need before starting |
| 03 | Setup — two questions |
| 04 | The activation prompt |
| 05 | Page type system |
| 06 | The template engine |
| 07 | The generation matrix |
| 08 | URL structure & routing |
| 09 | The SEO layer |
| 10 | The admin control panel |
| 11 | Content Engine integration |
| 12 | Indexing & discovery pipeline |
| 13 | Quality controls |
| 14 | Database schema |
| 15 | Multi-site scaling |
| 16 | Troubleshooting |

---

## Section 01 — How this engine works

The Content Engine writes. Given a keyword, it thinks, drafts, scores, and publishes an original article. That costs an LLM call and takes time.

The pSEO Engine assembles. It looks at structured data already in Supabase — tool names, ratings, pricing, features, pros, cons — and slots that data into page templates. No LLM call per page. No writing. Just data assembled into HTML and published to real URLs.

The result is thousands of pages generated in a single run, each targeting a specific long-tail query that no human writer would get around to covering.

Every pSEO page is intentionally thin — useful enough to answer the basic question, not deep enough to replace a full review. Every pSEO page links to the relevant Content Engine article where one exists, and flags the keyword for the Content Engine queue where one doesn't. pSEO creates surface area and captures long-tail traffic. The Content Engine provides depth and earns authority.

### What gets generated

From your tools table:

- **tool_vs_tool** — every pairwise comparison. 50 tools = 2,450 pages.
- **alternatives** — "Best [Tool] alternatives" for every tool.
- **category_best** — "Best tools for [use case]" filtered by categories.
- **pricing** — "[Tool] pricing" with full tier breakdown.
- **features** — "[Tool] features" with structured feature matrix.
- **use_case** — "Best [tool type] for [audience]" from tags and best_for fields.
- **integration** — "[Tool A] + [Tool B] integration" (automation sites only).

---

## Section 02 — What you need before starting

**Required: Content Engine v2.1 already installed.** The pSEO Engine uses the same Supabase instance, articles table, site_settings, affiliate_links, and llm_config tables.

**Required: Data in your tools table.** Minimum 10 tools with fields populated. Pages scale with tool count and data quality.

| Requirement | Minimum |
|---|---|
| tools table rows | 10 |
| Fields populated | name, slug, category, rating_overall, pros[], cons[], pricing_tiers |
| affiliate_links | At least 1 row |
| site_settings | Site identity block |

**Recommended:** 20+ tools. Under 10, pSEO adds limited value over the Content Engine alone. Google Search Console token for performance-based prioritisation.

---

## Section 03 — Setup — two questions

### Question 1 — Your site type

| Site type | Use when | Extra templates unlocked |
|---|---|---|
| tool-reviews | You review specific software tools | Comparison, alternatives, pricing, features. Default. |
| automation | You cover workflow/automation tools | Integration pages added. |
| ecommerce | You cover ecommerce platforms | Fee calculator pages, platform-for-use-case pages. |
| saas | You cover SaaS building tools | Stack combination pages. |
| directory | Business/service directory | Location + category pages at scale. |
| generic | None of the above | Comparison and alternatives only. |

### Question 2 — Your page volume target

| Volume | What it does | Best for |
|---|---|---|
| conservative | Generate top 200 pages only | New sites, fewer than 20 tools |
| standard | Generate all valid combinations | Established sites, 20–100 tools |
| aggressive | Generate all combinations + variants | 50+ tools, high data quality |

Start with `standard`. After 60 days, check Google Search Console for which pSEO pages are getting impressions. If quality is good, switch to `aggressive`.

---

## Section 04 — The activation prompt

Replace the two `[BRACKETED]` sections. Paste as a single message.

```
Build and activate Programmatic SEO Engine v1.1 for this Lovable project.

Before building anything, audit the existing codebase for: (1) Content Engine
v2.1 installation, (2) tools table in Supabase, (3) existing pseo_pages table,
(4) existing pSEO routes, (5) sitemap generation, (6) llm_config table,
(7) affiliate_links.monetization_priority column, (8) dqg_tools_health table.

For each component found working: skip it and log "found existing — skipped".
For each component missing: build from scratch.

SITE TYPE: [YOUR SITE TYPE FROM SECTION 03]
PAGE VOLUME: [conservative / standard / aggressive]

BUILD THE FOLLOWING:

1. TOOLS TABLE
If tools table does not exist: create with fields id (uuid), name (text),
slug (text unique), tagline (text), logo_url (text), website_url (text),
affiliate_url (text), category (text[]), rating_overall (decimal),
rating_ease (decimal), rating_features (decimal), rating_pricing (decimal),
verdict (text), review_body (text), pros (text[]), cons (text[]),
pricing_tiers (jsonb), best_for (text[]), featured (bool), sponsored (bool),
pseo_enabled (bool default true), pseo_last_generated (timestamp),
pseo_page_count (integer), created_at (timestamp), updated_at (timestamp).
If table exists: add any missing columns only. Seed with 15 starter no-code
tools if row count is zero.

2. DATA QUALITY GUARDIAN PRE-CHECK
Before generating any page for a tool, check dqg_tools_health for that tool's
completeness score. If completeness < 60%, set status = draft and log reason
= 'dqg_insufficient_data'. Do not produce pages that will fail thin content
checks due to missing fields. If dqg_tools_health table does not exist,
compute completeness inline: fields_populated / total_required_fields.
Required fields: name, slug, category (min 1), rating_overall, pros (min 3),
cons (min 2), pricing_tiers (min 1 tier), verdict, affiliate_url.

3. PSEO_PAGES TABLE
Create if not exists: id (uuid), page_type (text), slug (text unique),
title (text), meta_description (text), h1 (text), tool_id_primary (uuid),
tool_id_secondary (uuid nullable), category (text nullable), body_html (text),
status (text: draft/published/suppressed), quality_score (integer),
generated_at (timestamp), indexed_at (timestamp nullable),
search_impressions (integer default 0), search_clicks (integer default 0),
content_engine_article_id (uuid nullable), updated_at (timestamp).

4. PAGE GENERATION ENGINE
On activation: generate all valid page combinations based on site type and
volume setting.

TYPE A — tool_vs_tool: every pair where both tools pass DQG pre-check AND
have rating_overall and at least 3 pros and 3 cons. Slug: /compare/[a]-vs-[b]
(alphabetically ordered — prevents /a-vs-b and /b-vs-a duplicates).
Title: "[Tool A] vs [Tool B]: Which is better in [current year]?"
Content: winner verdict from rating comparison, pricing table, pros/cons
side-by-side, feature matrix, final verdict with affiliate CTAs for both tools
(ordered by monetization_priority DESC). Link to Content Engine article if
keyword overlap > 60%.

TYPE B — alternatives: every tool with rating_overall >= 3.5 and at least 5
other tools in same category that pass DQG pre-check.
Slug: /alternatives/[tool-name].
Title: "Best [Tool Name] Alternatives in [current year]".
Affiliate CTAs ordered by monetization_priority DESC.

TYPE C — category_best: every unique category value where 5+ tools pass DQG
pre-check. Slug: /best/[category-slug].
Title: "Best [Category] Tools in [current year]".

TYPE D — pricing: every tool where pricing_tiers has 2+ tiers.
Slug: /pricing/[tool-name].
Title: "[Tool Name] Pricing: All Plans Explained [current year]".

TYPE E — features: every tool with rating_features populated and 3+ pros.
Slug: /features/[tool-name].
Title: "[Tool Name] Features: Complete Breakdown".

TYPE F — use_case (tool-reviews or saas only): every unique best_for[] value
where 3+ tools share that tag. Slug: /for/[use-case-slug].
Title: "Best No-Code Tools for [Use Case]".

TYPE G — integrations (automation only): every tool pair in keyword context.
Slug: /integrate/[tool-a]-[tool-b] (alphabetically ordered).
Title: "How to connect [Tool A] and [Tool B] without code".

5. METADATA ENVELOPE FOR GATEWAY
Before submitting any pSEO page to the Quality Gateway, attach envelope:
source='pseo_engine', keyword=[page_type + tool names], article_type='pseo_page',
site_id=[SITE_ID env var], tools_referenced=[tool_id_primary slug,
tool_id_secondary slug if present], generation_model='template_assembly',
generation_prompt_version=0, content_body=[assembled body_html], word_count,
submitted_at, llm_provider='none', llm_model='template'.

6. QUALITY GATEWAY INTEGRATION — pSEO-specific rules
Submit every assembled page to Quality Gateway before publishing.

Hallucination check: verify every value in template slots (pricing_tiers,
rating_overall, pros[], cons[]) exactly matches the database record at
assembly time. Any discrepancy = pre_gate_rejected with reason
template_data_mismatch. This is a database verification, not an LLM call.

Voice drift: measure structural drift instead of prose drift.
Check whether page HTML structure matches expected template for its type.
Missing required section = 2/6 pts. Complete structure = 6/6 pts.

Conversion fit (fixed by page type, no classification call needed):
- tool_vs_tool: commercial high — needs affiliate CTAs for both tools
- alternatives: commercial high — needs affiliate CTA for primary tool
- pricing: transactional — needs affiliate CTA (no CTA = 0 pts)
- category_best: commercial medium
- features: informational — CTA not required
- use_case: commercial medium

Minimum quality score 60/100 to publish. Pages below threshold: draft status.
Log failure reasons to pseo_quality_log.

7. THIN CONTENT PROTECTION
Never generate a page if assembled content < 300 words after rendering.
Never generate tool_vs_tool if both tools are in completely different primary
categories.
Suppress if Content Engine has published article with >80% keyword overlap —
link to that article instead.

8. AFFILIATE INTEGRATION
Pull affiliate URLs from affiliate_links table by tool_name match.
Order by monetization_priority DESC (column on affiliate_links added by
Monetization Engine). If column does not exist yet, use insertion order.
Fallback to tools.affiliate_url. Use default_fallback if no match.
CTA text: "Try [Tool] Free" if free plan exists, else "View [Tool]".
Max 2 affiliate CTAs per pSEO page.

9. ROUTING
Create dynamic routes: /compare/[slug], /alternatives/[slug], /best/[slug],
/pricing/[slug], /features/[slug], /for/[slug], /integrate/[slug].
All routes server-side rendered. Load data from pseo_pages table.
404 if status != published. 410 Gone for suppressed pages.
301 redirect for reverse tool_vs_tool slug (e.g. /compare/b-vs-a →
/compare/a-vs-b).

10. SEO LAYER
Every pSEO page:
- Unique meta title (max 60 chars)
- Meta description (max 155 chars)
- Canonical URL (self-referencing, no trailing slash)
- Open Graph tags (og:title, og:description, og:url, og:type=article)
- JSON-LD schema by type:
  * tool_vs_tool: ItemList with both tools as SoftwareApplication
  * alternatives: ItemList
  * category_best: ItemList
  * pricing: SoftwareApplication with Offer array
  * features: SoftwareApplication
- Last-modified header set to generated_at or updated_at
- Sitemap entry added on publish (in sitemap-pseo.xml)

11. INTERNAL LINKING
Every pSEO page must include:
- Link to primary tool's full review (Content Engine article if exists,
  else /tools/[slug])
- tool_vs_tool: link to each tool's alternatives page
- alternatives: link to tool_vs_tool for top 2 alternatives
- category_best: link to top 3 tools' pricing pages
- Cross-link to Content Engine article where keyword overlap > 60%
- Max 8 internal links per page

12. INDEXING PIPELINE
On each publish batch:
- Add URL to sitemap-pseo.xml (auto-regenerate)
- Submit to IndexNow API (INDEXNOW_KEY env var)
- Log to pseo_indexing_log: url, submitted_at, response_code
- Batch: max 100 URLs per IndexNow call

13. WEEKLY REFRESH AGENT
Every Monday 08:00 UTC:
- Check tools.updated_at > pseo_last_generated for each tool
- Regenerate all pSEO pages for updated tools
- Run DQG pre-check before regenerating (skip tools below 60%)
- Add new pages for tools added since last run
- Log run to pseo_refresh_log

14. SEARCH CONSOLE INTEGRATION (optional)
If GOOGLE_SEARCH_CONSOLE_TOKEN is set:
- Weekly: pull impressions and clicks for all /compare/, /alternatives/,
  /best/, /pricing/, /features/ URLs
- Update pseo_pages.search_impressions and search_clicks
- Flag pages with 0 impressions after 90 days for regeneration
- Flag pages with impressions > 100 but CTR < 1% for title/meta rewrite
- Surface top 10 performing pSEO pages in admin

15. DATABASE TABLES
Create if not existing: pseo_pages, pseo_quality_log, pseo_indexing_log,
pseo_refresh_log. Add pseo_page_count (integer) to network_reports.

AFTER BUILDING: Provide build report: total pages generated by type,
published vs draft (quality failures), tools with insufficient data,
admin panel URL, environment variables needed.
```

---

## Section 05 — Page type system

| Type | URL | Intent | Requires |
|---|---|---|---|
| tool_vs_tool | /compare/[a]-vs-[b] | Buyer choosing between two tools | Both tools: rating, 3+ pros, 3+ cons, pricing_tiers, affiliate_url |
| alternatives | /alternatives/[tool] | Seeking alternatives to current tool | Primary tool: rating ≥ 3.5, 5+ other tools in same category |
| category_best | /best/[category] | Discovery — wants to see the field | 5+ tools sharing a category tag |
| pricing | /pricing/[tool] | Close to purchase, comparing costs | Tool: 2+ pricing tiers in pricing_tiers JSONB |
| features | /features/[tool] | Evaluating capabilities before trial | Tool: rating_features, 3+ pros, verdict populated |
| use_case | /for/[use-case] | Knows goal, wants best tool | 3+ tools sharing a best_for[] tag value |
| integration | /integrate/[a]-[b] | Building a stack, checking compatibility | Automation site type. Both tools in database. |

---

## Section 06 — The template engine

Every page type has a fixed HTML template with data slots. When the engine runs, it queries Supabase for relevant tools, fills the slots, assembles the HTML, runs the quality gateway check, and writes the result to `pseo_pages`. No LLM call. No latency beyond a database query.

### tool_vs_tool template structure

1. Hero — Tool A logo, name, rating vs Tool B logo, name, rating. Winner badge.
2. Quick verdict — one sentence from each tool's `verdict` field.
3. Pricing comparison table — `pricing_tiers` JSONB for both tools, side by side.
4. Pros and cons — `pros[]` and `cons[]` arrays, two-column table, up to 5 items per tool.
5. Feature matrix — key features from `pricing_tiers`, checkmark/cross per tool.
6. Best for — `best_for[]` tags rendered as chips.
7. Verdict and CTAs — rating-based winner declaration, affiliate CTAs ordered by `monetization_priority` DESC.
8. Related links — each tool's alternatives page, pricing page, Content Engine article if exists.

### Data freshness

When a tool record is updated in Supabase, the weekly refresh agent regenerates all pSEO pages that reference that tool. `tools.updated_at` is the trigger. Pages always reflect current database state.

---

## Section 07 — The generation matrix

| Tool count | vs pages | Alt pages | Cat pages | Pricing | Features | Total |
|---|---|---|---|---|---|---|
| 10 tools | ~45 | ~10 | ~3 | ~10 | ~10 | ~78 |
| 25 tools | ~300 | ~25 | ~6 | ~25 | ~25 | ~381 |
| 50 tools | ~1,225 | ~50 | ~10 | ~50 | ~50 | ~1,385 |
| 100 tools | ~4,950 | ~100 | ~15 | ~100 | ~100 | ~5,265 |

tool_vs_tool count is n×(n-1)/2 — exponential growth. 200 well-documented tools beats 500 half-empty records every time.

### Priority ordering

1. tool_vs_tool for featured tools (`featured = true`) first
2. High-rated tools (`rating_overall >= 4.0`)
3. Sponsored tools with active `sponsored_until` date
4. Most-linked tools (by affiliate_clicks)
5. Everything else alphabetically

---

## Section 08 — URL structure & routing

| Page type | URL pattern | Notes |
|---|---|---|
| tool_vs_tool | /compare/[a-slug]-vs-[b-slug] | Alphabetically ordered to prevent duplicates |
| alternatives | /alternatives/[tool-slug] | |
| category_best | /best/[category-slug] | |
| pricing | /pricing/[tool-slug] | |
| features | /features/[tool-slug] | |
| use_case | /for/[use-case-slug] | |
| integration | /integrate/[a-slug]-[b-slug] | Alphabetically ordered |

301 redirect created automatically for reverse tool_vs_tool slug pattern. Suppressed pages return 410 Gone, not 404.

---

## Section 09 — The SEO layer

### Meta generation rules

| Page type | Title pattern | Meta description pattern |
|---|---|---|
| tool_vs_tool | [Tool A] vs [Tool B]: Which is better in [year]? | [Tool A] and [Tool B] compared: pricing, features, pros and cons. Find out which is right for your use case. |
| alternatives | Best [Tool] Alternatives in [year]: [N] Options Compared | Looking for [Tool] alternatives? We compared the top [N] options on pricing, features and ease of use. |
| category_best | Best [Category] Tools in [year]: Ranked and Reviewed | [N] [category] tools ranked by real ratings. Compare pricing, features and find the right tool for your needs. |
| pricing | [Tool] Pricing [year]: All Plans and What You Get | [Tool] offers [N] pricing plans from $[X]/month. What each plan includes and which one to choose. |
| features | [Tool] Features: Complete List and What They Do | Everything [Tool] can do — features, use cases, and limitations before you sign up. |

### IndexNow setup

Get a free key at indexnow.org. Add as `INDEXNOW_KEY` in Lovable environment variables. The engine submits every new page URL on publish in batches of up to 100. Submission logs viewable in admin under pSEO → Indexing Status.

### Sitemaps

The engine maintains `sitemap-pseo.xml` alongside the main `sitemap.xml`. Both referenced in `robots.txt`. Suppressed pages excluded. `lastmod` set to `generated_at` or last refresh date.

---

## Section 10 — The admin control panel

The pSEO section is added to `/content-admin`. It does not create a new route.

**Overview tab** — total pages published by type, pages in draft (quality failures), pages suppressed, last generation run, next scheduled refresh, IndexNow queue status.

**Tools data quality tab** — all tools with completeness score (0–100%). Fields missing highlighted amber. "Generate pages now" button per tool. Bulk CSV import for tools.

**Performance tab** (requires GSC token) — top 20 pSEO pages by impressions over 28 days. High impressions but low CTR flagged for title/meta rewrite. Zero impressions after 90 days flagged for regeneration or suppression.

**Page management tab** — full pseo_pages list with status, type, quality score, impressions. Filter by type, status, quality score range. Suppress, regenerate, and view live page buttons.

---

## Section 11 — Content Engine integration

### Deduplication

Before generating any pSEO page, the engine checks articles table for keyword overlap. If overlap > 60%, the pSEO page is suppressed and the Content Engine article is linked from the pSEO page's canonical URL. The pSEO page exists in the database but isn't published. Prevents Google seeing two pages competing for the same query.

### Keyword handoff

Every pSEO page getting more than 50 impressions per month that has no corresponding Content Engine article is automatically added to the keyword queue at high priority. Signal: Google likes this topic, write a proper article about it.

### Link flow

Content Engine articles link to relevant pSEO pages. pSEO pages link to relevant Content Engine articles. Both link to tool review pages. pSEO pages have high volume and funnel link equity to your best Content Engine content.

---

## Section 12 — Indexing & discovery pipeline

**Phase 1 — IndexNow (day 1):** Submits all new URLs to IndexNow on every publish batch. Gets pages into Bing and other participating engines within 24–48 hours.

**Phase 2 — Google Search Console API (ongoing):** If `GOOGLE_SEARCH_CONSOLE_TOKEN` is set, submits URLs directly for priority pages. Rate-limited to 200 URLs/day by Google.

**Phase 3 — Sitemap ping (weekly):** Every Monday after weekly refresh, pings Google's sitemap endpoint with updated `sitemap-pseo.xml`.

**Phase 4 — Internal links (immediate):** New pSEO pages linked from category index pages and from related Content Engine articles. Googlebot crawls existing pages and discovers new URLs naturally.

Do not submit all 5,000 pages to Google Search Console manually. Google finds them via sitemap and internal links. Manual submission is worth it only for your highest-priority 50 pages.

---

## Section 13 — Quality controls

### Quality score calculation

| Dimension | Points | What is checked |
|---|---|---|
| Fields populated | 30 pts | 10 fields checked with minimums |
| Data uniqueness | 25 pts | Pros and cons must be distinct. Pricing tiers must differ. |
| Word count | 25 pts | 300+ words for any points. 500+ for full marks. |
| No data conflicts | 20 pts | Rating fields consistent. Pricing parseable. No nulls in required slots. |

Pages scoring below 60 set to draft status. Fix the data in Supabase, hit regenerate, they publish automatically.

### Hard suppression rules

Never publish if:
- Tool has no `affiliate_url` and no entry in `affiliate_links`
- tool_vs_tool where both tools are in completely different primary categories
- Assembled body < 300 words
- Duplicate slug in `pseo_pages` or `articles`
- Tool has `active = false` or `pseo_enabled = false`
- Tool completeness score < 60% (Data Quality Guardian threshold)

**If Google sends a Manual Action for thin content:** run quality audit in admin, suppress all pages scoring below 70. This typically resolves within 2–4 weeks.

---

## Section 14 — Database schema

### pseo_pages

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| page_type | text | tool_vs_tool / alternatives / category_best / pricing / features / use_case / integration |
| slug | text | Unique full URL path |
| title | text | SEO title, max 60 chars |
| meta_description | text | Max 155 chars |
| h1 | text | Page heading |
| tool_id_primary | uuid | FK to tools |
| tool_id_secondary | uuid | FK to tools. Null for single-tool pages. |
| category | text | For category_best and use_case pages |
| body_html | text | Assembled page HTML |
| status | text | draft / published / suppressed |
| quality_score | integer | 0–100. Must be ≥ 60 to publish. |
| generated_at | timestamp | |
| indexed_at | timestamp | |
| search_impressions | integer | From GSC, updated weekly |
| search_clicks | integer | From GSC, updated weekly |
| content_engine_article_id | uuid | FK to articles if related CE article exists |
| updated_at | timestamp | Last regeneration time |

### pseo_quality_log, pseo_indexing_log, pseo_refresh_log — standard structure, see original spec fields.

### tools table — extended fields added by this spec

- `pseo_enabled` (boolean, default true) — set false to exclude from all pSEO generation
- `pseo_last_generated` (timestamp) — when pSEO pages were last generated for this tool
- `pseo_page_count` (integer) — number of published pSEO pages featuring this tool

---

## Section 15 — Multi-site scaling

Each site in your network gets its own instance with its own tools table and pseo_pages. The same tool can exist on multiple sites with different review data.

**5-minute replication:**
1. Open target Lovable project (Content Engine v2.1 must already be installed)
2. Add `INDEXNOW_KEY` to environment variables (same key works across sites)
3. Upload this document to Lovable chat
4. Answer the two setup questions for the new site
5. Paste the activation prompt
6. Populate the tools table with site-specific tools via the admin panel

`network_reports` is extended with `pseo_page_count` so the master dashboard shows pSEO performance per site. Cross-site linking between pSEO pages is handled by the Network Backlink Manager in the Smart Admin Dashboard — the pSEO engine does not manage cross-site links independently.

---

## Section 16 — Troubleshooting

**Pages generating but showing blank sections**
Tools table has empty fields. Admin panel → Tools data quality tab. Any tool below 70% completeness will produce pages with empty sections. Fill missing fields and hit Regenerate.

**Most pages stuck in draft**
Check `pseo_quality_log`. Common issues: `pros[]` fewer than 3 items, `pricing_tiers` invalid JSON, `affiliate_url` missing. Data Quality Guardian section in admin shows which fields are most commonly empty.

**tool_vs_tool comparing unrelated tools**
Tools `category[]` not consistently populated. Some may say 'app-builder' and others 'app builder'. Standardise category values across all tools and re-run generation.

**IndexNow returning 400 errors**
Verify `INDEXNOW_KEY` matches your indexnow.org account exactly. Key verification file must exist at `/{your-key}.txt` at your Lovable project's public URL. The activation prompt creates this file — check it exists.

**Google not indexing pSEO pages after 90 days**
Check pages are linked from somewhere. Category index pages (e.g. /best/app-builders) must be in homepage navigation to give Google a crawl path. Validate `sitemap-pseo.xml` returns valid XML. Check no pSEO page URLs return 404 or 500.

---

## Environment variables checklist

| Variable | Where to get it | Required? |
|---|---|---|
| `INDEXNOW_KEY` | indexnow.org (free) | YES |
| `GOOGLE_SEARCH_CONSOLE_TOKEN` | Google Search Console API | Optional |
| `GEMINI_API_KEY` | Already set by Content Engine | Already done |
| `RESEND_API_KEY` | Already set by Content Engine | Already done |
| `SITE_ID` | Already set by Content Engine | Already done |
