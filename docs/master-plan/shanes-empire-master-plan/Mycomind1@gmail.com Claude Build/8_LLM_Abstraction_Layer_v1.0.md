# LLM Abstraction Layer
## Unified Provider Interface v1.0 — Personal Stack Edition
**Prepared May 2026 · Confidential**

| Attribute | Value |
|---|---|
| Version | 1.0 |
| Prepared | May 2026 |
| Activates with | Content Engine v2.1 (creates `llm_config` table) |
| Required by | Content Engine v2.1, Quality Gateway v1.1, pSEO Engine v1.1, CRO Engine v1.1, Smart Admin Dashboard v1.2 |
| Default provider | Gemini 2.5 Flash |
| Supported providers | Gemini (Google), Anthropic (Claude), OpenAI (GPT) |

---

## What this is

Every LLM call in the stack routes through this layer rather than calling provider APIs directly. The layer reads provider, model, and API key configuration from a single Supabase table (`llm_config`) and wraps every API call in a consistent interface with cost tracking, fallback handling, and error logging.

This means you can switch any engine from Gemini to Claude to GPT-4o in the admin panel without redeploying, changing environment variables, or editing code. The switch takes effect on the next run.

---

## Contents

| Section | Title |
|---|---|
| 01 | The `llm_config` table |
| 02 | The abstraction wrapper function |
| 03 | Supported models and costs |
| 04 | Per-engine assignments |
| 05 | Fallback handling |
| 06 | Cost tracking |
| 07 | Admin panel — LLM settings |
| 08 | Activation prompt |
| 09 | Troubleshooting |

---

## Section 01 — The `llm_config` table

The single source of truth for all LLM configuration. Created by the Content Engine v2.1 activation prompt.

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| engine | text | Which engine this row configures. See Section 04. |
| provider | text | `gemini` / `anthropic` / `openai` |
| model_name | text | Exact model string. See Section 03. |
| api_key_env_var | text | Name of the environment variable holding the API key |
| active | boolean | True = this row is active for its engine |
| cost_per_1k_tokens | decimal | Estimated cost per 1,000 tokens. Used for cost tracking. |
| created_at | timestamp | |
| updated_at | timestamp | Updated when model is changed in admin panel |

**One active row per engine.** Switching a model writes a new `updated_at` timestamp and changes `model_name` and `provider` on the existing row. Old model is not retained in this table — check `llm_switch_log` for history.

### Default seed rows (created by Content Engine v2.1 activation)

| engine | provider | model_name | api_key_env_var | cost_per_1k_tokens |
|---|---|---|---|---|
| content | gemini | gemini-2.5-flash | GEMINI_API_KEY | 0.00015 |
| gateway | gemini | gemini-2.5-flash | GEMINI_API_KEY | 0.00015 |
| intent | gemini | gemini-2.5-flash | GEMINI_API_KEY | 0.00015 |
| suggestions | gemini | gemini-2.5-flash | GEMINI_API_KEY | 0.00015 |
| newsletter | gemini | gemini-2.5-flash | GEMINI_API_KEY | 0.00015 |
| cro_design | gemini | gemini-2.5-flash | GEMINI_API_KEY | 0.00015 |

---

## Section 02 — The abstraction wrapper function

A single Edge Function wraps all provider calls. No engine calls a provider API directly.

### Function signature

```javascript
// /functions/llm-call/index.ts
// Called by every engine that needs an LLM call

async function llmCall({
  engine,           // string: matches llm_config.engine
  systemPrompt,     // string: system instructions
  userPrompt,       // string: the actual request
  maxTokens,        // integer: max response tokens (default 1000)
  jsonMode,         // boolean: whether to parse response as JSON (default false)
  metadata          // object: arbitrary metadata for logging
}) : Promise<{
  content: string,           // response text
  parsed: object | null,     // if jsonMode=true, parsed JSON (null if parse failed)
  provider: string,          // which provider was used
  model: string,             // which model was used
  input_tokens: number,      // approximate input tokens
  output_tokens: number,     // approximate output tokens
  estimated_cost_usd: number // estimated cost for this call
}>
```

### What the wrapper does internally

1. Reads `llm_config` for the given `engine` where `active = true`
2. Reads the API key from the named environment variable
3. Constructs the provider-specific API request format
4. Calls the provider API
5. Normalises the response to the common return format
6. Writes to `llm_call_log` with token counts and estimated cost
7. Updates `site_settings.api_cost_mtd_usd` with running month-to-date total
8. Returns the normalised response

