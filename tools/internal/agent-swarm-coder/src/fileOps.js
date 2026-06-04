/**
 * fileOps.js
 * Safe local file operations with mandatory backups before mutation.
 * Dry-run guards live in caller + safetyGuard.
 */

import fs from 'node:fs';
import path from 'node:path';
import { assertNotIgnored, ensureWithinProject, redactSecrets, isEnvFile, redactEnvContent } from './safetyGuard.js';

export class FileOps {
  constructor(projectRoot, dryRun = true) {
    this.projectRoot = path.resolve(projectRoot);
    this.dryRun = dryRun;
    this.changedFiles = []; // {path, action, backup, timestamp}
  }

  listChanged() {
    return [...this.changedFiles];
  }

  read(relOrAbs) {
    const abs = this._resolve(relOrAbs);
    let content = fs.readFileSync(abs, 'utf8');
    if (isEnvFile(abs) || relOrAbs.includes('.env')) {
      content = redactEnvContent(content);
    }
    return redactSecrets(content);
  }

  _resolve(p) {
    const abs = path.isAbsolute(p) ? p : path.join(this.projectRoot, p);
    return ensureWithinProject(this.projectRoot, abs);
  }

  _backup(absPath) {
    const ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15);
    const bak = `${absPath}.bak-${ts}`;
    fs.copyFileSync(absPath, bak);
    return bak;
  }

  write(relOrAbs, content, { createIfMissing = false } = {}) {
    const abs = this._resolve(relOrAbs);
    assertNotIgnored(this.projectRoot, abs);
    const exists = fs.existsSync(abs);
    if (!exists && !createIfMissing) {
      throw new Error(`File does not exist (use createIfMissing): ${relOrAbs}`);
    }
    if (this.dryRun) {
      // In dry-run we still record intent but do not touch disk
      this.changedFiles.push({
        path: path.relative(this.projectRoot, abs),
        action: exists ? 'write-dry' : 'create-dry',
        backup: null,
        timestamp: new Date().toISOString(),
        wouldWrite: true
      });
      return { dryRun: true, path: relOrAbs };
    }
    let backup = null;
    if (exists) {
      backup = this._backup(abs);
    }
    fs.writeFileSync(abs, content, 'utf8');
    this.changedFiles.push({
      path: path.relative(this.projectRoot, abs),
      action: exists ? 'write' : 'create',
      backup,
      timestamp: new Date().toISOString()
    });
    return { dryRun: false, path: relOrAbs, backup };
  }

  create(relOrAbs, content) {
    return this.write(relOrAbs, content, { createIfMissing: true });
  }

  // Simple patch: exact string replace (one or more). For real diffs later.
  patch(relOrAbs, search, replace, { all = false } = {}) {
    const abs = this._resolve(relOrAbs);
    assertNotIgnored(this.projectRoot, abs);
    let original = fs.readFileSync(abs, 'utf8');
    if (!original.includes(search)) {
      throw new Error(`Patch search string not found in ${relOrAbs}`);
    }
    let patched;
    if (all) {
      patched = original.split(search).join(replace);
    } else {
      patched = original.replace(search, replace);
    }
    if (this.dryRun) {
      this.changedFiles.push({
        path: path.relative(this.projectRoot, abs),
        action: 'patch-dry',
        backup: null,
        timestamp: new Date().toISOString(),
        searchPreview: search.slice(0, 60)
      });
      return { dryRun: true, path: relOrAbs };
    }
    const backup = this._backup(abs);
    fs.writeFileSync(abs, patched, 'utf8');
    this.changedFiles.push({
      path: path.relative(this.projectRoot, abs),
      action: 'patch',
      backup,
      timestamp: new Date().toISOString()
    });
    return { dryRun: false, path: relOrAbs, backup };
  }

  // For future: apply unified diff would live here with careful parsing.
}

export function makeBackupBeforeModify(projectRoot, relPath) {
  const absRoot = path.resolve(projectRoot);
  const abs = path.join(absRoot, relPath);
  ensureWithinProject(absRoot, abs);
  if (!fs.existsSync(abs)) return null;
  const ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15);
  const bak = `${abs}.bak-${ts}`;
  fs.copyFileSync(abs, bak);
  return bak;
}

export default {
  FileOps,
  makeBackupBeforeModify
};
