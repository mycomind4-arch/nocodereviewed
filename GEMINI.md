# Gemini Project Context

You are working in the VibeCoding / Agent Factory platform repo.

Primary mission:
Build a controlled, local-first, auditable agent-swarm platform that can create implementation packages, apps, tools, workflows, websites, and AI-assisted systems.

Current priority:
Agent Factory and Intelligence Vault come before NoCodeReviewed review-page work.

Core systems:
- `tools/internal/agent-factory/` is the strategic swarm brain.
- `tools/internal/agent-swarm-coder/` is the safe execution engine.
- `data/intelligence-vault/` is the durable memory/evidence layer.
- `tools/internal/chat-vault-importer/` will import individual ChatGPT shared chats or transcripts into the Vault.

Rules:
- Inspect before editing.
- Prefer dry-run and implementation plans before writes.
- Do not read `.env` or credential files.
- Do not use external APIs unless explicitly approved.
- Do not deploy, create accounts, handle billing, or perform destructive actions.
- Do not prioritize NoCodeReviewed content unless explicitly requested.
- Prioritize useful shipped platform capability over impressive-looking complexity.

Before major planning, read the latest generated Vault context packet if present:
`outputs/context-packets/latest-gemini-context.md`
