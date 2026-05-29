# Autonomous Quality Gateway
## Decision Engine v1.1 — Personal Stack Edition
**Prepared May 2026 · Confidential**

| Attribute | Value |
|---|---|
| Version | 1.1 |
| Prepared | May 2026 |
| Pairs with | Content Engine v2.1, pSEO Engine v1.0, Smart Admin Dashboard v1.1, LLM Abstraction Layer v1.0 |
| Default LLM | Gemini 2.5 Flash via LLM Abstraction Layer (engine = 'gateway') |
| Supabase required | Yes |
| LLM calls | 1 per scored item (scoring), 1/day (weight optimizer), 0 for pre-gate checks |

---

## What changed in v1.1

| Change | What it fixes |
|---|---|
| LLM abstraction | All scoring calls route through LLM Abstraction Layer. Switch scoring model independently from generation model. |
| pSEO integration fixes | Four required pSEO-specific gateway behaviours are now explicit in the activation prompt. |
| Gateway independence note | Explicit documentation of the self-evaluation limitation and how to mitigate it. |
| Monetization Engine integration | `conversion_fit` cap (RES ≤ 35) is now documented as a deliberate integration point. |
| Fallback handling | If `gateway_scores` table is missing, RES cap skips gracefully with a health log warning. |

---

## What this is

The Quality Gateway is a decision engine, not a filter. A filter asks: is this good enough to publish? A decision engine asks: why did this fail, what should be fixed, and what does the publishing outcome tell us about whether our standards are right?

Five layers, two feedback loops.

```
INGEST → VALIDATE → SCORE → ROUTE → LEARN
                               ↑
              targeted retry loop (Route → Ingest)
                               ↑
              weight update loop (Learn → Score)
```

**Ingest** receives content from any engine: Content Engine articles, pSEO assembled pages, Refresh Agent rewrites, manual admin triggers.

**Validate** runs pre-scoring binary checks. Fail any of these and the item never reaches scoring — no LLM call wasted.

**Score** runs the composite scoring model and returns a dimensional breakdown, not just a total. The breakdown is what makes targeted retry possible.

**Route** makes the decision based on score, failure reason, and retry history. Four outcomes, not two.

**Learn** reads published performance data weekly and adjusts scoring weights, banned phrase lists, and threshold recommendations.

---

## Contents

| Section | Title |
|---|---|
| 01 | Activation prompt |
| 02 | Layer 1 — Ingest |
| 03 | Layer 2 — Validate |
| 04 | Layer 3 — Score |
| 05 | Layer 4 — Route |
| 06 | Layer 5 — Learn |
| 07 | Admin panel additions |
| 08 | Integration points |
| 09 | Database schema |
| 10 | Troubleshooting |

---

## Section 01 — Activation prompt

Activate after the Content Engine is installed. Paste into Lovable.

