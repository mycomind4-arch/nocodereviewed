# Affiliate Links + Blog System Prompt
## No-Code Affiliate Site — Complete Setup

---

# PART A: AFFILIATE LINK REPLACEMENT TABLE

## How affiliate programs work for each tool

| Tool | Affiliate Program | Where to Sign Up | Commission | Cookie |
|------|------------------|-----------------|------------|--------|
| Bubble | Bubble Partner Program | bubble.io/partners | 25% recurring | 90 days |
| Webflow | Webflow Affiliate | webflow.com/affiliates | 50% first payment | 90 days |
| Glide | Glide Partners | glideapps.com/partners | 20% recurring | 30 days |
| Shopify | Shopify Affiliates | shopify.com/affiliates | $150–$500/referral | 30 days |
| Retool | Retool Referral | retool.com/pricing (contact) | Custom / negotiated | 60 days |
| FlutterFlow | FlutterFlow Affiliate | flutterflow.io/affiliate | 30% recurring | 60 days |
| Softr | Softr Affiliate | softr.io/affiliate | 20% recurring | 90 days |
| Adalo | Adalo Partners | adalo.com/partners | 20% recurring | 30 days |
| WeWeb | WeWeb Affiliate | weweb.io (contact team) | 20% recurring | 60 days |
| Memberstack | Memberstack Affiliate | memberstack.com/affiliates | 20% recurring | 90 days |

---

## Find & Replace Map for All 8 Components

Once you have your affiliate links, use this as your replacement guide.
Search for the exact string on the left, replace with your affiliate URL.

### NoCodeRecommendationWizard.jsx
```
FIND:    affiliate: "https://bubble.io"
REPLACE: affiliate: "https://bubble.io?via=YOUR-ID"

FIND:    affiliate: "https://webflow.com"
REPLACE: affiliate: "https://webflow.com?via=YOUR-ID"

FIND:    affiliate: "https://glideapps.com"
REPLACE: affiliate: "https://glideapps.com?ref=YOUR-ID"

FIND:    affiliate: "https://shopify.com"
REPLACE: affiliate: "https://shopify.pxf.io/YOUR-ID"

FIND:    affiliate: "https://retool.com"
REPLACE: affiliate: "https://retool.com?via=YOUR-ID"

FIND:    affiliate: "https://flutterflow.io"
REPLACE: affiliate: "https://flutterflow.io?ref=YOUR-ID"

FIND:    affiliate: "https://softr.io"
REPLACE: affiliate: "https://softr.io?via=YOUR-ID"

FIND:    affiliate: "https://adalo.com"
REPLACE: affiliate: "https://adalo.com?ref=YOUR-ID"
```

### PricingTracker.jsx
Same affiliate fields, same find/replace as above.

### ComparisonMatrix.jsx
No direct affiliate links — users click through to tool pages.
Add your /go/[tool] redirect links here after building the site.

### TCOCalculator.jsx
No affiliate links in data. Add a CTA at the bottom of each result:
```
"Try [Tool Name] free →" → link to /go/[tool-name]
```

### ProjectPlanner.jsx
No affiliate links in data. Same approach as TCOCalculator — add CTA to results.

### TemplateLibrary.jsx
```
FIND:    cloneUrl: "https://bubble.io"
REPLACE: cloneUrl: "https://bubble.io?via=YOUR-ID"

FIND:    cloneUrl: "https://webflow.com"
REPLACE: cloneUrl: "https://webflow.com?via=YOUR-ID"

FIND:    cloneUrl: "https://glideapps.com"
REPLACE: cloneUrl: "https://glideapps.com?ref=YOUR-ID"

FIND:    cloneUrl: "https://shopify.com"
REPLACE: cloneUrl: "https://shopify.pxf.io/YOUR-ID"

FIND:    cloneUrl: "https://retool.com"
REPLACE: cloneUrl: "https://retool.com?via=YOUR-ID"

FIND:    cloneUrl: "https://flutterflow.io"
REPLACE: cloneUrl: "https://flutterflow.io?ref=YOUR-ID"

FIND:    cloneUrl: "https://softr.io"
REPLACE: cloneUrl: "https://softr.io?via=YOUR-ID"

FIND:    cloneUrl: "https://adalo.com"
REPLACE: cloneUrl: "https://adalo.com?ref=YOUR-ID"
```

