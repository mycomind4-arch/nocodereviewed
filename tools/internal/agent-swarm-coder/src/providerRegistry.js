/**
 * providerRegistry.js
 * Provider adapter interface. Simulated provider is default and only one active in MVP.
 * Easy extension point for OpenAI, Grok, Claude, Gemini, Ollama, etc.
 *
 * All providers MUST:
 * - Be local-first configurable (no key required for simulated)
 * - Never be called unless explicitly enabled in future phase
 * - Return deterministic shapes
 */

export class Provider {
  async generateImplementationPlan(goal, inspectionContext) {
    throw new Error('Not implemented');
  }
  async suggestRepair(failureContext, planContext) {
    throw new Error('Not implemented');
  }
  async generateFilePatch(context) {
    throw new Error('Not implemented');
  }
}

export class SimulatedProvider extends Provider {
  constructor(seed = 42) {
    super();
    this.seed = seed;
  }

  async generateImplementationPlan(goal, inspectionContext) {
    // In MVP the real plan comes from taskPlanner; this can "refine" or echo.
    return {
      provider: 'simulated',
      note: 'Plan generated deterministically by taskPlanner. Simulated provider only adds flavor text.',
      refinedObjective: goal.slice(0, 200) + (goal.length > 200 ? '...' : ''),
      confidence: 0.65
    };
  }

  async suggestRepair(failureContext, planContext) {
    const { command, stderr = '', exitCode } = failureContext;
    const lowerErr = (stderr || '').toLowerCase();
    let cause = 'Unknown failure captured by command runner.';
    let fix = { action: 'manual-review', detail: 'Read the file and error. Propose minimal change.' };

    if (lowerErr.includes('syntax') || lowerErr.includes('unexpected')) {
      cause = 'Syntax error in modified or target file.';
      fix = { action: 'patch-syntax', detail: 'Correct the token/line reported.' };
    } else if (lowerErr.includes('assert') || lowerErr.includes('expected')) {
      cause = 'Test assertion mismatch after change.';
      fix = { action: 'align-test-or-impl', detail: 'Either fix impl or update test expectation (prefer impl if behavior intended).' };
    } else if (command.includes('test') && exitCode !== 0) {
      cause = 'Test failure after edit or pre-existing.';
      fix = { action: 'investigate-test', detail: 'Reproduce locally, read failing test and code under test.' };
    }

    return {
      provider: 'simulated',
      cause,
      suggestedFix: fix,
      repairPrompt: `Fix the failure from: ${command}. Error excerpt: ${stderr.slice(0,300)}. Return only a safe minimal patch.`,
      canAutoApply: false // simulated never auto-writes without explicit approval path
    };
  }

  async generateFilePatch({ filePath, currentContent, goal, errorContext }) {
    // Very conservative: never emit large rewrites. Return suggestion only.
    return {
      provider: 'simulated',
      filePath,
      patchType: 'suggestion-only',
      diff: '--- simulated patch disabled in MVP\n+++ review the plan and apply manually or via fileOps.patch with approval',
      rationale: 'Simulated provider does not emit executable patches to avoid accidental bad writes. Use deterministic planner + human for MVP.'
    };
  }
}

const registry = new Map();

export function registerProvider(name, instance) {
  registry.set(name, instance);
}

export function getProvider(name = 'simulated') {
  if (!registry.has(name)) {
    if (name === 'simulated') {
      const sim = new SimulatedProvider();
      registry.set(name, sim);
      return sim;
    }
    throw new Error(`Unknown provider: ${name}. Register it first.`);
  }
  return registry.get(name);
}

export function listProviders() {
  return Array.from(registry.keys());
}

// Auto-register simulated
registerProvider('simulated', new SimulatedProvider());

export default {
  Provider,
  SimulatedProvider,
  registerProvider,
  getProvider,
  listProviders
};
