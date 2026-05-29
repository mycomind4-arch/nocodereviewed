# Autonomous Quality Gateway
## Decision Engine Spec v1.0 — Stupid People Edition
**Prepared May 2026 · Confidential**

| Attribute | Value |
|---|---|
| Version | 1.0 |
| Pairs with | Content Engine v1.0, pSEO Engine v1.0, Smart Admin Dashboard v1.1 |
| Lovable credits | 2–3 |
| Supabase required | Yes |
| Gemini API calls | 1 per scored item (scoring), 1/day (weight optimizer) |

---

## What this is

The Quality Gateway in the existing Content Engine spec is a filter. It receives an article, scores it on six dimensions, and makes a pass/fail decision. It does not learn from outcomes. It does not adapt its weights. It does not tell Gemini *what* was wrong before retrying. It does not catch the failure modes that matter most: voice drift, hallucinated pricing data, cross-site footprint patterns, and content that scores well on structure but converts no one.

This spec replaces that filter with a decision engine. The difference:

- **A filter** asks: is this good enough to publish?
- **A decision engine** asks: why did this fail, what should be fixed, and what does the outcome of publishing it tell us about whether our standards are right?

The gateway becomes the most important persistent system in your network — not because it blocks bad content, but because it gets better at defining what "bad" means based on what actually performs.

---

## Architecture overview

Five layers, two feedback loops.

```
INGEST → VALIDATE → SCORE → ROUTE → LEARN
                               ↑
              targeted retry loop (from Route back to Ingest)
                               ↑
              weight update loop (from Learn back to Score)
```

**Ingest** receives content from any engine: Content Engine articles, pSEO assembled pages, Refresh Agent rewrites, or manual admin triggers. Every item enters the same pipeline regardless of source.

**Validate** runs pre-scoring checks that are binary — fail any of these and the item never reaches scoring. These checks are computationally cheap and catch structural problems before spending a Gemini call on scoring.

**Score** runs the composite scoring model against the item and returns a dimensional breakdown, not just a total. The breakdown is what makes targeted retry possible.

**Route** makes the decision based on score, failure reason, and retry history. There are four outcomes — not two.

**Learn** reads published performance data weekly and adjusts scoring weights, banned phrase lists, and threshold settings. This is the loop that doesn't exist in the current spec.

---

## Layer 1 — Ingest

Every content item entering the gateway must carry a metadata envelope. The activation prompt adds this envelope to the Content Engine and pSEO Engine output before gateway submission.

### Metadata envelope schema

```json
{
  "item_id": "uuid",
  "source": "content_engine | pseo_engine | refresh_agent | manual",
  "keyword": "string",
  "article_type": "tool_review | comparison | tutorial | best_of_list | pseo_page",
  "site_id": "string",
  "tools_referenced": ["tool_slug_1", "tool_slug_2"],
  "generation_model": "gemini-2.5-flash",
  "generation_prompt_version": "integer",
  "content_body": "string (markdown or html)",
  "word_count": "integer",
  "submitted_at": "timestamp"
}
```

The `tools_referenced` field is populated by parsing the content body against the tools table. This is what enables the hallucination check — the gateway can verify every pricing claim and plan name against the database record for each referenced tool.

The `generation_prompt_version` field is critical for the Learn layer. When a weight adjustment changes what gets published, you need to know whether performance changes came from the new weights or a different prompt.

---

## Layer 2 — Validate (pre-scoring)

Four binary checks. Any failure here sets status to `pre_gate_rejected` and skips scoring entirely. Pre-gate rejections are cheaper (no Gemini call) and faster to fix because the failure reason is specific.

### Check 1 — Hallucination prevention

For each tool in `tools_referenced`, extract all pricing claims from the content body. A pricing claim is any mention of a dollar amount, plan name, tier name, or feature availability associated with a tool name.

Compare each extracted claim against the corresponding row in the tools table (`pricing_tiers` JSONB field).

