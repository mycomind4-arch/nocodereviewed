import { readFile } from 'node:fs/promises';
import { createEvidenceManifest, summarizeManifest } from './inventory-evidence.mjs';

const MANIFEST_PATH = 'data/intelligence-vault/evidence-manifest.json';

function comparableRecords(records) {
  return records.map(record => ({
    fileName: record.fileName,
    evidenceNumber: record.evidenceNumber,
    inferredToolName: record.inferredToolName,
    path: record.path,
    duplicateWarning: record.duplicateWarning,
    status: record.status,
  }));
}

function validateRecordShape(record, index) {
  const errors = [];
  const allowedStatuses = new Set(['canonical', 'duplicate-candidate', 'missing']);
  for (const field of ['fileName', 'evidenceNumber', 'inferredToolName', 'path', 'duplicateWarning', 'status']) {
    if (!(field in record)) errors.push(`record ${index} missing field: ${field}`);
  }
  if (!allowedStatuses.has(record.status)) {
    errors.push(`record ${index} has invalid status: ${record.status}`);
  }
  if (record.status === 'missing' && record.fileName !== null) {
    errors.push(`record ${index} is missing but has fileName`);
  }
  if (record.status !== 'missing' && !record.fileName) {
    errors.push(`record ${index} is not missing but lacks fileName`);
  }
  return errors;
}

async function main() {
  const errors = [];
  const warnings = [];

  let current;
  try {
    current = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  } catch (error) {
    errors.push(`Unable to read ${MANIFEST_PATH}: ${error instanceof Error ? error.message : error}`);
  }

  const expected = await createEvidenceManifest();

  if (current) {
    if (current.sourceDirectory !== expected.sourceDirectory) {
      errors.push(`sourceDirectory mismatch: expected ${expected.sourceDirectory}, got ${current.sourceDirectory}`);
    }

    if (!Array.isArray(current.records)) {
      errors.push('manifest records must be an array');
    } else {
      current.records.forEach((record, index) => {
        errors.push(...validateRecordShape(record, index));
      });

      const actualComparable = JSON.stringify(comparableRecords(current.records));
      const expectedComparable = JSON.stringify(comparableRecords(expected.records));
      if (actualComparable !== expectedComparable) {
        errors.push('manifest is stale or does not match docs/evidence scan');
      }
    }

    if (current.duplicateEvidenceNumbers?.length) {
      errors.push(`duplicate evidence numbers found: ${JSON.stringify(current.duplicateEvidenceNumbers)}`);
    }

    if (current.missingNumbers?.length) {
      warnings.push(`missing future evidence numbers: ${current.missingNumbers.join(', ')}`);
    }

    const duplicateWarnings = current.records?.filter(record => record.duplicateWarning) ?? [];
    if (duplicateWarnings.length) {
      warnings.push(`likely duplicate tool coverage records: ${duplicateWarnings.length}`);
    }
  }

  console.log(summarizeManifest(expected));

  if (warnings.length) {
    console.log('\nWarnings');
    for (const warning of warnings) console.log(`- ${warning}`);
  }

  if (errors.length) {
    console.error('\nErrors');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log('\nEvidence manifest validation passed');
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

