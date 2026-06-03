# n8n / Supabase Contract

This contract documents the expected boundary between n8n automation and the future Supabase Intelligence Vault. It is not an active production integration yet.

## Expected n8n Webhook Inputs

Minimum evidence intake payload:

```json
{
  "tool_name": "Tool Name",
  "tool_slug": "tool-name",
  "category": "AI app builder",
  "official_url": "https://example.com",
  "affiliate_url": "https://optional.example.com",
  "source_type": "official_docs",
  "source_url": "https://example.com/docs",
  "source_title": "Official docs evidence",
  "publisher": "Example",
  "source_text": "Evidence text, benchmark notes, pricing notes, or research notes."
}
```

Optional future inputs:

- benchmark run metadata
- screenshot/artifact URLs
- citation metadata
- captured date
- reviewer notes
- contradiction flags
- target content type

## Expected Supabase Tables And Functions

Candidate tables from the Intelligence Vault schema:

- `tools`
- `evidence_sources`
- `evidence_items`
- `claims`
- `tool_scores`
- `pain_points`
- `tool_pain_point_matches`
- `project_audits`
- `quality_gate_results`
- `content_pages`
- `recommendation_events`
- `automation_runs`

Candidate view:

- `public_evidence_vault`

Candidate RPC:

- `ingest_evidence_bundle(bundle jsonb)`

These are candidates only. They must be reconciled against the other schema sources before use.

## Evidence Ingestion Flow

1. n8n receives evidence through a webhook or scheduled source.
2. n8n validates that required fields exist.
3. n8n builds an extraction prompt from the payload.
4. The model returns structured JSON.
5. n8n parses the JSON and runs a quality gate.
6. n8n calls Supabase RPC with the structured bundle.
7. Supabase stores source, evidence item, claim, score, content draft, and automation run records.
8. Records remain draft or needs-review until approved.

## Quality Gateway Flow

The quality gate should reject or flag:

- missing source URL
- unsupported superlatives
- thin evidence
- invented pricing
- invented scores
- fake testimonials
- uncited comparisons
- affiliate recommendations without disclosure
- content that cannot identify its evidence source

Allowed statuses should include:

- `needs_review`
- `needs_evidence`
- `verified_draft`
- `ready_for_publish`
- `published`
- `rejected`

## Review / Comparison / Tutorial Generation Flow

1. Select page type and target slug.
2. Query approved evidence and claims only.
3. Generate a structured draft.
4. Run quality gate.
5. Store draft in `content_pages`.
6. Require human review before public publication.
7. Publish only content with evidence-backed claims.

## Required Environment Variables

For n8n/server-side automation:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `N8N_WEBHOOK_URL`
- `GEMINI_API_KEY`
- `OPENAI_API_KEY` if OpenAI is used in a future workflow

For browser-safe frontend code only:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Never expose:

- `SUPABASE_SERVICE_ROLE_KEY`
- private API keys
- live webhook secrets

## Security Warnings

- Do not put service-role keys in frontend JavaScript.
- Do not apply prototype RLS policies without review.
- Do not use public INSERT/UPDATE policies for project audits without abuse controls.
- Do not ingest raw chat exports into public tables without redaction.
- Do not publish LLM output before evidence validation.
- Do not let affiliate URLs override evidence-backed recommendation logic.