**Fail condition:** Any pricing figure differs from the database record by more than $5, OR any plan name appears in the content that does not exist in `pricing_tiers`, OR any tool is described as having a feature that `pros[]` does not list and `cons[]` does not contradict.

**Fail action:** Set status `pre_gate_rejected`, rejection reason `hallucinated_pricing`, log the specific claim and the database value that contradicts it.

**Important:** This check requires `pricing_tiers` to be populated. If a referenced tool has no `pricing_tiers` data, skip the check for that tool and log `pricing_unverifiable` as a warning (not a rejection). The admin panel shows unverifiable checks as amber, not red.

### Check 2 — Phrase filter (expanded)

Run against the full banned phrases list stored in `site_settings.banned_phrases`. This check adds two categories beyond the existing list:

**Category A — AI filler (existing list):** The 24 phrases from the current Content Engine spec. One instance = 8 points deducted in scoring. This is already implemented.

**Category B — Voice drift signals (new):** Patterns that indicate Gemini is drifting toward generic AI voice. These are not fixed phrases — they are structural patterns detected by the validator. Examples:
- Opening sentence structured as "In this [article type], we will [verb] [topic]..."
- Transition phrases: "It's important to note that...", "Worth mentioning is...", "Moving on to..."
- Closing structures: "Overall, [Tool] is a [adjective] choice for..." (scores 72 but says nothing specific)
- List padding: bullet points containing fewer than 8 words

The drift signal list is seeded with 15 patterns and grows via the Phrase Harvester in the Learn layer.

**Category C — Footprint signals (new):** Phrases that appear across multiple articles in the same week, suggesting Gemini is settling into a repetitive pattern that could look like network content to Google. The validator checks this by querying the last 14 days of published articles and flagging any phrase that appears in 3 or more of them.

**Fail condition (hard fail):** Any Category A phrase appearing 3+ times, OR any footprint signal appearing in 5+ articles this week.

**Warning condition (soft, passes to scoring):** 1–2 Category A phrases, or any Category B pattern, or 2–4 articles sharing a footprint signal.

### Check 3 — Semantic duplicate detection

Query the articles table and pseo_pages table for any published content with keyword overlap above 85%. Overlap is calculated by comparing title + first 300 words of body content using a simple Jaccard similarity on token sets (no Gemini call needed — this runs in the database).

**Fail condition:** Overlap > 85% with any published article on this site.

**Warning condition:** Overlap 65–85% — passes to scoring but the Score layer applies a 10-point penalty to the "Original angle" dimension.

### Check 4 — Structural minimum

- Word count must exceed the article type minimum:
  - tool_review: 900 words
  - comparison: 1,100 words
  - tutorial: 800 words
  - best_of_list: 700 words
  - pseo_page: 300 words
- At least 2 H2 subheadings for any article over 600 words
- No H2 that is identical to the keyword (signals no structural thinking beyond the topic)

---

## Layer 3 — Score

The composite scoring model. Runs after all four pre-gate checks pass.

### Scoring dimensions

The existing six dimensions remain. Four new dimensions are added. Weights are adjustable via the Learn layer; defaults shown below.

| Dimension | Default weight | What is scored |
|---|---|---|
| Specificity | 18 pts | Names specific use cases, user types, scenarios. Generic benefit statements score zero. |
| Verdict clarity | 18 pts | Clear recommendation present. Who to use it for. Who to avoid it. "It depends" scores zero. |
| Original angle | 14 pts | Non-obvious perspective. Not a vendor feature list restated. |
| Limitations | 14 pts | Genuine cons acknowledged. Substantive, not softened. |
| Structure | 12 pts | Logical flow. Scannable headers. Tight content scores higher than padded filler. |
| No banned phrases | 12 pts | Zero Category A phrases. Each instance deducts 8 points. |
| **Voice drift delta** | **6 pts** | **Distance from this site's established voice baseline. High drift = low score.** |
| **Pricing accuracy** | **4 pts** | **All pricing claims verified against tools table. Unverifiable = 2 pts, accurate = 4 pts, inaccurate = 0 pts.** |
| **Footprint signal** | **4 pts** | **Inverse of cross-article phrase repetition score from Validate layer.** |
| **Conversion fit** | **4 pts** | **Does article tone and CTA match keyword commercial intent? (informational/navigational/commercial/transactional)** |

