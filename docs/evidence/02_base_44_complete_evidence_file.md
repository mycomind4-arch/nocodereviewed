# 02 — Base44 Complete Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — complete official-source evidence file drafted; hands-on security, permission, cost, and generated-app testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | Base44 |
| Vendor / maintainer | Base44 |
| Product category | AI-powered no-code/full-stack app builder with integrated backend, database, auth, hosting, payments, email, and security controls |
| Primary user | Nontechnical founders, PMs, operators, agencies, SMBs, educators, and enterprise teams building business apps without assembling separate infrastructure |
| Core posture | Turns natural-language prompts into functional apps with built-in backend/database/auth and visual editing, plus security scanning and enterprise controls |
| Current evidence confidence | High for official positioning, pricing-page plan inclusions, security docs, Trust Center claims, and data-residency/security-scan docs; low for generated-app quality and production security until NoCodeReviewed hands-on testing is complete |

## 2) Official Positioning

Base44’s homepage says:

> “Turn your ideas into apps.”

and says Base44 lets users build fully functional apps in minutes with just words and no coding.

Source URL: https://base44.com/  
Source type: Official homepage  
Accessed: May 30, 2026

Base44’s pricing page says every plan includes AI-powered app building, integrated backend and database system, responsive visual editor, analytics dashboard, multi-user editing/collaboration, cloud storage, authentication/user management, payment processing, email marketing tools, and debugging/troubleshooting tools.

Source URL: https://base44.com/pricing  
Source type: Official pricing page  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| Base44 lets users build fully functional apps in minutes with natural language | Official homepage | https://base44.com/ | May 30, 2026 | Safe if attributed; quality requires testing |
| Base44 includes an AI-powered app-building workflow | Official pricing | https://base44.com/pricing | May 30, 2026 | Safe if attributed |
| Every Base44 plan includes integrated backend and database system | Official pricing | https://base44.com/pricing | May 30, 2026 | Safe if attributed; capacity limits require pricing capture |
| Every Base44 plan includes responsive visual editor and analytics dashboard | Official pricing | https://base44.com/pricing | May 30, 2026 | Safe if attributed |
| Every Base44 plan includes authentication and user management | Official pricing | https://base44.com/pricing | May 30, 2026 | Safe if attributed; auth behavior must be tested |
| Every Base44 plan includes payment processing and email marketing tools | Official pricing | https://base44.com/pricing | May 30, 2026 | Safe if attributed; processor/email terms require testing |
| Base44 features page describes Discussion Mode for brainstorming/planning without affecting the live app | Official features | https://base44.com/features | May 30, 2026 | Safe if attributed |
| Base44 features page says users can add AI-powered features such as chatbots, predictive insights, and automation | Official features | https://base44.com/features | May 30, 2026 | Safe if attributed; outputs require testing |
| Base44 privacy/security docs say user management and authentication are built in using industry-standard encryption/security practices | Official docs | https://docs.base44.com/Community-and-support/Privacy-and-security | May 30, 2026 | Safe if attributed; avoid overclaiming |
| Base44 privacy/security docs say Base44 is SOC 2 Type II compliant and ISO 27001 certified | Official docs | https://docs.base44.com/Community-and-support/Privacy-and-security | May 30, 2026 | Safe if exact scope/certification verified |
| Base44 Trust Center says Base44 is SOC 2 Type II and ISO 27001 certified and follows GDPR standards | Official Trust Center | https://base44.com/security | May 30, 2026 | Safe if scope is stated and report/certificate reviewed |
| Base44 security overview says users are responsible for app security settings and should review permissions and run a security scan before publishing | Official docs | https://docs.base44.com/Setting-up-your-app/security-overview | May 30, 2026 | Safe and important |
| Base44 security overview describes app visibility, data access rules, security scan, package vulnerability scanning, exposed credentials detection, SSO, and enterprise controls | Official docs | https://docs.base44.com/Setting-up-your-app/security-overview | May 30, 2026 | Safe if attributed and plan-qualified |
| Base44 docs describe data residency controls on Elite and Enterprise plans, with EU/UK/US options | Official docs | https://docs.base44.com/Setting-up-your-app/security-overview and https://docs.base44.com/Community-and-support/Privacy-and-security | May 30, 2026 | Safe if plan-qualified |
| Base44 application security blog describes app visibility, built-in auth, RBAC, RLS, and field-level-security concepts | Official blog | https://base44.com/blog/application-security | May 30, 2026 | Safe as vendor guidance; hands-on validation required |

## 4) Pricing Notes

