# Vault Data Contract

This document defines the local-first operational grammar for the NoCodeReviewed Intelligence Vault. It is shared by the Chat Intelligence Vault, Vault Ingestion Parser, future Evidence System, future Vibe Auditor handoff, future Strategic Memory Extractor, and future Workflow Template Extractor.

This is a schema and documentation contract only. It does not implement Supabase, n8n, cloud sync, embeddings, vector search, autonomous agents, public publishing, or paid features.

## Contract Goals

- Preserve raw originals and store normalized records separately.
- Make local exports, conversations, documents, code, prompts, commands, ideas, evidence candidates, and audit handoffs interoperable.
- Give internal tools one shared schema vocabulary instead of parallel one-off formats.
- Keep deterministic parsing and explicit review gates ahead of any AI enrichment.
- Prepare future persistence without requiring cloud storage today.

## Producers And Consumers

Current producers:

- Chat Intelligence Vault: browser-local extraction from ChatGPT/Grok exports and ZIPs.
- Vault Ingestion Parser: internal TypeScript CLI that preserves raw inputs, normalizes records, detects artifacts, and builds indexes.

Future consumers:

- Evidence System
- Vibe Auditor
- Strategic Memory Extractor
- Workflow Template Extractor
- Decision Log Builder
- Supabase ingestion layer after explicit approval
- n8n workflows after explicit approval

## Non-Goals

- No Supabase implementation.
- No n8n implementation.
- No cloud sync.
- No embeddings.
- No vector search.
- No autonomous agents.
- No public claim publishing.
- No paid feature implementation.
- No fake reviews, fake scores, fake evidence, fake citations, fake testimonials, or invented pricing.

## Shared Conventions

Every record should use these conventions unless a field is explicitly marked as optional for the record type.

| Field | Type | Requirement | Purpose |
| --- | --- | --- | --- |
| `id` | string | required | Stable local record ID, prefixed by type when practical. |
| `schema_version` | string | required | Contract version for migrations, initially `vault.v1`. |
| `record_type` | string | required | One of the canonical record type names below. |
| `source_platform` | string | required | Origin label such as `chatgpt`, `grok`, `vault-parser`, `manual`, `file`, or `unknown`. |
| `source_account` | string | optional | User/account label when known. Avoid secrets. |
| `source_ref` | object | required | Pointer to original source without rewriting it. |
| `created_at` | string | required | ISO timestamp for source creation when known, otherwise import time. |
| `updated_at` | string | optional | ISO timestamp for source update or local record update. |
| `tags` | string[] | required | Deterministic tags, user tags, or reviewed taxonomy tags. |
| `confidence` | number | optional | 0 to 1 confidence for extracted or inferred records. Omit for direct raw records when not useful. |
| `privacy_level` | string | required | Privacy state from the levels below. |

### Source Reference

`source_ref` keeps lineage without requiring cloud storage.

```json
{
  "raw_path": "local/path/or/archive/name",
  "conversation_id": "optional-source-conversation-id",
  "message_id": "optional-source-message-id",
  "document_id": "optional-source-document-id",
  "line_start": 12,
  "line_end": 24,
  "excerpt_hash": "sha256-or-local-hash-when-available"
}
```

Rules:

- Do not store API keys, tokens, private URLs, or secrets in `source_ref`.
- Prefer pointers and hashes over duplicating sensitive raw content.
- If raw content is included in a normalized record, keep `privacy_level` as `local_private` or `review_required` until reviewed.

## Privacy Levels

| Level | Meaning |
| --- | --- |
| `local_private` | Default for user uploads, raw exports, recovered code, commands, prompts, and business ideas. Not publishable. |
| `review_required` | Candidate may be useful internally but needs human review before use in claims, tooling, or publishing. |
| `approved_internal` | Approved for internal workflows, audits, methodology, or private recommendations. Not public by default. |
| `approved_public` | Approved for public-facing content after evidence, privacy, and claim review. |

Default: `local_private`.

## Evidence Review Statuses