**Total: 106 possible points (weights sum to 106 because voice, pricing, footprint, conversion are additive bonuses above the existing 100-point scale)**

**Default pass threshold: 72/106** — equivalent to the existing 72/100 scaled for the new dimensions. Raise after 30 published articles if thin content is slipping through.

### Voice drift delta — implementation detail

The voice baseline is built from the first 20 published articles on each site. It is a statistical fingerprint: average sentence length, vocabulary diversity (type-token ratio), adverb density, passive voice frequency, and the top 50 most-used non-stopword phrases. Stored as `site_settings.voice_baseline` JSONB.

Each new article is measured against this baseline. Delta is the composite deviation across the five fingerprint dimensions. Zero deviation = 6 points. Delta above threshold = 0 points. The threshold is loose by default — the goal is catching severe drift (Gemini producing articles that feel like a different site), not enforcing stylistic uniformity.

### Conversion fit — implementation detail

Keyword intent is classified at the time the keyword is added to the queue. Classification is a lightweight Gemini call run once per keyword:
- Informational: "how to", "what is", "guide to"
- Navigational: "[tool name] login", "[tool name] pricing"
- Commercial: "[tool] review", "[tool] alternatives", "best [category]"
- Transactional: "buy [tool]", "[tool] free trial"

Articles written for commercial intent keywords should contain at least 1 explicit affiliate CTA, at least 1 clear verdict, and a price mention. Articles written for informational intent should not open with a sales pitch. A commercial keyword generating an article that never mentions price or makes a recommendation scores 0 conversion fit points.

### Scoring execution

The scorer submits the full content item plus dimension rubrics to Gemini 2.5 Flash in a single call. The system prompt instructs Gemini to return only a JSON object with per-dimension scores and a one-sentence justification per dimension.

```json
{
  "specificity": { "score": 16, "reason": "Names agency owners specifically but does not describe a concrete scenario" },
  "verdict_clarity": { "score": 18, "reason": "Clear recommendation for agencies under 10 clients, clear caution for larger teams" },
  ...
  "voice_drift_delta": { "score": 4, "reason": "Higher adverb density than baseline (1.8x), two sentences over 45 words" },
  "total": 84
}
```

The per-dimension justification is stored in `gateway_scores` JSONB on the `generation_log` row. This is what enables the targeted retry in the Route layer.

---

## Layer 4 — Route

Four outcomes instead of two.

### Outcome 1 — Publish (score ≥ threshold)

Mark status `published`. Proceed to IndexNow, sitemap update, newsletter queue, network_reports. No changes.

### Outcome 2 — Targeted retry (score < threshold, reason is fixable)

The current spec sends the original prompt for a blind retry. This spec sends a targeted re-prompt:

```
The following article failed the quality gateway. The ONLY problems are:
[list of failed dimensions with their justification strings]

Do not rewrite the entire article. Fix only the specific problems listed above.
Return the complete revised article.

Failed dimensions:
- Verdict clarity (scored 8/18): "Article ends without recommending who Bubble is best for vs who should choose Webflow"
- Voice drift (scored 2/6): "Higher adverb density than site baseline — reduce adverbs in final two sections"

Original article:
[full article body]
```

This retry uses approximately 2× the tokens of a standard generation call. It is limited to one targeted retry per item. If the retry fails the gateway, escalate to Outcome 3 or 4.

**Eligibility for targeted retry:**
- Total score is between 55 and threshold (items scoring below 55 are too broken to fix incrementally)
- Failed dimensions are scorable by Gemini (not structural/data issues)
- This is not the second retry for this keyword (no infinite loops)

### Outcome 3 — Hold and flag (data gap)

Triggered when the primary failure reason is a data problem the LLM cannot fix: `pricing_unverifiable`, `tools_table_empty_fields`, or a hallucination check failure (the data is wrong in the database, not in the article).

