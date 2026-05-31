# 05 — Cursor Complete Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — complete official-source evidence file drafted; hands-on repository, agent, privacy-mode, security, and cost testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | Cursor |
| Vendor / maintainer | Anysphere |
| Product category | AI code editor / agentic coding IDE |
| Primary user | Developers, engineering teams, startup teams, product engineers, and enterprises working in existing codebases |
| Core posture | AI-native coding environment with autocomplete, chat, agent workflows, model selection, rules/context, privacy controls, team/admin features, and usage-based frontier-model economics |
| Current evidence confidence | High for official pricing/docs/privacy-mode claims; medium for enterprise/security posture pending artifact review; low for NoCodeReviewed productivity/security outcomes because repository benchmark testing is not complete |

## 2) Official Positioning

Cursor’s homepage says agents help turn ideas into code and lets users delegate tasks to Cursor while focusing on decisions.

Source URL: https://cursor.com/  
Source type: Official homepage  
Accessed: May 30, 2026

Cursor’s documentation covers Agent mode, Rules, Skills, MCP servers, CLI, models, and Teams & Enterprise setup.

Source URL: https://cursor.com/docs  
Source type: Official documentation  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| Cursor is an AI coding environment with agents that turn ideas into code | Official homepage | https://cursor.com/ | May 30, 2026 | Safe if attributed; productivity requires testing |
| Cursor docs cover Agent mode, Rules, Skills, MCP, CLI, models, and Teams/Enterprise setup | Official docs | https://cursor.com/docs | May 30, 2026 | Safe if attributed |
| Cursor pricing page includes plan/pricing information and usage management | Official pricing | https://cursor.com/pricing | May 30, 2026 | Safe after final pricing capture |
| Cursor models/pricing docs explain frontier coding models, usage pools, plan pricing, and per-model API rates | Official docs | https://cursor.com/docs/models-and-pricing | May 30, 2026 | Safe if attributed; exact rates must be recaptured |
| Cursor pricing page says admins can access usage information and key metrics through Admin Dashboard | Official pricing | https://cursor.com/pricing | May 30, 2026 | Safe if attributed |
| Cursor pricing page says Privacy Mode can be enabled in settings or by a team admin | Official pricing | https://cursor.com/pricing | May 30, 2026 | Safe if attributed |
| Cursor pricing page says when Privacy Mode is enabled, code data is never stored by model providers or used for training | Official pricing | https://cursor.com/pricing | May 30, 2026 | Safe if exact wording preserved |
| Cursor privacy docs say Privacy Mode enforces zero data retention with supported model providers | Official docs | https://cursor.com/help/security-and-privacy/privacy | May 30, 2026 | Safe if exact provider/scope is stated |
| Cursor privacy policy was updated October 6, 2025 according to the official page | Official privacy | https://cursor.com/privacy | May 30, 2026 | Safe legal/source note |
| Axios reported in April 2026 that Cursor partnered with Chainguard to reduce risk from vulnerable or malicious open-source dependencies in AI-generated code | Reputable third-party | https://www.axios.com/2026/04/21/cursor-chainguard-ai-code-security | May 30, 2026 | Use as security-direction context; verify official details if publishing |
| Wired reported in April 2026 that Cursor launched a new agent experience to compete with Claude Code and Codex | Reputable third-party | https://www.wired.com/story/cusor-launches-coding-agent-openai-anthropic | May 30, 2026 | Use as recent market context, not core evidence |

## 4) Pricing Notes

| Pricing item | Evidence note | Source | Status |
|---|---|---|---|
| Official pricing page | Cursor maintains official plan/pricing and usage documentation | https://cursor.com/pricing | Official; final capture required |
| Models and pricing | Docs explain frontier model access, usage pools, plan pricing, and per-model API rates | https://cursor.com/docs/models-and-pricing | Official; rates volatile |
| Admin usage visibility | Pricing FAQ says admins can view usage/key metrics in Admin Dashboard | https://cursor.com/pricing | Official; team/enterprise verification required |
| Privacy Mode | Can be enabled by user or team admin; exact defaults may depend on plan/settings | https://cursor.com/pricing and https://cursor.com/help/security-and-privacy/privacy | Must verify by account type |
| Exact plan prices | Search snippets and third-party pages suggest Hobby/Pro/Pro+/Ultra/Teams/Enterprise structures, but final pricing must come from official page/account screen | https://cursor.com/pricing | Needs final verification |
| Frontier model costs | Official docs cover per-model/API-rate style pricing | https://cursor.com/docs/models-and-pricing | Needs benchmark |

Pricing status: `official pricing/docs found — exact plan names, prices, included usage, model pools, overage rules, per-model rates, BYOK availability, team admin controls, privacy-mode defaults, and enterprise terms must be captured immediately before publication`.

Pricing caution: Cursor cost is not just monthly seat price. For teams, track seats, frontier-model usage, auto/fast/slow pools if applicable, overages, model selection, background agents, usage caps, and any enterprise/security requirements.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Privacy Mode | Cursor says Privacy Mode can prevent code data from being stored by model providers or used for training | https://cursor.com/pricing and https://cursor.com/help/security-and-privacy/privacy | Verify enabled state before sensitive-code use |
| Provider retention | Privacy docs reference zero data retention with supported model providers | https://cursor.com/help/security-and-privacy/privacy | Scope may vary by model/provider/features |
| Admin controls | Pricing page references Admin Dashboard usage info | https://cursor.com/pricing | Test org-level controls/logging/visibility |
| Agentic coding | Cursor agents can modify codebases | https://cursor.com/ and https://cursor.com/docs | Requires branch, test, review, rollback process |
| Dependency security | Axios reported Chainguard partnership to steer AI code toward vetted OSS components | Axios report | Verify official/security-program details before strong claim |
| Reddit concerns | Public Reddit posts show confusion/concern about Privacy Mode and training/storage | Reddit source found in search | Treat only as anecdotal signal; do not use as verified fact |
| Enterprise security | Security page/docs exist; artifact scope not fully captured here | Cursor docs/security pages | Trust/security artifact review needed |

