# Coding Agent Architecture

Local-first controlled coding agent MVP. Foundation for a future agent-swarm platform.

## Goals (MVP)

- Inspect any local project (respecting standard ignores).
- Produce a structured, reviewable implementation plan from a natural language goal.
- Accept `--package` (md/json) as input: parse, validate against schema + safety rules, convert to execution plan (with explicit blocked actions, warnings, approval requirements), then apply scoped file writes/patches + run listed commands only when --apply + dry-run default.
- Execute safe file operations ONLY after explicit approval (dry-run default).
- Run commands, capture everything, repair simple failures with human-visible prompts.
- Emit a complete durable run package for every invocation (audit + rollback + evidence).
- Zero external dependencies. Zero secrets. Zero network in core path.
- Simulated provider only; real LLM adapters added later behind explicit flags and review.

## Components

- `src/safetyGuard.js` — all policy, redaction, dry-run enforcement, destructive blocking.
- `src/projectInspector.js` — package.json, scripts, file inventory, secret-safe reads.
- `src/taskPlanner.js` — deterministic plan + rollback skeleton + repair prompt generator.
- `src/fileOps.js` — read / write / create / patch with mandatory .bak before real mutation.
- `src/commandRunner.js` — exec with full stdout/stderr/exit/duration capture + redaction.
- `src/repairLoop.js` — bounded attempts, summarize, provider diagnosis, prompt emission, optional scoped re-run.
- `src/providerRegistry.js` — interface + SimulatedProvider. Register real ones (OpenAI, Grok, Claude...) later.
- `src/outputWriter.js` — canonical package layout under outputs/coding-agent-runs/.
- `src/rollbackPlanner.js` — explicit restore strategy + backup list.
- `src/evidenceLogger.js` — produces vault.v1-shaped artifact record for future ingestion.
- `src/codingAgent.js` — orchestrator.
- `src/cli.js` — argv parser + UX.
- `src/planToPackageCompiler.js` — converts goal-mode implementation-plan.json into a valid agent-package.v1 package (sanitized files, all required fields, approvals=false by default). Also renders .md form. Used for --compile-package and --plan modes.
- `src/vaultHandoffBuilder.js` — Local Vault Handoff Adapter. ...
- `src/localVaultContextReader.js` — Reads normalized Vault records (vault.v1 from parser's agent-handoff ingestion) from outputs/vault-ingestion-runs/**/normalized-records.{jsonl,json}. Deterministic project/keyword/tag/artifact_type/recency/confidence ranking for current goal. Preserves lineage (source_run_path, source_ref), evidence_status, promote_to_long_term. Flags stale/low-conf. Redacts content. Read-only, no deps.
- `src/contextPacketBuilder.js` — Builds context-packet.json (structured) + .md from goal + ranked records. Includes all required sections (prior runs/decisions/evidence/commands/rollbacks/next/patterns/risks/what-not/recommended + confidence notes with uncertainty). Saved to run dir as artifact. Advisory only.

## Run Package (always produced)

outputs/coding-agent-runs/YYYYMMDDHHMMSS-slug/
- run-summary.md
- implementation-plan.md + .json
- file-change-plan.json
- changed-files.json
- command-results.json
- qa-checklist.md
- risk-checklist.md
- rollback-plan.md
- evidence-record.json (vault.v1 compatible)
- decision-log.md
- repair-prompt.md (only if repairs occurred)
- next-action.md

When using `--compile-package` on a goal run, the following are also written to the *goal* run folder (in addition to the normal artifacts):
- generated-implementation-package.json
- generated-implementation-package.md
- package-execution-output-path.txt

Package execution runs (from --package, --compile-package, or --plan) use the package-execution-* dir layout with parsed-package.json, execution-plan.json, package-execution-summary.md etc.

When `--vault-handoff` (or backfill) is used, the following subdir is added inside the run folder (original files are never modified):
- vault-handoff/manifest.json
- vault-handoff/records.jsonl
- vault-handoff/summary.md

The handoff is a derived normalized export (records.jsonl contains vault.v1 objects using existing contract record types). It coexists with the raw source-of-truth artifacts. No ingestion is performed.

When `--context-packet` (or --compound) is used:
- context-packet.json
- context-packet.md

Generated early from prior local Vault normalized records (via reader + builder). References added to run-summary.md Key Artifacts and implementation-plan.md (for goal runs). Packet includes uncertainty/staleness notes; advisory, read-only, no auto-apply.

## Safety Posture (non-negotiable)

See SAFETY_RULES.md and the guard implementation.

Dry-run is default. --apply is the only way to enable writes.

## Provider Evolution

See PROVIDER_ADAPTERS.md.

Current: only "simulated". It never auto-writes dangerous patches.

## Relation to NoCodeReviewed Nucleus

This tool is internal infrastructure (placed under tools/internal/ like the vault parser).
It can be used to implement improvements to the nucleus itself.
Its outputs (evidence-record, decision-log, commands, code changes) are designed to be ingestible by the Vault Ingestion Parser in a later approved phase.
It does not replace Codex instructions or the compiler concept; it is an executor that can consume compiled instructions in future.

## Closed-Loop Flow (plan-to-package)

The upgrade closes the loop from goal-mode planning to package-mode execution without weakening safety:

1. `npm run agent -- --goal "..." --dry-run` → produces implementation-plan.json (high-level, heuristic filesLikelyToModify, no concrete content).
2. With `--compile-package`: compiler (planToPackageCompiler) deterministically converts the plan to a full agent-package.v1 object:
   - schema_version, objective, files (sanitized: dirs mapped to concrete safe files like package.json or src/static-app.js; no trailing / paths),
   - implementationSteps (stringified), commands/testCommands (from plan),
   - qaChecklist, riskChecklist, rollbackNotes, evidenceRequirements, nextAction (all populated),
   - approvals: { deletes: false, secretEdits: false, externalActions: false } — hard default.
3. Generated .json + .md saved to the goal run dir.
4. The generated package is immediately passed to the existing package execution path with dryRun=true (reuses parsePackageFile + planPackageExecution + all safetyGuard gates + fileOps dry intent + command blocks).
5. Package exec produces its own durable package-execution-* dir; path saved in package-execution-output-path.txt.
6. Result: full audit trail. No target files written in dry-run. Risky ops (deletes, secrets, destructives, external, git-mutate in dry) remain blocked or logged as errors (caught for dry path).

To apply later: review everything, then re-invoke with the *generated* package path + --apply (and only the narrow --allow-* you reviewed).

`--plan <impl-plan.json> --dry-run` does the compile + package exec dry without a preceding goal write.

All new paths are gated by existing dry-run asserts, planner blockedActions, and no-approval defaults. No new bypasses.

## Vault Handoff (Local Export Layer)

... (as before)

Raw artifacts are never modified; the handoff is an additive normalized export only. This strengthens the nucleus by making agent outputs first-class candidates for the Intelligence Vault without duplicating parser logic, without live ingestion, and without inventing record types.

## Context Packet Retrieval (Local Memory from Vault)

Context packets close the local compounding loop:

1. Run with --vault-handoff (or backfill) → produces vault-handoff/ (raw source of truth preserved).
2. (Manual, one-time per batch of runs) `npm run vault:ingest-agent-runs -- --source "outputs/coding-agent-runs"` → parser's agent-handoff adapter normalizes to outputs/vault-ingestion-runs/<stamp>-agent-swarm-coder-handoff/normalized-records.{jsonl,json} (preserves all contract fields + lineage).
3. Run with --context-packet (or --compound which also sets --vault-handoff) → before planning, localVaultContextReader scans recent normalized outputs, filters/ranks records for current goal (deterministic: goal token overlap in title/summary/tags/artifact_type + project match + type bonuses for decision/evidence/impl/next/rollback + recency + confidence), redacts, flags stale (old created_at or conf<0.4 or bad status).
4. contextPacketBuilder produces context-packet.json (full structured data with sections for prior runs/decisions/evidence/commands/rollbacks/next_actions/reusable_patterns/risks_from_memory/what_not_to_repeat/recommended_strategy) + .md (human review form).
5. Packet saved to current run dir. run-summary.md and (for goal) implementation-plan.md get Key Artifacts / section references. decisionLog/qa/nextAction augmented with note.
6. Future run can use the packet (human reviews it) for better plans, still 100% safety gates, dry-run default, no auto-apply.

The packet is strictly advisory: "do not treat prior records as unquestionable truth". All lineage (source_run_path, source_ref from original handoff) is preserved so user can trace back to raw. No new record types. Fits VAULT_DATA_CONTRACT / LOCAL_HANDOFF (normalized records are the input). No deps, read-only on Vault outputs.

Use --compound for handoff+context in one self-improvement run (after prior ingest). This makes the agent nucleus smarter over time using only local deterministic tools.

## Non-Goals (MVP and near term)

- No real LLM calls or API keys.
- No autonomous multi-agent swarm.
- No cloud, Supabase, n8n.
- No deletion of files.
- No deployment, publish, or credential handling.
- No bypassing of the plan review gate.

## Next After MVP

- Real provider adapter behind flag + explicit user approval per run.
- Patch applicator that understands unified diffs safely.
- Integration point for compiled Codex instructions (from future compiler).
- Optional handoff of run evidence into Intelligence Vault.
- (This phase) The plan-to-package compiler + --compile-package/--plan modes are now part of the controlled foundation; future work can consume generated packages from Codex Instruction Compiler output once that exists.
