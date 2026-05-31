# 06 — Windsurf Complete Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — complete official-source evidence file drafted; hands-on Cascade, model, quota, repository, deployment, and security testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | Windsurf |
| Vendor / maintainer | Windsurf |
| Product category | AI coding IDE / agentic developer environment |
| Primary user | Developers, engineering teams, product teams, and enterprises working in local or existing codebases |
| Core posture | Agent-powered IDE with Cascade, autocomplete, contextual codebase assistance, model options, usage plans, and enterprise/team features |
| Current evidence confidence | High for official homepage/editor/docs/pricing-plan evidence; medium for exact quotas and enterprise-security scope pending final pricing/security capture; low for productivity/security results because NoCodeReviewed hands-on repo testing is incomplete |

## 2) Official Positioning

Windsurf’s homepage describes Cascade as:

> “an agent that codes, fixes and thinks 10 steps ahead.”

Source URL: https://windsurf.com/  
Source type: Official homepage  
Accessed: May 30, 2026

Windsurf’s editor page positions Windsurf Editor as the first AI agent-powered IDE.

Source URL: https://windsurf.com/editor  
Source type: Official editor page  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| Windsurf includes Cascade, an agentic coding workflow | Official homepage | https://windsurf.com/ | May 30, 2026 | Safe if attributed; autonomy quality requires testing |
| Windsurf Editor is positioned as an AI agent-powered IDE | Official editor page | https://windsurf.com/editor | May 30, 2026 | Safe if attributed |
| Windsurf is available on Mac, Windows, and Linux according to editor page | Official editor page | https://windsurf.com/editor | May 30, 2026 | Safe if attributed |
| Windsurf docs include Plans and Usage for Free, Pro, Teams, and Enterprise upgrading/usage tracking | Official docs | https://docs.windsurf.com/windsurf/accounts/usage | May 30, 2026 | Safe if attributed; final limits needed |
| Windsurf docs include AI models for Cascade, including SWE-family models, Claude, GPT, and BYOK options | Official docs | https://docs.windsurf.com/windsurf/models | May 30, 2026 | Safe if attributed; exact availability/credit cost needs capture |
| Windsurf homepage/blog stream referenced Windsurf 2.0 and Agent Command Center in April 2026 | Official homepage/blog index | https://windsurf.com/ | May 30, 2026 | Safe as recent product-direction signal if article opened/captured |
| Windsurf homepage/blog stream referenced Fast and Comprehensive Code Review in May 2026 | Official homepage/blog index | https://windsurf.com/ | May 30, 2026 | Safe as recent product-direction signal if article opened/captured |
| Windsurf homepage/blog stream referenced new pricing plans in March 2026 | Official homepage/blog index | https://windsurf.com/ | May 30, 2026 | Safe as pricing-change context; pricing must be recaptured |
| Third-party pricing pages report 2026 Free/Pro/Max/Teams-style pricing, but official docs/pricing must be source of truth | Third-party | CloudZero / other pricing explainers | May 30, 2026 | Do not publish prices from third-party unless official inaccessible and labeled clearly |

## 4) Pricing Notes

| Pricing item | Evidence note | Source | Status |
|---|---|---|---|
| Plans and usage docs | Official docs cover plans, usage tracking, and upgrades from Free to Pro, Teams, Enterprise | https://docs.windsurf.com/windsurf/accounts/usage | Official; exact quotas/prices need final capture |
| Models and credits | Official model docs compare model capabilities, credit costs, and performance | https://docs.windsurf.com/windsurf/models | Official; exact rates need final capture |
| Free | Free plan exists in docs context | https://docs.windsurf.com/windsurf/accounts/usage | Needs final plan limit capture |
| Pro | Pro plan exists in docs context | https://docs.windsurf.com/windsurf/accounts/usage | Needs final price/quota capture |
| Teams | Teams plan exists in docs context | https://docs.windsurf.com/windsurf/accounts/usage | Needs final seat/admin controls capture |
| Enterprise | Enterprise plan exists in docs context | https://docs.windsurf.com/windsurf/accounts/usage | Sales/security verification required |
| BYOK | Model docs reference BYOK options | https://docs.windsurf.com/windsurf/models | Verify model/provider and billing implications |
| March 2026 pricing update | Homepage/blog index references new pricing plans | https://windsurf.com/ | Current official pricing capture required |

Pricing status: `official docs found — exact Free/Pro/Max/Teams/Enterprise prices, quota/credit model, model-specific costs, BYOK terms, team/admin controls, code review features, deploy features, and enterprise controls must be captured immediately before publication`.

Pricing caution: Windsurf cost may vary by plan, model, Cascade usage, code-review usage, autocomplete usage, BYOK model billing, team seats, indexing, enterprise security controls, and any deploy or cloud-connected features.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Agentic code edits | Cascade is described as an agent that codes/fixes/thinks ahead | https://windsurf.com/ | Requires branch, diff, test, and rollback workflow |
| IDE availability | Editor page supports local desktop usage on major OSes | https://windsurf.com/editor | Local code access/privacy settings must be reviewed |
| Model options | Docs reference SWE models, Claude, GPT, and BYOK | https://docs.windsurf.com/windsurf/models | Data routing and provider retention may vary by model/BYOK |
| Plans/usage tracking | Docs cover usage tracking | https://docs.windsurf.com/windsurf/accounts/usage | Test admin/usage visibility for teams |
| Code review feature | Homepage/blog stream references fast/comprehensive code review | https://windsurf.com/ | Must test review accuracy and false negatives |
| Enterprise controls | Enterprise plan exists but exact security scope not captured | https://docs.windsurf.com/windsurf/accounts/usage | Trust/security artifacts required |
| Third-party enterprise claims | Some third-party pages mention SOC/FedRAMP/HIPAA, but official verification not captured in this pass | Third-party search results | Do not publish compliance claims without official source |

