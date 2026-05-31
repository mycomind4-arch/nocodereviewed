# 03 — Bolt.new Complete Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — complete official-source evidence file drafted; hands-on token, database security, generated-code, deployment, and export testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | Bolt.new / Bolt |
| Vendor / maintainer | StackBlitz, Inc. |
| Product category | AI-powered website/app/prototype builder and browser-based development environment |
| Primary user | Solo builders, students, agencies, product teams, frontend/full-stack developers, and teams building web apps in a browser |
| Core posture | Prompt-to-web-app/site/prototype generation with browser IDE, live runtime, token-based AI usage, hosting/database features, and team/enterprise controls |
| Current evidence confidence | High for official positioning, pricing-page existence, token-based plan language, WebContainers relationship, and database-security docs; medium for enterprise/security claims pending artifact review; low for generated-code production readiness until NoCodeReviewed hands-on testing is complete |

## 2) Official Positioning

Bolt’s homepage says:

> “Build and scale high-performing websites & apps using your words.”

Source URL: https://bolt.new/  
Source type: Official homepage  
Accessed: May 30, 2026

StackBlitz’s homepage says Bolt is powered by WebContainers, which run development environments securely within the browser tab.

Source URL: https://stackblitz.com/  
Source type: Official StackBlitz platform page  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| Bolt lets users build websites, apps, and prototypes using words | Official homepage | https://bolt.new/ | May 30, 2026 | Safe if attributed; quality requires testing |
| Bolt supports agencies, students, and builders as stated use-case audiences | Official homepage | https://bolt.new/ | May 30, 2026 | Safe if attributed |
| Bolt pricing includes public/private projects, no daily token limit on paid plans, and monthly token allocations | Official pricing | https://bolt.new/pricing | May 30, 2026 | Safe after final pricing capture |
| Bolt paid pricing page references website hosting, web request limits, custom domains, SEO boosting, databases, database provider choice, and AI image editing | Official pricing | https://bolt.new/pricing | May 30, 2026 | Safe if attributed and plan-qualified |
| Teams plan is priced per member and includes centralized billing/team access management-type controls | Official pricing | https://bolt.new/pricing | May 30, 2026 | Safe after final pricing capture |
| Enterprise plan is custom and includes advanced security, compliance, SSO, audit logs, admin controls, data governance/retention policies, custom workflows/integrations/SLAs, and priority support | Official pricing | https://bolt.new/pricing | May 30, 2026 | Safe if attributed; artifact/scope review required |
| Bolt database security settings identify vulnerabilities such as missing RLS policies and insecure permissions | Official support docs | https://support.bolt.new/cloud/database/security | May 30, 2026 | Safe if attributed; detection coverage requires testing |
| Bolt database Security Audit examples include RLS Policy Always True, Function Search Path Mutable, and Leaked Password Protection Disabled | Official support docs | https://support.bolt.new/cloud/database/security | May 30, 2026 | Safe if attributed |
| StackBlitz says Bolt is powered by WebContainers, a WebAssembly-based micro operating system that boots development environments in the browser | Official StackBlitz page | https://stackblitz.com/ | May 30, 2026 | Safe if attributed |
| StackBlitz says WebContainers run Node.js/browser dev environments securely within the browser tab | Official StackBlitz page | https://stackblitz.com/ | May 30, 2026 | Safe if attributed; do not overextend to generated-app security |
| StackBlitz pricing says team access can mirror GitHub organization repository permissions for StackBlitz Teams | Official StackBlitz pricing | https://stackblitz.com/pricing | May 30, 2026 | Relevant if Bolt/StackBlitz team workflows overlap; verify product boundary |
| Official open-source bolt.diy repo says it is the official open-source version of Bolt.new and supports choosing LLMs/providers | Official GitHub repository | https://github.com/stackblitz-labs/bolt.diy | May 30, 2026 | Safe if distinguished from hosted Bolt.new |

## 4) Pricing Notes