| Pricing item | Evidence note | Source | Status |
|---|---|---|---|
| Free / entry path | Pricing page exists and emphasizes plan inclusions; exact free/paid credits need final capture | https://base44.com/pricing | Needs final pricing capture |
| Included infrastructure | Pricing page says every plan includes AI app building, backend/database, editor, analytics, collaboration, cloud storage, auth, payments, email, debugging | https://base44.com/pricing | Official; capacity/limit details must be captured |
| Message/integration credits | Pricing likely uses credits; exact plan amounts not safely captured in this pass | https://base44.com/pricing | Unknown — needs verification |
| Elite / Enterprise data residency | Security docs say data residency controls are on Elite and Enterprise plans | https://docs.base44.com/Setting-up-your-app/security-overview | Official; exact tier price requires capture |
| Enterprise controls | Security docs mention SSO, enterprise controls, compliance practices | https://docs.base44.com/Setting-up-your-app/security-overview | Sales/plan verification required |
| Payments/email | Included as product capabilities, but processor/email fees and limits may apply | https://base44.com/pricing | Needs testing and terms review |

Pricing status: `official pricing page found, but exact tier matrix must be captured before publication — prices, message credits, integration credits, app limits, collaborators, storage, database capacity, payment/email limits, data-residency access, SSO, security-scan access, and Enterprise terms remain needs-verification`.

Pricing caution: Base44 bundles many components that are separate add-ons elsewhere, but total cost may depend on message credits, integration credits, workspace/app limits, storage, payment processing, email volume, data residency, team/enterprise controls, and future scaling requirements.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Shared responsibility/app settings | Security overview says users are responsible for app security settings and should review permissions/run security scan before publishing | https://docs.base44.com/Setting-up-your-app/security-overview | Must include prominently |
| App visibility | Docs describe Private, Workspace, and Public-style visibility choices | https://docs.base44.com/Setting-up-your-app/security-overview | Test public/private behavior |
| Data access rules | Docs say users can control who can see or edit each type of app data | https://docs.base44.com/Setting-up-your-app/security-overview | Test row/field/action restrictions |
| Security scan | Docs say scan checks common problems before sharing | https://docs.base44.com/Setting-up-your-app/security-overview | Test detection coverage |
| Package vulnerability scan | Docs say package vulnerability scanning runs as part of security scan | https://docs.base44.com/Setting-up-your-app/security-overview | Validate on seeded vulnerable dependency |
| Exposed credentials detection | Docs say security scan flags API keys/passwords/tokens left where visitors could find them | https://docs.base44.com/Setting-up-your-app/security-overview | Test with seeded fake secret |
| SOC 2 Type II | Docs and Trust Center claim SOC 2 Type II compliance | https://docs.base44.com/Community-and-support/Privacy-and-security and https://base44.com/security | Report scope under NDA likely required |
| ISO 27001 | Docs and Trust Center claim ISO 27001 certification | https://docs.base44.com/Community-and-support/Privacy-and-security and https://base44.com/security | Certificate scope/date must be reviewed |
| GDPR/data residency | Docs mention GDPR and data residency controls, including EU/UK/US options on Elite/Enterprise | https://docs.base44.com/Community-and-support/Privacy-and-security | Plan-specific; do not imply every app is compliant |
| Built-in auth | Docs/blog describe built-in auth/password handling | https://base44.com/blog/application-security | Test auth flows and password reset/session behavior |
| Vibe-coding exposure risk | Axios reported exposed assets across platforms including Base44 | https://www.axios.com/2026/05/07/loveable-replit-vibe-coding-privacy | Use as category risk; verify with Base44-specific tests |

Production-readiness summary: Base44 has the strongest official security-documentation posture among many nontechnical AI app builders, but its own docs still put responsibility on builders to review settings and run scans. NoCodeReviewed should verify RLS/FLS, RBAC, visibility, auth, payments/email, security scans, exposed-secret detection, data residency, and generated app logic before publishing production-ready claims.

## 6) Autonomy Notes

Base44 should be classified as **AI-assisted no-code full-stack app generation with integrated infrastructure**, not a verified autonomous secure-app engineer. Official evidence supports prompt-based app generation, built-in backend/database/auth/payments/email, Discussion Mode, security scans, and data-access controls. It does not prove the AI always chooses correct security rules or production architecture.

| Autonomy question | Current evidence answer |
|---|---|
| Can Base44 generate apps from natural language? | Official homepage supports this |
| Does Base44 bundle backend/database/auth? | Official pricing supports this |
| Can Base44 discuss/plan without changing the live app? | Official features page supports Discussion Mode |
| Does Base44 provide security scanning? | Official security docs support this |
| Can Base44 guarantee app security without review? | No; official docs say users must review security settings and run scans |

## 7) Strengths From Official or Verified Sources Only

