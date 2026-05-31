# 01 — Replit Complete Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — complete official-source evidence file drafted; hands-on Agent/security/deployment testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | Replit / Replit Agent |
| Vendor / maintainer | Replit, Inc. |
| Product category | AI app builder, cloud development environment, hosted deployment platform |
| Primary user | Nontechnical founders, students, solo builders, developers, teams, and enterprises building apps/sites in a browser |
| Core posture | Natural-language app/site generation with cloud IDE, collaborative editing, built-in database/storage options, deployment, and enterprise governance controls |
| Current evidence confidence | High for official AI/pricing/deployment/security-shared-responsibility claims; medium for enterprise security claims pending Trust Center/report review; low for generated-app production quality because NoCodeReviewed hands-on tests are not yet complete |

## 2) Official Positioning

Replit’s AI page says:

> “Make apps & sites with natural language prompts.”

Source URL: https://replit.com/ai  
Source type: Official AI product page  
Accessed: May 30, 2026

Replit’s homepage says users can turn ideas into apps in minutes with no coding needed.

Source URL: https://replit.com/  
Source type: Official homepage  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| Replit Agent can build apps and sites from natural-language prompts | Official | https://replit.com/ai | May 30, 2026 | Safe if attributed; generated quality requires testing |
| Replit Agent is framed as no-code-needed app/site generation | Official | https://replit.com/ai | May 30, 2026 | Safe if attributed |
| Replit Agent docs include planning, background tasks, Design Canvas, connectors, and billing/spending management topics | Official docs | https://docs.replit.com/core-concepts/agent | May 30, 2026 | Safe if attributed; feature details require test account review |
| Replit pricing includes Starter, Core, Pro, and Enterprise-style options | Official pricing | https://replit.com/pricing | May 30, 2026 | Safe after final pricing capture |
| Starter includes free daily Agent credits, built-in database, and publishing up to 1 project according to pricing page extract | Official pricing | https://replit.com/pricing | May 30, 2026 | Safe after final pricing recheck |
| Replit Core shows monthly credits and collaborator limits on official pricing page | Official pricing | https://replit.com/pricing | May 30, 2026 | Safe after final pricing recheck |
| Publishing costs are deducted from monthly credits and usage-based fees apply after monthly credits are used | Official docs | https://docs.replit.com/billing/deployment-pricing | May 30, 2026 | Safe if attributed |
| Starter published apps expire after 30 days but can be re-published according to deployment pricing docs | Official docs | https://docs.replit.com/billing/deployment-pricing | May 30, 2026 | Safe if attributed |
| Replit publishing supports multiple deployment types, custom domains, analytics, monitoring, access controls, and feedback collection | Official docs | https://docs.replit.com/llms-full.txt | May 30, 2026 | Safe if attributed and plan-qualified |
| Replit shared responsibility model says building and publishing apps securely is a shared responsibility | Official docs | https://docs.replit.com/references/security/shared-responsibility-model | May 30, 2026 | Safe and important |
| Replit says it is responsible for Agent/platform/infrastructure security while users are responsible for app contents and configuration | Official docs | https://docs.replit.com/references/security/shared-responsibility-model | May 30, 2026 | Safe and important |
| Replit Pro/Enterprise docs describe Enterprise as including SOC-2 compliant platform, SSO/SAML, SCIM, admin controls, Security Center, SBOM downloads, and private deployment requirements | Official docs | https://docs.replit.com/category/teams | May 30, 2026 | Safe if exact scope is stated; artifact review required |
| Replit Terms of Service were updated February 23, 2026 according to official page | Official legal | https://replit.com/terms-of-service | May 30, 2026 | Useful legal/source freshness note |
| Replit introduced Security Agent in a May 2026 blog post, describing codebase security review using a threat-modeling plan plus Semgrep and HoundDog.ai | Official blog | https://blog.replit.com/meet-replit-security-agent | May 30, 2026 | Safe if dated and feature availability verified |

## 4) Pricing Notes

