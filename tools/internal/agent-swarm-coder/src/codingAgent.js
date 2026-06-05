/**
 * codingAgent.js
 * Core orchestrator for one controlled agent run.
 * Enforces dry-run default, safety, repair, and full package output.
 */

import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { inspectProject } from './projectInspector.js';
import { createImplementationPlan } from './taskPlanner.js';
import { FileOps } from './fileOps.js';
import { runCommand } from './commandRunner.js';
import { runWithRepair } from './repairLoop.js';
import { makeRunDir, makePackageExecutionDir, writeRunPackage, writePackageExecutionPackage, writeJson } from './outputWriter.js';
import { generateRollbackPlan } from './rollbackPlanner.js';
import { createEvidenceRecord } from './evidenceLogger.js';
import { assertDryRunAllows, assertCommandSafe, assertCommandSafeForPackage, assertEditSafe, assertDeleteAllowed, SafetyError } from './safetyGuard.js';
import { getProvider } from './providerRegistry.js';
import { parsePackageFile } from './packageParser.js';
import { planPackageExecution } from './packageExecutionPlanner.js';
import { compilePlanToPackage, renderPlanAsPackageMarkdown } from './planToPackageCompiler.js';
import { createVaultHandoffForRun } from './vaultHandoffBuilder.js';
import { readContextRecords } from './localVaultContextReader.js';
import { writeContextPacket } from './contextPacketBuilder.js';

