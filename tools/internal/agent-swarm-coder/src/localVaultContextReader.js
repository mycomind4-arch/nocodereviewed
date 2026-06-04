/**
 * localVaultContextReader.js
 * Reads normalized Vault records from local ingestion outputs (produced by vault-ingestion-parser
 * from agent-swarm-coder vault-handoffs) to provide prior context/memory for a new goal.
 *
 * Searches under outputs/vault-ingestion-runs/ (and tools/internal/vault-ingestion-parser/outputs/... for dev)
 * for normalized-records.jsonl (or .json fallback).
 * Loads records (already vault.v1 shaped from handoff + ingest metadata like ingested_at, source_handoff_path).
 * Filters by project match if record.project overlaps current inspection or goal.
 * Ranks relevance deterministically: token overlap (goal lowercased words) in title/summary/tags/artifact_type/source_run_path + bonus for useful types (decision-log, evidence, implementation-*, next-action, rollback, command-results) + recency from created_at + confidence.
 * Limits to top ~15, marks those with low confidence (<0.4) or old created_at (>90 days) as "stale_or_low_confidence".
 * Redacts any 'content' fields using safetyGuard to ensure no secrets.
 * Never mutates sources. Preserves all lineage (source_run_path, source_ref, etc), evidence_status, promote_to_long_term.
 * Returns { records: selected[], loadedCount, warnings, sourceDirs }
 */

import fs from 'node:fs';
import path from 'node:path';
import { redactSecrets } from './safetyGuard.js';

const VAULT_INGEST_BASES = [
  'outputs/vault-ingestion-runs',
  'tools/internal/vault-ingestion-parser/outputs/vault-ingestion-runs'
];

function tokenize(text) {
  if (!text) return new Set();
  return new Set(String(text).toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2));
}

function scoreRecord(record, goalTokens, now = new Date()) {
  let score = 0;
  const title = record.title || '';
  const summary = record.summary || '';
  const tags = (record.tags || []).join(' ');
  const atype = record.artifact_type || record.record_type || '';
  const src = record.source_run_path || '';

  const recTokens = new Set([...tokenize(title), ...tokenize(summary), ...tokenize(tags), ...tokenize(atype), ...tokenize(src)]);
  for (const t of goalTokens) {
    if (recTokens.has(t)) score += 3;
  }

  // type bonuses for useful prior intel
  if (/decision|evidence|implementation|plan|next.action|rollback|command/.test(atype.toLowerCase() + ' ' + (record.record_type||''))) {
    score += 5;
  }
  if (record.promote_to_long_term) score += 2;

  // recency
  if (record.created_at) {
    try {
      const ageDays = (now - new Date(record.created_at)) / (1000*3600*24);
      if (ageDays < 7) score += 4;
      else if (ageDays < 30) score += 2;
      else if (ageDays > 180) score -= 3;
    } catch {}
  }

  // confidence
  const conf = typeof record.confidence === 'number' ? record.confidence : 0.7;
  score += Math.floor(conf * 5);

  // project match bonus (if present)
  if (record.project && /project|inspect|improv/.test(record.project.toLowerCase())) score += 2;

  return Math.max(0, score);
}

function isStaleOrLowConf(record, now = new Date()) {
  const conf = typeof record.confidence === 'number' ? record.confidence : 0.7;
  if (conf < 0.4) return true;
  if (record.created_at) {
    try {
      const ageDays = (now - new Date(record.created_at)) / (1000*3600*24);
      if (ageDays > 90) return true;
    } catch {}
  }
  if (record.evidence_status && /reject|supersed/.test(String(record.evidence_status))) return true;
  return false;
}

function redactRecord(rec) {
  const copy = { ...rec };
  if (copy.content) copy.content = redactSecrets(String(copy.content).slice(0, 2000));
  if (copy.summary) copy.summary = redactSecrets(String(copy.summary));
  // tags/title etc usually safe, but redact any long strings that look secret-ish if present
  return copy;
}

export function findVaultIngestionDirs() {
  const dirs = [];
  for (const base of VAULT_INGEST_BASES) {
    try {
      if (!fs.existsSync(base)) continue;
      const subs = fs.readdirSync(base, { withFileTypes: true })
        .filter(d => d.isDirectory() && /agent-swarm|vault-ingest/.test(d.name))
        .map(d => path.join(base, d.name));
      for (const sub of subs) {
        const jl = path.join(sub, 'normalized-records.jsonl');
        const j = path.join(sub, 'normalized-records.json');
        if (fs.existsSync(jl) || fs.existsSync(j)) {
          dirs.push(sub);
        }
      }
    } catch (e) { /* ignore missing */ }
  }
  // sort newest first by dir name stamp
  dirs.sort((a,b) => path.basename(b).localeCompare(path.basename(a)));
  return dirs;
}

export function loadNormalizedRecords(dirs = findVaultIngestionDirs(), limitPer = 100) {
  const all = [];
  const sources = [];
  for (const dir of dirs) {
    sources.push(dir);
    let loaded = [];
    const jl = path.join(dir, 'normalized-records.jsonl');
    const j = path.join(dir, 'normalized-records.json');
    try {
      if (fs.existsSync(jl)) {
        const txt = fs.readFileSync(jl, 'utf8');
        loaded = txt.trim().split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
      } else if (fs.existsSync(j)) {
        loaded = JSON.parse(fs.readFileSync(j, 'utf8'));
      }
    } catch (e) { /* skip bad */ }
    if (loaded.length > limitPer) loaded = loaded.slice(0, limitPer);
    all.push(...loaded);
  }
  return { records: all, sources };
}

export function rankAndFilterForGoal(allRecords, goal, inspection = null, max = 15) {
  const goalTokens = tokenize(goal);
  const now = new Date();
  const currentProject = (inspection && (inspection.packageInfo?.name || inspection.projectRoot)) || null;

  const scored = allRecords.map(r => {
    let s = scoreRecord(r, goalTokens, now);
    if (currentProject && r.project && String(r.project).toLowerCase().includes(String(currentProject).toLowerCase().slice(-20))) {
      s += 4;
    }
    const redacted = redactRecord(r);
    const stale = isStaleOrLowConf(r, now);
    return { record: redacted, score: s, stale };
  });

  scored.sort((a,b) => b.score - a.score);

  const selected = scored.slice(0, max).map(item => ({
    ...item.record,
    _relevance_score: item.score,
    _stale_or_low_confidence: item.stale
  }));

  const staleLow = scored.filter(s => s.stale && s.score > 0).slice(0, 5).map(s => s.record.id || s.record.title);

  return {
    selected,
    loadedCount: allRecords.length,
    selectedCount: selected.length,
    staleOrLowIds: staleLow,
    warnings: staleLow.length ? [`${staleLow.length} records marked stale/low-confidence and deprioritized`] : []
  };
}

export function readContextRecords(goal, inspection = null, opts = {}) {
  const { max = 15 } = opts;
  const { records: all, sources } = loadNormalizedRecords();
  if (!all.length) {
    return { records: [], loadedCount: 0, selectedCount: 0, sources, warnings: ['No local Vault ingestion outputs found under outputs/vault-ingestion-runs/'] };
  }
  const ranked = rankAndFilterForGoal(all, goal, inspection, max);
  return {
    records: ranked.selected,
    loadedCount: ranked.loadedCount,
    selectedCount: ranked.selectedCount,
    sources,
    warnings: ranked.warnings,
    staleOrLow: ranked.staleOrLowIds
  };
}

export default {
  findVaultIngestionDirs,
  loadNormalizedRecords,
  rankAndFilterForGoal,
  readContextRecords
};
