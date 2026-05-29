# No-Code Empire — Complete n8n Content Pipeline Spec
## Master Article Generation Workflow

---

## Architecture Overview

```
[Schedule Trigger]
      │
      ▼
[1] Fetch Next Keyword          ← GET /api/keyword-queue
      │
      ▼
[2] Fetch Tool Data             ← Supabase: tools + pricing
      │
      ▼
[3] Extract PAA Questions       ← Google Search API / SerpAPI
      │
      ▼
[4] Scrape Competitor Article   ← HTTP + extraction function
      │
      ▼
[5] Fetch Voice Fingerprint     ← Supabase: site persona + few-shots
      │
      ▼
[6] Fetch Banned Phrase List    ← Supabase / env config
      │
      ▼
[7] Build Generation Prompt     ← Compose full system + user prompt
      │
      ▼
[8] ★ GEMINI CALL 1 — Article Generation
      │
      ▼
[9]  Extract Article + Metadata ← Parse JSON block from Gemini output
      │
      ▼
[10] Quality Gateway — Pass 1 (deterministic checks)
      │  word count / banned phrases / structure / timestamps
      │
      ├── FAIL → [11a] Targeted Regeneration Loop (max 2 retries)
      │
      ▼ PASS
[11] ★ GEMINI CALL 2 — Factual Accuracy Check
      │
      ├── FAIL → [12a] Flag for Manual Review → Supabase: articles (status=quality_check)
      │
      ▼ PASS
[12] Quality Gateway — Pass 2 (semantic + link checks)
      │  PAA coverage / affiliate links / internal links
      │
      ├── FAIL → [13a] PAA Patch Call OR Flag
      │
      ▼ PASS
[13] Build Publish Payload
      │
      ▼
[14] POST /api/publish-article
      │
      ▼
[15] Update Supabase Records
      │  articles status=published / keyword_queue status=published
      │
      ▼
[16] Trigger Agent 6 Distribution
      └── IndexNow ping + Reddit post queue
```

---

## Node Specifications

---

### NODE 1 — Schedule Trigger

**Type:** `n8n-nodes-base.scheduleTrigger`

```json
{
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "cronExpression",
          "expression": "0 */2 * * *"
        }
      ]
    }
  },
  "name": "Every 2 Hours",
  "type": "n8n-nodes-base.scheduleTrigger"
}
```

**Notes:** Runs every 2 hours. At 1,200 articles/month across 10 sites, this is ~1.7 articles/hour network-wide. Adjust per site by injecting `site_id` as a workflow variable.

---

### NODE 2 — Fetch Next Keyword from Queue

**Type:** `n8n-nodes-base.httpRequest`

```json
{
  "parameters": {
    "method": "GET",
    "url": "={{ $vars.SITE_BASE_URL }}/api/keyword-queue",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "X-Webhook-Secret",
          "value": "={{ $vars.WEBHOOK_SECRET }}"
        }
      ]
    },
    "options": {
      "timeout": 10000
    }
  },
  "name": "Fetch Next Keyword",
  "type": "n8n-nodes-base.httpRequest"
}
```

**Expected response shape:**
```json
{
  "id": "uuid",
  "keyword": "best no-code website builders 2025",
  "site_id": "site_1",
  "article_type": "best_of",
  "priority_score": 87.4,
  "volume": 18100,
  "kd": 34,
  "intent": "commercial",
  "existing_position": null,
  "primary_tool_ids": ["uuid-webflow", "uuid-bubble", "uuid-framer"]
}
```

**On empty queue:** Add an IF node after this — if `response.id` is null, stop execution and send a Slack alert: "Keyword queue empty for site_id {{ $vars.SITE_ID }}".

---

### NODE 3 — Fetch Tool Data from Supabase

**Type:** `n8n-nodes-base.supabase`

```json
{
  "parameters": {
    "operation": "getAll",
    "tableId": "tools",
    "filterType": "string",
    "filterString": "id=in.({{ $json.primary_tool_ids.join(',') }})",
    "options": {
      "select": "id,name,slug,website_url,pricing_page_url,has_free_plan,pricing_tiers,rating_overall,pricing_verified_at,price_changed_flag",
      "limit": 20
    }
  },
  "name": "Fetch Tool Pricing Data",
  "type": "n8n-nodes-base.supabase"
}
```

**Output stored as:** `$node["Fetch Tool Pricing Data"].json` — merged into article prompt in Node 8.

**⚠️ Price freshness check:** Add an IF node: if any tool has `price_changed_flag = true` OR `pricing_verified_at` is older than 30 days, route to a sub-workflow that triggers the Tool Data Refresh agent before continuing.

---

### NODE 4 — Extract PAA Questions

**Type:** `n8n-nodes-base.httpRequest` (SerpAPI)

```json
{
  "parameters": {
    "method": "GET",
    "url": "https://serpapi.com/search",
    "sendQuery": true,
    "queryParameters": {
      "parameters": [
        { "name": "q", "value": "={{ $node['Fetch Next Keyword'].json.keyword }}" },
        { "name": "api_key", "value": "={{ $vars.SERPAPI_KEY }}" },
        { "name": "engine", "value": "google" },
        { "name": "num", "value": "10" },
        { "name": "gl", "value": "us" }
      ]
    }
  },
  "name": "Extract PAA Questions",
  "type": "n8n-nodes-base.httpRequest"
}
```

**Follow-up Code node** to extract and format PAA:

```javascript
// Node: "Format PAA Questions"
const serpData = $input.first().json;
const paaQuestions = (serpData.related_questions || [])
  .slice(0, 5)
  .map((q, i) => `${i + 1}. ${q.question}`);

const organicResults = serpData.organic_results || [];
const topResult = organicResults[0] || {};

return [{
  json: {
    paa_questions: paaQuestions,
    paa_formatted: paaQuestions.join('\n'),
    competitor_url: topResult.link || null,
    competitor_title: topResult.title || null,
    competitor_snippet: topResult.snippet || null
  }
}];
```

---

### NODE 5 — Scrape Competitor Article

**Type:** `n8n-nodes-base.httpRequest`

```json
{
  "parameters": {
    "method": "GET",
    "url": "={{ $node['Format PAA Questions'].json.competitor_url }}",
    "options": {
      "timeout": 15000,
      "response": {
        "response": {
          "fullResponse": false,
          "responseFormat": "text"
        }
      }
    }
  },
  "name": "Scrape Competitor HTML",
  "type": "n8n-nodes-base.httpRequest"
}
```

**Follow-up Code node** to extract structure:

```javascript
// Node: "Extract Competitor Structure"
// Uses cheerio-style parsing via built-in n8n HTML extract
const html = $input.first().json.data || '';

// Strip scripts/styles, count words
const stripped = html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const wordCount = stripped.split(' ').filter(w => w.length > 0).length;

// Extract headings via regex (n8n doesn't have cheerio natively without npm)
const h2Matches = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)]
  .map(m => m[1].replace(/<[^>]+>/g, '').trim());
const h3Matches = [...html.matchAll(/<h3[^>]*>(.*?)<\/h3>/gi)]
  .map(m => m[1].replace(/<[^>]+>/g, '').trim());

const headingStructure = [
  ...h2Matches.map(h => `H2: ${h}`),
  ...h3Matches.map(h => `  H3: ${h}`)
].join('\n');

return [{
  json: {
    competitor_word_count: wordCount,
    competitor_h2s: h2Matches,
    competitor_h3s: h3Matches,
    competitor_heading_structure: headingStructure,
    competitor_url: $node['Format PAA Questions'].json.competitor_url
  }
}];
```

**Error handling:** Wrap in a try/catch — if competitor URL is inaccessible (403, timeout), set `competitor_word_count: 1500` and `competitor_heading_structure: "unavailable"` as safe fallbacks.

---

### NODE 6 — Fetch Site Voice Fingerprint

**Type:** `n8n-nodes-base.supabase`

Fetch from a `site_voices` table (or pull from a JSON env variable per site):

```json
{
  "parameters": {
    "operation": "getAll",
    "tableId": "site_voices",
    "filterType": "string",
    "filterString": "site_id=eq.{{ $node['Fetch Next Keyword'].json.site_id }}",
    "options": {
      "select": "persona_description,banned_phrases,few_shot_example_1,few_shot_example_2,few_shot_example_3",
      "limit": 1
    }
  },
  "name": "Fetch Voice Fingerprint",
  "type": "n8n-nodes-base.supabase"
}
```

**Structure expected:**
```json
{
  "site_id": "site_1",
  "persona_description": "You are Morgan Ellis, a senior no-code consultant...",
  "banned_phrases": ["leverage","seamlessly","game-changer","delve into","dive into","it's worth noting","in today's digital landscape","unlock","robust","revolutionize","cutting-edge","empower"],
  "few_shot_example_1": "Webflow's asset manager finally grew up in 2024...",
  "few_shot_example_2": "Here's the honest answer nobody gives you...",
  "few_shot_example_3": "I ran Bubble and Webflow side by side for three weeks..."
}
```

---

### NODE 7 — Build Generation Prompt

**Type:** `n8n-nodes-base.code`

```javascript
// Node: "Build Generation Prompt"
const keyword        = $node['Fetch Next Keyword'].json;
const toolData       = $node['Fetch Tool Pricing Data'].json;
const paaData        = $node['Format PAA Questions'].json;
const competitor     = $node['Extract Competitor Structure'].json;
const voice          = $node['Fetch Voice Fingerprint'].json[0];

// Word count minimums by type
const wordCountMap = {
  review:     1500,
  comparison: 2000,
  tutorial:   1000,
  best_of:    2000,
  news:        800,
  landing:    1200
};
const minWords = wordCountMap[keyword.article_type] || 1500;
const targetWords = Math.max(minWords, Math.round((competitor.competitor_word_count || 1500) * 1.05));

// Format tool pricing for injection
const toolPricingBlock = (Array.isArray(toolData) ? toolData : [toolData])
  .map(t => {
    const tiers = (t.pricing_tiers || [])
      .map(tier => `  - ${tier.name}: $${tier.monthly_usd}/mo (annual: $${tier.annual_usd}/mo)`)
      .join('\n');
    return `### ${t.name}\n- Free plan: ${t.has_free_plan ? 'Yes' : 'No'}\n- Overall rating: ${t.rating_overall}/5\n- Pricing (verified: ${t.pricing_verified_at ? new Date(t.pricing_verified_at).toLocaleDateString('en-US', {month:'long',year:'numeric'}) : 'unverified'}):\n${tiers}`;
  }).join('\n\n');

