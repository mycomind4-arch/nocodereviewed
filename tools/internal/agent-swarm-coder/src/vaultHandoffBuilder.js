/**
 * vaultHandoffBuilder.js
 * Local Vault Handoff Adapter for agent-swarm-coder.
 *
 * Reads existing raw run artifacts (implementation-plan.*, evidence-record.json,
 * decision-log.md, command-results.json, changed-files.json, rollback-plan.md,
 * next-action.md, parsed-package.json/execution-plan.json for package mode, summaries, etc.)
 * WITHOUT modifying them or the run dir structure outside the new vault-handoff/ subdir.
 *
 * Produces normalized records using VAULT_DATA_CONTRACT shapes (VaultArtifact + VaultCommand
 * only; no new record types invented here) + query-specified fields for handoff compatibility.
 * Records are emitted as a records.jsonl (newline-delimited JSON) + manifest + human summary.
 *
 * This is a pure export/normalization layer. Raw run package remains the source of truth.
 * No live ingestion, no parser modification, no cloud, no external calls.
 * Secrets are redacted from any copied content.
 *
 * Used by:
 * - runAgent (when --vault-handoff)
 * - CLI backfill mode for previous runs
 */

import fs from 'node:fs';
import path from 'node:path';
import { redactSecrets } from './safetyGuard.js';

export class VaultHandoffError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'VaultHandoffError';
    this.code = 'VAULT_HANDOFF';
    this.details = details;
  }
}

function safeReadJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function safeReadText(filePath, fallback = '') {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return fallback;
  }
}

function redactObject(obj) {
  if (!obj) return obj;
  if (typeof obj === 'string') return redactSecrets(obj);
  if (Array.isArray(obj)) return obj.map(redactObject);
  if (typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = redactObject(v);
    }
    return out;
  }
  return obj;
}

function makeId(runId, suffix) {
  return `agent-${runId}-${suffix}`;
}

function makeRecordBase(runId, runDir, createdAt, project) {
  const relRun = path.relative(process.cwd(), runDir) || runDir;
  return {
    schema_version: 'vault.v1',
    source_platform: 'agent-swarm-coder',
    source_tool: 'agent-swarm-coder',
    source_run_path: relRun,
    project: project || 'unknown',
    created_at: createdAt,
    privacy_level: 'local_private',
    tags: ['agent-swarm-coder', 'run-export'],
    confidence: 1.0,
    evidence_status: 'needs_review',
    related_records: [],
    promote_to_long_term: false
  };
}

/**
 * Build normalized handoff records + manifest + summary from a run directory's artifacts.
 * Pure function: no writes, no side effects on runDir.
 */
