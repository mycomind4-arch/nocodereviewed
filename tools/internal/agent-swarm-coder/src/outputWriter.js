/**
 * outputWriter.js
 * Writes the complete durable implementation package for every run.
 * Always produces the full set of artifacts listed in the spec.
 */

import fs from 'node:fs';
import path from 'node:path';
import { redactSecrets } from './safetyGuard.js';

export function slugify(s) {
  const base = (s || '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
  return base || 'goal';
}

export function makeRunDir(outputsBase, goal) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 13) + 
                String(new Date().getMinutes()).padStart(2, '0') +
                String(new Date().getSeconds()).padStart(2, '0');
  const slug = slugify(goal);
  const dirName = `${stamp}-${slug}`;
  const full = path.join(outputsBase, dirName);
  fs.mkdirSync(full, { recursive: true });
  return { runDir: full, runId: dirName, stamp };
}

export function makePackageExecutionDir(outputsBase, packageRef) {
  // Format per spec: YYYYMMDDTHHMMSS-package-execution-slug
  const now = new Date();
  const iso = now.toISOString(); // e.g. 2026-06-04T22:15:00.123Z
  const stamp = iso.replace(/[-:]/g, '').slice(0, 13) + 
                String(now.getMinutes()).padStart(2, '0') +
                String(now.getSeconds()).padStart(2, '0'); // e.g. 20260604T221500
  const slug = 'package-execution-' + slugify(packageRef || 'pkg');
  const dirName = `${stamp}-${slug}`;
  const full = path.join(outputsBase, dirName);
  fs.mkdirSync(full, { recursive: true });
  return { runDir: full, runId: dirName, stamp };
}

export function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

export function writeMd(filePath, title, body) {
  const content = `# ${title}\n\n${body}\n`;
  fs.writeFileSync(filePath, content, 'utf8');
}

