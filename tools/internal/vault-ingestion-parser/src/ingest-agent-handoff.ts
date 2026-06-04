#!/usr/bin/env node
/**
 * ingest-agent-handoff.ts
 * Dedicated local ingestion for agent-swarm-coder vault-handoff/ records.
 *
 * Usage (from root):
 *   npm run vault:ingest-agent-runs -- --source "outputs/coding-agent-runs"
 *
 * Or with tsx directly.
 *
 * Finds all ** /vault-handoff/records.jsonl that match agent handoff (via manifest or name).
 * Uses the registered agentSwarmCoderHandoffParser adapter for parsing/validation/classification.
 * Produces output under outputs/vault-ingestion-runs/<timestamp>-agent-swarm-coder-handoff/
 * with exactly the required files, without mutating any source (handoff or run folders).
 * Aggregates records from all found handoffs.
 * Reports counts by record_type, warnings, etc.
 */

import path from 'node:path';
import { promises as fs } from 'node:fs';
import fg from 'fast-glob';
import { findParser } from './parsers/index.js';
import { ensureDir, writeJson, safeName } from './utils/fs.js';
import { appendLog } from './utils/log.js';

interface IngestAgentOptions {
  source: string;
}

export async function ingestAgentHandoff(opts: { source?: string } = {}) {
  const source = opts.source || 'outputs/coding-agent-runs';
  const sourceAbs = path.resolve(source);
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, '').slice(0, 13) + 
                String(now.getMinutes()).padStart(2, '0') +
                String(now.getSeconds()).padStart(2, '0');
  const outDirName = `${stamp}-agent-swarm-coder-handoff`;
  const outputAbs = path.resolve('outputs', 'vault-ingestion-runs', outDirName);

  console.log(`agent-swarm-coder vault handoff ingestion`);
  console.log(`  source: ${sourceAbs}`);
  console.log(`  output: ${outputAbs}`);

  await ensureDir(outputAbs);
  await ensureDir(path.join(outputAbs, 'logs'));

  const recordsGlob = path.join(sourceAbs, '**', 'vault-handoff', 'records.jsonl').replace(/\\/g, '/');
  const handoffFiles = await fg([recordsGlob], { onlyFiles: true, absolute: true });

  console.log(`  handoff folders found: ${handoffFiles.length}`);

  const allNormalizedRecords: any[] = [];
  const allWarnings: string[] = [];
  const processedHandoffs: string[] = [];
  let totalRecords = 0;

  for (const recordsFile of handoffFiles) {
    const handoffDir = path.dirname(recordsFile);
    const runDir = path.dirname(handoffDir);
    const runId = path.basename(runDir);
    processedHandoffs.push(runId);

    try {
      const parser = await findParser(recordsFile);
      if (!parser || parser.name !== 'agent-swarm-coder-handoff') {
        allWarnings.push(`No suitable parser for ${recordsFile}`);
        continue;
      }

      const result: any = await parser.parse(recordsFile, {
        source: 'agent-swarm-coder',
        rawPath: runDir
      });

      const handoffRecs = result.handoffRecords || [];
      const warns = result.warnings || [];
      const manifest = result.manifest || {};

      for (const rec of handoffRecs) {
        allNormalizedRecords.push({
          ...rec,
          _handoff_run_id: runId,
          _handoff_path: handoffDir
        });
      }
      allWarnings.push(...warns.map((w: string) => `[${runId}] ${w}`));
      totalRecords += handoffRecs.length;

      // Copy per-run evidence and decision if present in parent run dir (for listed output files)
      // Use prefixed for multiple runs
      const evidenceSrc = path.join(runDir, 'evidence-record.json');
      const decisionSrc = path.join(runDir, 'decision-log.md');
      if (await pathExists(evidenceSrc)) {
        await fs.copyFile(evidenceSrc, path.join(outputAbs, `${safeName(runId)}-evidence-record.json`));
      }
      if (await pathExists(decisionSrc)) {
        await fs.copyFile(decisionSrc, path.join(outputAbs, `${safeName(runId)}-decision-log.md`));
      }

      await appendLog(outputAbs, 'logs/ingestion.log', `Processed handoff for ${runId}: ${handoffRecs.length} records`);
    } catch (err) {
      const msg = `Failed ${handoffDir}: ${(err as Error).message}`;
      allWarnings.push(msg);
      await appendLog(outputAbs, 'logs/ingestion.log', msg);
    }
  }

  // Write the required output files
  const jsonl = allNormalizedRecords.map(r => JSON.stringify(r)).join('\n') + (allNormalizedRecords.length ? '\n' : '');
  await fs.writeFile(path.join(outputAbs, 'normalized-records.jsonl'), jsonl, 'utf8');

  await writeJson(path.join(outputAbs, 'normalized-records.json'), allNormalizedRecords);

  if (handoffFiles.length > 0) {
    const lastManifestPath = path.join(path.dirname(handoffFiles[handoffFiles.length-1]), 'manifest.json');
    if (await pathExists(lastManifestPath)) {
      await fs.copyFile(lastManifestPath, path.join(outputAbs, 'source-manifest-copy.json'));
    }
  } else {
    await writeJson(path.join(outputAbs, 'source-manifest-copy.json'), { note: 'no handoffs found' });
  }

  await writeJson(path.join(outputAbs, 'warnings.json'), allWarnings);

  const summary = [
    `# Agent Swarm Coder Vault Handoff Ingestion`,
    ``,
    `**Run**: ${outDirName}`,
    `**Source**: ${sourceAbs}`,
    `**Generated**: ${new Date().toISOString()}`,
    `**Handoff folders found**: ${handoffFiles.length}`,
    `**Total records normalized**: ${totalRecords}`,
    `**Warnings**: ${allWarnings.length}`,
    ``,
    `## Counts by record_type`,
    ``
  ];
  const counts: Record<string, number> = {};
  for (const r of allNormalizedRecords) {
    const t = r.record_type || 'unknown';
    counts[t] = (counts[t] || 0) + 1;
  }
  for (const [t, c] of Object.entries(counts).sort()) {
    summary.push(`- ${t}: ${c}`);
  }
  summary.push(``);
  summary.push(`## Processed runs`);
  for (const r of processedHandoffs) summary.push(`- ${r}`);
  summary.push(``);
  if (allWarnings.length) {
    summary.push(`## Warnings`);
    for (const w of allWarnings) summary.push(`- ${w}`);
  } else {
    summary.push(`No warnings.`);
  }
  summary.push(``);
  summary.push(`## Notes`);
  summary.push(`- Raw agent run artifacts and vault-handoff/ folders were not modified (read-only ingestion).`);
  summary.push(`- Records are normalized copies from records.jsonl, with added ingested metadata and preserved lineage (source_run_path, content_ref, source_ref, etc.).`);
  summary.push(`- Uses vault.v1 shapes per VAULT_DATA_CONTRACT; unknown record_types preserved as VaultArtifact with warning.`);
  summary.push(`- This is manual/local ingestion only. No Supabase, no live sync, no auto pipeline.`);
  summary.push(`- Source manifests and per-run evidence/decision logs copied/preserved where available.`);
  summary.push(`- See normalized-records.jsonl for full data.`);
  await fs.writeFile(path.join(outputAbs, 'ingestion-summary.md'), summary.join('\n'), 'utf8');

  if (processedHandoffs.length === 1) {
    const runDir = path.join(sourceAbs, processedHandoffs[0]);
    const ev = path.join(runDir, 'evidence-record.json');
    const dl = path.join(runDir, 'decision-log.md');
    if (await pathExists(ev)) await fs.copyFile(ev, path.join(outputAbs, 'evidence-record.json'));
    if (await pathExists(dl)) await fs.copyFile(dl, path.join(outputAbs, 'decision-log.md'));
  }

  await appendLog(outputAbs, 'logs/ingestion.log', `Ingestion complete. records=${totalRecords} warnings=${allWarnings.length}`);

  console.log(`=== INGEST COMPLETE ===`);
  console.log(`output: ${outputAbs}`);
  console.log(`handoffs: ${handoffFiles.length}`);
  console.log(`records: ${totalRecords}`);
  console.log(`warnings: ${allWarnings.length}`);
  console.log(`summary: ${path.join(outputAbs, 'ingestion-summary.md')}`);
  if (allWarnings.length) {
    console.log(`See warnings.json for details.`);
  }

  return { output: outputAbs, handoffs: handoffFiles.length, records: totalRecords, warnings: allWarnings.length };
}

async function pathExists(p: string) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function main() {
  const args = process.argv.slice(2);
  let source = 'outputs/coding-agent-runs';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--source' || args[i] === '-s') {
      source = args[++i] || source;
    }
  }
  await ingestAgentHandoff({ source });
}

const isDirectRun = !!process.argv[1] && (process.argv[1].includes('ingest-agent-handoff.ts') || process.argv[1].includes('ingest-agent-handoff.js'));
if (isDirectRun) {
  main().catch(err => {
    console.error('AGENT-HANDOFF-INGEST FAILED:', err);
    process.exit(1);
  });
}
