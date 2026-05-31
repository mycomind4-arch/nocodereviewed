# 08 — OpenAI Codex Complete Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — complete official-source evidence file drafted; hands-on IDE, repo, cloud-agent, pricing, data-control, security, and cost testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | OpenAI Codex / Codex |
| Vendor / maintainer | OpenAI |
| Product category | AI coding agent / IDE and cloud software-engineering assistant |
| Primary user | Developers, engineering teams, startup teams, enterprise engineering organizations, and product teams using AI to plan, build, review, refactor, and ship code |
| Core posture | Coding agent integrated with ChatGPT/OpenAI ecosystem and developer tools; supports engineering tasks such as planning, building features, refactors, reviews, releases, and IDE workflows |
| Current evidence confidence | High for official product page and official pricing page existence; medium for access/plan terms because rollout and pricing may be evolving; low for NoCodeReviewed safety/productivity outcomes until repository testing is complete |

## 2) Official Positioning

OpenAI’s Codex page says:

> “The best way to build with agents.”

and describes Codex as accelerating real engineering work from planning and feature building to refactors, reviews, and releases.

Source URL: https://openai.com/codex/  
Source type: Official product page  
Accessed: May 30, 2026

OpenAI’s developer pricing page provides Codex pricing information.

Source URL: https://developers.openai.com/codex/pricing  
Source type: Official pricing page  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| OpenAI positions Codex as a coding agent that helps users build and ship with AI | Official product page | https://openai.com/codex/ | May 30, 2026 | Safe if attributed |
| Codex is described as accelerating engineering work including planning, feature building, refactors, reviews, and releases | Official product page | https://openai.com/codex/ | May 30, 2026 | Safe if attributed; outcome quality requires testing |
| Codex product page says users can try it in an IDE and join the Codex app waitlist | Official product page | https://openai.com/codex/ | May 30, 2026 | Safe if attributed; availability must be verified by account |
| Codex product page says Codex is available on macOS and Windows | Official product page | https://openai.com/codex/ | May 30, 2026 | Safe if attributed |
| OpenAI provides official Codex pricing information through developer pricing page | Official pricing | https://developers.openai.com/codex/pricing | May 30, 2026 | Safe after final pricing capture |
| Official Codex pricing page referenced Pro usage promotions through May 31, 2026 | Official pricing | https://developers.openai.com/codex/pricing | May 30, 2026 | Time-sensitive; update after May 31, 2026 |
| Codex pricing page differentiates Pro usage tiers/allowances | Official pricing | https://developers.openai.com/codex/pricing | May 30, 2026 | Exact details require final capture |
| OpenAI provides general API pricing/model pricing separately from Codex-specific plans | Official pricing | https://openai.com/api/pricing/ | May 30, 2026 | Relevant if API usage/BYOK path applies |
| Tom’s Hardware reported a 2026 case where a large autonomous coding-agent workload consumed over $1.3M of OpenAI API tokens in one month | Reputable third-party news | https://www.tomshardware.com/tech-industry/artificial-intelligence/openclaw-creator-burns-through-1-3-million-in-openai-api-tokens-in-a-single-month | May 30, 2026 | Use as extreme cost-risk context, not typical-user pricing |
| 2026 package-hallucination research found package hallucination remains a supply-chain risk across frontier code-capable models | Reputable research | https://arxiv.org/abs/2605.17062 | May 30, 2026 | Use as category risk requiring dependency tests |

## 4) Pricing Notes

| Pricing item | Evidence note | Source | Status |
|---|---|---|---|
| Codex pricing page | Official Codex pricing page exists | https://developers.openai.com/codex/pricing | Official; final capture required |
| Pro promotional usage | Official pricing page referenced a Pro usage promotion through May 31, 2026 | https://developers.openai.com/codex/pricing | Time-sensitive; expires/changes after May 31, 2026 |
| Pro tiers | Official pricing page references Pro usage levels | https://developers.openai.com/codex/pricing | Needs final tier capture |
| API pricing | OpenAI API pricing is separate from Codex-specific pricing | https://openai.com/api/pricing/ | Needs path-specific verification |
| ChatGPT plan inclusion | Codex access may depend on ChatGPT plan/account state | Official Codex product/pricing pages | Needs account verification |
| Business/Enterprise | Codex for work/business/enterprise paths appear on official product page | https://openai.com/codex/ | Sales/admin verification required |
| Extreme usage risk | Third-party report documents very high API token consumption in autonomous coding-agent workload | Tom’s Hardware report | Cost-risk context only |

Pricing status: `official Codex pricing source found — exact plan availability, included usage, promotional usage expiry, Pro/Business/Enterprise access, app waitlist status, API vs ChatGPT billing path, overage/credit rules, and model-specific pricing must be captured immediately before publication`.

Pricing caution: Codex cost can vary sharply by model, agent mode, repo size, task complexity, number of retries, test loops, review loops, parallel agents, fast/priority modes, and whether usage is billed through ChatGPT, Codex-specific allowances, or API tokens.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Agentic engineering scope | Product page frames Codex around real engineering tasks | https://openai.com/codex/ | Requires repo permission, branch, PR, test, and rollback controls |
| IDE workflow | Product page says users can try Codex in an IDE | https://openai.com/codex/ | Test local repo access and settings |
| Cloud/app path | Product page references Codex app waitlist and Codex for work | https://openai.com/codex/ | Availability and data controls must be verified by account |
| Pricing volatility | Official pricing includes time-sensitive promotional usage | https://developers.openai.com/codex/pricing | Recheck after May 31, 2026 |
| Cost runaway | Third-party report shows autonomous coding workloads can consume extreme API tokens at scale | Tom’s Hardware report | Use as stress-case; benchmark normal workload |
| Supply-chain risk | Frontier code models still hallucinate packages in research | https://arxiv.org/abs/2605.17062 | Test dependencies and slopsquatting resistance |
| Data/privacy | OpenAI product data handling depends on plan/workspace/API settings | OpenAI privacy/security docs needed | Must verify official data-control settings before sensitive-code claims |

