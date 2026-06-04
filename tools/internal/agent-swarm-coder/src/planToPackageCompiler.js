/**
 * planToPackageCompiler.js
 * Converts a goal-mode implementation-plan.json (from taskPlanner) into
 * a valid agent-package.v1 package object that the existing packageParser
 * (via normalize/validate) and packageExecutionPlanner accept.
 *
 * Safety: always emits approvals: {deletes:false, secretEdits:false, externalActions:false}
 * Never emits delete actions. Risky file targets (if any) get no approvals.
 * File paths are sanitized: directory hints become concrete safe file paths.
 * No content is invented for files (high-level plan); planner will warn "manual required".
 * Zero dependencies, deterministic.
 */

import fs from 'node:fs';
import path from 'node:path';
import parserMod from './packageParser.js';
import { isIgnoredPath } from './safetyGuard.js';

const normalizePackage = parserMod.normalizePackage || parserMod.default?.normalizePackage;
const validatePackage = parserMod.validatePackage || parserMod.default?.validatePackage;
const PackageParseError = parserMod.PackageParseError || parserMod.default?.PackageParseError;

export class PlanCompileError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'PlanCompileError';
    this.code = 'PLAN_COMPILE';
    this.details = details;
  }
}

/**
 * Sanitize a filesLikelyToModify entry into a concrete, non-dir, non-ignored file path.
 * Directory hints (src/, tools/.../src/) are mapped to a representative safe file
 * that exists in most projects or in this repo's common layout.
 */
function sanitizePlanFilePath(raw, projectRoot = null) {
  let p = String(raw || '').trim().replace(/\/+$/, '').replace(/^\/+/, '');
  if (!p || p === '.' || p === '..') return null;
  if (isIgnoredPath(p)) return null;

  // If it already looks like a file (has extension or is package.json/README), keep
  const hasExt = /\.[a-z0-9]+$/i.test(p);
  const isKnownFile = p === 'package.json' || p.toLowerCase() === 'readme' || p.toLowerCase().endsWith('readme.md');
  if (hasExt || isKnownFile) {
    return p;
  }

  // Directory hint -> map to a concrete safe representative file
  const lower = p.toLowerCase();
  if (lower.includes('agent-swarm-coder') || lower.includes('agent_swarm_coder')) {
    return 'tools/internal/agent-swarm-coder/README.md';
  }
  if (lower === 'src' || lower.endsWith('/src') || lower === 'src/') {
    // Prefer a stable file in this project's layout; fallback to package.json scope
    return 'src/static-app.js';
  }
  if (lower.includes('test') || lower.includes('spec')) {
    return 'package.json'; // safe; tests/ would be dir
  }
  if (lower.includes('doc') || lower.includes('note') || lower.includes('read')) {
    return 'README.md';
  }

  // Generic fallback to package manifest (always safe, common in plans)
  return 'package.json';
}

/**
 * Compile goal-mode plan to package.
 * plan may be object or path to json.
 */