Mark status `held_data_gap`. Do not retry. Surface in admin panel with the specific data gap. Keyword stays in queue and regenerates automatically after the data is fixed (detected by `tools.updated_at > generation_log.run_at`).

### Outcome 4 — Kill and alert (repeated failure)

Triggered when: item has already had one targeted retry, or item scored below 45, or item triggered a hard-fail pre-gate condition (3+ banned phrases, 5+ footprint signals this week).

Mark status `failed`. Send failure alert via Resend. Log to `generation_log` with `final_status = failed`. Move to next keyword.

---

## Layer 5 — Learn

Runs weekly, Sundays at 07:00 UTC (before the newsletter send).

### Component 1 — Weight adjuster

Reads `generation_log` for the past 30 days. Groups published articles by which scoring dimensions were lowest at publish time. Cross-references with GSC performance data (if `GOOGLE_SEARCH_CONSOLE_TOKEN` is set) to identify whether low-scoring dimensions correlate with poor performance.

**Logic:** If articles with low "Original angle" scores (8–11/14) are performing as well or better than articles with high scores (13–14/14) in the same keyword category, reduce the weight of that dimension by 1 point and redistribute to the dimension most correlated with high-CTR articles.

Weight changes are small (+/- 1–2 points per cycle), logged to `gateway_weight_log`, and visible in the admin panel. The total always sums to the same maximum. No single dimension can drop below 50% of its default weight or rise above 150%.

**Without GSC:** The weight adjuster uses affiliate click data as a proxy for performance. Articles with zero affiliate clicks after 30 days are treated as low-performing.

### Component 2 — Phrase harvester

Every week, scans all articles published in the previous 7 days. Extracts all 3–6 word phrases. Identifies phrases appearing in 4+ articles that are not keyword-specific (i.e., not the name of a tool or category).

Candidate phrases are added to a review queue in the admin panel, not automatically to the banned list. The admin reviews and approves additions. This prevents over-pruning — the harvester finds patterns, the operator decides if they're a problem.

**Auto-approve threshold:** If a candidate phrase appears in 7+ articles in a single week AND appears in fewer than 2 articles from the previous month (i.e., it emerged suddenly), it is auto-approved to the banned phrases list and an alert is sent.

### Component 3 — Threshold optimizer

Reads the past 30 days of published articles. Calculates:
- Gateway pass rate (articles that passed / articles that entered scoring)
- Publish rate vs. retry rate
- Post-publish suppression rate (articles published then manually suppressed)

**Target ranges:**
- Pass rate: 65–80%. Below 65% = threshold may be too high or generation prompts need strengthening. Above 80% = threshold may be too low.
- Retry rate: below 25% of published volume. High retry rate with low pass rate = generation quality problem, not threshold problem.
- Suppression rate: below 5% of published volume. High suppression rate = threshold is passing things it shouldn't.

Optimizer surfaces a recommendation in the admin panel but does not automatically change the threshold. Threshold changes require admin approval.

---

## Database schema (new tables)

### gateway_scores (replaces simple integer in generation_log)

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| generation_log_id | uuid | FK to generation_log |
| specificity | integer | 0–18 |
| verdict_clarity | integer | 0–18 |
| original_angle | integer | 0–14 |
| limitations | integer | 0–14 |
| structure | integer | 0–12 |
| no_banned_phrases | integer | 0–12 |
| voice_drift_delta | integer | 0–6 |
| pricing_accuracy | integer | 0–4 |
| footprint_signal | integer | 0–4 |
| conversion_fit | integer | 0–4 |
| total | integer | 0–106 |
| dimension_reasons | jsonb | One-sentence justification per dimension |
| scored_at | timestamp | |

### gateway_weight_log

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| changed_at | timestamp | When weight change was applied |
| dimension | text | Which dimension changed |
| old_weight | integer | Previous weight |
| new_weight | integer | New weight |
| reason | text | Why the optimizer changed it |
| gsc_correlation | decimal | Correlation coefficient that drove the change |

