# Provider Adapters — agent-swarm-coder

## Current State (MVP)

Only the built-in `simulated` provider exists.

```js
import { getProvider, registerProvider, SimulatedProvider } from './providerRegistry.js';
const p = getProvider('simulated');
```

SimulatedProvider implements:

- generateImplementationPlan(goal, inspectionContext) → flavor text + confidence (real planning is deterministic in taskPlanner)
- suggestRepair(failureContext, planContext) → cause + suggestedFix + repairPrompt + canAutoApply:false
- generateFilePatch(...) → suggestion-only, never an executable diff that would be auto-applied

It is intentionally conservative: it will not cause writes on its own.

## Adding a Real Provider

1. Create `src/providers/myProvider.js`

```js
import { Provider } from '../providerRegistry.js';

export class MyProvider extends Provider {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey; // never hardcode; passed at registration time
  }

  async generateImplementationPlan(goal, inspectionContext) {
    // call your LLM here with a carefully engineered prompt that includes
    // the inspection + the required output shape from implementation-plan.schema.json
    // return the plan delta or full structured object
  }

  async suggestRepair(failure, context) { /* ... */ }

  async generateFilePatch(ctx) { /* return {filePath, unifiedDiff} or structured edit */ }
}
```

2. Register (in cli or a bootstrap, never auto on import if it requires secrets):

```js
import { MyProvider } from './providers/myProvider.js';
registerProvider('my-llm', new MyProvider(process.env.MY_API_KEY));
```

3. Pass provider name or instance into runAgent / repairLoop when you want to use it.

## Rules for All Adapters

- Must not be instantiated or called unless the operator explicitly selects the provider for that run.
- Must never read .env or any secret files themselves; rely on safetyGuard for project reads.
- Must return shapes compatible with the schemas/ and with the orchestrator expectations.
- Must surface a "canAutoApply" or "requiresHumanApproval" flag for repair suggestions.
- API keys are the caller's responsibility. The agent core must stay runnable with zero keys (simulated path).
- Log provider usage (name + model if known) into the decision-log for the run package.
- Future: add a provider capability manifest so the safety guard can block a provider that claims "I can deploy" unless deployment phase is approved.

## Recommended Order of Real Adapters

1. Ollama (local, no cost, good for deterministic dev)
2. Grok (xAI) — since this is xAI Grok context
3. Claude (Anthropic) — strong at code
4. OpenAI / GPT family
5. Gemini

Add one at a time. Each addition should come with:
- adapter code + tests (mocked)
- example prompt templates committed
- update to this doc + CODING_AGENT_ARCHITECTURE.md
- note in the run's decision-log when used

## Simulated Provider as Test Double

In tests and in the first real runs, always use simulated. It is the source of truth for "what the agent would do without an LLM".

## Wiring to Vault / Future Codex

A good provider response (plan or repair) can itself become a `VaultPrompt` or `VaultArtifact` when ingested. The evidence-record already points at the run; later we can promote high-quality plans/prompts into the contract.
