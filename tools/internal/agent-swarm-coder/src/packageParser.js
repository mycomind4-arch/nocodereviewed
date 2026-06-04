/**
 * packageParser.js
 * Parses implementation-package.md or .json into normalized structure.
 * Validates required fields, extracts file ops (create/patch), commands, checklists etc.
 * Rejects invalid packages with clear errors.
 * Always local, uses safety redaction only when reading potential secret files (rare for packages).
 */

import fs from 'node:fs';
import path from 'node:path';
import { safeReadFileSync, isEnvFile, redactSecrets } from './safetyGuard.js';

export class PackageParseError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'PackageParseError';
    this.code = 'PACKAGE_PARSE';
    this.details = details;
  }
}

export function parsePackageFile(packagePath, projectRoot = null) {
  if (!packagePath) {
    throw new PackageParseError('packagePath is required');
  }
  const absPath = path.resolve(packagePath);
  if (!fs.existsSync(absPath)) {
    throw new PackageParseError(`Package file not found: ${packagePath}`);
  }
  const stat = fs.statSync(absPath);
  if (!stat.isFile()) {
    throw new PackageParseError(`Package path is not a file: ${packagePath}`);
  }

  let raw;
  try {
    // Use safe read if we can determine a project root and it's inside (to redact if .env-like package, unlikely)
    if (projectRoot) {
      try {
        raw = safeReadFileSync(absPath, projectRoot, { redactSecrets: false }); // packages are specs, don't aggressively redact proposed code
      } catch (e) {
        raw = fs.readFileSync(absPath, 'utf8');
      }
    } else {
      raw = fs.readFileSync(absPath, 'utf8');
    }
  } catch (e) {
    throw new PackageParseError(`Failed to read package file: ${e.message}`);
  }

  const ext = path.extname(absPath).toLowerCase();
  let parsed;
  if (ext === '.json') {
    parsed = parseJsonPackage(raw, absPath);
  } else if (ext === '.md' || ext === '.markdown') {
    parsed = parseMarkdownPackage(raw, absPath);
  } else {
    // Try json first, fallback to md heuristics
    try {
      parsed = parseJsonPackage(raw, absPath);
    } catch {
      parsed = parseMarkdownPackage(raw, absPath);
    }
  }

  const normalized = normalizePackage(parsed, absPath);
  const validation = validatePackage(normalized);
  if (!validation.valid) {
    throw new PackageParseError(`Invalid package: ${validation.errors.join('; ')}`, { errors: validation.errors, packagePath: absPath });
  }

  return {
    sourcePath: absPath,
    sourceType: ext === '.json' ? 'json' : 'markdown',
    rawLength: raw.length,
    package: normalized
  };
}

function parseJsonPackage(raw, src) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    throw new PackageParseError(`Invalid JSON in package ${src}: ${e.message}`);
  }
  if (typeof data !== 'object' || Array.isArray(data) || !data) {
    throw new PackageParseError('JSON package must be an object');
  }
  return data;
}

function parseMarkdownPackage(raw, src) {
  const data = {
    objective: extractSection(raw, 'Objective') || extractSection(raw, 'objective'),
    files: extractFilesFromMarkdown(raw),
    commands: extractListSection(raw, 'Commands') || [],
    testCommands: extractListSection(raw, 'Test Commands') || extractListSection(raw, 'testCommands') || [],
    implementationSteps: extractListSection(raw, 'Implementation Steps') || extractListSection(raw, 'Steps'),
    qaChecklist: extractListSection(raw, 'QA Checklist') || extractListSection(raw, 'QA'),
    riskChecklist: extractListSection(raw, 'Risk Checklist') || extractListSection(raw, 'Risks'),
    rollbackNotes: extractSection(raw, 'Rollback') || extractSection(raw, 'Rollback Notes') || extractSection(raw, 'Rollback Plan'),
    evidenceRequirements: extractSection(raw, 'Evidence') || extractSection(raw, 'Evidence Requirements'),
    nextAction: extractListSection(raw, 'Next Action') || extractListSection(raw, 'Next Actions') || extractListSection(raw, 'Next Steps')
  };

  // Also try to pull schema_version if present
  const verMatch = raw.match(/schema_version\s*[:=]\s*["']?([^"'\s]+)["']?/i);
  if (verMatch) data.schema_version = verMatch[1];

  // Strict: do NOT fallback from arbitrary h1 for package files. Packages should have explicit ## Objective.
  // Only set from h1 if the title itself looks like a package declaration (defensive).
  if (!data.objective) {
    const h1 = raw.match(/^#\s+(.+)$/m);
    if (h1 && /package|implementation|execution/i.test(h1[1])) {
      data.objective = h1[1].trim();
    }
  }

  return data;
}

function extractSection(raw, name) {
  const re = new RegExp(`^##+\\s*${name}\\s*\\n([\\s\\S]*?)(?=^##+\\s|\\Z)`, 'im');
  const m = raw.match(re);
  if (!m) return null;
  return m[1].trim().replace(/\n{3,}/g, '\n\n');
}

function extractListSection(raw, name) {
  const section = extractSection(raw, name);
  if (!section) return null;
  // lines starting with - or * or numbered
  const items = [];
  const lines = section.split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (/^[-*+]\s+/.test(t) || /^\d+[\.\)]\s+/.test(t)) {
      items.push(t.replace(/^[-*+]\s+/, '').replace(/^\d+[\.\)]\s+/, '').trim());
    } else if (t && !t.startsWith('```') && items.length > 0) {
      // continuation? append to last
      items[items.length - 1] += ' ' + t;
    }
  }
  return items.filter(Boolean);
}

