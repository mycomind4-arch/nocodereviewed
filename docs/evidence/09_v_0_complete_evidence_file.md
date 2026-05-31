# 09 — v0 Complete Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — complete official-source evidence file drafted; hands-on prompt-to-app, Design Mode, GitHub sync, Vercel deployment, cost, security, and generated-code testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | v0 |
| Vendor / maintainer | Vercel |
| Product category | AI web app/UI generator, visual design/editing tool, and Vercel-connected deployment workflow |
| Primary user | Frontend developers, founders, product teams, designers, agencies, and builders creating React/Next.js-style web apps and UI prototypes |
| Core posture | Generate and iterate web apps/UI from prompts, edit visually, sync with GitHub, and deploy to Vercel with credit-based pricing |
| Current evidence confidence | High for official pricing and Vercel deployment/pricing docs; medium for exact generated-code behavior pending hands-on tests; low for production-readiness because app security/code quality is not yet benchmarked |

## 2) Official Positioning

v0’s pricing page describes plans that include deploying apps to Vercel, editing visually with Design Mode, syncing with GitHub, and message/credit limits.

Source URL: https://v0.app/pricing  
Source type: Official pricing page  
Accessed: May 30, 2026

Vercel’s pricing docs explain that Vercel pricing includes plan-level pricing and billable resource metrics.

Source URL: https://vercel.com/docs/pricing  
Source type: Official Vercel pricing docs  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| v0 Free plan is $0/month and includes $5 of monthly credits | Official pricing | https://v0.app/pricing | May 30, 2026 | Safe after final pricing recheck |
| v0 Free includes deploy apps to Vercel, Design Mode, GitHub sync, and 7-message/day limit | Official pricing | https://v0.app/pricing | May 30, 2026 | Safe after final pricing recheck |
| v0 Team plan is listed at $30/user/month and includes $30 monthly credits per user | Official pricing | https://v0.app/pricing | May 30, 2026 | Safe after final pricing recheck |
| v0 Team includes $2 of free daily credits on login per user and centralized billing on vercel.com | Official pricing | https://v0.app/pricing | May 30, 2026 | Safe after final pricing recheck |
| v0 Team supports purchasing additional credits outside monthly usage shared across team | Official pricing | https://v0.app/pricing | May 30, 2026 | Safe after final pricing recheck |
| v0 Team supports sharing chats and collaborating with team | Official pricing | https://v0.app/pricing | May 30, 2026 | Safe after final pricing recheck |
| Vercel pricing page lists Hobby as free and Pro as $20/month, with active compute and spend limits | Official pricing | https://vercel.com/pricing | May 30, 2026 | Relevant for deployment-cost context |
| Vercel docs say pricing model includes billable metrics and resource usage, with docs last updated November 13, 2025 | Official docs | https://vercel.com/docs/pricing | May 30, 2026 | Safe if attributed |
| Vercel supports web app deployment with CI/CD, CDN, WAF, DDoS mitigation, and traffic/performance insights according to pricing page snippet | Official pricing | https://vercel.com/pricing | May 30, 2026 | Safe if plan-qualified |
| v0 should be distinguished from Vercel platform pricing because deploying/running an app can create Vercel resource costs beyond v0 generation credits | Official pricing/docs synthesis | https://v0.app/pricing and https://vercel.com/docs/pricing | May 30, 2026 | Safe as reviewer note |

## 4) Pricing Notes

| Pricing item | Evidence note | Source | Status |
|---|---|---|---|
| v0 Free | $0/month; $5 included monthly credits; deploy apps to Vercel; Design Mode; GitHub sync; 7 messages/day | https://v0.app/pricing | Official; final capture required |
| v0 Team | $30/user/month; $30 monthly credits/user; $2 daily credits on login/user; centralized billing; shared additional credits; shared chats/collaboration | https://v0.app/pricing | Official; final capture required |
| Additional v0 credits | Team plan allows purchasing additional credits outside monthly usage shared across team | https://v0.app/pricing | Official; price per credit needs capture |
| Vercel Hobby | Vercel pricing page lists Hobby free forever | https://vercel.com/pricing | Deployment context; final Vercel capture needed |
| Vercel Pro | Vercel pricing page lists Pro at $20/month | https://vercel.com/pricing | Deployment context; final Vercel capture needed |
| Vercel billable usage | Vercel docs explain billable metrics and resource models | https://vercel.com/docs/pricing | Important cost caveat |
| Enterprise | Vercel Enterprise and possible v0 enterprise/team terms need verification | https://vercel.com/pricing and v0 account/pricing | Needs verification |

Pricing status: `official pricing found — exact v0 Free/Team credit rules, daily credit rules, additional credit pricing, message limits, GitHub sync limits, Design Mode access, team collaboration, Vercel plan interaction, deployment resource costs, and Enterprise terms must be captured immediately before publication`.

Pricing caution: v0 generation credits and Vercel hosting costs are separate cost dimensions. A builder may pay v0 credits/team seats plus Vercel Pro/Enterprise seats, active compute, bandwidth, storage, database/KV/blob services, observability, domains, and other resource-based charges.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Deployment to Vercel | v0 pricing says apps can deploy to Vercel | https://v0.app/pricing | Deployment success does not prove app security |
| GitHub sync | v0 pricing says GitHub sync is included | https://v0.app/pricing | Test code ownership, repo permissions, branch behavior |
| Design Mode | v0 pricing says visual editing with Design Mode is included | https://v0.app/pricing | Test whether edits remain maintainable in code |
| Vercel platform controls | Vercel pricing references WAF, CDN, DDoS mitigation, CI/CD, traffic/performance insights | https://vercel.com/pricing | Plan-specific; not proof generated app is secure |
| Resource billing | Vercel docs explain billable resource metrics | https://vercel.com/docs/pricing | Cost controls/spend limits must be reviewed |
| Generated app security | No official evidence in this pass proves generated apps have correct auth/data/security defaults | Needs hands-on | Test secrets, auth, API routes, dependencies |
| Code maintainability | GitHub sync creates reviewable artifacts | https://v0.app/pricing | Must build/test/export inspect generated code |

