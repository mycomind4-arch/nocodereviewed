# SOURCE INVENTORY REPORT

Project: NoCodeReviewed / No Code Empire revised  
Workspace: `/Users/macdizzle/Desktop/no code empire revised`  
Inspection date: 2026-06-02  
Mode: inspection only

This report inventories the current production project plus `_INBOX_NEW_FILES` source material. It does not integrate, delete, move, overwrite, or validate claims from inbox files.

## 1. Current Project Architecture Map

The current root project is a static Node-served application, not a Next.js or Vite production app.

```text
.
├── index.html                         # Production entry HTML
├── server.mjs                         # Local Node server and lightweight API/static routing
├── package.json                       # Root scripts: dev, build, preview
├── package-lock.json
├── src/
│   ├── static-app.js                  # Main production app logic
│   ├── styles.css                     # Main production styling
│   └── components/                    # Imported/prototype React/JSX components, not root app runtime
├── public/
│   └── images/                        # Runtime images used by the static app
├── tools/
│   ├── vibe-auditor.html              # Current production candidate for flagship auditor
│   ├── pipeline-dashboard.html        # Tool/dashboard prototype
│   └── vibe-auditor.backup-*          # Historical auditor backups
├── docs/
│   ├── evidence/                      # Canonical curated evidence markdown files
│   ├── benchmarks/                    # Benchmark rubric, prompts, implementation notes
│   ├── content/lovable/               # Lovable evidence/claim planning
│   ├── plans/                         # Architecture/operating-model plans
│   ├── prompts/                       # Prompt packs and image prompts
│   ├── reference/                     # Imported prototypes/reference code
│   └── reports/                       # Existing generated reports
├── data/
│   ├── local-store.json               # Local app data
│   ├── lovable-evidence.json          # Lovable evidence data
│   └── vibecode_authority_schema.sql  # Current root Supabase/evidence schema draft
├── imports/
│   └── kimi-agent-build-source/app/   # Full Vite/React reference frontend
├── scripts/
│   └── verify-static-app.mjs          # Root build/verification script
└── _INBOX_NEW_FILES/                  # Source material only; not production
```

## 2. Important Source File Inventory

### Root App

| File | Role | Status |
| --- | --- | --- |
| `index.html` | Root HTML shell loading production static app assets. | Production |
| `server.mjs` | Local development/preview server. | Production |
| `src/static-app.js` | Main static app implementation. | Production |
| `src/styles.css` | Main app stylesheet. | Production |
| `public/images/**` | Runtime visual assets. | Production assets |
| `scripts/verify-static-app.mjs` | Static verification/build script. | Production tooling |
| `package.json` | Root app scripts and package metadata. | Production tooling |

### Data And Evidence

| File/Folder | Role | Status |
| --- | --- | --- |
| `data/local-store.json` | Local app content/data source. | Production/local data |
| `data/lovable-evidence.json` | Lovable-specific structured evidence. | Production/local data |
| `data/vibecode_authority_schema.sql` | Root schema draft for evidence/editorial pipeline. | Canonical root draft |
| `docs/evidence/**` | Curated markdown evidence files. | Canonical evidence |
| `docs/benchmarks/**` | Benchmark rubric/prompts/planning docs. | Canonical methodology drafts |

### Tools

| File | Role | Status |
| --- | --- | --- |
| `tools/vibe-auditor.html` | Current free auditor/recommendation engine. | Production candidate |
| `tools/nocodereviewed-vibe-auditor.html` | Older auditor build. | Archive/reference |
| `tools/pipeline-dashboard.html` | Dashboard prototype. | Prototype/reference |
| `tools/vibe-auditor.backup-*` | Point-in-time auditor backups. | Archive only |

### Imported Frontend Reference

| File/Folder | Role | Status |
| --- | --- | --- |
| `imports/kimi-agent-build-source/app/package.json` | Vite/React app package. | Reference frontend |
| `imports/kimi-agent-build-source/app/src/pages/**` | React pages for Home, Tools, ToolDetail, Compare, Blog, Admin, etc. | Reference |
| `imports/kimi-agent-build-source/app/src/components/**` | UI, layout, sections, shared cards. | Reference |
| `imports/kimi-agent-build-source/app/src/data/mockData.ts` | Mock frontend data. | Reference only; do not treat as evidence |

