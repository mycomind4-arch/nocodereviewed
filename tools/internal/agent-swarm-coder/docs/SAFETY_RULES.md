# Safety Rules — agent-swarm-coder

These rules are enforced in code and must not be weakened without an explicit architecture change + review.

## Core Posture

- **Local-first only**. Everything happens on the operator's machine against a path they control.
- **Dry-run by default**. The CLI and orchestrator default to `dryRun: true`. Writes, patches, and mutating commands are blocked unless `--apply` (or equivalent) is passed.
- **Explicit approval for mutation**. Even with --apply, the implementation plan (or package) must be generated/parsed first and the run package is always written for review.
- In package mode: parser + planner pre-compute blockedActions (secrets, deletes, destructive/external cmds) before any execution. Additional --allow-* flags only relax specific gates when you have reviewed the package.
- **Backups before every change**. `fileOps` creates `<file>.bak-<timestamp>` before overwriting. Rollback is documented per run.
- **No deletion**. File delete is not implemented. Future phases must add it behind an extra confirmation gate.
- **No secrets ever printed**. All reads of .env* and obvious credential patterns are redacted before any output, log, or plan.
- **Destructive commands blocked**. rm -rf, force pushes, mkfs, curl|bash, etc. are refused even in apply mode.
- **No uncontrolled recursion**. Repair loop is hard-capped (currently 2). No agent may spawn other agents without a new top-level approval.
- **No credential or account handling**. The agent never reads, stores, or transmits keys, tokens, or auth material.
- **No deployment or external side effects**. Only local commands the user could type themselves (npm test, node, git status, etc.).
- **No hiding failures**. Every command result (including failed repairs) is captured verbatim (redacted) in command-results.json and surfaced in summaries.
- **Provider limits respected**. Simulated provider never claims it can do more than it does. Real providers must be added with clear capability declarations and per-run consent.
- **Plan-to-package is safe by construction**. compilePlanToPackage always emits approvals: {deletes:false, secretEdits:false, externalActions:false}. It sanitizes file paths (no bare dirs) and never emits delete actions. The generated package is fed to the *existing* packageParser + packageExecutionPlanner + safetyGuard (assertDryRunAllows, isDestructiveCommand, isEnvFile, blockedActions, etc.). Inner execution for --compile-package and --plan modes is forced to dry-run. No new escape hatches.
- **Vault handoff is read-only export only**. ...
- **Context packet retrieval is read-only advisory memory only**. localVaultContextReader reads (never writes) normalized records from outputs/vault-ingestion-runs/**/ (post-ingest). Ranks deterministically for the goal (no LLM). Flags stale/low-conf explicitly. Redacts any content. Packet is saved as new artifact in current run dir only; never mutates Vault outputs, agent raw runs, or handoffs. No auto-apply of anything from memory — user must review context-packet.md + trace lineage + run full dry-run + gates. --compound simply enables two additive export flags. Memory is never treated as truth; confidence notes and "review before use" are mandatory in packet.

## Dry-Run vs Apply

| Action                  | Dry-Run (default)      | --apply                  |
|-------------------------|------------------------|--------------------------|
| Inspect + list files    | yes                    | yes                      |
| Read source (redacted)  | yes                    | yes                      |
| Generate plan + package | yes                    | yes                      |
| Write / create / patch  | record intent only     | perform + .bak           |
| Run tests / build / lint| yes (read-only cmds)   | yes                      |
| Git mutating cmds       | blocked                | allowed if not destructive |
| Repair auto-apply       | never                  | only if explicitly pre-approved narrow patch |
| --compile-package / --plan inner exec | always forced dry-run (validation only; target writes blocked by gates) | N/A for the compile step itself (review generated package first) |
| --vault-handoff (or backfill) | always additive subdir only (raw artifacts + safety results untouched); redaction mandatory | same (handoff generation independent of apply) |
| --context-packet (or --compound) | always read-only on Vault normalized outputs + additive packet files in current run dir only; ranking deterministic + uncertainty flagged; no auto-apply | same (context is advisory artifact, independent of apply) |

## Redaction

- .env and .env.* → values replaced
- Common patterns (API_KEY=, SECRET=, PRIVATE KEY blocks, long tokens) → [REDACTED]
- Applied to file reads, command stdout/stderr, plans, logs.

## Reporting Violations

If the agent ever attempts something outside these rules, it is a bug. File an issue with the run_id and the full output package.

## Future Hardening (after explicit approval)

- Capability manifest per provider (what it may read/write).
- Hash of plan + approval token before any apply.
- Optional git pre-flight (require clean tree or explicit --force-dirty).
