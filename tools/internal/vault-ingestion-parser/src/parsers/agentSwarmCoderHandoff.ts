/**
 * agentSwarmCoderHandoff.ts
 * Parser adapter for agent-swarm-coder vault-handoff records (flat records.jsonl + manifest).
 *
 * Detects outputs/.../vault-handoff/records.jsonl where sibling manifest has source_application "agent-swarm-coder"
 * or export_version "agent-run-handoff.v1".
 *
 * Reads manifest + NDJSON records.jsonl .
 * Validates lines as JSON, classifies by record_type (VaultArtifact / VaultCommand supported, others -> VaultArtifact w/ warning).
 * Preserves all specified fields: id, record_type, source_*, project, source_run_path, created_at, title, summary, content_ref/content,
 * tags, confidence, privacy_level, evidence_status, related_records, promote_to_long_term, artifact_type, command, etc.
 * Adds parser metadata (ingested_at, source_handoff_path) for lineage.
 *
 * Returns documents (one per record for generic compatibility) + extra handoffRecords for specialized use.
 * Does NOT mutate source.
 * Follows VAULT_DATA_CONTRACT (no new record types; unknown preserved as VaultArtifact).
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ParserAdapter, ParserContext, ParserResult } from './types.js';

export interface AgentHandoffRecord {
  id: string;
  schema_version: string;
  record_type: string;
  source_platform: string;
  source_tool?: string;
  source_run_path: string;
  project?: string;
  source_ref?: any;
  created_at: string;
  title?: string;
  summary?: string;
  content_ref?: any;
  content?: string;
  tags: string[];
  confidence?: number;
  privacy_level: string;
  evidence_status?: string;
  related_records?: string[];
  promote_to_long_term?: boolean;
  artifact_type?: string;
  command?: string;
  [key: string]: any; // preserve extra from source
}

export interface AgentHandoffParseResult extends ParserResult {
  handoffRecords: AgentHandoffRecord[];
  manifest: any;
  warnings: string[];
}

export const agentSwarmCoderHandoffParser: ParserAdapter = {
  name: 'agent-swarm-coder-handoff',
  async canParse(filePath: string): Promise<boolean> {
    if (path.basename(filePath).toLowerCase() !== 'records.jsonl') return false;
    const dir = path.dirname(filePath);
    const manifestPath = path.join(dir, 'manifest.json');
    try {
      await fs.access(manifestPath);
      const manifestRaw = await fs.readFile(manifestPath, 'utf8');
      const manifest = JSON.parse(manifestRaw);
      return (
        manifest.source_application === 'agent-swarm-coder' ||
        (manifest.export_version || '').includes('agent-run-handoff')
      );
    } catch {
      return false;
    }
  },
  async parse(filePath: string, context: ParserContext): Promise<ParserResult> {
    const dir = path.dirname(filePath);
    const manifestPath = path.join(dir, 'manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    const recordsContent = await fs.readFile(filePath, 'utf8');
    const lines = recordsContent
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    const handoffRecords: AgentHandoffRecord[] = [];
    const warnings: string[] = [];
    const documents: any[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let rec: any;
      try {
        rec = JSON.parse(line);
      } catch (e) {
        warnings.push(`Line ${i + 1} in records.jsonl is not valid JSON: ${(e as Error).message}`);
        continue;
      }

      // Basic required per contract + query
      if (!rec.id || !rec.record_type || !rec.schema_version || !rec.source_platform || !rec.created_at || !rec.privacy_level) {
        warnings.push(`Record at line ${i + 1} missing required fields (id/record_type/schema_version/source_platform/created_at/privacy_level)`);
        // still include
      }

      let recordType = rec.record_type;
      if (!['VaultArtifact', 'VaultCommand'].includes(recordType)) {
        warnings.push(`Unknown record_type "${recordType}" at line ${i + 1}; preserving as VaultArtifact`);
        recordType = 'VaultArtifact';
      }

      const normalized: AgentHandoffRecord = {
        ...rec, // preserve everything
        record_type: recordType,
        ingested_at: new Date().toISOString(),
        source_handoff_path: dir,
        source: context.source || 'agent-swarm-coder-handoff',
      };

      handoffRecords.push(normalized);

      // Also expose as document for generic pipeline compatibility (content = compact json of the vault record)
      documents.push({
        id: `doc-${normalized.id}`,
        source: context.source || 'agent-swarm-coder',
        source_account: context.account,
        title: normalized.title || `${normalized.record_type}:${normalized.id}`,
        path: filePath,
        imported_at: normalized.ingested_at,
        content_type: 'json',
        content: JSON.stringify(normalized),
        tags: [...(normalized.tags || []), 'agent-handoff', normalized.record_type.toLowerCase()],
        artifacts: []
      });
    }

    return {
      conversations: [],
      documents,
      // extra for specialized agent ingest (not in base interface but runtime available)
      handoffRecords,
      manifest,
      warnings
    } as any;
  }
};

export default agentSwarmCoderHandoffParser;
