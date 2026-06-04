# Codex Context

This file exists so future Codex and AI-assisted development sessions can inherit the project direction without relying on hidden chat history.

Before implementing infrastructure features, inspect:

- `docs/registry/TOOLS.md`
- `docs/architecture/SOURCE_OF_TRUTH_MAP.md`
- `docs/architecture/MERGE_PLAN.md`
- `docs/architecture/INTELLIGENCE_VAULT_ARCHITECTURE.md`
- `docs/architecture/VAULT_DATA_CONTRACT.md`
- The Vault Ingestion Parser now has an agent-swarm-coder-handoff adapter and `vault:ingest-agent-runs` support (see registry/TOOLS.md and parser README). Agent produces vault-handoff/ exports; parser normalizes them locally into vault-ingestion-runs outputs. Raw always preserved.
- Agent now supports --context-packet (reader from normalized Vault outputs + builder) for local memory/context packets in runs (via --compound for full loop). Deterministic, advisory, no auto-apply. See agent AGENTS.md + CODING docs.

## Project Mission

NoCodeReviewed is becoming an evidence-first authority on no-code and vibe-coding platforms. The long-term product is not just a review site. It is an Intelligence Platform that turns tool evidence, benchmark data, user-owned AI history, and operational workflows into trustworthy reviews, comparisons, tutorials, recommendations, and audits.

The brand can be cinematic and authoritative, but the product must earn trust through evidence, methodology, traceability, and useful tools.

## Current Nucleus

The current production nucleus is:

- Main app: `index.html`, `server.mjs`, `src/static-app.js`, `src/styles.css`
- Vibe Auditor: `tools/vibe-auditor.html`
- Chat Intelligence Vault: `tools/chat-intelligence-vault.html`
- Vault Ingestion Parser: `tools/internal/vault-ingestion-parser/`
- Evidence source: `docs/evidence/**`
- Evidence manifest: `data/intelligence-vault/evidence-manifest.json`
- Architecture docs: `docs/architecture/**`
- Reference material: `docs/reference/**`

Strengthen this nucleus before expanding. Do not replace it with the Bolt export, a React migration, a Supabase app, or an automation stack until an explicit phase approves that move.

## Why The Intelligence Vault Exists

AI-assisted builders often spread important project memory across ChatGPT, Grok, Claude, Replit, Lovable, Bolt, browser notes, local files, screenshots, prompts, terminal commands, and unfinished prototypes. The useful intelligence becomes fragmented, hard to search, and hard to reuse.

The Intelligence Vault exists to recover that operational knowledge, preserve raw originals, normalize useful records, and turn scattered AI work into durable project memory.

The practical goal is continuity:

- recover projects and assets from chat exports
- extract prompts, code, commands, decisions, and monetization ideas
- connect user-owned project intelligence to the Vibe Auditor
- support evidence-backed tool reviews and comparisons
- eventually persist reviewed records in Supabase
- eventually orchestrate ingestion and generation with n8n

## Operational Intelligence Problem

The core problem is not content volume. The core problem is trusted continuity across fragmented AI workflows.

NoCodeReviewed should help answer:

- What did we already build or decide?
- Which claims are actually supported by evidence?
- Which tool is best for a specific project context?
- Which recovered assets are reusable, monetizable, or worth auditing?
- Which workflows can be repeated safely?

## Product Directions

### Intelligence Vault

Direction: Local-first ingestion and recovery now; structured Supabase persistence later.

Rules:

- Keep imports local by default.
- Preserve raw source files or raw text references.
- Store normalized records separately from raw originals.
- Prefer deterministic extraction before LLM enrichment.
- Do not upload, sync, or persist cloud data until explicitly approved.

### Vault Data Contract

`docs/architecture/VAULT_DATA_CONTRACT.md` is the shared operational grammar for the Intelligence Vault. Future Vault, Evidence, Auditor handoff, parser adapter, memory extractor, workflow, or audit-record work must inspect it before adding schemas or record formats.

### Local Vault Handoff