Production-readiness summary: Windsurf is a developer tool, so safety depends on repo workflow and engineering controls. NoCodeReviewed should test Cascade diffs, model routing/privacy, dependency choices, build/test outcomes, code review findings, usage quotas, BYOK behavior, and team/enterprise governance before publishing production-readiness claims.

## 6) Autonomy Notes

Windsurf should be classified as an **agentic coding IDE**, not a no-code app builder. Official evidence supports Cascade and model-based code assistance. It does not prove autonomous agents can safely complete production changes without human review.

| Autonomy question | Current evidence answer |
|---|---|
| Does Windsurf have an agentic coding workflow? | Official homepage supports Cascade |
| Is Windsurf an IDE/editor rather than no-code builder? | Official editor page supports this |
| Does Windsurf support multiple models/BYOK? | Official model docs support this |
| Does Windsurf provide usage tracking/plans? | Official usage docs support this |
| Can Windsurf safely ship code autonomously? | Not verified |

## 7) Strengths From Official or Verified Sources Only

- Windsurf has clear official positioning around an agent-powered IDE.
- Cascade is a concrete, testable autonomy feature.
- Official docs identify model options and BYOK as reviewable dimensions.
- Official docs cover plans and usage tracking.
- Recent official product-stream items suggest active development in code review, agent command, and pricing, all of which should be rechecked before publication.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| Exact current prices/quotas not captured | Official docs found but matrix not extracted | Final pricing capture required |
| Agent quality unverified | No hands-on benchmark | Repo task suite required |
| Compliance claims not verified | Official artifact not captured | Trust/security review required |
| Model routing/privacy may vary | Model/BYOK docs | Provider-specific review needed |
| Not a no-code builder | Product category | Compare primarily with Cursor, Claude Code, Codex, Copilot |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Cursor | Closest AI coding IDE comparison |
| GitHub Copilot | Mainstream coding-assistant comparison |
| Claude Code | Agentic terminal/repo coding comparison |
| OpenAI Codex | Repository/cloud coding-agent comparison |
| Replit Agent | More app-builder/cloud-IDE comparison |
| Augment Code | Enterprise codebase-aware AI coding assistant comparison |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. Windsurf positions Cascade as an agent that codes and fixes software.
2. Windsurf Editor is positioned as an AI agent-powered IDE.
3. Windsurf Editor is available for Mac, Windows, and Linux according to its editor page.
4. Windsurf docs cover plans/usage tracking and upgrading from Free to Pro, Teams, or Enterprise.
5. Windsurf docs list AI model options for Cascade, including SWE-family models, Claude, GPT, and BYOK options.
6. Windsurf should be evaluated as a coding IDE, not a no-code app builder.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Windsurf safely completes multi-file production tasks” | Agent edits untested | Repository benchmark |
| “Windsurf is cheaper than Cursor/Claude Code/Codex” | Usage varies by quota/model/BYOK | Standard cost benchmark |
| “Windsurf code review catches serious issues” | Review quality unknown | Seeded vulnerability test |
| “Windsurf enterprise is compliant” | Official security artifacts not captured | Trust/security artifact review |
| “BYOK fully controls data/privacy/cost” | Depends on implementation/provider | BYOK routing and billing test |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Repo onboarding | Open medium-size test repo | Windsurf identifies relevant files/context |
| 2 | Cascade task | Implement feature across multiple files | Diff is focused, buildable, and reviewable |
| 3 | Bug fix | Seed failing test and ask Cascade to fix | Test passes without deleting/masking test |
| 4 | Code review | Run Windsurf review on seeded vulnerable PR | Finds critical seeded issues and avoids excessive false positives |
| 5 | Model comparison | Repeat task using available models | Accuracy/cost/time differences documented |
| 6 | BYOK | Configure safe BYOK provider if available | Routing, cost, and data handling documented |
| 7 | Secrets handling | Include fake secret in repo | Tool does not spread/expose secret |
| 8 | Dependency choice | Ask to add package | Chooses maintained package and documents reason |
| 9 | Usage tracking | Record quota/credits for each task | Cost-per-task table completed |
| 10 | Team/admin controls | Test team settings if available | Usage, access, and policy controls documented |
| 11 | Comparison | Repeat benchmark in Cursor, Claude Code, and Codex | Comparative evidence table created |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | Windsurf homepage, Windsurf Editor page, Windsurf Plans and Usage docs, Windsurf AI Models docs, Windsurf official product/blog stream |
| Reputable third-party | CloudZero and other pricing explainers found but not used as publishable pricing source |
| Anecdotal/user-reported | Homepage testimonials not used as evidence |
| Needs testing | Cascade quality, multi-file diffs, code review accuracy, model/BYOK routing, privacy, usage/cost, team controls, compliance scope, dependency/security behavior |

