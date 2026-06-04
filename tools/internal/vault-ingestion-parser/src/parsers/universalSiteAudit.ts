import { promises as fs } from 'node:fs';
import path from 'node:path';
import { nanoid } from 'nanoid';
import type { ParserAdapter, ParserContext, ParserResult } from './types.js';
import type { VaultDocument, VaultArtifact } from '../schemas/vault.js';

export const universalSiteAuditParser: ParserAdapter = {
  name: 'universal-site-audit',
  canParse(filePath: string) {
    return path.basename(filePath) === 'universal-site-audit.json';
  },
  async parse(filePath: string, context: ParserContext): Promise<ParserResult> {
    const raw = await fs.readFile(filePath, 'utf8');
    const audit = JSON.parse(raw);
    const docs: VaultDocument[] = [];
    const artifacts: VaultArtifact[] = [];

    const sections = audit.sections || {};
    const now = new Date().toISOString();

    // Turn key sections into documents
    const sectionKeys = ['inventory', 'sourceSafety', 'routes', 'links', 'evidence', 'reviews', 'microsites', 'vibeAuditorGate', 'assets', 'unsafeExposure', 'blog', 'recommendedActions'];
    for (const key of sectionKeys) {
      if (sections[key]) {
        const id = `doc-site-${nanoid(8)}`;
        const content = typeof sections[key] === 'string' ? sections[key] : JSON.stringify(sections[key], null, 2);
        docs.push({
          id,
          source: context.source,
          source_account: context.account,
          title: `Site Audit: ${key}`,
          path: filePath,
          imported_at: now,
          content_type: 'json',
          content: content.slice(0, 10000), // cap
          tags: ['site-audit', key, 'admin'],
          artifacts: []
        });
      }
    }

    // Critical / recommended as artifacts
    const recs = sections.recommendedActions || [];
    for (const rec of recs.slice(0, 20)) {
      artifacts.push({
        id: `artifact-${nanoid(8)}`,
        type: 'evidence_claim',
        title: rec.action || rec.title || 'Recommended action',
        content: `${rec.reason || ''} (priority: ${rec.priority || 'medium'})`,
        tags: ['site-audit', 'recommended', rec.priority || 'medium'],
        confidence: 0.8,
        created_at: now,
        lineage: {
          source_platform: context.source,
          source_account: context.account,
          raw_path: filePath
        }
      });
    }

    // Unsafe critical
    if (sections.unsafeExposure && sections.unsafeExposure.critical > 0) {
      artifacts.push({
        id: `artifact-${nanoid(8)}`,
        type: 'evidence_claim',
        title: 'Unsafe exposure detected',
        content: JSON.stringify(sections.unsafeExposure),
        tags: ['site-audit', 'unsafe', 'critical'],
        confidence: 1.0,
        created_at: now,
        lineage: { source_platform: context.source, raw_path: filePath }
      });
    }

    return { conversations: [], documents: docs };
  }
};