export async function runAgent({ 
  projectPath = '.', 
  goal, 
  packagePath = null, 
  dryRun = true, 
  allowRepairApply = false, 
  preApprovedRepairPatch = null,
  allowDeletes = false,
  allowSecretEdits = false,
  compilePackage = false,
  planPath = null,
  vaultHandoff = false,
  contextPacket = false,
  taskPath = null
}) {
  const startedAt = new Date().toISOString();
  const provider = getProvider('simulated');
  const isPackageMode = !!packagePath;
  const isPlanImportMode = !!planPath;

  if (!isPackageMode && !isPlanImportMode && (!goal || typeof goal !== 'string' || goal.trim().length < 3)) {
    throw new Error('Either --goal or --package or --plan is required.');
  }
  if (isPackageMode && goal) {
    // allow but prefer package
  }

  // 1. Inspect (always)
  const inspection = inspectProject(projectPath);

  const outputsBase = 'outputs/coding-agent-runs';
  let runDir, runId, planForLegacy, executionPlan, parsedPkg, packageRef;
  let compiledForGoal = null;
  let goalRunDirForCompile = null;
  let contextPacketPath = null;

  const fileOps = new FileOps(projectPath, dryRun);
  const commandResults = [];
  const repairs = [];
  let decisionLog = [];
  let usedSummaryFile = 'run-summary.md';

  if (isPackageMode) {
    // === PACKAGE EXECUTION MODE ===
    packageRef = packagePath;
    const parseRes = parsePackageFile(packagePath, projectPath);
    parsedPkg = parseRes;
    executionPlan = planPackageExecution(parseRes, projectPath, {
      allowDeletes,
      allowSecretEdits,
      applyMode: !dryRun
    });

    const dirInfo = makePackageExecutionDir(outputsBase, packageRef);
    runDir = dirInfo.runDir;
    runId = dirInfo.runId;

    if (contextPacket) {
      try {
        const ctxGoal = executionPlan.objective || packageRef || 'package execution';
        const ctxRes = readContextRecords(ctxGoal, inspection);
        const wp = writeContextPacket(runDir, ctxGoal, ctxRes, inspection);
        contextPacketPath = wp.mdPath || wp.jsonPath;
        decisionLog.push(`context-packet (package mode): from ${ctxRes.loadedCount} records`);
      } catch (e) { decisionLog.push(`context-packet error: ${e.message}`); }
    }

    decisionLog = [
      `run_id: ${runId}`,
      `package: ${packageRef}`,
      `dryRun: ${dryRun}`,
      `provider: simulated`,
      `started: ${startedAt}`,
      `objective: ${executionPlan.objective}`
    ];

    // Log safety from planner
    if (executionPlan.safety?.warnings?.length) {
      decisionLog.push(...executionPlan.safety.warnings.map(w => `warning: ${w}`));
    }
    if (executionPlan.safety?.blockedActions?.length) {
      decisionLog.push(...executionPlan.safety.blockedActions.map(b => `blocked: ${b}`));
    }

    // Pre cmd (git status)
    try {
      const git = runCommand('git status --short', projectPath);
      commandResults.push(git);
    } catch (e) { /* ignore */ }

    // Hard gate: never apply package file ops when the planner marked apply unsafe.
    if (!dryRun && executionPlan.safety?.applyAllowed === false) {
      throw new Error(
        `Package apply blocked by execution planner: ${(executionPlan.safety.blockedActions || []).join(', ')}`
      );
    }

    // Execute file ops from plan (scoped, with safety)
    for (const fop of executionPlan.fileOps || []) {
      try {
        if (dryRun) {
          assertDryRunAllows(fop.action === 'delete' ? 'delete' : 'write', dryRun);
          fileOps.write(fop.path, fop.content || fop.replace || '(dry-run placeholder for ' + fop.action + ')', { createIfMissing: true }); // records intent only
          // For patch, simulate record
          if (fop.search && fop.replace) {
            // note: fileOps.patch would also just record in dry
          }
          decisionLog.push(`dry file intent: ${fop.action} ${fop.path}`);
          continue;
        }

        // APPLY path - extra gates
        if (fop.action === 'delete') {
          assertDeleteAllowed(allowDeletes || parsedPkg.package?.approvals?.deletes);
        } else {
          assertEditSafe(projectPath, fop.path, { allowSecretEdits });
        }
        assertDryRunAllows('write', false); // will not throw since !dry

        if (fop.action === 'create' || fop.action === 'write' || fop.action === 'modify') {
          const hasContent = typeof fop.content === 'string' && fop.content.length > 0;
          const hasReplace = typeof fop.replace === 'string' && fop.replace.length > 0;
          if (!hasContent && !hasReplace) {
            throw new Error(`No executable payload for ${fop.action} ${fop.path}`);
          }
          const content = hasContent ? fop.content : fop.replace;
          fileOps.write(fop.path, content, { createIfMissing: true });
          decisionLog.push(`applied: write ${fop.path}`);
        } else if (fop.action === 'patch') {
          if (fop.search && fop.replace) {
            fileOps.patch(fop.path, fop.search, fop.replace);
            decisionLog.push(`applied: patch ${fop.path}`);
          } else if (fop.content) {
            fileOps.write(fop.path, fop.content);
            decisionLog.push(`applied: overwrite ${fop.path} (from patch content)`);
          }
        }
      } catch (err) {
        decisionLog.push(`file op error ${fop.path}: ${err.message}`);
        // continue for other ops; record failure in results conceptually
      }
    }

    const changed = fileOps.listChanged();

    // Run commands from the package plan (use runCommand + safety)
    const cmdsToRun = (executionPlan.commands || []).map(c => c.command).concat(executionPlan.testCommands || []).slice(0, 5);
    for (const cmd of cmdsToRun) {
      try {
        assertCommandSafeForPackage(cmd, { dryRun, allowExternal: allowSecretEdits /* reuse flag for external */ });
        const res = runCommand(cmd, projectPath);
        commandResults.push(res);
        decisionLog.push(`ran cmd: ${cmd} -> ${res.exitCode}`);
      } catch (err) {
        const errRes = { command: cmd, exitCode: 1, stdout: '', stderr: String(err.message || err), durationMs: 0, timestamp: new Date().toISOString(), success: false };
        commandResults.push(errRes);
        decisionLog.push(`cmd blocked/failed: ${cmd} - ${err.message}`);
      }
    }

    const rollback = generateRollbackPlan(changed, projectPath);
    const outcome = dryRun ? 'dry-run' : (repairs.length ? 'repaired' : 'applied');

    const evidence = createEvidenceRecord({
      runId, goal: executionPlan.objective, inspection, plan: executionPlan, 
      changedFiles: changed, commandResults, outcome, startedAt
    });

    const qa = executionPlan.qaChecklist || [];
    const nextA = executionPlan.nextAction || [];

    const finishedAt = new Date().toISOString();
    decisionLog.push(`finished: ${finishedAt}`);

    const packageDir = writePackageExecutionPackage(runDir, {
      runId,
      packageRef,
      dryRun,
      parsedPackage: parsedPkg.package,
      executionPlan,
      commandResults,
      changed,
      repairs,
      evidence,
      qaChecklist: qa,
      decisionLog,
      nextAction: nextA,
      rollback,
      startedAt,
      finishedAt,
      contextPacketPath
    });

    usedSummaryFile = 'package-execution-summary.md';

    if (vaultHandoff) {
      try {
        const hres = createVaultHandoffForRun(packageDir);
        // attach for cli reporting (non-fatal if fails)
        // note: we return packageDir as runDir
        var _handoffDir = hres.handoffDir;
      } catch (e) { /* do not break run on handoff */ }
    }

    return {
      runId,
      runDir: packageDir,
      dryRun,
      plan: executionPlan,
      changed,
      commandResults,
      repairs,
      evidence,
      summaryPath: path.join(packageDir, usedSummaryFile),
      packageMode: true,
      vaultHandoffDir: (typeof _handoffDir !== 'undefined' ? _handoffDir : undefined),
      contextPacketPath
    };
  }

  // === PLAN IMPORT MODE or LEGACY GOAL MODE ===
  // For --plan we load the plan but skip writing a goal-style run package; we compile + exec package.
  let plan;
  if (isPlanImportMode) {
    const absPlan = path.resolve(planPath);
    if (!fs.existsSync(absPlan)) {
      throw new Error(`Plan file not found for --plan: ${planPath}`);
    }
    plan = JSON.parse(fs.readFileSync(absPlan, 'utf8'));
    planForLegacy = plan;
  } else {
    // === LEGACY GOAL MODE (unchanged behavior) ===
    plan = createImplementationPlan(goal, inspection, { projectPath });
    planForLegacy = plan;
  }

  if (!isPlanImportMode) {
    const dirInfo = makeRunDir(outputsBase, (goal || plan.objective || 'plan'));
    runDir = dirInfo.runDir;
    runId = dirInfo.runId;

    // === CONTEXT PACKET (if requested): read prior Vault normalized outputs, rank for goal, write packet artifact early
    if (contextPacket && goal) {
      try {
        const ctxRes = readContextRecords(goal, inspection);
        const wp = writeContextPacket(runDir, goal, ctxRes, inspection);
        contextPacketPath = wp.mdPath || wp.jsonPath;
        decisionLog.push(`context-packet: generated from ${ctxRes.loadedCount} loaded Vault records, selected ${ctxRes.selectedCount}`);
        if (ctxRes.warnings && ctxRes.warnings.length) decisionLog.push(...ctxRes.warnings.map(w => `context warning: ${w}`));
      } catch (e) {
        decisionLog.push(`context-packet error (non-fatal): ${e.message}`);
      }
    }

    decisionLog = [
      `run_id: ${runId}`,
      `goal: ${goal}`,
      `dryRun: ${dryRun}`,
      `provider: simulated`,
      `started: ${startedAt}`
    ];

    try {
      const git = runCommand('git status --short', projectPath);
      commandResults.push(git);
    } catch (e) { /* ignore */ }

    const cmdsToRun = plan.testCommands.slice(0, 3);
    for (const cmd of cmdsToRun) {
      try {
        assertCommandSafe(cmd, dryRun);
        const res = await runWithRepair(cmd, projectPath, fileOps, dryRun, {
          allowRepairApply,
          preApprovedRepairPatch,
          provider
        });
        commandResults.push(res.finalResult);
        if (res.repairs && res.repairs.length) {
          for (const rec of res.allResults) {
            if (rec && rec.repairPrompt) repairs.push(rec);
          }
        }
        decisionLog.push(`ran: ${cmd} -> exit=${res.finalResult.exitCode} repairs=${res.repairAttempts}`);
      } catch (err) {
        const errRes = {
          command: cmd,
          exitCode: 1,
          stdout: '',
          stderr: err.message || String(err),
          durationMs: 0,
          timestamp: new Date().toISOString(),
          success: false
        };
        commandResults.push(errRes);
        decisionLog.push(`command blocked or failed: ${cmd} - ${err.message}`);
      }
    }

    const changed = fileOps.listChanged();
    const rollback = generateRollbackPlan(changed, projectPath);
    const outcome = dryRun ? 'dry-run' : (repairs.length > 0 ? 'repaired' : 'applied');
    const evidence = createEvidenceRecord({
      runId,
      goal,
      inspection,
      plan,
      changedFiles: changed,
      commandResults,
      outcome,
      startedAt
    });

    const qaChecklist = [
      '- [ ] Read run-summary.md and implementation-plan.md',
      '- [ ] Check command-results.json for unexpected failures (even in dry-run)',
      dryRun ? '- [ ] Re-run with --apply ONLY after reviewing plan and confirming no secrets in scope' : '- [ ] Verify the actual file changes with git diff or editor',
      '- [ ] If repair-prompt.md exists, review before using any real LLM provider',
      '- [ ] Consider feeding evidence-record.json to vault-ingestion-parser in a future phase'
    ];

    const nextAction = [
      'Review the package directory.',
      dryRun ? 'If plan looks good, re-run the same command with --apply (after backing up or committing).' : 'Commit or review the changes made.',
      'Extend providerRegistry.js with a real adapter (see docs/PROVIDER_ADAPTERS.md).',
      'Use this agent to implement improvements on this (or other) local projects.'
    ];

    const finishedAt = new Date().toISOString();
    decisionLog.push(`finished: ${finishedAt}`);

    const packageDir = writeRunPackage(runDir, {
      runId,
      goal,
      dryRun,
      inspection,
      plan,
      commandResults,
      changed,
      repairs,
      evidence,
      qaChecklist,
      decisionLog,
      nextAction,
      rollback,
      startedAt,
      finishedAt,
      contextPacketPath
    });

    goalRunDirForCompile = packageDir;

    // === COMPILE-PACKAGE for goal mode: after normal goal save, compile plan to package, save generated files, feed to dry package exec ===
    if (compilePackage && plan) {
      const compiled = compilePlanToPackage(plan, { projectPath, sourcePlan: path.join(packageDir, 'implementation-plan.json') });
      compiledForGoal = compiled;

      const genJsonPath = path.join(packageDir, 'generated-implementation-package.json');
      writeJson(genJsonPath, compiled);

      const genMdContent = renderPlanAsPackageMarkdown(compiled, plan);
      const genMdPath = path.join(packageDir, 'generated-implementation-package.md');
      fs.writeFileSync(genMdPath, genMdContent, 'utf8');

      // Immediately feed generated package into package execution pipeline in *dry-run* (safety: validate the loop without writes)
      const innerDry = true;
      const pkgExecRes = await runAgent({
        projectPath,
        packagePath: genJsonPath,
        dryRun: innerDry,
        allowDeletes: false,
        allowSecretEdits: false
        // do not pass compilePackage to avoid re-entry
      });

      const execPathFile = path.join(packageDir, 'package-execution-output-path.txt');
      fs.writeFileSync(execPathFile, pkgExecRes.runDir + '\n');

      // attach to outer result (returned below)
      // We will override the return object for compile case after this block
    }

    if (vaultHandoff) {
      try {
        const hres = createVaultHandoffForRun(packageDir);
        var _handoffDirGoal = hres.handoffDir;
      } catch (e) { /* non-fatal */ }
    }

    return {
      runId,
      runDir: packageDir,
      dryRun,
      plan,
      changed,
      commandResults,
      repairs,
      evidence,
      summaryPath: path.join(packageDir, 'run-summary.md'),
      compiledPackagePath: compiledForGoal ? path.join(packageDir, 'generated-implementation-package.json') : undefined,
      packageExecutionRunDir: compiledForGoal ? (fs.existsSync(path.join(packageDir, 'package-execution-output-path.txt')) ? fs.readFileSync(path.join(packageDir, 'package-execution-output-path.txt'), 'utf8').trim() : undefined) : undefined,
      vaultHandoffDir: (typeof _handoffDirGoal !== 'undefined' ? _handoffDirGoal : undefined),
      contextPacketPath
    };
  }

  // === PURE PLAN IMPORT MODE: load plan (already done), compile, exec via package pipeline in dry-run, save package-exec outputs ===
  if (isPlanImportMode && plan) {
    const compiled = compilePlanToPackage(plan, { projectPath, sourcePlan: planPath });

    // Write a generated json in /tmp so we can feed it as --package (keeps parser path, no pollution of plan source dir)
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-genpkg-plan-'));
    const tmpGenJson = path.join(tmpDir, 'generated-implementation-package.json');
    writeJson(tmpGenJson, compiled);

    const pkgExecRes = await runAgent({
      projectPath,
      packagePath: tmpGenJson,
      dryRun: true,
      allowDeletes: false,
      allowSecretEdits: false,
      vaultHandoff: !!vaultHandoff
    });

    // Also drop a copy of the compiled into the exec run dir for traceability
    try {
      const dest = path.join(pkgExecRes.runDir, 'generated-implementation-package.json');
      writeJson(dest, compiled);
      const destMd = path.join(pkgExecRes.runDir, 'generated-implementation-package.md');
      fs.writeFileSync(destMd, renderPlanAsPackageMarkdown(compiled, plan), 'utf8');
    } catch (e) { /* non fatal */ }

    return {
      runId: pkgExecRes.runId,
      runDir: pkgExecRes.runDir,
      dryRun: true,
      plan: pkgExecRes.plan,
      changed: pkgExecRes.changed || [],
      commandResults: pkgExecRes.commandResults || [],
      repairs: pkgExecRes.repairs || [],
      evidence: pkgExecRes.evidence,
      summaryPath: pkgExecRes.summaryPath,
      packageMode: true,
      planImportMode: true,
      compiledPackagePath: path.join(pkgExecRes.runDir, 'generated-implementation-package.json'),
      packageExecutionRunDir: pkgExecRes.runDir
    };
  }

  // Fallback (should not reach)
  throw new Error('No execution path taken in runAgent');
}

export default {
  runAgent
};
