# 04 — Lovable Complete Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — complete official-source evidence file drafted; security, generated-code, Supabase/auth, deployment, and cost testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | Lovable |
| Vendor / maintainer | Lovable |
| Product category | Full-stack AI app builder / prompt-to-web-app platform |
| Primary user | Founders, product teams, designers, no-code builders, agencies, and developers building web apps and prototypes with natural language |
| Core posture | Build, iterate, and deploy web applications using natural language, real code, integrations, and enterprise governance claims |
| Current evidence confidence | High for official positioning and pricing-page existence; medium for security/governance claims pending artifact review; low for generated-app production security until NoCodeReviewed hands-on tests are complete |

## 2) Official Positioning

Lovable documentation describes Lovable as:

> “a full-stack AI development platform for building, iterating on, and deploying web applications using natural language, with real code, security, and enterprise governance.”

Source URL: https://docs.lovable.dev/introduction/welcome  
Source type: Official documentation  
Accessed: May 30, 2026

Lovable’s pricing page frames the product around building apps, internal tools, and prototypes faster.

Source URL: https://lovable.dev/pricing  
Source type: Official pricing page  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| Lovable is a full-stack AI development platform for building, iterating on, and deploying web applications using natural language | Official docs | https://docs.lovable.dev/introduction/welcome | May 30, 2026 | Safe if attributed; generated quality requires testing |
| Lovable works with real code according to official docs | Official docs | https://docs.lovable.dev/introduction/welcome | May 30, 2026 | Safe if attributed; code quality requires testing |
| Lovable positions pricing around apps, internal tools, and prototypes | Official pricing | https://lovable.dev/pricing | May 30, 2026 | Safe after final pricing capture |
| Lovable has plan/pricing information for individuals and teams | Official pricing | https://lovable.dev/pricing | May 30, 2026 | Safe after final pricing capture |
| Lovable publishes official documentation for product onboarding and app-building workflows | Official docs | https://docs.lovable.dev/ | May 30, 2026 | Safe if attributed |
| Lovable can be abused to create malicious websites according to Proofpoint reporting summarized by TechRadar | Reputable third-party | https://www.techradar.com/pro/security/top-ai-website-builder-lovable-hit-in-worrying-cyberattack-heres-what-we-know | May 30, 2026 | Use as risk context, not product-capability proof |
| Business Insider reported an April 2026 Lovable visibility/security controversy involving public-project code/chat visibility and user concern | Reputable third-party | https://www.businessinsider.com/lovable-security-access-vibe-coding-projects-risk-2026-4 | May 30, 2026 | Use as security-history context; verify current controls |

## 4) Pricing Notes

| Pricing item | Evidence note | Source | Status |
|---|---|---|---|
| Official pricing page | Lovable maintains a pricing page for individuals and teams | https://lovable.dev/pricing | Official; exact tier capture required |
| Free / starter path | Likely available from pricing, but exact current limits were not safely captured in this pass | https://lovable.dev/pricing | Unknown — needs final verification |
| Paid individual plans | Pricing page exists; exact monthly/annual prices, credits, private projects, integrations, and deployment limits must be captured | https://lovable.dev/pricing | Needs verification |
| Team / business plans | Pricing page describes individual/team plan selection | https://lovable.dev/pricing | Needs verification |
| Usage/credits | Lovable is commonly credit/message based, but exact current rules must come from pricing/account screen | https://lovable.dev/pricing | Unknown — needs verification |
| Supabase / external services | Full-stack app workflows may require Supabase, Stripe, domains, storage, or other services | Product architecture/testing need | Needs benchmark |

Pricing status: `official pricing page found — exact tier prices, message/credit rules, private projects, collaborators, app limits, integrations, custom domains, deployment limits, commercial terms, and enterprise governance pricing must be captured immediately before publication`.

Pricing caution: Lovable’s real cost may include subscription, message/credit usage, Supabase/database, domain, payment processing, email, storage, file uploads, analytics, and third-party API costs.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Full-stack scope | Official docs call Lovable full-stack | https://docs.lovable.dev/introduction/welcome | Full-stack generation increases auth/database/security testing needs |
| Real code | Official docs say real code | https://docs.lovable.dev/introduction/welcome | Code must be reviewed, built, exported, and tested |
| Enterprise governance | Official docs mention enterprise governance | https://docs.lovable.dev/introduction/welcome | Verify exact plan controls and artifacts |
| Malicious-site abuse | TechRadar/Proofpoint reporting says Lovable has been abused for phishing/malware/fraud sites | TechRadar article | Category/security moderation risk, not proof typical users are unsafe |
| Visibility/security controversy | Business Insider reported public-project visibility concern in 2026 | Business Insider article | Verify current visibility settings and defaults |
| Supabase/database security | Lovable apps commonly need backend/auth/data rules; official doc source not fully captured in this pass | Needs hands-on and official docs | Test RLS, auth, secrets, public routes |
| Generated app claims | Official positioning is broad | Official docs/pricing | Do not say production-ready without benchmark |