```
Upgrade the existing Quality Gateway in this Lovable project to
Autonomous Quality Gateway v1.1.

Before building anything, audit for: (1) existing gateway scoring logic in
generation_log, (2) retry logic, (3) banned phrases in site_settings,
(4) llm_config table (created by Content Engine v2.1).

For each component found: extend to match this spec. Do not delete existing
scoring data.
For each component missing: build from scratch.

DEFAULT LLM: All scoring calls use engine='gateway' from llm_config table.
If no gateway row exists in llm_config, create one:
engine='gateway', provider='gemini', model_name='gemini-2.5-flash',
api_key_env_var='GEMINI_API_KEY', active=true, cost_per_1k_tokens=0.00015.

BUILD THE FOLLOWING:

1. METADATA ENVELOPE VALIDATION
Confirm every incoming content item carries a metadata envelope with:
source, keyword, article_type, site_id, tools_referenced, generation_model,
generation_prompt_version, content_body, word_count, submitted_at, llm_provider,
llm_model. Reject without envelope — log 'missing_metadata_envelope'.

2. VALIDATE LAYER — four pre-scoring checks (no LLM call, runs in database)

CHECK A — Hallucination prevention:
For each tool in tools_referenced, extract pricing claims from content body
(dollar amounts, plan names, tier names, feature availability).
Compare against tools table pricing_tiers JSONB.
Fail condition: any pricing figure differs by more than $5, OR any plan name
in content doesn't exist in pricing_tiers, OR tool described as having feature
that pros[] doesn't list.
Fail action: pre_gate_rejected, reason hallucinated_pricing.
If tool has no pricing_tiers: skip check for that tool, log pricing_unverifiable
as warning (not rejection). Show amber in admin, not red.

CHECK B — Phrase filter (three categories):
Category A — AI filler: 24 phrases from banned_phrases in site_settings.
Hard fail: 3+ instances of Category A phrases.
Soft warn: 1–2 instances (passes to scoring, dimension deduction applied).
Category B — Voice drift signals: 15 structural patterns (seeded on activation):
  - Opening: "In this [article type], we will [verb] [topic]"
  - Transitions: "It's important to note that", "Worth mentioning is",
    "Moving on to", "With that said"
  - Closings: "Overall, [Tool] is a [adjective] choice for"
  - List padding: bullet points under 8 words
Category C — Footprint signals: phrases appearing in 3+ published articles
in the last 14 days (queried from articles table, not re-scanned per submission).
Hard fail: any footprint phrase appearing in 5+ articles this week.
Soft warn: 2–4 articles sharing a phrase.

CHECK C — Semantic duplicate detection:
Query articles and pseo_pages for published content with keyword overlap above
85% (Jaccard similarity on title + first 300 words, tokenised, no LLM call).
Fail condition: overlap > 85% with any published article on this site.
Warning condition: overlap 65–85% — passes to scoring with 10-point penalty
on Original angle dimension.

CHECK D — Structural minimum:
Word count floors: tool_review 900, comparison 1100, tutorial 800,
best_of_list 700, pseo_page 300.
At least 2 H2 subheadings for any article over 600 words.
No H2 identical to the keyword.

3. SCORE LAYER — 10 dimensions, 106 point maximum

Submit full content item plus dimension rubrics to LLM (engine='gateway'
from llm_config). System prompt instructs LLM to return only JSON with
per-dimension scores and one-sentence justification per dimension.

Dimensions and default weights:
- specificity: 18 pts
- verdict_clarity: 18 pts
- original_angle: 14 pts
- limitations: 14 pts
- structure: 12 pts
- no_banned_phrases: 12 pts
- voice_drift_delta: 6 pts (0 until voice_baseline is built from 20 articles)
- pricing_accuracy: 4 pts
- footprint_signal: 4 pts
- conversion_fit: 4 pts

Store per-dimension scores AND justification strings in gateway_scores table.
This is critical — justifications drive targeted retry.

Voice drift delta implementation:
Compare article against voice_baseline JSONB in site_settings.
Measure: avg_sentence_length, type_token_ratio, adverb_density,
passive_voice_rate, top phrase overlap.
Zero deviation = 6 points. Delta above threshold = 0 points.
If no baseline built yet: award full 6 points (don't penalise early articles).

Pricing accuracy implementation:
Cross-reference against same hallucination check data from Validate layer.
Accurate = 4 pts. Unverifiable (no pricing_tiers) = 2 pts. Inaccurate = 0 pts.

Conversion fit implementation:
Read keyword_queue.intent for the submitted keyword.
Commercial/transactional: needs affiliate CTA + price mention + clear verdict.
Informational: must not open with a sales pitch.
Missing required elements for intent = 0 pts.

Footprint signal implementation:
Read phrase_frequency_log (populated before each generation run by Content Engine).
Inverse score: phrases in 4+ articles this week = reduced score.
Clean article (no shared phrases) = 4 pts.

4. ROUTE LAYER — four outcomes

Outcome 1 — Publish: score >= threshold.
Mark published. Proceed to IndexNow, sitemap, newsletter queue, network_reports.

Outcome 2 — Targeted retry: score 55–threshold, first attempt only.
Build targeted re-prompt:
  "The following article failed the quality gateway. The ONLY problems are:
  [list of failed dimensions with justification strings from gateway_scores]
  Do not rewrite the entire article. Fix only the listed problems.
  Return the complete revised article.
  Original article: [full content body]"
Log retry attempt with injected re-prompt to generation_log.
One retry maximum. If retry fails: escalate to Outcome 3 or 4.

Eligibility for targeted retry:
- Score between 55 and threshold
- Failed dimensions are content issues (not structural/data issues)
- Not the second retry for this keyword

Outcome 3 — Hold and flag (data gap):
Triggered by: pricing_unverifiable, tools_table_empty_fields, or
hallucination check failure where the database is wrong, not the article.
Mark held_data_gap. Do not retry. Surface in admin with specific data gap.
Auto-regenerate when tools.updated_at > generation_log.run_at.

Outcome 4 — Kill and alert:
Triggered by: second retry failure, score < 45, hard pre-gate fail
(3+ banned phrases, 5+ footprint signals this week).
Mark failed. Send Resend alert. Log to generation_log with
final_status = failed. Move to next keyword.

5. LEARN LAYER — runs weekly, Sundays 07:00 UTC

Component A — Weight adjuster:
Read generation_log for past 30 days. Group published articles by lowest-scoring
dimensions at publish time. Cross-reference with GSC performance (if
GOOGLE_SEARCH_CONSOLE_TOKEN set) or affiliate_clicks as proxy.
Logic: if articles with low scores on a dimension perform as well as articles
with high scores on that dimension, reduce weight by 1 pt and redistribute.
Weight constraints: no dimension below 50% of default, no dimension above 150%.
Log all changes to gateway_weight_log. Show in admin with approve/dismiss.

Component B — Phrase harvester:
Scan all articles published in previous 7 days. Extract 3–6 word phrases.
Flag phrases appearing in 4+ articles that are not tool/category names.
Add to phrase_harvest_queue for admin review (never auto-add to banned list).
Exception: if phrase appears in 7+ articles in one week AND appeared in
fewer than 2 articles the previous month, auto-approve and send alert.

Component C — Threshold optimizer:
Calculate: pass rate (target 65–80%), retry rate (target <25% of published),
suppression rate (target <5% of published).
Surface recommendation in admin panel. Never auto-change threshold.
Recommendation requires admin approval.

6. PSEO-SPECIFIC GATEWAY BEHAVIOURS
pSEO pages enter the same pipeline with these differences:

Metadata envelope: article_type = 'pseo_page', generation_prompt_version = 0
(assembled pages, not prompted), tools_referenced populated from
tool_id_primary and tool_id_secondary fields.

Hallucination check for pSEO: Instead of extracting prose claims,
verify that every value in template slots (pricing_tiers, rating_overall,
pros[], cons[]) exactly matches the database record at assembly time.
Any discrepancy = pre_gate_rejected with reason template_data_mismatch.

Voice drift for pSEO: Measure structural drift instead of prose drift.
Does this page's HTML structure match the expected template for its type?
Missing required section (e.g. tool_vs_tool without winner verdict) = 2/6.
Complete structure = 6/6.

Conversion fit for pSEO (fixed intent by page type):
- tool_vs_tool: commercial (high) — needs affiliate CTAs for both tools
- alternatives: commercial (high) — needs affiliate CTA for primary tool
- pricing: transactional — needs affiliate CTA, no CTA = 0 pts
- category_best: commercial (medium)
- features: informational — CTA not required
- use_case: commercial (medium)

7. MONETIZATION ENGINE INTEGRATION
The Monetization Engine's Revenue Efficiency Score applies a conversion_fit cap:
articles scoring 0 on conversion_fit are capped at RES 35 regardless of offer
quality. This engine writes conversion_fit scores to gateway_scores table.
The Monetization Engine reads from there. No additional work needed here.

If gateway_scores table is queried by the Monetization Engine and returns no
row for an article, the Monetization Engine should skip the cap (handled there,
but note the dependency so activation order is clear).

8. ADMIN PANEL ADDITIONS
Add to /content-admin Quality Gateway section:

Dimension weight editor: sliders for all 10 dimensions. Current weight,
default weight, optimizer's last recommendation. Apply recommendation button.

Voice baseline viewer: current fingerprint stats. Rebuild baseline button.
30-day drift trend chart. Rising drift = amber warning.

Phrase harvest queue: table of candidate phrases with approve/reject buttons.
Auto-approved phrases shown with amber badge.

Threshold optimizer panel: current pass rate, retry rate, suppression rate
with target range indicators. Recommendation with Apply and Dismiss buttons.

Conversion intent map: all pending keywords with classified intent.
Manual override available per keyword.

Gateway LLM indicator: shows which model is being used for scoring
(reads from llm_config engine='gateway'). Link to LLM Settings to change.

9. DATABASE TABLES
Create if not existing:
gateway_scores, gateway_weight_log, phrase_harvest_queue, voice_baseline.
Extend generation_log with pre_gate_status field.

AFTER BUILDING: Confirm which existing gateway components were extended vs
rebuilt. Confirm all new tables created. Confirm all scoring calls route
through llm_config.
```

