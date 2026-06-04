/**
 * safetyGuard.js
 * Enforces all local-first safety rules for the coding agent.
 * Dry-run by default. No external calls, no creds, no destruction.
 */

import path from 'node:path';
import fs from 'node:fs';

const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.cache', 'out'
]);

const SECRET_PATTERNS = [
  /api[_-]?key\s*[:=]\s*['"]?[^'"\s]+/gi,
  /secret\s*[:=]\s*['"]?[^'"\s]+/gi,
  /token\s*[:=]\s*['"]?[^'"\s]+/gi,
  /password\s*[:=]\s*['"]?[^'"\s]+/gi,
  /supabase[_-]?service[_-]?role[_-]?key/gi,
  /-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----/g,
];

const DESTRUCTIVE_COMMANDS = [
  /\brm\s+-rf?\s+/, /\brm\s+-[^\s]*f[^\s]*\s+/, /\bdd\s+if=/, /\bmkfs\b/,
  /\bformat\b/, /\bdel\s+\/[sq]/i, /\bshutdown\b/, /\breboot\b/,
  /\bgit\s+push\s+--force/, /\bnpm\s+publish\b/, /curl .* \| (bash|sh)/i
];

const BLOCKED_IN_DRY_RUN = ['write', 'patch', 'create', 'run-unsafe'];

export function getIgnoredDirs() {
  return Array.from(IGNORED_DIRS);
}

export function isIgnoredPath(p) {
  const parts = p.split(path.sep);
  return parts.some(part => IGNORED_DIRS.has(part));
}

export function isEnvFile(p) {
  const base = path.basename(p).toLowerCase();
  return base === '.env' || base.startsWith('.env.');
}

export function isSecretFile(p) {
  const base = path.basename(p).toLowerCase();
  if (isEnvFile(p)) return true;
  if (/(\.npmrc|\.pypirc|\.netrc|credentials|\.git-credentials|id_rsa|id_ed25519|\.key|\.pem|auth\.json|secrets\.json)/.test(base)) return true;
  if (/secret|credential|private.*key|access.?token|api.?key/i.test(p)) return true;
  return false;
}

export function redactSecrets(text) {
  if (!text || typeof text !== 'string') return text;
  let redacted = text;
  for (const pat of SECRET_PATTERNS) {
    redacted = redacted.replace(pat, (m) => m.split(/[:=]/)[0] + '= [REDACTED]');
  }
  // Redact obvious long base64-ish or hex secrets in env contexts
  redacted = redacted.replace(/([A-Z0-9_]+)\s*=\s*['"]?[A-Za-z0-9_\-\/+]{16,}['"]?/g, '$1=[REDACTED]');
  return redacted;
}

export function ensureWithinProject(projectRoot, targetPath) {
  const absRoot = path.resolve(projectRoot);
  const absTarget = path.resolve(targetPath);
  if (!absTarget.startsWith(absRoot + path.sep) && absTarget !== absRoot) {
    throw new Error(`Path outside project root: ${targetPath}`);
  }
  return absTarget;
}

export function assertNotIgnored(projectRoot, targetPath) {
  const abs = ensureWithinProject(projectRoot, targetPath);
  const rel = path.relative(projectRoot, abs);
  if (isIgnoredPath(rel)) {
    throw new Error(`Refusing to operate on ignored path: ${rel}`);
  }
  return abs;
}

export function isDestructiveCommand(cmd) {
  if (!cmd || typeof cmd !== 'string') return false;
  return DESTRUCTIVE_COMMANDS.some(rx => rx.test(cmd));
}

export function isWriteAction(action) {
  return ['write', 'create', 'patch', 'delete'].includes(action);
}

export class SafetyError extends Error {
  constructor(message, code = 'SAFETY') {
    super(message);
    this.name = 'SafetyError';
    this.code = code;
  }
}

export function assertDryRunAllows(action, dryRun) {
  if (dryRun && BLOCKED_IN_DRY_RUN.includes(action)) {
    throw new SafetyError(`Dry-run mode: action "${action}" is blocked. Use --apply to permit writes.`, 'DRY_RUN_BLOCK');
  }
}

export function assertCommandSafe(cmd, dryRun) {
  if (isDestructiveCommand(cmd)) {
    throw new SafetyError(`Refusing destructive command: ${cmd}`, 'DESTRUCTIVE_CMD');
  }
  // In future: more policy, but for MVP allow most npm/git read/write if not destructive
  if (dryRun && /git\s+(commit|push|tag|merge)/i.test(cmd)) {
    throw new SafetyError(`Dry-run: git mutating command blocked: ${cmd}`, 'DRY_RUN_BLOCK');
  }
}

export function redactEnvContent(content) {
  if (!content) return content;
  const lines = content.split('\n');
  return lines.map(line => {
    if (/^\s*[A-Z0-9_]+\s*=/.test(line)) {
      const eq = line.indexOf('=');
      if (eq > 0) {
        const key = line.slice(0, eq + 1);
        return key + ' [REDACTED]';
      }
    }
    return line;
  }).join('\n');
}

export function safeReadFileSync(p, projectRoot, options = {}) {
  const abs = assertNotIgnored(projectRoot, p);
  let content = fs.readFileSync(abs, 'utf8');
  if (isEnvFile(p) || options.redactSecrets !== false) {
    content = redactEnvContent(content);
    content = redactSecrets(content);
  }
  return content;
}

export function createRunId() {
  const now = new Date();
  const stamp = now.toISOString().slice(0,16).replace(/[-:T]/g, '') + 
                String(now.getMinutes()).padStart(2,'0') + 
                String(now.getSeconds()).padStart(2,'0');
  // Will be overridden with slug in outputWriter
  return stamp;
}

export function assertDeleteAllowed(deleteApproved = false) {
  if (!deleteApproved) {
    throw new SafetyError('Delete operation requires explicit approval (use --allow-deletes or package-level approvals.deletes).', 'DELETE_BLOCKED');
  }
}

export function assertEditSafe(projectRoot, targetPath, { allowSecretEdits = false } = {}) {
  const abs = assertNotIgnored(projectRoot, targetPath);
  const rel = path.relative(projectRoot, abs);
  if (isSecretFile(rel) && !allowSecretEdits) {
    throw new SafetyError(`Refusing to edit secret/credential file without explicit approval: ${rel}`, 'SECRET_EDIT_BLOCKED');
  }
  return abs;
}

export function assertCommandSafeForPackage(cmd, { dryRun = true, allowExternal = false } = {}) {
  assertCommandSafe(cmd, dryRun); // base checks
  if (!allowExternal && /deploy|vercel|netlify|supabase\s+db|aws\s|firebase|heroku|npm\s+publish|create.*(account|user|project)|login\s+--|auth\s+login/i.test(cmd)) {
    throw new SafetyError(`Blocked external/deploy/account action in package execution: ${cmd}`, 'EXTERNAL_ACTION_BLOCKED');
  }
}

export default {
  getIgnoredDirs,
  isIgnoredPath,
  isEnvFile,
  isSecretFile,
  redactSecrets,
  ensureWithinProject,
  assertNotIgnored,
  isDestructiveCommand,
  assertDryRunAllows,
  assertCommandSafe,
  assertDeleteAllowed,
  assertEditSafe,
  assertCommandSafeForPackage,
  redactEnvContent,
  safeReadFileSync,
  createRunId,
  SafetyError
};
