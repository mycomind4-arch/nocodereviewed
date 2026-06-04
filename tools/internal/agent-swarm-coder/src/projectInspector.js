/**
 * projectInspector.js
 * Local project inspection. Respects ignores and redacts secrets.
 * No network, no external access.
 */

import fs from 'node:fs';
import path from 'node:path';
import { isIgnoredPath, safeReadFileSync, isEnvFile, redactEnvContent } from './safetyGuard.js';

const IMPORTANT_EXTS = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.json', '.md', '.html', '.css', '.yml', '.yaml', '.toml', '.sh', '.py']);

function shouldIncludeFile(name) {
  if (name.startsWith('.')) {
    // allow some dotfiles but not .env*
    if (name.startsWith('.env')) return false;
    if (['.gitignore', '.eslintrc', '.prettierrc'].includes(name)) return true;
    return false;
  }
  const ext = path.extname(name).toLowerCase();
  if (IMPORTANT_EXTS.has(ext)) return true;
  if (['package.json', 'README', 'LICENSE', 'Makefile', 'Dockerfile'].some(p => name.toLowerCase().startsWith(p.toLowerCase()))) return true;
  return false;
}

function walk(dir, projectRoot, maxDepth = 3, currentDepth = 0, acc = []) {
  if (currentDepth > maxDepth) return acc;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    const rel = path.relative(projectRoot, full);
    if (isIgnoredPath(rel)) continue;
    if (ent.isDirectory()) {
      walk(full, projectRoot, maxDepth, currentDepth + 1, acc);
    } else if (ent.isFile() && shouldIncludeFile(ent.name)) {
      const stat = fs.statSync(full);
      acc.push({
        path: rel,
        size: stat.size,
        ext: path.extname(ent.name)
      });
    }
  }
  return acc;
}

export function inspectProject(projectPath) {
  const absRoot = path.resolve(projectPath);
  if (!fs.existsSync(absRoot) || !fs.statSync(absRoot).isDirectory()) {
    throw new Error(`Project path not a readable directory: ${projectPath}`);
  }

  const result = {
    projectRoot: absRoot,
    inspectedAt: new Date().toISOString(),
    hasPackageJson: false,
    packageInfo: null,
    scripts: {},
    importantFiles: [],
    topLevel: [],
    warnings: []
  };

  // package.json
  const pkgPath = path.join(absRoot, 'package.json');
  if (fs.existsSync(pkgPath)) {
    result.hasPackageJson = true;
    try {
      const raw = safeReadFileSync(pkgPath, absRoot);
      const pkg = JSON.parse(raw);
      result.packageInfo = {
        name: pkg.name || '(unnamed)',
        version: pkg.version || '0.0.0',
        type: pkg.type || 'commonjs',
        main: pkg.main || null,
        dependencies: Object.keys(pkg.dependencies || {}).length,
        devDependencies: Object.keys(pkg.devDependencies || {}).length,
      };
      result.scripts = pkg.scripts || {};
    } catch (e) {
      result.warnings.push(`Failed to parse package.json: ${e.message}`);
    }
  }

  // top level listing (non-ignored)
  try {
    const top = fs.readdirSync(absRoot, { withFileTypes: true })
      .filter(d => !isIgnoredPath(d.name))
      .map(d => ({ name: d.name, isDir: d.isDirectory() }));
    result.topLevel = top;
  } catch (e) {
    result.warnings.push(`Top level read error: ${e.message}`);
  }

  // important files (limited)
  result.importantFiles = walk(absRoot, absRoot, 2).slice(0, 80);

  // Detect other signals
  const hasGit = fs.existsSync(path.join(absRoot, '.git'));
  if (hasGit) result.warnings.push('Git repo detected (read-only access)');

  // Check for .env* but do not read values
  const dotFiles = fs.readdirSync(absRoot).filter(n => n.startsWith('.env'));
  if (dotFiles.length) {
    result.warnings.push(`Found ${dotFiles.length} .env* file(s) - values will be redacted on read`);
  }

  return result;
}

export function listProjectFiles(projectPath, max = 200) {
  const abs = path.resolve(projectPath);
  const files = walk(abs, abs, 4);
  return files.slice(0, max);
}

export function readProjectFile(projectPath, relPath) {
  const absRoot = path.resolve(projectPath);
  const full = path.join(absRoot, relPath);
  return safeReadFileSync(full, absRoot);
}

export default {
  inspectProject,
  listProjectFiles,
  readProjectFile
};
