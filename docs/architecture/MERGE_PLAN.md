# Merge Plan

Phase 1 creates a clean foundation without rewriting the app. The original NoCodeReviewed project remains the production base.

## Keep From The Original NoCodeReviewed Project

Production base:

- `index.html`
- `server.mjs`
- `src/static-app.js`
- `src/styles.css`
- `public/images/**`
- `tools/vibe-auditor.html`
- `docs/evidence/**`
- `data/local-store.json`
- `data/vibecode_authority_schema.sql`
- `scripts/verify-static-app.mjs`

Reason:

- These are the current runtime and evidence assets.
- They already build with the root package scripts.

## Keep From The Vibe Auditor

Production base:

- `tools/vibe-auditor.html`

Reference improvements:

- `docs/reference/prototypes/vibe-auditor/vibe-auditor-3-3.html`

Keep:

- Local ZIP/project audit flow.
- Local-first privacy posture.
- Recommendation and report concepts.
- Methodology/trust UI ideas.

Do not do yet:

- Replace the production auditor wholesale.
- Add paid features.
- Invent recommendation claims not supported by evidence.

## Keep From Chat Intelligence Vault

Reference:

- `docs/reference/prototypes/chat-intelligence-vault/chat-intelligence-vault.html`

Keep:

- Chat/export ingestion concept.
- Local parsing/export patterns.
- Project, prompt, code, monetization, and topic extraction ideas.

Future production role:

- Intake layer for structured Intelligence Vault evidence and project memory.

## Keep From The n8n/Supabase Automation Pack

Reference files:

- `docs/reference/automation/n8n/n8n_nocodereviewed_intelligence_vault_pipeline.json`
- `docs/reference/automation/n8n/README_SETUP.md`
- `docs/reference/automation/n8n/CHATGPT_AGENT_BUILD_INSTRUCTIONS.md`
- `docs/reference/automation/n8n/test_payload.json`
- `docs/reference/automation/n8n/workflow_diagram.mmd`
- `docs/reference/schemas/supabase_intelligence_vault_schema.sql`

Keep:

- Evidence intake webhook concept.
- Quality-gated evidence bundle flow.
- Supabase RPC ingestion pattern.
- Public evidence view concept.
- Automation run logging.

Do not do yet:

- Apply schema live.
- Activate workflow.
- Store service-role keys in frontend code.

## Keep From The Bolt Frontend

Reference:

- `_INBOX_NEW_FILES/project-bolt-sb1-tvw9uhao.zip`
- `_INBOX_NEW_FILES/project/`
- `docs/reference/prototypes/bolt-auditor/bolt-zip-inventory.md`

Keep:

- Auditor landing/upload flow.
- Dashboard composition.
- Score-card and tabbed-audit interaction patterns.
- Save/share modal concept.
- Fix roadmap and delegate-to-AI task framing.

Do not keep as production:

- `.env`
- `dist/**`
- broad Supabase migration policies
- heuristic scores as public evidence
- full app replacement

## What Should Become Production Code

Phase 1 production-safe additions:

- Architecture documentation.
- Evidence manifest.
- Evidence inventory/validation scripts.
- `.env.example` placeholders.
- Reference copies under `docs/reference`.

Future production candidates after approval:

- Evidence manifest importer.
- Reconciled Supabase Intelligence Vault schema.
- Production Chat Intelligence Vault route/tool.
- Reviewed auditor improvements.
- n8n webhook integration after security review.

## What Should Stay In Docs / Reference / Prototypes

- Copied inbox prototypes under `docs/reference/prototypes/**`.
- n8n workflow and setup docs under `docs/reference/automation/n8n/**`.
- Extracted schema under `docs/reference/schemas/**`.
- Bolt inventory notes under `docs/reference/prototypes/bolt-auditor/**`.
- Kimi/import frontend under `imports/kimi-agent-build-source/app/**`.

## What Should Be Archived

Archive/reference only:

- `_INBOX_NEW_FILES/Evidence files/**` duplicates.
- Old auditor prototypes and backups.
- `_INBOX_NEW_FILES/app/**` and `_INBOX_NEW_FILES/app 2/**`.
- `_INBOX_NEW_FILES/no code empire revised(1).zip`.
- Route-fix ZIPs after their contents are reviewed.
- Generated build artifacts like Bolt `dist/**`.
- Mac metadata files and `__MACOSX/**`.

## Merge Order

1. Finish Phase 1 foundation docs and validation.
2. Review evidence manifest warnings.
3. Reconcile schema candidates.
4. Design the production Intelligence Vault contract.
5. Diff auditor prototypes against current production auditor.
6. Decide whether future frontend migration uses static app extension or React/Vite.
7. Only then begin production implementation.

