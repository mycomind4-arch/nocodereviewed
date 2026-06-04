/**
 * repairLoop.js
 * Controlled repair when tests/builds fail.
 * Summarizes, uses provider for diagnosis, may apply one scoped deterministic or prompted fix.
 * Never loops unbounded.
 */

import { generateRepairPrompt } from './taskPlanner.js';
import { getProvider } from './providerRegistry.js';
import { FileOps } from './fileOps.js';
import { runCommand } from './commandRunner.js';

const MAX_REPAIR_ATTEMPTS = 2;

export async function runWithRepair(command, cwd, fileOps, dryRun, options = {}) {
  const provider = options.provider || getProvider('simulated');
  const results = [];
  let lastResult = runCommand(command, cwd);
  results.push(lastResult);

  let attempts = 0;
  while (!lastResult.success && attempts < MAX_REPAIR_ATTEMPTS) {
    attempts++;
    const failure = lastResult;
    const summary = summarizeFailure(failure);
    const repairPromptInfo = generateRepairPrompt(failure);
    const providerDiag = await provider.suggestRepair(failure, {});

    const repairRecord = {
      attempt: attempts,
      command,
      summary,
      providerDiagnosis: providerDiag,
      repairPrompt: repairPromptInfo.prompt,
      simulatedHint: repairPromptInfo.simulatedFixHint,
      fixApplied: null,
      reRunResult: null
    };

    // Decide whether to attempt a scoped auto-fix (very limited in MVP)
    const canTryFix = !dryRun && options.allowRepairApply === true && providerDiag.canAutoApply === false; // simulated returns false
    // For MVP we keep canAutoApply=false; real providers later may return true for trivial cases with gate.
    // Instead, we always surface the prompt and a conservative patch opportunity via fileOps if user pre-approved a narrow scope.

    if (options.preApprovedRepairPatch && !dryRun) {
      // Example: { file: 'src/foo.js', search: 'old', replace: 'new' }
      try {
        const p = options.preApprovedRepairPatch;
        const patchRes = fileOps.patch(p.file, p.search, p.replace);
        repairRecord.fixApplied = { type: 'pre-approved-patch', ...patchRes };
        lastResult = runCommand(command, cwd);
        repairRecord.reRunResult = lastResult;
        results.push(lastResult);
      } catch (e) {
        repairRecord.fixApplied = { error: e.message };
      }
    } else {
      // No auto fix; just record the generated prompt for human / future agent use
      repairRecord.fixApplied = { type: 'prompt-only', note: 'Copy repair-prompt.md into real provider or apply manually.' };
    }

    results.push(repairRecord); // embed in commandResults for now; caller will persist
    if (lastResult.success) break;
  }

  return { finalResult: lastResult, allResults: results, repairAttempts: attempts };
}

function summarizeFailure(result) {
  const head = (result.stderr || result.stdout || '').split('\n').slice(0, 6).join('\n');
  return {
    command: result.command,
    exitCode: result.exitCode,
    durationMs: result.durationMs,
    errorHead: head.slice(0, 600),
    likelyFiles: extractLikelyFiles(result.stderr + ' ' + result.stdout)
  };
}

function extractLikelyFiles(text) {
  const matches = [...(text || '').matchAll(/([A-Za-z0-9_./-]+\.(js|mjs|ts|tsx|json|html|css|md))/g)];
  return Array.from(new Set(matches.map(m => m[1]))).slice(0, 5);
}

export default {
  runWithRepair,
  MAX_REPAIR_ATTEMPTS
};
