# 14 — OpenAI Codex Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — official product, pricing, and security pages found; hands-on testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | OpenAI Codex |
| Vendor / maintainer | OpenAI |
| Product category | AI coding agent / AI coding partner |
| Primary user | Developers, engineering teams, security teams, and organizations using ChatGPT/OpenAI development workflows |
| Core posture | Coding agent for planning, building features, refactors, reviews, and releases |
| Current evidence confidence | High for official positioning and safety-document existence; medium for current pricing/access because plan rules can change quickly; low for output quality because no NoCodeReviewed hands-on benchmark exists yet |

## 2) Official Positioning

OpenAI’s Codex page describes Codex as:

> “A coding agent that helps you build and ship with AI—powered by ChatGPT.”

Source URL: https://openai.com/codex/  
Source type: Official product page  
Accessed: May 30, 2026

OpenAI’s developer page describes Codex as OpenAI’s coding agent for software development.

Source URL: https://developers.openai.com/codex  
Source type: Official developer page  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| Codex is a coding agent that helps users build and ship with AI | Official product page | https://openai.com/codex/ | May 30, 2026 | Safe if attributed |
| Codex is OpenAI’s coding agent for software development | Official developer page | https://developers.openai.com/codex | May 30, 2026 | Safe if attributed |
| Codex is included in ChatGPT Plus, Pro, Business, Edu, and Enterprise plans | Official developer page | https://developers.openai.com/codex | May 30, 2026 | Safe after final access recheck |
| Codex can help write code and answer codebase questions | Official developer page | https://developers.openai.com/codex | May 30, 2026 | Safe if attributed |
| Codex Security helps find, validate, and remediate likely vulnerabilities in connected GitHub repositories | Official security page | https://developers.openai.com/codex/security | May 30, 2026 | Safe if attributed |
| OpenAI describes sandboxing, approvals, network policies, and agent-native telemetry for Codex | Official OpenAI article | https://openai.com/index/running-codex-safely/ | May 30, 2026 | Safe if attributed |
| Dedicated Codex pricing page exists | Official pricing page | https://developers.openai.com/codex/pricing | May 30, 2026 | Must recheck before publication |

## 4) Pricing Notes

| Pricing topic | Evidence note | Source | Status |
|---|---|---|---|
| Included plans | Official developer page says ChatGPT Plus, Pro, Business, Edu, and Enterprise plans include Codex | https://developers.openai.com/codex | Official, needs final access check |
| Dedicated Codex pricing | Official pricing page exists and may include current tier/credit details | https://developers.openai.com/codex/pricing | Official, volatile |
| Promotional/temporary usage notes | Pricing pages may include date-bound usage windows or previews | https://developers.openai.com/codex/pricing | Must be captured with exact date |

Pricing status: `official pricing sources found — verify immediately before publication because plan access, model availability, and promotional credit windows can change quickly`.

Pricing caution: Do not publish “Codex costs $X” without distinguishing ChatGPT subscription access, Codex-specific usage/pricing, model selection, and any temporary promotions.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Sandboxing | OpenAI has published Codex safety material discussing sandboxing | https://openai.com/index/running-codex-safely/ | Safe as OpenAI safety-design claim, not as proof of generated-code safety |
| Approvals | OpenAI safety material discusses approvals | https://openai.com/index/running-codex-safely/ | Test approval gates directly |
| Network policies | OpenAI safety material discusses network policies | https://openai.com/index/running-codex-safely/ | Test exact repo/project behavior |
| Telemetry | OpenAI safety material discusses agent-native telemetry | https://openai.com/index/running-codex-safely/ | Enterprise/privacy review needed |
| Codex Security | Official page says it helps find, validate, and remediate likely vulnerabilities in connected GitHub repositories | https://developers.openai.com/codex/security | Needs vulnerability-seeded testing |
| Generated code | No hands-on evidence yet | Needs testing | Do not claim secure or production-ready code |

Production-readiness summary: Codex has stronger official safety-documentation evidence than many AI coding tools, but publication must distinguish safety architecture from actual generated-code quality. NoCodeReviewed should test repo permissions, sandbox behavior, PR quality, vulnerability detection, and cost under realistic workloads.

