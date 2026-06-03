# Codex Build Instructions — Vault Ingestion Parser

## Objective
Implement and integrate a local-first Vault Ingestion Parser into NoCodeReviewed as foundational operational intelligence infrastructure.

## Scope
Build only the ingestion/normalization/indexing layer. Do not add vector databases, cloud sync, autonomous agents, or external LLM calls.

## Must Preserve
- Raw exports are never modified.
- Parser adapters are modular.
- Normalized schemas remain stable and versionable.
- Output is human-inspectable JSON.
- Ingestion logs and parser errors are written every run.

## File Targets
Recommended integration path:

```text
/apps/intelligence-vault-ingestion/
  src/
  docs/
  package.json
  tsconfig.json
```

## Acceptance Criteria
- `npm install` succeeds.
- `npm run build` succeeds.
- CLI can ingest a folder, file, or zip.
- ChatGPT `conversations.json` is parsed into normalized conversation records.
- Markdown/TXT/HTML/JSON docs are parsed into normalized document records.
- Code blocks, prompts, architecture notes, decisions, workflows, todos, benchmarks, and evidence claims are tagged as artifacts.
- Indexes are generated:
  - conversations.json
  - artifacts.json
  - tags.json
  - timelines.json
- Raw originals are copied into `/raw/` unless explicitly disabled.

## Do Not Do
- Do not rewrite the whole app.
- Do not connect Supabase yet.
- Do not add agents yet.
- Do not build a full search UI yet.
- Do not make parsing dependent on OpenAI or external APIs.

## Strategic Alignment
This strengthens the Intelligence Vault nucleus and prepares later systems:
- Strategic Memory Extractor
- Evidence Record Generator
- Decision Log Builder
- Workflow Template Extractor
- Codex Instruction Compiler
- Nucleus Guardrail Checker
