# 12 — Lovable Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — official docs/pricing found; hands-on testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | Lovable |
| Vendor / maintainer | Lovable |
| Product category | Full-stack AI development platform / AI app builder |
| Primary user | Founders, product builders, designers, nontechnical builders, and teams building web apps |
| Core posture | Natural-language app generation, iteration, and deployment with real code |
| Current evidence confidence | Medium-high for official positioning and pricing; low for tested output quality because no hands-on test has been recorded |

## 2) Official Positioning

Official documentation describes Lovable as:

> “a full-stack AI development platform for building, iterating on, and deploying web applications using natural language, with real code, security, and enterprise governance.”

Source URL: https://docs.lovable.dev/introduction/welcome  
Source type: Official documentation  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| Lovable is a full-stack AI development platform | Official | https://docs.lovable.dev/introduction/welcome | May 30, 2026 | Safe if attributed |
| Lovable supports building, iterating on, and deploying web applications using natural language | Official | https://docs.lovable.dev/introduction/welcome | May 30, 2026 | Safe if attributed |
| Lovable emphasizes real code, security, and enterprise governance | Official | https://docs.lovable.dev/introduction/welcome | May 30, 2026 | Safe only as vendor positioning, not as verified outcome |
| Lovable pricing includes Free, Pro, Business, and Enterprise framing | Official FAQ | https://lovable.dev/faq/getting-started/lovable-ai-cost | May 30, 2026 | Safe after final pricing-page recheck |
| Lovable top-up credits are bought in 50-credit increments and have plan-dependent pricing | Official docs | https://docs.lovable.dev/introduction/plans-and-credits | May 30, 2026 | Safe after final pricing-page recheck |

## 4) Pricing Notes

| Tier / pricing item | Price or limit observed | Source | Status |
|---|---:|---|---|
| Free | $0; official FAQ describes daily/monthly credit limits | https://lovable.dev/faq/getting-started/lovable-ai-cost | Official, needs final verification |
| Pro | $25/month; official FAQ says 100 credits/month | https://lovable.dev/faq/getting-started/lovable-ai-cost | Official, needs final verification |
| Business | $50/month; official FAQ says team features | https://lovable.dev/faq/getting-started/lovable-ai-cost | Official, needs final verification |
| Enterprise | Custom | https://lovable.dev/faq/getting-started/lovable-ai-cost | Official, needs sales verification |
| Pro top-up credits | $15 per 50 credits | https://docs.lovable.dev/introduction/plans-and-credits | Official, needs final verification |
| Business top-up credits | $30 per 50 credits | https://docs.lovable.dev/introduction/plans-and-credits | Official, needs final verification |

Pricing status: `official source found — recheck official pricing page immediately before publication`.

Pricing caution: Credit-based AI-builder pricing can change quickly and can vary by usage pattern. Do not publish a cost conclusion without running a benchmark prompt set and recording credit consumption.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Security positioning | Lovable docs include “security” in the platform positioning | https://docs.lovable.dev/introduction/welcome | Treat as vendor positioning, not proof of secure output |
| Enterprise governance positioning | Lovable docs include “enterprise governance” in positioning | https://docs.lovable.dev/introduction/welcome | Requires enterprise-plan docs and admin/security tests |
| Generated app security | Not verified in live source pass | Needs hands-on test | Do not claim secure-by-default generated apps |
| Auth / database / permissions | Not verified in live source pass | Needs hands-on test | Requires role and data-isolation testing |
| Secrets handling | Not verified in live source pass | Needs hands-on test | Must test prompts, env vars, repo exposure, and deploy logs |

Production-readiness summary: Lovable has official full-stack and governance positioning, but NoCodeReviewed should not treat that as evidence that generated apps are production-ready, secure, compliant, or suitable for regulated workloads without direct testing.

## 6) Autonomy Notes

