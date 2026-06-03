# NoCodeReviewed Tool Registry

This registry keeps internal tool direction visible across Codex sessions. Some tools are installed internal infrastructure; conceptual tools remain planning placeholders until a later phase explicitly approves implementation.

## Registry Rules

- Do not build registry items until the current production nucleus is stable.
- Do not connect cloud services, Supabase, n8n, or paid workflows from this registry without a dedicated implementation phase.
- Do not create fake scores, reviews, evidence, citations, testimonials, pricing, or platform claims.
- Prefer deterministic parsing, validation, manifests, and explicit review gates before LLM generation.
- Preserve raw originals and store normalized outputs separately.
- Keep reusable modules narrow enough to support the main app, Vibe Auditor, Chat Intelligence Vault, evidence system, and future automation without forcing a framework migration.

## Current Production Tools

| Tool | Current Source | Status | Direction |
| --- | --- | --- | --- |
| Main NoCodeReviewed App | `index.html`, `server.mjs`, `src/static-app.js`, `src/styles.css` | Production base | Keep static app stable while adding evidence-oriented interfaces in approved phases. |
| Vibe Auditor | `tools/vibe-auditor.html` | Production tool | Flagship free auditor and recommendation engine. Improve by diffing against reviewed prototypes, not by wholesale replacement. |
| Chat Intelligence Vault | `tools/chat-intelligence-vault.html` | Local-first tool page | Recover projects, prompts, code, commands, and business ideas from user-owned AI exports. Keep local-only until cloud persistence is approved. |
| Evidence Manifest | `data/intelligence-vault/evidence-manifest.json` | Generated inventory | Track canonical evidence files, missing numbers, and duplicate candidates without rewriting evidence claims. |

## Installed Internal Infrastructure

### Shared Vault Data Contract

Location: `docs/architecture/VAULT_DATA_CONTRACT.md`

Purpose: Defines the canonical local-first record types shared by Chat Intelligence Vault, Vault Ingestion Parser, future Evidence System, future Vibe Auditor handoff, future Strategic Memory Extractor, and future Workflow Template Extractor.

Rule: Internal tools should consume and emit compatible records instead of inventing parallel schemas. Additive schema changes should update the contract first.

### Vault Ingestion Parser

Location: `tools/internal/vault-ingestion-parser/`

Purpose: Local-first parser infrastructure for importing fragmented AI exports, operational notes, and project artifacts into normalized Intelligence Vault records.

Supported formats:

- ChatGPT `conversations.json`
- Markdown
- TXT
- HTML
- JSON documents
- ZIP input preservation and extraction scaffold
- Grok, Claude, and Gemini placeholders through the generic document path until exact export samples are available

Architectural role:

- Preserve raw inputs under an output `raw/` archive.
- Normalize conversations and documents into JSON records.
- Detect operational artifacts such as code blocks, prompts, architecture notes, decisions, workflows, todos, benchmarks, evidence claims, and Codex instructions.
- Build deterministic indexes for conversations, artifacts, tags, and timelines.
- Prepare future systems without adding cloud persistence, vector search, agents, or external LLM dependencies.

Core principles:

- Preserve raw originals.
- Store normalized outputs separately.
- Extend through modular parser adapters.
- Keep parsing deterministic-first.
- Keep output human-inspectable.
- Log ingestion and parser errors.
- Do not invent evidence, claims, scores, or conclusions.

Future integrations:

- Chat Intelligence Vault import/export handoff.
- Vibe Auditor project-intelligence handoff.
- Evidence Record Generator.
- Strategic Memory Extractor.
- Decision Log Builder.
- Workflow Template Extractor.
- Future Supabase ingestion after schema and security approval.
- Future n8n orchestration after contract and environment review.

## Reference Sources

| Source | Location | Use |
| --- | --- | --- |
| Vibe Auditor prototypes | `docs/reference/prototypes/vibe-auditor/` | Reference only. Extract reviewed improvements into the production auditor later. |
| Chat Intelligence Vault prototype | `docs/reference/prototypes/chat-intelligence-vault/` | Reference only. Production page should stay local-first until persistence is approved. |
| Bolt frontend export | `docs/reference/prototypes/bolt-auditor/` and `_INBOX_NEW_FILES/` | Design and component reference only. Do not replace the production app. |
| n8n workflow pack | `docs/reference/automation/n8n/` | Automation reference only. Do not activate until schema, secrets, and security are reviewed. |
| Supabase schema candidates | `docs/reference/schemas/` and `data/intelligence-vault/schema-candidates.md` | Schema reference only. Reconcile before applying to any live project. |

## Internal Tool Registry

### Vault Ingestion Parser

Status: Installed foundational infrastructure at `tools/internal/vault-ingestion-parser/`.

Rule: Do not duplicate ingestion logic elsewhere. Extend this parser through modular adapters and keep raw import preservation as the default.

### Strategic Memory Extractor

Concept: Extracts reusable project decisions, product direction, naming decisions, build constraints, and unresolved risks from chat exports and project notes.

Do not build yet. Future implementation should distinguish user-authored strategy from model suggestions and unsupported claims.

### Evidence Record Generator

Concept: Converts approved evidence sources into structured evidence records with provenance, source type, confidence, and claim boundaries.

Do not build yet. Future implementation must block unsupported public claims and should require explicit evidence IDs or source references.

### Decision Log Builder

Concept: Produces concise decision logs from project discussions, commits, architecture docs, and approved plans.

Do not build yet. Future implementation should preserve context, tradeoffs, and dates without rewriting history.

### Codex Instruction Compiler

Concept: Compiles current architecture rules, source-of-truth maps, guardrails, and phase boundaries into concise session instructions for future Codex work.

Do not build yet. Future implementation should read repository-visible docs and avoid relying on hidden chat context.

### Workflow Template Extractor

Concept: Identifies reusable workflows from chat histories, n8n references, scripts, and operational docs, then proposes deterministic templates.

Do not build yet. Future implementation should output reviewable templates before any automation runs.

### Nucleus Guardrail Checker

Concept: Checks proposed changes against the current production nucleus, source-of-truth map, evidence rules, and phase boundaries.

Do not build yet. Future implementation should warn on scope expansion, fake claims, unreviewed prototype imports, live secret exposure, and unsafe architecture jumps.

## Operating Standard

Every internal tool should strengthen the core system before expanding the surface area. The core is:

- user-owned intelligence intake
- local-first analysis
- evidence-backed platform reviews
- auditable methodology
- reusable operational memory
- safe future persistence through Supabase and n8n only after explicit approval
