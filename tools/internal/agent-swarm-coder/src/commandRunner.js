/**
 * commandRunner.js
 * Controlled command execution with full result capture.
 * Safety checks (destructive) performed by caller.
 */

import { execSync } from 'node:child_process';
import { redactSecrets } from './safetyGuard.js';

export function runCommand(command, cwd, options = {}) {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  let stdout = '';
  let stderr = '';
  let exitCode = 0;
  const maxBuffer = options.maxBuffer || 1024 * 1024 * 4; // 4MB

  try {
    const out = execSync(command, {
      cwd: cwd || process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: options.timeoutMs || 120000,
      maxBuffer,
      shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/zsh',
      env: { ...process.env, ...options.env }
    });
    stdout = out || '';
  } catch (err) {
    exitCode = err.status || 1;
    stdout = err.stdout || '';
    stderr = err.stderr || err.message || '';
  }
  const durationMs = Date.now() - start;

  const result = {
    command,
    exitCode,
    stdout: redactSecrets(stdout),
    stderr: redactSecrets(stderr),
    durationMs,
    timestamp,
    cwd: cwd || process.cwd(),
    success: exitCode === 0
  };
  return result;
}

export function runTestSuite(cwd, customCmd) {
  const cmd = customCmd || 'npm test';
  return runCommand(cmd, cwd, { timeoutMs: 180000 });
}

export function runBuild(cwd) {
  return runCommand('npm run build', cwd, { timeoutMs: 180000 });
}

export function runLint(cwd) {
  return runCommand('npm run lint', cwd, { timeoutMs: 120000 });
}

export function runGitStatus(cwd) {
  return runCommand('git status --short', cwd, { timeoutMs: 30000 });
}

export default {
  runCommand,
  runTestSuite,
  runBuild,
  runLint,
  runGitStatus
};