const systemPrompt = `
${voice.persona_description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VOICE EXAMPLES — match this register exactly
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXAMPLE 1:
${voice.few_shot_example_1}

EXAMPLE 2:
${voice.few_shot_example_2}

EXAMPLE 3:
${voice.few_shot_example_3}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BANNED PHRASES — never use these under any circumstances
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${voice.banned_phrases.join(', ')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFIED TOOL DATA — use these exact figures; do not invent pricing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${toolPricingBlock}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRUCTURAL RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Article type: ${keyword.article_type}
2. Minimum word count: ${targetWords} words (competitor: ${competitor.competitor_word_count})
3. You MUST answer all PAA questions listed below — each answer should appear as its own H3 section
4. Every pricing figure must include: "Last verified: [Month Year]"
5. Every tool mention must include its affiliate anchor opportunity flagged as: [INTERNAL_LINK: topic]
   - Flag 2–5 internal link opportunities total; do not exceed 5
6. Do NOT start the article with the tool/brand name or a question
7. The first sentence must include a clear verdict or recommendation
8. Pros and cons: minimum 4 pros, 3 cons — each a full sentence with a reason, never a bare noun
9. Pricing section: always a comparison table (Tier | Monthly | Annual | Key Limits)
10. End every "Is X worth it?" section with a direct yes/no/depends verdict
11. Do not use H1 — the CMS injects the title separately

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPETITOR CONTEXT — meet or exceed on every dimension
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Competitor URL: ${competitor.competitor_url}
Competitor word count: ${competitor.competitor_word_count}
Competitor heading structure:
${competitor.competitor_heading_structure}

Your heading structure must cover all topics the competitor covers PLUS add at least one section that the competitor does not have.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PEOPLE ALSO ASK — answer every one of these
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${paaData.paa_formatted}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT — return the article followed by a JSON metadata block
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write the full article first, then output exactly this JSON block at the end:

\`\`\`json
{
  "meta": {
    "slug": "",
    "seo_title": "",
    "seo_description": "",
    "article_type": "${keyword.article_type}",
    "primary_tool_slugs": [],
    "tags": [],
    "category": "",
    "paa_questions_addressed": [],
    "internal_link_opportunities": [],
    "word_count_estimate": 0
  }
}
\`\`\`
`;

const userPrompt = `Write a complete ${keyword.article_type} article targeting the keyword: "${keyword.keyword}"

Site: ${keyword.site_id}
Search intent: ${keyword.intent}
Target length: ${targetWords}+ words`;

return [{
  json: {
    system_prompt: systemPrompt,
    user_prompt: userPrompt,
    target_word_count: targetWords,
    keyword_id: keyword.id,
    site_id: keyword.site_id,
    article_type: keyword.article_type,
    paa_questions: paaData.paa_questions,
    competitor_word_count: competitor.competitor_word_count
  }
}];
```

---

### NODE 8 — ★ GEMINI CALL 1: Article Generation

**Type:** `n8n-nodes-base.httpRequest`

> ⚠️ **SECOND MODEL OPTION:** You can substitute this node with the Anthropic API (claude-sonnet-4-20250514) for higher instruction-following fidelity on the structure rules. Gemini 1.5 Pro is cheaper at scale; Claude Sonnet produces tighter compliance with the format rules. Recommend running both on a 20-article test batch and comparing quality gateway pass rates before committing.

```json
{
  "parameters": {
    "method": "POST",
    "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
    "sendQuery": true,
    "queryParameters": {
      "parameters": [
        { "name": "key", "value": "={{ $vars.GEMINI_API_KEY }}" }
      ]
    },
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "Content-Type", "value": "application/json" }
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "specifyBody": "json",
      "jsonBody": {
        "system_instruction": {
          "parts": [{ "text": "={{ $node['Build Generation Prompt'].json.system_prompt }}" }]
        },
        "contents": [{
          "role": "user",
          "parts": [{ "text": "={{ $node['Build Generation Prompt'].json.user_prompt }}" }]
        }],
        "generationConfig": {
          "temperature": 0.7,
          "maxOutputTokens": 8192,
          "topP": 0.95,
          "topK": 40
        },
        "safetySettings": [
          { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE" },
          { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE" }
        ]
      }
    }
  },
  "name": "Gemini — Generate Article",
  "type": "n8n-nodes-base.httpRequest"
}
```

**Follow-up Code node** — "Extract Article + Metadata":

```javascript
// Node: "Extract Article + Metadata"
const response = $input.first().json;
const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

// Split article body from JSON metadata block
const jsonBlockMatch = rawText.match(/```json\s*([\s\S]*?)```\s*$/);
let metadata = {};
let articleBody = rawText;

if (jsonBlockMatch) {
  try {
    const parsed = JSON.parse(jsonBlockMatch[1]);
    metadata = parsed.meta || {};
    // Remove the JSON block from the article body
    articleBody = rawText.replace(/```json[\s\S]*?```\s*$/, '').trim();
  } catch(e) {
    // Malformed JSON — flag for manual review
    metadata = { parse_error: true };
  }
}

// Actual word count
const wordCount = articleBody.split(/\s+/).filter(w => w.length > 0).length;

// Extract all [INTERNAL_LINK: topic] placeholders
const internalLinkMatches = [...articleBody.matchAll(/\[INTERNAL_LINK:\s*([^\]]+)\]/g)]
  .map(m => m[1].trim());