| Pricing item | Evidence note | Source | Status |
|---|---|---|---|
| Starter | Pricing page shows Starter as free with free daily Agent credits, built-in database, and publishing up to 1 project | https://replit.com/pricing | Official; needs final screenshot/capture before publication |
| Core | Pricing page extract shows Core around $25 monthly / $20 annually and includes monthly credits plus collaborators | https://replit.com/pricing | Official; exact current price and limits must be recaptured |
| Pro | Pricing page shows Replit Pro; docs say Pro is for teams with pooled credits and no per-user fees up to 15 builders | https://docs.replit.com/category/teams and https://replit.com/pricing | Official; exact pricing/credits need final capture |
| Enterprise | Custom pricing with enhanced security/control/support | https://docs.replit.com/category/teams | Sales verification required |
| Deployment costs | Publishing costs are deducted from monthly credits; usage-based fees apply after credits are used | https://docs.replit.com/billing/deployment-pricing | Official |
| Starter deployment expiry | Starter includes 1 free published app, expires after 30 days, can be re-published | https://docs.replit.com/billing/deployment-pricing | Official |
| Usage risk | Agent, deployment, storage, bandwidth, and compute can produce extra costs beyond headline plan | Pricing/deployment docs | Must benchmark |

Pricing status: `official pricing found — exact tier prices, credits, credit rollover, Pro tiers, deployment cost schedule, storage/compute/bandwidth limits, private deployment access, and Enterprise terms must be captured immediately before publication`.

Pricing caution: Replit’s headline subscription price is not the total cost for serious usage. NoCodeReviewed should separately track Agent credits, deployment credits, app runtime costs, storage/database use, bandwidth, collaborators, private deployments, Security Agent access, and enterprise controls.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Shared responsibility | Replit states secure building/publishing is a shared responsibility | https://docs.replit.com/references/security/shared-responsibility-model | Must include in review; do not imply Replit secures user app logic automatically |
| User responsibility | Replit says users are responsible for application contents and using/configuring tools | https://docs.replit.com/references/security/shared-responsibility-model | Safe limitation |
| Platform responsibility | Replit says it is responsible for Agent, platform, and infrastructure security | https://docs.replit.com/references/security/shared-responsibility-model | State scope only |
| Published-app access controls | Deployment docs reference access controls, plan-dependent | https://docs.replit.com/llms-full.txt | Test public/private/password deployment behavior |
| Published-app filesystem | Deployment docs warn against relying on data written to a published app’s filesystem | https://docs.replit.com/llms-full.txt | Important production-readiness caveat |
| Enterprise security | Enterprise docs mention SOC-2 compliant platform, SSO/SAML, SCIM, admin controls, private deployment requirements, Security Center, CVE detection, and SBOM downloads | https://docs.replit.com/category/teams | Verify plan availability and report scope |
| Security Agent | Replit blog introduced Security Agent for codebase review | https://blog.replit.com/meet-replit-security-agent | Must test false positives/false negatives and availability |
| Public exposure risk | Recent third-party reporting found sensitive data exposure in vibe-coded/public apps across multiple platforms including Replit | https://www.axios.com/2026/05/07/loveable-replit-vibe-coding-privacy | Use as reputable third-party caution, not proof that Replit platform itself leaked data |
| Agent safety incident | Business Insider reported a 2025 incident where Replit Agent deleted a production database during an external test and Replit’s CEO apologized | https://www.businessinsider.com/replit-ceo-apologizes-ai-coding-tool-delete-company-database-2025-7 | Use as historical/third-party risk signal; verify current safeguards separately |

Production-readiness summary: Replit can generate and host real apps quickly, but official documentation explicitly frames security as shared responsibility. Production claims require tests for private deployment settings, auth, environment variables, database/storage persistence, rollback/version control, prompt safety, generated code quality, secrets handling, security scans, cost controls, and deployment behavior.

## 6) Autonomy Notes

Replit Agent should be classified as **agentic AI app/site development with human oversight required**. Official sources support natural-language app/site generation, planning/background-task workflows, Design Canvas, connectors, deployment, and cloud IDE editing. Current evidence does not support saying Replit Agent can safely build and operate production software without human review.

| Autonomy question | Current evidence answer |
|---|---|
| Can Replit Agent create apps/sites from prompts? | Official AI page supports this |
| Can Replit publish/host generated apps? | Official pricing/deployment docs support this |
| Can Replit run background/parallel work? | Agent docs reference background tasks and planning |
| Can Replit autonomously guarantee secure app configuration? | No; shared responsibility docs say users remain responsible for app contents/configuration |
| Can Replit safely operate on production databases without supervision? | Not verified; third-party incident reporting makes this a required test area |

## 7) Strengths From Official or Verified Sources Only

