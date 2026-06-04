# Vault Ingestion Parser

Local-first starter package for importing fragmented AI exports into a normalized Intelligence Vault structure.

## Mission
Preserve raw exports, normalize conversations/documents, extract metadata, detect operational artifacts, and create searchable indexes for future Evidence, Decision, Workflow, and Codex-context systems.

## Install
```bash
npm install
npm run build
```

## Usage
```bash
npm run dev -- ingest --input ./samples/raw --output ./samples/output --source chatgpt --account account-01
```

Or after build:
```bash
node dist/cli.js ingest --input ./exports --output ./intelligence-vault --source chatgpt --account account-01
```

## Output
```text
/output/
  raw/                 preserved originals
  normalized/
    conversations/     normalized JSON files
    documents/         normalized document records
    artifacts/         detected code/prompts/tasks/decisions
  indexes/
    conversations.json
    artifacts.json
    tags.json
    timelines.json
  logs/
    ingestion.log
    parser-errors.log
```

## Current adapters
- ChatGPT `conversations.json`
- Generic Markdown/TXT/HTML/JSON document parser (also supports .jsonl for agent handoffs in context)
- agent-swarm-coder vault-handoff (records.jsonl + manifest.json inside coding-agent-runs/**/vault-handoff/)
- ZIP preservation and extraction scaffold
- Grok/Claude/Gemini placeholder adapters route through generic parser until exact export samples are available
- local-vault-handoff (for full vault-export bundles with per-type folders; see LOCAL_VAULT_HANDOFF.md)

## Non-goals
No vector database, no cloud dependency, no autonomous agents, no external LLM requirement.