---

## Section 02 — Layer 1 — Ingest

Every content item entering the gateway must carry a metadata envelope. Items without the envelope are rejected immediately with `missing_metadata_envelope` — this prevents silent failures where a content item is scored without context.

### Metadata envelope schema

```json
{
  "item_id": "uuid",
  "source": "content_engine | pseo_engine | refresh_agent | manual",
  "keyword": "string",
  "article_type": "tool_review | comparison | tutorial | best_of_list | pseo_page",
  "site_id": "string",
  "tools_referenced": ["tool_slug_1", "tool_slug_2"],
  "generation_model": "string",
  "generation_prompt_version": "integer",
  "llm_provider": "string",
  "llm_model": "string",
  "content_body": "string",
  "word_count": "integer",
  "submitted_at": "timestamp"
}
```

`tools_referenced` is populated by parsing content body against the tools table. This enables the hallucination check — the gateway can verify every pricing claim against the database record for each referenced tool.

`generation_prompt_version` is critical for the Learn layer. When weight adjustments change what gets published, you need to know whether performance changes came from the new weights or a different prompt.

---

## Section 03 — Layer 2 — Validate

Four binary checks. Any failure here sets status to `pre_gate_rejected` and skips scoring entirely. These checks run in the database — no LLM call consumed.

### The self-evaluation limitation