Production-readiness summary: v0 is best evaluated as a fast UI/web-app generation and iteration tool connected to Vercel deployment, not as a guaranteed secure full-stack app builder. NoCodeReviewed should test generated code, API routes, auth/data integrations, dependency choices, GitHub sync, deployment behavior, Vercel resource cost, and visual-editing maintainability.

## 6) Autonomy Notes

v0 should be classified as **AI-assisted web app/UI generation with deployment and visual-editing workflow**, not a general autonomous coding agent. Official pricing evidence supports prompts/credits, Design Mode, GitHub sync, and Vercel deployment. It does not prove autonomous secure backend engineering.

| Autonomy question | Current evidence answer |
|---|---|
| Can v0 generate/edit apps using credits/messages? | Pricing page supports credit/message structure |
| Can v0 deploy apps to Vercel? | Pricing page supports this |
| Can v0 sync with GitHub? | Pricing page supports this |
| Can users edit visually with Design Mode? | Pricing page supports this |
| Can v0 guarantee secure production apps? | Not verified |

## 7) Strengths From Official or Verified Sources Only

- v0 has clear official pricing with Free and Team plans and included monthly credits.
- v0 is tightly connected to Vercel deployment, which is useful for publishing and testing generated apps quickly.
- Design Mode provides a visual editing path for non-developer or designer-involved workflows.
- GitHub sync creates an inspectable code/repo workflow rather than a purely opaque builder.
- Vercel pricing/docs provide a clear basis for cost modeling beyond generation credits.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| v0 credits are only one cost dimension | v0 + Vercel pricing docs | Deployment can add resource costs |
| Production app security unverified | No hands-on test record | Test auth, secrets, API routes, dependencies |
| Free plan has message/day limit | v0 pricing | Impacts iteration speed |
| Team plan cost scales per user | v0 pricing | Cost benchmark needed |
| Visual edits may affect maintainability | Product workflow reasoning | Test code after Design Mode edits |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Bolt.new | Prompt-to-web-app builder with browser IDE and hosting/database direction |
| Lovable | Full-stack prompt-to-app builder |
| Replit Agent | Prompt-to-app cloud IDE/deployment workflow |
| Builder.io Fusion | Design/codebase-aware AI product-development workflow |
| Figma Make | Design-to-app/prototype generation comparison |
| Cursor | Developer IDE comparison after GitHub sync/code export |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. v0 Free is listed at $0/month with $5 of included monthly credits.
2. v0 Free includes Vercel deployment, Design Mode, GitHub sync, and a 7-message/day limit according to the pricing page.
3. v0 Team is listed at $30/user/month with $30 of monthly credits per user.
4. v0 Team includes centralized billing, shared additional credits, and team chat/collaboration features according to the pricing page.
5. Vercel deployment costs should be modeled separately from v0 generation credits because Vercel has its own billable resource metrics.
6. v0 should be evaluated as an AI web app/UI generation workflow connected to Vercel, not as a verified secure autonomous full-stack engineer.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “v0 builds production-ready apps” | Generated code/security untested | Prompt-to-app benchmark |
| “v0 is cheaper than Bolt/Lovable/Replit” | Credits + Vercel costs vary | Standard cost benchmark |
| “GitHub sync avoids lock-in” | Sync quality/branch behavior/buildability untested | GitHub/local build test |
| “Design Mode preserves clean code” | Visual edits may produce code changes needing review | Design Mode diff/build test |
| “Vercel deployment means enterprise-grade security” | Platform controls are not app security | App security and Vercel plan review |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Prompt-to-app build | Generate SaaS landing + dashboard or client portal | Coherent UI/routes/components generated |
| 2 | Iteration | Request design/function change | Change works and does not break existing UI |
| 3 | Design Mode | Edit generated screen visually | Code remains buildable and diff is understandable |
| 4 | GitHub sync | Sync to test repo | Files/commits/branches are inspectable |
| 5 | Local build | Install and build synced repo locally | Build succeeds with documented dependencies |
| 6 | API/auth | Add simple auth/API route or connect external backend | Secrets are not exposed; protected routes work |
| 7 | Deployment | Deploy to Vercel | App works and deployment settings are documented |
| 8 | Cost tracking | Track credits/messages and Vercel resources | Cost-per-build and deployment-cost table completed |
| 9 | Dependency review | Inspect generated dependencies | Packages exist, maintained, and minimally necessary |
| 10 | Comparison | Repeat benchmark in Bolt.new and Lovable | Comparative evidence table completed |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | v0 pricing page, Vercel pricing page, Vercel pricing documentation |
| Reputable third-party | None used as core evidence in this file |
| Anecdotal/user-reported | None used as evidence |
| Needs testing | Prompt-to-app quality, Design Mode, GitHub sync, local build, generated code, API/auth/secrets, Vercel deploy, Vercel cost, dependency review |

