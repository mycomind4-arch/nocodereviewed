import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  buildVaultHandoffRecords,
  writeVaultHandoff,
  createVaultHandoffForRun,
  VaultHandoffError
} from '../src/vaultHandoffBuilder.js';
import { redactSecrets } from '../src/safetyGuard.js';

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-vault-handoff-'));

function makeGoalRun(runId) {
  const dir = path.join(tmpRoot, runId);
  fs.mkdirSync(dir, { recursive: true });
  // minimal goal artifacts
  fs.writeFileSync(path.join(dir, 'implementation-plan.json'), JSON.stringify({
    objective: 'test goal for handoff',
    implementationSteps: [{step:1, action:'do thing'}],
    testCommands: ['npm test'],
    rollbackPlan: {strategy: 'backups'}
  }));
  fs.writeFileSync(path.join(dir, 'evidence-record.json'), JSON.stringify({
    id: `artifact_agent_${runId}`,
    schema_version: 'vault.v1',
    record_type: 'VaultArtifact',
    source_platform: 'agent-swarm-coder',
    created_at: '2026-06-04T12:00:00.000Z',
    tags: ['agent-swarm-coder'],
    privacy_level: 'local_private',
    summary: 'Coding agent run: test goal',
    meta: { project: 'test-proj' },
    outcome: 'dry-run'
  }));
  fs.writeFileSync(path.join(dir, 'decision-log.md'), '# Decision Log\n- ran: npm test -> 0\n- finished');
  fs.writeFileSync(path.join(dir, 'command-results.json'), JSON.stringify([
    { command: 'npm test', exitCode: 0, stdout: 'ok\nAPI_KEY=secret123\n', success: true, durationMs: 10 },
    { command: 'echo hi', exitCode: 0, stdout: 'hi', success: true }
  ]));
  fs.writeFileSync(path.join(dir, 'changed-files.json'), JSON.stringify([{ path: 'foo.txt', action: 'create-dry' }]));
  fs.writeFileSync(path.join(dir, 'rollback-plan.md'), 'Strategy: use .bak\nBackups: foo.txt.bak-*');
  fs.writeFileSync(path.join(dir, 'next-action.md'), '- Review everything\n- Do not apply without review');
  fs.writeFileSync(path.join(dir, 'run-summary.md'), '# Run Summary\n**Project**: test-proj\n**Mode**: dry-run');
  return dir;
}

function makePackageRun(runId) {
  const dir = path.join(tmpRoot, runId);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'parsed-package.json'), JSON.stringify({
    schema_version: 'agent-package.v1',
    objective: 'test package exec for handoff',
    files: [{path: 'bar.txt', action: 'create', content: 'safe'}],
    commands: ['node --version']
  }));
  fs.writeFileSync(path.join(dir, 'execution-plan.json'), JSON.stringify({
    objective: 'test package exec for handoff',
    safety: { blockedActions: [], dryRunDefault: true }
  }));
  fs.writeFileSync(path.join(dir, 'evidence-record.json'), JSON.stringify({
    id: `artifact_agent_${runId}`,
    schema_version: 'vault.v1',
    record_type: 'VaultArtifact',
    source_platform: 'agent-swarm-coder',
    created_at: '2026-06-04T12:01:00.000Z',
    tags: ['agent-swarm-coder', 'package-execution'],
    privacy_level: 'local_private',
    summary: 'Package execution',
    meta: { project: 'test-proj-pkg' },
    outcome: 'dry-run'
  }));
  fs.writeFileSync(path.join(dir, 'command-results.json'), JSON.stringify([
    { command: 'node --version', exitCode: 0, stdout: 'v18.0.0', success: true }
  ]));
  fs.writeFileSync(path.join(dir, 'changed-files.json'), '[]');
  fs.writeFileSync(path.join(dir, 'decision-log.md'), '# pkg decision\n- ran node --version');
  fs.writeFileSync(path.join(dir, 'rollback-plan.md'), 'Use .bak');
  fs.writeFileSync(path.join(dir, 'next-action.md'), '- Review package');
  fs.writeFileSync(path.join(dir, 'package-execution-summary.md'), '# Pkg Exec\n**Project**: test-proj-pkg');
  return dir;
}

before(() => {
  // create two fixture runs
  makeGoalRun('20260604T120000-test-goal-handoff');
  makePackageRun('20260604T120100-test-pkg-handoff');
});

after(() => {
  try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch {}
});

