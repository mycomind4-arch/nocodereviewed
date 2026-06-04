import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createImplementationPlan, generateRepairPrompt } from '../src/taskPlanner.js';

describe('taskPlanner', () => {
  const fakeInspection = {
    projectRoot: '/tmp/fake',
    hasPackageJson: true,
    packageInfo: { name: 'test-proj' },
    scripts: { test: 'npm test', build: 'npm run build' },
    importantFiles: [{ path: 'src/foo.js' }],
    warnings: []
  };

  it('produces full structured plan', () => {
    const plan = createImplementationPlan('Add a small feature to improve X', fakeInspection);
    assert.ok(plan.objective.includes('Add a small feature'));
    assert.ok(Array.isArray(plan.assumptions) && plan.assumptions.length > 2);
    assert.ok(Array.isArray(plan.constraints));
    assert.ok(Array.isArray(plan.implementationSteps) && plan.implementationSteps.length >= 4);
    assert.ok(Array.isArray(plan.riskChecklist));
    assert.ok(Array.isArray(plan.testCommands));
    assert.ok(plan.rollbackPlan && plan.rollbackPlan.strategy);
    assert.ok(plan.filesLikelyToModify.length > 0);
  });

  it('includes test commands from inspection', () => {
    const plan = createImplementationPlan('Improve tests', fakeInspection);
    assert.ok(plan.testCommands.some(c => c.includes('test')));
  });

  it('generates repair prompt and hint for failures', () => {
    const fail = { command: 'npm test', exitCode: 1, stderr: 'AssertionError: expected 1', stdout: '' };
    const rp = generateRepairPrompt(fail);
    assert.ok(rp.prompt.includes('npm test'));
    assert.ok(rp.simulatedFixHint && rp.simulatedFixHint.type);
  });
});