If the API call fails, the wrapper logs to `generation_log` and `system_health_log`, then throws so the calling engine can handle the failure.

### Provider-specific API formats

**Gemini:**
```javascript
POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
Authorization: Bearer {GEMINI_API_KEY}
{
  "contents": [{"role": "user", "parts": [{"text": userPrompt}]}],
  "systemInstruction": {"parts": [{"text": systemPrompt}]},
  "generationConfig": {"maxOutputTokens": maxTokens}
}
```

**Anthropic:**
```javascript
POST https://api.anthropic.com/v1/messages
x-api-key: {ANTHROPIC_API_KEY}
anthropic-version: 2023-06-01
{
  "model": model_name,
  "max_tokens": maxTokens,
  "system": systemPrompt,
  "messages": [{"role": "user", "content": userPrompt}]
}
```

**OpenAI:**
```javascript
POST https://api.openai.com/v1/chat/completions
Authorization: Bearer {OPENAI_API_KEY}
{
  "model": model_name,
  "messages": [
    {"role": "system", "content": systemPrompt},
    {"role": "user", "content": userPrompt}
  ],
  "max_tokens": maxTokens
}
```

---

## Section 03 — Supported models and costs

Update `llm_config.cost_per_1k_tokens` when provider pricing changes. These figures are correct as of May 2026 but provider pricing changes frequently.

### Gemini (Google)

| Model | model_name string | Cost per 1k tokens | Notes |
|---|---|---|---|
| Gemini 2.5 Flash | `gemini-2.5-flash` | ~$0.00015 | Default. Fastest, cheapest. Best for scoring, intent classification, suggestions. |
| Gemini 2.5 Pro | `gemini-2.5-pro` | ~$0.0035 | Higher quality generation. Use for content generation if Flash pass rates are low. |

### Anthropic (Claude)

| Model | model_name string | Cost per 1k tokens | Notes |
|---|---|---|---|
| Claude Sonnet 4.6 | `claude-sonnet-4-6` | ~$0.003 | Strong specificity and verdict clarity. Good scoring model for independence check. |

### OpenAI

| Model | model_name string | Cost per 1k tokens | Notes |
|---|---|---|---|
| GPT-4o | `gpt-4o-2024-11-20` | ~$0.0025 | Solid alternative for generation. Useful for breaking any Gemini stylistic patterns. |

### Cost guidance

Running all 7 stack engines on Gemini 2.5 Flash for a 4-article/day schedule across 6 sites costs roughly $2–5/month in LLM API costs. Upgrading content generation to Gemini Pro increases that to roughly $15–30/month. Setting gateway scoring to Claude Sonnet adds approximately $3–8/month depending on article volume.

---

## Section 04 — Per-engine assignments

| Engine key | What uses it | Default model | Notes |
|---|---|---|---|
| `content` | Content Engine article generation | Gemini 2.5 Flash | Most important for quality. Upgrade to Pro if pass rates are consistently low. |
| `gateway` | Quality Gateway scoring calls | Gemini 2.5 Flash | Using a different provider than `content` provides partial independence from self-evaluation. |
| `intent` | Keyword intent classification | Gemini 2.5 Flash | Lightweight task. Flash is sufficient. |
| `suggestions` | Smart Suggestions daily call | Gemini 2.5 Flash | One call per day per site. Flash is sufficient. |
| `newsletter` | Newsletter subject line and summary generation | Gemini 2.5 Flash | Low stakes. Flash is sufficient. |
| `cro_design` | CRO Engine variant generation | Gemini 2.5 Flash | One call per test design per week. Flash works. Upgrade to Pro for better contextual match. |

### How switching models works

1. Open Smart Admin Dashboard → LLM Settings
2. Find the engine row you want to change
3. Select a new model from the dropdown
4. Click Save
5. The change is written to `llm_config` immediately
6. The next LLM call for that engine uses the new model
7. Change logged to `llm_switch_log`

No redeployment needed. No environment variable changes needed (as long as the API key for the new provider is already set).

### Independent scoring recommendation

Setting `gateway` to a different provider than `content` partially addresses the self-evaluation limitation described in the Quality Gateway spec. For example:
- `content` = Gemini 2.5 Flash
- `gateway` = Claude Sonnet

