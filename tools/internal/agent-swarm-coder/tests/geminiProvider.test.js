import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GeminiProvider } from '../src/providers/geminiProvider.js';

describe('GeminiProvider', () => {
  const fakeApiKey = 'fake-key-123';

  it('initializes with apiKey and default model', () => {
    const provider = new GeminiProvider({ apiKey: fakeApiKey });
    assert.strictEqual(provider.apiKey, fakeApiKey);
    assert.ok(provider.model);
  });

  it('throws if apiKey is missing', () => {
    assert.throws(() => new GeminiProvider({}), /Gemini API key is required/);
  });

  it('generates implementation plan using mocked fetch', async () => {
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{
            text: JSON.stringify({ objective: 'Test Objective', confidence: 0.9 })
          }]
        }
      }]
    };

    const mockFetch = async (url, opts) => {
      assert.ok(url.includes('generateContent'));
      assert.ok(url.includes(`key=${fakeApiKey}`));
      return {
        ok: true,
        json: async () => mockResponse
      };
    };

    const provider = new GeminiProvider({ apiKey: fakeApiKey, fetchImpl: mockFetch });
    const plan = await provider.generateImplementationPlan('Test goal', { files: [] });

    assert.strictEqual(plan.objective, 'Test Objective');
    assert.strictEqual(plan.confidence, 0.9);
    assert.ok(plan.provider.startsWith('gemini:'));
  });

  it('handles API errors without leaking key', async () => {
    const mockFetch = async () => {
      return {
        ok: false,
        status: 403
      };
    };

    const provider = new GeminiProvider({ apiKey: fakeApiKey, fetchImpl: mockFetch });
    await assert.rejects(
      () => provider.generateImplementationPlan('goal', {}),
      (err) => {
        assert.ok(err.message.includes('Gemini API error (403)'));
        assert.ok(!err.message.includes(fakeApiKey));
        return true;
      }
    );
  });

  it('handles invalid JSON from model', async () => {
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{
            text: 'not a json'
          }]
        }
      }]
    };

    const mockFetch = async () => ({
      ok: true,
      json: async () => mockResponse
    });

    const provider = new GeminiProvider({ apiKey: fakeApiKey, fetchImpl: mockFetch });
    await assert.rejects(
      () => provider.generateImplementationPlan('goal', {}),
      /Gemini returned invalid JSON/
    );
  });

  it('generateFilePatch remains suggestion-only', async () => {
    const provider = new GeminiProvider({ apiKey: fakeApiKey });
    const patch = await provider.generateFilePatch({ filePath: 'foo.js' });
    assert.strictEqual(patch.patchType, 'suggestion-only');
    assert.ok(patch.rationale);
  });
});
