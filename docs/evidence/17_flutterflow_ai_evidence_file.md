# 17 — FlutterFlow AI Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — official AI, pricing, docs, and builder sources found; mobile/web build and security testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | FlutterFlow AI |
| Vendor / maintainer | FlutterFlow |
| Product category | Visual app builder with AI-assisted page/component/code generation and AI-agent integration features |
| Primary user | App builders, startups, product teams, agencies, and developers building cross-platform Flutter apps visually |
| Core posture | Visual development environment for mobile, web, and desktop apps with AI-assisted generation and extensibility |
| Current evidence confidence | High for official builder/pricing/AI feature pages; medium for AI-agent details; low for generated-app quality and security because no NoCodeReviewed hands-on testing has been recorded |

## 2) Official Positioning

FlutterFlow’s homepage says:

> “Build Better. Launch Faster.”

and describes FlutterFlow as helping users build high-quality, customized apps quickly.

Source URL: https://www.flutterflow.io/  
Source type: Official homepage  
Accessed: May 30, 2026

FlutterFlow’s AI page says:

> “Build Apps With AI By Your Side.”

Source URL: https://www.flutterflow.io/ai  
Source type: Official AI page  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| FlutterFlow is a visual development environment for building mobile, web, and desktop apps | Official docs | https://docs.flutterflow.io/ | May 30, 2026 | Safe if attributed |
| FlutterFlow supports building UI and logic visually | Official homepage | https://www.flutterflow.io/ | May 30, 2026 | Safe if attributed |
| FlutterFlow AI can generate and update components and pages | Official AI page | https://www.flutterflow.io/ai | May 30, 2026 | Safe if attributed; output must be tested |
| FlutterFlow docs describe AI-generated pages from a prompt | Official docs | https://docs.flutterflow.io/resources/ui/pages | May 30, 2026 | Safe if attributed |
| FlutterFlow docs describe AI-generated components and AI Generation History | Official docs | https://docs.flutterflow.io/resources/ui/components/creating-components | May 30, 2026 | Safe if attributed |
| FlutterFlow Code Copilot generates code snippets/functions/blocks from natural language descriptions | Official docs | https://docs.flutterflow.io/concepts/custom-code | May 30, 2026 | Safe if attributed; generated code must be reviewed |
| FlutterFlow AI Agents can integrate LLM interactions using providers such as Google, OpenAI, or Anthropic | Official docs | https://docs.flutterflow.io/integrations/ai-agents | May 30, 2026 | Safe if attributed |
| FlutterFlow CLI lets users create/edit FlutterFlow apps from terminal using external AI coding agents such as Claude Code, Gemini CLI, Codex, or MCP-compatible clients | Official docs | https://docs.flutterflow.io/flutterflow-cli/build | May 30, 2026 | Safe if attributed |
| FlutterFlow pricing includes Free, Basic, Growth, Business, and Enterprise tiers | Official docs/pricing | https://docs.flutterflow.io/accounts-billing/plan-comparison and https://www.flutterflow.io/pricing | May 30, 2026 | Safe after final pricing-page recheck |

## 4) Pricing Notes

| Tier / pricing item | Price or limit observed | Source | Status |
|---|---:|---|---|
| Free | $0/month; up to 2 projects shown in plan comparison; build/test focus | https://docs.flutterflow.io/accounts-billing/plan-comparison | Official, needs final recheck |
| Basic | $39/month monthly price shown; pricing page also showed annual discount equivalent | https://docs.flutterflow.io/accounts-billing/plan-comparison and https://www.flutterflow.io/pricing | Official, needs final recheck |
| Growth | 1st seat $80/month, 2nd seat $55/month shown in plan comparison | https://docs.flutterflow.io/accounts-billing/plan-comparison | Official, needs final recheck |
| Business | 1st seat $150/month, seats 2–5 $85 each shown in plan comparison | https://docs.flutterflow.io/accounts-billing/plan-comparison | Official, needs final recheck |
| Enterprise | Custom pricing | https://docs.flutterflow.io/accounts-billing/plan-comparison | Sales verification required |
| AI Generation | Listed as a plan-comparison feature | https://docs.flutterflow.io/accounts-billing/plan-comparison | Plan-specific limits need capture |
| Code export / APK / app-store deployment | Paid-plan capabilities referenced on pricing page | https://www.flutterflow.io/pricing | Exact tier requirements need final capture |

Pricing status: `official pricing sources found — recheck immediately before publication`.

Pricing caution: FlutterFlow cost can include FlutterFlow plan fees plus external backend, Firebase/Supabase, API, LLM provider, app-store, and deployment costs. Do not publish total-cost claims without a benchmark app.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| App platform scope | FlutterFlow builds mobile/web/desktop apps with integrations | https://docs.flutterflow.io/ | Generated apps still require security testing |
| AI-generated pages/components | FlutterFlow docs describe AI generation of UI pages/components | https://docs.flutterflow.io/resources/ui/pages and https://docs.flutterflow.io/resources/ui/components/creating-components | UI generation is not equivalent to secure backend behavior |
| Code Copilot | Generates code snippets/functions/blocks from natural language | https://docs.flutterflow.io/concepts/custom-code | Generated custom code must be reviewed |
| AI Agents | Supports LLM providers and system instructions/preloaded messages | https://docs.flutterflow.io/integrations/ai-agents | Prompt injection, data leakage, and provider costs require testing |
| GenUI limitation | Docs say only supported backend today is Firebase AI Logic for GenUI | https://docs.flutterflow.io/concepts/genui-chat | Important limitation if reviewing conversational UI |
| AI-agent CLI | External agents can create/edit FlutterFlow apps via CLI | https://docs.flutterflow.io/flutterflow-cli/build | Tool-chain permissions and local workspace safety must be tested |
| Backend responsibility | FlutterFlow commonly integrates with Firebase, Supabase, APIs, and custom code | Product/docs sources | App security depends on backend rules and integration choices |

