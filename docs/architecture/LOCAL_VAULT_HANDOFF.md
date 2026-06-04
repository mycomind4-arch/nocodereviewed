# Local Vault Handoff

This document defines the local-only handoff structure between Chat Intelligence Vault, Vault Ingestion Parser, and `docs/architecture/VAULT_DATA_CONTRACT.md`.

Phase 5 creates deterministic local export/import structures. It does not add cloud sync, Supabase, n8n, agents, embeddings, vector search, public publishing, paid features, or automated AI orchestration.

## Purpose

The Local Vault Handoff gives browser-local vault output a stable shape that internal tools can read without inventing parallel schemas.

It supports:

- local export bundles from Chat Intelligence Vault
- local import bundles for Vault Ingestion Parser
- deterministic record IDs and folder paths
- raw source metadata preservation
- future Vibe Auditor handoff payloads
- future Strategic Memory Extractor inputs
- future Workflow Template Extractor inputs
- future Evidence System review candidates

## Export Bundle Structure

Canonical bundle name:

```text
vault-export.zip
```

Expected ZIP layout:

```text
vault-export/
  manifest.json
  conversations/
  messages/
  artifacts/
  projects/
  prompts/
  code-blocks/
  commands/
  audit-handoffs/
  raw/
  indexes/
```

Current browser ZIP entries may omit explicit empty folder records, but every non-empty category should write records into the matching path.

## Deterministic Naming

Record files use this pattern:

```text
{folder}/{record_id}.json
```

Record IDs should be deterministic for the same extracted vault state when practical:

```text
conv_{stable_hash}
msg_{stable_hash}
artifact_{stable_hash}
project_{stable_hash}
prompt_{stable_hash}
code_{stable_hash}
command_{stable_hash}
audit_handoff_{stable_hash}
```

Rules:

- Use stable local source fields plus array index when source exports do not include durable source IDs.
- Do not use random IDs for handoff records.
- `manifest.generated_at` may use the current timestamp.
- The ZIP filename should remain stable as `vault-export.zip`.

## Manifest

`manifest.json` is required.

Required fields:

- `schema_version`
- `export_version`
- `generated_at`
- `source_application`
- `record_counts`
- `included_record_types`
- `parser_compatibility_version`
- `privacy_notice`

Example:

```json
{
  "schema_version": "vault.v1",
  "export_version": "local-handoff.v1",
  "generated_at": "2026-06-03T10:00:00.000Z",
  "source_application": "Chat Intelligence Vault",
  "record_counts": {
    "conversations": 1,
    "messages": 2,
    "artifacts": 1,
    "projects": 1,
    "prompts": 1,
    "code_blocks": 1,
    "commands": 1,
    "audit_handoffs": 1
  },
  "included_record_types": [
    "VaultConversation",
    "VaultMessage",
    "VaultArtifact",
    "VaultProject",
    "VaultPrompt",
    "VaultCodeBlock",
    "VaultCommand",
    "VaultAuditHandoff"
  ],
  "parser_compatibility_version": "vault-ingestion-parser.local-json.v1",
  "privacy_notice": "Processed locally in browser. No data was uploaded by this export."
}
```

## Parser Compatibility Rules

The Vault Ingestion Parser currently supports:

- folders
- ZIPs
- JSON documents
- Markdown
- TXT
- HTML
- ChatGPT `conversations.json`

Phase 5 bundles are parser-compatible as local JSON document bundles. The generic document parser can preserve and parse JSON files today. A dedicated `local-vault-handoff` parser adapter (and agent-swarm-coder-handoff variant) in the Vault Ingestion Parser can read `manifest.json` + records (either per-folder .json in full bundles, or flat records.jsonl for agent-run-handoff.v1 exports from agent-swarm-coder), classify by record_type, and produce normalized records. The agent handoff uses the flat records.jsonl format inside coding-agent-runs/**/vault-handoff/ for per-run intelligence. Raw sources (agent run package or browser vault) are never mutated.

Rules:

- Keep every record as valid JSON.
- Keep `schema_version` and `record_type` on every record.
- Keep source lineage in `source_ref`.
- Keep raw local source metadata under `raw/`.
- Do not require network access.
- Do not require an API key.
- Do not require Supabase or n8n.

## Privacy Boundaries

Default privacy level:

```text
local_private
```

Allowed privacy levels come from `VAULT_DATA_CONTRACT.md`:

- `local_private`
- `review_required`
- `approved_internal`
- `approved_public`

Phase 5 export records should remain `local_private` unless an explicit review flow has set a stricter state. Chat-derived content, prompts, commands, code, and project notes are not public claims.

## Allowed File Types

Current bundle entries should use:

- `.json`
- `.md` only for optional future human-readable summaries
- `.txt` only for optional future raw notes

Current Phase 5 implementation writes JSON records and ZIP packaging only.

## Raw Preservation Rules

Raw originals and source metadata must not be overwritten by normalized records.

Phase 5 browser exports preserve:

- source application
- source platform
- source file/import names where known
- local vault snapshot under `raw/chat-intelligence-vault-source.json`
- source pointers on each normalized record

Do not store secrets, API keys, tokens, or private credentials in `source_ref`.

## Evidence-Candidate Boundaries

Phase 5 does not publish claims. Chat-derived observations are not public evidence.

Evidence candidates may be added in a later phase only when:

- source lineage is clear
- review status is explicit
- privacy level is not accidentally public
- the Evidence System owns the review decision

Current local handoff bundles may contain artifacts with evidence-like language, but those records are not `approved_public`.

## Future Extensibility Rules

- Add new canonical record types in `VAULT_DATA_CONTRACT.md` before emitting them.
- Extend parser support through modular adapters.
- Keep browser export generation deterministic and local.
- Keep folder names stable.
- Add new folders only when they map to a contract record type or documented supporting file type.
- Keep `manifest.export_version` stable unless the bundle format changes.

## Intentionally Not Implemented Yet

- Dedicated Vault Ingestion Parser adapter for `local-vault-handoff` bundles.
- Vibe Auditor import UI.
- Supabase writes.
- n8n workflow execution.
- Cloud sync.
- Auth.
- Embeddings.
- Vector search.
- Autonomous agents.
- Public evidence approval workflow.
- Public claim generation.
- Paid feature logic.

## Phase 5 Boundary

Phase 5 creates local deterministic handoff exports and documentation. It does not change the public review system, does not score tools, and does not create a live integration with the Vibe Auditor.

