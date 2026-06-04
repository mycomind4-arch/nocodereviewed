import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { FileOps } from '../src/fileOps.js';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-fileops-'));

after(() => { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch {} });

describe('fileOps dry-run', () => {
  it('prevents actual writes when dryRun=true and records intent', () => {
    const ops = new FileOps(tmp, true);
    const target = 'src/newfile.txt';
    const res = ops.create(target, 'hello dry');
    assert.equal(res.dryRun, true);
    assert.ok(!fs.existsSync(path.join(tmp, target)));
    const changed = ops.listChanged();
    assert.equal(changed.length, 1);
    assert.equal(changed[0].action, 'create-dry');
  });

  it('prevents patch in dry-run', () => {
    const ops = new FileOps(tmp, true);
    const f = path.join(tmp, 'edit.js');
    fs.writeFileSync(f, 'const x = 1;');
    const rel = 'edit.js';
    const p = ops.patch(rel, 'const x = 1;', 'const x = 2;');
    assert.equal(p.dryRun, true);
    const after = fs.readFileSync(f, 'utf8');
    assert.equal(after, 'const x = 1;'); // unchanged
  });
});

describe('fileOps apply mode', () => {
  it('actually writes and creates backup when not dry', () => {
    const ops = new FileOps(tmp, false);
    const rel = 'real.txt';
    const res = ops.write(rel, 'first', { createIfMissing: true });
    assert.equal(res.dryRun, false);
    assert.ok(res.backup == null); // first write no backup
    assert.ok(fs.existsSync(path.join(tmp, rel)));

    // second write creates backup
    const res2 = ops.write(rel, 'second');
    assert.ok(res2.backup && res2.backup.includes('.bak-'));
    const content = fs.readFileSync(path.join(tmp, rel), 'utf8');
    assert.equal(content, 'second');
  });
});