export function writeRunPackage(runDir, payload) {
  // payload: { runId, goal, dryRun, inspection, plan, commandResults, changed, repairs, evidence, qa, decisionLog, nextAction, rollback, startedAt, finishedAt }
  const {
    runId, goal, dryRun, inspection, plan, commandResults = [], changed = [],
    repairs = [], evidence, qaChecklist, decisionLog, nextAction, rollback, startedAt, finishedAt
  } = payload;

  // implementation-plan.json
  writeJson(path.join(runDir, 'implementation-plan.json'), plan);

  // implementation-plan.md
  const planMd = [
    `**Objective**: ${plan.objective}`,
    '',
    '## Assumptions',
    plan.assumptions.map(a => `- ${a}`).join('\n'),
    '',
    '## Constraints',
    plan.constraints.map(c => `- ${c}`).join('\n'),
    '',
    '## Files Likely to Modify',
    plan.filesLikelyToModify.map(f => `- ${f}`).join('\n'),
    '',
    '## Implementation Steps',
    plan.implementationSteps.map(s => `${s.step}. ${s.action}${s.files?.length ? ' (' + s.files.join(', ') + ')' : ''}${s.notes ? ' — ' + s.notes : ''}`).join('\n'),
    '',
    '## Risk Checklist',
    plan.riskChecklist.map(r => `- [ ] ${r}`).join('\n'),
    '',
    '## Test Commands',
    plan.testCommands.map(t => `- \`${t}\``).join('\n'),
    '',
    '## Rollback Plan',
    `Strategy: ${plan.rollbackPlan.strategy}`,
    '',
    'Backups:',
    plan.rollbackPlan.backupLocations.map(b => `- ${b}`).join('\n')
  ];
  if (fs.existsSync(path.join(runDir, 'context-packet.md'))) {
    planMd.push('', '## Context Packet from Prior Local Vault Memory (advisory only)');
    planMd.push('See context-packet.md (and .json) for relevant prior decisions, evidence, commands, rollbacks, next-actions, patterns, risks, and recommendations ranked for this goal.');
    planMd.push('Records loaded from outputs/vault-ingestion-runs/ normalized outputs. Review for staleness/low confidence before use. Not auto-applied.');
  }
  writeMd(path.join(runDir, 'implementation-plan.md'), 'Implementation Plan', planMd.join('\n'));

  // file-change-plan.json (derived)
  writeJson(path.join(runDir, 'file-change-plan.json'), {
    planned: plan.filesLikelyToModify,
    actuallyChanged: changed.map(c => c.path || c),
    dryRun
  });

  // changed-files.json
  writeJson(path.join(runDir, 'changed-files.json'), changed);

  // command-results.json
  writeJson(path.join(runDir, 'command-results.json'), commandResults);

  // qa-checklist.md
  const qa = qaChecklist || [
    '- [ ] Review implementation-plan.md',
    '- [ ] Inspect all command results for hidden failures',
    '- [ ] Verify backups exist for any real writes',
    '- [ ] Run the recommended next action manually',
    '- [ ] Update evidence or docs if improvement lands'
  ];
  writeMd(path.join(runDir, 'qa-checklist.md'), 'QA Checklist', qa.map(q => typeof q === 'string' ? q : `- [ ] ${q}`).join('\n'));

  // risk-checklist.md
  writeMd(path.join(runDir, 'risk-checklist.md'), 'Risk Checklist', plan.riskChecklist.map(r => `- [ ] ${r}`).join('\n'));

  // rollback-plan.md
  const rb = rollback || plan.rollbackPlan;
  writeMd(path.join(runDir, 'rollback-plan.md'), 'Rollback Plan', [
    `Strategy: ${rb.strategy}`,
    '',
    'Backups recorded:',
    (rb.backupLocations || []).map(b => `- ${b}`).join('\n'),
    '',
    'Restore commands:',
    (rb.restoreCommands || []).map(c => `\`${c}\``).join('\n')
  ].join('\n'));

  // evidence-record.json (vault.v1 compatible-ish)
  const ev = evidence || {
    id: `artifact_agent_${runId}`,
    schema_version: 'vault.v1',
    record_type: 'VaultArtifact',
    source_platform: 'agent-swarm-coder',
    created_at: startedAt,
    tags: ['coding-agent', 'run', dryRun ? 'dry-run' : 'applied'],
    privacy_level: 'local_private',
    run_id: runId,
    summary: `Agent run for: ${goal}`,
    artifacts: changed.map(c => ({ type: 'file', path: c.path || c, action: c.action })),
    plan_objective: plan.objective,
    files_changed: changed.map(c => c.path || c),
    commands_run: commandResults.filter(r => r && r.command).map(r => r.command),
    outcome: dryRun ? 'dry-run' : (repairs.length ? 'repaired' : 'applied')
  };
  writeJson(path.join(runDir, 'evidence-record.json'), ev);

  // decision-log.md
  const dl = decisionLog || [
    `Started: ${startedAt}`,
    `Goal: ${goal}`,
    `Mode: ${dryRun ? 'DRY-RUN (safe)' : 'APPLY (writes enabled)'}`,
    `Provider: simulated`,
    `Repairs attempted: ${repairs.length || 0}`,
    `Files touched (actual writes): ${changed.filter(c => !c.action?.includes('dry')).length}`
  ];
  writeMd(path.join(runDir, 'decision-log.md'), 'Decision Log', dl.map(d => `- ${d}`).join('\n'));

  // repair-prompt.md (if any repairs)
  if (repairs && repairs.length) {
    const rp = repairs.map((r, i) => `## Repair Attempt ${i+1}\n\nCommand: \`${r.command}\`\n\n${r.repairPrompt || 'See command-results for details.'}\n`).join('\n---\n');
    writeMd(path.join(runDir, 'repair-prompt.md'), 'Repair Prompts Generated', rp);
  }

  // next-action.md
  const next = nextAction || [
    '1. Review the full package in this directory.',
    '2. If satisfied with plan and (in apply mode) the changes, mark the QA items.',
    '3. Run follow-up commands listed in implementation-plan.md manually if needed.',
    '4. For real provider: register a new adapter in providerRegistry.js and re-run with allow-repair flags.',
    '5. Feed useful runs back into Intelligence Vault via the ingestion parser (future wiring).'
  ];
  writeMd(path.join(runDir, 'next-action.md'), 'Next Action', next.map(n => typeof n === 'string' ? n : `- ${n}`).join('\n'));

  // run-summary.md (top level)
  const summaryBody = [
    `# Run Summary — ${runId}`,
    '',
    `**Goal**: ${goal}`,
    `**Mode**: ${dryRun ? 'dry-run (no writes performed)' : 'APPLY — files were modified'}`,
    `**Started**: ${startedAt}`,
    `**Finished**: ${finishedAt || new Date().toISOString()}`,
    `**Project**: ${inspection?.projectRoot || 'unknown'}`,
    `**Provider**: simulated`,
    `**Repairs**: ${repairs.length || 0}`,
    '',
    '## Key Artifacts',
    '- implementation-plan.md',
    '- implementation-plan.json',
    '- command-results.json',
    '- changed-files.json',
    '- evidence-record.json',
    '- decision-log.md',
    '- qa-checklist.md',
    '- rollback-plan.md',
    '- next-action.md',
    (repairs.length ? '- repair-prompt.md' : ''),
    (fs.existsSync(path.join(runDir, 'context-packet.md')) ? '- context-packet.md' : ''),
    (fs.existsSync(path.join(runDir, 'context-packet.json')) ? '- context-packet.json' : ''),
    (fs.existsSync(path.join(runDir, 'context-packet.md')) ? '- context-packet.md' : ''),
    (fs.existsSync(path.join(runDir, 'context-packet.json')) ? '- context-packet.json' : ''),
    '',
    '## Outcome',
    lastOutcome(commandResults, repairs, dryRun),
    '',
    '## Files Changed (this run)',
    changed.length ? changed.map(c => `- ${c.path || c} (${c.action || 'change'})`).join('\n') : '(none — dry-run or no mutations)',
    '',
    '## How to Restore (if needed)',
    'See rollback-plan.md'
  ].join('\n');
  fs.writeFileSync(path.join(runDir, 'run-summary.md'), summaryBody, 'utf8');

  return runDir;
}

