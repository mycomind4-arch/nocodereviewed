#!/usr/bin/env node
/**
 * cli.js
 * Entry point: node src/cli.js --project <path> --goal "..." [--dry-run|--apply]
 *
 * Safety: defaults to dry-run.
 */

import { runAgent } from './codingAgent.js';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

function parseArgs(argv) {
  const args = argv.slice(2);
  const out = {
    project: '.',
    goal: null,
    packagePath: null,
    dryRun: true,
    allowRepairApply: false,
    allowDeletes: false,
    allowSecretEdits: false,
    compilePackage: false,
    planPath: null,
    vaultHandoff: false,
    backfillHandoffPath: null,
    contextPacket: false,
    taskPath: null
  };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--project' || a === '-p') {
      out.project = args[++i] || '.';
    } else if (a === '--goal' || a === '-g') {
      out.goal = args[++i] || '';
    } else if (a === '--package' || a === '--pkg') {
      out.packagePath = args[++i] || null;
    } else if (a === '--dry-run' || a === '--dry') {
      out.dryRun = true;
    } else if (a === '--apply' || a === '--no-dry-run') {
      out.dryRun = false;
    } else if (a === '--allow-repair-apply') {
      out.allowRepairApply = true;
    } else if (a === '--allow-deletes') {
      out.allowDeletes = true;
    } else if (a === '--allow-secret-edits' || a === '--allow-secrets') {
      out.allowSecretEdits = true;
    } else if (a === '--compile-package' || a === '--compile') {
      out.compilePackage = true;
    } else if (a === '--plan' || a === '--plan-path') {
      out.planPath = args[++i] || null;
    } else if (a === '--vault-handoff') {
      out.vaultHandoff = true;
    } else if (a === '--backfill-vault-handoff') {
      out.backfillHandoffPath = args[++i] || null;
    } else if (a === '--context-packet') {
      out.contextPacket = true;
    } else if (a === '--compound') {
      out.contextPacket = true;
      out.vaultHandoff = true;
    } else if (a === '--task' || a === '--task-path') {
      out.taskPath = args[++i] || null;
    } else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    }
  }
  return out;
}

