/**
 * geminiProvider.js
 * Gemini provider adapter for agent-swarm-coder.
 * Uses built-in fetch (or injected fetchImpl) for zero dependencies.
 */

import { Provider } from '../providerRegistry.js';

export const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

export class GeminiProvider extends Provider {
  /**
   * @param {Object} options
   * @param {string} options.apiKey - Gemini/Google API key
   * @param {string} [options.model] - Gemini model string
   * @param {Function} [options.fetchImpl] - Optional fetch implementation for testing
   */
  constructor(options = {}) {
    super();
    if (!options.apiKey) throw new Error('Gemini API key is required');
    this.apiKey = options.apiKey;
    this.model = options.model || DEFAULT_GEMINI_MODEL;
    this.fetchImpl = options.fetchImpl || globalThis.fetch;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  }

  async generateImplementationPlan(goal, inspectionContext) {
    const prompt = `You are a senior software engineer coding agent. Given a goal and project inspection context, generate a structured implementation plan.
Goal: ${goal}
Context: ${JSON.stringify(inspectionContext, null, 2)}
Output the plan as JSON matching the implementation-plan.schema.json. 
Ensure the response is valid JSON.`;

    const data = await this._callGemini(prompt);
    return {
      provider: `gemini:${this.model}`,
      ...data
    };
  }

  async suggestRepair(failureContext, planContext) {
    const prompt = `Analyze this command failure and suggest a repair for a coding agent.
Failure: ${JSON.stringify(failureContext, null, 2)}
Plan: ${JSON.stringify(planContext, null, 2)}
Return JSON: { "cause": "...", "suggestedFix": { "action": "...", "detail": "..." }, "repairPrompt": "...", "canAutoApply": false }
Ensure the response is valid JSON.`;

    const data = await this._callGemini(prompt);
    return {
      provider: `gemini:${this.model}`,
      ...data
    };
  }

  async generateFilePatch(context) {
    // Constraint: conservative and suggestion-only in MVP
    return {
      provider: `gemini:${this.model}`,
      filePath: context.filePath,
      patchType: 'suggestion-only',
      rationale: 'Gemini provider is currently set to suggestion-only for file patches. Use repairPrompt for details.'
    };
  }

  async _callGemini(prompt) {
    if (typeof this.fetchImpl !== 'function') {
      throw new Error('Gemini fetch implementation is unavailable');
    }

    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    };

    let res;
    try {
      res = await this.fetchImpl(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (err) {
      // Catch network errors or fetch implementation errors without leaking the key
      throw new Error('Gemini connection error');
    }

    if (!res.ok) {
      throw new Error(`Gemini API error (${res.status})`);
    }

    let json;
    try {
      json = await res.json();
    } catch (err) {
      throw new Error('Gemini response parse error');
    }

    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No content returned from Gemini API');

    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error('Gemini returned invalid JSON');
    }
  }
}