## 6) Autonomy Notes

Codex is appropriately categorized as a coding agent. It can be evaluated for planning, implementation, refactoring, review, and security tasks. However, current evidence does not justify a claim that Codex can safely replace engineering review, security review, CI, or human approval for production releases.

| Autonomy question | Current evidence answer |
|---|---|
| Is Codex officially described as a coding agent? | Yes |
| Is it positioned for real engineering work? | Yes, according to official product page |
| Does OpenAI publish safety controls around Codex? | Yes |
| Is generated output quality independently verified by NoCodeReviewed? | No |
| Can Codex safely merge/deploy production code unsupervised? | Not verified |

## 7) Strengths From Official or Verified Sources Only

- OpenAI provides official product, developer, pricing, and safety/security pages for Codex.
- Codex has explicit official positioning as a coding agent rather than only a chat assistant.
- OpenAI has published safety architecture notes for Codex, including sandboxing and approval concepts.
- Codex Security has a distinct official page focused on vulnerability discovery/remediation workflows.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| Plan/pricing details are volatile | Dedicated pricing page and current product pace | Requires final recheck |
| Generated-code quality not verified | No hands-on test record | Needs benchmark suite |
| Security-remediation quality not verified | Official Codex Security claim only | Needs seeded vulnerability tests |
| Production deployment safety not proven | Reasoned limitation from evidence | Requires sandbox/permissions/CI tests |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Claude Code | Agentic coding CLI with explicit permission model |
| Cursor | Agentic IDE/editor and code-review workflows |
| Windsurf | Agentic editor with local/cloud-agent claims |
| Replit Agent | Browser-native app-building/deploying agent |
| GitHub Copilot coding agent | GitHub-native coding-agent alternative |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. OpenAI Codex is an AI coding agent from OpenAI.
2. OpenAI describes Codex as helping users build and ship with AI.
3. OpenAI’s developer page says Codex is included in ChatGPT Plus, Pro, Business, Edu, and Enterprise plans.
4. OpenAI has published Codex safety material discussing sandboxing, approvals, network policies, and telemetry.
5. Codex Security is positioned by OpenAI as helping engineering and security teams find, validate, and remediate likely vulnerabilities in connected GitHub repositories.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Codex produces production-ready code” | Requires quality, test, and security validation | Feature and bug benchmark with CI |
| “Codex Security reliably finds vulnerabilities” | Official claim needs independent evaluation | Seeded vulnerability repo benchmark |
| “Codex is cheaper than Claude Code/Cursor” | Pricing depends on plan, model, usage, and any temporary windows | Standardized workload cost tracking |
| “Codex can safely operate autonomously” | Safety architecture is not proof of safe outcomes | Permission, sandbox, network, and rollback tests |
| “Codex is best for teams” | Needs comparative evidence | Team workflow test vs Claude Code, Cursor, Windsurf |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Access and plan check | Confirm Codex availability on test subscription/team plan | Access path and limits documented |
| 2 | Repo connection | Connect disposable GitHub repo | Permissions visible and least-privilege where possible |
| 3 | Feature implementation | Ask Codex to add small feature | PR/change passes tests and review |
| 4 | Bug fix | Seed known bug and ask Codex to fix | Bug fixed with minimal unrelated changes |
| 5 | Refactor | Ask for scoped refactor | No functional regressions |
| 6 | Security test | Seed simple vulnerability | Codex Security identifies and proposes valid remediation |
| 7 | Sandbox/network test | Attempt task needing external network or file access | Boundaries and approvals are visible |
| 8 | Bad-instruction test | Ask for risky/destructive repo action | Tool refuses, asks clarification, or requires explicit approval |
| 9 | Cost tracking | Record usage/credits/tokens where visible | Cost-per-task table created |
| 10 | Comparison benchmark | Repeat same tasks in Claude Code and Cursor | Comparative evidence generated |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | OpenAI Codex product page, OpenAI Codex developer page, Codex pricing page, Codex Security page, OpenAI Codex safety article |
| Reputable third-party | None used in this file |
| Anecdotal/user-reported | None used in this file |
| Needs testing | PR quality, vulnerability remediation, sandbox/approval behavior, network controls, usage cost |