### SuccessStoryDatabase.jsx + MicrotoolDirectory.jsx
No direct affiliate links. These drive traffic to the other tools pages.
Internal links only — no replacements needed.

---

## /go/[tool] Redirect Table

Set these up in your Lovable site as redirect routes.
Replace YOUR-ID with your actual affiliate ID for each program.

| Route | Redirects to |
|-------|-------------|
| /go/bubble | https://bubble.io?via=YOUR-ID |
| /go/webflow | https://webflow.com?via=YOUR-ID |
| /go/glide | https://glideapps.com?ref=YOUR-ID |
| /go/shopify | https://shopify.pxf.io/YOUR-ID |
| /go/retool | https://retool.com?via=YOUR-ID |
| /go/flutterflow | https://flutterflow.io?ref=YOUR-ID |
| /go/softr | https://softr.io?via=YOUR-ID |
| /go/adalo | https://adalo.com?ref=YOUR-ID |
| /go/weweb | https://weweb.io?ref=YOUR-ID |
| /go/memberstack | https://memberstack.com?via=YOUR-ID |

Lovable prompt to add redirects:
```
Add a catch-all redirect route at /go/:tool that looks up the tool name
in a redirects config object and sends the user to the affiliate URL.
Log each click to Supabase: affiliate_clicks table with columns
(tool, referrer_page, timestamp). Here is the redirects map:

const REDIRECTS = {
  bubble: "https://bubble.io?via=YOUR-ID",
  webflow: "https://webflow.com?via=YOUR-ID",
  glide: "https://glideapps.com?ref=YOUR-ID",
  shopify: "https://shopify.pxf.io/YOUR-ID",
  retool: "https://retool.com?via=YOUR-ID",
  flutterflow: "https://flutterflow.io?ref=YOUR-ID",
  softr: "https://softr.io?via=YOUR-ID",
  adalo: "https://adalo.com?ref=YOUR-ID",
  weweb: "https://weweb.io?ref=YOUR-ID",
  memberstack: "https://memberstack.com?via=YOUR-ID",
};
```

---

# PART B: BLOG GENERATOR SYSTEM PROMPT

This is the exact system prompt to use in your Supabase Edge Function
for the Anthropic API call. Replace [SITE_NAME] with your brand name
once you have it.

---

## Primary System Prompt (paste into Edge Function)

```
You are the lead content writer for [SITE_NAME], a no-code tools review and comparison site. Your job is to write blog posts that genuinely help non-technical founders, solo operators, and small teams pick the right no-code tool and actually get started.

## Voice & Tone
- Direct, confident, zero fluff. Skip preamble. Get to the point in sentence one.
- Second person ("you") throughout. Talk to one specific reader, not a crowd.
- Opinionated. Don't hedge constantly. Make a call and explain it.
- Friendly but not casual. Like advice from a smart friend who's built a few things.
- Never say: "In today's digital landscape", "look no further", "game-changer", "seamlessly", "leverage", "utilize", or "dive in".
- Use contractions naturally. Write the way a person talks, not how a content farm writes.

## Post Structure (follow exactly)
1. Hook — 1–2 sentences. A sharp, specific observation that makes the reader feel seen.
2. The real problem — 2–3 sentences explaining the frustration or mistake people make.
3. What to look for — 3–5 bullet points, each 1–2 sentences. Concrete criteria, not vague advice.
4. The main comparison or tutorial — this is the bulk (600–900 words). Use H2s for each section. Be specific: pricing tiers, real limitations, what breaks at scale.
5. The verdict — 1 paragraph. Pick a winner or give a clear decision tree. Don't be wishy-washy.
6. Call to action — 2 sentences max. Point to the No-Code Tool Quiz at [SITE_NAME]/tools.

## SEO Rules
- Target keyword appears in: H1, first 100 words, one H2, meta description
- Keyword density: 1–2%. Natural placement only. No stuffing.
- Use related terms naturally (LSI keywords) — e.g. for "no-code app builder": visual programming, drag and drop, no-code platform, build without code
- Include one comparison table per post using markdown table syntax
- Include at least one numbered list or step-by-step section

## Tool References
Mention these tools by name when relevant. Always link to their comparison page at [SITE_NAME]/compare or the relevant /go/ redirect.

Tools to reference: Bubble, Webflow, Glide, Shopify, Retool, FlutterFlow, Softr, Adalo, WeWeb, Memberstack.

When mentioning a tool, include realistic pricing. Current pricing:
- Bubble: $29–$349/mo
- Webflow: $14–$212/mo  
- Glide: $0–$99/mo
- Shopify: $29–$299/mo
- Retool: $10–$50/user/mo
- FlutterFlow: $0–$70/mo
- Softr: $0–$199/mo
- Adalo: $36–$200/mo
- WeWeb: $0–$99/mo
- Memberstack: $25–$199/mo

## Length
1,200–1,800 words. Never shorter. Never longer.

## Output Format
Output ONLY valid Markdown. No preamble, no "here is your post", no commentary before or after. Start immediately with the H1.

At the very end of your response, after the markdown content, output a single JSON block on its own line in this exact format (no code fences, just raw JSON):
{"title":"...","slug":"...","excerpt":"...","category":"...","meta_description":"...","target_keyword":"...","read_time_minutes":N}

Categories must be one of: Tutorial, Comparison, Review, News, Case Study

The slug should be lowercase, hyphens only, no special characters, max 60 chars.
The excerpt should be 1–2 sentences, 120–160 characters.
The meta_description should be under 155 characters.
The read_time_minutes should be calculated as word count ÷ 200, rounded up.
```