### phrase_harvest_queue

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| phrase | text | The candidate banned phrase |
| occurrences_this_week | integer | How many articles contained it |
| first_seen_at | timestamp | When it first appeared in the corpus |
| auto_approved | boolean | True if above auto-approve threshold |
| admin_approved | boolean | Admin decision |
| reviewed_at | timestamp | When admin acted on it |

### voice_baseline (one row per site_id)

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| site_id | text | Which site |
| avg_sentence_length | decimal | Baseline average |
| type_token_ratio | decimal | Vocabulary diversity baseline |
| adverb_density | decimal | Adverbs per 100 words |
| passive_voice_rate | decimal | Passive sentences as fraction |
| top_phrases | text[] | 50 most-used non-stopword phrases |
| built_from_articles | integer | How many articles baseline was built from |
| last_updated | timestamp | When baseline was last recalculated |

---

## Admin panel additions

The existing `/content-admin` Quality Gateway section gains these new controls:

**Dimension weight editor:** Sliders for each of the 10 dimensions. Shows current weight, default weight, and the optimizer's last recommendation. "Apply recommendation" button.

**Voice baseline viewer:** Displays the current site voice fingerprint. "Rebuild baseline" button (uses last 20 published articles). Trend chart showing drift delta scores over the past 30 days — a rising average drift delta is an early warning that generation quality is degrading.

**Phrase harvest queue:** Table of candidate banned phrases with approve/reject buttons. Auto-approved phrases shown with a badge.

**Threshold optimizer panel:** Shows current pass rate, retry rate, and suppression rate with target range indicators. Optimizer recommendation with "Apply" and "Dismiss" buttons.

**Conversion intent map:** Table of all pending keywords with their classified intent. Allows manual override before generation.

---

## Activation prompt

Paste into Lovable alongside the existing Content Engine project. This prompt detects the existing gateway and upgrades it — it does not replace working components.

```
Upgrade the existing Quality Gateway in this Lovable project to the Autonomous Quality 
Gateway v1.0 specification.

Before building anything, audit the existing gateway for: (1) scoring dimensions in 
generation_log, (2) retry logic, (3) banned phrases list in site_settings.

For each component found: extend it to match the new spec. Do not delete existing 
scoring data.
For each component missing: build from scratch.

BUILD THE FOLLOWING ADDITIONS:

1. METADATA ENVELOPE
   Add a metadata wrapper to all Content Engine and pSEO Engine gateway submissions 
   including: source, keyword, article_type, tools_referenced, 
   generation_prompt_version, word_count.

2. VALIDATE LAYER (four pre-scoring checks)
   A. Hallucination check: extract pricing claims from content, compare against 
      tools table pricing_tiers. Reject on mismatch > $5 or nonexistent plan name.
   B. Phrase filter: extend existing banned phrases check with voice drift signal 
      patterns (15 starter patterns) and footprint signal detection 
      (cross-article phrase frequency).
   C. Semantic duplicate check: Jaccard similarity on title + first 300 words vs 
      all published articles. Reject > 85% overlap. Warn 65-85%.
   D. Structural minimum: enforce word count floors by article type. Require 2+ H2s 
      for articles over 600 words.

3. SCORING — FOUR NEW DIMENSIONS
   Add to existing six dimensions: voice_drift_delta (6pts), pricing_accuracy (4pts), 
   footprint_signal (4pts), conversion_fit (4pts). Total max 106. 
   Pass threshold remains 72 (now out of 106).
   Store per-dimension scores and justifications in new gateway_scores table.

4. ROUTE LAYER — FOUR OUTCOMES
   Replace binary pass/fail with: publish, targeted_retry, hold_data_gap, kill_alert.
   Targeted retry sends failed dimension justifications back to Gemini with the 
   original article. One retry maximum per item.

5. LEARN LAYER (weekly, Sunday 07:00 UTC)
   A. Weight adjuster: correlate dimension scores with GSC performance. Adjust 
      weights by ±1-2 pts. Log to gateway_weight_log.
   B. Phrase harvester: detect emerging repetition patterns. Add to 
      phrase_harvest_queue for admin review.
   C. Threshold optimizer: calculate pass rate, retry rate, suppression rate. 
      Surface recommendation in admin panel.

6. VOICE BASELINE
   Build voice fingerprint from first 20 published articles. Store in voice_baseline 
   table. Recalculate monthly.

7. ADMIN PANEL ADDITIONS
   Add to existing /content-admin Quality Gateway section: dimension weight editor, 
   voice baseline viewer with drift trend chart, phrase harvest queue, threshold 
   optimizer panel, conversion intent map.

8. DATABASE TABLES
   Create if not existing: gateway_scores, gateway_weight_log, phrase_harvest_queue, 
   voice_baseline. Extend generation_log with pre_gate_status field.

AFTER BUILDING: Confirm which existing gateway components were extended vs rebuilt. 
Confirm all new tables created. Confirm admin panel additions are accessible.
```

