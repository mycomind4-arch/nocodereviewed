# ADMIN_DASHBOARD_DATA_PIPELINE.md

Parser-Backed Admin Site Intelligence Dashboard (A3)

## Separation of Concerns
- Public Vibe Auditor: tools/vibe-auditor.html — standalone public tool for visitors to audit their own projects. Never sends data to internal parser or admin flows. Must remain fully functional and independent.
- Internal Admin Site Intelligence: #admin — private/local workflow for auditing the NoCodeReviewed site/project itself.

## Flow (Admin)
1. Admin clicks "Run Full Site Intelligence Audit" in #admin.
2. Server calls scripts/run-universal-site-audit.mjs → produces raw audit JSON + manifest in data/intelligence-vault/audit-runs/<id>/ + copy to parser-inbox/site-audits/<id>/.
3. Server invokes Vault Ingestion Parser (via npm run ingest in parser dir, source=site-audit) on the inbox. The universal-site-audit adapter (added in parser) recognizes the bundle and turns sections into normalized VaultDocument / Artifact records.
4. Parser writes standard normalized/ + indexes/ under the vault output.
5. Server (post-parser) reads the raw audit (source of detailed sections), builds dashboard-state.json with panels (siteHealth, reviewCompletion, evidenceCoverage, vibeAuditorGate, etc.), writes categorized records (review-completion-records.json etc.), and latest.json pointer under data/intelligence-vault/parsed/admin-site-audits/<id>/.
6. Response to UI includes parserStatus ("parsed" | "queued" | "error") + dashboardState when available.
7. #admin UI renders summary + detailed panels from dashboardState.panels.* when parserStatus === 'parsed'. Otherwise shows queued/raw summary.

Raw audit is always preserved (never deleted after parsing).

## Parser Adapter
- Location: tools/internal/vault-ingestion-parser/src/parsers/universalSiteAudit.ts
- Registered first in parsers/index.ts so it takes precedence for universal-site-audit.json.
- canParse on basename match.
- Produces VaultDocument per section + Artifacts for critical/recommended items (ingested into vault normalized form).

## Dashboard State
See the buildAdminDashboardState helper in server.mjs for the exact mapping from raw.sections + summary to panels.

latest.json points to the most recent parsed dashboard-state.json.

## A4 Visual Sitemap
The parser/audit flow now also produces sitemap-graph.json (nodes + edges with health status) under the same parsed/admin-site-audits/<id>/ folder when the audit script emits sections.sitemapGraph.

#admin links to #sitemap.
GET /api/admin/latest-sitemap-graph serves the graph (parser > raw_audit > static_fallback with honest labeling).

The visual workspace at #sitemap is vanilla SVG + div nodes (draggable, clickable, filterable, search) with n8n-like canvas feel. No new dependencies.

## Safety
- Public Vibe Auditor is never called or modified from admin flow.
- Visitor audits in public Vibe Auditor do not enter parser-inbox or admin parsed.
- All local-only. No secrets in outputs.
- Unsafe files remain quarantined (enforced in audit script).

## Extension Points
- Add more panels by extending raw sections in the audit script + mapping in server build function + UI render in static-app.js.
- Future: more sophisticated post-processing inside parser for site-audit source.

See ADMIN_UNIVERSAL_AUDIT.md for the audit button and raw format details.
