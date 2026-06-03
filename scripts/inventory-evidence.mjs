import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_SOURCE_DIR = 'docs/evidence';
const DEFAULT_OUT = 'data/intelligence-vault/evidence-manifest.json';
const EXPECTED_MAX_NUMBER = 28;

function titleCaseTool(slug) {
  const overrides = new Map([
    ['v 0', 'v0'],
    ['base 44', 'Base44'],
    ['builder io fusion', 'Builder.io Fusion'],
    ['openai codex', 'OpenAI Codex'],
    ['claude code', 'Claude Code'],
    ['supabase ai assistant', 'Supabase AI Assistant'],
    ['flutterflow ai', 'FlutterFlow AI'],
    ['webflow ai', 'Webflow AI'],
    ['framer ai', 'Framer AI'],
    ['glide ai', 'Glide AI'],
    ['bubble ai', 'Bubble AI'],
    ['retool ai', 'Retool AI'],
    ['bolt new', 'Bolt.new'],
    ['replit', 'Replit'],
    ['lovable', 'Lovable'],
    ['cursor', 'Cursor'],
    ['windsurf', 'Windsurf'],
    ['adalo', 'Adalo'],
    ['thunkable', 'Thunkable'],
    ['appsmith', 'Appsmith'],
    ['weweb', 'WeWeb'],
    ['softr ai', 'Softr AI'],
  ]);

  const cleaned = slug.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  if (overrides.has(cleaned)) return overrides.get(cleaned);
  return cleaned.replace(/\b\w/g, char => char.toUpperCase());
}

function normalizeToolKey(toolName) {
  return toolName.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function inferToolFromFileName(fileName) {
  const withoutExt = fileName.replace(/\.[^.]+$/, '');
  const withoutNumber = withoutExt.replace(/^\d+[_-]*/, '');
  const stripped = withoutNumber
    .replace(/_complete_evidence_file$/i, '')
    .replace(/_evidence_file$/i, '')
    .replace(/_complete$/i, '');
  return titleCaseTool(stripped);
}

function parseEvidenceNumber(fileName) {
  const match = fileName.match(/^(\d+)[_-]/);
  return match ? Number.parseInt(match[1], 10) : null;
}

export async function createEvidenceManifest(options = {}) {
  const sourceDir = options.sourceDir ?? DEFAULT_SOURCE_DIR;
  const absoluteSourceDir = path.resolve(sourceDir);
  const entries = await readdir(absoluteSourceDir, { withFileTypes: true });

  const files = entries
    .filter(entry => entry.isFile())
    .map(entry => entry.name)
    .filter(fileName => fileName.endsWith('.md') && fileName !== 'README.md')
    .sort((a, b) => {
      const numA = parseEvidenceNumber(a) ?? Number.MAX_SAFE_INTEGER;
      const numB = parseEvidenceNumber(b) ?? Number.MAX_SAFE_INTEGER;
      if (numA !== numB) return numA - numB;
      return a.localeCompare(b);
    });

  const records = files.map(fileName => {
    const evidenceNumber = parseEvidenceNumber(fileName);
    const inferredToolName = inferToolFromFileName(fileName);
    return {
      fileName,
      evidenceNumber,
      inferredToolName,
      path: path.posix.join(sourceDir, fileName),
      duplicateWarning: null,
      status: 'canonical',
    };
  });

  const byTool = new Map();
  for (const record of records) {
    const key = normalizeToolKey(record.inferredToolName);
    if (!byTool.has(key)) byTool.set(key, []);
    byTool.get(key).push(record);
  }

  for (const group of byTool.values()) {
    if (group.length < 2) continue;
    const sorted = [...group].sort((a, b) => (a.evidenceNumber ?? 9999) - (b.evidenceNumber ?? 9999));
    const fileList = sorted.map(record => record.fileName).join(', ');
    for (const record of sorted) {
      record.duplicateWarning = `Likely duplicate coverage for ${record.inferredToolName}: ${fileList}`;
    }
    for (const record of sorted.slice(1)) {
      record.status = 'duplicate-candidate';
    }
  }

  const presentNumbers = new Set(records.map(record => record.evidenceNumber).filter(Number.isInteger));
  const expectedNumbers = Array.from({ length: EXPECTED_MAX_NUMBER }, (_, index) => index + 1);
  const missingNumbers = expectedNumbers.filter(number => !presentNumbers.has(number));
  const missingRecords = missingNumbers.map(number => ({
    fileName: null,
    evidenceNumber: number,
    inferredToolName: null,
    path: null,
    duplicateWarning: null,
    status: 'missing',
  }));

  const duplicateNumberMap = new Map();
  for (const record of records) {
    if (!Number.isInteger(record.evidenceNumber)) continue;
    if (!duplicateNumberMap.has(record.evidenceNumber)) duplicateNumberMap.set(record.evidenceNumber, []);
    duplicateNumberMap.get(record.evidenceNumber).push(record.fileName);
  }
  const duplicateEvidenceNumbers = [...duplicateNumberMap.entries()]
    .filter(([, groupedFiles]) => groupedFiles.length > 1)
    .map(([number, groupedFiles]) => ({ evidenceNumber: number, files: groupedFiles }));

  const canonicalCount = records.filter(record => record.status === 'canonical').length;
  const duplicateCandidateCount = records.filter(record => record.status === 'duplicate-candidate').length;

  return {
    generatedAt: new Date().toISOString(),
    sourceDirectory: sourceDir,
    expectedNumbers,
    missingNumbers,
    duplicateEvidenceNumbers,
    summary: {
      canonicalCount,
      duplicateCandidateCount,
      missingCount: missingRecords.length,
      scannedFileCount: records.length,
      totalRecordCount: records.length + missingRecords.length,
    },
    records: [...records, ...missingRecords],
  };
}

export function summarizeManifest(manifest) {
  const duplicateWarnings = manifest.records.filter(record => record.duplicateWarning);
  const lines = [
    'Evidence inventory summary',
    `- Source: ${manifest.sourceDirectory}`,
    `- Scanned files: ${manifest.summary.scannedFileCount}`,
    `- Canonical records: ${manifest.summary.canonicalCount}`,
    `- Duplicate candidates: ${manifest.summary.duplicateCandidateCount}`,
    `- Missing numbers: ${manifest.missingNumbers.length ? manifest.missingNumbers.join(', ') : 'none'}`,
  ];

  if (duplicateWarnings.length) {
    lines.push('- Likely duplicate coverage:');
    const seen = new Set();
    for (const record of duplicateWarnings) {
      if (seen.has(record.duplicateWarning)) continue;
      seen.add(record.duplicateWarning);
      lines.push(`  - ${record.duplicateWarning}`);
    }
  }

  if (manifest.duplicateEvidenceNumbers.length) {
    lines.push('- Duplicate evidence numbers:');
    for (const item of manifest.duplicateEvidenceNumbers) {
      lines.push(`  - ${item.evidenceNumber}: ${item.files.join(', ')}`);
    }
  }

  return lines.join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  const writeIndex = args.indexOf('--write');
  const shouldWrite = writeIndex !== -1;
  const outPath = shouldWrite ? (args[writeIndex + 1] ?? DEFAULT_OUT) : null;
  const manifest = await createEvidenceManifest();

  if (shouldWrite) {
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    console.log(`Wrote ${outPath}`);
  }

  console.log(summarizeManifest(manifest));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}