---

---

# Upgrade notes for existing specs

## Content Engine — 6 required changes

### Change 1 — Metadata envelope output
Every generated article must now emit the metadata envelope (defined in Layer 1 above) before submitting to the gateway. Add to the generation pipeline: parse content body for tool name mentions → match against tools table → populate `tools_referenced`. Add `generation_prompt_version` counter to `site_settings` and increment on any prompt edit.

### Change 2 — Keyword intent classification
Add a classification step when keywords are added to the queue (not at generation time). Run a lightweight Gemini call (one call per new keyword, not per article) to classify intent as informational/navigational/commercial/transactional. Store as `keyword_queue.intent`. The gateway uses this for conversion fit scoring.

### Change 3 — Targeted retry handling
The Content Engine's retry logic currently sends the original prompt unchanged. Replace with the targeted retry prompt from the Route layer. The failed dimension justifications from `gateway_scores.dimension_reasons` are injected into the retry prompt. The original article body is included for Gemini to edit rather than rewrite from scratch.

### Change 4 — Prompt version tracking
Add `generation_prompt_version` integer to `site_settings`. Increment automatically when the site identity block or master generation prompt is edited in the admin panel. This ties content quality changes to specific prompt versions in the data, making it possible to see whether a prompt edit improved or degraded gateway pass rates.

### Change 5 — Voice baseline seeding
After the first 20 articles are published, trigger the voice baseline build automatically. Notify admin in the overview dashboard. No manual step required.

### Change 6 — Footprint log
Add a daily cross-article phrase scan to the generation pipeline. Before each generation run, pull the last 7 days of published articles and extract the top 50 phrases by frequency. Store in a new `phrase_frequency_log` table. The gateway validator reads this table for footprint signal detection rather than re-scanning articles on every submission.

---

## Programmatic SEO Engine — 4 required changes

### Change 1 — Metadata envelope output
pSEO pages entering the gateway need the same metadata envelope as Content Engine articles. Key differences: `article_type` is always `pseo_page`, `tools_referenced` is populated from `tool_id_primary` and `tool_id_secondary` fields (already in the schema), `generation_prompt_version` is `0` (pSEO pages are assembled, not prompted).

### Change 2 — Hallucination check integration
pSEO pages are more vulnerable to hallucination than Content Engine articles because they assemble data directly from the database. The pre-gate hallucination check on pSEO pages works differently: instead of extracting claims from prose, it verifies that every value rendered in template slots (`pricing_tiers`, `rating_overall`, `pros[]`, `cons[]`) exactly matches the corresponding database record at the time of assembly. Any discrepancy between the rendered HTML and the source data is a generation bug (template slot population failure) and triggers `pre_gate_rejected` with reason `template_data_mismatch`.

### Change 3 — Conversion fit for pSEO pages
pSEO page types have fixed commercial intent classifications:
- `tool_vs_tool`: commercial (high)
- `alternatives`: commercial (high)
- `pricing`: transactional
- `category_best`: commercial (medium)
- `features`: informational
- `use_case`: commercial (medium)