export function buildVaultHandoffRecords(runDir, opts = {}) {
  if (!runDir || !fs.existsSync(runDir) || !fs.statSync(runDir).isDirectory()) {
    throw new VaultHandoffError(`Run directory not found: ${runDir}`);
  }
  const absRun = path.resolve(runDir);
  const runId = path.basename(absRun);

  // Detect mode
  const hasImplPlan = fs.existsSync(path.join(absRun, 'implementation-plan.json'));
  const isPackageMode = !hasImplPlan && fs.existsSync(path.join(absRun, 'parsed-package.json'));

  // Read key artifacts (raw source of truth)
  const evidence = safeReadJson(path.join(absRun, 'evidence-record.json'), {});
  const commandResults = safeReadJson(path.join(absRun, 'command-results.json'), []);
  const changedFiles = safeReadJson(path.join(absRun, 'changed-files.json'), []);
  const implPlan = hasImplPlan ? safeReadJson(path.join(absRun, 'implementation-plan.json'), null) : null;
  const parsedPkg = isPackageMode ? safeReadJson(path.join(absRun, 'parsed-package.json'), null) : null;
  const execPlan = isPackageMode ? safeReadJson(path.join(absRun, 'execution-plan.json'), null) : null;

  const decisionLogMd = safeReadText(path.join(absRun, 'decision-log.md'), '');
  const nextActionMd = safeReadText(path.join(absRun, 'next-action.md'), '');
  const rollbackMd = safeReadText(path.join(absRun, 'rollback-plan.md'), '');
  const runSummaryMd = safeReadText(path.join(absRun, hasImplPlan ? 'run-summary.md' : 'package-execution-summary.md'), '');

  // Extract project / created
  let project = 'unknown';
  let createdAt = new Date().toISOString();
  if (evidence.created_at) createdAt = evidence.created_at;
  if (evidence.meta && evidence.meta.project) project = evidence.meta.project;
  else if (evidence.summary) {
    const m = evidence.summary.match(/project[:\s]+([^\s,]+)/i);
    if (m) project = m[1];
  }
  // fallback from summary text
  const projMatch = runSummaryMd.match(/\*\*Project\*\*:\s*([^\n]+)/i) || runSummaryMd.match(/Project:\s*([^\n]+)/i);
  if (projMatch) project = projMatch[1].trim();

  const base = makeRecordBase(runId, absRun, createdAt, project);
  const records = [];

  // 1. run artifact record (overall run summary + evidence shaped)
  const runArtifact = {
    ...base,
    id: makeId(runId, 'run-artifact'),
    record_type: 'VaultArtifact',
    artifact_type: 'agent-run',
    title: `Agent Run: ${runId}`,
    summary: (evidence.summary || `Coding agent ${isPackageMode ? 'package execution' : 'goal'} run`).slice(0, 200),
    source_ref: evidence.source_ref || { raw_path: `outputs/coding-agent-runs/${runId}/`, run_dir: runId },
    content_ref: { relative_path: hasImplPlan ? 'run-summary.md' : 'package-execution-summary.md', in_run_dir: true },
    content: redactSecrets(runSummaryMd.slice(0, 1500)),
    tags: [...base.tags, isPackageMode ? 'package-mode' : 'goal-mode', (evidence.outcome || 'dry-run')],
    related_records: []
  };
  records.push(runArtifact);

  // 2. evidence record (reuse/enhance existing evidence-record.json as VaultArtifact)
  if (Object.keys(evidence).length > 0) {
    const evRec = {
      ...base,
      id: evidence.id || makeId(runId, 'evidence'),
      record_type: 'VaultArtifact',
      artifact_type: 'evidence',
      title: `Evidence Record for ${runId}`,
      summary: evidence.summary || 'Agent run evidence shaped as VaultArtifact',
      source_ref: evidence.source_ref || base.source_ref,
      content_ref: { relative_path: 'evidence-record.json', in_run_dir: true },
      content: JSON.stringify(redactObject(evidence), null, 2).slice(0, 2000),
      tags: [...(evidence.tags || base.tags), 'evidence'],
      confidence: evidence.confidence || 1.0,
      evidence_status: 'needs_review',
      plan_objective: evidence.plan_objective,
      files_changed: evidence.files_changed,
      commands_run: evidence.commands_run,
      outcome: evidence.outcome
    };
    records.push(evRec);
  }

  // 3. decision record (from decision-log.md)
  const decisionRec = {
    ...base,
    id: makeId(runId, 'decision'),
    record_type: 'VaultArtifact',
    artifact_type: 'decision-log',
    title: `Decision Log: ${runId}`,
    summary: 'Step-by-step decision and command log from agent run (raw md preserved in parent).',
    source_ref: { raw_path: `outputs/coding-agent-runs/${runId}/decision-log.md`, run_dir: runId },
    content_ref: { relative_path: 'decision-log.md', in_run_dir: true },
    content: redactSecrets(decisionLogMd.slice(0, 3000)),
    tags: [...base.tags, 'decision-log']
  };
  records.push(decisionRec);

  // 4. implementation package record (if present)
  if (implPlan) {
    const pkgRec = {
      ...base,
      id: makeId(runId, 'impl-package'),
      record_type: 'VaultArtifact',  // Using Artifact (plan is high-level); could be VaultPrompt in future after contract update
      artifact_type: 'implementation-plan',
      title: `Implementation Plan: ${implPlan.objective ? implPlan.objective.slice(0,80) : runId}`,
      summary: `Goal-mode plan with ${implPlan.implementationSteps ? implPlan.implementationSteps.length : 0} steps. Raw in implementation-plan.json (source of truth).`,
      source_ref: { raw_path: `outputs/coding-agent-runs/${runId}/implementation-plan.json`, run_dir: runId },
      content_ref: { relative_path: 'implementation-plan.json', in_run_dir: true },
      content: JSON.stringify(redactObject(implPlan), null, 2).slice(0, 1500),
      tags: [...base.tags, 'implementation-plan', 'goal-plan']
    };
    records.push(pkgRec);
  } else if (parsedPkg) {
    const pkgRec = {
      ...base,
      id: makeId(runId, 'impl-package'),
      record_type: 'VaultArtifact',
      artifact_type: 'implementation-package',
      title: `Implementation Package: ${parsedPkg.objective ? parsedPkg.objective.slice(0,80) : runId}`,
      summary: `Package execution input (parsed-package.json). Source of truth in parent dir.`,
      source_ref: { raw_path: `outputs/coding-agent-runs/${runId}/parsed-package.json`, run_dir: runId },
      content_ref: { relative_path: 'parsed-package.json', in_run_dir: true },
      content: JSON.stringify(redactObject(parsedPkg), null, 2).slice(0, 1500),
      tags: [...base.tags, 'implementation-package', 'package-mode']
    };
    records.push(pkgRec);
  }

  // 5. command results record (aggregate + VaultCommand entries for executed ones)
  const cmdRec = {
    ...base,
    id: makeId(runId, 'command-results'),
    record_type: 'VaultArtifact',
    artifact_type: 'command-results',
    title: `Command Results: ${runId}`,
    summary: `${commandResults.length} commands executed (see command-results.json for full redacted output).`,
    source_ref: { raw_path: `outputs/coding-agent-runs/${runId}/command-results.json`, run_dir: runId },
    content_ref: { relative_path: 'command-results.json', in_run_dir: true },
    content: JSON.stringify(redactObject(commandResults.slice(0, 5)), null, 2).slice(0, 2000), // sample, full via ref
    tags: [...base.tags, 'commands', 'execution']
  };
  records.push(cmdRec);

  // Also emit individual VaultCommand records for the actual commands run (per contract)
  for (let i = 0; i < Math.min(commandResults.length, 10); i++) {  // bound
    const cr = commandResults[i];
    if (!cr || !cr.command) continue;
    const cmdRecInd = {
      ...base,
      id: makeId(runId, `command-${i}`),
      record_type: 'VaultCommand',
      title: `Command: ${cr.command.slice(0, 80)}`,
      summary: `exit=${cr.exitCode} success=${!!cr.success} duration=${cr.durationMs}ms`,
      source_ref: { raw_path: `outputs/coding-agent-runs/${runId}/command-results.json`, run_dir: runId, index: i },
      command: redactSecrets(cr.command),
      content: redactSecrets( (cr.stdout || '').slice(0,500) + (cr.stderr ? '\nSTDERR: ' + cr.stderr.slice(0,200) : '') ),
      tags: [...base.tags, 'command', cr.success ? 'success' : 'failure'],
      confidence: cr.success ? 1.0 : 0.7
    };
    records.push(cmdRecInd);
  }

  // 6. changed files record
  const changedRec = {
    ...base,
    id: makeId(runId, 'changed-files'),
    record_type: 'VaultArtifact',
    artifact_type: 'changed-files',
    title: `Changed Files: ${runId}`,
    summary: `${changedFiles.length} file change records (dry intents or applied). Source: changed-files.json`,
    source_ref: { raw_path: `outputs/coding-agent-runs/${runId}/changed-files.json`, run_dir: runId },
    content_ref: { relative_path: 'changed-files.json', in_run_dir: true },
    content: JSON.stringify(redactObject(changedFiles), null, 2).slice(0, 1000),
    tags: [...base.tags, 'file-changes']
  };
  records.push(changedRec);

  // 7. rollback record
  const rollbackRec = {
    ...base,
    id: makeId(runId, 'rollback'),
    record_type: 'VaultArtifact',
    artifact_type: 'rollback-plan',
    title: `Rollback Plan: ${runId}`,
    summary: 'Rollback strategy and backup locations from the run.',
    source_ref: { raw_path: `outputs/coding-agent-runs/${runId}/rollback-plan.md`, run_dir: runId },
    content_ref: { relative_path: 'rollback-plan.md', in_run_dir: true },
    content: redactSecrets(rollbackMd.slice(0, 2000)),
    tags: [...base.tags, 'rollback']
  };
  records.push(rollbackRec);

  // 8. next action record
  const nextRec = {
    ...base,
    id: makeId(runId, 'next-action'),
    record_type: 'VaultArtifact',
    artifact_type: 'next-action',
    title: `Next Action: ${runId}`,
    summary: 'Recommended follow-up actions after the agent run (review before apply).',
    source_ref: { raw_path: `outputs/coding-agent-runs/${runId}/next-action.md`, run_dir: runId },
    content_ref: { relative_path: 'next-action.md', in_run_dir: true },
    content: redactSecrets(nextActionMd.slice(0, 2000)),
    tags: [...base.tags, 'next-action'],
    promote_to_long_term: true  // next actions are often useful for long-term memory
  };
  records.push(nextRec);

  // Manifest (per LOCAL_VAULT_HANDOFF contract, adapted for agent-run)
  const includedTypes = {};
  for (const r of records) {
    includedTypes[r.record_type] = (includedTypes[r.record_type] || 0) + 1;
  }
  const manifest = {
    schema_version: 'vault.v1',
    export_version: 'agent-run-handoff.v1',
    generated_at: new Date().toISOString(),
    source_application: 'agent-swarm-coder',
    source_run_path: path.relative(process.cwd(), absRun) || absRun,
    record_counts: includedTypes,
    included_record_types: Object.keys(includedTypes),
    parser_compatibility_version: 'vault-ingestion-parser.local-json.v1',
    privacy_notice: 'Local-only handoff export. Raw artifacts in parent run dir are the durable source of truth. All content redacted for secrets. privacy_level=local_private. No live ingestion or cloud performed.'
  };

  // Summary md
  const summary = [
    `# Vault Handoff for ${runId}`,
    '',
    `Generated: ${manifest.generated_at}`,
    `Source run: ${manifest.source_run_path}`,
    `Mode: ${isPackageMode ? 'package-execution' : 'goal'}`,
    `Project: ${project}`,
    '',
    '## Records Generated',
    ''
  ];
  for (const r of records) {
    summary.push(`- **${r.id}** (${r.record_type}${r.artifact_type ? '/' + r.artifact_type : ''}): ${r.title}`);
    summary.push(`  summary: ${r.summary.slice(0,120)}${r.summary.length>120?'...':''}`);
    if (r.content_ref) summary.push(`  content_ref: ${r.content_ref.relative_path}`);
    summary.push('');
  }
  summary.push('## Notes');
  summary.push('- This handoff/ subdir is a normalized export layer only.');
  summary.push('- Original run artifacts (implementation-plan.json, evidence-record.json, *.md, command-results.json etc.) are unchanged and are the source of truth.');
  summary.push('- Records conform to VAULT_DATA_CONTRACT (vault.v1) using VaultArtifact and VaultCommand.');
  summary.push('- Future: vault-ingestion-parser can read the records.jsonl via generic JSON document support or a dedicated adapter.');
  summary.push('- No secrets, no external actions, local_private only.');
  summary.push('- To backfill: npm run agent -- --backfill-vault-handoff "' + manifest.source_run_path + '"');

  return {
    records,
    manifest,
    summary: summary.join('\n'),
    runId,
    runDir: absRun,
    isPackageMode,
    project
  };
}

