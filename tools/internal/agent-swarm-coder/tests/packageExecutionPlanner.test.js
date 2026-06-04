import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { planPackageExecution } from '../src/packageExecutionPlanner.js';

describe('packageExecutionPlanner', () => {
  const fakePkg = {
    objective: 'Demo safe package exec',
    files: [
      { path: 'tests/fixtures/demo-safe.txt', action: 'create', content: 'ok', description: 'demo' },
      { path: '.env', action: 'modify', content: 'bad', description: 'secret' }
    ],
    commands: ['node --version', 'rm -rf /tmp/evil'],
    testCommands: ['echo test'],
    qaChecklist: ['review'],
    riskChecklist: ['none']
  };

  it('produces executable steps, fileOps, commandPlan and safety analysis', () => {
    const plan = planPackageExecution({ package: fakePkg }, '.', {});
    assert.ok(plan.objective.includes('Demo'));
    assert.ok(plan.fileOps.length >= 1);
    assert.ok(plan.steps.some(s => s.type === 'file'));
    assert.ok(plan.steps.some(s => s.type === 'command'));
    assert.ok(plan.safety.warnings.some(w => w.includes('secret') || w.includes('Blocked')));
    assert.ok(plan.safety.blockedActions.some(b => b.includes('secret') || b.includes('rm -rf')));
    assert.ok(plan.commands.some(c => c.command.includes('node --version')));
  });

  it('blocks deletes and secrets without approval flags', () => {
    const p2 = { ...fakePkg, files: [{ path: 'foo.txt', action: 'delete' }] };
    const plan = planPackageExecution({ package: p2 }, '.', { allowDeletes: false });
    assert.ok(plan.safety.blockedActions.some(b => b.includes('delete')));
  });

  it('allows when approvals provided in opts or package', () => {
    const p3 = { objective: 'x', files: [{ path: 'foo.txt', action: 'delete', approved: true }], commands: [] };
    const plan = planPackageExecution({ package: p3 }, '.', { allowDeletes: true });
    assert.equal(plan.safety.blockedActions.length, 0);
  });
});