Two different LLMs evaluating each other will catch more genuine quality issues than one model evaluating itself. The tradeoff is slightly higher gateway API cost (~$3–8/month additional). Worth it once the site is generating meaningful revenue.

---

## Section 05 — Fallback handling

If the primary provider fails (API error, rate limit, key issue), the wrapper attempts a fallback in this order:

1. **Retry** the same provider once after a 5-second delay
2. **Fallback provider** — if `GEMINI_API_KEY` is set but Gemini fails, try Anthropic if `ANTHROPIC_API_KEY` is set, then OpenAI if `OPENAI_API_KEY` is set
3. **Fail** — log to `generation_log.error_message` and `system_health_log`, throw error to calling engine

The calling engine handles the thrown error per its own failure handling logic (targeted retry, kill and alert, etc.).

Fallback attempts are logged to `llm_call_log` with `is_fallback = true`. If fallbacks are happening frequently, the primary provider key likely has an issue — check the API key status panel in LLM Settings.

---

## Section 06 — Cost tracking

Every LLM call writes to `llm_call_log`:

| Field | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| engine | text | Which engine triggered the call |
| provider | text | Which provider was used |
| model_name | text | Which model was used |
| input_tokens | integer | Approximate input token count |
| output_tokens | integer | Approximate output token count |
| estimated_cost_usd | decimal | `(input_tokens + output_tokens) / 1000 × cost_per_1k_tokens` |
| is_fallback | boolean | True if this was a fallback attempt |
| site_id | text | |
| called_at | timestamp | |

`site_settings.api_cost_mtd_usd` is updated after every call with the running month-to-date total.

**Cost estimates are estimates.** Token counting is approximate. Provider pricing changes. Treat the cost tracker as an order-of-magnitude indicator, not an exact bill. Verify against your provider billing dashboard monthly.

---

## Section 07 — Admin panel — LLM settings

This section lives in the Smart Admin Dashboard as the second item in the sidebar (below Command Center, above Content Settings). It is always present regardless of which engines are installed.

### Per-engine model table

Shows one row per engine key in `llm_config`. Columns:

- **Engine** — human-readable label (Content Generation, Quality Scoring, etc.)
- **Current model** — provider and model name from `llm_config`
- **Est. cost / 1k calls** — calculated from `cost_per_1k_tokens` × average tokens per call for this engine
- **This month** — total estimated spend for this engine from `llm_call_log`
- **Switch** — dropdown to select new model. Save button writes to `llm_config`.
- **Test** — sends a 10-word test prompt and confirms response. Shows green/red.

### API key status panel

One row per provider. Shows:
- Green checkmark: key is set in environment variables AND responded to last test call
- Red X: key is missing or failed last test
- Grey dash: provider not configured (no key in env vars)

Clicking "Test all" runs a 10-word test prompt to each configured provider.

### Cost tracker

- **This month total** — sum of all `llm_call_log.estimated_cost_usd` entries this calendar month
- **Daily average** — this month total / days elapsed
- **Projected monthly total** — daily average × 30
- **Breakdown by engine** — bar chart showing which engine is costing the most
- **Breakdown by provider** — if multiple providers are in use
- **30-day trend** — daily cost chart for the past 30 days

### Model performance comparison

Populated after at least 30 articles have been generated per model. Shows:
- Gateway pass rate by model (articles generated by each model that passed the Quality Gateway)
- Average quality score by model
- Average targeted retry rate by model

This is the primary tool for deciding whether to upgrade a model. If Flash has a 65% pass rate and Pro has an 80% pass rate, the cost of Pro generation (roughly 20× more expensive) may be worth it once the site reaches sufficient traffic.

---

## Section 08 — Activation prompt

The LLM Abstraction Layer is activated as part of the Content Engine v2.1 activation prompt. It does not require a separate activation step. The Content Engine prompt creates the `llm_config` table, seeds the default rows, and builds the wrapper Edge Function.

If you are upgrading an existing project from an earlier spec version, use this standalone activation prompt:

