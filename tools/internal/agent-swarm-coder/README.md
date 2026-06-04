# agent-swarm-coder

Local-first controlled coding agent MVP.

Part of the NoCodeReviewed internal infrastructure. Lives under `tools/internal/` alongside the Vault Ingestion Parser.

## What it does (MVP)

- Inspects a local project directory (package.json, scripts, important files).
- Ignores node_modules, .git, dist, build, .next, coverage, etc.
- Redacts secrets from .env* and credential-like strings.
- Given a goal, deterministically produces a full implementation plan (objective, assumptions, constraints, steps, risks, tests, rollback).
- Or: accept `--package` (md or json) describing objective + concrete file create/patch + commands + checklists, validate it, produce execution plan with safety analysis (blocked/warnings/approvals), execute scoped changes only on --apply (with backups).
- Safe file ops with backups before any mutation.
- Runs commands (npm test, build, lint, git status, custom) and captures everything.
- Bounded repair loop on failure: summarizes, generates repair prompt + diagnosis (via simulated provider), optionally applies scoped fix.
- **Every run** writes a complete durable package under `outputs/coding-agent-runs/<stamp>-<slug>/` containing plans, results, evidence record, decision log, rollback instructions, and next actions.
- Defaults to `--dry-run` (inspect + plan only). `--apply` is required for writes.

## Safety

See `docs/SAFETY_RULES.md`. Dry-run is the default for a reason.

No network, no keys, no accounts, no deployment, no destruction, no hidden recursion.

## Run

From the repo root:

```bash
npm run agent -- --project "." --goal "inspect this project and recommend the next highest-value improvement" --dry-run
```

Package execution mode (recommended for controlled changes from plans):

```bash
npm run agent -- --project "." --package "tools/internal/agent-swarm-coder/tests/fixtures/sample-implementation-package.md" --dry-run
```

Closed-loop: goal planning to package execution (new):

```bash
npm run agent -- --project "." --goal "create a harmless demo note file explaining the closed-loop flow" --compile-package --dry-run
```

This runs normal goal planning (saves implementation-plan.*), compiles it to generated-implementation-package.{json,md} (safe defaults, approvals=false), immediately feeds the generated package to the package execution pipeline in dry-run (validates parser/planner/safety gates, no target writes), and records package-execution-output-path.txt.

Plan import mode (re-execute a prior plan as package):

```bash
npm run agent -- --project "." --plan "outputs/coding-agent-runs/<stamp>-slug/implementation-plan.json" --dry-run
```

Vault Handoff (Local Vault Handoff Adapter - new):

Every run can emit a normalized export layer for future Intelligence Vault use:

```bash
npm run agent -- --project "." --goal "inspect this project..." --dry-run --vault-handoff
```

- Creates `vault-handoff/{manifest.json, records.jsonl, summary.md}` **inside** the run dir.
- Raw artifacts (implementation-plan.json, evidence-record.json, decision-log.md, command-results.json, etc.) are **never modified or removed**.
- Records use existing VAULT_DATA_CONTRACT types (VaultArtifact, VaultCommand) + contract fields (source_platform, source_ref, privacy_level=local_private, etc.) plus handoff fields.
- No live ingestion. records.jsonl is JSON document compatible for the parser (future adapter can classify by record_type).
- Backfill previous runs: `npm run agent -- --backfill-vault-handoff "outputs/coding-agent-runs/<stamp>-slug"`
- Default: --vault-handoff is false (matches current contracts where vault ingestion of run packages is still a future phase; see AGENTS.md + registry).

With writes (use only after reviewing the plan!):

```bash
npm run agent -- --project "." --goal "..." --apply
```

Direct (from inside the agent dir or with full path):

```bash
node tools/internal/agent-swarm-coder/src/cli.js --project . --goal "..." --dry-run
```

## Test

```bash
npm test
# or from agent dir: npm run test
```

Tests cover inspection, ignores, secret redaction, plan generation, command capture, output package, rollback, and dry-run write blocking.

## Output Package Contents (always)

- run-summary.md
- implementation-plan.md + implementation-plan.json
- file-change-plan.json
- changed-files.json
- command-results.json
- qa-checklist.md
- risk-checklist.md
- rollback-plan.md
- evidence-record.json (shaped for future Vault ingestion)
- decision-log.md
- repair-prompt.md (when repairs happened)
- next-action.md

For goal runs with `--compile-package` (added to the goal run folder):

- generated-implementation-package.json
- generated-implementation-package.md
- package-execution-output-path.txt (points to the dry-run package exec output dir)

The generated package is a full agent-package.v1 with schema_version, objective, files (sanitized from plan), implementationSteps, commands, testCommands, qaChecklist, riskChecklist, rollbackNotes, evidenceRequirements, nextAction, and approvals defaulting to all false (dry-run safe).

For runs with `--vault-handoff` (or backfill), added inside the run folder (raw artifacts untouched):

- vault-handoff/manifest.json
- vault-handoff/records.jsonl
- vault-handoff/summary.md

This is the Local Vault Handoff export: normalized vault.v1 records (no new record types) derived from the run package. Raw run package (plans, logs, evidence-record.json etc.) is always the source of truth.

For runs with `--context-packet` (or via --compound), added inside the run folder:

- context-packet.md
- context-packet.json

Generated by reading prior normalized records from outputs/vault-ingestion-runs/**/ (from previous handoff+ingest), deterministic ranking for the goal, producing advisory memory of prior decisions/evidence/etc with lineage, staleness flags, and confidence notes. References added to run-summary.md and implementation-plan.md. Never mutates sources, never auto-applies. --compound = --context-packet + --vault-handoff.

## Architecture & Contracts

- `docs/CODING_AGENT_ARCHITECTURE.md`
- `docs/SAFETY_RULES.md`
- `docs/PROVIDER_ADAPTERS.md`
- `schemas/*.schema.json`

## Adding Real Providers Later

See `docs/PROVIDER_ADAPTERS.md`. Start with local (Ollama) or approved cloud with explicit per-run consent. Simulated provider stays the safe default.

## Status

MVP foundation + closed loop + Local Vault Handoff + Context Packet. Supports legacy..., vault-handoff, and context-packet retrieval (reads prior normalized Vault outputs from outputs/vault-ingestion-runs/, deterministic rank for goal, emits advisory context-packet.{md,json} with prior intel + uncertainty notes; referenced in summary/plan; --compound for both).

Compounding loop (local/manual): run + --vault-handoff → handoff → (manual) vault:ingest-agent-runs → normalized records → run + --context-packet → reader+builder → packet in run dir → better future run (still full review + gates, no auto-apply, no secrets, sources untouched).

Raw always source of truth.

See docs/CODING_AGENT_ARCHITECTURE.md for details.

## License / Use

Internal tool for this repository. Do not run against projects you do not own. Respect all safety rules.
