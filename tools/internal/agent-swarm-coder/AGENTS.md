# AGENTS.md — agent-swarm-coder

Local operational instructions for work on or with the agent-swarm-coder itself.

## Required Reading Before Changes

- This file
- docs/CODING_AGENT_ARCHITECTURE.md
- docs/SAFETY_RULES.md
- docs/PROVIDER_ADAPTERS.md
- schemas/*.json
- The parent repo AGENTS.md and docs/registry/TOOLS.md

## Placement Rule

This tool lives at `tools/internal/agent-swarm-coder/`.

It is internal infrastructure (like vault-ingestion-parser). Do not move it to root src/, do not turn it into a top-level published package, and do not wire it into the public site or auditor without an approved later phase.

## Implementation Discipline (same as parent)

- Local-first, deterministic-first where possible.
- Preserve raw run packages; normalized evidence is secondary.
- No real LLM calls or API keys in the default/simulated path.
- Every change that can affect file writes or command execution must have corresponding test coverage for the safety path.
- Package execution (new): when modifying parser/planner/execution paths in runAgent, ensure the invalid package rejection test, dry-run no-write test, and safety block tests still pass. The sample fixture must remain a minimal valid safe package.
- Plan-to-package: when changing compiler, parser, or planner, the new planToPackageCompiler.test.js cases must pass (including the compile dry-run no-target-write case and unsafe-blocked case). Generated packages must always default approvals to false and be accepted by the existing planner.
- Update the three docs/ files when behavior or contracts change.
- Never weaken dry-run default or redaction.

## When Running the Agent on This Repo

Use the goal that produced the first run package when verifying.

Preferred invocation for self-improvement (now with context packet from prior Vault memory):

npm run agent -- --project "." --goal "inspect this project and recommend the next highest-value improvement using prior local Vault context" --dry-run --compound

( --compound = --context-packet + --vault-handoff ; requires prior manual `npm run vault:ingest-agent-runs -- --source "outputs/coding-agent-runs"` after a --vault-handoff run to populate normalized records. )

New closed-loop verification (plan -> package -> dry exec):

npm run agent -- --project "." --goal "create a harmless demo note file explaining the closed-loop flow" --compile-package --dry-run

Review the produced package (and the linked package-execution run) before ever using --apply on the nucleus.

To re-validate a saved plan:

npm run agent -- --project "." --plan "outputs/coding-agent-runs/<prior>/implementation-plan.json" --dry-run

## Repair Loop

Keep MAX_REPAIR_ATTEMPTS small (currently 2). Do not increase without updating safety docs and adding tests that prove it still terminates.

## Provider Changes

- Never make a real provider the default.
- A new provider must be registered explicitly per session or per run.
- Every provider addition requires:
  - adapter + unit test using mocks
  - update to PROVIDER_ADAPTERS.md
  - example run package showing the decision-log entry
  - confirmation that simulated path still works with zero env vars

## Evidence & Vault

The evidence-record.json produced is intentionally shaped like a VaultArtifact (vault.v1).

The vault-handoff/ subdir (when --vault-handoff or via backfill) is a normalized export layer only: it reads the raw run artifacts, produces vault.v1 records (VaultArtifact + VaultCommand only), manifest, and records.jsonl. 

Raw artifacts remain the source of truth and are never altered.

Do not invent new record types here. If you need a first-class record for "AgentRun", propose an update to docs/architecture/VAULT_DATA_CONTRACT.md first, then add here.

This change adds the producer side of local handoff... See docs/CODING_AGENT_ARCHITECTURE.md.

Context packet retrieval (new) makes the agent a consumer of prior normalized Vault records (via localVaultContextReader from outputs/vault-ingestion-runs/ normalized outputs of the parser's agent-handoff adapter). It produces advisory context-packet artifacts (with explicit staleness/low-conf flags, lineage preserved) before planning. Use --context-packet or --compound. Deterministic ranking only; no auto-apply, no treating memory as truth, no secrets. See SAFETY and CODING docs. The compounding loop (run → handoff → manual ingest → normalized → context packet → improved future run) strengthens local intelligence without cloud or weakened gates.

## Testing

Always run `npm test` (the root one that targets this package) before committing changes to the agent.

Add tests for:
- new safety rules
- new command shapes
- dry-run vs apply matrix
- rollback generation and (mocked) restore
- output package completeness
- planToPackageCompiler (valid conversion, missing fields, planner acceptance, --compile-package dry-run no-writes, --plan mode, required fields present, unsafe blocked)
- vaultHandoffBuilder (goal-mode + package-mode generation, records.jsonl validity, manifest counts+source path, originals untouched, backfill, no secrets leaked)
- localVaultContextReader + contextPacketBuilder (load/rank normalized Vault records from vault-ingestion-runs/, build packet with required sections, preserve lineage/uncertainty, no mutation/no secrets in packet, --context-packet and --compound CLI)

## Future Phases (do not start yet)

- Codex Instruction Compiler integration (the agent becomes a consumer of compiled instruction packs)
- Real provider adapters
- Full autonomous compounding (handoff + ingest + context packet on every run); currently opt-in via flags, manual ingest step, advisory packets only. Parser adapter + context reader now exist.
- Multi-step swarm coordination (needs new top-level architecture approval)
- Any cloud handoff

If a proposed change would expand scope beyond "smallest useful controlled foundation", document it in docs/ and propose as a future phase instead of implementing.
