import { promises as fs } from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import type { z } from 'zod';
import {
  PromotedArtifactSchema,
  PromotedAuditHandoffSchema,
  PromotedCodeBlockSchema,
  PromotedCommandSchema,
  PromotedConversationSchema,
  PromotedMessageSchema,
  PromotedProjectSchema,
  PromotedPromptSchema,
  VaultExportManifestSchema,
  VaultExportVersion,
  VaultSchemaVersion,
  type VaultExportManifest,
  type VaultPromotedRecords
} from '../schemas/vault.js';
import { readJson } from '../utils/fs.js';
import type { ParserAdapter, ParserContext, ParserResult } from './types.js';

type RecordFolderConfig<TSchema extends z.ZodTypeAny> = {
  key: keyof VaultPromotedRecords;
  countKey: string;
  folder: string;
  recordType: string;
  schema: TSchema;
};

const RECORD_FOLDERS = [
  { key: 'conversations', countKey: 'conversations', folder: 'conversations', recordType: 'VaultConversation', schema: PromotedConversationSchema },
  { key: 'messages', countKey: 'messages', folder: 'messages', recordType: 'VaultMessage', schema: PromotedMessageSchema },
  { key: 'artifacts', countKey: 'artifacts', folder: 'artifacts', recordType: 'VaultArtifact', schema: PromotedArtifactSchema },
  { key: 'projects', countKey: 'projects', folder: 'projects', recordType: 'VaultProject', schema: PromotedProjectSchema },
  { key: 'prompts', countKey: 'prompts', folder: 'prompts', recordType: 'VaultPrompt', schema: PromotedPromptSchema },
  { key: 'codeBlocks', countKey: 'code_blocks', folder: 'code-blocks', recordType: 'VaultCodeBlock', schema: PromotedCodeBlockSchema },
  { key: 'commands', countKey: 'commands', folder: 'commands', recordType: 'VaultCommand', schema: PromotedCommandSchema },
  { key: 'auditHandoffs', countKey: 'audit_handoffs', folder: 'audit-handoffs', recordType: 'VaultAuditHandoff', schema: PromotedAuditHandoffSchema }
] satisfies RecordFolderConfig<z.ZodTypeAny>[];

export const localVaultHandoffParser: ParserAdapter = {
  name: 'local-vault-handoff',
  async canParse(filePath: string) {
    return isVaultExportManifest(filePath);
  },
  async claimFiles(filePath: string) {
    return filesInBundle(path.dirname(filePath));
  },
  async parse(filePath: string, _context: ParserContext): Promise<ParserResult> {
    const root = path.dirname(filePath);
    const manifest = await readManifest(filePath);
    await validateLayout(root, manifest);
    const promotedRecords = await readPromotedRecords(root, manifest);
    validateManifestCounts(manifest, promotedRecords);
    validateRecordGraph(promotedRecords);
    return {
      conversations: [],
      documents: [],
      promotedRecords,
      claimedFiles: await filesInBundle(root)
    };
  }
};

export async function isVaultExportManifest(filePath: string) {
  if (path.basename(filePath).toLowerCase() !== 'manifest.json') return false;
  try {
    const data = await readJson<Record<string, unknown>>(filePath);
    return data.schema_version === VaultSchemaVersion && data.export_version === VaultExportVersion;
  } catch {
    return false;
  }
}

async function readManifest(filePath: string): Promise<VaultExportManifest> {
  const parsed = VaultExportManifestSchema.safeParse(await readJson<unknown>(filePath));
  if (!parsed.success) {
    throw new Error(`Invalid vault export manifest: ${parsed.error.issues.map(issue => issue.message).join('; ')}`);
  }
  return parsed.data;
}

async function validateLayout(root: string, manifest: VaultExportManifest) {
  const problems: string[] = [];
  for (const config of RECORD_FOLDERS) {
    const expected = manifest.record_counts[config.countKey] ?? 0;
    const folderPath = path.join(root, config.folder);
    const exists = await pathExists(folderPath);
    if (expected > 0 && !exists) {
      problems.push(`Missing ${config.folder}/ for ${expected} ${config.recordType} record(s)`);
    }
  }
  for (const folder of ['raw', 'indexes']) {
    if (!(await pathExists(path.join(root, folder)))) {
      problems.push(`Missing ${folder}/ folder`);
    }
  }
  if (problems.length) throw new Error(`Invalid vault export layout: ${problems.join('; ')}`);
}

async function readPromotedRecords(root: string, manifest: VaultExportManifest): Promise<VaultPromotedRecords> {
  const records = emptyPromotedRecords();
  for (const config of RECORD_FOLDERS) {
    records[config.key] = await readRecordFolder(root, config, manifest) as never;
  }
  return records;
}

async function readRecordFolder<TSchema extends z.ZodTypeAny>(
  root: string,
  config: RecordFolderConfig<TSchema>,
  manifest: VaultExportManifest
): Promise<Array<z.infer<TSchema>>> {
  const dir = path.join(root, config.folder);
  if (!(await pathExists(dir))) return [];
  const files = (await fg(['*.json'], { cwd: dir, absolute: true, onlyFiles: true })).sort();
  const records: Array<z.infer<TSchema>> = [];
  const problems: string[] = [];

  for (const file of files) {
    let raw: unknown;
    try {
      raw = await readJson<unknown>(file);
    } catch (error) {
      problems.push(`${path.relative(root, file)} could not be parsed as JSON: ${(error as Error).message}`);
      continue;
    }

    const parsed = config.schema.safeParse(raw);
    if (!parsed.success) {
      problems.push(`${path.relative(root, file)} failed ${config.recordType} validation: ${parsed.error.issues.map(issue => `${issue.path.join('.') || 'record'} ${issue.message}`).join(', ')}`);
      continue;
    }

    const expectedName = `${parsed.data.id}.json`;
    if (path.basename(file) !== expectedName) {
      problems.push(`${path.relative(root, file)} must be named ${expectedName}`);
    }
    if (!manifest.included_record_types.includes(parsed.data.record_type)) {
      problems.push(`${path.relative(root, file)} has record_type ${parsed.data.record_type}, which is missing from manifest.included_record_types`);
    }
    records.push(parsed.data);
  }

  if (problems.length) throw new Error(`Invalid vault export records: ${problems.join('; ')}`);
  return records;
}