export function compilePlanToPackage(planInput, context = {}) {
  let plan = planInput;
  if (typeof planInput === 'string') {
    const abs = path.resolve(planInput);
    if (!fs.existsSync(abs)) {
      throw new PlanCompileError(`Plan file not found: ${planInput}`);
    }
    try {
      plan = JSON.parse(fs.readFileSync(abs, 'utf8'));
    } catch (e) {
      throw new PlanCompileError(`Failed to parse plan JSON: ${e.message}`);
    }
  }

  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) {
    throw new PlanCompileError('implementation-plan must be a non-null object');
  }
  if (!plan.objective || typeof plan.objective !== 'string' || plan.objective.trim().length < 3) {
    throw new PlanCompileError('implementation-plan missing required "objective" (string, min 3 chars)');
  }
  if (!Array.isArray(plan.implementationSteps) || plan.implementationSteps.length === 0) {
    throw new PlanCompileError('implementation-plan missing required "implementationSteps" (non-empty array)');
  }
  // riskChecklist, testCommands, rollbackPlan are recommended but we can default

  const projectRoot = context.projectPath || context.projectRoot || '.';

  // Build files from likely, sanitized to concrete files only
  const rawFiles = plan.filesLikelyToModify || [];
  const fileSet = new Set();
  const fileEntries = [];
  for (const raw of rawFiles) {
    const safe = sanitizePlanFilePath(raw, projectRoot);
    if (safe && !fileSet.has(safe)) {
      fileSet.add(safe);
      fileEntries.push({
        path: safe,
        action: 'modify', // never delete or create in generated high-level plans (content-less creates would still be gated)
        description: 'Scope derived from goal-mode implementation plan (high-level). Content to be supplied on review/apply.',
        approved: false
      });
    }
  }
  if (fileEntries.length === 0) {
    // Always have at least the manifest as safe target
    fileEntries.push({
      path: 'package.json',
      action: 'modify',
      description: 'Project manifest (derived default scope)',
      approved: false
    });
  }

  // Commands and tests: reuse the plan's testCommands (they were the executable ones in goal mode)
  const testCmds = Array.isArray(plan.testCommands) ? plan.testCommands.filter(Boolean) : [];
  const commands = [...testCmds]; // safe commands only; planner will still block destructives

  // implementationSteps -> array of strings (package shape)
  const implSteps = (plan.implementationSteps || []).map((s, idx) => {
    const stepNum = s && typeof s.step === 'number' ? s.step : (idx + 1);
    const action = (s && s.action) ? String(s.action) : '';
    const files = (s && Array.isArray(s.files) && s.files.length) ? ' (' + s.files.join(', ') + ')' : '';
    const notes = (s && s.notes) ? ' — ' + s.notes : '';
    return `${stepNum}. ${action}${files}${notes}`.trim();
  }).filter(Boolean);

  // Risk from plan
  const risk = Array.isArray(plan.riskChecklist) ? plan.riskChecklist.filter(Boolean) : [
    'High-level conversion: file contents not present in source plan; manual review required before apply.',
    'Planner safety gates still apply to all generated packages.'
  ];

  // Rollback
  let rollbackNotes = '';
  if (plan.rollbackPlan && typeof plan.rollbackPlan === 'object') {
    rollbackNotes = [
      plan.rollbackPlan.strategy || 'Restore from .bak files.',
      'Backups: ' + (plan.rollbackPlan.backupLocations || []).join(', '),
      (plan.rollbackPlan.restoreCommands || []).join(' | ')
    ].filter(Boolean).join('\n');
  } else {
    rollbackNotes = 'Backups created by FileOps before any write. See .bak files and rollback-plan.md from original run.';
  }

  // QA, evidence, next from conversion (always present, review-oriented)
  const qaChecklist = [
    '- [ ] Review original implementation-plan.md/json alongside this generated package',
    '- [ ] Confirm all safety blockedActions and warnings in the package execution run',
    '- [ ] Verify this is a dry-run validation of the plan-to-package loop (no target writes)',
    '- [ ] Only use --apply on a generated package after human review of the full run package',
    '- [ ] Feed useful evidence-record.json to vault-ingestion-parser (future phase)'
  ];

  const evidenceRequirements = 'The generated package was produced deterministically from a goal-mode implementation plan. All claims, changes, and commands must be reviewed against the original plan and project state. No evidence is auto-approved for public use.';

  const nextAction = [
    'Review generated-implementation-package.md and the package-execution dry-run output.',
    'The closed-loop flow is: goal → plan (implementation-plan.json) → generated package → dry-run execution (validates parser/planner/safety) → apply ONLY after explicit approval and --apply.',
    'Re-run a saved plan with: --plan <path/to/implementation-plan.json> --dry-run',
    'Extend compiler with better file-content synthesis only behind explicit content-generation phase approval.',
    'Use this capability to self-validate improvements to the agent before any --apply.'
  ];

  const pkg = {
    schema_version: 'agent-package.v1',
    objective: plan.objective.trim(),
    files: fileEntries,
    commands,
    testCommands: testCmds,
    implementationSteps: implSteps,
    qaChecklist,
    riskChecklist: risk,
    rollbackNotes,
    evidenceRequirements,
    nextAction,
    approvals: {
      deletes: false,
      secretEdits: false,
      externalActions: false
    }
  };

  // Ensure it normalizes and validates using the shared logic
  const normalized = normalizePackage(pkg, 'plan-to-package');
  const validation = validatePackage(normalized);
  if (!validation.valid) {
    throw new PlanCompileError(`Compiled package failed validation: ${validation.errors.join('; ')}`, { errors: validation.errors });
  }

  return normalized;
}

