/**
 * packageExecutionPlanner.js
 * Converts a validated parsed implementation package into an executable plan.
 * Performs safety analysis: warnings, blocked actions, required approvals.
 * Produces file operation plan + command plan + step list.
 * Deterministic (no LLM).
 */

import path from 'node:path';
import { isIgnoredPath, isEnvFile, isDestructiveCommand, assertNotIgnored } from './safetyGuard.js';

export function planPackageExecution(parsedPackage, projectRoot, opts = {}) {
  const pkg = parsedPackage.package || parsedPackage; // support raw or wrapped
  const warnings = [];
  const blocked = [];
  const requiresApproval = [];

  const fileOpsPlan = [];
  const commandPlan = [];
  const steps = [];

  const root = path.resolve(projectRoot || '.');

  // Analyze files
  for (const f of (pkg.files || [])) {
    const rel = f.path;
    let abs;
    try {
      abs = assertNotIgnored(root, path.join(root, rel)); // will throw if outside or ignored
    } catch (e) {
      blocked.push(`file:${rel} - ${e.message}`);
      warnings.push(`Blocked file op on ignored/outside path: ${rel}`);
      continue;
    }

    const action = (f.action || 'modify').toLowerCase();
    const isDelete = action === 'delete';
    const isSecretTarget = isEnvFile(rel) || /secret|credential|key|token|private|auth/i.test(rel);

    const op = {
      path: rel,
      absPath: abs,
      action,
      description: f.description || '',
      hasContent: !!(f.content || f.search || f.replace),
      isSecretTarget,
      isDelete
    };

    if (isDelete) {
      if (!opts.allowDeletes && !pkg.approvals?.deletes && !f.approved) {
        blocked.push(`delete:${rel}`);
        requiresApproval.push(`delete:${rel}`);
        warnings.push(`Delete blocked (no --allow-deletes or package approval): ${rel}`);
        continue;
      }
    }

    if (isSecretTarget) {
      if (!opts.allowSecretEdits && !pkg.approvals?.secretEdits && !f.approved) {
        blocked.push(`secret:${rel}`);
        requiresApproval.push(`secret-edit:${rel}`);
        warnings.push(`Secret/credential file edit blocked: ${rel}`);
        continue;
      }
    }

    if (!op.hasContent && (action === 'create' || action === 'modify' || action === 'patch')) {
      warnings.push(`File ${rel} has no content/search provided in package; will be manual or no-op in apply`);
    }

    fileOpsPlan.push(op);
    steps.push({
      id: `file-${steps.length}`,
      type: 'file',
      action,
      target: rel,
      desc: `${action.toUpperCase()} ${rel}${f.description ? ' — ' + f.description : ''}`,
      safety: {
        warnings: isSecretTarget ? ['targets secret-like file'] : [],
        blocked: false,
        requiresApproval: isDelete || isSecretTarget
      }
    });
  }

  // Analyze commands
  const allCmds = [...(pkg.commands || []), ...(pkg.testCommands || [])];
  for (const cmd of allCmds) {
    const cmdStr = String(cmd);
    const destructive = isDestructiveCommand(cmdStr);
    const isExternal = /deploy|vercel|netlify|supabase|aws|firebase|publish|login|auth|account|create.*user/i.test(cmdStr);
    const isGitMutate = /git\s+(commit|push|merge|tag|reset)/i.test(cmdStr);

    const cplan = {
      command: cmdStr,
      isDestructive: destructive,
      isExternal,
      isGitMutate,
      safeForDry: true
    };

    if (destructive || isExternal) {
      blocked.push(`cmd:${cmdStr}`);
      warnings.push(`Blocked potentially destructive/external command: ${cmdStr}`);
      continue;
    }

    if (isGitMutate) {
      warnings.push(`Git mutating command will be blocked in dry-run: ${cmdStr}`);
    }

    commandPlan.push(cplan);
    steps.push({
      id: `cmd-${steps.length}`,
      type: 'command',
      action: 'run',
      target: cmdStr,
      desc: `RUN: ${cmdStr}`,
      safety: {
        warnings: isGitMutate ? ['git mutate'] : [],
        blocked: false,
        requiresApproval: isGitMutate
      }
    });
  }

  // General safety
  if ((pkg.files || []).some(f => f.action === 'delete')) {
    warnings.push('Package declares delete operations — require explicit approval even with --apply');
  }

  const executionPlan = {
    objective: pkg.objective,
    sourcePackage: pkg,
    fileOps: fileOpsPlan,
    commands: commandPlan,
    steps,
    safety: {
      warnings,
      blockedActions: blocked,
      requiresApproval,
      dryRunDefault: true,
      applyAllowed: !blocked.length || opts.forceApply === true
    },
    testCommands: pkg.testCommands || [],
    rollbackNotes: pkg.rollbackNotes || 'Backups created by FileOps before any write. See .bak files and rollback-plan.md',
    qaChecklist: pkg.qaChecklist || [],
    riskChecklist: pkg.riskChecklist || [],
    nextAction: pkg.nextAction || []
  };

  return executionPlan;
}

export default {
  planPackageExecution
};