The scoring layer uses an LLM to evaluate LLM-generated content. This is an acknowledged structural limitation. The Validate layer is where independent checks happen — hallucination detection, phrase filtering, duplicate detection, and structural minimums are all rule-based, not LLM-judged. These checks cannot be gamed by the generation model because they compare against hard data sources (tools table, articles table, word counts). The Score layer catches quality; the Validate layer catches correctness.

**What to do if you suspect scoring is drifting toward rubber-stamping:** Add more specific banned phrases, raise the threshold temporarily, or switch the scoring model to a different provider than the generation model. Two different LLMs evaluating each other catches more than one evaluating itself.

### Check A — Hallucination prevention

Compares every pricing claim in the article against `tools.pricing_tiers`. A pricing claim is any mention of a dollar amount, plan name, tier name, or feature availability associated with a tool name.

If a tool has no `pricing_tiers` data: skip the check for that tool, log `pricing_unverifiable` as a warning, show amber in admin.

### Check B — Phrase filter

Three categories:

**Category A** — 24 AI filler phrases from `site_settings.banned_phrases`. Hard fail at 3+ instances. Soft warn at 1–2 (passes to scoring with dimension deduction).

**Category B** — 15 structural drift patterns seeded on activation. These catch Gemini's habitual structural patterns: formulaic openings, transition padding, empty closing sentences, short bullets. The list grows via the Phrase Harvester.

**Category C** — Footprint signals from `phrase_frequency_log`. Phrases appearing in 3+ articles in the past 14 days. Hard fail at 5+ articles. The phrase_frequency_log is populated before each generation run by the Content Engine, so this check reads from a cached table rather than re-scanning all articles on every submission.

### Check C — Semantic duplicate detection

Jaccard similarity on title + first 300 words, tokenised, computed in-database. No LLM call needed. Overlap above 85% rejects. Overlap 65–85% passes with a 10-point penalty on the Original angle dimension.

### Check D — Structural minimum

Word count floors by article type. At least 2 H2 subheadings for articles over 600 words. No H2 identical to the keyword.

---

## Section 04 — Layer 3 — Score

Runs after all four pre-gate checks pass. Submits the full content item plus dimension rubrics to the LLM configured in `llm_config` where `engine = 'gateway'`.

### Scoring dimensions