Lovable can safely be described as a natural-language AI app builder. Current evidence supports prompt-based app generation and deployment positioning, but does **not** support claims that Lovable autonomously produces secure, production-grade applications without human review.

| Autonomy question | Current evidence answer |
|---|---|
| Can the user describe an app in natural language? | Official docs support this claim |
| Can Lovable generate real app code? | Official docs support “real code” positioning |
| Can it deploy apps? | Official docs support deployment positioning |
| Can it autonomously validate security and production readiness? | Not verified |
| Does it require human review? | Assume yes until testing proves otherwise |

## 7) Strengths From Official or Verified Sources Only

- Official docs position Lovable as full-stack rather than only a UI mockup generator.
- Official docs support natural-language building, iteration, and deployment claims.
- Official pricing/credit documentation was available during the live-source pass.
- The existence of plan-specific top-up credits provides reviewable usage-economics evidence.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| Output quality not independently verified | No hands-on testing record | Needs benchmark builds |
| Production readiness not proven by official positioning | Reasoned limitation from evidence | Security claims require tests |
| Pricing can be usage-sensitive | Credit model evidence | Must record credits used per task |
| Enterprise governance not verified | Official positioning only | Needs plan docs/admin tests |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Replit | Browser-native AI app builder with hosting/backend posture |
| Bolt.new | Prompt-to-app/site builder with cloud services and imports |
| v0 | Vercel-centric AI web-app generator |
| Base44 | Plain-language app builder with backend-included positioning |
| WeWeb AI | AI + visual web-app builder with production-grade positioning |

## 10) Safe Claims to Publish

These claims are safe only with source attribution and no added performance conclusions:

1. Lovable is an AI development platform for building web applications using natural language.
2. Lovable’s official docs describe the platform as full-stack and focused on building, iterating, and deploying web applications.
3. Lovable uses a credit-based pricing model according to its official pricing and credit documentation.
4. Lovable offers Free, Pro, Business, and Enterprise pricing framing according to its official FAQ.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Lovable builds production-ready apps” | Production readiness requires security, deploy, auth, database, and reliability checks | Hands-on test app and security review |
| “Lovable-generated apps are secure” | Official positioning is not proof | Auth, RLS/data isolation, secrets, route protection tests |
| “Lovable is cheaper than Replit/Bolt/v0” | Credit consumption varies by prompt and project size | Standard prompt benchmark with cost logging |
| “Lovable is best for nontechnical founders” | Needs comparison evidence | Usability test vs Replit, Bolt, v0, Base44 |
| “Enterprise governance is strong” | Needs plan-level controls evidence | Enterprise docs/admin demo/security artifact review |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Prompt-to-CRUD app | Ask Lovable to build simple authenticated CRUD app | Functional app generated without manual code edits |
| 2 | Auth flow | Add sign-up/login/logout and protected routes | Unauthenticated users cannot access protected data |
| 3 | Role permissions | Add admin/member roles | Members cannot access admin data/actions |
| 4 | Database isolation | Create test users and attempt cross-user reads | User A cannot read or modify User B data |
| 5 | Secrets handling | Add API integration requiring secret | Secret not exposed in client code, logs, or public repo |
| 6 | Deployment | Publish app to available hosting path | App works on public URL with expected restrictions |
| 7 | Error recovery | Introduce bug and ask Lovable to fix it | Bug fixed without breaking existing flows |
| 8 | Credit tracking | Record credits used for each step | Cost-per-task table produced |
| 9 | Code review | Inspect generated code | No obvious exposed secrets, unsafe auth, or broken validation |
| 10 | Comparison run | Repeat same prompt in Replit/Bolt/v0 | Comparative scorecard completed |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | Lovable docs, Lovable pricing FAQ, Lovable plans/credits docs |
| Reputable third-party | None used in this file |
| Anecdotal/user-reported | None used in this file |
| Needs testing | Output quality, production readiness, security, cost benchmark, enterprise governance |