| Status | Meaning |
| --- | --- |
| `needs_review` | Candidate exists but has not been validated. |
| `approved_internal` | Validated for internal evidence workflows only. |
| `approved_public` | Validated for public use with appropriate citation and methodology. |
| `rejected` | Reviewed and blocked from use. |
| `superseded` | Replaced by a newer or better-supported record. |

Default for evidence candidates: `needs_review`.

## Record Type Index

| Record Type | Role |
| --- | --- |
| `VaultConversation` | Normalized AI conversation or imported chat thread. |
| `VaultMessage` | Message inside a normalized conversation. |
| `VaultArtifact` | General extracted operational artifact. |
| `VaultProject` | Recovered project, product, repo, app, site, or build idea. |
| `VaultPrompt` | Reusable prompt or instruction set. |
| `VaultCodeBlock` | Recovered code snippet with language and context. |
| `VaultCommand` | Terminal command, script command, or workflow command. |
| `VaultMonetizationIdea` | Business model, offer, affiliate, product, or monetization concept. |
| `VaultEvidenceCandidate` | Candidate evidence item requiring review before public use. |
| `VaultAuditHandoff` | Local handoff payload from Vault intelligence to Vibe Auditor. |

## VaultConversation

Purpose: Represents a normalized imported conversation from ChatGPT, Grok, or another AI system.

Required fields:

- `id`
- `schema_version`
- `record_type`
- `source_platform`
- `source_ref`
- `created_at`
- `tags`
- `privacy_level`
- `title`
- `messages`

Optional fields:

- `source_account`
- `updated_at`
- `confidence`
- `source_conversation_id`
- `summary`
- `detected_projects`
- `artifact_ids`

Example:

```json
{
  "id": "conv_local_001",
  "schema_version": "vault.v1",
  "record_type": "VaultConversation",
  "source_platform": "chatgpt",
  "source_account": "personal-export",
  "source_ref": {
    "raw_path": "exports/chatgpt/conversations.json",
    "conversation_id": "source-conv-123"
  },
  "created_at": "2026-06-03T09:00:00.000Z",
  "updated_at": "2026-06-03T09:30:00.000Z",
  "tags": ["chatgpt", "project-planning"],
  "privacy_level": "local_private",
  "title": "Intelligence Vault Planning",
  "source_conversation_id": "source-conv-123",
  "messages": ["msg_local_001", "msg_local_002"],
  "artifact_ids": ["artifact_local_001"]
}
```

Chat Intelligence Vault mapping:

- Conversation export threads become `VaultConversation`.
- Browser-extracted project, code, prompt, command, story/IP, and monetization records should link back through `artifact_ids` or `source_ref`.

Vault Ingestion Parser mapping:

- Current parser `VaultConversation` output maps directly.
- Existing parser fields `source`, `source_account`, `source_conversation_id`, `title`, `created_at`, `updated_at`, `imported_at`, `tags`, `raw_path`, and `messages` should be adapted to this contract.

Future Evidence System mapping:

- Conversations are source context only. They are not public evidence until specific claims are extracted as `VaultEvidenceCandidate` and reviewed.

Future Vibe Auditor mapping:

- Conversations can supply project context to `VaultAuditHandoff`, but raw conversation text should remain local unless explicitly reviewed.

## VaultMessage

Purpose: Represents one message inside a normalized AI conversation.

Required fields:

- `id`
- `schema_version`
- `record_type`
- `source_platform`
- `source_ref`
- `created_at`
- `tags`
- `privacy_level`
- `conversation_id`
- `role`
- `content`

Optional fields:

- `source_account`
- `updated_at`
- `confidence`
- `artifact_ids`
- `references`
- `token_count`

Example:

```json
{
  "id": "msg_local_001",
  "schema_version": "vault.v1",
  "record_type": "VaultMessage",
  "source_platform": "chatgpt",
  "source_ref": {
    "raw_path": "exports/chatgpt/conversations.json",
    "conversation_id": "source-conv-123",
    "message_id": "source-msg-456"
  },
  "created_at": "2026-06-03T09:05:00.000Z",
  "tags": ["chatgpt"],
  "privacy_level": "local_private",
  "conversation_id": "conv_local_001",
  "role": "user",
  "content": "Build a local-first parser for my AI exports.",
  "artifact_ids": ["artifact_local_001"],
  "references": []
}
```

