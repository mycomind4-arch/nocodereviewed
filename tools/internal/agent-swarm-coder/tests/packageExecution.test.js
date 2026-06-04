import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { runAgent } from '../src/codingAgent.js';
import { parsePackageFile } from '../src/packageParser.js';
import { planPackageExecution } from '../src/packageExecutionPlanner.js';
import { makePackageExecutionDir, writePackageExecutionPackage } from '../src/outputWriter.js';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-pkgexec-'));

before(() => {
  fs.mkdirSync(path.join(tmp, 'tests', 'fixtures'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'package.json'), '{"name":"test-proj","scripts":{"test":"echo ok"}}');
  // minimal valid package inside tmp project
  fs.writeFileSync(path.join(tmp, 'tests/fixtures/mini-pkg.md'), `# Mini
## Objective
Test package exec in isolated tmp.

## Files
### create: tests/fixtures/demo-from-pkg.txt
\`\`\`
demo content
\`\`\`

## Commands
- node --version
`);
});

after(() => {
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
});

describe('package execution flow (dry-run)', () => {
  it('parses, plans, and runAgent in package mode produces package-execution output dir and summary (dry-run, no real writes)', async () => {
    const pkgPath = path.join(tmp, 'tests/fixtures/mini-pkg.md');
    const res = await runAgent({
      projectPath: tmp,
      packagePath: pkgPath,
      dryRun: true
    });

    assert.ok(res.packageMode);
    assert.ok(res.runDir.includes('package-execution'));
    assert.ok(fs.existsSync(res.summaryPath));
    const summary = fs.readFileSync(res.summaryPath, 'utf8');
    assert.match(summary, /Package Execution Summary/);
    assert.match(summary, /demo-from-pkg/);
    // confirm no real file written by the create in dry
    const wouldBe = path.join(tmp, 'tests/fixtures/demo-from-pkg.txt');
    assert.ok(!fs.existsSync(wouldBe), 'dry-run must not create the target file');
  });

  it('planner blocks unsafe and records requiresApproval', () => {
    const badPkg = {
      objective: 'bad',
      files: [{ path: '.env', action: 'modify', content: 'x' }, { path: 'to-del.txt', action: 'delete' }],
      commands: ['npm publish']
    };
    const plan = planPackageExecution({ package: badPkg }, tmp, { allowDeletes: false, allowSecretEdits: false });
    assert.ok(plan.safety.blockedActions.length >= 2);
    assert.ok(plan.safety.requiresApproval.length > 0);
  });

  it('output writer for package produces the required filenames', () => {
    const { runDir } = makePackageExecutionDir(path.join(tmp, 'out'), 'test-pkg');
    writePackageExecutionPackage(runDir, {
      runId: 'test-123',
      packageRef: 'mini',
      dryRun: true,
      parsedPackage: { objective: 't', files: [] },
      executionPlan: { objective: 't', fileOps: [], commands: [], safety: { warnings: [], blockedActions: [], requiresApproval: [] }, qaChecklist: [], nextAction: [] },
      commandResults: [],
      changed: [],
      repairs: [],
      startedAt: new Date().toISOString()
    });
    const required = [
      'package-execution-summary.md',
      'parsed-package.json',
      'execution-plan.json',
      'file-change-plan.json',
      'changed-files.json',
      'command-results.json',
      'qa-checklist.md',
      'risk-checklist.md',
      'rollback-plan.md',
      'evidence-record.json',
      'decision-log.md',
      'next-action.md'
    ];
    for (const f of required) {
      assert.ok(fs.existsSync(path.join(runDir, f)), `missing ${f}`);
    }
  });
});
