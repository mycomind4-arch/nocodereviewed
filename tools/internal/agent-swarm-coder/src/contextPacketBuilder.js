/**
 * contextPacketBuilder.js
 * Builds a context packet (md + json) from relevant prior Vault records + current goal.
 * The packet is a read-only memory aid for the current run. It is saved as artifact.
 * No auto-application of changes; user reviews. Uncertainty is explicitly noted.
 * Deterministic formatting.
 */

import fs from 'node:fs';
import path from 'node:path';
import { redactSecrets } from './safetyGuard.js';

export function buildContextPacket(goal, contextRecordsResult, inspection = null) {
  const { records = [], loadedCount = 0, selectedCount = 0, sources = [], warnings = [], staleOrLow = [] } = contextRecordsResult || {};
  const generatedAt = new Date().toISOString();
  const project = (inspection && (inspection.packageInfo?.name || path.basename(inspection.projectRoot || ''))) || 'unknown';

  // Group by useful categories for packet sections (based on artifact_type or record_type)
  const groups = {
    prior_runs: [],
    decisions: [],
    evidence: [],
    commands: [],
    rollbacks: [],
    next_actions: [],
    impl_plans: [],
    other: []
  };

  for (const r of records) {
    const at = (r.artifact_type || '').toLowerCase();
    const rt = (r.record_type || '').toLowerCase();
    const entry = {
      id: r.id,
      title: r.title,
      summary: r.summary ? redactSecrets(String(r.summary).slice(0,300)) : '',
      source_run_path: r.source_run_path,
      created_at: r.created_at,
      confidence: r.confidence,
      evidence_status: r.evidence_status,
      promote_to_long_term: !!r.promote_to_long_term,
      _stale_or_low_confidence: !!r._stale_or_low_confidence,
      _relevance_score: r._relevance_score
    };
    if (at.includes('run') || rt.includes('run')) groups.prior_runs.push(entry);
    else if (at.includes('decision')) groups.decisions.push(entry);
    else if (at.includes('evidence')) groups.evidence.push(entry);
    else if (at.includes('command')) groups.commands.push(entry);
    else if (at.includes('rollback')) groups.rollbacks.push(entry);
    else if (at.includes('next')) groups.next_actions.push(entry);
    else if (at.includes('implementation') || at.includes('plan')) groups.impl_plans.push(entry);
    else groups.other.push(entry);
  }

  // Reusable patterns: simple heuristic from high-score impl/decision records mentioning "reuse|pattern|common|shared"
  const reusable = [];
  const risks = [];
  const notRepeat = [];
  for (const r of records) {
    const text = ((r.title||'') + ' ' + (r.summary||'') + ' ' + (r.content||'')).toLowerCase();
    if (/reuse|pattern|common|shared|library|util/.test(text) && r._relevance_score > 5) {
      reusable.push(r.title || r.id);
    }
    if (/risk|conflict|fail|error|avoid|problem/.test(text)) {
      risks.push((r.title || '') + ': ' + (r.summary || '').slice(0,80));
    }
    if (/do not|never|avoid|deprecated|broken/.test(text)) {
      notRepeat.push(r.title || r.id);
    }
  }

  const recommended = [
    'Review context-packet.md and the linked source_run_path artifacts before deciding on changes.',
    'Prioritize high _relevance_score + promote_to_long_term records.',
    'Cross-check against current project state (dry-run first).',
    'Update next-action.md with any new insights from this context.'
  ];

  const confidenceNotes = [
    `Loaded ${loadedCount} records from ${sources.length} Vault ingestion dir(s).`,
    `Selected top ${selectedCount} by deterministic keyword+type+recency+confidence scoring.`,
    staleOrLow.length ? `Marked ${staleOrLow.length} as stale/low-confidence (deprioritized, see details in json).` : 'No records flagged stale in top results.',
    warnings.length ? `Reader warnings: ${warnings.join('; ')}` : 'No reader warnings.',
    'This packet is advisory only. Always re-inspect current code and run safety gates. Prior records may be superseded.'
  ].join(' ');

  const packet = {
    goal,
    generated_at: generatedAt,
    project,
    loaded_records_count: loadedCount,
    selected_records_count: selectedCount,
    relevant_prior_runs: groups.prior_runs,
    relevant_decisions: groups.decisions,
    relevant_evidence: groups.evidence,
    relevant_commands: groups.commands,
    relevant_rollbacks: groups.rollbacks,
    relevant_next_actions: groups.next_actions,
    reusable_patterns: reusable.length ? reusable : ['(none strongly indicated in top records)'],
    risks_from_memory: risks.length ? risks.slice(0,5) : ['(no explicit risks surfaced)'],
    what_not_to_repeat: notRepeat.length ? notRepeat : ['(none flagged)'],
    recommended_strategy: recommended,
    confidence_notes: confidenceNotes,
    stale_or_low_confidence_records: staleOrLow,
    source_ingestion_dirs: sources
  };

  // MD version
  const mdLines = [
    `## Context Packet for Goal`,
    ``,
    `**Goal**: ${goal}`,
    `**Generated**: ${generatedAt}`,
    `**Project**: ${project}`,
    `**Records considered**: ${loadedCount} (selected ${selectedCount})`,
    ``,
    `## Relevant Prior Runs`,
    groups.prior_runs.length ? groups.prior_runs.map(r => `- ${r.title} (score=${r._relevance_score}, src=${r.source_run_path})`).join('\n') : '(none)',
    ``,
    `## Relevant Decisions`,
    groups.decisions.length ? groups.decisions.map(r => `- ${r.title || r.id}: ${r.summary} (from ${r.source_run_path})`).join('\n') : '(none)',
    ``,
    `## Relevant Evidence`,
    groups.evidence.length ? groups.evidence.map(r => `- ${r.title}: ${r.summary}`).join('\n') : '(none)',
    ``,
    `## Relevant Command Results`,
    groups.commands.length ? groups.commands.map(r => `- ${r.title || r.id} (src run: ${r.source_run_path})`).join('\n') : '(none)',
    ``,
    `## Relevant Rollback Notes`,
    groups.rollbacks.length ? groups.rollbacks.map(r => `- ${r.title || r.id}`).join('\n') : '(none in top context)',
    ``,
    `## Relevant Next Actions (from memory)`,
    groups.next_actions.length ? groups.next_actions.map(r => `- ${r.title}: ${r.summary}`).join('\n') : '(none)',
    ``,
    `## Reusable Patterns Indicated`,
    packet.reusable_patterns.map(p => `- ${p}`).join('\n'),
    ``,
    `## Risks / Conflicts from Prior Memory`,
    packet.risks_from_memory.map(r => `- ${r}`).join('\n'),
    ``,
    `## What Not To Repeat`,
    packet.what_not_to_repeat.map(p => `- ${p}`).join('\n'),
    ``,
    `## Recommended Strategy for This Run`,
    packet.recommended_strategy.map(s => `- ${s}`).join('\n'),
    ``,
    `## Confidence & Notes`,
    packet.confidence_notes,
    ``,
    `## Source Lineage`,
    `Ingestion dirs: ${sources.join(', ')}`,
    `See context-packet.json for full record details and _relevance_score.`,
    ``,
    `> This packet was built deterministically from local Vault normalized records. It is NOT auto-applied. Review every suggestion against current code, run dry-run, and respect all safety gates. Stale or low-confidence items are flagged.`
  ];

  return {
    packet,
    md: mdLines.join('\n'),
    json: packet
  };
}

export function writeContextPacket(runDir, goal, contextRecordsResult, inspection = null) {
  const { packet, md, json } = buildContextPacket(goal, contextRecordsResult, inspection);
  const jsonPath = path.join(runDir, 'context-packet.json');
  const mdPath = path.join(runDir, 'context-packet.md');
  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2) + '\n', 'utf8');
  fs.writeFileSync(mdPath, md, 'utf8');
  return { jsonPath, mdPath, packet };
}

export default {
  buildContextPacket,
  writeContextPacket
};