function extractFilesFromMarkdown(raw) {
  const files = [];
  // Match patterns like:
  // ### create: path/to/file.txt
  // ```...
  // ```
  // or ### Modify path/to.js
  const fileBlockRe = /^###+\s*(create|write|modify|patch|delete)?:?\s*([^\n`]+)/gim;
  let match;
  const codeBlockRe = /```[\s\S]*?```/g;

  // Simpler: scan for headers mentioning file actions, then next code block
  const lines = raw.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^###+\s*(create|write|modify|patch|delete)?:?\s*([^\n]+)/i);
    if (m) {
      const actionRaw = (m[1] || 'modify').toLowerCase();
      let action = actionRaw;
      if (action === 'write') action = 'create';
      const p = m[2].trim().replace(/`/g, '');
      // find following code block
      let content = null;
      let search = null;
      let replace = null;
      let j = i + 1;
      while (j < lines.length && !lines[j].match(/^###+/)) {
        if (lines[j].trim().startsWith('```')) {
          const blockLines = [];
          j++;
          while (j < lines.length && !lines[j].trim().startsWith('```')) {
            blockLines.push(lines[j]);
            j++;
          }
          content = blockLines.join('\n').trim();
          break;
        }
        // also support search/replace lines inside section
        const sMatch = lines[j].match(/^\s*search\s*[:=]\s*(.+)$/i);
        const rMatch = lines[j].match(/^\s*replace\s*[:=]\s*(.+)$/i);
        if (sMatch) search = sMatch[1].trim();
        if (rMatch) replace = rMatch[1].trim();
        j++;
      }
      const entry = { path: p, action, description: `From package markdown` };
      if (content) entry.content = content;
      if (search) entry.search = search;
      if (replace) entry.replace = replace;
      files.push(entry);
      i = j;
      continue;
    }
    i++;
  }

  // Also support simpler "Files to Modify/Create" bullet lists without code (for high-level packages)
  if (files.length === 0) {
    const filesSec = extractSection(raw, 'Files') || extractSection(raw, 'File Changes') || extractSection(raw, 'Files to Create or Modify');
    if (filesSec) {
      const bullets = filesSec.split('\n').filter(l => /^[-*]\s+/.test(l.trim()));
      for (const b of bullets) {
        const txt = b.replace(/^[-*]\s+/, '').trim();
        // e.g. "create foo.txt - desc" or just "src/bar.js"
        const c = txt.match(/^(create|modify|patch|delete)\s+([^\s-]+)\s*-?\s*(.*)$/i);
        if (c) {
          files.push({ path: c[2], action: c[1].toLowerCase(), description: c[3] || txt });
        } else if (txt) {
          files.push({ path: txt.split(/\s/)[0], action: 'modify', description: txt });
        }
      }
    }
  }
  return files;
}

function normalizePackage(rawData, srcPath) {
  const p = { ...rawData };

  if (!p.schema_version) p.schema_version = 'agent-package.v1';

  p.objective = (p.objective || '').trim();

  p.files = Array.isArray(p.files) ? p.files.map(f => ({
    path: (f.path || '').trim(),
    action: (f.action || 'modify').toLowerCase(),
    description: f.description || '',
    content: f.content || undefined,
    search: f.search || undefined,
    replace: f.replace || undefined
  })).filter(f => f.path) : [];

  p.commands = Array.isArray(p.commands) ? p.commands.filter(Boolean) : [];
  p.testCommands = Array.isArray(p.testCommands) ? p.testCommands.filter(Boolean) : (p.commands.length ? [] : []);
  p.implementationSteps = Array.isArray(p.implementationSteps) ? p.implementationSteps.filter(Boolean) : [];
  p.qaChecklist = Array.isArray(p.qaChecklist) ? p.qaChecklist.filter(Boolean) : [];
  p.riskChecklist = Array.isArray(p.riskChecklist) ? p.riskChecklist.filter(Boolean) : [];
  p.rollbackNotes = p.rollbackNotes || '';
  p.evidenceRequirements = p.evidenceRequirements || '';
  p.nextAction = Array.isArray(p.nextAction) ? p.nextAction.filter(Boolean) : [];

  // approvals from package (declarative intent)
  p.approvals = p.approvals || {};

  return p;
}

function validatePackage(p) {
  const errors = [];
  if (!p.objective || p.objective.length < 5) {
    errors.push('objective is required and must be descriptive (min 5 chars)');
  }
  if (!p.schema_version || !p.schema_version.includes('agent-package')) {
    // allow but warn; not fatal for MVP
  }

  for (const f of (p.files || [])) {
    if (!f.path) errors.push('file entry missing path');
    const act = f.action;
    if (!['create', 'write', 'modify', 'patch', 'delete'].includes(act)) {
      errors.push(`unsupported file action "${act}" for ${f.path}`);
    }
    if (act === 'delete' && !f.approved && !p.approvals?.deletes) {
      // not error, will be blocked later
    }
    if ((act === 'create' || act === 'write' || act === 'modify') && !f.content && !f.search) {
      // for high-level plans, content may be omitted; planner will mark as "manual content required"
    }
  }

  return { valid: errors.length === 0, errors };
}

export function loadSchema() {
  // For future: could fs read the schema and use for extra checks, but zero-dep so manual is fine
  return null;
}

export default {
  parsePackageFile,
  PackageParseError,
  normalizePackage,
  validatePackage
};