### Inbox Source Material

| File/Folder | Role | Status |
| --- | --- | --- |
| `_INBOX_NEW_FILES/vibe-auditor(3)(3).html` | Newest/fullest auditor prototype found. | Merge candidate |
| `_INBOX_NEW_FILES/chat-intelligence-vault.html` | Browser-local chat/export intelligence analyzer. | Prototype canonical for Chat Intelligence Vault |
| `_INBOX_NEW_FILES/ncr_n8n_intelligence_vault_automation.zip` | Intelligence Vault schema + n8n workflow package. | Canonical automation candidate |
| `_INBOX_NEW_FILES/nocodereviewed-complete-schema.sql` | Broad Supabase schema. | Schema reference |
| `_INBOX_NEW_FILES/nocodereviewed-structured/**` | Structured Next/Supabase/API prototype. | Reference only |
| `_INBOX_NEW_FILES/Evidence files/**` | Duplicate evidence source set. | Archive/reference |
| `_INBOX_NEW_FILES/no code empire revised(1).zip` | Older full root export. | Archive/reference |
| `_INBOX_NEW_FILES/nocode*`, `no_code*`, PDFs, DOCX, prompts | Planning/spec/reference files. | Reference only |

## 3. Files That Appear To Be Production Files

Production should mean files used by the current root static application or its local server/build path.

- `index.html`
- `server.mjs`
- `package.json`
- `package-lock.json`
- `src/static-app.js`
- `src/styles.css`
- `public/images/**`
- `data/local-store.json`
- `data/lovable-evidence.json`
- `data/vibecode_authority_schema.sql`
- `docs/evidence/**`
- `docs/benchmarks/**`
- `tools/vibe-auditor.html`
- `scripts/verify-static-app.mjs`

`src/components/**` is not production runtime unless it is explicitly imported by `src/static-app.js` or another loaded bundle. Current project architecture indicates these are imported React prototype/microsite components rather than active root app runtime.

## 4. Files That Are Prototypes Only

These should not be copied into production without review:

- `_INBOX_NEW_FILES/**`
- `tools/vibe-auditor.backup-*`
- `tools/nocodereviewed-vibe-auditor.html`
- `tools/pipeline-dashboard.html`
- `docs/reference/**`
- `src/components/**`
- `imports/kimi-agent-build-source/app/**`
- `backups/**`
- `assets/styles.css` unless explicitly wired into production
- `_INBOX_NEW_FILES/app/**`
- `_INBOX_NEW_FILES/app 2/**`
- `_INBOX_NEW_FILES/nocodereviewed-structured/**`

Reason: these are not part of the current static app execution path, contain older experiments, depend on missing backend/runtime assumptions, or use mock/reference data.

## 5. Newest / Most Complete Vibe Auditor Version

Auditor files inspected:

| File | Lines | Assessment |
| --- | ---: | --- |
| `tools/vibe-auditor.html` | 5,039 | Current production candidate. Local-first auditor with JSZip parsing, local fallback generation, revenue/productization/trust/methodology/recommendation/self-test layers. |
| `_INBOX_NEW_FILES/vibe-auditor(3)(3).html` | 5,199 | Newest and most complete prototype found. Best merge candidate. |
| `_INBOX_NEW_FILES/vibe-auditor-rebuilt.html` | 340 | Newer timestamp but far smaller; simplified rebuild/reference only. |
| `_INBOX_NEW_FILES/vibe_auditor_supreme.html` | 2,348 | Older prototype. Appears less complete than current production and latest prototype. |
| `tools/nocodereviewed-vibe-auditor.html` | Not re-counted in this pass | Older production/reference auditor. |

Recommendation:

Use `tools/vibe-auditor.html` as the current production base. Compare and selectively merge improvements from `_INBOX_NEW_FILES/vibe-auditor(3)(3).html` into a reviewed production version. Do not wholesale replace the production file.

## 6. Chat Intelligence Vault Presence And Functionality