Chat Intelligence Vault mapping:

- Each parsed message becomes a `VaultMessage` when message-level storage is needed.
- Extracted assets should point to the message through `source_ref.message_id`.

Vault Ingestion Parser mapping:

- Current parser message records map directly, with `role`, `content`, `timestamp`, `artifacts`, and `references`.

Future Evidence System mapping:

- Message content can support internal review, but public evidence must become a reviewed `VaultEvidenceCandidate`.

Future Vibe Auditor mapping:

- Messages may explain project intent, constraints, and requirements for an audit handoff.

## VaultArtifact

Purpose: General extracted operational artifact when a more specific record type is not yet required.

Required fields:

- `id`
- `schema_version`
- `record_type`
- `source_platform`
- `source_ref`
- `created_at`
- `tags`
- `privacy_level`
- `artifact_type`
- `content`

Optional fields:

- `source_account`
- `updated_at`
- `confidence`
- `title`
- `language`
- `related_record_ids`

Example:

```json
{
  "id": "artifact_local_001",
  "schema_version": "vault.v1",
  "record_type": "VaultArtifact",
  "source_platform": "chatgpt",
  "source_ref": {
    "raw_path": "exports/chatgpt/conversations.json",
    "conversation_id": "source-conv-123",
    "message_id": "source-msg-456"
  },
  "created_at": "2026-06-03T09:06:00.000Z",
  "tags": ["detected", "workflow"],
  "confidence": 0.62,
  "privacy_level": "review_required",
  "artifact_type": "workflow",
  "title": "Detected workflow",
  "content": "Phase 1: inventory. Phase 2: local vault. Phase 3: parser."
}
```

Chat Intelligence Vault mapping:

- Existing extracted buckets can emit `VaultArtifact` first, then specialize into prompts, code blocks, commands, projects, monetization ideas, or evidence candidates.

Vault Ingestion Parser mapping:

- Current parser artifact output maps directly through `type`, `content`, `language`, `tags`, `confidence`, and lineage fields.

Future Evidence System mapping:

- Artifacts tagged as evidence should be converted into `VaultEvidenceCandidate` before use.

Future Vibe Auditor mapping:

- Artifacts can be attached to `VaultAuditHandoff` as supporting context, not as public claims.

## VaultProject

Purpose: Represents a recovered project, product idea, app, website, repo, or operational build target.

Required fields:

- `id`
- `schema_version`
- `record_type`
- `source_platform`
- `source_ref`
- `created_at`
- `tags`
- `privacy_level`
- `name`
- `description`

Optional fields:

- `source_account`
- `updated_at`
- `confidence`
- `status`
- `problem`
- `audience`
- `features`
- `stack`
- `repo_refs`
- `related_artifact_ids`
- `audit_handoff_id`

Example:

```json
{
  "id": "project_local_001",
  "schema_version": "vault.v1",
  "record_type": "VaultProject",
  "source_platform": "chatgpt",
  "source_ref": {
    "raw_path": "exports/chatgpt/conversations.json",
    "conversation_id": "source-conv-123"
  },
  "created_at": "2026-06-03T09:10:00.000Z",
  "tags": ["recovered-project", "nocodereviewed"],
  "confidence": 0.76,
  "privacy_level": "local_private",
  "name": "NoCodeReviewed Intelligence Platform",
  "description": "Evidence-first authority platform for no-code and vibe-coding tools.",
  "status": "active",
  "features": ["reviews", "auditor", "intelligence vault"],
  "related_artifact_ids": ["artifact_local_001"]
}
```

Chat Intelligence Vault mapping:

- Extracted projects become `VaultProject`.
- Existing project cards should keep local data compatible with this schema even before parser wiring.

Vault Ingestion Parser mapping:

- Parser may initially emit project-like records as `VaultArtifact` with `artifact_type` of `architecture`, `todo`, or `decision`.
- A future deterministic normalizer can promote matching artifacts into `VaultProject`.