| Pricing item | Evidence note | Source | Status |
|---|---|---|---|
| Free | Free use exists from Bolt homepage/pricing path; exact free token limits need final capture | https://bolt.new/ and https://bolt.new/pricing | Needs final pricing capture |
| Pro | Pricing page extract references paid plan features including no daily token limit, starting monthly token allocation, hosting, custom domains, databases, and AI image editing | https://bolt.new/pricing | Official; exact price/tokens/features need final capture |
| Teams | Pricing extract shows Teams at $30 per month/member billed monthly and team-management features | https://bolt.new/pricing | Official; exact current price and annual discount need recapture |
| Enterprise | Custom pricing with advanced security/compliance/support | https://bolt.new/pricing | Sales verification required |
| Tokens | Paid plans use token allocations; pricing page FAQ has token explanation | https://bolt.new/pricing | Need token accounting benchmark |
| Hosting/web requests | Pricing page references website hosting and up to 1M web requests in extract | https://bolt.new/pricing | Plan-specific; needs final capture |
| Databases | Pricing page references unlimited databases, expanded database capacity, and database provider choice | https://bolt.new/pricing | Plan-specific; needs capacity/security testing |
| Rollovers | Pricing extract says unused tokens roll over to next month | https://bolt.new/pricing | Verify exact rollover duration and plan rules |
| StackBlitz pricing | StackBlitz has separate pricing for browser IDE/team workflows | https://stackblitz.com/pricing | Do not merge with Bolt pricing without verification |

Pricing status: `official pricing source found — exact free/Pro/Teams/Enterprise prices, token limits, daily limits, rollover rules, hosting requests, database capacity, file upload limits, private sharing, custom domains, SEO features, AI image editing, seats, and enterprise controls must be captured immediately before publication`.

Pricing caution: Bolt cost depends heavily on token consumption during generation/debugging/refinement plus hosting, database, request volume, storage, custom domains, team seats, and any external services such as Stripe, Supabase, Netlify, GitHub, or APIs.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Browser runtime security | StackBlitz says WebContainers run development environments securely in the browser tab | https://stackblitz.com/ | This supports dev-environment isolation, not app-code security |
| Database security settings | Bolt docs describe database Security settings and Security Audit | https://support.bolt.new/cloud/database/security | Must test if generated apps configure RLS correctly |
| RLS warnings | Docs say security settings can identify missing RLS policies and insecure permissions | https://support.bolt.new/cloud/database/security | Strong test target |
| Leaked password protection warning | Docs list Leaked Password Protection Disabled as warning example | https://support.bolt.new/cloud/database/security | Verify with database provider setup |
| Enterprise controls | Pricing page says Enterprise includes SSO, audit logs, compliance support, admin controls, data governance/retention, and SLAs | https://bolt.new/pricing | Artifact/scope review required |
| Tokens/debugging | Pricing uses token model; repeated debugging can increase consumption | https://bolt.new/pricing | Track benchmark token spend |
| Generated code ownership/export | Bolt produces code in a browser IDE; bolt.diy exists as official open-source variant | https://bolt.new/ and https://github.com/stackblitz-labs/bolt.diy | Test code export/GitHub/local build |
| Public/private projects | Pricing page references public/private projects and private site sharing | https://bolt.new/pricing | Test project/site privacy and sharing URLs |

Production-readiness summary: Bolt is compelling for fast web app scaffolding because the user can inspect code in a browser IDE and use built-in hosting/database features. But NoCodeReviewed should not publish production-ready claims until it tests generated code quality, RLS/database security, secret handling, private sharing, token usage, deployment stability, dependency management, export/local build, and security audit coverage.

## 6) Autonomy Notes

Bolt.new should be classified as **AI-assisted prompt-to-code web app/site generation with browser IDE control**, not a fully autonomous secure software engineer. Official evidence supports natural-language app/site generation, WebContainers runtime, token-based AI usage, hosting/database features, database security audit docs, and team/enterprise controls. It does not prove Bolt can automatically configure secure production backends or maintain generated apps without developer review.

| Autonomy question | Current evidence answer |
|---|---|
| Can Bolt generate websites/apps from prompts? | Official homepage supports this |
| Does Bolt run in a browser-based dev environment? | StackBlitz WebContainers source supports this |
| Does Bolt include database security checks? | Official Bolt support docs support this |
| Does Bolt use token-based AI pricing? | Official pricing page supports this |
| Can Bolt autonomously secure generated database permissions? | Not verified |
| Can Bolt guarantee generated app quality? | Not verified |

## 7) Strengths From Official or Verified Sources Only