Present:

- `_INBOX_NEW_FILES/chat-intelligence-vault.html`
- Size/shape: 104 lines, compact/minified single-file browser prototype.

Observed functionality:

- Browser-local analysis of ChatGPT/Grok-style JSON or ZIP exports.
- Uses JSZip and highlight.js from CDN.
- Extracts or organizes project/code/prompt/story/command/monetization/topic patterns.
- Provides tabbed UI.
- Supports localStorage save/load.
- Supports export as Markdown, JSON, and ZIP.

Recommendation:

Treat `_INBOX_NEW_FILES/chat-intelligence-vault.html` as the prototype canonical source for the Chat Intelligence Vault UX and extraction logic. Future production version should persist normalized outputs into Supabase Intelligence Vault tables, not localStorage only.

## 7. n8n Workflow JSON Presence

Present:

- `_INBOX_NEW_FILES/nocodereviewed-structured/n8n/n8n_nocodereviewed_pipeline.json`
- `_INBOX_NEW_FILES/ncr_n8n_intelligence_vault_automation.zip`

The Intelligence Vault ZIP contains:

```text
ncr_n8n_intelligence_vault_automation/supabase_intelligence_vault_schema.sql
ncr_n8n_intelligence_vault_automation/n8n_nocodereviewed_intelligence_vault_pipeline.json
ncr_n8n_intelligence_vault_automation/test_payload.json
ncr_n8n_intelligence_vault_automation/workflow_diagram.mmd
ncr_n8n_intelligence_vault_automation/README_SETUP.md
ncr_n8n_intelligence_vault_automation/CHATGPT_AGENT_BUILD_INSTRUCTIONS.md
```

Recommended canonical n8n source:

Use the workflow inside `_INBOX_NEW_FILES/ncr_n8n_intelligence_vault_automation.zip` because it aligns with the target architecture: Supabase Intelligence Vault as source of truth, with reviews/comparisons/tutorials/microsites generated as outputs.

`_INBOX_NEW_FILES/n8n-unpacked` was not present.

## 8. Supabase Intelligence Vault Schema Presence

Present:

- `data/vibecode_authority_schema.sql`
- `_INBOX_NEW_FILES/nocodereviewed-complete-schema.sql`
- `_INBOX_NEW_FILES/nocodereviewed-structured/sql/01_schema_patch.sql`
- `_INBOX_NEW_FILES/nocodereviewed-structured/sql/04_seed_data.sql`
- `_INBOX_NEW_FILES/ncr_n8n_intelligence_vault_automation.zip` containing `supabase_intelligence_vault_schema.sql`

Assessment:

- `data/vibecode_authority_schema.sql` is the root project schema draft and should be preserved as current local canonical reference.
- `_INBOX_NEW_FILES/nocodereviewed-complete-schema.sql` is broader and includes tables for tools, snapshots, benchmarks, articles, keyword queues, LLM config/logs, affiliate links, generation logs, quality scoring, system health, review evidence, and claim registry.
- The schema inside `ncr_n8n_intelligence_vault_automation.zip` appears most aligned with the future Intelligence Vault concept.
- `_INBOX_NEW_FILES/nocodereviewed-structured/supabase/.temp/**` exists and should not be merged or exposed. It may contain project metadata.

Recommended schema direction:

Create a reconciled Phase 1 schema from:

1. Intelligence Vault schema inside `_INBOX_NEW_FILES/ncr_n8n_intelligence_vault_automation.zip`
2. Durable table coverage from `_INBOX_NEW_FILES/nocodereviewed-complete-schema.sql`
3. Existing claim/evidence/benchmark structure from `data/vibecode_authority_schema.sql`

Do not apply any schema blindly. Supabase is the future source of truth, but schema reconciliation is required first.

## 9. Evidence File Inventory And Missing Evidence Numbers

Canonical evidence folder:

```text
docs/evidence/
├── 01_replit_complete_evidence_file.md
├── 02_base_44_complete_evidence_file.md
├── 03_bolt_new_complete_evidence_file.md
├── 04_lovable_complete_evidence_file.md
├── 05_cursor_complete_evidence_file.md
├── 06_windsurf_complete_evidence_file.md
├── 07_claude_code_complete_evidence_file.md
├── 08_openai_codex_complete_evidence_file.md
├── 09_v_0_complete_evidence_file.md
├── 12_lovable_evidence_file.md
├── 13_claude_code_evidence_file.md
├── 14_openai_codex_evidence_file.md
├── 15_supabase_ai_assistant_evidence_file.md
├── 16_bubble_ai_evidence_file.md
├── 17_flutterflow_ai_evidence_file.md
├── 18_webflow_ai_evidence_file.md
├── 19_framer_ai_evidence_file.md
├── 20_glide_ai_evidence_file.md
├── 21_softr_ai_evidence_file.md
├── 22_adalo_evidence_file.md
├── 23_retool_ai_evidence_file.md
├── 24_thunkable_evidence_file.md
├── 25_appsmith_evidence_file.md
├── 26_weweb_evidence_file.md
├── 27_builder_io_fusion_evidence_file.md
└── README.md
```

Missing numbered evidence files in `docs/evidence`:

- `10`
- `11`
- `28` if the final target remains 28 reviewed tools

Additional inbox evidence:

- `_INBOX_NEW_FILES/Evidence files/**` duplicates the curated evidence set.
- `_INBOX_NEW_FILES/01_replit_complete_evidence_file.md` duplicates Replit evidence.
- `_INBOX_NEW_FILES/10-tempo-evidence-file.pdf` is present, but no canonical `docs/evidence/10_*.md` file is present.

Do not generate or infer missing evidence. Create missing evidence only from real testing or vetted source material.

## 10. Duplicate / Older Files To Archive, Not Integrate

Archive/reference only:

- `_INBOX_NEW_FILES/Evidence files/**` because `docs/evidence/**` is canonical.
- `_INBOX_NEW_FILES/01_replit_complete_evidence_file.md` duplicate of curated Replit evidence.
- `_INBOX_NEW_FILES/vibe_auditor_supreme.html` older auditor.
- `_INBOX_NEW_FILES/vibe-auditor-rebuilt.html` simplified auditor prototype.
- `tools/vibe-auditor.backup-*` historical backups.
- `_INBOX_NEW_FILES/no code empire revised(1).zip` older root project export.
- `_INBOX_NEW_FILES/fixed-routes.zip` and `_INBOX_NEW_FILES/fixed-slug-routes.zip` route-patch references only.
- `_INBOX_NEW_FILES/app/**` and `_INBOX_NEW_FILES/app 2/**` partial API route prototypes.
- `_INBOX_NEW_FILES/nocodereviewed-structured/supabase/.temp/**` never integrate.
- Mac metadata files: `.DS_Store`, `__MACOSX/**` inside ZIPs.

## Bolt Frontend Export Review

Present:

- `_INBOX_NEW_FILES/project-bolt-sb1-tvw9uhao.zip`
- Extracted reference folder also exists at `_INBOX_NEW_FILES/project/`
- Modified: `Jun 2 21:58:26 2026`
- ZIP root folder: `project/`
- Archive size: 50 files, 775,388 bytes listed by `unzip -l`

Project type:

- Vite + React 18 + TypeScript.
- Static frontend app with a Vite build output in `dist/`.
- Not Next.js.
- Not a full static HTML-only app.
- Uses Supabase client integration for save/share state.

Route/page/component structure:

```text
project/
├── package.json
├── package-lock.json
├── vite.config.ts
├── tailwind.config.js
├── eslint.config.js
├── index.html
├── dist/
│   ├── index.html
│   └── assets/index-*.css, index-*.js
├── .bolt/
│   ├── prompt
│   └── config.json
├── .env
├── src/
│   ├── App.tsx
│   ├── audit.ts
│   ├── types.ts
│   ├── supabase.ts
│   ├── main.tsx
│   ├── index.css
│   └── components/
│       ├── Landing.tsx
│       ├── Sidebar.tsx
│       ├── Topbar.tsx
│       ├── AnalyzingOverlay.tsx
│       ├── AuditHistory.tsx
│       ├── SaveShareModal.tsx
│       └── tabs/
│           ├── Overview.tsx
│           ├── Risks.tsx
│           ├── Missing.tsx
│           ├── Architecture.tsx
│           ├── Economics.tsx
│           ├── AskAuditor.tsx
│           ├── CodexBrief.tsx
│           ├── DelegateToAI.tsx
│           ├── FixRoadmap.tsx
│           └── FileTree.tsx
└── supabase/
    └── migrations/20260602190611_create_audits_table.sql
```

