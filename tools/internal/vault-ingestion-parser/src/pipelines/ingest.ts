import path from 'node:path';
import fg from 'fast-glob';
import AdmZip from 'adm-zip';
import { promises as fs } from 'node:fs';
import { findParser } from '../parsers/index.js';
import type { VaultConversation, VaultDocument } from '../schemas/vault.js';
import { copyPreserve, ensureDir, safeName, writeJson } from '../utils/fs.js';
import { appendLog } from '../utils/log.js';
import { buildArtifactIndex, buildConversationIndex, buildTagIndex, buildTimelineIndex, collectArtifacts } from '../indexes/buildIndexes.js';

export interface IngestOptions {
  input: string;
  output: string;
  source: string;
  account?: string;
  preserveRaw?: boolean;
}

export async function ingest(options: IngestOptions) {
  const inputAbs = path.resolve(options.input);
  const outputAbs = path.resolve(options.output);
  await ensureVaultDirs(outputAbs);

  if (options.preserveRaw !== false) {
    const rawDest = path.join(outputAbs, 'raw', options.source, options.account ?? 'unknown-account', path.basename(inputAbs));
    await copyPreserve(inputAbs, rawDest);
    await appendLog(outputAbs, 'ingestion.log', `Preserved raw input: ${inputAbs} -> ${rawDest}`);
  }

  const workingInput = await prepareWorkingInput(inputAbs, outputAbs);
  const files = await fg(['**/*'], { cwd: workingInput, onlyFiles: true, absolute: true, dot: true });
  const conversations: VaultConversation[] = [];
  const documents: VaultDocument[] = [];

  for (const file of files) {
    const parser = await findParser(file);
    if (!parser) continue;
    try {
      const result = await parser.parse(file, { source: options.source, account: options.account, rawPath: inputAbs });
      conversations.push(...result.conversations);
      documents.push(...result.documents);
      await appendLog(outputAbs, 'ingestion.log', `Parsed ${file} with ${parser.name}`);
    } catch (error) {
      await appendLog(outputAbs, 'parser-errors.log', `Failed parsing ${file}: ${(error as Error).message}`);
    }
  }

  await writeOutputs(outputAbs, conversations, documents);
  await appendLog(outputAbs, 'ingestion.log', `Finished ingestion. conversations=${conversations.length}, documents=${documents.length}`);
  return { conversations: conversations.length, documents: documents.length, output: outputAbs };
}

async function ensureVaultDirs(output: string) {
  for (const dir of [
    'raw',
    'normalized/conversations',
    'normalized/documents',
    'normalized/artifacts',
    'processed/memory',
    'processed/evidence',
    'processed/workflows',
    'processed/decisions',
    'indexes',
    'logs',
    '.tmp'
  ]) await ensureDir(path.join(output, dir));
}

async function prepareWorkingInput(input: string, output: string) {
  const stat = await fs.stat(input);
  if (stat.isDirectory()) return input;
  if (path.extname(input).toLowerCase() === '.zip') {
    const extractDir = path.join(output, '.tmp', `${safeName(path.basename(input, '.zip'))}-${Date.now()}`);
    await ensureDir(extractDir);
    new AdmZip(input).extractAllTo(extractDir, true);
    return extractDir;
  }
  const singleDir = path.join(output, '.tmp', `single-${Date.now()}`);
  await ensureDir(singleDir);
  await fs.copyFile(input, path.join(singleDir, path.basename(input)));
  return singleDir;
}

async function writeOutputs(output: string, conversations: VaultConversation[], documents: VaultDocument[]) {
  for (const conversation of conversations) {
    await writeJson(path.join(output, 'normalized/conversations', `${conversation.id}-${safeName(conversation.title)}.json`), conversation);
  }
  for (const document of documents) {
    await writeJson(path.join(output, 'normalized/documents', `${document.id}-${safeName(document.title)}.json`), document);
  }
  const artifacts = collectArtifacts(conversations, documents);
  for (const artifact of artifacts) {
    await writeJson(path.join(output, 'normalized/artifacts', `${artifact.id}-${artifact.type}.json`), artifact);
  }
  await writeJson(path.join(output, 'indexes/conversations.json'), buildConversationIndex(conversations));
  await writeJson(path.join(output, 'indexes/artifacts.json'), buildArtifactIndex(artifacts));
  await writeJson(path.join(output, 'indexes/tags.json'), buildTagIndex(conversations, documents, artifacts));
  await writeJson(path.join(output, 'indexes/timelines.json'), buildTimelineIndex(conversations, documents));
}
