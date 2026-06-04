/**
 * taskPlanner.js
 * Deterministic task planning from goal + project inspection.
 * No LLM calls in MVP (simulated provider can be swapped for enrichment later).
 */

import { inspectProject } from './projectInspector.js';
import fs from 'node:fs';
import path from 'node:path';

export function createImplementationPlan(goal, projectInspection, options = {}) {
  const insp = projectInspection || inspectProject(options.projectPath || '.');
  const pkgScripts = insp.scripts || {};
  const hasTests = !!pkgScripts.test || !!pkgScripts['test:unit'];
  const hasBuild = !!pkgScripts.build || !!pkgScripts.compile;
  const hasLint = !!pkgScripts.lint || !!pkgScripts['lint:fix'];

  const objective = goal.trim().slice(0, 280);

  const assumptions = [
    'Project is local and fully accessible on disk.',
    'package.json (if present) accurately reflects runnable scripts.',
    'User will review the plan before any file modification.',
    'No external API keys or credentials will be used or stored.',
    'All operations remain inside the provided project root.'
  ];

  const constraints = [
    'Local-first only. No network calls in core loop.',
    'Dry-run by default; writes require explicit --apply.',
    'Never operate on node_modules, .git, dist, build, .next, coverage.',
    'Redact all secrets from .env* and obvious credential strings.',
    'No file deletion unless explicitly approved in a future phase.',
    'Provider is simulated until real adapter is configured and approved.'
  ];

  // Heuristic: files likely to modify based on goal keywords + common locations
  const goalLower = goal.toLowerCase();
  const likely = new Set();
  if (insp.hasPackageJson) likely.add('package.json');
  if (goalLower.includes('readme') || goalLower.includes('document')) likely.add('README.md');
  if (goalLower.includes('test') || goalLower.includes('spec')) {
    if (fsExistsSafe(insp.projectRoot, 'tests')) likely.add('tests/');
    else likely.add('src/');
  }
  if (goalLower.includes('cli') || goalLower.includes('command')) likely.add('src/cli.js');
  if (goalLower.includes('src') || goalLower.includes('core')) likely.add('src/');
  if (goalLower.includes('style') || goalLower.includes('css')) likely.add('src/styles.css');
  if (goalLower.includes('agent') || goalLower.includes('swarm')) {
    likely.add('src/codingAgent.js');
  }
  // Always consider agent files for self-improvement goals
  if (goalLower.includes('improv') || goalLower.includes('next') || goalLower.includes('highest')) {
    likely.add('tools/internal/agent-swarm-coder/src/');
  }
  if (likely.size === 0) {
    likely.add('src/');
    if (insp.hasPackageJson) likely.add('package.json');
  }
  const filesLikelyToModify = Array.from(likely).slice(0, 12);

  const implementationSteps = buildSteps(goal, insp, pkgScripts, filesLikelyToModify);

  const riskChecklist = [
    'Changes may break existing scripts or static site serving.',
    'Backup will be created before every write; verify restore path.',
    'If tests do not exist, "npm test" may fail legitimately.',
    'Simulated provider may propose naive fixes; human review required.',
    'Goal interpretation is heuristic; clarify ambiguous requests.'
  ];

  const testCommands = [];
  if (hasTests) testCommands.push(pkgScripts.test || 'npm test');
  else testCommands.push('npm test  # (may not exist yet - expected in dry-run)');
  if (hasBuild) testCommands.push(pkgScripts.build);
  if (hasLint) testCommands.push(pkgScripts.lint);
  if (testCommands.length === 0) testCommands.push('npm test', 'npm run build  # if applicable');

  const rollbackPlan = {
    strategy: 'Restore from timestamped .bak files created next to modified originals. Use git checkout if clean repo.',
    backupLocations: filesLikelyToModify.map(f => `${f}.bak-<timestamp>`),
    restoreCommands: [
      '# Example restore (adjust timestamp):',
      'cp src/example.js.bak-20260603120000 src/example.js',
      'git checkout -- src/example.js  # if previously committed and clean'
    ]
  };

  const plan = {
    objective,
    assumptions,
    constraints,
    filesLikelyToModify,
    implementationSteps,
    riskChecklist,
    testCommands: testCommands.filter(Boolean),
    rollbackPlan
  };

  return plan;
}