Conversion fit scoring for pSEO pages does not require a keyword intent classification call. Use the type-based mapping above. A `pricing` page with no affiliate CTA button rendered scores 0 conversion fit.

### Change 4 — Voice drift delta for pSEO pages
pSEO pages are assembled from templates, not generated by Gemini, so voice drift as measured for prose articles does not apply. Instead, measure structural drift: does this page's HTML structure match the expected template structure for its type? Any missing required section (e.g., a `tool_vs_tool` page without a "Winner verdict" section) is treated as a structural drift signal and scores 2/6 instead of 6/6.

---

## Smart Admin Dashboard — 3 required changes

### Change 1 — Gateway intelligence panel
The existing Quality Gateway section shows a threshold slider and recent scores. Replace with the full panel described in the Gateway admin additions section above: dimension weight editor, voice baseline viewer, phrase harvest queue, threshold optimizer, conversion intent map.

The gateway intelligence panel is the most important section in the entire dashboard — it is where the system shows you what it is learning and what it recommends. Prioritise it in the sidebar navigation above Content Settings.

### Change 2 — Smart suggestions integration
The dashboard's Smart Suggestions feature (daily Gemini call) should now include gateway health as a signal. Add to the Smart Suggestions system prompt:

```
In addition to queue depth and traffic analysis, analyse the following gateway data:
- Current dimension weights vs defaults (flag any dimension that has drifted >2pts)
- 7-day pass rate trend (flag if pass rate is declining week-over-week)
- Phrase harvest queue (flag if 5+ phrases are pending review)
- Most common failure reason in the past 7 days

Include one gateway-specific recommendation in your daily suggestion.
```

### Change 3 — Cross-engine gateway view
The dashboard currently shows gateway stats per engine separately. Add a unified gateway view that shows:
- Combined pass rate across Content Engine and pSEO Engine
- Failure reason breakdown across both engines (which reasons are most common)
- Dimension score averages across both engines (which dimensions are consistently weak network-wide)
- Voice baseline drift trend per site (for multi-site mode)

---

## No-Code Empire Plan — 2 strategic additions

### Addition 1 — Gateway as competitive moat (updated framing)
The plan describes the quality gateway as "the difference between a $2M asset and a banned domain." This framing is correct but the execution described (a single threshold, a fixed phrase list, one retry) is not durable at 14,400 articles/year.

At that volume, the gateway must adapt. By month 6, Gemini's patterns will have been seen by Google enough times to register as a signal if the same phrase structures appear across 10 sites. The Learn layer in this spec is what prevents that — the phrase harvester catches emerging repetition patterns before they calcify into a footprint.

Add to the risk mitigation section: "Content quality drift" should note that the Autonomous Quality Gateway's weekly learning cycle is the primary mitigation. The quarterly "rebuild system prompts" recommendation remains valid as a manual check. The gateway learning loop reduces the frequency at which manual rebuilds are needed.

### Addition 2 — Agent Swarm update (Agent 2)
Agent 2 (Content Engine) description should be updated to reflect targeted retry as a separate agent behaviour, not a simple retry loop. The upgrade also means Agent 2 should report not just `articles_published` and `articles_failed` but `articles_targeted_retried` and `articles_held_data_gap` to the network_reports table. Agent 4 (Rank Monitor) can use the `held_data_gap` count as a proxy for data quality health across sites — a site with many held articles has tools table gaps that need filling.

---

## Environment variables added by this spec

| Variable | Source | Required? |
|---|---|---|
| `GATEWAY_VERSION` | Set to `2` on activation | YES — prevents double-upgrade |
| `VOICE_BASELINE_MIN_ARTICLES` | Default `20` | Optional — override minimum for baseline build |
| `PHRASE_HARVEST_AUTO_APPROVE_THRESHOLD` | Default `7` | Optional — override auto-approve count |
| `WEIGHT_OPTIMIZER_ENABLED` | Default `true` | Optional — disable if you want manual control only |

All other variables are already set by the Content Engine spec.

---

*Autonomous Quality Gateway — Decision Engine Spec v1.0 · May 2026*
