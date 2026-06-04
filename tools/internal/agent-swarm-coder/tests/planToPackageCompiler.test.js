import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { compilePlanToPackage, renderPlanAsPackageMarkdown, PlanCompileError } from '../src/planToPackageCompiler.js';
import { planPackageExecution } from '../src/packageExecutionPlanner.js';
import { parsePackageFile } from '../src/packageParser.js';
import { runAgent } from '../src/codingAgent.js';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-plan2pkg-'));
let samplePlanPath;
let badPlanPath;
let planWithDeletePath;

before(() => {
  fs.mkdirSync(path.join(tmp, 'src'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'package.json'), '{"name":"demo","scripts":{"test":"echo ok"}}');
  fs.writeFileSync(path.join(tmp, 'src/static-app.js'), 'export const x=1;\n');
  fs.writeFileSync(path.join(tmp, 'README.md'), '# demo\n');

  const validPlan = {
    objective: 'create a harmless demo note file explaining the closed-loop flow',
    assumptions: ['local'],
    constraints: ['dry-run default'],
    filesLikelyToModify: ['package.json', 'src/', 'tools/internal/agent-swarm-coder/src/'],
    implementationSteps: [
      { step: 1, action: 'Inspect', files: [] },
      { step: 2, action: 'Produce plan', files: ['implementation-plan.json'] },
      { step: 3, action: 'Propose changes', files: ['package.json', 'src/'] }
    ],
    riskChecklist: ['review required'],
    testCommands: ['node --version', 'npm test'],
    rollbackPlan: { strategy: 'Use .bak', backupLocations: ['package.json.bak-*'], restoreCommands: ['cp ...'] }
  };
  samplePlanPath = path.join(tmp, 'valid-plan.json');
  fs.writeFileSync(samplePlanPath, JSON.stringify(validPlan, null, 2));

  const bad = { objective: 'x' }; // missing steps
  badPlanPath = path.join(tmp, 'bad-plan.json');
  fs.writeFileSync(badPlanPath, JSON.stringify(bad));

  const riskyPlan = {
    objective: 'do risky thing',
    implementationSteps: [{ step: 1, action: 'rm stuff' }],
    filesLikelyToModify: ['.env', 'to-delete.txt'],
    testCommands: ['rm -rf /tmp/foo'],
    riskChecklist: []
  };
  planWithDeletePath = path.join(tmp, 'risky-plan.json');
  fs.writeFileSync(planWithDeletePath, JSON.stringify(riskyPlan));
});

after(() => {
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
});