Production-readiness summary: Lovable is positioned as a full-stack natural-language app builder, which makes it powerful but also security-sensitive. NoCodeReviewed should test generated code, auth, database permissions, public/private visibility, secrets, deployment, dependency risk, export/GitHub workflows, and cost before publication.

## 6) Autonomy Notes

Lovable should be classified as **AI-assisted full-stack web-app generation with human oversight required**. Official sources support natural-language building, iteration, deployment, real code, and enterprise-governance positioning. Current evidence does not prove Lovable can safely design secure production apps without human review.

| Autonomy question | Current evidence answer |
|---|---|
| Can Lovable build web apps from natural language? | Official docs support this |
| Can Lovable iterate and deploy apps? | Official docs support this |
| Does it generate real code? | Official docs support this |
| Can it guarantee secure data/auth defaults? | Not verified |
| Can it prevent misuse or public exposure in all cases? | Not verified; third-party reporting makes this a required test area |

## 7) Strengths From Official or Verified Sources Only

- Lovable has direct official positioning as a full-stack AI development platform.
- Official docs emphasize real code, which gives reviewers an inspectable artifact.
- Pricing and documentation are public and can be rechecked before publication.
- Lovable is a strong comparison candidate for Replit Agent, Bolt.new, Base44, Bubble AI, and v0 because it sits between no-code prompt generation and code-based app generation.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| Exact pricing not captured | Pricing page found but current matrix not extracted | Final capture required |
| Production security unverified | No hands-on test record | Test auth/RLS/secrets/public visibility |
| Third-party security concerns exist | TechRadar/Proofpoint and Business Insider reporting | Treat carefully as risk/history, not blanket indictment |
| Enterprise governance scope unknown | Official docs mention governance | Trust/security review needed |
| Generated code maintainability unknown | No benchmark | Code review/export/local build required |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Replit Agent | Similar prompt-to-app plus deployment workflow |
| Bolt.new | Similar browser-based prompt-to-code web app builder |
| Base44 | More bundled no-code backend/auth/payment alternative |
| Bubble AI | No-code visual app builder alternative |
| v0 | React/Next.js UI/app generation comparison |
| Cursor | Developer IDE comparison for modifying generated code |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. Lovable describes itself as a full-stack AI development platform for building, iterating on, and deploying web applications using natural language.
2. Lovable official docs say the platform works with real code.
3. Lovable has official pricing for individuals and teams.
4. Lovable should be reviewed as a full-stack AI web-app builder, not just a static website generator.
5. Third-party security reporting makes public/private visibility, abuse prevention, and generated-app security important testing areas.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Lovable builds production-ready apps” | Generated quality/security untested | Hands-on app benchmark |
| “Lovable apps are secure by default” | Auth/database/visibility defaults need proof | RLS/auth/secrets/public visibility tests |
| “Lovable is cheaper than Bolt/Replit/Base44” | Pricing depends on credits and third-party infrastructure | Standard cost benchmark |
| “Enterprise governance is sufficient for regulated teams” | Governance scope/artifacts unknown | Trust/security artifact review |
| “Real code means no lock-in” | Export/build/maintenance not verified | GitHub/export/local build test |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Prompt-to-app build | Create CRM/client portal with auth and private records | Coherent app, routes, database schema, and UI generated |
| 2 | Iteration | Add feature and fix bug | Changes are localized and do not break prior flows |
| 3 | Code inspection | Review generated code structure | Code is understandable, buildable, and not obviously duplicated |
| 4 | Auth | Create signup/login/password reset if supported | Auth works; protected pages require login |
| 5 | Data privacy | Create two users with private records | User A cannot read/update User B data |
| 6 | Secrets | Add fake API key/env var | Secret is not exposed client-side or in public logs |
| 7 | Visibility | Test public/private project and app settings | Code/chats/data visibility matches expectations |
| 8 | Deployment | Publish on eligible plan | App works and access settings are documented |
| 9 | Export/GitHub | Export or sync code | Project builds locally or in target repo |
| 10 | Cost tracking | Track prompts/credits and third-party services | Cost table completed |
| 11 | Abuse/moderation | Attempt disallowed phishing-like prompt safely without publishing | Tool refuses or blocks unsafe use |
| 12 | Comparison | Repeat benchmark in Replit, Bolt, and Base44 | Comparative evidence table completed |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | Lovable docs, Lovable pricing page |
| Reputable third-party | TechRadar/Proofpoint Lovable abuse reporting; Business Insider Lovable security/visibility reporting |
| Anecdotal/user-reported | None used directly as publishable evidence |
| Needs testing | Prompt-to-app quality, auth/RLS, public/private visibility, code export, deployment, secrets, cost, abuse prevention, enterprise governance |

