/**
 * rollbackPlanner.js
 * Produces explicit rollback plans and (optionally) executes restore from backups.
 */

import fs from 'node:fs';
import path from 'node:path';
import { ensureWithinProject } from './safetyGuard.js';

export function generateRollbackPlan(changedFilesDuringRun, projectRoot) {
  const absRoot = path.resolve(projectRoot);
  const backups = [];
  const changed = (changedFilesDuringRun || []).map(c => c.path || c);

  for (const entry of (changedFilesDuringRun || [])) {
    if (entry.backup) {
      backups.push(entry.backup);
    }
  }

  const plan = {
    strategy: 'Timestamped .bak files sit next to originals. Copy back or use git checkout for clean state. Never delete .bak automatically.',
    backupLocations: backups.length ? backups : changed.map(p => `${p}.bak-<timestamp-from-run>`),
    restoreCommands: [
      '# 1. Identify the correct .bak file(s) from the run timestamp',
      '# 2. For each changed file:',
      'cp path/to/file.js.bak-YYYYMMDDHHMMSS path/to/file.js',
      '# 3. Verify with git status --short or diff',
      '# 4. If repo was clean before run: git checkout -- path/to/file.js'
    ],
    changedFiles: changed,
    notes: 'Backups are only created on actual writes (not in pure dry-run).'
  };
  return plan;
}

export function restoreFromBackup(projectRoot, backupPath, targetRel) {
  const absRoot = path.resolve(projectRoot);
  const bakAbs = ensureWithinProject(absRoot, path.isAbsolute(backupPath) ? backupPath : path.join(absRoot, backupPath));
  const targetAbs = targetRel
    ? ensureWithinProject(absRoot, path.join(absRoot, targetRel))
    : bakAbs.replace(/\.bak-[0-9]+$/, '');

  if (!fs.existsSync(bakAbs)) {
    throw new Error(`Backup not found: ${bakAbs}`);
  }
  fs.copyFileSync(bakAbs, targetAbs);
  return { restored: targetAbs, from: bakAbs };
}

export default {
  generateRollbackPlan,
  restoreFromBackup
};