---

## Topic Rotation List (15 pre-seeded topics)

These go into your `config` table in Supabase and rotate in order.
Add more any time by inserting rows.

| Index | Target Keyword | Suggested Category |
|-------|---------------|-------------------|
| 0 | best no-code tools for startups 2025 | Comparison |
| 1 | bubble vs webflow which is better | Comparison |
| 2 | how to build a saas without coding | Tutorial |
| 3 | webflow vs wordpress for agencies | Comparison |
| 4 | glide app review pros and cons | Review |
| 5 | shopify alternatives for small business | Comparison |
| 6 | retool vs appsmith internal tools | Comparison |
| 7 | no-code mobile app builders compared | Comparison |
| 8 | flutterflow review is it worth it | Review |
| 9 | how to build a membership site no-code | Tutorial |
| 10 | softr airtable portal tutorial | Tutorial |
| 11 | no-code tools for non-technical founders | Comparison |
| 12 | cheapest no-code platforms 2025 | Comparison |
| 13 | bubble pricing is it worth it | Review |
| 14 | best no-code tools for ecommerce | Comparison |

---

## Manual Trigger Prompt Format

When you hit "Generate Now" in /admin/blog, you can optionally specify a topic.
The Edge Function accepts:

```json
{ "keyword": "webflow cms review 2025", "category": "Review" }
```

Or leave it empty `{}` to use the next topic in rotation.

---

## Quality Control Checklist (review each draft before publishing)

Run through this before approving any auto-generated post:

- [ ] Does the H1 contain the target keyword naturally?
- [ ] Is the opening sentence specific and compelling (not generic)?
- [ ] Are all pricing figures accurate (check against table above)?
- [ ] Does it make a clear recommendation rather than hedging?
- [ ] Is the CTA pointing to [SITE_NAME]/tools?
- [ ] Are internal links using /go/[tool] format?
- [ ] Is the word count between 1,200–1,800?
- [ ] Does the slug match the target keyword (hyphens, lowercase)?
- [ ] Is the excerpt under 160 characters?

If any check fails: edit in /admin/blog before publishing, or reject and regenerate.

---

## Brand Name Shortlist (for when you're ready to decide)

A few directions to consider:

**Clear/descriptive:** StackSmart, NoCodePick, BuildWithout, ToolMatch, StackGuide
**Punchy/memorable:** Nodeless, Stackless, Zerocode, Buildbase, Launchpad
**Authority-positioning:** NoCodeInsider, ToolsReport, BuilderReview, StackSignal
**Domain-friendly (short):** Nocodi, Stackr, Buildr, Toolzy, Codeless.io

Pick something with an available .com or .io. Check at namecheap.com before committing.