- Base44 officially bundles app generation with backend, database, auth, storage, analytics, payments, email, visual editor, collaboration, and debugging/troubleshooting.
- Official security docs explicitly cover app visibility, data access rules, security scans, package vulnerability scanning, and exposed credential detection.
- Official docs and Trust Center claim SOC 2 Type II and ISO 27001, giving clear artifacts to request before publication.
- Base44 documents data residency controls for higher-tier plans.
- Discussion Mode provides a safer planning path than immediately modifying a live app, according to official features page.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| Security still requires user review | Official security overview | Must not say secure automatically |
| Exact pricing matrix not captured | Pricing page found but full tier details not captured | Manual final capture required |
| SOC 2/ISO claims need artifact scope | Trust Center/docs | Request SOC report/certificate details |
| Security scan coverage unknown | No hands-on test | Seeded vulnerability/secret tests required |
| Payment/email processing terms unknown | Pricing page says included, but operational limits/fees not captured | Test and terms review required |
| Public app exposure is a broader category risk | Axios reporting | Include careful category caution |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Lovable | Prompt-to-app builder with Supabase-style backend workflows |
| Replit Agent | Agentic prompt-to-app builder with cloud IDE/deployment |
| Bolt.new | Prompt-to-code browser app builder with hosting/database direction |
| Bubble AI | No-code app builder with deeper visual workflow/database model |
| Glide AI | Data-backed no-code business app builder with AI features |
| Softr AI | Portal/internal-tool builder with AI app generation |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. Base44 positions itself as an AI-powered platform for turning natural-language ideas into apps.
2. Base44 pricing says every plan includes AI app building, integrated backend/database, visual editor, analytics, collaboration, cloud storage, authentication/user management, payments, email marketing, and debugging/troubleshooting tools.
3. Base44’s security overview says users are responsible for app security settings and should review permissions and run a security scan before publishing.
4. Base44 security docs describe app visibility, data access rules, security scans, package vulnerability scanning, and exposed-credential detection.
5. Base44 claims SOC 2 Type II and ISO 27001 certification in official docs/Trust Center.
6. Base44 data-residency controls are plan-specific, with Elite/Enterprise references in official docs.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Base44 creates production-ready apps automatically” | Generated logic/security untested | Hands-on benchmark app |
| “Base44 apps are secure by default” | Official docs say users must review settings | RBAC/RLS/FLS/auth/security scan tests |
| “Base44’s security scan catches common mistakes” | Coverage unknown | Seeded vulnerability and fake-secret tests |
| “SOC 2/ISO covers all app-builder use cases” | Scope/report/certificate needed | Trust Center artifacts under NDA |
| “Base44 is cheaper because add-ons are included” | Credits, storage, payments, email, and scaling limits unknown | Standard cost benchmark |
| “Payment/email features are ready for production” | Processor/email compliance and limits unknown | Payment/email test and terms review |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Prompt-to-app build | Ask Base44 to create a CRM/client portal or marketplace app | App includes coherent screens, data, auth, and basic workflows |
| 2 | Discussion Mode | Plan feature without applying changes | No live app changes occur until explicitly accepted |
| 3 | Built-in auth | Create user signup/login/password reset | Auth flow works and sessions behave correctly |
| 4 | RBAC/RLS/FLS | Create admin/member/client roles and private records | Users see/edit only authorized records/fields/actions |
| 5 | Visibility settings | Test Private, Workspace, and Public-style app settings | Access behavior matches selected visibility |
| 6 | Security scan | Run scan on baseline and intentionally weak app | Findings are specific and actionable |
| 7 | Exposed credentials | Seed fake API key in unsafe location | Scan flags the fake secret |
| 8 | Package vulnerability | Add known vulnerable dependency in safe test app | Scan flags relevant severity |
| 9 | Payments/email | Configure test payment and transactional email flow | Test mode works; fees/limits documented |
| 10 | Data residency | Verify region controls on eligible plan or docs/account | Available regions and plan gates documented |
| 11 | Cost tracking | Record messages/credits/integrations/storage/email/payment usage | Cost-per-build and monthly benchmark table complete |
| 12 | Comparison | Repeat benchmark in Replit, Lovable, and Bolt | Comparative evidence table created |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | Base44 homepage, pricing page, features page, privacy/security docs, security overview docs, Trust Center, application security blog, “What is Base44?” blog |
| Reputable third-party | Axios May 2026 vibe-coding exposure article |
| Anecdotal/user-reported | None used as evidence in this file |
| Needs testing | Prompt-to-app quality, Discussion Mode behavior, auth, RBAC/RLS/FLS, visibility settings, security scan, exposed secrets, package vulnerabilities, payment/email, data residency, credits/costs |

