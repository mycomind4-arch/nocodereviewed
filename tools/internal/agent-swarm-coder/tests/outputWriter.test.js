import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { slugify, makeRunDir, writeRunPackage } from '../src/outputWriter.js';

const tmpOutBase = path.join(os.tmpdir(), 'agent-outputs-test');

after(() => {
  try { fs.rmSync(tmpOutBase, { recursive: true, force: true }); } catch {}
});

describe('outputWriter', () => {
  it('slugifies goals safely', () => {
    const s = slugify('Inspect this project and recommend the NEXT highest-value! improvement');
    assert.ok(s.startsWith('inspect-this-project-and-recommend-the-next-highest-value'));
    assert.ok(s.length <= 80);
    assert.equal(slugify(''), 'goal');
  });

  it('creates run dir with stamp-slug and writes full package', () => {
    const fakePlan = {
      objective: 'test goal',
      assumptions: ['a'],
      constraints: ['c'],
      filesLikelyToModify: ['src/x.js'],
      implementationSteps: [{ step: 1, action: 'do' }],
      riskChecklist: ['r'],
      testCommands: ['npm test'],
      rollbackPlan: { strategy: 'bak', backupLocations: [], restoreCommands: [] }
    };
    const { runDir, runId } = makeRunDir(tmpOutBase, 'Test output package creation');
    assert.ok(runId.includes('test-output-package-creation'));

    const changed = [{ path: 'src/x.js', action: 'write-dry' }];
    const cmds = [{ command: 'npm test', exitCode: 0, stdout: 'ok', stderr: '', durationMs: 5, timestamp: new Date().toISOString(), success: true }];

    const written = writeRunPackage(runDir, {
      runId,
      goal: 'Test output package creation',
      dryRun: true,
      inspection: { projectRoot: '/tmp/f' },
      plan: fakePlan,
      commandResults: cmds,
      changed,
      repairs: [],
      evidence: null,
      qaChecklist: ['- [ ] review'],
      decisionLog: ['started'],
      nextAction: ['next'],
      rollback: fakePlan.rollbackPlan,
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString()
    });

    assert.ok(fs.existsSync(path.join(written, 'run-summary.md')));
    assert.ok(fs.existsSync(path.join(written, 'implementation-plan.json')));
    assert.ok(fs.existsSync(path.join(written, 'implementation-plan.md')));
    assert.ok(fs.existsSync(path.join(written, 'command-results.json')));
    assert.ok(fs.existsSync(path.join(written, 'changed-files.json')));
    assert.ok(fs.existsSync(path.join(written, 'evidence-record.json')));
    assert.ok(fs.existsSync(path.join(written, 'qa-checklist.md')));
    assert.ok(fs.existsSync(path.join(written, 'risk-checklist.md')));
    assert.ok(fs.existsSync(path.join(written, 'rollback-plan.md')));
    assert.ok(fs.existsSync(path.join(written, 'decision-log.md')));
    assert.ok(fs.existsSync(path.join(written, 'next-action.md')));
    // no repair-prompt.md since no repairs
    assert.ok(!fs.existsSync(path.join(written, 'repair-prompt.md')));
  });
});