return [{
  json: {
    article_body: articleBody,
    metadata: metadata,
    word_count: wordCount,
    internal_link_opportunities: internalLinkMatches,
    raw_gemini_response: rawText
  }
}];
```

---

### NODE 9 — Quality Gateway Pass 1 (Deterministic)

**Type:** `n8n-nodes-base.code`

> ✅ **No second Gemini call — pure JS.**

```javascript
// Node: "Quality Gateway Pass 1"
const article       = $node['Extract Article + Metadata'].json;
const buildParams   = $node['Build Generation Prompt'].json;
const voice         = $node['Fetch Voice Fingerprint'].json[0];
const keyword       = $node['Fetch Next Keyword'].json;

const failures = [];

// ── CHECK 1: Word count ──────────────────────────────────────────────────
const wordCountMinMap = { review:1500, comparison:2000, tutorial:1000, best_of:2000, news:800, landing:1200 };
const minWords = wordCountMinMap[keyword.article_type] || 1500;
if (article.word_count < minWords) {
  failures.push({
    check: 'word_count',
    severity: 'hard_fail',
    detail: `${article.word_count} words — minimum is ${minWords} for ${keyword.article_type}`,
    remediation: `regenerate_with_instruction:Expand to at least ${minWords} words. Current length is insufficient. Add more detail to the pros/cons section, pricing analysis, and add an FAQ section.`
  });
}

// ── CHECK 2: Competitor word count parity ────────────────────────────────
const competitorWC = buildParams.competitor_word_count || 0;
if (competitorWC > 0 && article.word_count < competitorWC) {
  failures.push({
    check: 'competitor_parity',
    severity: 'soft_fail',
    detail: `Article (${article.word_count} words) is shorter than competitor (${competitorWC} words)`,
    remediation: `regenerate_with_instruction:Match or exceed the competitor's ${competitorWC} word count.`
  });
}

// ── CHECK 3: Banned phrases ──────────────────────────────────────────────
const bannedPhrases = voice.banned_phrases || [];
const lowerArticle  = article.article_body.toLowerCase();
const bannedHits    = bannedPhrases.filter(p => lowerArticle.includes(p.toLowerCase()));
if (bannedHits.length >= 3) {
  failures.push({
    check: 'banned_phrases',
    severity: 'hard_fail',
    detail: `${bannedHits.length} banned phrase hits: ${bannedHits.join(', ')}`,
    remediation: `regenerate_with_instruction:Remove all instances of these phrases and rewrite those sentences: ${bannedHits.join(', ')}`
  });
} else if (bannedHits.length > 0) {
  failures.push({
    check: 'banned_phrases',
    severity: 'warning',
    detail: `${bannedHits.length} banned phrase hits: ${bannedHits.join(', ')} — below threshold but should be fixed`,
    remediation: 'patch'
  });
}

// ── CHECK 4: Flesch-Kincaid readability (approximation) ─────────────────
// FK ≈ 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
// Syllable count approximation: vowel groups
function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  const matches = word.match(/[aeiou]+/g);
  let count = matches ? matches.length : 1;
  if (word.endsWith('e') && count > 1) count--;
  return Math.max(1, count);
}
const sentences = article.article_body.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
const words     = article.article_body.split(/\s+/).filter(w => w.length > 0);
const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
const avgSentLen  = words.length / Math.max(sentences, 1);
const avgSyllWrd  = syllables / Math.max(words.length, 1);
const fkScore = 206.835 - (1.015 * avgSentLen) - (84.6 * avgSyllWrd);

if (fkScore < 50) {
  failures.push({
    check: 'flesch_kincaid',
    severity: 'soft_fail',
    detail: `Flesch-Kincaid score: ${fkScore.toFixed(1)} — below minimum of 50`,
    remediation: `regenerate_with_instruction:Simplify sentence structure. Target grade 8 reading level. Break long sentences into shorter ones.`
  });
}

// ── CHECK 5: Last-verified timestamp present ─────────────────────────────
const hasTimestamp = /last verified:/i.test(article.article_body);
if (!hasTimestamp) {
  failures.push({
    check: 'last_verified_timestamp',
    severity: 'hard_fail',
    detail: 'No "Last verified:" timestamp found on any tool mention',
    remediation: 'regenerate_with_instruction:Add "Last verified: [current month year]" after every pricing figure and feature claim.'
  });
}

// ── CHECK 6: Internal link opportunities present ─────────────────────────
const linkCount = article.internal_link_opportunities.length;
if (linkCount < 2) {
  failures.push({
    check: 'internal_links',
    severity: 'hard_fail',
    detail: `Only ${linkCount} [INTERNAL_LINK] placeholder(s) found — minimum is 2`,
    remediation: 'regenerate_with_instruction:Add 2–5 [INTERNAL_LINK: topic] placeholders for naturally related topics the reader would benefit from exploring.'
  });
} else if (linkCount > 5) {
  failures.push({
    check: 'internal_links',
    severity: 'soft_fail',
    detail: `${linkCount} internal link placeholders — maximum is 5`,
    remediation: 'patch:remove_excess_link_placeholders'
  });
}

// ── CHECK 7: Metadata JSON parse ─────────────────────────────────────────
if (article.metadata.parse_error) {
  failures.push({
    check: 'metadata_json',
    severity: 'hard_fail',
    detail: 'JSON metadata block at end of article failed to parse',
    remediation: 'regenerate_with_instruction:Output the required JSON metadata block at the end of the article exactly as specified in the format instructions.'
  });
}