| Dimension | Default weight | What is scored |
|---|---|---|
| Specificity | 18 pts | Names specific use cases, user types, scenarios. Generic benefits score zero. |
| Verdict clarity | 18 pts | Clear recommendation present. Who to use it for. Who to avoid it. "It depends" scores zero. |
| Original angle | 14 pts | Non-obvious perspective. Not a vendor feature list restated. |
| Limitations | 14 pts | Genuine cons acknowledged. Substantive, not softened. |
| Structure | 12 pts | Logical flow. Scannable headers. Tight content scores higher than filler. |
| No banned phrases | 12 pts | Zero Category A phrases. Each instance deducts 8 points. |
| Voice drift delta | 6 pts | Distance from site voice baseline. High drift = low score. Full marks until baseline is built. |
| Pricing accuracy | 4 pts | Claims verified against tools table. Unverifiable = 2 pts, accurate = 4 pts, inaccurate = 0 pts. |
| Footprint signal | 4 pts | Inverse of cross-article phrase repetition from Validate layer. |
| Conversion fit | 4 pts | Article tone and CTA match keyword intent. |

**Total: 106 points. Default pass threshold: 72.**

### Scoring response format

The LLM returns only a JSON object:

```json
{
  "specificity": { "score": 16, "reason": "Names agency owners but no concrete scenario" },
  "verdict_clarity": { "score": 18, "reason": "Clear recommendation for agencies under 10 clients" },
  "original_angle": { "score": 12, "reason": "Some vendor phrasing in features section" },
  "limitations": { "score": 14, "reason": "Genuine pricing limitation acknowledged with specifics" },
  "structure": { "score": 11, "reason": "Good headers, one section runs long" },
  "no_banned_phrases": { "score": 12, "reason": "No banned phrases detected" },
  "voice_drift_delta": { "score": 4, "reason": "Higher adverb density than baseline" },
  "pricing_accuracy": { "score": 4, "reason": "All pricing claims match tools table" },
  "footprint_signal": { "score": 3, "reason": "One phrase appears in 3 articles this week" },
  "conversion_fit": { "score": 4, "reason": "Commercial keyword with clear CTA and price mention" },
  "total": 98
}
```

The per-dimension justification strings are stored in `gateway_scores` and are what power targeted retry. Without them, retry is blind.

---

## Section 05 — Layer 4 — Route

### The four outcomes

**Publish** — score ≥ threshold. Mark published. Proceed to IndexNow, sitemap update, newsletter queue, network_reports write.

**Targeted retry** — score 55–threshold, first attempt. Build targeted re-prompt with failed dimension justifications. LLM edits the original rather than rewriting from scratch. Uses approximately 2× the tokens of a standard generation call. One retry maximum.

**Hold and flag** — data gap failures. Mark `held_data_gap`. Do not retry. Surface in admin. Auto-regenerate when tools data is fixed.

**Kill and alert** — score < 45, second failure, or hard pre-gate fail. Mark failed. Send Resend alert. Move to next keyword. The keyword stays in the queue at reduced priority for potential future manual retry.

---

## Section 06 — Layer 5 — Learn

Runs weekly, Sundays 07:00 UTC — before newsletter send (08:00 UTC) and before Monetization Engine Score layer (06:00 UTC the same day, so Learn runs after Monetization).

### Weight adjuster

Weight changes are small (±1–2 points per cycle). All changes require admin approval before applying. Total always sums to the same maximum. No single dimension can drop below 50% of its default weight or rise above 150%.

### Phrase harvester

Finds emerging repetition patterns. Adds to `phrase_harvest_queue` for admin review — never auto-adds to banned list except when a phrase appears in 7+ articles in one week AND appeared in fewer than 2 articles the previous month (sudden emergence = likely new Gemini pattern).

### Threshold optimizer

Calculates pass rate, retry rate, suppression rate weekly. Targets: pass rate 65–80%, retry rate below 25% of published volume, suppression rate below 5%. Surfaces recommendation. Does not auto-change threshold — this requires your judgment.

**If pass rate is below 65%:** either the threshold is too high, the prompts are producing weak content, or the LLM model changed behaviour. Check which dimensions are failing most often before adjusting threshold.

**If pass rate is above 80%:** either the threshold is too low, or your prompts are genuinely producing strong content. Check whether published content looks high-quality before lowering the threshold.

---

## Section 07 — Admin panel additions

All additions go into the existing `/content-admin` Quality Gateway section.

**Dimension weight editor** — sliders for all 10 dimensions. Current weight, default weight, optimizer recommendation. Apply recommendation button.

**Voice baseline viewer** — current fingerprint stats (avg sentence length, vocab diversity, adverb density, passive voice rate). Rebuild baseline button. 30-day drift delta trend chart.

