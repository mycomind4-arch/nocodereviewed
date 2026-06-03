import { promises as fs } from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';
import matter from 'gray-matter';
import { nanoid } from 'nanoid';
import type { ParserAdapter, ParserContext, ParserResult } from './types.js';
import type { VaultDocument } from '../schemas/vault.js';
import { detectArtifacts } from './artifactDetector.js';

const supported = new Set(['.md', '.txt', '.html', '.json']);

export const genericDocumentParser: ParserAdapter = {
  name: 'generic-document',
  canParse(filePath: string) {
    return supported.has(path.extname(filePath).toLowerCase());
  },
  async parse(filePath: string, context: ParserContext): Promise<ParserResult> {
    const ext = path.extname(filePath).toLowerCase();
    const raw = await fs.readFile(filePath, 'utf8');
    const id = `doc-${nanoid(10)}`;
    const content = normalizeContent(raw, ext);
    const doc: VaultDocument = {
      id,
      source: context.source,
      source_account: context.account,
      title: path.basename(filePath),
      path: filePath,
      imported_at: new Date().toISOString(),
      content_type: ext.replace('.', '') || 'text',
      content,
      tags: [context.source, 'document'],
      artifacts: detectArtifacts({
        content,
        sourcePlatform: context.source,
        sourceAccount: context.account,
        rawPath: filePath,
        documentId: id
      })
    };
    return { conversations: [], documents: [doc] };
  }
};

function normalizeContent(raw: string, ext: string): string {
  if (ext === '.html') {
    const $ = load(raw);
    return $('body').text().replace(/\n{3,}/g, '\n\n').trim();
  }
  if (ext === '.md') {
    return matter(raw).content.trim();
  }
  if (ext === '.json') {
    try { return JSON.stringify(JSON.parse(raw), null, 2); } catch { return raw; }
  }
  return raw;
}
