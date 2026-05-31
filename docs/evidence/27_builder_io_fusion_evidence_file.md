# 27 — Builder.io Fusion Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — official Fusion, pricing, homepage, and product-positioning sources found; hands-on codebase, design-system, PR, security, and generated-code testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | Builder.io Fusion |
| Vendor / maintainer | Builder.io |
| Product category | AI product-development platform / visual IDE / AI-assisted codebase and design-system workflow |
| Primary user | Product teams, designers, developers, engineering teams, agencies, and organizations using existing codebases/design systems |
| Core posture | Connects to codebase and Figma/design context so AI can generate or modify production code with team review and refinement |
| Current evidence confidence | High for official Fusion positioning and pricing-page existence; medium for exact pricing/credit details because pricing can change; low for production-code quality because no NoCodeReviewed hands-on benchmark exists yet |

## 2) Official Positioning

Builder.io’s homepage says:

> “The AI product development platform for your real codebase and design system.”

Source URL: https://www.builder.io/  
Source type: Official homepage  
Accessed: May 30, 2026

Builder.io’s Fusion page says:

> “Fusion plugs into your existing codebase and Figma files, so AI builds with your components, styles, and APIs.”

Source URL: https://www.builder.io/fusion  
Source type: Official Fusion product page  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| Builder.io positions the platform as an AI product development platform for real codebases and design systems | Official homepage | https://www.builder.io/ | May 30, 2026 | Safe if attributed |
| Builder.io says teams review, refine, and approve AI-generated work | Official homepage | https://www.builder.io/ | May 30, 2026 | Safe if attributed |
| Fusion connects to an existing codebase and Figma files | Official Fusion page | https://www.builder.io/fusion | May 30, 2026 | Safe if attributed; integration behavior must be tested |
| Fusion uses existing components, styles, and APIs as context | Official Fusion page | https://www.builder.io/fusion | May 30, 2026 | Safe if attributed; output fidelity must be tested |
| Builder.io pricing page frames Fusion as a Visual IDE and Publish as a Visual CMS | Official pricing | https://www.builder.io/m/pricing | May 30, 2026 | Safe after final pricing capture |
| Builder.io pricing page says plan features, pricing, and limits are subject to change | Official pricing | https://www.builder.io/m/pricing | May 30, 2026 | Safe and important pricing caveat |
| Builder.io pricing page shows a Free plan for individuals looking to explore the platform | Official pricing | https://www.builder.io/m/pricing | May 30, 2026 | Safe after final pricing capture |
| Builder.io referral page references Fusion Pro upgrades and agent credits | Official referral page | https://www.builder.io/referral-program | May 30, 2026 | Useful signal; do not treat as full pricing matrix |

## 4) Pricing Notes

| Pricing item | Evidence note | Source | Status |
|---|---|---|---|
| Free | Pricing page shows a Free plan for individuals exploring the platform | https://www.builder.io/m/pricing | Official, needs final capture |
| Fusion | Pricing page treats Fusion as the Visual IDE product line | https://www.builder.io/m/pricing | Official |
| Publish | Pricing page treats Publish as the Visual CMS product line | https://www.builder.io/m/pricing | Official |
| Combined workflow | Pricing page says teams can start with either Fusion or Publish, or combine both | https://www.builder.io/m/pricing | Official |
| Pro / Team / Enterprise | Official pricing page appears to include paid tiers, but exact current plan matrix must be captured manually before publication | https://www.builder.io/m/pricing | Needs final verification |
| Agent credits | Official referral page references agent credits and Fusion Pro upgrades | https://www.builder.io/referral-program | Indicates credit system; exact included credits/overages need pricing capture |
| Pricing volatility | Official pricing page says plan features, pricing, and limits are subject to change | https://www.builder.io/m/pricing | Safe caveat |

Pricing status: `official pricing source found — exact current tier names, prices, users, agent credits, credit rollovers, Pro/Team/Enterprise differences, Publish vs Fusion bundling, and overage rules must be captured immediately before publication`.

Pricing caution: Builder.io Fusion cost may depend on users, agent credits, connected repositories, design-system integrations, Git provider integrations, Publish/CMS usage, enterprise controls, and implementation complexity. Do not compare price against Cursor, v0, Webflow, or Figma Make without a standard benchmark.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Real-codebase integration | Fusion connects to existing codebase context | https://www.builder.io/fusion | High-trust workflows require repo permission and branch/PR testing |
| Figma/design context | Fusion uses Figma files as context | https://www.builder.io/fusion | Test design-to-code fidelity and permissions |
| Components/styles/APIs | Official page says Fusion builds with existing components, styles, and APIs | https://www.builder.io/fusion | Output must be inspected for correctness and unsafe API usage |
| Review and approval | Homepage says teams review, refine, and approve | https://www.builder.io/ | Human-in-the-loop claim is useful; test exact workflow controls |
| Production-ready language | Homepage uses “production-ready code” positioning | https://www.builder.io/ | Treat as vendor positioning, not verified quality |
| Security/compliance artifacts | Dedicated trust/security artifact not captured in this pass | Needs verification | Do not publish SOC/compliance claims without official artifact |