function printHelp() {
  console.log(`
agent-swarm-coder — local-first controlled coding agent MVP

Usage (goal mode - generates plan):
  node src/cli.js --project "." --goal "your goal here" [--dry-run | --apply]

Usage (package execution mode - execute pre-defined package safely):
  node src/cli.js --project "." --package "path/to/implementation-package.md|json" [--dry-run | --apply]

Usage (goal + compile-package: plan -> generated package -> immediate dry-run package exec validation):
  node src/cli.js --project "." --goal "..." --compile-package --dry-run
  (Saves normal goal outputs + generated-implementation-package.{json,md} + package-execution-output-path.txt in the goal run dir.
   Inner package exec is always dry-run for safety validation.)

Usage (plan import mode: existing implementation-plan.json -> compile -> package exec dry-run):
  node src/cli.js --project "." --plan "path/to/implementation-plan.json" --dry-run

Usage (vault handoff export - normalized records for future Intelligence Vault):
  node src/cli.js --project "." --goal "..." --dry-run --vault-handoff
  (Emits vault-handoff/{manifest.json, records.jsonl, summary.md} inside the run dir.
   Raw artifacts unchanged. Uses VaultArtifact/VaultCommand per contract. Default: false.)

Usage (context packet retrieval using prior local Vault ingestion outputs):
  node src/cli.js --project "." --goal "..." --dry-run --context-packet
  (Before planning, reads outputs/vault-ingestion-runs/**/normalized-records.{jsonl,json},
   ranks relevant prior decisions/evidence/commands/rollbacks/etc deterministically for the goal,
   saves context-packet.{md,json} into the run dir. References added to summary and plan.
   --compound enables both context-packet and vault-handoff.)

Usage (compound mode - context + handoff):
  node src/cli.js --project "." --goal "..." --dry-run --compound

Usage (task mode - for ai-chat-command-bridge native host):
  node src/cli.js --task "path/to/task.json"
  The task.json contains instruction, project_path, mode ("dry-run"|"apply"), options {vault_handoff, context_packet, compile_package}.
  Produces machine-readable TASK_RESULT_JSON at end, and writes agent-result-*.json next to task.
  Respects mode for dry/apply, and options for extra features. Safety gates still apply (apply only if approved upstream).

Usage (backfill previous run):
  node src/cli.js --backfill-vault-handoff "outputs/coding-agent-runs/2026...-slug"

Options:
  --project, -p     Path to local project to inspect and operate on (default ".")
  --goal, -g        The task / improvement goal (for plan generation mode)
  --package, --pkg  Path to implementation-package.md or .json to parse, validate, plan, and (with --apply) execute
  --plan, --plan-path  Path to a previous implementation-plan.json; compiles it to package and runs package execution (dry-run recommended)
  --compile-package, --compile  After normal goal planning, compile the produced implementation-plan.json into generated-implementation-package.{json,md}, then immediately execute it via the package pipeline in dry-run (saves paths)
  --vault-handoff   Emit vault-handoff/ normalized export (manifest + records.jsonl + summary) inside the run dir using VAULT_DATA_CONTRACT shapes. Does not alter raw artifacts. (default false per current contracts)
  --backfill-vault-handoff <path>  Read an existing run dir and create/overwrite only its vault-handoff/ subdir (no execution)
  --dry-run         Inspect + plan only. Do not modify files. (DEFAULT)
  --apply           Permit actual file writes + backups (use with extreme caution)
  --allow-repair-apply  Allow the repair loop to apply a pre-approved narrow patch on failure (advanced)
  --allow-deletes   Permit delete operations declared in package (still gated)
  --allow-secret-edits  Permit edits to .env / credential files declared in package (still gated + redacted)
  --help            This help

Safety:
  - Dry-run is default and strongly recommended.
  - No network, no secrets exposed, no destructive commands.
  - Every mutation creates a .bak next to the file.
  - Package mode: parses + validates + produces execution-plan with blocked/warnings before any apply.
  - --compile-package and --plan ALWAYS feed through dry-run package execution for validation (target writes blocked).
  - --vault-handoff (and backfill) only add a vault-handoff/ subdir; raw run artifacts are never modified.
  - --context-packet reads (never mutates) local Vault normalized outputs for advisory memory only; packet is saved as artifact but not auto-applied. Low-confidence/stale items flagged. No secrets copied. --compound = context-packet + vault-handoff.
  - All output saved under outputs/coding-agent-runs/<stamp>-slug/ or <stamp>-package-execution-slug/

Closed-loop flow (new):
  goal → implementation-plan.json → generated-implementation-package.{json,md} (safe defaults, approvals=false) → package execution planner (blocks unsafe) → dry-run execution (no writes) → review → only then re-run with --apply on the generated package if desired.

Vault Handoff flow:
  Any run (goal/package/plan/compile) + --vault-handoff → raw artifacts written first (source of truth) → vaultHandoffBuilder reads them → emits vault-handoff/{manifest.json, records.jsonl, summary.md} with vault.v1 records (VaultArtifact + VaultCommand).
  records.jsonl is parser-compatible (generic JSON docs today; future dedicated adapter).
  Raw artifacts + handoff co-exist. No ingestion performed. privacy=local_private. Secrets redacted.
  Backfill allows adding handoff to prior runs without re-running the agent.

Context Packet + Compounding Loop (new):
  Prior: run + --vault-handoff → handoff → (manual) npm run vault:ingest-agent-runs → normalized records in outputs/vault-ingestion-runs/
  Current: run + --context-packet → localVaultContextReader loads/ranks prior normalized (deterministic keyword+type+recency+conf+project match, no LLM), contextPacketBuilder emits context-packet.{md,json} (prior runs/decisions/evidence/commands/rollbacks/next/patterns/risks/what-not/recommendations + uncertainty flags).
  Packet saved to current run dir + referenced in summary/plan. --compound enables both.
  Full loop: run → vault handoff → Vault ingestion (parser) → normalized records → context packet → better-informed future run (still human review + safety gates).
  Advisory only. Sources never mutated. Stale/low-conf flagged. No auto-apply.

Examples:
  npm run agent -- --project "." --goal "inspect this project and recommend the next highest-value improvement" --dry-run
  npm run agent -- --project "." --package "tools/internal/agent-swarm-coder/tests/fixtures/sample-implementation-package.md" --dry-run
  npm run agent -- --project "." --goal "create a harmless demo note file explaining the closed-loop flow" --compile-package --dry-run
  npm run agent -- --project "." --plan "outputs/coding-agent-runs/.../implementation-plan.json" --dry-run
  npm run agent -- --project "." --goal "..." --dry-run --vault-handoff
  npm run agent -- --backfill-vault-handoff "outputs/coding-agent-runs/2026...-slug"
  npm run agent -- --project "." --goal "inspect this project and recommend the next highest-value improvement using prior local Vault context" --dry-run --context-packet --vault-handoff
  npm run agent -- --project "." --goal "..." --dry-run --compound   # enables context-packet + vault-handoff
  npm run agent -- --project "/abs/path" --goal "Add a small utility and update tests" --apply
`);
}