describe('planToPackageCompiler', () => {
  it('converts valid implementation-plan.json to package', () => {
    const pkg = compilePlanToPackage(samplePlanPath, { projectPath: tmp });
    assert.equal(pkg.schema_version, 'agent-package.v1');
    assert.ok(pkg.objective.includes('closed-loop flow'));
    assert.ok(Array.isArray(pkg.files) && pkg.files.length >= 1);
    assert.ok(pkg.files.every(f => !f.path.endsWith('/')), 'no directory paths in files');
    assert.ok(pkg.files.some(f => f.path === 'package.json' || f.path.includes('static-app')));
    assert.ok(Array.isArray(pkg.implementationSteps) && pkg.implementationSteps.length >= 2);
    assert.deepEqual(pkg.approvals, { deletes: false, secretEdits: false, externalActions: false });
    assert.ok(Array.isArray(pkg.qaChecklist) && pkg.qaChecklist.length > 0);
    assert.ok(Array.isArray(pkg.riskChecklist));
    assert.ok(typeof pkg.rollbackNotes === 'string' && pkg.rollbackNotes.length > 0);
    assert.ok(typeof pkg.evidenceRequirements === 'string' && pkg.evidenceRequirements.length > 0);
    assert.ok(Array.isArray(pkg.nextAction) && pkg.nextAction.length > 0);
    assert.ok(Array.isArray(pkg.commands));
    assert.ok(Array.isArray(pkg.testCommands));
  });

  it('missing fields produce useful validation errors', () => {
    assert.throws(() => {
      compilePlanToPackage(badPlanPath, { projectPath: tmp });
    }, (err) => {
      assert.ok(err instanceof PlanCompileError);
      assert.match(err.message, /implementationSteps|missing required/i);
      return true;
    });

    assert.throws(() => {
      compilePlanToPackage(null);
    }, /must be a non-null object/);

    const noObj = { implementationSteps: [{}] };
    assert.throws(() => compilePlanToPackage(noObj), /objective/);
  });

  it('compiled package is accepted by package execution planner (and normalize/validate)', () => {
    const pkg = compilePlanToPackage(samplePlanPath, { projectPath: tmp });
    // direct planner
    const plan = planPackageExecution({ package: pkg }, tmp, { allowDeletes: false, allowSecretEdits: false });
    assert.ok(plan.objective);
    assert.ok(Array.isArray(plan.fileOps));
    assert.ok(Array.isArray(plan.safety.blockedActions));
    assert.ok(plan.safety.dryRunDefault === true);

    // also via parser path (write temp json and parse)
    const tmpJson = path.join(tmp, 'gen-pkg.json');
    fs.writeFileSync(tmpJson, JSON.stringify(pkg));
    const parsed = parsePackageFile(tmpJson, tmp);
    assert.ok(parsed.package.objective);
    const plan2 = planPackageExecution(parsed, tmp, {});
    assert.ok(plan2.steps.length > 0);
  });

  it('--compile-package path does not write target files in dry-run (via runAgent)', async () => {
    // Use a goal that would intend a note file; compiler + planner + dry exec must not materialize it
    const res = await runAgent({
      projectPath: tmp,
      goal: 'create a harmless demo note file explaining the closed-loop flow inside ' + tmp,
      compilePackage: true,
      dryRun: true
    });
    assert.ok(res.runDir);
    // The goal run dir must contain the generated artifacts
    const genJson = path.join(res.runDir, 'generated-implementation-package.json');
    const genMd = path.join(res.runDir, 'generated-implementation-package.md');
    const pathTxt = path.join(res.runDir, 'package-execution-output-path.txt');
    assert.ok(fs.existsSync(genJson), 'generated json must exist in goal run dir');
    assert.ok(fs.existsSync(genMd), 'generated md must exist');
    assert.ok(fs.existsSync(pathTxt), 'path txt must exist');

    // No demo note written (the goal mentions one; we never targeted a specific "note" filename in sanitize, and dry-run gates anyway)
    const possibleNote = path.join(tmp, 'demo-note-from-plan.md');
    const possibleNote2 = path.join(tmp, 'CLOSED_LOOP_FLOW.md');
    assert.ok(!fs.existsSync(possibleNote), 'demo note must not be written in dry-run');
    assert.ok(!fs.existsSync(possibleNote2), 'demo note must not be written in dry-run');

    // The package exec run also produced artifacts
    const execPath = fs.readFileSync(pathTxt, 'utf8').trim();
    assert.ok(fs.existsSync(execPath), 'package exec dir must exist');
    assert.ok(fs.existsSync(path.join(execPath, 'package-execution-summary.md')));
  });

  it('--plan mode works (reads plan json, compiles, runs package exec dry-run)', async () => {
    const res = await runAgent({
      projectPath: tmp,
      planPath: samplePlanPath,
      dryRun: true
    });
    assert.ok(res.packageMode || res.runDir.includes('package-execution'));
    assert.ok(fs.existsSync(res.runDir));
    assert.ok(fs.existsSync(path.join(res.runDir, 'execution-plan.json')));
    // parsed package inside should be the compiled one
    const parsed = path.join(res.runDir, 'parsed-package.json');
    if (fs.existsSync(parsed)) {
      const p = JSON.parse(fs.readFileSync(parsed, 'utf8'));
      assert.equal(p.schema_version, 'agent-package.v1');
      assert.ok(p.approvals.deletes === false);
    }
  });

  it('generated package contains QA, risk, evidence, rollback, and next action fields', () => {
    const pkg = compilePlanToPackage(samplePlanPath, { projectPath: tmp });
    assert.ok(Array.isArray(pkg.qaChecklist) && pkg.qaChecklist.some(q => /closed-loop|dry-run/i.test(String(q))));
    assert.ok(Array.isArray(pkg.riskChecklist) && pkg.riskChecklist.length > 0);
    assert.ok(typeof pkg.evidenceRequirements === 'string' && pkg.evidenceRequirements.length > 5);
    assert.ok(typeof pkg.rollbackNotes === 'string' && pkg.rollbackNotes.length > 5);
    assert.ok(Array.isArray(pkg.nextAction) && pkg.nextAction.some(n => /goal → plan|closed-loop/i.test(String(n))));
  });

  it('unsafe operations remain blocked (approvals false + planner blocks)', () => {
    const pkg = compilePlanToPackage(planWithDeletePath, { projectPath: tmp });
    assert.equal(pkg.approvals.deletes, false);
    assert.equal(pkg.approvals.secretEdits, false);
    const plan = planPackageExecution({ package: pkg }, tmp, { allowDeletes: false, allowSecretEdits: false });
    // .env and delete and rm should produce blocks
    assert.ok(plan.safety.blockedActions.some(b => b.includes('secret') || b.includes('delete') || b.includes('rm -rf')));
    assert.ok(plan.safety.warnings.length > 0 || plan.safety.blockedActions.length > 0);
  });

  it('render produces readable md with required sections', () => {
    const pkg = compilePlanToPackage(samplePlanPath, { projectPath: tmp });
    const md = renderPlanAsPackageMarkdown(pkg);
    assert.ok(md.includes('## Objective'));
    assert.ok(md.includes('## Files'));
    assert.ok(md.includes('## QA Checklist'));
    assert.ok(md.includes('## Risk Checklist'));
    assert.ok(md.includes('## Rollback Notes'));
    assert.ok(md.includes('## Evidence Requirements'));
    assert.ok(md.includes('## Next Action'));
    assert.ok(/approvals/i.test(md));
    assert.ok(/deletes: false/i.test(md));
  });
});