/**
 * Render a compiled package object as markdown (human + machine readable, similar to sample fixture).
 */
export function renderPlanAsPackageMarkdown(pkg, originalPlan = null) {
  const p = pkg || {};
  const lines = [];

  lines.push('# Generated Implementation Package (from goal-mode plan)');
  lines.push('');
  lines.push('schema_version: ' + (p.schema_version || 'agent-package.v1'));
  lines.push('');
  lines.push('## Objective');
  lines.push(p.objective || '(none)');
  lines.push('');

  lines.push('## Files');
  if (Array.isArray(p.files) && p.files.length) {
    for (const f of p.files) {
      const act = f.action || 'modify';
      lines.push(`### ${act}: ${f.path}`);
      if (f.description) lines.push(f.description);
      if (f.content) {
        lines.push('```');
        lines.push(f.content);
        lines.push('```');
      } else {
        lines.push('```');
        lines.push('(content not supplied by source plan — supply on review before apply)');
        lines.push('```');
      }
      lines.push('');
    }
  } else {
    lines.push('(no file entries — high-level plan)');
  }

  if (Array.isArray(p.implementationSteps) && p.implementationSteps.length) {
    lines.push('## Implementation Steps');
    p.implementationSteps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    lines.push('');
  }

  if (Array.isArray(p.commands) && p.commands.length) {
    lines.push('## Commands');
    p.commands.forEach(c => lines.push(`- ${c}`));
    lines.push('');
  }

  if (Array.isArray(p.testCommands) && p.testCommands.length) {
    lines.push('## Test Commands');
    p.testCommands.forEach(c => lines.push(`- ${c}`));
    lines.push('');
  }

  if (Array.isArray(p.qaChecklist) && p.qaChecklist.length) {
    lines.push('## QA Checklist');
    p.qaChecklist.forEach(q => lines.push(typeof q === 'string' && q.startsWith('-') ? q : `- ${q}`));
    lines.push('');
  }

  if (Array.isArray(p.riskChecklist) && p.riskChecklist.length) {
    lines.push('## Risk Checklist');
    p.riskChecklist.forEach(r => lines.push(`- ${r}`));
    lines.push('');
  }

  lines.push('## Rollback Notes');
  lines.push(p.rollbackNotes || 'Standard .bak-<timestamp> files created by FileOps. Use git checkout or cp to restore.');
  lines.push('');

  lines.push('## Evidence Requirements');
  lines.push(p.evidenceRequirements || 'Review generated artifacts and original plan before promoting any evidence.');
  lines.push('');

  if (Array.isArray(p.nextAction) && p.nextAction.length) {
    lines.push('## Next Action');
    p.nextAction.forEach(n => lines.push(`- ${n}`));
    lines.push('');
  }

  lines.push('## Approvals (defaults)');
  const ap = p.approvals || {};
  lines.push(`- deletes: ${!!ap.deletes}`);
  lines.push(`- secretEdits: ${!!ap.secretEdits}`);
  lines.push(`- externalActions: ${!!ap.externalActions}`);
  lines.push('');
  lines.push('> This package was compiled from a goal-mode implementation plan. It is intentionally high-level and safe-by-default. All risky operations are blocked by the execution planner unless explicitly allowed.');

  return lines.join('\n');
}

export default {
  compilePlanToPackage,
  renderPlanAsPackageMarkdown,
  PlanCompileError
};