/**
 * Write the vault-handoff/ folder inside an existing runDir.
 * Creates subdir + 3 files. Idempotent-ish (overwrites handoff only).
 * NEVER touches files outside vault-handoff/.
 */
export function writeVaultHandoff(runDir, built) {
  const handoffDir = path.join(runDir, 'vault-handoff');
  fs.mkdirSync(handoffDir, { recursive: true });

  // manifest.json
  fs.writeFileSync(
    path.join(handoffDir, 'manifest.json'),
    JSON.stringify(built.manifest, null, 2) + '\n',
    'utf8'
  );

  // records.jsonl (one record per line)
  const jsonl = built.records.map(r => JSON.stringify(r)).join('\n') + '\n';
  fs.writeFileSync(path.join(handoffDir, 'records.jsonl'), jsonl, 'utf8');

  // summary.md
  fs.writeFileSync(path.join(handoffDir, 'summary.md'), built.summary, 'utf8');

  return handoffDir;
}

/**
 * High level: build + write for a run dir.
 */
export function createVaultHandoffForRun(runDir) {
  const built = buildVaultHandoffRecords(runDir);
  const outDir = writeVaultHandoff(runDir, built);
  return { handoffDir: outDir, ...built };
}

export default {
  buildVaultHandoffRecords,
  writeVaultHandoff,
  createVaultHandoffForRun,
  VaultHandoffError
};