The app does not define route files or a conventional multi-page router. `src/App.tsx` owns the primary app state and switches between landing, analyzing, and audit dashboard states. The dashboard is organized as tabs, not URL routes.

Package profile:

- Framework: Vite + React 18 + TypeScript.
- Dependencies: `@supabase/supabase-js`, `jszip`, `lucide-react`, React/React DOM.
- Scripts: `dev`, `build`, `lint`, `preview`, `typecheck`.

Design strengths:

- Strong flagship-auditor product framing with a focused ZIP upload flow.
- Clear dashboard structure: sidebar, topbar, metrics, risk tabs, file tree, roadmap, and share modal.
- Good use of compact data cards, score rings, status colors, and tabbed workflow.
- Useful empty-to-active transition: landing page -> analyzing overlay -> dashboard.
- Strong local-first trust copy on the upload flow.
- Good inspiration for a premium audit/report surface without requiring payment logic.

Data model assumptions:

- `ProjectData` is derived from static ZIP inspection: file counts, source files, language/framework guess, test/CI/docker signals, entries, and file context.
- `AuditResult` is generated locally from heuristic rules in `src/audit.ts`.
- Scores include survivability, revenue readiness, launch readiness, health metrics, risk exposure, completion, and maintenance index.
- Saved audits assume a Supabase `audits` table with JSONB snapshots for `project_data` and `audit_result`, plus `share_id` and `fixed_items`.
- The audit is project-specific and heuristic. It is not an evidence-backed tool review, platform benchmark, or public NoCodeReviewed score.

Useful component assessment:

| Area | Useful? | Notes |
| --- | --- | --- |
| Homepage | Partial | `Landing.tsx` has a strong auditor hero/upload flow, but not a full NoCodeReviewed homepage. |
| Audit flow | Yes | `Landing`, `AnalyzingOverlay`, `Sidebar`, `Topbar`, `Overview`, `Risks`, `Missing`, `Architecture`, `Economics`, `FixRoadmap`, `FileTree`, `CodexBrief`, `DelegateToAI`, `AskAuditor`, and `SaveShareModal` are relevant. |
| Evidence Vault | No direct fit | No evidence-source browsing, claim registry, citations, contradiction handling, or public vault UI. |
| Tool reviews | No direct fit | It does not provide review pages for Lovable/Bolt/Replit/etc. |
| Comparison pages | No direct fit | No comparison matrix, pairwise routes, or evidence-backed comparison model. |
| Onboarding wizard | Partial | ZIP upload and local audit onboarding patterns are reusable. |
| Admin dashboard | No | No approval workflow, editorial queue, evidence QA, schema admin, or automation controls. |

Files/components worth reusing:

- `project/src/components/Landing.tsx`
- `project/src/components/AnalyzingOverlay.tsx`
- `project/src/components/Sidebar.tsx`
- `project/src/components/Topbar.tsx`
- `project/src/components/SaveShareModal.tsx`
- `project/src/components/tabs/Overview.tsx`
- `project/src/components/tabs/Risks.tsx`
- `project/src/components/tabs/Missing.tsx`
- `project/src/components/tabs/Architecture.tsx`
- `project/src/components/tabs/Economics.tsx`
- `project/src/components/tabs/FixRoadmap.tsx`
- `project/src/components/tabs/FileTree.tsx`
- `project/src/components/tabs/CodexBrief.tsx`
- `project/src/components/tabs/DelegateToAI.tsx`
- `project/src/components/tabs/AskAuditor.tsx`
- `project/src/audit.ts` as heuristic reference only
- `project/src/types.ts` as a useful local-audit model reference
- `project/src/index.css` as design-token/style reference only