async function main() {
  const opts = parseArgs(process.argv);
  const hasGoal = !!opts.goal;
  const hasPackage = !!opts.packagePath;
  const hasPlan = !!opts.planPath;
  const hasBackfill = !!opts.backfillHandoffPath;
  const hasTask = !!opts.taskPath;

  if (!hasGoal && !hasPackage && !hasPlan && !hasBackfill && !hasTask) {
    console.error('ERROR: either --goal or --package or --plan or --backfill-vault-handoff or --task is required.\n');
    printHelp();
    process.exit(2);
  }

  const absProject = path.resolve(opts.project);
  console.log(`agent-swarm-coder starting`);
  console.log(`  project: ${absProject}`);
  if (hasPackage) {
    console.log(`  package: ${opts.packagePath}`);
  }
  if (hasGoal) {
    console.log(`  goal:    ${opts.goal}`);
  }
  if (hasPlan) {
    console.log(`  plan:    ${opts.planPath}`);
  }
  if (opts.compilePackage) {
    console.log(`  compile-package: true (will generate package + dry-run exec validation)`);
  }
  if (opts.vaultHandoff) {
    console.log(`  vault-handoff: true (will emit vault-handoff/ normalized export in run dir)`);
  }
  if (opts.contextPacket) {
    console.log(`  context-packet: true (will read local Vault ingestion outputs and emit context-packet.{md,json} before planning)`);
  }
  if (hasBackfill) {
    console.log(`  backfill-vault-handoff: ${opts.backfillHandoffPath}`);
  }
  if (hasTask) {
    console.log(`  task:    ${opts.taskPath}`);
  }
  console.log(`  mode:    ${opts.dryRun ? 'DRY-RUN (safe, no writes)' : 'APPLY (writes + backups enabled)'}`);
  if (opts.allowDeletes || opts.allowSecretEdits) {
    console.log(`  extra approvals: ${opts.allowDeletes ? 'deletes ' : ''}${opts.allowSecretEdits ? 'secrets' : ''}`);
  }
  console.log('');

  // Normalize for task mode (used by ai-chat-command-bridge)
  let runProject = opts.project;
  let runGoal = opts.goal;
  let runDryRun = opts.dryRun;
  let runVaultHandoff = opts.vaultHandoff;
  let runContextPacket = opts.contextPacket;
  let runCompilePackage = opts.compilePackage;
  let taskData = null;
  if (hasTask) {
    const taskAbs = path.resolve(opts.taskPath);
    taskData = JSON.parse(fs.readFileSync(taskAbs, 'utf8'));
    if (!taskData.source || taskData.source !== 'ai-chat-command-bridge') {
      console.error('ERROR: task must have "source": "ai-chat-command-bridge"');
      process.exit(1);
    }
    runProject = taskData.project_path || runProject || '.';
    runGoal = taskData.instruction;
    if (taskData.mode === 'apply') {
      runDryRun = false;
    } else if (taskData.mode === 'dry-run') {
      runDryRun = true;
    }
    if (taskData.options) {
      if (typeof taskData.options.vault_handoff === 'boolean') runVaultHandoff = taskData.options.vault_handoff;
      if (typeof taskData.options.context_packet === 'boolean') runContextPacket = taskData.options.context_packet;
      if (typeof taskData.options.compile_package === 'boolean') runCompilePackage = taskData.options.compile_package;
    }
  }

  // Backfill is a special non-run path: read existing run dir, emit handoff only (no agent execution)
  if (hasBackfill) {
    try {
      const absBackfill = path.resolve(opts.backfillHandoffPath);
      console.log(`backfilling vault handoff for: ${absBackfill}`);
      // dynamic import to keep top clean, but since esm in same dir ok to require at top later if needed
      const { createVaultHandoffForRun } = await import('./vaultHandoffBuilder.js');
      const res = createVaultHandoffForRun(absBackfill);
      console.log('=== BACKFILL COMPLETE ===');
      console.log(`handoffDir: ${res.handoffDir}`);
      console.log(`records: ${res.records ? res.records.length : 'n/a'}`);
      console.log(`manifest: ${path.join(res.handoffDir, 'manifest.json')}`);
      process.exit(0);
    } catch (e) {
      console.error('BACKFILL FAILED:', e.message);
      process.exit(1);
    }
  }

  try {
    const result = await runAgent({
      projectPath: runProject,
      goal: runGoal,
      packagePath: opts.packagePath,
      dryRun: runDryRun,
      allowRepairApply: opts.allowRepairApply,
      allowDeletes: opts.allowDeletes,
      allowSecretEdits: opts.allowSecretEdits,
      compilePackage: runCompilePackage,
      planPath: opts.planPath,
      vaultHandoff: runVaultHandoff,
      contextPacket: runContextPacket,
      taskPath: opts.taskPath
    });

    console.log('=== RUN COMPLETE ===');
    console.log(`run_id: ${result.runId}`);
    console.log(`output: ${result.runDir}`);
    console.log(`summary: ${result.summaryPath}`);
    console.log(`dryRun: ${result.dryRun}`);
    console.log(`files changed (recorded): ${result.changed.length}`);
    if (result.repairs && result.repairs.length) {
      console.log(`repairs: ${result.repairs.length}`);
    }
    if (result.packageMode) {
      console.log(`packageMode: true`);
    }
    if (result.compiledPackagePath) {
      console.log(`generatedPackage: ${result.compiledPackagePath}`);
    }
    if (result.packageExecutionRunDir) {
      console.log(`packageExecRun: ${result.packageExecutionRunDir}`);
    }
    if (result.vaultHandoffDir) {
      console.log(`vaultHandoff: ${result.vaultHandoffDir}`);
    }
    if (result.contextPacketPath) {
      console.log(`contextPacket: ${result.contextPacketPath}`);
    }
    if (hasTask && taskData) {
      const taskResult = {
        source: 'agent-swarm-coder',
        task_path: opts.taskPath,
        run_id: result.runId,
        run_dir: result.runDir,
        dryRun: result.dryRun,
        summary_path: result.summaryPath,
        status: result.dryRun ? 'dry-run-complete' : 'applied',
        warnings: [],
        next_action: 'Review the run directory, any context-packet, and the task result. Copy relevant output back to chat if desired.',
        agent_run_path: result.runDir
      };
      console.log('\n---AGENT-TASK-RESULT-JSON-START---');
      console.log(JSON.stringify(taskResult, null, 2));
      console.log('---AGENT-TASK-RESULT-JSON-END---');
      const taskDir = path.dirname(path.resolve(opts.taskPath));
      const resFile = path.join(taskDir, `agent-result-${result.runId}.json`);
      fs.writeFileSync(resFile, JSON.stringify(taskResult, null, 2) + '\n');
      console.log(`task result path: ${resFile}`);
    }
    console.log('\nNext: cat ' + result.summaryPath);
    console.log('Or: ls ' + result.runDir);
  } catch (err) {
    console.error('AGENT FAILED:', err.message);
    if (err.code === 'SAFETY' || (err.name === 'SafetyError')) {
      console.error('Safety violation — this is expected in some dry-run or policy cases. Review execution-plan.json or planner output.');
    }
    if (err.code === 'PACKAGE_PARSE' || err.name === 'PackageParseError') {
      console.error('Package validation failed. Fix the package file and retry.');
      if (err.details && err.details.errors) {
        console.error('Details:', err.details.errors);
      }
    }
    process.exit(1);
  }
}

main();