`docs/architecture/LOCAL_VAULT_HANDOFF.md` defines the deterministic local export/import bundle between Chat Intelligence Vault and Vault Ingestion Parser. Future continuity workflows should use parser-compatible `vault-export.zip` bundles and contract-compatible records instead of one-off JSON shapes.

### Vault Ingestion Parser

Direction: Core internal ingestion infrastructure for the Intelligence Vault.

Role:

- Convert user-owned exports and operational files into normalized records.
- Preserve raw originals by default.
- Keep normalized conversations, documents, artifacts, and indexes separate from raw inputs.
- Provide the shared parser layer for Chat Intelligence Vault, future memory systems, evidence preparation, and workflow extraction.

Rules:

- Do not duplicate ingestion logic in separate tools.
- Extend ingestion through modular parser adapters.
- Keep adapter behavior deterministic where formats are known.
- Treat Grok, Claude, Gemini, and future exports as adapter additions, not one-off parsers embedded in UI files.
- Do not add embeddings, vector stores, autonomous agents, Supabase writes, or n8n execution inside the parser until explicitly approved.

### Vibe Auditor

Direction: The flagship free recommendation and audit engine.

Rules:

- Keep it useful without requiring payment.
- Improve current production `tools/vibe-auditor.html` incrementally.
- Connect recovered project intelligence in a later phase without faking integration.
- Recommendations must be grounded in declared inputs, evidence, or transparent heuristics.

### Evidence System

Direction: Evidence becomes the credibility layer beneath reviews, comparisons, tutorials, rankings, and recommendations.

Rules:

- `docs/evidence/**` is the canonical current evidence source.
- Missing evidence is documented, not invented.
- Duplicate candidates are warnings until reviewed.
- Do not invent reviews, scores, citations, pricing, testimonials, or unsupported claims.
- Public claims should trace to evidence records, sources, or approved methodology.

## Local-First Philosophy

Local-first is the default for user-owned files and chat exports. Browser processing should happen locally unless the user explicitly connects a future cloud feature.

This protects privacy and also keeps the system honest while the schema, security model, and automation contracts are still under review.

## Deterministic-First Systems

Prefer deterministic logic for:

- file inventories
- manifests
- duplicate detection
- schema comparison
- evidence validation
- source-of-truth checks
- import parsing where formats are known

Use AI enrichment later as a reviewed layer, not as the foundation for truth.

## Preserve Raw Originals

Raw inputs are evidence. Do not overwrite them, rewrite their claims, or collapse them into generated summaries without keeping a source pointer.

Reference folders and inbox material are source material, not production code. Production integration should happen through reviewed copies, manifests, documented transforms, or explicit merge plans.

## Anti-Scope-Explosion Rules

- Stabilize before expanding.
- Do not start hundreds of pages before the evidence and vault pipeline are reliable.
- Do not add Supabase, n8n, payments, auth, or framework migrations inside unrelated phases.
- Do not replace the app with a prototype export.
- Do not merge fake or placeholder claims into public review surfaces.
- Do not build internal tools before documenting their contracts and acceptance criteria.

## Strengthen The Nucleus Rule

Every phase should make the core system clearer, safer, or more useful. If a change does not strengthen the current nucleus, it should stay in docs, reference, or a future-phase plan.

The preferred order is:

1. Preserve source material.
2. Document source of truth.
3. Build deterministic inventories and validators.
4. Add local-first tools.
5. Connect tools through explicit contracts.
6. Add persistence only after schemas and security are reviewed.
7. Generate public outputs only after quality gates exist.

## Future Ingestion Architecture

Future ingestion should move toward:

- raw import capture
- deterministic parsing
- normalized Intelligence Vault records
- modular parser adapters for each source format
- evidence and decision manifests
- quality gateway checks
- optional LLM extraction with provenance
- Supabase persistence through reviewed tables and RPCs
- n8n orchestration with environment-controlled credentials
- public review/comparison/tutorial outputs generated only from approved records

The target is modular reusable infrastructure, not one-off pages that cannot share evidence, project memory, or quality gates.

The Vault Ingestion Parser is the first shared ingestion nucleus. Future source support should add adapters, schemas, and tests there before any UI or automation layer consumes the data.