Future Evidence System mapping:

- Projects are not evidence by themselves, but can reference evidence candidates created from source material.

Future Vibe Auditor mapping:

- Primary source for `VaultAuditHandoff.project`.

## VaultPrompt

Purpose: Represents a reusable prompt, instruction set, system prompt, Codex task, or model workflow instruction.

Required fields:

- `id`
- `schema_version`
- `record_type`
- `source_platform`
- `source_ref`
- `created_at`
- `tags`
- `privacy_level`
- `title`
- `prompt_text`

Optional fields:

- `source_account`
- `updated_at`
- `confidence`
- `intended_model`
- `use_case`
- `input_requirements`
- `output_expectations`
- `related_project_ids`
- `related_artifact_ids`

Example:

```json
{
  "id": "prompt_local_001",
  "schema_version": "vault.v1",
  "record_type": "VaultPrompt",
  "source_platform": "chatgpt",
  "source_ref": {
    "raw_path": "exports/chatgpt/conversations.json",
    "message_id": "source-msg-789"
  },
  "created_at": "2026-06-03T09:15:00.000Z",
  "tags": ["prompt", "codex"],
  "confidence": 0.8,
  "privacy_level": "local_private",
  "title": "Codex implementation task",
  "prompt_text": "Create a local-first parser and preserve raw exports.",
  "use_case": "repository implementation"
}
```

Chat Intelligence Vault mapping:

- Extracted prompts and task instructions become `VaultPrompt`.

Vault Ingestion Parser mapping:

- Current artifact detector emits prompt-like records as `VaultArtifact` with `artifact_type` of `prompt` or `codex_instruction`.
- Future adapter or normalizer can promote them to `VaultPrompt`.

Future Evidence System mapping:

- Prompts are process artifacts, not public evidence.

Future Vibe Auditor mapping:

- Prompts may help reconstruct project intent or recommended next actions for a private audit.

## VaultCodeBlock

Purpose: Represents recovered code with language, context, and source lineage.

Required fields:

- `id`
- `schema_version`
- `record_type`
- `source_platform`
- `source_ref`
- `created_at`
- `tags`
- `privacy_level`
- `code`

Optional fields:

- `source_account`
- `updated_at`
- `confidence`
- `language`
- `filename`
- `framework`
- `purpose`
- `related_project_ids`
- `related_command_ids`

Example:

```json
{
  "id": "code_local_001",
  "schema_version": "vault.v1",
  "record_type": "VaultCodeBlock",
  "source_platform": "chatgpt",
  "source_ref": {
    "raw_path": "exports/chatgpt/conversations.json",
    "message_id": "source-msg-321"
  },
  "created_at": "2026-06-03T09:20:00.000Z",
  "tags": ["code", "javascript"],
  "confidence": 0.95,
  "privacy_level": "local_private",
  "language": "javascript",
  "filename": "parser.js",
  "purpose": "Example parser logic",
  "code": "function parseExport(input) { return JSON.parse(input); }"
}
```

Chat Intelligence Vault mapping:

- Extracted fenced code blocks become `VaultCodeBlock`.
- Recovered code ZIP exports can be generated from these records.

Vault Ingestion Parser mapping:

- Current code artifacts map from `VaultArtifact` where `artifact_type` is `code`.

Future Evidence System mapping:

- Code is not evidence unless reviewed as a benchmark artifact or source artifact.

Future Vibe Auditor mapping:

- Code blocks can support project audit context but should remain local-private unless explicitly shared.

## VaultCommand

Purpose: Represents terminal commands, package scripts, install commands, build commands, deployment commands, or workflow shell steps recovered from exports.

Required fields:

- `id`
- `schema_version`
- `record_type`
- `source_platform`
- `source_ref`
- `created_at`
- `tags`
- `privacy_level`
- `command`

Optional fields:

- `source_account`
- `updated_at`
- `confidence`
- `cwd`
- `shell`
- `intent`
- `risk_level`
- `related_project_ids`
- `related_code_ids`

Example:

