import path from 'node:path';
import { promises as fs } from 'node:fs';
import { ingest } from '../src/pipelines/ingest.js';

const output = path.resolve('samples/output/test-run');
await fs.rm(output, { recursive: true, force: true });
const result = await ingest({ input: 'samples/raw', output, source: 'chatgpt', account: 'sample-account' });
if (result.conversations < 1) throw new Error('Expected at least one conversation');
const convIndex = await fs.readFile(path.join(output, 'indexes/conversations.json'), 'utf8');
if (!convIndex.includes('Intelligence Vault Planning')) throw new Error('Conversation index missing sample title');

// Test agent-swarm-coder handoff adapter (records.jsonl + manifest, classification, warnings for unknown/bad)
import { agentSwarmCoderHandoffParser } from '../src/parsers/agentSwarmCoderHandoff.js';
const fixtureRecords = 'samples/raw/agent-handoff-fixture/20260604T000000-test-agent-run/vault-handoff/records.jsonl';
if (!(await agentSwarmCoderHandoffParser.canParse(fixtureRecords))) throw new Error('agent handoff parser did not claim fixture records.jsonl');
const res: any = await agentSwarmCoderHandoffParser.parse(fixtureRecords, { source: 'test-agent' });
if (!res.handoffRecords || res.handoffRecords.length < 4) throw new Error('agent handoff adapter parsed too few records');
if (!res.warnings || res.warnings.length < 1) throw new Error('agent handoff adapter should produce warnings for unknown record_type and invalid NDJSON line');
if (!res.manifest || res.manifest.export_version !== 'agent-run-handoff.v1') throw new Error('manifest not read');
console.log('Smoke test passed (incl agent handoff adapter)');