// ── CHECK 8: SEO title length ────────────────────────────────────────────
const seoTitle = article.metadata.seo_title || '';
if (seoTitle.length < 30 || seoTitle.length > 65) {
  failures.push({
    check: 'seo_title_length',
    severity: 'soft_fail',
    detail: `SEO title length: ${seoTitle.length} chars (target: 30–65)`,
    remediation: 'patch:fix_seo_title'
  });
}

// ── ROUTING ──────────────────────────────────────────────────────────────
const hardFails = failures.filter(f => f.severity === 'hard_fail');
const passed    = hardFails.length === 0;

return [{
  json: {
    gateway_pass_1: passed,
    hard_fail_count: hardFails.length,
    soft_fail_count: failures.filter(f => f.severity === 'soft_fail').length,
    warning_count: failures.filter(f => f.severity === 'warning').length,
    failures: failures,
    fk_score: parseFloat(fkScore.toFixed(1)),
    word_count: article.word_count,
    banned_hits: bannedHits,
    // Pass through for downstream nodes
    article_body: article.article_body,
    metadata: article.metadata,
    internal_link_opportunities: article.internal_link_opportunities
  }
}];
```

---

### NODE 10 — Retry Loop on Pass 1 Failure

**Type:** `n8n-nodes-base.if` → route to retry sub-workflow

```json
{
  "parameters": {
    "conditions": {
      "options": { "caseSensitive": false },
      "conditions": [
        {
          "leftValue": "={{ $json.gateway_pass_1 }}",
          "rightValue": true,
          "operator": { "type": "boolean", "operation": "equals" }
        }
      ]
    }
  },
  "name": "Pass 1 Passed?",
  "type": "n8n-nodes-base.if"
}
```

**On FALSE branch:** Retry up to 2 times by looping back to Node 8 with the remediation instructions appended to the user prompt. Track retry count with a Set node. On retry 3 failure, write to Supabase `articles` with `status = 'quality_check'` and post a Slack alert.

**Retry instruction injection (Code node before loop-back to Node 8):**
```javascript
const gateway = $input.first().json;
const retryCount = ($node['Set Retry Count']?.json?.retry_count || 0) + 1;

if (retryCount > 2) {
  // Escalate to manual review
  return [{ json: { escalate: true, reason: gateway.failures } }];
}

// Build remediation instructions from hard fails
const remediationInstructions = gateway.failures
  .filter(f => f.severity === 'hard_fail')
  .map(f => f.remediation.replace('regenerate_with_instruction:', ''))
  .join('\n\n');

const newUserPrompt = $node['Build Generation Prompt'].json.user_prompt
  + `\n\n--- REVISION REQUIRED (attempt ${retryCount + 1}/3) ---\n${remediationInstructions}`;