Production-readiness summary: Codex is positioned for serious engineering work, but NoCodeReviewed must verify account availability, data controls, repo permissions, generated diffs, tests, dependency safety, secrets handling, cost controls, and agent autonomy before publication.

## 6) Autonomy Notes

OpenAI Codex should be classified as an **agentic coding assistant for engineering workflows**, not a no-code builder. Official materials support planning, features, refactors, reviews, releases, and IDE/app workflows. They do not prove autonomous production changes are safe without human review.

| Autonomy question | Current evidence answer |
|---|---|
| Is Codex positioned as a coding agent? | Official product page supports this |
| Does Codex support real engineering tasks? | Official product page lists planning, features, refactors, reviews, releases |
| Is there official pricing? | Official developer Codex pricing page exists |
| Is access universal? | Not verified; app waitlist/account state matters |
| Can Codex safely ship production code unattended? | Not verified |

## 7) Strengths From Official or Verified Sources Only

- Codex has direct official positioning around end-to-end engineering work, not just autocomplete.
- Official product page frames the workflow around planning, building, refactoring, reviewing, and releasing.
- Official pricing page exists and can be recaptured before publication.
- Codex is a central comparison point for Claude Code, Cursor, Windsurf, GitHub Copilot, and Replit Agent.
- Third-party cost and supply-chain research provides concrete benchmark areas: token burn and dependency hallucination.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| Availability/access may vary | Official product page references IDE and app waitlist | Account verification needed |
| Time-sensitive pricing | Official pricing promotion through May 31, 2026 | Recheck after date passes |
| Cost can scale dramatically | Third-party high-usage report | Benchmark realistic task set |
| Data controls not captured in this file | Need OpenAI plan/workspace/API docs | Sensitive-code claims require verification |
| Generated code quality untested | No NoCodeReviewed benchmark | Repo task suite required |
| Dependency hallucination remains category risk | 2026 research | Test package suggestions |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Claude Code | Closest terminal/repo coding-agent comparison |
| Cursor | IDE-based AI coding workflow comparison |
| Windsurf | Agent-powered IDE comparison |
| GitHub Copilot | Mainstream coding assistant/agent comparison |
| Replit Agent | App-builder/cloud IDE comparison |
| v0 | Web/UI-focused generation comparison |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. OpenAI positions Codex as a coding agent that helps users build and ship with AI.
2. OpenAI says Codex can support engineering tasks including planning, feature building, refactors, reviews, and releases.
3. OpenAI’s Codex product page references IDE use and a Codex app waitlist.
4. OpenAI provides official Codex pricing information through a developer pricing page.
5. Codex should be evaluated as an agentic coding tool for developers and teams, not as a no-code app builder.
6. Codex pricing should be rechecked immediately before publication because official pricing includes time-sensitive usage language.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Codex safely completes production engineering tasks” | Diffs/tests/security unverified | Repository benchmark |
| “Codex is available to all users” | App waitlist/account state may apply | Account verification |
| “Codex is cheaper than Claude Code/Cursor/Windsurf” | Cost depends on usage/model/path | Standard cost benchmark |
| “Codex protects sensitive code by default” | Data controls depend on plan/workspace/API | Official settings/security review |
| “Codex avoids unsafe dependencies” | Package hallucination remains code-model risk | Dependency benchmark |
| “Promotional usage limits are current” | Official promo expires May 31, 2026 | Recheck after expiry |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Access/setup | Try Codex IDE/app/work path on test account | Availability and plan path documented |
| 2 | Repo comprehension | Ask Codex to summarize architecture and plan feature | Correct files/risks identified |
| 3 | Feature implementation | Implement multi-file feature | Diff is focused, builds, and passes tests |
| 4 | Refactor | Ask for bounded refactor | Behavior preserved and tests pass |
| 5 | Code review | Ask Codex to review seeded vulnerable PR | Critical seeded issues found |
| 6 | Release prep | Ask for changelog/release checklist | Accurate and non-fabricated |
| 7 | Secrets | Include fake secret | Tool does not expose/copy secret unsafely |
| 8 | Dependency | Ask to add package | Package exists, maintained, and reasoned |
| 9 | Cost tracking | Record usage, model, retries, time | Cost-per-task table completed |
| 10 | Data controls | Verify workspace/API/privacy settings | Sensitive-code handling documented |
| 11 | Comparison | Repeat in Claude Code, Cursor, and Windsurf | Comparative evidence table completed |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | OpenAI Codex product page, OpenAI Codex pricing page, OpenAI API pricing page |
| Reputable third-party | Tom’s Hardware OpenClaw/OpenAI token-cost report; arXiv 2026 package-hallucination/slopsquatting research |
| Anecdotal/user-reported | None used as evidence |
| Needs testing | Access, IDE/app workflow, repo comprehension, feature/refactor/review/release tasks, secrets, dependencies, data controls, usage/cost, enterprise/work controls |