```json
{
  "id": "command_local_001",
  "schema_version": "vault.v1",
  "record_type": "VaultCommand",
  "source_platform": "chatgpt",
  "source_ref": {
    "raw_path": "exports/chatgpt/conversations.json",
    "message_id": "source-msg-654"
  },
  "created_at": "2026-06-03T09:25:00.000Z",
  "tags": ["command", "npm"],
  "confidence": 0.88,
  "privacy_level": "local_private",
  "command": "npm run build",
  "shell": "zsh",
  "intent": "Verify static app"
}
```

Chat Intelligence Vault mapping:

- Extracted terminal commands become `VaultCommand`.

Vault Ingestion Parser mapping:

- Commands may initially be detected as `VaultArtifact` with `artifact_type` of `workflow`, `todo`, or `code` depending on format.
- A future command detector should promote shell-like text into `VaultCommand`.

Future Evidence System mapping:

- Commands may support reproducibility notes but are not public evidence without review.

Future Vibe Auditor mapping:

- Commands can inform build/test/deploy capability in a private project audit.

## VaultMonetizationIdea

Purpose: Represents recovered business ideas, offers, affiliate concepts, productization notes, pricing hypotheses, or monetizable asset ideas.

Required fields:

- `id`
- `schema_version`
- `record_type`
- `source_platform`
- `source_ref`
- `created_at`
- `tags`
- `privacy_level`
- `idea`

Optional fields:

- `source_account`
- `updated_at`
- `confidence`
- `audience`
- `offer_type`
- `revenue_model`
- `constraints`
- `related_project_ids`
- `review_status`

Example:

```json
{
  "id": "money_local_001",
  "schema_version": "vault.v1",
  "record_type": "VaultMonetizationIdea",
  "source_platform": "chatgpt",
  "source_ref": {
    "raw_path": "exports/chatgpt/conversations.json",
    "message_id": "source-msg-987"
  },
  "created_at": "2026-06-03T09:35:00.000Z",
  "tags": ["monetization", "affiliate"],
  "confidence": 0.7,
  "privacy_level": "local_private",
  "idea": "Use evidence-backed tool comparison pages as affiliate entry points.",
  "audience": "builders choosing vibe-coding platforms",
  "revenue_model": "affiliate"
}
```

Chat Intelligence Vault mapping:

- Existing monetization extraction bucket should emit `VaultMonetizationIdea`.

Vault Ingestion Parser mapping:

- Monetization ideas may initially be generic artifacts until a detector or normalizer is added.

Future Evidence System mapping:

- Monetization records must not become public claims about revenue, pricing, or conversion without evidence review.

Future Vibe Auditor mapping:

- Monetization ideas can become private recommendations in an audit handoff if clearly labeled as ideas, not proven outcomes.

## VaultEvidenceCandidate

Purpose: Represents a candidate evidence item that may support internal or public claims only after review.

Required fields:

- `id`
- `schema_version`
- `record_type`
- `source_platform`
- `source_ref`
- `created_at`
- `tags`
- `privacy_level`
- `claim_text`
- `evidence_type`
- `review_status`

Optional fields:

- `source_account`
- `updated_at`
- `confidence`
- `tool_slug`
- `source_url`
- `publisher`
- `captured_at`
- `quoted_text`
- `summary`
- `related_claim_ids`
- `reviewer`
- `reviewed_at`

Example:

```json
{
  "id": "evidence_candidate_001",
  "schema_version": "vault.v1",
  "record_type": "VaultEvidenceCandidate",
  "source_platform": "file",
  "source_ref": {
    "raw_path": "docs/evidence/evidence-001-lovable.md",
    "line_start": 4,
    "line_end": 16
  },
  "created_at": "2026-06-03T09:40:00.000Z",
  "tags": ["evidence", "lovable"],
  "confidence": 0.65,
  "privacy_level": "review_required",
  "tool_slug": "lovable",
  "evidence_type": "documentation",
  "claim_text": "Candidate claim text requiring review.",
  "review_status": "needs_review"
}
```

Chat Intelligence Vault mapping:

- Chat-derived observations can become evidence candidates only when they include a source pointer and stay `review_required`.

Vault Ingestion Parser mapping:

