# Schema Candidates

This file inventories available schema sources for the future Supabase Intelligence Vault. No schema has been merged or applied.

## Candidate 1: Root VibeCode Authority Schema

Path:

- `data/vibecode_authority_schema.sql`

Observed role:

- Current root schema draft.
- Covers tools, pricing or feature snapshots, benchmark prompts/runs/artifacts, review evidence, claim registry, article briefs/drafts, quality scores, and refresh events.

Strength:

- Closest to the current repository state.
- Already aligned with evidence and editorial concepts.

Risk:

- Not clearly complete for Chat Intelligence Vault, project audits, recommendation events, or n8n automation runs.

## Candidate 2: Complete NoCodeReviewed Schema

Path:

- `_INBOX_NEW_FILES/nocodereviewed-complete-schema.sql`

Observed role:

- Broad Supabase schema candidate.
- Includes tools, snapshots, benchmarks, articles, keyword queue, LLM config/logs, affiliate links, generation logs, voice baseline, gateway scores, system health, review evidence, and claim registry.

Strength:

- Broadest operational coverage.

Risk:

- May be overbuilt for Phase 1.
- Needs reconciliation with the current root schema and Intelligence Vault schema.

## Candidate 3: Intelligence Vault Schema

Path:

- `docs/reference/schemas/supabase_intelligence_vault_schema.sql`
- Source origin: `_INBOX_NEW_FILES/ncr_n8n_intelligence_vault_automation.zip`

Observed role:

- Best aligned with the desired future Intelligence Vault.
- Defines tools, evidence sources, evidence items, claims, tool scores, pain points, project audits, quality gate results, content pages, recommendation events, automation runs, a public evidence view, and an ingestion RPC.

Strength:

- Strong match for n8n-driven evidence ingestion and output generation.

Risk:

- Needs security and RLS review.
- Needs comparison with existing root schema before adoption.

## Candidate 4: Structured App SQL

Paths:

- `_INBOX_NEW_FILES/nocodereviewed-structured/sql/01_schema_patch.sql`
- `_INBOX_NEW_FILES/nocodereviewed-structured/sql/04_seed_data.sql`

Observed role:

- Patch and seed data for a structured prototype app.

Strength:

- May contain useful operational table assumptions.

Risk:

- Prototype context is not the current production app.
- Seed data must be reviewed to avoid fake or unsupported claims.

## Candidate 5: Bolt Auditor Audit Table

Path:

- `_INBOX_NEW_FILES/project/supabase/migrations/20260602190611_create_audits_table.sql`

Observed role:

- Stores saved project audits with project_data, audit_result, share_id, and fixed_items.

Strength:

- Useful for future auditor save/share functionality.

Risk:

- RLS policies are broad and should not be applied as-is.
- Project audit data must remain separate from public review evidence.

## Future Reconciled Schema Recommendation

Create a new migration that combines:

- Evidence and claim rigor from `data/vibecode_authority_schema.sql`.
- Operational coverage from `_INBOX_NEW_FILES/nocodereviewed-complete-schema.sql`.
- Intelligence Vault ingestion/output structure from `docs/reference/schemas/supabase_intelligence_vault_schema.sql`.
- A tightened project audit table inspired by the Bolt auditor migration.

Do not apply any candidate schema directly to a live Supabase project.

