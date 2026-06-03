# Chat Intelligence Vault Integration

Phase 2 integrates the Chat Intelligence Vault prototype as a safe, local-first tool page in the current NoCodeReviewed production app.

## What Was Integrated

Created:

- `tools/chat-intelligence-vault.html`

Modified:

- `src/static-app.js`
- `src/styles.css`

The main site now includes a homepage card:

- Title: Chat Intelligence Vault
- CTA: Open Vault
- Link: `tools/chat-intelligence-vault.html`

## Prototype Logic Used

Source prototype:

- `docs/reference/prototypes/chat-intelligence-vault/chat-intelligence-vault.html`

Logic carried forward:

- ChatGPT JSON export parsing.
- Grok JSON export parsing.
- ZIP import containing JSON exports.
- Conversation/message normalization.
- Project detection.
- Code block extraction.
- Prompt extraction.
- Terminal command extraction.
- Story/IP segment extraction.
- Monetization opportunity scoring.
- Search across recovered assets.
- Local browser save/load.
- Markdown export.
- JSON export.
- Recovered code ZIP export.

Production safety changes:

- Removed CDN dependencies.
- Wrapped logic in an IIFE to avoid global function conflicts.
- Replaced inline `onclick` handlers with scoped event listeners.
- Added malformed JSON and ZIP error handling.
- Added empty states for each panel.
- Added explicit privacy/local-first notice.
- Added no-op "Send to Vibe Auditor" placeholder with honest Phase 3 message.

## What Remains Local-Only

Phase 2 does not write to:

- Supabase.
- n8n.
- Server APIs.
- NoCodeReviewed backend storage.

The tool uses:

- Browser file input.
- Local parsing.
- Browser `localStorage`.
- Local downloads.

No cloud feature is connected yet.

## Phase 5 Local Vault Handoff

Phase 5 adds a local-only Vault handoff export to `tools/chat-intelligence-vault.html`.

New local export:

- `vault-export.zip`

The bundle follows:

- `docs/architecture/LOCAL_VAULT_HANDOFF.md`
- `docs/architecture/VAULT_DATA_CONTRACT.md`

Bundle layout:

- `manifest.json`
- `conversations/*.json`
- `messages/*.json`
- `artifacts/*.json`
- `projects/*.json`
- `prompts/*.json`
- `code-blocks/*.json`
- `commands/*.json`
- `audit-handoffs/*.json`
- `raw/chat-intelligence-vault-source.json`
- `indexes/records.json`
- `indexes/tags.json`

The export is generated entirely in the browser. It does not call remote APIs, write to Supabase, trigger n8n, create embeddings, or perform Vibe Auditor scoring.

## Parser Ingestion Mapping

Current parser compatibility:

1. Chat Intelligence Vault exports `vault-export.zip`.
2. Vault Ingestion Parser can ingest the ZIP as local JSON documents through its generic document parser.
3. The parser preserves the ZIP/raw input and can index the JSON content as documents.

Future parser adapter direction:

- Add a dedicated `local-vault-handoff` adapter under `tools/internal/vault-ingestion-parser/src/parsers/`.
- Detect `manifest.json` with `export_version: "local-handoff.v1"`.
- Promote record files into first-class normalized parser outputs instead of generic documents.
- Preserve raw bundle contents before normalization.
- Keep parsing deterministic and local.

The Chat Intelligence Vault remains the browser-local producer. The parser remains the reusable internal ingestion layer.

## Future Supabase Table Mapping

Future Intelligence Vault mapping should be reviewed against the reconciled schema before implementation.

Candidate mappings:

- `project_audits`: recovered project summaries, local audit handoff context, and future Vibe Auditor inputs.
- `evidence_sources`: imported chat export metadata if the user explicitly consents to cloud storage.
- `evidence_items`: extracted durable facts or source-backed statements after review.
- `claims`: only human-reviewed claims that are safe for public use.
- `content_pages`: generated project briefs, tutorials, or internal drafts after quality gate review.
- `recommendation_events`: future tool recommendation traces from Vibe Auditor.
- `automation_runs`: future n8n processing runs.

Do not map private chat exports directly into public evidence tables without redaction, consent, and review.

## Phase 3 Vibe Auditor Connection

The Phase 2 button says:

> Coming next: connect recovered project intelligence to the Vibe Auditor.

Recommended Phase 3 flow:

1. Let the user export a local project-intelligence JSON bundle.
2. Add an import surface to the Vibe Auditor.
3. Feed project names, code snippets, command history, and prompt context into the auditor.
4. Keep all transfer local by default.
5. Show any assumptions made by the auditor.
6. Do not convert extracted chat material into public claims.

## Known Limitations

- ZIP import supports stored files and browser-native deflated ZIP decompression. Very old browsers may not support deflated ZIP extraction.
- Project detection is heuristic.
- Monetization scoring is heuristic and not a NoCodeReviewed review score.
- Story/IP extraction can over-detect long narrative-like planning text.
- File reconstruction depends on fenced code blocks and guessed file names.
- Local storage can be cleared by the browser.
- No Supabase sync, sharing, team workflow, or n8n automation is connected in Phase 2.
