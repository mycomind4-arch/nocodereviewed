import { chatgptParser } from './chatgpt.js';
import { genericDocumentParser } from './genericDocument.js';
import { universalSiteAuditParser } from './universalSiteAudit.js';
import { agentSwarmCoderHandoffParser } from './agentSwarmCoderHandoff.js';
import type { ParserAdapter } from './types.js';

// agent handoff and universal first for their specific bundles
export const parserAdapters: ParserAdapter[] = [
  agentSwarmCoderHandoffParser,
  universalSiteAuditParser,
  chatgptParser,
  genericDocumentParser
];

export async function findParser(filePath: string): Promise<ParserAdapter | undefined> {
  for (const adapter of parserAdapters) {
    if (await adapter.canParse(filePath)) return adapter;
  }
  return undefined;
}
