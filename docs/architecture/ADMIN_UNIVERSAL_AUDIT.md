# ADMIN_UNIVERSAL_AUDIT.md

Phase A2 — Universal Admin Intelligence Audit Button

## Overview
Local-only operational infrastructure for comprehensive NoCodeReviewed site intelligence audits.

Primary entry: `#admin` route → "Run Full Site Intelligence Audit" button.

Everything runs in the local Node server + browser. No uploads, no external calls, no cloud, no Supabase/n8n/agents.

The audit produces a structured bundle and queues it for the Vault Ingestion Parser (honest "queued" status; never fakes parser execution success).

## Admin UI
- Premium dark/glass NoCodeReviewed styling (matches ncr-glass, ncr-btn etc).
- Primary button triggers POST /api/admin/run-universal-audit.
- Live status updates (inventory → classification → routes → evidence → reviews → microsites → assets → unsafe → parser handoff).
- Results panel: summary counts, critical issues, top recommended actions, result + inbox paths.
- Safety banner: "This audit runs locally. Nothing is uploaded."

Secondary buttons (future): Link Audit Only, Evidence Coverage, etc. Primary full audit is sufficient for A2.

## Server Endpoint
`POST /api/admin/run-universal-audit` (in server.mjs handleApi).

- Calls the audit script via dynamic ESM import (reuses CLI logic).
- Returns the summary + paths + parserStatus.
- Localhost-friendly (no auth in A2; intended for local dev/admin).

Errors return honest `{ok:false, error:..., parserStatus:'error'}`.

## Core Audit Script
`scripts/run-universal-site-audit.mjs`

Exported `runUniversalSiteAudit()` (also runnable via `npm run audit:site`).

Implements 13 modules (C1 classification model + spec):

1. Project Inventory — fs walk (excl .git/node_modules), classify into production_core / evidence_sources / microsite_sources / tool_assets / operational_infrastructure / review_prototypes / utility_tools / unsafe_quarantine / needs_human_review / ignored.
2. Source Safety Classification — A/B/C/D/E per file/group. D for all quarantined unsafe patterns.
3. Route Integrity Audit — checks expected #home, #reviews, #tools, #evidence, #methodology, #admin, #tool/*, #review/*, #*/tutorials etc. Reports missing + dynamic handling.
4. Link Integrity Audit — scans static-app.js + index.html for hrefs; flags suspicious (unsafe paths), counts evidence/api links.
5. Evidence Coverage Audit — reads manifest + readdir docs/evidence/; reports files, missing numbers, canonical count.
6. Review Completion Audit — for priority tools + manifest coverage; labels complete_review / evidence_backed_with_gaps / placeholder based on code markers + ev presence (R2_COMPLETE etc).
7. Microsite Funnel Audit — checks real files (lovable/bolt/replit) + code links; labels complete_funnel / pending_funnel.
8. Vibe Auditor Gate Audit — confirms page + links from reviews/templates; labels "criteria detected" (never claims "executed" unless it ran).
9. Asset Integrity Audit — stats public/images/* subdirs; flags 0-byte, counts used/missing.
10. Unsafe Exposure Audit — greps public app surfaces for adult/nsfw/xvideos/scraper patterns; critical if any hits.
11. Blog/Article Audit — presence of #blog handling + placeholder discipline.
12. Parser Handoff Readiness — always creates inbox bundle (universal-site-audit.json + manifest.json + README.md) under data/intelligence-vault/parser-inbox/site-audits/<id>/. Sets parserStatus: "queued". (Queue is the honest path for custom site-audit artifacts; direct ingest attempted only if safe/generic adapter matches — currently queue to avoid faking.)
13. Recommended Next Actions — prioritized list (critical fixes first) derived from findings.

## Output Format + Paths
- `data/intelligence-vault/audit-runs/<auditRunId>/universal-site-audit.json` (full result + vault_records)
- `.../manifest.json`
- Inbox copy: `data/intelligence-vault/parser-inbox/site-audits/<auditRunId>/` (for parser)
- Runtime dirs are gitignored (except .gitkeep).

Result includes:
- summary (filesScanned, criticalIssues, recommendedActions count...)
- sections (all 13)
- vault_records (audit_handoff, artifacts, commands — compatible with VAULT_DATA_CONTRACT style: id, record_type, created_at, privacy_level:"local_private", etc.)

## Parser Handoff
- Mode: "queued" (writes inbox + README with example ingest command).
- Never claims "parsed" unless the parser CLI was actually invoked and succeeded in this run (A2 uses pure queue for safety + because site-audit.json is not a standard chat export).
- README in inbox tells operator how to run the parser manually.

## CLI
`npm run audit:site` — runs the script directly, prints JSON summary.

## Safety & Constraints
- Strictly follows AGENTS.md, C1 classification, hard constraints (no parser mutation, no contract edits, no fake claims, quarantine adult/NSFW/scraper forever, no content rewrite from audit).
- Local only.
- Existing pages (#reviews, #tools, vibe-auditor.html, chat-intelligence-vault.html, etc.) remain untouched by the audit button.

## Running the Full Flow
1. npm run dev
2. Visit http://localhost:5173/#admin
3. Click the button
4. Watch status → results (critical issues, actions, paths)
5. (Optional) cd tools/internal/vault-ingestion-parser && npm run ingest ... on the inbox path for testing (future adapter can make this automatic).

## Next Phase Recommendations (from A2 audit itself)
- Add more secondary audit buttons.
- Real parser adapter for "site-audit" source type.
- Wire audit findings back into admin capture forms (read-only).
- Expand to full "recommended build prompts" generator.

See SOURCE_UTILIZATION_REPORT.md (A2 section) for integration notes.
