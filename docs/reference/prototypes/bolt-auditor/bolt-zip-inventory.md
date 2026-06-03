# Bolt Auditor ZIP Inventory

Source:

- `_INBOX_NEW_FILES/project-bolt-sb1-tvw9uhao.zip`
- Extracted reference folder: `_INBOX_NEW_FILES/project/`

This file is inventory only. The Bolt project has not been merged into production.

## Project Type

- Vite
- React 18
- TypeScript
- Tailwind CSS
- Supabase client
- JSZip-based ZIP parsing

## Important Files

```text
project/package.json
project/vite.config.ts
project/tailwind.config.js
project/index.html
project/src/App.tsx
project/src/audit.ts
project/src/types.ts
project/src/supabase.ts
project/src/index.css
project/src/components/Landing.tsx
project/src/components/AnalyzingOverlay.tsx
project/src/components/AuditHistory.tsx
project/src/components/SaveShareModal.tsx
project/src/components/Sidebar.tsx
project/src/components/Topbar.tsx
project/src/components/tabs/Overview.tsx
project/src/components/tabs/Risks.tsx
project/src/components/tabs/Missing.tsx
project/src/components/tabs/Architecture.tsx
project/src/components/tabs/Economics.tsx
project/src/components/tabs/AskAuditor.tsx
project/src/components/tabs/CodexBrief.tsx
project/src/components/tabs/DelegateToAI.tsx
project/src/components/tabs/FixRoadmap.tsx
project/src/components/tabs/FileTree.tsx
project/supabase/migrations/20260602190611_create_audits_table.sql
```

## Do Not Copy

- `project/.env`
- `project/dist/**`
- `project/package-lock.json` unless the full Bolt app is intentionally imported later
- `project/supabase/migrations/20260602190611_create_audits_table.sql` without security review

## Reuse Candidates

- Auditor upload and landing pattern.
- Audit dashboard layout.
- Sidebar/topbar shell.
- Risk and missing-item tabs.
- Fix roadmap and delegate-to-AI task framing.
- Save/share modal concept after schema and RLS redesign.
- Local audit type model as a reference for future project audits.

## Reference-Only Notes

- The Bolt scores are local heuristic project-audit scores, not NoCodeReviewed platform review scores.
- Supabase save/share assumptions are prototype-grade.
- The app is useful for the flagship auditor, not for full review, comparison, evidence vault, tutorial, or admin coverage.

