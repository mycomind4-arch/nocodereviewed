import { nanoid } from 'nanoid';
import type { ArtifactType, VaultArtifact } from '../schemas/vault.js';

const detectors: Array<{ type: ArtifactType; pattern: RegExp; confidence: number }> = [
  { type: 'codex_instruction', pattern: /\b(codex|implementation instructions|acceptance criteria|file targets)\b/i, confidence: 0.72 },
  { type: 'architecture', pattern: /\b(architecture|schema|data model|modular|local-first|system design|routing)\b/i, confidence: 0.66 },
  { type: 'decision', pattern: /\b(decision|decided|we should|priority order|do not build|avoid)\b/i, confidence: 0.62 },
  { type: 'workflow', pattern: /\b(workflow|pipeline|process|step 1|phase 1|ingestion|normalize)\b/i, confidence: 0.6 },
  { type: 'todo', pattern: /\b(todo|next step|fix|implement|build|add|remove)\b/i, confidence: 0.54 },
  { type: 'benchmark', pattern: /\b(benchmark|score|ranking|methodology|comparison)\b/i, confidence: 0.58 },
  { type: 'evidence_claim', pattern: /\b(evidence|source|citation|claim|confidence|verified|proof)\b/i, confidence: 0.64 },
  { type: 'prompt', pattern: /\b(prompt|system prompt|instruction set|copy this into)\b/i, confidence: 0.58 }
];

export function detectArtifacts(params: {
  content: string;
  sourcePlatform: string;
  sourceAccount?: string;
  rawPath?: string;
  conversationId?: string;
  messageId?: string;
  documentId?: string;
}): VaultArtifact[] {
  const { content } = params;
  const artifacts: VaultArtifact[] = [];
  const now = new Date().toISOString();

  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  for (const match of content.matchAll(codeBlockRegex)) {
    artifacts.push({
      id: `artifact-${nanoid(10)}`,
      type: 'code',
      source_conversation_id: params.conversationId,
      source_message_id: params.messageId,
      source_document_id: params.documentId,
      title: 'Detected code block',
      content: match[2].trim(),
      language: match[1] || undefined,
      tags: ['detected', 'code-block'],
      confidence: 0.95,
      created_at: now,
      lineage: { source_platform: params.sourcePlatform, source_account: params.sourceAccount, raw_path: params.rawPath }
    });
  }

  for (const detector of detectors) {
    if (detector.pattern.test(content)) {
      artifacts.push({
        id: `artifact-${nanoid(10)}`,
        type: detector.type,
        source_conversation_id: params.conversationId,
        source_message_id: params.messageId,
        source_document_id: params.documentId,
        title: `Detected ${detector.type.replaceAll('_', ' ')}`,
        content: content.slice(0, 4000),
        tags: ['detected', detector.type],
        confidence: detector.confidence,
        created_at: now,
        lineage: { source_platform: params.sourcePlatform, source_account: params.sourceAccount, raw_path: params.rawPath }
      });
    }
  }

  return artifacts;
}
