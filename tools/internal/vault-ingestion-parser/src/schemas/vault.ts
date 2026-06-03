import { z } from 'zod';

export const ArtifactTypeSchema = z.enum([
  'code',
  'prompt',
  'architecture',
  'decision',
  'workflow',
  'todo',
  'benchmark',
  'evidence_claim',
  'codex_instruction',
  'unknown'
]);

export type ArtifactType = z.infer<typeof ArtifactTypeSchema>;

export const ArtifactSchema = z.object({
  id: z.string(),
  type: ArtifactTypeSchema,
  source_conversation_id: z.string().optional(),
  source_message_id: z.string().optional(),
  source_document_id: z.string().optional(),
  title: z.string().optional(),
  content: z.string(),
  language: z.string().optional(),
  tags: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1).default(0.5),
  created_at: z.string(),
  lineage: z.object({
    source_platform: z.string(),
    source_account: z.string().optional(),
    raw_path: z.string().optional()
  })
});

export const VaultMessageSchema = z.object({
  id: z.string(),
  timestamp: z.string().optional(),
  role: z.enum(['user', 'assistant', 'system', 'tool', 'unknown']),
  content: z.string(),
  artifacts: z.array(ArtifactSchema).default([]),
  references: z.array(z.string()).default([])
});

export const VaultConversationSchema = z.object({
  id: z.string(),
  source: z.string(),
  source_account: z.string().optional(),
  source_conversation_id: z.string().optional(),
  title: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  imported_at: z.string(),
  tags: z.array(z.string()).default([]),
  raw_path: z.string().optional(),
  messages: z.array(VaultMessageSchema)
});

export const VaultDocumentSchema = z.object({
  id: z.string(),
  source: z.string(),
  source_account: z.string().optional(),
  title: z.string(),
  path: z.string(),
  imported_at: z.string(),
  content_type: z.string(),
  content: z.string(),
  tags: z.array(z.string()).default([]),
  artifacts: z.array(ArtifactSchema).default([])
});

export type VaultArtifact = z.infer<typeof ArtifactSchema>;
export type VaultMessage = z.infer<typeof VaultMessageSchema>;
export type VaultConversation = z.infer<typeof VaultConversationSchema>;
export type VaultDocument = z.infer<typeof VaultDocumentSchema>;
