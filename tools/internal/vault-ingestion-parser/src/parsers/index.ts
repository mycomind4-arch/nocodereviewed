import { chatgptParser } from './chatgpt.js';
import { genericDocumentParser } from './genericDocument.js';
import { universalSiteAuditParser } from './universalSiteAudit.js';
import type { ParserAdapter } from './types.js';

// universal-site-audit first so it takes precedence for admin audit bundles
export const parserAdapters: ParserAdapter[] = [universalSiteAuditParser, chatgptParser, genericDocumentParser];

export async function findParser(filePath: string): Promise<ParserAdapter | undefined> {
  for (const adapter of parserAdapters) {
    if (await adapter.canParse(filePath)) return adapter;
  }
  return undefined;
}
