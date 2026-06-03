import path from 'node:path';
import { promises as fs } from 'node:fs';
import { ingest } from '../src/pipelines/ingest.js';

const output = path.resolve('samples/output/test-run');
await fs.rm(output, { recursive: true, force: true });
const result = await ingest({ input: 'samples/raw', output, source: 'chatgpt', account: 'sample-account' });
if (result.conversations < 1) throw new Error('Expected at least one conversation');
const convIndex = await fs.readFile(path.join(output, 'indexes/conversations.json'), 'utf8');
if (!convIndex.includes('Intelligence Vault Planning')) throw new Error('Conversation index missing sample title');
console.log('Smoke test passed');