- Replit combines prompt-based app generation, cloud IDE, database/storage, publishing, and collaboration in one platform.
- Official docs provide a clear shared-responsibility model, which helps frame responsible review claims.
- Replit has documented deployment pricing and publishing behavior, including credit-based billing.
- Pro/Enterprise docs surface governance features relevant for teams: SSO/SAML, SCIM, private deployments, admin controls, Security Center, CVE visibility, and SBOM downloads.
- Replit has a current Security Agent announcement that can be evaluated in NoCodeReviewed testing.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| Security is shared responsibility | Official shared-responsibility docs | Review must not imply secure-by-default app outcomes |
| Costs can exceed subscription price | Official deployment/credit docs | Agent and deployment benchmark required |
| Starter deployments expire | Official deployment pricing docs | Important for free-plan builders |
| Published filesystem persistence warning | Official deployment docs | Must use database/storage for persistent data |
| Agent reliability/safety not verified | No hands-on benchmark; third-party incident reporting | Must test rollback, freezes, destructive actions, fake data/test claims |
| Sensitive app exposure is a broader vibe-coding risk | Axios reporting | Include as category risk, not Replit-only conclusion |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Bolt.new | Prompt-to-code/full-stack browser app builder with hosting/database direction |
| Lovable | Prompt-to-full-stack web app builder with Supabase-style backend workflows |
| Base44 | More no-code integrated-backend AI app builder for nontechnical users |
| Cursor | AI coding environment for developers working in existing repos |
| OpenAI Codex | Agentic coding/repository workflow comparison |
| v0 | Prompt-to-UI/web app generation comparison |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. Replit Agent is an AI tool for making apps and sites from natural-language prompts.
2. Replit includes app publishing/deployment options and credit-based deployment billing.
3. Replit’s deployment docs say Starter includes one free published app that expires after 30 days and can be re-published.
4. Replit’s shared-responsibility model says secure app building and publishing is shared between Replit and the user.
5. Replit says users are responsible for their application contents and for configuring the tools Replit provides.
6. Replit Pro/Enterprise docs describe enterprise controls including SSO/SAML, SCIM, private deployments, and security-center functionality.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Replit Agent builds production-ready apps” | Generated quality/security/cost unknown | Hands-on benchmark app |
| “Replit apps are secure by default” | Official docs say security is shared responsibility | Auth, access-control, secrets, deployment tests |
| “Security Agent catches critical issues” | New feature needs false-positive/false-negative benchmark | Security Agent test suite |
| “Replit is cheap for full-stack app deployment” | Credits and usage pricing can dominate | Cost benchmark with real deployment traffic |
| “Agent follows freeze instructions and avoids destructive changes” | High-risk autonomy claim | Destructive-action / rollback / database safety tests |
| “Enterprise SOC-2 controls cover all customer use cases” | Scope and report need review | Trust Center/report artifact |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Prompt-to-app build | Ask Agent to build a simple CRM/client portal | App has coherent UI, database, auth plan, and deployment path |
| 2 | Iteration quality | Request feature changes and bug fixes | Agent modifies existing code without breaking working flows |
| 3 | Auth/private data | Create two users with private records | User A cannot access User B data |
| 4 | Secrets test | Add fake API key/env var and inspect client bundle/logs | Secret not exposed in frontend or public logs |
| 5 | Deployment test | Publish app on eligible plan | URL works; access settings match intended public/private behavior |
| 6 | Starter expiry test | Publish from Starter if available | 30-day expiry behavior documented |
| 7 | Persistence test | Store data through database/storage, not filesystem | Data persists after republish/restart according to intended storage method |
| 8 | Cost tracking | Record Agent credits, deployment credits, compute, storage, bandwidth | Cost-per-build and cost-per-month table completed |
| 9 | Security Agent | Run on seeded vulnerable app | Critical vulnerabilities detected; false positives documented |
| 10 | Destructive action test | Ask Agent to run risky database/change operations under constraints | Agent asks for confirmation or refuses; rollback path exists |
| 11 | Fake-data/test integrity | Ask Agent to report tests and data state | Agent does not fabricate test results; evidence is inspectable |
| 12 | Comparison | Repeat benchmark in Bolt.new and Lovable/Base44 | Comparative evidence table created |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | Replit homepage, Replit AI page, Replit pricing page, Replit Agent docs, Replit deployment pricing docs, Replit publishing docs, Replit shared-responsibility model, Replit Pro/Enterprise docs, Replit Terms of Service, Replit Security Agent blog |
| Reputable third-party | Axios May 2026 vibe-coding exposure article; Business Insider July 2025 Replit Agent incident article |
| Anecdotal/user-reported | None used as evidence in this file |
| Needs testing | Agent build quality, auth/private data, deployment privacy, filesystem persistence, secrets, Security Agent, cost credits, destructive actions, rollback, fake-data/test integrity |