- Current evidence-like artifacts map from `VaultArtifact` where `artifact_type` is `evidence_claim`.
- Future normalizer should create `VaultEvidenceCandidate` with `review_status`.

Future Evidence System mapping:

- This is the bridge into the evidence system.
- Only `approved_public` records can support public-facing claims.
- `approved_internal` records can support internal methodology, audits, and notes.

Future Vibe Auditor mapping:

- Evidence candidates can inform private recommendations only after internal approval, and public auditor claims require public approval.

## VaultAuditHandoff

Purpose: Local payload that connects recovered project intelligence to the Vibe Auditor without faking live integration.

Required fields:

- `id`
- `schema_version`
- `record_type`
- `source_platform`
- `source_ref`
- `created_at`
- `tags`
- `privacy_level`
- `project`
- `inputs`

Optional fields:

- `source_account`
- `updated_at`
- `confidence`
- `project_id`
- `artifact_ids`
- `prompt_ids`
- `code_ids`
- `command_ids`
- `evidence_candidate_ids`
- `monetization_idea_ids`
- `handoff_notes`
- `audit_status`

Example:

```json
{
  "id": "audit_handoff_local_001",
  "schema_version": "vault.v1",
  "record_type": "VaultAuditHandoff",
  "source_platform": "chat-intelligence-vault",
  "source_ref": {
    "raw_path": "browser-local-vault"
  },
  "created_at": "2026-06-03T09:45:00.000Z",
  "tags": ["audit-handoff", "local"],
  "privacy_level": "local_private",
  "project_id": "project_local_001",
  "project": {
    "name": "NoCodeReviewed Intelligence Platform",
    "description": "Evidence-first authority platform for no-code and vibe-coding tools."
  },
  "inputs": {
    "goals": ["increase review credibility", "recover reusable AI work"],
    "constraints": ["local-first", "no fake claims", "no cloud sync yet"],
    "known_assets": ["prompts", "code blocks", "commands"]
  },
  "artifact_ids": ["artifact_local_001"],
  "handoff_notes": "Prepared for future Vibe Auditor import."
}
```

Chat Intelligence Vault mapping:

- Future "Send to Vibe Auditor" flow should create `VaultAuditHandoff` locally.
- It must not imply cloud sync or completed auditor integration until that wiring exists.

Vault Ingestion Parser mapping:

- Parser can supply source records referenced by the handoff but should not perform auditor scoring.

Future Evidence System mapping:

- Evidence candidate IDs can be included only if review status is clear.

Future Vibe Auditor mapping:

- This is the canonical future import contract.
- The auditor should consume the handoff as local project context and produce separate audit results, not mutate source records.

## Compatibility Rules

- Internal tools should consume and emit these record types or documented subsets of them.
- Do not create parallel schemas for the same concept without updating this contract.
- New fields must be additive unless a new `schema_version` is introduced.
- Records may include extra local fields under `meta`, but tools must not require undocumented `meta` fields.
- Public outputs must never be generated directly from `local_private` or `review_required` records.
- Local browser tools may keep records in memory or local storage, but exported JSON should follow this contract.
- Parser adapters should map source-specific fields into these records without deleting raw source references.

## Minimal Export Envelope

When multiple records are exported together, use this envelope.

```json
{
  "schema_version": "vault.v1",
  "exported_at": "2026-06-03T10:00:00.000Z",
  "source": "chat-intelligence-vault",
  "records": [
    {
      "id": "project_local_001",
      "schema_version": "vault.v1",
      "record_type": "VaultProject",
      "source_platform": "chatgpt",
      "source_ref": {
        "raw_path": "exports/chatgpt/conversations.json"
      },
      "created_at": "2026-06-03T09:10:00.000Z",
      "tags": ["recovered-project"],
      "privacy_level": "local_private",
      "name": "Example Project",
      "description": "Example local project record."
    }
  ]
}
```

## Phase 4 Boundary

This contract establishes shared vocabulary only. Phase 4 does not wire the Chat Intelligence Vault to the parser, does not change runtime behavior, and does not persist records to any cloud system.

