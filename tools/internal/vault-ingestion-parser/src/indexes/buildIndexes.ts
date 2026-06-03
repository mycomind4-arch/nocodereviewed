import type { VaultArtifact, VaultConversation, VaultDocument } from '../schemas/vault.js';

export function buildConversationIndex(conversations: VaultConversation[]) {
  return conversations.map((c) => ({
    id: c.id,
    source: c.source,
    source_account: c.source_account,
    title: c.title,
    created_at: c.created_at,
    updated_at: c.updated_at,
    imported_at: c.imported_at,
    message_count: c.messages.length,
    artifact_count: c.messages.reduce((sum, m) => sum + m.artifacts.length, 0),
    tags: c.tags
  }));
}

export function collectArtifacts(conversations: VaultConversation[], documents: VaultDocument[]): VaultArtifact[] {
  return [
    ...conversations.flatMap((c) => c.messages.flatMap((m) => m.artifacts)),
    ...documents.flatMap((d) => d.artifacts)
  ];
}

export function buildArtifactIndex(artifacts: VaultArtifact[]) {
  return artifacts.map((a) => ({
    id: a.id,
    type: a.type,
    title: a.title,
    tags: a.tags,
    confidence: a.confidence,
    source_conversation_id: a.source_conversation_id,
    source_message_id: a.source_message_id,
    source_document_id: a.source_document_id,
    source_platform: a.lineage.source_platform,
    created_at: a.created_at
  }));
}

export function buildTagIndex(conversations: VaultConversation[], documents: VaultDocument[], artifacts: VaultArtifact[]) {
  const counts = new Map<string, number>();
  for (const tag of [...conversations.flatMap(c => c.tags), ...documents.flatMap(d => d.tags), ...artifacts.flatMap(a => a.tags)]) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count);
}

export function buildTimelineIndex(conversations: VaultConversation[], documents: VaultDocument[]) {
  return [
    ...conversations.map(c => ({ id: c.id, type: 'conversation', title: c.title, source: c.source, date: c.created_at ?? c.imported_at })),
    ...documents.map(d => ({ id: d.id, type: 'document', title: d.title, source: d.source, date: d.imported_at }))
  ].sort((a, b) => a.date.localeCompare(b.date));
}