describe('vaultHandoffBuilder', () => {
  it('generates vault handoff from goal-mode run artifacts (no modification to originals)', () => {
    const runDir = path.join(tmpRoot, '20260604T120000-test-goal-handoff');
    const originalFiles = fs.readdirSync(runDir);
    const built = buildVaultHandoffRecords(runDir);
    assert.ok(Array.isArray(built.records) && built.records.length >= 8);
    assert.ok(built.manifest);
    assert.equal(built.manifest.source_application, 'agent-swarm-coder');
    assert.ok(built.manifest.record_counts['VaultArtifact'] >= 7);
    assert.ok(built.manifest.record_counts['VaultCommand'] >= 1);
    assert.ok(built.summary.includes('Vault Handoff for'));
    // originals untouched
    assert.deepEqual(fs.readdirSync(runDir).sort(), originalFiles.sort());
    // records use contract fields + query extras
    const runArt = built.records.find(r => r.id.includes('run-artifact'));
    assert.equal(runArt.record_type, 'VaultArtifact');
    assert.equal(runArt.source_platform, 'agent-swarm-coder');
    assert.equal(runArt.source_tool, 'agent-swarm-coder');
    assert.ok(runArt.project);
    assert.ok(runArt.source_run_path.includes('20260604T120000'));
    assert.equal(runArt.privacy_level, 'local_private');
    assert.equal(runArt.evidence_status, 'needs_review');
    assert.equal(typeof runArt.promote_to_long_term, 'boolean');
    assert.ok(runArt.content_ref || runArt.content);
  });

  it('generates vault handoff from package-execution artifacts', () => {
    const runDir = path.join(tmpRoot, '20260604T120100-test-pkg-handoff');
    const built = buildVaultHandoffRecords(runDir);
    assert.ok(built.isPackageMode);
    const pkgRec = built.records.find(r => r.id.includes('impl-package'));
    assert.ok(pkgRec);
    assert.ok(pkgRec.title.includes('Implementation Package'));
    assert.ok(built.records.some(r => r.record_type === 'VaultCommand'));
  });

  it('records.jsonl is valid (one json per line, each has id/record_type)', () => {
    const runDir = path.join(tmpRoot, '20260604T120000-test-goal-handoff');
    const handoffDir = createVaultHandoffForRun(runDir).handoffDir;
    const jsonlPath = path.join(handoffDir, 'records.jsonl');
    assert.ok(fs.existsSync(jsonlPath));
    const lines = fs.readFileSync(jsonlPath, 'utf8').trim().split('\n');
    assert.ok(lines.length >= 8);
    for (const line of lines) {
      const rec = JSON.parse(line);
      assert.ok(rec.id && typeof rec.id === 'string');
      assert.ok(rec.record_type);
      assert.equal(rec.schema_version, 'vault.v1');
    }
  });

  it('manifest includes source run path and record counts', () => {
    const runDir = path.join(tmpRoot, '20260604T120000-test-goal-handoff');
    const handoffDir = createVaultHandoffForRun(runDir).handoffDir;
    const manifest = JSON.parse(fs.readFileSync(path.join(handoffDir, 'manifest.json'), 'utf8'));
    assert.ok(manifest.source_run_path.includes('20260604T120000-test-goal-handoff'));
    assert.ok(manifest.record_counts);
    assert.ok(Array.isArray(manifest.included_record_types));
    assert.equal(manifest.export_version, 'agent-run-handoff.v1');
  });

  it('original artifacts are not modified by handoff creation', () => {
    const runDir = path.join(tmpRoot, '20260604T120000-test-goal-handoff');
    const before = fs.readFileSync(path.join(runDir, 'evidence-record.json'), 'utf8');
    createVaultHandoffForRun(runDir);
    const after = fs.readFileSync(path.join(runDir, 'evidence-record.json'), 'utf8');
    assert.equal(before, after);
    // no vault-handoff at top, only inside
    assert.ok(fs.existsSync(path.join(runDir, 'vault-handoff')));
    assert.ok(!fs.existsSync(path.join(tmpRoot, 'vault-handoff')));
  });

  it('backfill command flow works on a fixture run (via create)', () => {
    const runDir = path.join(tmpRoot, '20260604T120100-test-pkg-handoff');
    // simulate backfill by calling the creator directly (cli will do same)
    const res = createVaultHandoffForRun(runDir);
    assert.ok(fs.existsSync(path.join(res.handoffDir, 'manifest.json')));
    assert.ok(fs.existsSync(path.join(res.handoffDir, 'records.jsonl')));
    assert.ok(fs.existsSync(path.join(res.handoffDir, 'summary.md')));
    const man = JSON.parse(fs.readFileSync(path.join(res.handoffDir, 'manifest.json'), 'utf8'));
    assert.ok(man.source_run_path.includes('test-pkg-handoff'));
  });

  it('no secrets are copied into handoff records', () => {
    const runDir = path.join(tmpRoot, '20260604T120000-test-goal-handoff');
    const built = buildVaultHandoffRecords(runDir);
    const jsonlStr = built.records.map(r => JSON.stringify(r)).join('\n');
    assert.ok(!jsonlStr.includes('secret123'));
    assert.ok(!jsonlStr.includes('API_KEY=secret123'));
    // but command is present redacted
    const cmdRec = built.records.find(r => r.record_type === 'VaultCommand' && r.command && r.command.includes('npm test'));
    assert.ok(cmdRec);
    assert.ok(cmdRec.content.includes('[REDACTED]') || !cmdRec.content.includes('secret'));
  });
});