Production-readiness summary: FlutterFlow has strong visual-builder and export/deployment positioning, but AI-generated UI/code/agents do not remove the need to test auth, backend permissions, API key handling, app-store deployment, generated code quality, and external LLM costs.

## 6) Autonomy Notes

FlutterFlow AI is best classified as **AI-assisted visual app development**, not a fully autonomous software engineer. Official sources support AI generation of pages/components, Code Copilot for natural-language code generation, AI Agents inside apps, and CLI workflows with external agents. Full production autonomy is not verified.

| Autonomy question | Current evidence answer |
|---|---|
| Can FlutterFlow generate UI pages from prompts? | Official docs support this |
| Can FlutterFlow generate components from prompts? | Official docs support this |
| Can it generate code from natural language? | Code Copilot docs support this |
| Can it integrate AI agents into apps? | Official AI Agents docs support this |
| Can external coding agents edit FlutterFlow projects through CLI? | Official CLI docs support this |
| Can it autonomously build secure production apps? | Not verified |

## 7) Strengths From Official or Verified Sources Only

- Official docs cover multiple AI surfaces: page generation, component generation, Code Copilot, AI Agents, and AI-agent CLI workflows.
- FlutterFlow has cross-platform positioning for mobile, web, and desktop apps.
- FlutterFlow provides code export/deployment-oriented pricing paths, making it relevant to teams that want visual development plus source-code access.
- FlutterFlow AI Agents docs identify model-provider options, including Google, OpenAI, and Anthropic.
- GenUI docs disclose concrete limitations, which improves review transparency.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| AI generation quality not verified | No hands-on test record | Needs prompt-to-page/component benchmark |
| App security depends on backend/integration rules | Product architecture reasoning | Test Firebase/Supabase/API permissions |
| AI Agents introduce LLM app risks | Official AI Agents docs | Test prompt injection, provider cost, data exposure |
| GenUI backend limitation | Official GenUI docs | Only supported backend listed as Firebase AI Logic during source pass |
| Total cost can include external services | Pricing/product structure | Need benchmark app and provider-cost log |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Bubble AI | No-code web/mobile builder with AI app generation |
| Adalo | No-code mobile/web app builder |
| Glide AI | Data-driven no-code app builder with AI features |
| WeWeb AI | Visual web-app builder with AI and code export/production posture |
| Dreamflow | AI/Flutter-oriented app builder adjacent to FlutterFlow |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. FlutterFlow is a visual development environment for building mobile, web, and desktop apps.
2. FlutterFlow’s AI page says users can generate and update components and pages with AI.
3. FlutterFlow docs describe AI-generated pages and components from prompts.
4. FlutterFlow Code Copilot is described as an AI-assisted feature that generates code snippets, functions, or blocks from natural-language descriptions.
5. FlutterFlow AI Agents docs describe configuring LLM-powered interactions using providers such as Google, OpenAI, or Anthropic.
6. FlutterFlow pricing includes Free, Basic, Growth, Business, and Enterprise plan framing according to official pricing/plan docs.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “FlutterFlow AI builds complete apps from prompts” | Official evidence is stronger for pages/components/code/agents than full app autonomy | End-to-end benchmark |
| “Generated FlutterFlow apps are production-ready” | Requires auth, data, backend, deployment, app-store, and code review tests | Hands-on app test |
| “Code export is clean enough for developers” | Needs source-code review | Export and inspect generated Flutter code |
| “AI Agents are safe for user-facing apps” | LLM features introduce prompt-injection and data-exposure risk | Prompt injection and logging tests |
| “FlutterFlow is cheaper than Bubble” | Total cost depends on plan, backend, provider APIs, and deployment | Standard cost benchmark |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | AI page generation | Generate onboarding/dashboard page from prompt | Page is usable, responsive, and editable |
| 2 | AI component generation | Generate reusable card/form component | Component can be added and reused without broken styling |
| 3 | Code Copilot | Generate simple custom function | Code compiles and handles edge cases |
| 4 | Backend integration | Connect Firebase or Supabase test backend | Auth/data reads/writes work as intended |
| 5 | Permission test | Create two users and private records | User A cannot access User B data |
| 6 | AI Agent integration | Configure test AI agent using provider key | Agent works without exposing key/client secret |
| 7 | Prompt-injection test | Give malicious user input to AI Agent | Agent does not reveal hidden instructions or sensitive context |
| 8 | Code export | Export source code on eligible plan | Project builds locally and code is reviewable |
| 9 | Deployment | Publish to web or app-store test path where available | App launches and core flow works |
| 10 | Cost tracking | Record FlutterFlow plan plus backend/API/LLM costs | Cost-per-build table completed |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | FlutterFlow homepage, FlutterFlow AI page, FlutterFlow docs, plan comparison, pricing page, Code Copilot docs, AI Agents docs, GenUI docs, CLI docs |
| Reputable third-party | None used in this file |
| Anecdotal/user-reported | None used in this file |
| Needs testing | End-to-end app generation, generated code quality, backend security, AI Agent safety, export/deployment behavior, total cost |

