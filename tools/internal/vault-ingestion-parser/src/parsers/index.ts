import { chatgptParser } from './chatgpt.js';
import { genericDocumentParser } from './genericDocument.js';
import type { ParserAdapter } from './types.js';

export const parserAdapters: ParserAdapter[] = [chatgptParser, genericDocumentParser];

export async function findParser(filePath: string): Promise<ParserAdapter | undefined> {
  for (const adapter of parserAdapters) {
    if (await adapter.canParse(filePath)) return adapter;
  }
  return undefined;
}
