/**
 * repl.js
 * Interactive terminal mode for agent-swarm-coder.
 * Maintains session state and enforces safety gates with explicit confirmations.
 */

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import { runAgent } from './codingAgent.js';
import { inspectProject } from './projectInspector.js';
import { runCommand } from './commandRunner.js';

export function createSession(initialOpts = {}) {
  return {
    projectPath: initialOpts.project || '.',
    goal: initialOpts.goal || null,
    packagePath: initialOpts.packagePath || null,
    dryRun: true, // ALWAYS default to dry-run
    lastResult: null,
    options: {
      vaultHandoff: initialOpts.vaultHandoff || false,
      contextPacket: initialOpts.contextPacket || false,
      compilePackage: initialOpts.compilePackage || false,
      allowRepairApply: initialOpts.allowRepairApply || false,
      allowDeletes: initialOpts.allowDeletes || false,
      allowSecretEdits: initialOpts.allowSecretEdits || false,
      provider: initialOpts.provider || 'simulated',
      geminiModel: initialOpts.geminiModel || null
    }
  };
}

export async function processCommand(session, line, { ask, confirm }) {
  if (!line) return true;

  const parts = line.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');

  try {
    if (cmd === 'exit' || cmd === 'quit') {
      return false;
    } else if (cmd === 'help') {
      printHelp();
    } else if (cmd === 'status') {
      printStatus(session);
    } else if (cmd === 'inspect') {
      const inspection = inspectProject(session.projectPath);
      console.log(`Project: ${inspection.name} v${inspection.version}`);
      console.log(`Files: ${inspection.fileCount}, Scripts: ${Object.keys(inspection.scripts).join(', ')}`);
    } else if (cmd === 'goal') {
      if (args) {
        session.goal = args;
        console.log(`Goal set: ${session.goal}`);
      } else {
        console.log(`Current goal: ${session.goal || '(none)'}`);
      }
    } else if (cmd === 'package') {
      if (args) {
        session.packagePath = args;
        console.log(`Package set: ${session.packagePath}`);
      } else {
        console.log(`Current package: ${session.packagePath || '(none)'}`);
      }
    } else if (cmd === 'dry-run' || cmd === 'dry') {
      session.dryRun = true;
      console.log('Mode: DRY-RUN (safe, no writes)');
    } else if (cmd === 'apply') {
      if (await confirm('ARM APPLY MODE? This permits file writes and requires extreme caution.')) {
        session.dryRun = false;
        console.log('Mode: APPLY armed. (Next run will still require final confirmation)');
      } else {
        console.log('Mode remains DRY-RUN.');
      }
    } else if (cmd === 'plan') {
      await executeRun(session, { forceDry: true, label: 'Planning' }, { confirm });
    } else if (cmd === 'compile') {
      await executeRun(session, { forceDry: true, compile: true, label: 'Compiling Package' }, { confirm });
    } else if (cmd === 'run') {
      await executeRun(session, { label: 'Execution' }, { confirm });
    } else if (cmd === 'test') {
      console.log('Running npm test...');
      const res = runCommand('npm test', session.projectPath);
      console.log(res.stdout || res.stderr);
    } else if (cmd === 'build') {
      console.log('Running npm run build...');
      const res = runCommand('npm run build', session.projectPath);
      console.log(res.stdout || res.stderr);
    } else if (cmd === 'last-run') {
      if (session.lastResult) {
        console.log(`Last Run ID: ${session.lastResult.runId}`);
        console.log(`Directory:   ${session.lastResult.runDir}`);
        console.log(`Summary:     ${session.lastResult.summaryPath}`);
      } else {
        console.log('No runs recorded in this session.');
      }
    } else if (cmd === 'provider') {
      if (args) {
        session.options.provider = args;
        if (session.options.provider === 'gemini') {
          const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
          if (!apiKey) {
            console.log('WARNING: GEMINI_API_KEY or GOOGLE_API_KEY not found in environment.');
          } else {
            const { GeminiProvider } = await import('./providers/geminiProvider.js');
            const { registerProvider } = await import('./providerRegistry.js');
            registerProvider('gemini', new GeminiProvider({ 
              apiKey, 
              model: session.options.geminiModel 
            }));
          }
        }
        console.log(`Provider set: ${session.options.provider}`);
      } else {
        console.log(`Current provider: ${session.options.provider || 'simulated'}`);
      }
    } else if (cmd === 'handoff') {
      if (session.lastResult && session.lastResult.runDir) {
        const { createVaultHandoffForRun } = await import('./vaultHandoffBuilder.js');
        const res = createVaultHandoffForRun(session.lastResult.runDir);
        console.log(`Vault Handoff created: ${res.handoffDir}`);
      } else {
        console.log('No recent run to handoff.');
      }
    } else if (cmd === 'compound') {
      session.options.vaultHandoff = true;
      session.options.contextPacket = true;
      console.log('Compound mode enabled: context-packet + vault-handoff.');
    } else if (cmd === 'repair') {
      if (session.lastResult) {
        console.log('Triggering repair loop (dry-run)...');
        await executeRun(session, { forceRepair: true, forceDry: true, label: 'Repair' }, { confirm });
      } else {
        console.log('No recent run to repair.');
      }
    } else if (cmd === 'open') {
      if (session.lastResult && session.lastResult.runDir) {
        const platform = process.platform;
        const openCmd = platform === 'darwin' ? 'open' : (platform === 'win32' ? 'start' : 'xdg-open');
        runCommand(`${openCmd} "${session.lastResult.runDir}"`, '.');
      } else {
        console.log('No recent run directory to open.');
      }
    } else {
      console.log(`Unknown command: ${cmd}. Type "help" for list.`);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
  return true;
}

export async function startRepl(initialOpts = {}) {
  const rl = readline.createInterface({ input, output });
  const session = createSession(initialOpts);

  console.log('\n--- agent-swarm-coder INTERACTIVE MODE ---');
  console.log('Type "help" for commands. Dry-run is ENABLED by default.');
  console.log(`Project: ${path.resolve(session.projectPath)}\n`);

  const ask = async (q) => {
    const response = await rl.question(q);
    return response.trim();
  };

  const confirm = async (msg) => {
    const res = await ask(`${msg} (y/N): `);
    return res.toLowerCase() === 'y';
  };

  while (true) {
    const prompt = `[${session.dryRun ? 'DRY' : 'APPLY'}] ${session.goal ? 'goal-set' : 'no-goal'} > `;
    const line = await ask(prompt);
    const keepGoing = await processCommand(session, line, { ask, confirm });
    if (!keepGoing) break;
  }

  rl.close();
  console.log('Exiting interactive mode.');
}

async function executeRun(session, opts = {}, { confirm }) {
  const isApply = !session.dryRun && !opts.forceDry;
  
  if (isApply) {
    const confirmed = await confirm('\n⚠️  WARNING: You are about to RUN in APPLY MODE. Writes are enabled.\nProceed?');
    if (!confirmed) {
      console.log('Run cancelled.');
      return;
    }
  }

  console.log(`\nStarting ${opts.label || 'agent run'}...`);
  const result = await runAgent({
    projectPath: session.projectPath,
    goal: session.goal,
    packagePath: session.packagePath,
    dryRun: isApply ? false : true,
    compilePackage: opts.compile || session.options.compilePackage,
    vaultHandoff: session.options.vaultHandoff,
    contextPacket: session.options.contextPacket,
    allowRepairApply: session.options.allowRepairApply,
    allowDeletes: session.options.allowDeletes,
    allowSecretEdits: session.options.allowSecretEdits,
    providerId: session.options.provider
  });

  session.lastResult = result;
  console.log(`\n=== RUN COMPLETE ===`);
  console.log(`ID:      ${result.runId}`);
  console.log(`Dir:     ${result.runDir}`);
  console.log(`Summary: ${result.summaryPath}`);
  if (result.changed && result.changed.length) {
    console.log(`Changes: ${result.changed.length} files`);
  }
}

function printHelp() {
  console.log(`
Commands:
  help        - Show this help
  status      - Show current session status
  inspect     - Inspect the project
  goal [text] - Set or show current goal
  package [p] - Set or show implementation package path
  provider [id] - Set or show LLM provider (simulated, gemini)
  plan        - Run goal mode in dry-run to generate a plan
  compile     - Run goal mode + compile-package in dry-run
  dry-run     - Set mode to DRY-RUN (default)
  apply       - Arm APPLY mode (requires confirmation)
  run         - Execute the current goal or package using current mode
  test        - Run npm test
  build       - Run npm run build
  last-run    - Show details of the most recent run
  handoff     - Create vault handoff for the last run
  compound    - Enable both context-packet and vault-handoff
  repair      - Run repair loop on last run (dry-run)
  open        - Open last run directory in file explorer
  exit        - Exit interactive mode
`);
}

function printStatus(session) {
  console.log('\n--- SESSION STATUS ---');
  console.log(`Project:  ${path.resolve(session.projectPath)}`);
  console.log(`Goal:     ${session.goal || '(none)'}`);
  console.log(`Package:  ${session.packagePath || '(none)'}`);
  console.log(`Provider: ${session.options.provider || 'simulated'}`);
  console.log(`Mode:     ${session.dryRun ? 'DRY-RUN' : 'APPLY (ARMED)'}`);
  console.log(`Options:  handoff=${session.options.vaultHandoff}, context=${session.options.contextPacket}, compile=${session.options.compilePackage}`);
  if (session.lastResult) {
    console.log(`Last Run: ${session.lastResult.runId}`);
  }
  console.log('----------------------\n');
}

export default {
  startRepl,
  createSession,
  processCommand
};
