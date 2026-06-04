import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { readContextRecords, rankAndFilterForGoal, loadNormalizedRecords } from '../src/localVaultContextReader.js';
import { redactSecrets } from '../src/safetyGuard.js';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-ctx-reader-'));

before(() => {
  // copy fixture to a simulated vault-ingest dir under tmp
  const ingestDir = path.join(tmp, 'outputs', 'vault-ingestion-runs', '20260601T000000-test-ctx');
  fs.mkdirSync(path.join(ingestDir), { recursive: true });
  fs.copyFileSync(
    'tools/internal/agent-swarm-coder/tests/fixtures/vault-ingest-fixture/normalized-records.jsonl',
    path.join(ingestDir, 'normalized-records.jsonl')
  );
  // also a json version for fallback test
  const recs = fs.readFileSync(path.join(ingestDir, 'normalized-records.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map(l=>JSON.parse(l));
  fs.writeFileSync(path.join(ingestDir, 'normalized-records.json'), JSON.stringify(recs), 'utf8');
});

after(() => {
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
});

describe('localVaultContextReader', () => {
  it('loads normalized records from fixture (jsonl and json)', () => {
    const { records, sources } = loadNormalizedRecords([path.join(tmp, 'outputs', 'vault-ingestion-runs', '20260601T000000-test-ctx')]);
    assert.ok(records.length >= 4);
    assert.ok(sources.length > 0);
    assert.ok(records.some(r => r.record_type === 'VaultArtifact' && /inspect/.test(r.title || '')));
  });

  it('ranks relevant records above irrelevant for goal mentioning inspect project context vault', () => {
    const goal = 'inspect this project and recommend the next highest-value improvement using prior local Vault context';
    const { records: all } = loadNormalizedRecords([path.join(tmp, 'outputs', 'vault-ingestion-runs', '20260601T000000-test-ctx')]);
    const ranked = rankAndFilterForGoal(all, goal, null, 3);
    assert.ok(ranked.selected.length >= 2);
    const topTitles = ranked.selected.map(r => r.title || '').join(' ');
    assert.ok(/inspect|context|vault|decision|implementation/i.test(topTitles), 'relevant should rank high');
    assert.ok(!/unrelated|foo bar/i.test(ranked.selected[0] ? ranked.selected[0].title || '' : ''), 'unrelated should not be top ranked');
  });

  it('preserves source lineage, evidence_status, promote_to_long_term, source_run_path', () => {
    const goal = 'inspect project vault context';
    const { records: all } = loadNormalizedRecords([path.join(tmp, 'outputs', 'vault-ingestion-runs', '20260601T000000-test-ctx')]);
    const ranked = rankAndFilterForGoal(all, goal, null, 5);
    const first = ranked.selected[0];
    assert.ok(first.source_run_path && first.source_run_path.includes('coding-agent-runs'));
    assert.ok('promote_to_long_term' in first);
    assert.ok(first.evidence_status);
    assert.ok(first._relevance_score !== undefined);
  });

  it('marks stale or low-confidence records', () => {
    const goal = 'inspect project';
    const { records: all } = loadNormalizedRecords([path.join(tmp, 'outputs', 'vault-ingestion-runs', '20260601T000000-test-ctx')]);
    const ranked = rankAndFilterForGoal(all, goal, null, 10);
    const staleList = ranked.staleOrLow || [];
    assert.ok(staleList.length >= 1 || ranked.selected.some(r => r._stale_or_low_confidence), 'stale low conf (old date or low conf) should be flagged');
  });

  it('excludes or deprioritizes low value when limit reached', () => {
    const goal = 'inspect project vault';
    const { records: all } = loadNormalizedRecords([path.join(tmp, 'outputs', 'vault-ingestion-runs', '20260601T000000-test-ctx')]);
    const ranked = rankAndFilterForGoal(all, goal, null, 2);
    assert.ok(ranked.selected.length <= 2);
  });

  it('reader redacts secrets if any content present', () => {
    // simulate a record with secret in content
    const fake = [{ id: 'sec', record_type: 'VaultArtifact', title: 'test', summary: 'ok', content: 'API_KEY=supersecret123', created_at: new Date().toISOString(), tags: [] }];
    const ranked = rankAndFilterForGoal(fake, 'test', null, 1);
    const out = ranked.selected[0];
    assert.ok(!String(out.content || '').includes('supersecret123'));
    assert.ok(redactSecrets('API_KEY=supersecret123').includes('[REDACTED]'));
  });
});
