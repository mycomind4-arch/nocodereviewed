import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const cliPath = path.resolve('tools/internal/agent-swarm-coder/src/cli.js');

describe('CLI regression', () => {
  it('still runs in non-interactive goal mode', () => {
    // Run with --goal but without --interactive. Should produce a plan and exit.
    // We use dry-run to avoid real changes.
    const res = spawnSync('node', [cliPath, '--project', '.', '--goal', 'test goal', '--dry-run']);
    
    assert.strictEqual(res.status, 0, `CLI failed with: ${res.stderr.toString()}`);
    const stdout = res.stdout.toString();
    assert.ok(stdout.includes('agent-swarm-coder starting'), 'Should show start message');
    assert.ok(stdout.includes('goal:    test goal'), 'Should show goal');
    assert.ok(stdout.includes('=== RUN COMPLETE ==='), 'Should show completion');
  });

  it('still runs in non-interactive package mode', () => {
    // Use a fixture
    const pkgPath = 'tools/internal/agent-swarm-coder/tests/fixtures/sample-implementation-package.md';
    const res = spawnSync('node', [cliPath, '--project', '.', '--package', pkgPath, '--dry-run']);
    
    assert.strictEqual(res.status, 0, `CLI failed with: ${res.stderr.toString()}`);
    const stdout = res.stdout.toString();
    assert.ok(stdout.includes('package: tools/internal/agent-swarm-coder/tests/fixtures/sample-implementation-package.md'));
    assert.ok(stdout.includes('=== RUN COMPLETE ==='));
  });

  it('rejects missing mandatory flags in non-interactive mode', () => {
    const res = spawnSync('node', [cliPath, '--project', '.']);
    assert.strictEqual(res.status, 2); // our exit code for missing flags
    assert.ok(res.stderr.toString().includes('ERROR: either --goal or --package'));
  });
});
