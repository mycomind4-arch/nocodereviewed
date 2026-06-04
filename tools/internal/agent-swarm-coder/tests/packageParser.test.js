import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parsePackageFile, PackageParseError } from '../src/packageParser.js';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-pkgparse-'));

before(() => {
  // valid json fixture
  fs.writeFileSync(path.join(tmp, 'valid.json'), JSON.stringify({
    schema_version: 'agent-package.v1',
    objective: 'Create a demo artifact for package execution test',
    files: [
      { path: 'tests/fixtures/demo-artifact.txt', action: 'create', content: 'hello from package\n', description: 'demo' }
    ],
    commands: ['node --version'],
    testCommands: [],
    qaChecklist: ['- [ ] review'],
    riskChecklist: ['low risk']
  }));

  // valid md
  fs.writeFileSync(path.join(tmp, 'valid.md'), `# Sample Package

## Objective
Add a harmless demo file via package execution.

## Files
### create: tests/fixtures/demo-artifact.txt
\`\`\`text
Safe demo content from markdown package.
\`\`\`

## Commands
- node --version

## QA Checklist
- [ ] check the created file

## Risk Checklist
- demo only

## Rollback Notes
Backups created automatically.
`);

  // invalid (no useful objective, no ## sections for required fields)
  fs.writeFileSync(path.join(tmp, 'invalid.md'), `Random text file with no structure.

Just some paragraphs.
No headings at all that can be turned into objective.
`);
});

after(() => {
  try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
});

describe('packageParser', () => {
  it('parses valid JSON package and normalizes', () => {
    const res = parsePackageFile(path.join(tmp, 'valid.json'));
    assert.equal(res.sourceType, 'json');
    assert.ok(res.package.objective.includes('demo artifact'));
    assert.equal(res.package.files.length, 1);
    assert.equal(res.package.files[0].action, 'create');
    assert.ok(res.package.files[0].content);
  });

  it('parses valid markdown package and extracts files + sections', () => {
    const res = parsePackageFile(path.join(tmp, 'valid.md'));
    assert.equal(res.sourceType, 'markdown');
    assert.ok(res.package.objective.includes('harmless demo'));
    assert.ok(res.package.files.some(f => f.path.includes('demo-artifact') && f.action === 'create'));
    assert.ok(res.package.commands.some(c => c.includes('node --version')));
    assert.ok(res.package.qaChecklist.length > 0);
  });

  it('rejects invalid package with useful error (no objective etc)', () => {
    assert.throws(() => {
      parsePackageFile(path.join(tmp, 'invalid.md'));
    }, (err) => {
      assert.ok(err instanceof PackageParseError);
      assert.match(err.message, /Invalid package|objective is required/i);
      return true;
    });
  });

  it('rejects missing file', () => {
    assert.throws(() => parsePackageFile(path.join(tmp, 'nope.json')), PackageParseError);
  });
});
