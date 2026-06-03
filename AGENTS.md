# AGENTS.md

Operational instructions for future Codex and AI-assisted development sessions in NoCodeReviewed.

## Required Context Check

Before implementing new infrastructure features, inspect:

- `docs/registry/TOOLS.md`
- `docs/architecture/CODEX_CONTEXT.md`

Then check the relevant architecture docs:

- `docs/architecture/SOURCE_OF_TRUTH_MAP.md`
- `docs/architecture/MERGE_PLAN.md`
- `docs/architecture/INTELLIGENCE_VAULT_ARCHITECTURE.md`
- `docs/architecture/VAULT_DATA_CONTRACT.md`
- `docs/architecture/N8N_SUPABASE_CONTRACT.md`

## Mission

NoCodeReviewed is an evidence-first authority platform for no-code and vibe-coding tools. The durable product direction is an Intelligence Platform that turns evidence, benchmarks, user-owned AI exports, and operational workflows into trusted audits, reviews, comparisons, tutorials, and recommendations.

## Current Production Base

Use the current production app as the base unless a later approved phase says otherwise:

- `index.html`
- `server.mjs`
- `src/static-app.js`
- `src/styles.css`
- `tools/vibe-auditor.html`
- `tools/chat-intelligence-vault.html`
- `tools/internal/vault-ingestion-parser/`
- `docs/evidence/**`

Treat `_INBOX_NEW_FILES/**`, imported prototypes, Bolt exports, and reference folders as source material, not production code.

## Implementation Discipline

- Do not refactor unrelated files.
- Do not redesign UI during infrastructure/documentation phases.
- Do not add Supabase, n8n, React, Vite, auth, payments, or automation unless the phase explicitly requires it.
- Do not replace the production app with any prototype or export.
- Do not use fake reviews, fake scores, fake evidence, fake citations, fake testimonials, invented pricing, or unsupported platform claims.
- Preserve raw originals and add normalized outputs separately.
- Prefer deterministic parsers, manifests, validators, and explicit contracts before LLM generation.
- Keep local-first behavior for user-owned exports unless a cloud feature is explicitly approved.

## Vault Ingestion Parser Rules

Treat `tools/internal/vault-ingestion-parser/` as core Intelligence Vault infrastructure.

- Never duplicate ingestion logic in UI files, scripts, or future automation flows.
- Extend ingestion through modular parser adapters.
- Preserve raw originals by default.
- Store normalized records separately from raw inputs.
- Keep deterministic-first architecture for known export formats.
- Add schemas, adapter tests, and index expectations before depending on new parsed fields.
- Do not add Supabase writes, n8n execution, embeddings, vector databases, autonomous agents, or external LLM calls inside the parser unless a later phase explicitly requires it.

## Vault Data Contract Requirement

Inspect `docs/architecture/VAULT_DATA_CONTRACT.md` before building Vault, Evidence, Auditor handoff, parser adapter, memory extractor, workflow, or audit-record features.

- Do not invent parallel schemas for records already covered by the contract.
- Update the contract before adding new canonical record types.
- Keep records local-first and privacy-gated by default.
- Preserve raw source references when normalizing records.

## Product Direction

### Intelligence Vault

The Intelligence Vault exists to recover and structure fragmented operational knowledge from AI workflows across accounts, models, files, and prototypes. It should preserve raw inputs, extract reusable project intelligence, and eventually feed evidence-backed content and auditor workflows.

### Vibe Auditor

The Vibe Auditor is the flagship free audit and recommendation engine. Improve it incrementally from reviewed sources. Future phases may connect recovered project intelligence to the auditor, but do not fake integration.

### Evidence System

The evidence system is the credibility layer. `docs/evidence/**` is the canonical current evidence source. Missing evidence should be reported, not invented. Public claims should trace to evidence, methodology, or approved records.

## Nucleus Rule

Strengthen the nucleus before expanding the empire.

The nucleus is:

- stable production app
- local-first Intelligence Vault
- Vault Ingestion Parser
- useful Vibe Auditor
- canonical evidence files
- evidence manifest and validators
- architecture docs and source-of-truth maps

If a change does not make this nucleus clearer, safer, or more useful, keep it in docs/reference or propose it for a future phase.
