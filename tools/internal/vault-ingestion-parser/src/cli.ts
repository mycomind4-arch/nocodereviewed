#!/usr/bin/env node
import { Command } from 'commander';
import { ingest } from './pipelines/ingest.js';

const program = new Command();

program
  .name('vault-ingest')
  .description('Local-first Vault Ingestion Parser for AI exports and operational artifacts')
  .version('0.1.0');

program.command('ingest')
  .requiredOption('-i, --input <path>', 'input export/file/folder')
  .requiredOption('-o, --output <path>', 'output intelligence vault folder')
  .option('-s, --source <source>', 'source platform label', 'unknown')
  .option('-a, --account <account>', 'source account label')
  .option('--no-preserve-raw', 'do not copy raw input into raw archive')
  .action(async (opts) => {
    const result = await ingest({
      input: opts.input,
      output: opts.output,
      source: opts.source,
      account: opts.account,
      preserveRaw: opts.preserveRaw
    });
    console.log(`Ingestion complete: ${result.conversations} conversations, ${result.documents} documents`);
    console.log(`Output: ${result.output}`);
  });

program.command('ingest-agent-handoff')
  .option('-s, --source <source>', 'source directory containing coding-agent-runs (with vault-handoff subdirs)', 'outputs/coding-agent-runs')
  .action(async (opts) => {
    const { ingestAgentHandoff } = await import('./ingest-agent-handoff.js');
    await ingestAgentHandoff({ source: opts.source });
  });

program.parseAsync(process.argv).catch((error) => {
  console.error(error);
  process.exit(1);
});