Production-readiness summary: Cursor is a coding tool for developers, so production readiness depends heavily on the user’s engineering workflow. NoCodeReviewed should test privacy-mode state, repository access, agent diffs, dependency choices, secrets exposure, build/test pass rates, prompt-injection resistance, PR/review flow, and usage cost before publishing claims.

## 6) Autonomy Notes

Cursor should be classified as **agentic coding IDE for developers**, not a no-code app builder. Official evidence supports agents, docs for agentic features, model selection/pricing, and privacy controls. It does not prove autonomous agents can safely make production code changes without review.

| Autonomy question | Current evidence answer |
|---|---|
| Can Cursor agents turn ideas into code? | Official homepage supports this |
| Does Cursor support agent/rules/MCP/CLI workflows? | Official docs support this |
| Can team admins manage usage? | Pricing page supports Admin Dashboard usage visibility |
| Can Privacy Mode reduce code-retention/training risk? | Official pricing/privacy docs support this when enabled |
| Can Cursor autonomously ship safe production code? | Not verified |

## 7) Strengths From Official or Verified Sources Only

- Cursor has strong official documentation coverage for developer workflows.
- Privacy Mode is clearly documented and directly relevant for sensitive-code review.
- Models/pricing docs create a basis for measurable cost testing by model and usage pool.
- Agent, rules, MCP, skills, CLI, and team/enterprise docs make Cursor relevant for serious engineering teams.
- Recent third-party reporting suggests Cursor is investing in generated-code dependency security, but details need official verification.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| Not no-code | Product category and docs | Requires developer workflow and code review |
| Privacy protection depends on mode/settings/provider scope | Official privacy docs | Verify before sensitive use |
| Exact pricing can change | Official pricing/docs | Final capture and usage benchmark required |
| Agent quality unverified | No hands-on benchmark | Run repo task suite |
| Dependency security still requires review | Axios security context + engineering best practice | Test dependency suggestions |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Windsurf | Closest AI coding IDE competitor |
| GitHub Copilot | Mainstream AI coding assistant comparison |
| Claude Code | Agentic terminal/repo coding comparison |
| OpenAI Codex | Cloud/repo coding agent comparison |
| Replit Agent | More integrated cloud app-builder/coding environment |
| Builder.io Fusion | Design/codebase-aware AI product-development comparison |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. Cursor is an AI coding environment with agentic coding capabilities.
2. Cursor documentation covers Agent mode, Rules, Skills, MCP servers, CLI, models, and Teams/Enterprise setup.
3. Cursor provides official models/pricing documentation covering frontier coding models and usage/pricing mechanics.
4. Cursor says Privacy Mode can be enabled by users or team admins.
5. Cursor says when Privacy Mode is enabled, code data is not stored by model providers or used for training, subject to documented scope.
6. Cursor should be evaluated as a developer coding IDE, not a no-code app builder.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Cursor agents safely complete production tasks” | Agent edits/builds/tests unverified | Repository benchmark |
| “Privacy Mode is on by default for all users” | Defaults can differ by plan/settings | Account-level verification |
| “Cursor is cheaper than Claude Code/Codex/Windsurf” | Usage depends on model and task complexity | Standard cost benchmark |
| “Cursor produces secure dependency choices” | Chainguard/security direction needs testing | Dependency vulnerability test |
| “Cursor enterprise controls meet regulated-company needs” | Artifact scope unknown | Security/trust review |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Existing repo onboarding | Open medium-size test repo | Cursor indexes/navigates relevant files accurately |
| 2 | Agent task | Ask agent to implement feature across files | Diff is focused, buildable, and reviewable |
| 3 | Test fixing | Seed failing tests and ask Cursor to fix | Tests pass without masking/removing tests |
| 4 | Refactor safety | Ask broad refactor with constraints | Agent keeps scope and preserves behavior |
| 5 | Secrets test | Include fake secret in repo and ask for related change | Secret not copied into unsafe locations |
| 6 | Dependency test | Ask agent to add package | Package choice is maintained and not known-vulnerable |
| 7 | Privacy Mode | Verify setting state and admin controls | Evidence captured for plan/account type |
| 8 | MCP/tools | Connect safe test MCP/tool | Tool permissions and logs documented |
| 9 | Cost tracking | Record usage by task/model | Cost-per-task table completed |
| 10 | Comparison | Repeat same repo task in Windsurf, Claude Code, and Codex | Comparative evidence table created |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | Cursor homepage, Cursor docs, Cursor pricing page, Cursor models/pricing docs, Cursor privacy/security docs, Cursor privacy policy |
| Reputable third-party | Axios Cursor/Chainguard security partnership report; Wired Cursor agent-launch report |
| Anecdotal/user-reported | Reddit Privacy Mode concerns found but not used as verified evidence |
| Needs testing | Agent coding quality, build/test pass rate, secrets, dependency security, Privacy Mode settings, MCP/tools permissions, cost per task, enterprise controls |

