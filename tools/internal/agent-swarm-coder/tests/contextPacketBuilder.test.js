import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { buildContextPacket, writeContextPacket } from '../src/contextPacketBuilder.js';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-ctx-builder-'));

describe('contextPacketBuilder', () => {
  const fakeResult = {
    records: [
      { id: 'r1', record_type: 'VaultArtifact', artifact_type: 'agent-run', title: 'Prior inspect run', summary: 'Used vault for context', source_run_path: 'outputs/coding-agent-runs/prior1', created_at: '2026-06-01', confidence: 0.9, promote_to_long_term: true, _relevance_score: 12, tags: ['inspect'] },
      { id: 'r2', record_type: 'VaultArtifact', artifact_type: 'decision-log', title: 'Decision: add reader', summary: 'Deterministic rank by goal tokens', source_run_path: 'outputs/coding-agent-runs/prior1', created_at: '2026-06-01', confidence: 0.8, _relevance_score: 10, tags: [] },
      { id: 'r3', record_type: 'VaultCommand', title: 'cmd result', summary: 'npm test passed', source_run_path: 'outputs/coding-agent-runs/prior2', created_at: '2026-05-01', confidence: 0.3, _stale_or_low_confidence: true, _relevance_score: 2 }
    ],
    loadedCount: 5,
    selectedCount: 3,
    sources: ['outputs/vault-ingestion-runs/fake'],
    warnings: [],
    staleOrLow: ['r3']
  };

  it('builds packet with all required sections and metadata', () => {
    const goal = 'inspect this project and recommend using prior local Vault context';
    const { packet, md, json } = buildContextPacket(goal, fakeResult, { projectRoot: '/tmp/testproj' });
    assert.equal(packet.goal, goal);
    assert.ok(packet.generated_at);
    assert.ok(Array.isArray(packet.relevant_prior_runs));
    assert.ok(Array.isArray(packet.relevant_decisions));
    assert.ok(Array.isArray(packet.relevant_evidence));
    assert.ok(Array.isArray(packet.relevant_commands));
    assert.ok(Array.isArray(packet.relevant_rollbacks));
    assert.ok(Array.isArray(packet.relevant_next_actions));
    assert.ok(Array.isArray(packet.reusable_patterns));
    assert.ok(Array.isArray(packet.risks_from_memory));
    assert.ok(Array.isArray(packet.what_not_to_repeat));
    assert.ok(Array.isArray(packet.recommended_strategy));
    assert.ok(typeof packet.confidence_notes === 'string');
    assert.ok(packet.selected_records_count > 0);
    assert.ok(md.includes('## Context Packet for Goal'));
    assert.ok(md.includes('Relevant Prior Runs'));
    assert.ok(md.includes('Confidence & Notes'));
    assert.ok(json.stale_or_low_confidence_records.length >= 1);
    assert.ok(json.source_ingestion_dirs.length > 0);
  });

  it('writeContextPacket creates .md and .json in runDir without secrets', () => {
    const runDir = path.join(tmp, 'test-run-dir');
    fs.mkdirSync(runDir, { recursive: true });
    const goal = 'test goal with secret API_KEY=sekrit in some record but redacted';
    const fakeWithSecret = { ...fakeResult, records: [{...fakeResult.records[0], content: 'key=sekrit123'}] };
    const paths = writeContextPacket(runDir, goal, fakeWithSecret);
    assert.ok(fs.existsSync(paths.jsonPath));
    assert.ok(fs.existsSync(paths.mdPath));
    const j = JSON.parse(fs.readFileSync(paths.jsonPath, 'utf8'));
    assert.ok(!JSON.stringify(j).includes('sekrit123'));
    const m = fs.readFileSync(paths.mdPath, 'utf8');
    assert.ok(m.includes('Context Packet'));
    assert.ok(!m.includes('sekrit123'));
  });

  it('packet notes uncertainty and does not claim truth', () => {
    const goal = 'foo';
    const { packet } = buildContextPacket(goal, {records:[], loadedCount:0, selectedCount:0, sources:[], warnings:['none']});
    assert.ok(packet.confidence_notes.includes('advisory') || packet.confidence_notes.includes('review'));
    assert.ok(packet.recommended_strategy.some(s => /review|dry-run|safety/.test(s)));
  });
});
