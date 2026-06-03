# Source Of Truth Map

This map defines what Phase 1 treats as canonical, reference-only, or future-candidate material. The current production app remains the base until a later approved migration.

## Main App Source

Canonical production source:

- `index.html`
- `server.mjs`
- `src/static-app.js`
- `src/styles.css`
- `public/images/**`
- `data/local-store.json`

Notes:

- The app is currently a static Node-served site.
- Do not replace it with the Bolt export or imported Vite/React frontend.
- New frontend architecture should be proposed separately after the Intelligence Vault foundation is stable.

## Auditor Source

Current production candidate:

- `tools/vibe-auditor.html`

Reference prototype:

- `docs/reference/prototypes/vibe-auditor/vibe-auditor-3-3.html`
- Source origin: `_INBOX_NEW_FILES/vibe-auditor(3)(3).html`

Rule:

- Do not overwrite `tools/vibe-auditor.html` wholesale.
- Merge only reviewed improvements after a diff-based plan.

## Chat Intelligence Vault Source

Reference prototype:

- `docs/reference/prototypes/chat-intelligence-vault/chat-intelligence-vault.html`
- Source origin: `_INBOX_NEW_FILES/chat-intelligence-vault.html`

Future role:

- Convert chat exports into structured Intelligence Vault material.
- Persist normalized outputs to Supabase only after schema reconciliation.

## Evidence Source

Canonical evidence source:

- `docs/evidence/**`

Generated inventory:

- `data/intelligence-vault/evidence-manifest.json`

Rules:

- Do not rewrite evidence claims during Phase 1.
- Missing evidence numbers are documented, not invented.
- Duplicate candidates are warnings until reviewed by a human.

## Supabase Schema Candidates

Candidates:

- `data/vibecode_authority_schema.sql`
- `_INBOX_NEW_FILES/nocodereviewed-complete-schema.sql`
- `docs/reference/schemas/supabase_intelligence_vault_schema.sql`
- `_INBOX_NEW_FILES/nocodereviewed-structured/sql/01_schema_patch.sql`
- `_INBOX_NEW_FILES/nocodereviewed-structured/sql/04_seed_data.sql`
- `_INBOX_NEW_FILES/project/supabase/migrations/20260602190611_create_audits_table.sql`

Rule:

- Do not apply any schema to a live Supabase project in Phase 1.
- Future schema must reconcile evidence, claims, scoring, content pages, project audits, automation runs, and access policies.

## n8n Workflow Source

Canonical reference workflow:

- `docs/reference/automation/n8n/n8n_nocodereviewed_intelligence_vault_pipeline.json`

Supporting files:

- `docs/reference/automation/n8n/README_SETUP.md`
- `docs/reference/automation/n8n/CHATGPT_AGENT_BUILD_INSTRUCTIONS.md`
- `docs/reference/automation/n8n/test_payload.json`
- `docs/reference/automation/n8n/workflow_diagram.mmd`

Rule:

- Do not import or activate n8n workflows until the Supabase schema, environment variables, and security model are reviewed.

## Bolt Frontend Reference

Source:

- `_INBOX_NEW_FILES/project-bolt-sb1-tvw9uhao.zip`
- `_INBOX_NEW_FILES/project/`

Reference notes:

- `docs/reference/prototypes/bolt-auditor/bolt-zip-inventory.md`

Canonical role:

- Frontend/design reference for the auditor experience only.
- Not source of truth for reviews, scores, evidence, pricing, or platform rankings.

## Kimi / Imported Frontend Reference

Source:

- `imports/kimi-agent-build-source/app/**`

Canonical role:

- Broader review-site UI reference.
- Useful for future React/Vite migration planning.
- Not production source today.

