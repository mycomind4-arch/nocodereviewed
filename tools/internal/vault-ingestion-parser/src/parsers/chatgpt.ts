import path from 'node:path';
import { nanoid } from 'nanoid';
import { readJson } from '../utils/fs.js';
import type { ParserAdapter, ParserContext, ParserResult } from './types.js';
import type { VaultConversation, VaultMessage } from '../schemas/vault.js';
import { detectArtifacts } from './artifactDetector.js';

type ChatGPTNode = {
  id: string;
  message?: {
    author?: { role?: string };
    create_time?: number;
    update_time?: number;
    content?: { parts?: unknown[]; text?: string };
  };
  parent?: string;
  children?: string[];
};

type ChatGPTConversation = {
  id?: string;
  title?: string;
  create_time?: number;
  update_time?: number;
  mapping?: Record<string, ChatGPTNode>;
};

function isoFromUnix(value?: number) {
  return value ? new Date(value * 1000).toISOString() : undefined;
}

function extractContent(message: ChatGPTNode['message']): string {
  const content = message?.content;
  if (!content) return '';
  if (typeof content.text === 'string') return content.text;
  if (Array.isArray(content.parts)) {
    return content.parts.map((part) => typeof part === 'string' ? part : JSON.stringify(part)).join('\n').trim();
  }
  return JSON.stringify(content);
}

function orderedNodes(mapping: Record<string, ChatGPTNode> = {}): ChatGPTNode[] {
  return Object.values(mapping)
    .filter((node) => node.message && extractContent(node.message).trim())
    .sort((a, b) => (a.message?.create_time ?? 0) - (b.message?.create_time ?? 0));
}

export const chatgptParser: ParserAdapter = {
  name: 'chatgpt',
  canParse(filePath: string) {
    return path.basename(filePath).toLowerCase() === 'conversations.json';
  },
  async parse(filePath: string, context: ParserContext): Promise<ParserResult> {
    const raw = await readJson<ChatGPTConversation[]>(filePath);
    const conversations: VaultConversation[] = raw.map((conv, index) => {
      const id = `conv-${nanoid(10)}`;
      const messages: VaultMessage[] = orderedNodes(conv.mapping).map((node) => {
        const msgId = `msg-${nanoid(10)}`;
        const content = extractContent(node.message);
        return {
          id: msgId,
          timestamp: isoFromUnix(node.message?.create_time),
          role: normalizeRole(node.message?.author?.role),
          content,
          artifacts: detectArtifacts({
            content,
            sourcePlatform: 'chatgpt',
            sourceAccount: context.account,
            rawPath: filePath,
            conversationId: id,
            messageId: msgId
          }),
          references: extractUrls(content)
        };
      });
      return {
        id,
        source: 'chatgpt',
        source_account: context.account,
        source_conversation_id: conv.id ?? `chatgpt-index-${index}`,
        title: conv.title || 'Untitled ChatGPT conversation',
        created_at: isoFromUnix(conv.create_time),
        updated_at: isoFromUnix(conv.update_time),
        imported_at: new Date().toISOString(),
        tags: ['chatgpt'],
        raw_path: filePath,
        messages
      };
    });
    return { conversations, documents: [] };
  }
};

function normalizeRole(role?: string): VaultMessage['role'] {
  if (role === 'user' || role === 'assistant' || role === 'system' || role === 'tool') return role;
  return 'unknown';
}

function extractUrls(content: string): string[] {
  return [...content.matchAll(/https?:\/\/[^\s)\]]+/g)].map((m) => m[0]);
}