```
Add LLM Abstraction Layer v1.0 to this Lovable project.

Before building anything, audit for: (1) llm_config table in Supabase,
(2) any existing direct Gemini API calls in Edge Functions,
(3) GEMINI_API_KEY environment variable,
(4) ANTHROPIC_API_KEY environment variable (may not be set),
(5) OPENAI_API_KEY environment variable (may not be set).

For each component found: extend or integrate as needed.
For each component missing: build from scratch.

1. CREATE llm_config TABLE
   If not exists: create with fields as specified in LLM Abstraction Layer spec.
   Seed with default rows for engines: content, gateway, intent, suggestions,
   newsletter, cro_design. All default to provider='gemini',
   model_name='gemini-2.5-flash', api_key_env_var='GEMINI_API_KEY',
   active=true, cost_per_1k_tokens=0.00015.

2. CREATE WRAPPER EDGE FUNCTION at /functions/llm-call
   Accept: engine, systemPrompt, userPrompt, maxTokens, jsonMode, metadata.
   - Read llm_config for engine where active=true.
   - Read API key from named env var.
   - Route to correct provider API format (Gemini / Anthropic / OpenAI).
   - Normalise response to common format.
   - Write to llm_call_log with token estimates and cost.
   - Update site_settings.api_cost_mtd_usd running total.
   - Return normalised response or throw on failure.
   Fallback order: retry same provider once → try Anthropic if key set →
   try OpenAI if key set → throw with logged error.

3. CREATE llm_call_log TABLE
   Fields: id (uuid), engine (text), provider (text), model_name (text),
   input_tokens (integer), output_tokens (integer), estimated_cost_usd (decimal),
   is_fallback (boolean), site_id (text), called_at (timestamp).

4. CREATE llm_switch_log TABLE
   Fields: id (uuid), engine (text), old_provider (text), old_model (text),
   new_provider (text), new_model (text), changed_by (text), changed_at (timestamp).

5. UPDATE ALL EXISTING LLM API CALLS
   Find all existing direct calls to Gemini API in the codebase.
   Replace each with a call to the /functions/llm-call wrapper.
   Pass the appropriate engine key for each call:
   - Content generation calls: engine='content'
   - Quality Gateway scoring calls: engine='gateway'
   - Keyword intent classification calls: engine='intent'
   - Smart Suggestions calls: engine='suggestions'
   - Newsletter generation calls: engine='newsletter'
   Log any calls that could not be automatically converted for manual review.

6. ADD api_cost_mtd_usd TO site_settings
   Add column if not present (decimal, default 0).
   Reset to 0 on the first day of each calendar month via a scheduled function.

7. ADD LLM SETTINGS SECTION TO /admin
   If Smart Admin Dashboard is installed (/admin exists), add the LLM Settings
   section as specified in LLM Abstraction Layer spec Section 07.
   Placement: second item in sidebar, below Command Center.

AFTER BUILDING: confirm all existing Gemini API calls have been wrapped.
List any calls that could not be automatically converted.
Confirm llm_call_log is receiving entries.
Confirm llm_config table has 6 seed rows.
```

---

## Section 09 — Troubleshooting

**LLM calls succeeding but not appearing in `llm_call_log`** — The wrapper Edge Function is likely writing to the wrong Supabase instance or using the wrong `SUPABASE_URL`. Check the Edge Function environment variables. The wrapper must use the same Supabase instance as all other engines.

**Cost tracker showing $0** — `site_settings.api_cost_mtd_usd` is only updated when calls go through the wrapper. If direct provider calls still exist in the codebase (not yet wrapped), they won't be tracked. Check the build report from the wrapper activation for any unconverted calls.

**Switching model not taking effect** — Check `llm_config` in Supabase to confirm the row was updated. The wrapper reads `llm_config` on every call — there is no cache. If the admin panel switch wrote to the database, the next call will use the new model. Check `llm_switch_log` for confirmation the change was recorded.

**Fallbacks firing frequently** — Check API key status in the LLM Settings panel. A key that is set but invalid (expired, wrong value) will cause every call to fail and attempt fallback. Verify the key directly in the provider's dashboard. Use the "Test" button per provider to confirm the key works.

**Token costs diverging from provider billing** — The wrapper uses approximate token counting (character count ÷ 4 as a proxy). For very long prompts (full articles + scoring rubric), this can undercount by 20–30%. The cost tracker is for order-of-magnitude budget management — not for reconciling against invoices. Check your provider billing dashboard monthly for exact figures.

---

## Database tables created by this spec

| Table | Purpose |
|---|---|
| `llm_config` | Per-engine model configuration. One active row per engine. |
| `llm_call_log` | Every LLM call with token counts and estimated cost. |
| `llm_switch_log` | History of model changes made via admin panel. |

### Extended tables

| Table | Columns added |
|---|---|
| `site_settings` | `api_cost_mtd_usd` (decimal) — running month-to-date LLM cost |
