import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runCommand } from '../src/commandRunner.js';

describe('commandRunner', () => {
  it('captures stdout, exit 0, duration for simple command', () => {
    const res = runCommand('node --version', process.cwd());
    assert.equal(res.exitCode, 0);
    assert.ok(res.stdout.includes('v'));
    assert.ok(res.durationMs >= 0);
    assert.ok(res.success);
    assert.ok(res.timestamp);
  });

  it('captures stderr and non-zero exit', () => {
    const res = runCommand('node -e "console.error(\'boom\'); process.exit(7)"', process.cwd());
    assert.equal(res.exitCode, 7);
    assert.match(res.stderr, /boom/);
    assert.equal(res.success, false);
  });

  it('redacts secrets from captured output', () => {
    const res = runCommand('node -e "console.log(\'API_KEY=sk-1234567890123456\')"', process.cwd());
    assert.ok(!res.stdout.includes('sk-1234567890123456'));
    assert.match(res.stdout, /API_KEY=\s*\[REDACTED\]/);
  });

  it('records cwd', () => {
    const res = runCommand('node --version', process.cwd());
    assert.ok(res.cwd && res.cwd.length > 0);
  });
});
