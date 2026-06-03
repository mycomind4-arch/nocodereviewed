# NoCodeReviewed Intelligence Vault - n8n Automation Pack

This pack gives you a working first automation for the NoCodeReviewed flagship system: a free Vibe Auditor / Intelligence Vault backend that turns evidence into public evidence files, tool scores, quality-gated content pages, and monetizable recommendations.

## Files

- `n8n_nocodereviewed_intelligence_vault_pipeline.json` — importable n8n workflow.
- `supabase_intelligence_vault_schema.sql` — Supabase tables, public evidence view, and `ingest_evidence_bundle` RPC function.
- `test_payload.json` — sample webhook payload.
- `workflow_diagram.mmd` — Mermaid diagram of the pipeline.
- `CHATGPT_AGENT_BUILD_INSTRUCTIONS.md` — handoff instructions for ChatGPT Agent / Codex / Claude.

## What this workflow does

1. Receives evidence through an n8n webhook.
2. Normalizes the payload into a tool/evidence/review prompt.
3. Sends the prompt to Gemini.
4. Forces a structured JSON evidence bundle.
5. Runs a quality gate that blocks thin or hype-driven content.
6. Inserts the bundle into Supabase through one RPC call.
7. Creates or updates:
   - tool records
   - public evidence sources
   - public evidence items
   - review claims
   - scoring dimensions
   - quality-gate records
   - draft review/comparison/evidence pages
   - automation run logs

## Required environment variables in n8n

Set these where n8n runs. Do not expose the service role key in frontend code.

```bash
SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
GEMINI_MODEL="gemini-2.0-flash"
```

If your n8n is running in Docker, pass them as `-e` values or add them to your compose file. If n8n is installed locally, export them before launching n8n.

## Setup order

### 1. Run the Supabase schema

Open Supabase SQL Editor and run:

```sql
-- paste the full contents of supabase_intelligence_vault_schema.sql
```

Confirm these tables exist:

- `tools`
- `evidence_sources`
- `evidence_items`
- `claims`
- `tool_scores`
- `quality_gate_results`
- `content_pages`
- `automation_runs`

Also confirm the RPC exists:

```sql
select public.ingest_evidence_bundle('{"tool":{"slug":"test","name":"Test"}}'::jsonb);
```

### 2. Import the n8n workflow

In n8n:

1. Open Workflows.
2. Import from file.
3. Select `n8n_nocodereviewed_intelligence_vault_pipeline.json`.
4. Open the workflow.
5. Confirm the nodes show in this order:
   - Evidence Intake Webhook
   - Normalize Intake + Build Prompt
   - Gemini - Extract Evidence Bundle
   - Parse JSON + Quality Gate
   - Supabase RPC - Ingest Bundle
   - Respond to Webhook

### 3. Test the webhook

Use the n8n test webhook URL first. Then send:

```bash
curl -X POST "YOUR_N8N_TEST_OR_PRODUCTION_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  --data-binary @test_payload.json
```

A successful response should include something like:

```json
{
  "ok": true,
  "tool_slug": "lovable",
  "quality_score": 60,
  "quality_status": "needs_review"
}
```

The quality score may be low with the included placeholder payload. That is correct. The pipeline is designed to reject thin evidence.

## Expected webhook payload

Minimum useful payload:

```json
{
  "tool_name": "Tool Name",
  "tool_slug": "tool-name",
  "category": "AI app builder",
  "official_url": "https://example.com",
  "affiliate_url": "https://optional-affiliate-url.com",
  "source_type": "official_docs",
  "source_url": "https://example.com/docs",
  "source_title": "Official docs evidence",
  "publisher": "Example",
  "source_text": "Paste evidence file content, official docs excerpts, pricing notes, benchmark notes, or research notes here."
}
```

## How to connect this to the redesigned site

Your frontend should not call Supabase with the service role key. Use one of these patterns:

### Public evidence pages

Read from:

- `public_evidence_vault`
- `content_pages` where `page_type = 'public_evidence'`
- `tools`
- `tool_scores`

Suggested routes:

- `/vault` — searchable Intelligence Vault homepage.
- `/evidence/[toolSlug]` — public evidence file.
- `/tools/[toolSlug]` — review microsite.
- `/compare/[toolA]-vs-[toolB]` — comparison page.
- `/auditor` — free flagship Vibe Auditor.

### Vibe Auditor recommendations

The auditor should write private project analysis into `project_audits`, then read from:

- `tools`
- `tool_scores`
- `claims`
- `tool_pain_point_matches`
- `public_evidence_vault`

Recommendation logic should be:

1. Identify user pain points.
2. Match pain points to tool capabilities.
3. Require evidence-backed claims.
4. Show why the tool was recommended.
5. Show affiliate disclosure when monetized.

## Monetization architecture

The flagship auditor should remain free. Monetization should happen through surrounding business mechanics:

- Affiliate links on recommended tools.
- Sponsored placements only when clearly labeled and separated from evidence-backed recommendations.
- Paid implementation help: audit repair, launch readiness cleanup, automation setup, and project rescue.
- Lead generation for agencies or consultants.
- Premium downloadable reports for users who want a formatted board/client-ready version.
- API/license access to the evidence vault later.

Do not make recommendations feel rigged. The long-term asset is trust. The automation includes disclosure fields because public trust compounds better than hidden monetization.

## What to build next

After this MVP is working:

1. Add a scheduled crawler workflow that watches official docs, pricing pages, changelogs, and GitHub repos.
2. Add a comparison generator workflow that creates pairwise comparisons from evidence already in Supabase.
3. Add a tutorial generator workflow that creates project-path tutorials from tool capabilities.
4. Add an admin dashboard for approval, contradiction resolution, affiliate URL mapping, and publishing.
5. Add GitHub project intake for Vibe Auditor: repo URL -> code scan -> project risks -> recommended tools.