Files that should remain reference-only:

- `project/.env`
- `project/dist/**`
- `project/package-lock.json`
- `project/supabase/migrations/20260602190611_create_audits_table.sql`
- `project/src/supabase.ts`
- `project/.bolt/**`
- `project/src/audit.ts` until its scoring assumptions are rewritten and documented
- Any hardcoded product copy that implies proven quality, revenue outcomes, or authoritative scoring without methodology

Hardcoded/fake-content assessment:

- No fake public tool reviews, fake testimonials, or fake platform comparison pages were found in the inspected Bolt source.
- The app contains hardcoded product copy and local heuristic score labels such as survivability, revenue readiness, launch readiness, risks, and money leaks.
- Those scores are calculated from static project signals, not from NoCodeReviewed evidence files or benchmark runs.
- The included n8n test payload and Bolt audit heuristics are prototype inputs/logic only.
- Do not reuse Bolt-generated scores as public reviews, platform ratings, testimonials, or evidence-backed claims.

Supabase integration:

- Present.
- `project/src/supabase.ts` uses `@supabase/supabase-js` and expects `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- `project/supabase/migrations/20260602190611_create_audits_table.sql` creates an `audits` table for saved audits.
- The migration enables broad public SELECT/INSERT/UPDATE policies. This is not production-safe as-is.

Clean merge assessment:

- The Bolt export can be merged cleanly only as selected components and design patterns.
- It should not replace the current NoCodeReviewed app.
- It does not match the current static app architecture directly because it is a Vite/React TypeScript app and the production base is a static Node-served app.
- It is strongest as the future React auditor surface or as a design reference for a later frontend migration.

Recommended merge strategy:

- Copy selected components only after adapting them to the current architecture or a deliberate future React/Vite app.
- Copy visual patterns and design tokens selectively, not the whole stylesheet.
- Copy route/layout ideas for the auditor dashboard only.
- Ignore backend assumptions until the Supabase schema is reconciled.
- Archive the ZIP and extracted folder as prototypes/reference.
- Do not copy `.env`, `dist/**`, or the Supabase migration into production.
- Keep current `tools/vibe-auditor.html` as the production auditor until a reviewed replacement path is approved.

Risks of using the Bolt build as-is:

- It would replace the current app architecture with a separate Vite app.
- The Supabase table/policy model is too permissive for production.
- The audit scoring methodology is heuristic and undocumented in the NoCodeReviewed evidence system.
- The dashboard can imply authority before the evidence vault and claim validation are connected.
- The `.env` file in the export creates secret-handling risk.
- Built `dist/**` assets are generated artifacts and should not become canonical source.
- It does not cover review pages, evidence vault browsing, comparison pages, tutorials, or admin workflows.

Observed functionality:

- ZIP upload and static project parsing via JSZip.
- Local audit scoring in `src/audit.ts`.
- Tabs for overview, risks, missing infrastructure, architecture, economics, ask auditor, Codex brief, delegate-to-AI tasks, fix roadmap, and file tree.
- Supabase save/share support through `src/supabase.ts`.
- Built `dist/` assets included in the archive.

Security and merge notes:

- The archive contains `project/.env`. Its values were not printed in this report. `src/supabase.ts` expects `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- The Supabase migration creates an `audits` table and enables broad public SELECT/INSERT/UPDATE policies. This is useful for a prototype but should not be applied as-is to production.
- The Bolt export is not a full review-site frontend. It is a strong auditor/recommendation-engine frontend candidate.
- Do not extract this ZIP over the current root app. Extract to a temporary review directory or a dedicated import path only.

## 12. Recommended Canonical Source Of Truth

| Domain | Canonical source | Reason |
| --- | --- | --- |
| Main app | Current root static app: `index.html`, `server.mjs`, `src/static-app.js`, `src/styles.css` | This is the active app architecture. |
| Auditor | Production base: `tools/vibe-auditor.html`; merge candidate: `_INBOX_NEW_FILES/vibe-auditor(3)(3).html` | Avoid overwriting production while using latest prototype improvements. |
| Chat Intelligence Vault | `_INBOX_NEW_FILES/chat-intelligence-vault.html` | Only observed dedicated Chat Intelligence Vault prototype. |
| Evidence files | `docs/evidence/**` | Current curated evidence corpus. |
| Supabase schema | Reconciled schema derived from Intelligence Vault ZIP + `nocodereviewed-complete-schema.sql` + root schema | No single schema is sufficient alone. |
| n8n workflow | `_INBOX_NEW_FILES/ncr_n8n_intelligence_vault_automation.zip` workflow | Best aligned with Intelligence Vault automation direction. |
| Bolt frontend design | `_INBOX_NEW_FILES/project-bolt-sb1-tvw9uhao.zip` for auditor UI; `imports/kimi-agent-build-source/app/` for broader review-site UI. | Bolt export is a focused auditor app, while Kimi import is a broader review-site shell. |

## 13. Safe Merge Plan

1. Freeze production app files until Phase 1 starts.
2. Create a separate merge staging folder or branch for extracted canonical inbox assets.
3. Do not copy `_INBOX_NEW_FILES` into production wholesale.
4. Extract the Intelligence Vault ZIP into a controlled reference folder if needed, then review schema/workflow diffs.
5. Build a normalized Supabase schema migration from vetted schema sources.
6. Convert `docs/evidence/**` into structured seed/import data without altering evidence text.
7. Create a production Chat Intelligence Vault page/component from the single-file prototype.
8. Selectively merge auditor improvements from `_INBOX_NEW_FILES/vibe-auditor(3)(3).html` into `tools/vibe-auditor.html`.
9. Connect future content generation to Intelligence Vault outputs, not static invented claims.
10. Add verification scripts before connecting automation.

## 14. Exact Files To Create Or Modify In Phase 1

Do not implement yet. Recommended Phase 1 file plan:

### Create

- `docs/architecture/intelligence-vault-merge-plan.md`
- `docs/architecture/source-of-truth-map.md`
- `docs/architecture/evidence-ingestion-contract.md`
- `docs/architecture/n8n-supabase-contract.md`
- `data/intelligence-vault/schema.sql`
- `data/intelligence-vault/seed-evidence-manifest.json`
- `data/intelligence-vault/evidence-import-map.json`
- `scripts/inventory-evidence.mjs`
- `scripts/validate-evidence-manifest.mjs`
- `scripts/validate-intelligence-schema.mjs`
- `tools/chat-intelligence-vault.html` or an equivalent production route/page if the static app architecture is extended

### Modify

- `package.json` to add validation scripts.
- `server.mjs` only if serving new tool routes is required.
- `src/static-app.js` only if linking/embedding the new Intelligence Vault/auditor surface.
- `src/styles.css` only for route/tool integration styles.
- `tools/vibe-auditor.html` only after a reviewed diff against `_INBOX_NEW_FILES/vibe-auditor(3)(3).html`.
- `docs/evidence/README.md` to document numbering gaps and evidence ingestion rules.

### Do Not Modify In Phase 1 Without Separate Approval

- Existing evidence claims or scores.
- Pricing, review verdicts, testimonials, affiliate claims, or benchmark results.
- Supabase live project config.
- `_INBOX_NEW_FILES/nocodereviewed-structured/supabase/.temp/**`.

## 15. Exact Commands Needed To Install, Run, Build, Lint, And Test

### Root Static App

Install:

```bash
npm install
```

Run local dev server:

```bash
npm run dev
```

Build/verify:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

Lint:

```bash
# No root lint script exists yet.
```

Test:

```bash
# No root test script exists yet.
```

### Imported Vite/React Frontend Reference

Install:

```bash
cd imports/kimi-agent-build-source/app
npm install
```

Run:

```bash
cd imports/kimi-agent-build-source/app
npm run dev
```

Build:

```bash
cd imports/kimi-agent-build-source/app
npm run build
```

Lint:

```bash
cd imports/kimi-agent-build-source/app
npm run lint
```

Preview:

```bash
cd imports/kimi-agent-build-source/app
npm run preview
```

### Bolt Auditor Frontend Export

Inspect ZIP contents:

```bash
unzip -l _INBOX_NEW_FILES/project-bolt-sb1-tvw9uhao.zip
```

Extract to temporary review location only:

```bash
unzip _INBOX_NEW_FILES/project-bolt-sb1-tvw9uhao.zip -d /private/tmp/project-bolt-sb1-tvw9uhao-review
```

Install:

```bash
cd /private/tmp/project-bolt-sb1-tvw9uhao-review/project
npm install
```

Run:

```bash
cd /private/tmp/project-bolt-sb1-tvw9uhao-review/project
npm run dev
```

Build:

```bash
cd /private/tmp/project-bolt-sb1-tvw9uhao-review/project
npm run build
```

Lint:

```bash
cd /private/tmp/project-bolt-sb1-tvw9uhao-review/project
npm run lint
```

Typecheck:

```bash
cd /private/tmp/project-bolt-sb1-tvw9uhao-review/project
npm run typecheck
```

Preview:

```bash
cd /private/tmp/project-bolt-sb1-tvw9uhao-review/project
npm run preview
```

### n8n Workflow

Inspect ZIP contents:

```bash
unzip -l _INBOX_NEW_FILES/ncr_n8n_intelligence_vault_automation.zip
```

Extract to temporary review location only:

```bash
unzip _INBOX_NEW_FILES/ncr_n8n_intelligence_vault_automation.zip -d /private/tmp/ncr_n8n_review
```

Import into n8n only after environment variables and Supabase endpoints are reviewed.

### Supabase Schema

Do not apply live schema yet.

Suggested local review commands after Supabase CLI is configured:

```bash
supabase db lint
supabase db diff
supabase migration new intelligence_vault_phase_1
```

Do not run `supabase db push` until schema reconciliation is complete and secrets/project refs are reviewed.

## 16. Risks, Blockers, And Missing Assets

### Risks

- Multiple schema drafts overlap but are not identical.
- Inbox contains production-like API/routes that may not match current static app architecture.
- Some prototype auditors may contain old browser-side external AI call patterns; these must be removed before production use.
- Evidence files exist, but missing numbered evidence prevents complete 28-tool coverage.
- The imported Vite frontend uses mock data and should not be treated as evidence-backed production content.
- The Bolt auditor export contains an `.env`; do not print, commit, or migrate those values.
- The Bolt auditor Supabase migration uses broad public policies and needs tightening before production.
- n8n workflows may reference endpoints/tables that do not yet exist in the active root app.

### Blockers

- No unified Supabase schema has been selected.
- No evidence ingestion manifest exists yet.
- No formal claim-to-evidence validation script exists yet.
- No root lint/test pipeline exists yet.

### Missing Assets

- Canonical evidence file `10`.
- Canonical evidence file `11`.
- Canonical evidence file `28` if the product scope remains 28 platforms.
- Production-ready Chat Intelligence Vault route/page.
- Production n8n environment configuration.
- Supabase migration files for Intelligence Vault Phase 1.

## Recommended Phase 1 Implementation Plan

Phase 1 should establish the data foundation before expanding UI.

1. Create canonical Intelligence Vault architecture docs and source-of-truth map.
2. Create an evidence manifest from `docs/evidence/**`.
3. Add validation scripts for evidence numbering, required metadata, and missing citations.
4. Reconcile the Supabase schema into `data/intelligence-vault/schema.sql`.
5. Extract the n8n Intelligence Vault ZIP into a temporary review directory and map workflow dependencies.
6. Convert `chat-intelligence-vault.html` into a production-safe tool page, still local-first until Supabase is ready.
7. Create an auditor diff plan comparing `tools/vibe-auditor.html` with `_INBOX_NEW_FILES/vibe-auditor(3)(3).html`.
8. Add package scripts for inventory/validation.
9. Run `npm run build` after each production file change.
10. Defer content generation until evidence ingestion and claim validation exist.

Phase 1 should not invent reviews, scores, testimonials, pricing, or claims. The goal is to make the evidence and automation substrate reliable enough that future review pages, comparisons, tutorials, and microsites can be generated from the Intelligence Vault.