- Bolt has clear official positioning around building websites, apps, and prototypes from words.
- StackBlitz WebContainers provide a strong technical differentiator for in-browser development environments.
- Bolt’s pricing page surfaces concrete production-adjacent features: hosting, custom domains, databases, database provider choice, SEO boosting, and AI image editing.
- Official support docs include database security/RLS audit concepts, which gives NoCodeReviewed concrete security checks to test.
- Enterprise pricing language includes security/compliance/admin-control concepts relevant to teams.
- bolt.diy provides an official open-source-adjacent path, but it must be reviewed separately from the hosted product.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| Token costs are hard to judge without testing | Pricing model | Benchmark generation/debugging/refinement cost |
| Database security audit coverage unknown | Docs show feature, not benchmark result | Seeded RLS/security tests required |
| WebContainer security is not app security | Architecture distinction | Do not overclaim secure generated apps |
| Exact pricing matrix not fully captured | Pricing page extract | Manual final capture needed |
| Generated code maintainability unknown | No hands-on test record | Build/test/source-review benchmark required |
| Enterprise controls need scope verification | Pricing language | Trust/security artifact review required |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Replit Agent | Closest browser/cloud AI app builder with hosting/deployment |
| Lovable | Prompt-to-full-stack app builder with Supabase-style workflows |
| Base44 | More integrated no-code backend/auth/payment app builder |
| v0 | AI UI/web app generation comparison, especially React/Next.js |
| Cursor | Developer IDE agent comparison for existing codebases |
| StackBlitz | Underlying browser IDE/platform relationship; separate pricing/product boundary |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. Bolt positions itself as an AI builder for websites, apps, and prototypes using natural-language prompts.
2. StackBlitz says Bolt is powered by WebContainers, which run development environments in the browser.
3. Bolt pricing uses token-based AI usage and includes paid plans for higher token allocations.
4. Bolt pricing references hosting, custom domains, databases, database provider choice, and team/enterprise controls.
5. Bolt support docs describe database security settings that identify issues such as missing RLS policies and insecure permissions.
6. Bolt Enterprise pricing language includes advanced security, compliance support, SSO, audit logs, admin controls, data governance/retention, and priority support.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Bolt generates production-ready full-stack apps” | Generated code/database/security untested | Hands-on benchmark app |
| “Bolt automatically configures secure database permissions” | RLS/security docs describe checks, not guaranteed correctness | Seeded RLS/RBAC tests |
| “Bolt is cheaper than Replit/Lovable/Base44” | Token usage and hosting/database costs vary | Standard cost benchmark |
| “WebContainers make Bolt apps secure” | WebContainers isolate dev runtime, not necessarily generated app logic | Security architecture review |
| “Bolt Enterprise is compliant” | Pricing says compliance support but exact certifications unknown | Trust/security artifact review |
| “bolt.diy is equivalent to hosted Bolt.new” | Official repo is separate open-source version | Separate local/hosted comparison |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Prompt-to-app build | Ask Bolt to generate a simple SaaS dashboard/client portal | App has coherent UI, routes, backend/database plan, and working preview |
| 2 | Generated-code review | Inspect file structure, dependencies, components, API routes | Code is understandable, modular, and not obviously duplicated/broken |
| 3 | Debug loop | Introduce/fix known bug with Bolt assistance | Fix works without breaking unrelated files |
| 4 | Database setup | Use built-in database/provider path | Tables/schema are correct and documented |
| 5 | RLS/security audit | Configure public/private records and run database Security settings | Missing/weak RLS warnings appear where expected |
| 6 | Cross-user privacy | Create two users with private records | User A cannot read/update User B data |
| 7 | Secret handling | Add fake API key/env var and inspect browser bundle/logs | Secret is not exposed to client/public output |
| 8 | Deployment/hosting | Publish on eligible plan | Site works; URL/privacy/custom-domain settings documented |
| 9 | Token tracking | Record tokens for initial generation, debugging, design tweaks, deployment fixes | Cost-per-task table completed |
| 10 | Export/local build | Export/sync code and run locally | Project installs, builds, and runs outside Bolt |
| 11 | Enterprise/security review | Check SSO/audit/admin/data-governance claims via docs/demo if available | Feature matrix and artifact gaps documented |
| 12 | Comparison | Repeat benchmark in Replit and Lovable/Base44 | Comparative evidence table completed |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | Bolt homepage, Bolt pricing page, Bolt support database-security docs, StackBlitz homepage/WebContainers positioning, StackBlitz pricing, official bolt.diy GitHub repository |
| Reputable third-party | DevClass October 2024 Bolt/WebContainers article; third-party pricing/review sources used only as context, not safe publication evidence |
| Anecdotal/user-reported | None used as evidence in this file |
| Needs testing | Generated app quality, code maintainability, token usage, RLS/database security, cross-user privacy, secrets, deployment/privacy, export/local build, Enterprise controls, hosted Bolt vs bolt.diy differences |

