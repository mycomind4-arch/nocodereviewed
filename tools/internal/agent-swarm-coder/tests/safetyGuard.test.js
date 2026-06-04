import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {
  isIgnoredPath,
  redactSecrets,
  redactEnvContent,
  isEnvFile,
  isSecretFile,
  isDestructiveCommand,
  assertDryRunAllows,
  assertDeleteAllowed,
  assertEditSafe,
  assertCommandSafeForPackage,
  SafetyError,
  getIgnoredDirs
} from '../src/safetyGuard.js';

describe('safetyGuard', () => {
  it('ignores standard directories', () => {
    assert.equal(isIgnoredPath('node_modules/foo.js'), true);
    assert.equal(isIgnoredPath('src/foo.js'), false);
    assert.equal(isIgnoredPath(path.join('foo', '.git', 'bar')), true);
  });

  it('redacts secrets', () => {
    const txt = 'API_KEY=sk-1234567890abcdef\nTOKEN=abc';
    const r = redactSecrets(txt);
    assert.match(r, /API_KEY=\s*\[REDACTED\]/);
    assert.match(r, /TOKEN=\s*\[REDACTED\]/);
  });

  it('redacts .env style lines (all values redacted for safety)', () => {
    const env = 'SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...\nNORMAL=ok';
    const r = redactEnvContent(env);
    assert.match(r, /SUPABASE_SERVICE_ROLE_KEY=\s*\[REDACTED\]/);
    assert.match(r, /NORMAL=\s*\[REDACTED\]/);
  });

  it('detects env files', () => {
    assert.equal(isEnvFile('.env'), true);
    assert.equal(isEnvFile('.env.local'), true);
    assert.equal(isEnvFile('config.env'), false);
  });

  it('detects destructive commands', () => {
    assert.equal(isDestructiveCommand('rm -rf /'), true);
    assert.equal(isDestructiveCommand('npm test'), false);
    assert.equal(isDestructiveCommand('git push --force'), true);
  });

  it('blocks writes in dry-run via assert', () => {
    assert.throws(() => {
      assertDryRunAllows('write', true);
    }, SafetyError);
    // does not throw for read
    assert.doesNotThrow(() => assertDryRunAllows('read', true));
  });

  it('exports ignored list', () => {
    const list = getIgnoredDirs();
    assert.ok(list.includes('node_modules'));
    assert.ok(list.includes('.git'));
  });

  it('detects secret files', () => {
    assert.equal(isSecretFile('.env'), true);
    assert.equal(isSecretFile('.env.local'), true);
    assert.equal(isSecretFile('config/secret-key.json'), true);
    assert.equal(isSecretFile('src/app.js'), false);
  });

  it('blocks deletes without approval', () => {
    assert.throws(() => assertDeleteAllowed(false), SafetyError);
    assert.doesNotThrow(() => assertDeleteAllowed(true));
  });

  it('blocks secret edits without flag', () => {
    assert.throws(() => {
      assertEditSafe('/tmp/proj', '/tmp/proj/.env', { allowSecretEdits: false });
    }, SafetyError);
  });

  it('blocks external/deploy commands in package context', () => {
    assert.throws(() => {
      assertCommandSafeForPackage('vercel deploy', { dryRun: true, allowExternal: false });
    }, SafetyError);
    assert.doesNotThrow(() => assertCommandSafeForPackage('node --version', { dryRun: true }));
  });
});