**Phrase harvest queue** — candidate phrases with approve/reject buttons. Auto-approved phrases shown with amber badge.

**Threshold optimizer panel** — current pass rate, retry rate, suppression rate with target range indicators. Recommendation with Apply and Dismiss.

**Conversion intent map** — pending keywords with classified intent. Manual override available.

**Gateway LLM indicator** — shows current scoring model. Link to LLM Settings.

**Cross-engine gateway view** — when multiple sites are active in multi-site mode: combined pass rate across Content Engine and pSEO Engine, failure reason breakdown across both engines, dimension score averages network-wide, voice baseline drift trend per site.

---

## Section 08 — Integration points

### Content Engine
Receives scored articles back with dimension justifications. Uses justifications for targeted retry. Reads `conversion_fit` scores for feed into Monetization Engine RES cap.

### pSEO Engine
Same pipeline. Different envelope values and scoring rules for `voice_drift_delta` and `conversion_fit` (see activation prompt Section 6 above).

### Monetization Engine
Reads `gateway_scores.conversion_fit` to apply RES cap (articles scoring 0 on conversion_fit capped at RES 35). If `gateway_scores` row does not exist for an article, Monetization Engine skips the cap and logs a warning.

### Smart Admin Dashboard
Displays gateway intelligence panel. Receives daily Smart Suggestions that include gateway health signals: dimension weight drift, 7-day pass rate trend, pending phrase harvest count, most common failure reason.

### Data Quality Guardian
The `held_data_gap` count in `network_reports` is a proxy for tools table health. The Guardian reads this alongside its own completeness scores to prioritise which tool records need filling.

---

## Section 09 — Database schema

### gateway_scores

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
| dimension_reasons | jsonb | Per-dimension justification strings |
| pre_gate_status | text | passed / rejected with reason |
| scored_at | timestamp | |
| llm_model | text | Scoring model used |

### gateway_weight_log

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| changed_at | timestamp | |
| dimension | text | Which dimension changed |
| old_weight | integer | |
| new_weight | integer | |
| reason | text | Optimizer justification |
| approved_by | text | Admin user ID |

### phrase_harvest_queue

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| phrase | text | Candidate phrase |
| occurrence_count | integer | How many articles this week |
| first_seen | timestamp | |
| status | text | pending / approved / rejected |
| auto_approved | boolean | True if met auto-approve threshold |
| reviewed_at | timestamp | |

### voice_baseline

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| site_id | text | |
| avg_sentence_length | decimal | |
| type_token_ratio | decimal | Vocabulary diversity |
| adverb_density | decimal | |
| passive_voice_rate | decimal | |
| top_phrases | text[] | 50 most-used non-stopword phrases |
| built_from_articles | integer | How many articles baseline was built from |
| last_updated | timestamp | |

---

## Section 10 — Troubleshooting

**Pass rate chronically below 65%**
Check which dimensions fail most in `gateway_scores`. If `specificity` and `verdict_clarity` are consistently low, the generation prompt needs strengthening — the site identity block may be too generic. If `voice_drift_delta` is failing for early articles, the baseline hasn't been built yet (needs 20 published articles).

**Targeted retry not improving scores**
Check `dimension_reasons` in `gateway_scores` for the retry attempt. If the justification says "content fundamentally off-topic" or "article too short", editing won't fix it — the keyword needs a different article type. Move to kill, add keyword back to queue with a different type.

**Phrase harvester producing too many false positives**
The harvester flags phrases appearing in 4+ articles. For a very specific niche, some topical phrases will naturally repeat. Review the harvest queue before approving — reject any phrase that is topic-specific (tool names, category names, workflow terms). Only approve genuine AI-voice patterns.

**Gateway LLM cost is high**
Switch `engine='gateway'` in `llm_config` to Gemini 2.5 Flash if not already set. Scoring calls are longer (full article + rubric) but Flash is fast enough and substantially cheaper than Pro. Alternatively, only use Pro for articles that fail and are being retried.

**pSEO pages all failing with template_data_mismatch**
Open the tools table and check that `pricing_tiers`, `pros[]`, and `cons[]` are populated for the tools involved. The hallucination check for pSEO verifies template slot values against the database — if the database fields are empty, the assembled template will have empty slots that fail the check.