function lastOutcome(cmds, repairs, dry) {
  if (dry) return 'Dry-run complete. Plan and diagnostics captured. No files modified.';
  const last = cmds.filter(c => c && typeof c.exitCode === 'number').pop();
  if (!last) return 'Completed (no command results recorded).';
  if (last.success) return repairs.length ? 'Succeeded after repair(s).' : 'Succeeded.';
  return 'Failed after repair attempts. See command-results.json and repair-prompt.md.';
}

/**
 * writePackageExecutionPackage
 * Produces the specific artifacts for --package mode runs.
 */
export function writePackageExecutionPackage(runDir, payload) {
  const {
    runId, packageRef, dryRun, parsedPackage, executionPlan, commandResults = [], changed = [],
    repairs = [], evidence, qaChecklist, decisionLog, nextAction, rollback, startedAt, finishedAt
  } = payload;

  const pkg = parsedPackage?.package || parsedPackage || {};

  // parsed-package.json
  writeJson(path.join(runDir, 'parsed-package.json'), pkg);

  // execution-plan.json
  writeJson(path.join(runDir, 'execution-plan.json'), executionPlan || {});

  // file-change-plan.json
  writeJson(path.join(runDir, 'file-change-plan.json'), {
    planned: (executionPlan?.fileOps || []).map(o => o.path),
    actuallyChanged: changed.map(c => c.path || c),
    dryRun
  });

  // changed-files.json
  writeJson(path.join(runDir, 'changed-files.json'), changed);

  // command-results.json
  writeJson(path.join(runDir, 'command-results.json'), commandResults);

  // qa-checklist.md
  const qa = qaChecklist || (pkg.qaChecklist || ['- [ ] Review package-execution-summary.md', '- [ ] Inspect command-results for issues']);
  writeMd(path.join(runDir, 'qa-checklist.md'), 'QA Checklist', qa.map(q => typeof q === 'string' ? q : `- [ ] ${q}`).join('\n'));

  // risk-checklist.md
  const risks = pkg.riskChecklist || (executionPlan?.riskChecklist || []);
  writeMd(path.join(runDir, 'risk-checklist.md'), 'Risk Checklist', risks.map(r => `- [ ] ${r}`).join('\n'));

  // rollback-plan.md
  const rb = rollback || { strategy: executionPlan?.rollbackNotes || 'Use .bak files created next to modified files.' };
  writeMd(path.join(runDir, 'rollback-plan.md'), 'Rollback Plan', [
    `Strategy: ${rb.strategy || rb}`,
    '',
    'Backups recorded:',
    (rb.backupLocations || (changed.map(c => (c.backup || c.path + '.bak-*')))).map(b => `- ${b}`).join('\n')
  ].join('\n'));

  // evidence-record.json
  const ev = evidence || {
    id: `artifact_agent_${runId}`,
    schema_version: 'vault.v1',
    record_type: 'VaultArtifact',
    source_platform: 'agent-swarm-coder',
    created_at: startedAt,
    tags: ['coding-agent', 'package-execution', dryRun ? 'dry-run' : 'applied'],
    privacy_level: 'local_private',
    run_id: runId,
    summary: `Package execution: ${pkg.objective || packageRef}`,
    artifacts: changed.map(c => ({ type: 'file', path: c.path || c, action: c.action })),
    plan_objective: pkg.objective,
    files_changed: changed.map(c => c.path || c),
    commands_run: commandResults.filter(r => r && r.command).map(r => r.command),
    outcome: dryRun ? 'dry-run' : (repairs.length ? 'repaired' : 'applied')
  };
  writeJson(path.join(runDir, 'evidence-record.json'), ev);

  // decision-log.md
  const dl = decisionLog || [
    `Started: ${startedAt}`,
    `Package: ${packageRef}`,
    `Mode: ${dryRun ? 'DRY-RUN (safe)' : 'APPLY (writes enabled)'}`,
    `Files planned: ${(executionPlan?.fileOps || []).length}`,
    `Commands planned: ${(executionPlan?.commands || []).length}`,
    `Blocked actions: ${(executionPlan?.safety?.blockedActions || []).length}`
  ];
  writeMd(path.join(runDir, 'decision-log.md'), 'Decision Log', dl.map(d => `- ${d}`).join('\n'));

  // repair-prompt if any
  if (repairs && repairs.length) {
    const rp = repairs.map((r, i) => `## Repair Attempt ${i+1}\n\n${r.repairPrompt || r.command || ''}`).join('\n---\n');
    writeMd(path.join(runDir, 'repair-prompt.md'), 'Repair Prompts Generated', rp);
  }

  // next-action.md
  const next = nextAction || pkg.nextAction || [
    'Review package-execution-summary.md and execution-plan.json',
    dryRun ? 'Re-run with --apply after review (if safe)' : 'Verify changes',
    'Feed evidence-record to vault if useful'
  ];
  writeMd(path.join(runDir, 'next-action.md'), 'Next Action', next.map(n => typeof n === 'string' ? n : `- ${n}`).join('\n'));

  // package-execution-summary.md (top)
  const summaryBody = [
    `# Package Execution Summary — ${runId}`,
    '',
    `**Package**: ${packageRef}`,
    `**Objective**: ${pkg.objective || '(none)'}`,
    `**Mode**: ${dryRun ? 'dry-run (no writes)' : 'APPLY'}`,
    `**Started**: ${startedAt}`,
    `**Finished**: ${finishedAt || new Date().toISOString()}`,
    `**Provider/Safety**: simulated + local gates`,
    '',
    '## Key Artifacts',
    '- parsed-package.json',
    '- execution-plan.json',
    '- package-execution-summary.md',
    '- command-results.json',
    '- changed-files.json',
    '- evidence-record.json',
    '- qa-checklist.md',
    '- risk-checklist.md',
    '- rollback-plan.md',
    '- decision-log.md',
    '- next-action.md',
    (repairs && repairs.length ? '- repair-prompt.md' : ''),
    (fs.existsSync(path.join(runDir, 'context-packet.md')) ? '- context-packet.md' : ''),
    '',
    '## Safety Summary',
    `Warnings: ${(executionPlan?.safety?.warnings || []).length}`,
    `Blocked: ${(executionPlan?.safety?.blockedActions || []).length}`,
    `Requires approval: ${(executionPlan?.safety?.requiresApproval || []).length}`,
    '',
    '## Outcome',
    dryRun ? 'Dry-run package execution complete. No files were modified.' : 'Applied (see changed-files).',
    '',
    '## Planned File Ops',
    (executionPlan?.fileOps || []).map(o => `- ${o.action}: ${o.path}${o.isSecretTarget ? ' (secret target)' : ''}`).join('\n') || '(none)',
    '',
    '## Planned / Run Commands',
    (executionPlan?.commands || commandResults).map(c => `- ${c.command || c}`).join('\n') || '(none)',
    '',
    'See execution-plan.json for full safety and step details.'
  ].join('\n');
  fs.writeFileSync(path.join(runDir, 'package-execution-summary.md'), summaryBody, 'utf8');

  return runDir;
}

export default {
  slugify,
  makeRunDir,
  makePackageExecutionDir,
  writeRunPackage,
  writePackageExecutionPackage
};
