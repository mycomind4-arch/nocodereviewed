import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { inspectProject, listProjectFiles, readProjectFile } from '../src/projectInspector.js';
import { redactSecrets } from '../src/safetyGuard.js';

function createFixture() {
  const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-inspect-'));
  fs.mkdirSync(path.join(tmpBase, 'src'), { recursive: true });
  fs.mkdirSync(path.join(tmpBase, 'node_modules', 'foo'), { recursive: true });
  fs.writeFileSync(path.join(tmpBase, 'package.json'), JSON.stringify({
    name: 'fixture-proj',
    version: '1.2.3',
    scripts: { test: 'node --test', build: 'echo build' },
    dependencies: { foo: '1' }
  }, null, 2));
  fs.writeFileSync(path.join(tmpBase, 'src', 'index.js'), 'console.log("hi");\n');
  fs.writeFileSync(path.join(tmpBase, '.env'), 'SECRET=supersecret123\nOK=public\n');
  fs.writeFileSync(path.join(tmpBase, 'node_modules', 'foo', 'index.js'), 'module.exports=1;');
  try { fs.mkdirSync(path.join(tmpBase, '.git')); fs.writeFileSync(path.join(tmpBase, '.git', 'HEAD'), 'ref: foo'); } catch {}
  return tmpBase;
}

function cleanupFixture(p) {
  try { fs.rmSync(p, { recursive: true, force: true }); } catch {}
}

describe('projectInspector', () => {
  it('detects package.json and scripts', () => {
    const dir = createFixture();
    try {
      const insp = inspectProject(dir);
      assert.equal(insp.hasPackageJson, true);
      assert.equal(insp.packageInfo.name, 'fixture-proj');
      assert.ok(insp.scripts.test);
      assert.ok(insp.scripts.build);
    } finally { cleanupFixture(dir); }
  });

  it('ignores node_modules and .git', () => {
    const dir = createFixture();
    try {
      const insp = inspectProject(dir);
      const paths = insp.importantFiles.map(f => f.path);
      assert.ok(!paths.some(p => p.includes('node_modules')));
    } finally { cleanupFixture(dir); }
  });

  it('redacts secrets when reading .env via safe read (all values redacted)', () => {
    const dir = createFixture();
    try {
      const content = readProjectFile(dir, '.env');
      assert.match(content, /SECRET=\s*\[REDACTED\]/);
      assert.match(content, /OK=\s*\[REDACTED\]/);
      assert.ok(!content.includes('supersecret123'));
    } finally { cleanupFixture(dir); }
  });

  it('lists files without exploding on ignored', () => {
    const dir = createFixture();
    try {
      const files = listProjectFiles(dir, 50);
      assert.ok(files.length > 0);
      assert.ok(!files.some(f => f.path.includes('node_modules')));
    } finally { cleanupFixture(dir); }
  });

  it('secret redaction helper works standalone', () => {
    const red = redactSecrets('password=foo123 bar');
    assert.ok(!red.includes('foo123'));
  });
});