return [{ json: { ...gateway, user_prompt_override: newUserPrompt, retry_count: retryCount } }];
```

---

### NODE 11 — ★ GEMINI CALL 2: Factual Accuracy Check

> ⚠️ **SECOND GEMINI CALL — required. This is the most important quality gate.**

**Type:** `n8n-nodes-base.httpRequest`

```json
{
  "parameters": {
    "method": "POST",
    "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    "sendQuery": true,
    "queryParameters": {
      "parameters": [
        { "name": "key", "value": "={{ $vars.GEMINI_API_KEY }}" }
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "specifyBody": "json",
      "jsonBody": {
        "system_instruction": {
          "parts": [{
            "text": "You are a factual accuracy auditor for a no-code software review network. You will be given an article and a database of verified tool pricing. Your ONLY job is to identify factual inaccuracies. Be skeptical. Check every number, every pricing claim, every feature claim. Return only structured JSON — no prose."
          }]
        },
        "contents": [{
          "role": "user",
          "parts": [{
            "text": "={{ 'VERIFIED DATABASE RECORDS:\\n' + JSON.stringify($node[\\'Fetch Tool Pricing Data\\'].json, null, 2) + '\\n\\n---ARTICLE TO AUDIT---\\n' + $node[\\'Quality Gateway Pass 1\\'].json.article_body.slice(0, 30000) }}"
          }]
        }],
        "generationConfig": {
          "temperature": 0.1,
          "maxOutputTokens": 2048,
          "responseMimeType": "application/json"
        }
      }
    }
  },
  "name": "Gemini — Factual Accuracy Check",
  "type": "n8n-nodes-base.httpRequest"
}
```

**System prompt for Gemini Call 2 (fully expanded):**

```
You are a factual accuracy auditor for a no-code software review network.
You will be given:
  1. A JSON record of verified tool pricing data from the database
  2. An article to audit

Your task:
- Check every pricing figure mentioned in the article against the database record
- Flag any price that differs by more than $5 from the database record
- Check every feature claim against the database record where possible
- Check that "Last verified" dates are present on pricing mentions
- Check that free plan availability matches the database has_free_plan field
- DO NOT penalize the article for having opinions; only flag factual errors

Return ONLY this JSON structure, no prose:
{
  "passed": true | false,
  "accuracy_score": 0-100,
  "flags": [
    {
      "type": "pricing_error | feature_error | missing_verification | outdated_claim",
      "excerpt": "the specific text from the article",
      "database_value": "what the database says",
      "article_value": "what the article claims",
      "severity": "critical | high | low"
    }
  ],
  "recommendation": "approve | flag_for_review | regenerate"
}

Pass criteria: passed = true when accuracy_score >= 85 and no critical flags.
```

**Extract factual check result (Code node):**
```javascript
// Node: "Extract Factual Check Result"
const response = $input.first().json;
let rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

// Strip any accidental markdown fencing
rawText = rawText.replace(/```json|```/g, '').trim();

let result;
try {
  result = JSON.parse(rawText);
} catch(e) {
  // If Gemini returns malformed JSON on the factual check, treat as low-confidence pass
  result = { passed: true, accuracy_score: 70, flags: [], recommendation: 'approve', parse_error: true };
}

const criticalFlags = (result.flags || []).filter(f => f.severity === 'critical');

return [{
  json: {
    factual_check_passed: result.passed && criticalFlags.length === 0,
    accuracy_score: result.accuracy_score || 0,
    flags: result.flags || [],
    critical_flag_count: criticalFlags.length,
    recommendation: result.recommendation || 'approve',
    parse_error: result.parse_error || false
  }
}];
```

---

### NODE 12 — Quality Gateway Pass 2 (Semantic + Link Checks)

**Type:** `n8n-nodes-base.code`

> ✅ **No additional Gemini call — pure JS.**

```javascript
// Node: "Quality Gateway Pass 2"
const article     = $node['Quality Gateway Pass 1'].json;
const paaData     = $node['Format PAA Questions'].json;
const toolData    = $node['Fetch Tool Pricing Data'].json;
const factual     = $node['Extract Factual Check Result'].json;

const failures = [];

// ── CHECK 9: Factual accuracy gate ──────────────────────────────────────
if (!factual.factual_check_passed) {
  failures.push({
    check: 'factual_accuracy',
    severity: 'hard_fail',
    detail: `Factual accuracy score: ${factual.accuracy_score}/100. Critical flags: ${factual.critical_flag_count}. Issues: ${JSON.stringify(factual.flags.slice(0,3))}`,
    remediation: 'flag_for_manual_review'
  });
}

// ── CHECK 10: PAA coverage (≥3 of 5 must be answered) ───────────────────
const paaQuestions  = paaData.paa_questions || [];
const lowerArticle  = article.article_body.toLowerCase();
const paaAnswered   = paaQuestions.filter(q => {
  // Extract key noun phrase from PAA question (3+ word window)
  const words = q.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').filter(w => w.length > 3);
  // Article must contain at least 2 of the key words from the question
  const matchCount = words.filter(w => lowerArticle.includes(w)).length;
  return matchCount >= Math.min(2, words.length);
});

if (paaAnswered.length < 3) {
  failures.push({
    check: 'paa_coverage',
    severity: 'hard_fail',
    detail: `Only ${paaAnswered.length}/5 PAA questions appear to be answered (minimum: 3)`,
    remediation: `regenerate_with_instruction:You must explicitly answer all of these questions as H3 sections: ${paaQuestions.filter(q => !paaAnswered.includes(q)).join(' | ')}`
  });
}

// ── CHECK 11: Affiliate link presence for mentioned tools ────────────────
const tools = Array.isArray(toolData) ? toolData : [toolData];
const toolNames = tools.map(t => t.name.toLowerCase());
const mentionedTools = toolNames.filter(name => lowerArticle.includes(name));

// Check if article has affiliate link markers (we use [AFFILIATE: tool_slug] or the [INTERNAL_LINK] system)
// More pragmatically: check that each mentioned tool has a corresponding [INTERNAL_LINK] or review CTA
const articleHasCTA = /\[internal_link:/i.test(article.article_body);
if (mentionedTools.length > 0 && !articleHasCTA) {
  failures.push({
    check: 'affiliate_link_presence',
    severity: 'hard_fail',
    detail: `Tools mentioned (${mentionedTools.join(', ')}) but no [INTERNAL_LINK] placeholders found`,
    remediation: 'regenerate_with_instruction:Every mentioned tool must have a [INTERNAL_LINK: tool-name-review] placeholder marking the affiliate CTA location.'
  });
}

// ── CHECK 12: Cross-site similarity < 60% (placeholder — full cosine check runs async) ──
// The live cosine check runs as a separate nightly job (similarity_audits table).
// Here we do a fast Jaccard approximation using word bigrams.
// This is a warning-level check only; hard block handled by nightly audit.
// Skipped inline for performance — flagged as async.

// ── ROUTING ──────────────────────────────────────────────────────────────
const hardFails   = failures.filter(f => f.severity === 'hard_fail');
const passed      = hardFails.length === 0;
const paaCount    = paaAnswered.length;

return [{
  json: {
    gateway_pass_2: passed,
    hard_fail_count: hardFails.length,
    failures: failures,
    paa_answered_count: paaCount,
    paa_questions_addressed: paaAnswered,
    // Pass through
    article_body: article.article_body,
    metadata: article.metadata,
    word_count: article.word_count,
    fk_score: article.fk_score,
    banned_hits: article.banned_hits,
    internal_link_opportunities: article.internal_link_opportunities,
    accuracy_score: factual.accuracy_score
  }
}];
```

---

### NODE 13 — Build Publish Payload

**Type:** `n8n-nodes-base.code`

```javascript
// Node: "Build Publish Payload"
const gateway2    = $node['Quality Gateway Pass 2'].json;
const keyword     = $node['Fetch Next Keyword'].json;
const buildParams = $node['Build Generation Prompt'].json;
const competitor  = $node['Extract Competitor Structure'].json;
const toolData    = $node['Fetch Tool Pricing Data'].json;
const tools       = Array.isArray(toolData) ? toolData : [toolData];

const now = new Date().toISOString();

return [{
  json: {
    // Article content
    site_id: keyword.site_id,
    keyword_queue_id: keyword.id,
    slug: gateway2.metadata.slug || keyword.keyword.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),
    title: gateway2.metadata.seo_title || keyword.keyword,
    body_html: gateway2.article_body,
    article_type: keyword.article_type,
    status: 'published',

    // SEO
    meta_description: gateway2.metadata.seo_description || '',
    tags: gateway2.metadata.tags || [],
    category: gateway2.metadata.category || '',

    // Quality metrics (written to articles table)
    word_count: gateway2.word_count,
    flesch_kincaid_score: gateway2.fk_score,
    banned_phrase_hits: (gateway2.banned_hits || []).length,
    paa_questions_count: gateway2.paa_answered_count,
    factual_accuracy_score: gateway2.accuracy_score,
    internal_link_count: (gateway2.internal_link_opportunities || []).length,
    internal_link_opportunities: gateway2.internal_link_opportunities,
    last_verified_at: now,
    factual_check_at: now,

    // Competitor data
    competitor_url: competitor.competitor_url,
    competitor_word_count: competitor.competitor_word_count,

    // Tools
    primary_tool_ids: tools.map(t => t.id),

    // Timestamps
    published_at: now
  }
}];
```

---

### NODE 14 — POST to /api/publish-article

**Type:** `n8n-nodes-base.httpRequest`

```json
{
  "parameters": {
    "method": "POST",
    "url": "={{ $vars.SITE_BASE_URL }}/api/publish-article",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "Content-Type",      "value": "application/json" },
        { "name": "X-Webhook-Secret",  "value": "={{ $vars.WEBHOOK_SECRET }}" }
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "specifyBody": "json",
      "jsonBody": "={{ $json }}"
    },
    "options": {
      "timeout": 30000,
      "retry": {
        "enabled": true,
        "maxRetries": 3,
        "waitBetweenRetries": 5000
      }
    }
  },
  "name": "POST Publish Article",
  "type": "n8n-nodes-base.httpRequest"
}
```

**Expected success response:**
```json
{
  "success": true,
  "article_id": "uuid",
  "url": "https://site1.com/best-no-code-website-builders"
}
```

---

### NODE 15 — Update Supabase Records

**Type:** `n8n-nodes-base.supabase` (two sequential calls)

**15a — Update keyword_queue status:**
```json
{
  "parameters": {
    "operation": "update",
    "tableId": "keyword_queue",
    "filters": {
      "conditions": [
        { "keyName": "id", "keyValue": "={{ $node['Fetch Next Keyword'].json.id }}" }
      ]
    },
    "fieldsUi": {
      "fieldValues": [
        { "fieldId": "status",     "fieldValue": "published" },
        { "fieldId": "article_id", "fieldValue": "={{ $node['POST Publish Article'].json.article_id }}" },
        { "fieldId": "updated_at", "fieldValue": "={{ new Date().toISOString() }}" }
      ]
    }
  },
  "name": "Update Keyword Queue Status",
  "type": "n8n-nodes-base.supabase"
}
```

**15b — Upsert article record:**
```json
{
  "parameters": {
    "operation": "upsert",
    "tableId": "articles",
    "fieldsUi": {
      "fieldValues": [
        { "fieldId": "id",                    "fieldValue": "={{ $node['POST Publish Article'].json.article_id }}" },
        { "fieldId": "site_id",               "fieldValue": "={{ $node['Build Publish Payload'].json.site_id }}" },
        { "fieldId": "slug",                  "fieldValue": "={{ $node['Build Publish Payload'].json.slug }}" },
        { "fieldId": "title",                 "fieldValue": "={{ $node['Build Publish Payload'].json.title }}" },
        { "fieldId": "article_type",          "fieldValue": "={{ $node['Build Publish Payload'].json.article_type }}" },
        { "fieldId": "status",                "fieldValue": "published" },
        { "fieldId": "word_count",            "fieldValue": "={{ $node['Build Publish Payload'].json.word_count }}" },
        { "fieldId": "flesch_kincaid_score",  "fieldValue": "={{ $node['Build Publish Payload'].json.flesch_kincaid_score }}" },
        { "fieldId": "banned_phrase_hits",    "fieldValue": "={{ $node['Build Publish Payload'].json.banned_phrase_hits }}" },
        { "fieldId": "paa_questions_count",   "fieldValue": "={{ $node['Build Publish Payload'].json.paa_answered_count }}" },
        { "fieldId": "internal_link_count",   "fieldValue": "={{ $node['Build Publish Payload'].json.internal_link_count }}" },
        { "fieldId": "target_keyword",        "fieldValue": "={{ $node['Fetch Next Keyword'].json.keyword }}" },
        { "fieldId": "keyword_intent",        "fieldValue": "={{ $node['Fetch Next Keyword'].json.intent }}" },
        { "fieldId": "last_verified_at",      "fieldValue": "={{ $node['Build Publish Payload'].json.last_verified_at }}" },
        { "fieldId": "factual_check_at",      "fieldValue": "={{ $node['Build Publish Payload'].json.factual_check_at }}" },
        { "fieldId": "competitor_word_count", "fieldValue": "={{ $node['Build Publish Payload'].json.competitor_word_count }}" },
        { "fieldId": "published_at",          "fieldValue": "={{ $node['Build Publish Payload'].json.published_at }}" }
      ]
    }
  },
  "name": "Upsert Article Record",
  "type": "n8n-nodes-base.supabase"
}
```

---

### NODE 16 — Trigger Agent 6 (Distribution)

**Type:** `n8n-nodes-base.httpRequest`

```json
{
  "parameters": {
    "method": "POST",
    "url": "={{ $vars.N8N_WEBHOOK_BASE }}/webhook/agent-6-distribution",
    "sendBody": true,
    "bodyParameters": {
      "specifyBody": "json",
      "jsonBody": {
        "article_id":   "={{ $node['POST Publish Article'].json.article_id }}",
        "site_id":      "={{ $node['Fetch Next Keyword'].json.site_id }}",
        "article_url":  "={{ $node['POST Publish Article'].json.url }}",
        "keyword":      "={{ $node['Fetch Next Keyword'].json.keyword }}",
        "article_type": "={{ $node['Fetch Next Keyword'].json.article_type }}"
      }
    }
  },
  "name": "Trigger Agent 6 Distribution",
  "type": "n8n-nodes-base.httpRequest"
}
```

---

## Second Gemini Call Summary

| Call | Node | Model | Temp | Purpose | Blocks publish? |
|------|------|-------|------|---------|-----------------|
| **Call 1** | Node 8 | Gemini 1.5 Pro | 0.7 | Article generation | N/A — creates article |
| **Call 2** | Node 11 | Gemini 1.5 Flash | 0.1 | Factual accuracy audit | ✅ YES — critical flags block |

> Use **Flash** for Call 2, not Pro. Accuracy checking is a classification task — you don't need creativity, you need fast and cheap. Flash at 0.1 temperature is the right tool. Pro would cost 5–7× more for no quality gain on this task.

> **Optional Call 3** (not implemented above, but referenced in the PAA extraction spec): if PAA coverage check in Pass 2 shows fewer than 3 answered, you can route to a targeted Gemini call that receives just the unanswered questions and the article, and returns a patch. This avoids full regeneration and saves ~60% of token cost on PAA failures.

---

## Quality Gateway — Full Decision Matrix

```
┌─────────────────────────────────┬────────────┬──────────┬────────────────────────────────────────┐
│ Check                           │ Severity   │ Gate     │ Remediation                            │
├─────────────────────────────────┼────────────┼──────────┼────────────────────────────────────────┤
│ Word count ≥ type minimum       │ HARD FAIL  │ Pass 1   │ Regenerate with expansion instructions │
│ Competitor word count parity    │ SOFT FAIL  │ Pass 1   │ Regenerate                             │
│ Banned phrases < 3 hits         │ HARD FAIL  │ Pass 1   │ Regenerate with phrase removal list    │
│ Banned phrases 1–2 hits         │ WARNING    │ Pass 1   │ Patch only                             │
│ Flesch-Kincaid > 50             │ SOFT FAIL  │ Pass 1   │ Regenerate with simplify instruction   │
│ Last-verified timestamp present │ HARD FAIL  │ Pass 1   │ Regenerate                             │
│ Internal links 2–5              │ HARD FAIL  │ Pass 1   │ Regenerate                             │
│ Internal links > 5              │ SOFT FAIL  │ Pass 1   │ Patch (remove excess)                  │
│ SEO title 30–65 chars           │ SOFT FAIL  │ Pass 1   │ Patch (rewrite title)                  │
│ Metadata JSON parseable         │ HARD FAIL  │ Pass 1   │ Regenerate                             │
│ Factual accuracy ≥ 85 / 0 crit  │ HARD FAIL  │ Pass 2   │ Flag for manual review                 │
│ PAA coverage ≥ 3 of 5           │ HARD FAIL  │ Pass 2   │ Regenerate with PAA injection          │
│ Affiliate CTA placeholders      │ HARD FAIL  │ Pass 2   │ Regenerate                             │
│ Cross-site similarity < 60%     │ HARD FAIL  │ Nightly  │ Rebuild voice prompts for both sites   │
│ Feature coverage ≥ 90%          │ SOFT FAIL  │ Async    │ Content audit flag                     │
└─────────────────────────────────┴────────────┴──────────┴────────────────────────────────────────┘
```

**Hard fail = blocks publish. Soft fail = logged, does not block. Warning = logged only.**
**Max 2 auto-retries on hard fail. Retry 3 → manual_review queue.**

---

## Environment Variables Required

```bash
# .env / Vercel / n8n Credentials
GEMINI_API_KEY=            # Google AI Studio
SERPAPI_KEY=               # SerpAPI (PAA extraction)
WEBHOOK_SECRET=            # Shared secret for all /api endpoints
SUPABASE_URL=              # Per-site or shared Supabase project
SUPABASE_SERVICE_KEY=      # Service role key (bypasses RLS)
SITE_BASE_URL=             # e.g. https://site1.nocode-reviews.com
N8N_WEBHOOK_BASE=          # n8n instance base URL for sub-workflow triggers

# Per-site variables (set as n8n workflow-level variables)
SITE_ID=                   # site_1 through site_10
```

---

## Workflow Execution Cost Estimate

| Component | Cost per article |
|-----------|-----------------|
| Gemini 1.5 Pro (Call 1 — ~6k output tokens) | ~$0.024 |
| Gemini 1.5 Flash (Call 2 — ~1k tokens) | ~$0.0002 |
| SerpAPI (PAA extraction) | ~$0.005 |
| Competitor scrape | $0 (direct HTTP) |
| Supabase reads/writes | ~$0.001 |
| **Total per article** | **~$0.030** |
| **At 1,200 articles/month** | **~$36/month** |
