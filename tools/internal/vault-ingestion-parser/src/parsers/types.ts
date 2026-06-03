import type { VaultConversation, VaultDocument } from '../schemas/vault.js';

export interface ParserContext {
  source: string;
  account?: string;
  rawPath?: string;
}

export interface ParserResult {
  conversations: VaultConversation[];
  documents: VaultDocument[];
}

export interface ParserAdapter {
  name: string;
  canParse(filePath: string): boolean | Promise<boolean>;
  parse(filePath: string, context: ParserContext): Promise<ParserResult>;
}