function fsExistsSafe(root, rel) {
  try {
    return fs.existsSync(path.join(root, rel));
  } catch { return false; }
}

function buildSteps(goal, insp, scripts, likelyFiles) {
  const steps = [];
  let step = 1;
  steps.push({ step: step++, action: 'Inspect project and capture package scripts + file inventory', files: [], notes: 'Always first.' });
  steps.push({ step: step++, action: `Interpret goal: "${goal.slice(0,80)}..." and produce structured plan`, files: ['implementation-plan.json'] });

  if (likelyFiles.some(f => f.includes('src/') || f.endsWith('.js'))) {
    steps.push({ step: step++, action: 'Read relevant source files for context (read-only in dry-run)', files: likelyFiles.filter(f => f.endsWith('.js') || f.includes('src')) });
  }
  steps.push({ step: step++, action: 'Propose concrete file changes (patch or write) only after plan approval', files: likelyFiles });
  steps.push({ step: step++, action: 'Create backups for every file before modification', files: likelyFiles });
  if (scripts.test || scripts['test:unit']) {
    steps.push({ step: step++, action: 'Run test command(s) and capture full results', files: [], notes: scripts.test || 'npm test' });
  } else {
    steps.push({ step: step++, action: 'Run configured test/build/lint (or note absence)', files: [] });
  }
  steps.push({ step: step++, action: 'If failures: enter repair loop (summarize, plan fix, optionally apply scoped change, re-run)', files: [] });
  steps.push({ step: step++, action: 'Write full durable output package under outputs/coding-agent-runs/<stamp>-<slug>/', files: ['run-summary.md', 'implementation-plan.*', 'command-results.json', 'evidence-record.json'] });
  steps.push({ step: step++, action: 'Produce next-action.md and decision-log.md for human follow-up', files: [] });

  return steps;
}

export function generateRepairPrompt(failure) {
  // Returns a prompt template (for future real provider) + deterministic suggestion for simulated
  const { command, stderr, stdout, exitCode } = failure;
  return {
    prompt: `You are a careful coding agent. The following command failed:\n\nCommand: ${command}\nExit: ${exitCode}\n\nSTDOUT (redacted):\n${(stdout || '').slice(0,2000)}\n\nSTDERR:\n${(stderr || '').slice(0,2000)}\n\nProvide:\n1. Root cause (one sentence)\n2. Likely file(s) involved\n3. Minimal exact patch or edit to repair\n4. How to verify after fix\nRespond in JSON only: { "cause": "...", "files": [...], "patch": { "path": "...", "diff": "..." }, "verify": "..." }`,
    simulatedFixHint: deriveSimulatedFix(command, stderr, stdout)
  };
}

function deriveSimulatedFix(command, stderr = '', stdout = '') {
  const lower = (stderr + ' ' + stdout).toLowerCase();
  if (lower.includes('cannot find module') || lower.includes('module not found')) {
    return { type: 'missing-dep', suggestion: 'Check import path or run npm install (but do not auto in MVP)' };
  }
  if (lower.includes('syntaxerror') || lower.includes('unexpected token')) {
    return { type: 'syntax', suggestion: 'Fix syntax near the reported line; simulated agent will avoid writing broken JS.' };
  }
  if (command.includes('test') && lower.includes('assert')) {
    return { type: 'test-expectation', suggestion: 'Update test assertion or implementation to match current behavior (review diff carefully).' };
  }
  if (lower.includes('command not found') || lower.includes('is not recognized')) {
    return { type: 'env', suggestion: 'Ensure the script exists in package.json or PATH includes required bin.' };
  }
  return { type: 'unknown', suggestion: 'Inspect the error, read the file, propose minimal targeted change.' };
}

export default {
  createImplementationPlan,
  generateRepairPrompt
};