Production-readiness summary: Builder.io Fusion is more codebase/design-system aware than many website generators, but connection to real code repositories and APIs increases risk. NoCodeReviewed should test repo permissions, branch behavior, generated diffs, dependency changes, API/secrets handling, design-system fidelity, PR review workflow, and rollback behavior before publishing production-readiness claims.

## 6) Autonomy Notes

Builder.io Fusion should be classified as **AI-assisted product development for real codebases and design systems**, not a fully autonomous software engineer. Official evidence supports codebase/Figma context, AI generation using existing components/styles/APIs, and human review/refinement/approval. It does not prove Fusion can safely modify production code without engineering review.

| Autonomy question | Current evidence answer |
|---|---|
| Can Fusion connect to an existing codebase? | Official Fusion page supports this |
| Can Fusion use Figma files as context? | Official Fusion page supports this |
| Can it use existing components/styles/APIs? | Official Fusion page supports this |
| Does Builder.io frame team review/approval as part of workflow? | Official homepage supports this |
| Can it autonomously ship safe production code? | Not verified |

## 7) Strengths From Official or Verified Sources Only

- Official positioning is specific to real codebases and design systems, not just prompt-to-mockup generation.
- Fusion’s codebase and Figma context claims are concrete and testable.
- Builder.io distinguishes Fusion as a Visual IDE and Publish as a Visual CMS in official pricing materials.
- Official homepage preserves a human review/refinement/approval framing.
- Agent-credit references create a measurable cost dimension for NoCodeReviewed testing.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| Production-code quality not verified | No hands-on testing record | Requires repo benchmark |
| Pricing matrix not fully captured | Pricing page found but exact matrix not extracted | Manual pricing capture required |
| Agent-credit usage not benchmarked | Official referral/pricing signals | Track credits by task |
| Security/compliance artifacts not captured | Source pass limitation | Dedicated trust/security pass required |
| Real-codebase access increases blast radius | Product architecture reasoning | Test repo permissions, PRs, secrets, rollbacks |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Figma Make | Closest design-to-functional-app / design-to-code AI workflow comparison |
| v0 | AI-assisted React/Next.js generation for web UI/app workflows |
| Cursor | Agentic coding tool for existing codebases |
| OpenAI Codex | Coding agent for software development and repository workflows |
| Webflow AI / Framer AI | AI website builders with different codebase/control tradeoffs |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. Builder.io positions Fusion as part of an AI product-development platform for real codebases and design systems.
2. Builder.io says Fusion connects to existing codebases and Figma files.
3. Builder.io says Fusion builds with a team’s existing components, styles, and APIs.
4. Builder.io pricing materials frame Fusion as a Visual IDE and Publish as a Visual CMS.
5. Builder.io says teams review, refine, and approve AI-generated work.
6. Builder.io’s pricing page says plan features, pricing, and limits are subject to change.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Fusion generates production-ready code” | Vendor positioning does not prove quality | Codebase benchmark and engineering review |
| “Fusion preserves design-system fidelity” | Needs Figma-to-code comparison | Design-system fixture test |
| “Fusion safely edits existing codebases” | Repo access can create damaging changes | Branch/PR/permission/rollback tests |
| “Fusion is cheaper than Cursor/v0/Figma Make” | Agent-credit and user pricing must be measured | Standard cost benchmark |
| “Fusion is enterprise-ready” | Security/compliance controls not captured | Trust/security artifact review |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Repo connection | Connect disposable GitHub/GitLab/Bitbucket repo if supported | Permissions and branch behavior documented |
| 2 | Figma context | Connect test Figma design file | Fusion can read intended design context only |
| 3 | Component fidelity | Generate page using existing design-system components | Output uses existing components instead of creating duplicates |
| 4 | API usage | Ask Fusion to wire UI to mock API | No secrets exposed; API calls are correct and typed where applicable |
| 5 | PR/diff review | Inspect generated changes | Diff is focused, reviewable, and reversible |
| 6 | Build/test | Run project build and test suite | Generated changes compile and tests pass |
| 7 | Regression test | Check existing pages/components | No obvious visual or functional regressions |
| 8 | Unsafe prompt | Ask for broad destructive refactor or secret exposure | Tool refuses, asks clarification, or creates bounded plan |
| 9 | Credit tracking | Record agent credits used per task | Cost-per-task table completed |
| 10 | Comparison | Repeat same Figma/codebase task in Figma Make, Cursor, and v0 | Comparative evidence table produced |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | Builder.io homepage, Builder.io Fusion page, Builder.io pricing page, Builder.io referral/agent-credit page |
| Reputable third-party | None used in this file |
| Anecdotal/user-reported | None used in this file |
| Needs testing | Repo permissions, Figma/design-system fidelity, generated code quality, API/secrets handling, PR workflow, build/test pass rate, agent-credit consumption, security/compliance artifacts |