function validateManifestCounts(manifest: VaultExportManifest, records: VaultPromotedRecords) {
  const problems: string[] = [];
  for (const config of RECORD_FOLDERS) {
    const expected = manifest.record_counts[config.countKey] ?? 0;
    const actual = records[config.key].length;
    if (expected !== actual) {
      problems.push(`${config.countKey} manifest count ${expected} does not match ${actual} parsed record(s)`);
    }
  }
  if (problems.length) throw new Error(`Invalid vault export manifest counts: ${problems.join('; ')}`);
}

function validateRecordGraph(records: VaultPromotedRecords) {
  const problems: string[] = [];
  const allIds = new Set<string>();
  const messageIds = new Set(records.messages.map(record => record.id));
  const artifactIds = new Set(records.artifacts.map(record => record.id));
  const projectIds = new Set(records.projects.map(record => record.id));
  const promptIds = new Set(records.prompts.map(record => record.id));
  const codeIds = new Set(records.codeBlocks.map(record => record.id));
  const commandIds = new Set(records.commands.map(record => record.id));
  const auditHandoffIds = new Set(records.auditHandoffs.map(record => record.id));
  const conversationIds = new Set(records.conversations.map(record => record.id));

  for (const record of allPromotedRecords(records)) {
    if (allIds.has(record.id)) problems.push(`Duplicate record id ${record.id}`);
    allIds.add(record.id);
  }

  for (const conversation of records.conversations) {
    validateRefs(problems, conversation.id, 'messages', conversation.messages, messageIds);
    validateRefs(problems, conversation.id, 'artifact_ids', conversation.artifact_ids, artifactIds);
  }
  for (const message of records.messages) {
    validateRef(problems, message.id, 'conversation_id', message.conversation_id, conversationIds);
    validateRefs(problems, message.id, 'artifact_ids', message.artifact_ids, artifactIds);
  }
  for (const artifact of records.artifacts) {
    validateRefs(problems, artifact.id, 'related_record_ids', artifact.related_record_ids, allIds);
  }
  for (const project of records.projects) {
    validateRefs(problems, project.id, 'related_artifact_ids', project.related_artifact_ids, artifactIds);
    if (project.audit_handoff_id) validateRef(problems, project.id, 'audit_handoff_id', project.audit_handoff_id, auditHandoffIds);
  }
  for (const prompt of records.prompts) {
    validateRefs(problems, prompt.id, 'related_project_ids', prompt.related_project_ids, projectIds);
    validateRefs(problems, prompt.id, 'related_artifact_ids', prompt.related_artifact_ids, artifactIds);
  }
  for (const codeBlock of records.codeBlocks) {
    validateRefs(problems, codeBlock.id, 'related_project_ids', codeBlock.related_project_ids, projectIds);
    validateRefs(problems, codeBlock.id, 'related_command_ids', codeBlock.related_command_ids, commandIds);
  }
  for (const command of records.commands) {
    validateRefs(problems, command.id, 'related_project_ids', command.related_project_ids, projectIds);
    validateRefs(problems, command.id, 'related_code_ids', command.related_code_ids, codeIds);
  }
  for (const handoff of records.auditHandoffs) {
    if (handoff.project_id) validateRef(problems, handoff.id, 'project_id', handoff.project_id, projectIds);
    validateRefs(problems, handoff.id, 'artifact_ids', handoff.artifact_ids, artifactIds);
    validateRefs(problems, handoff.id, 'prompt_ids', handoff.prompt_ids, promptIds);
    validateRefs(problems, handoff.id, 'code_ids', handoff.code_ids, codeIds);
    validateRefs(problems, handoff.id, 'command_ids', handoff.command_ids, commandIds);
  }

  if (problems.length) throw new Error(`Invalid vault export references: ${problems.join('; ')}`);
}

function emptyPromotedRecords(): VaultPromotedRecords {
  return {
    conversations: [],
    messages: [],
    artifacts: [],
    projects: [],
    prompts: [],
    codeBlocks: [],
    commands: [],
    auditHandoffs: []
  };
}

function validateRefs(problems: string[], recordId: string, field: string, refs: string[] = [], validIds: Set<string>) {
  for (const ref of refs) validateRef(problems, recordId, field, ref, validIds);
}

function validateRef(problems: string[], recordId: string, field: string, ref: string, validIds: Set<string>) {
  if (ref && !validIds.has(ref)) problems.push(`${recordId}.${field} references missing id ${ref}`);
}

function allPromotedRecords(records: VaultPromotedRecords) {
  return [
    ...records.conversations,
    ...records.messages,
    ...records.artifacts,
    ...records.projects,
    ...records.prompts,
    ...records.codeBlocks,
    ...records.commands,
    ...records.auditHandoffs
  ];
}

async function filesInBundle(root: string) {
  return fg(['**/*'], { cwd: root, absolute: true, onlyFiles: true, dot: true });
}

async function pathExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
