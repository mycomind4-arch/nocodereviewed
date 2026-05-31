# 25 — Appsmith Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — official AI, pricing, docs, security, SOC 2, and 2026 security-advisory sources found; hands-on internal-tool, permission, and agent testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | Appsmith / Appsmith AI / Appsmith Agents |
| Vendor / maintainer | Appsmith, Inc. |
| Product category | Open-source low-code internal app platform with AI integrations and agent capabilities |
| Primary user | Developers, engineering teams, IT, operations, support, sales, and enterprise teams building internal tools and AI-powered business apps |
| Core posture | Build internal applications using widgets, datasources, queries, JavaScript, AI integrations, and optional self-hosting / enterprise controls |
| Current evidence confidence | High for official product positioning, pricing page, Appsmith AI docs, security docs, and SOC 2 announcement; medium for Appsmith Agents because source lives on separate Appsmith AI docs domain; low for production quality and agent safety because no NoCodeReviewed hands-on testing exists yet |

## 2) Official Positioning

Appsmith’s homepage positions the product as an open-source low-code application platform for building custom applications more quickly and securely.

Source URL: https://www.appsmith.com/  
Source type: Official homepage  
Accessed: May 30, 2026

Appsmith docs describe Appsmith as an open-source developer tool for rapidly developing internal applications such as dashboards, database GUIs, admin panels, approval apps, and customer support tools.

Source URL: https://docs.appsmith.com/  
Source type: Official documentation  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| Appsmith is an open-source low-code application platform | Official homepage | https://www.appsmith.com/ | May 30, 2026 | Safe if attributed |
| Appsmith docs describe rapid development of dashboards, database GUIs, admin panels, approval apps, and customer support tools | Official docs | https://docs.appsmith.com/ | May 30, 2026 | Safe if attributed |
| Appsmith supports drag-and-drop widgets, datasources, queries, JavaScript, Git, deploy, and sharing workflows | Official docs | https://docs.appsmith.com/ | May 30, 2026 | Safe if attributed |
| Appsmith AI enables advanced AI features such as text generation, image classification, and sentiment analysis without API keys/datasource authentication | Official docs | https://docs.appsmith.com/connect-data/reference/appsmith-ai | May 30, 2026 | Safe if attributed; output quality must be tested |
| Appsmith AI docs say prompts, outputs, embeddings, and data are not shared with other users and are never used to fine-tune models | Official docs | https://docs.appsmith.com/connect-data/reference/appsmith-ai | May 30, 2026 | Safe if exact wording is preserved |
| Appsmith pricing includes a Free plan for cloud with up to 5 users, 5 workspaces, 3 Git repos, Google SSO, 3 standard roles, public apps, and community support | Official pricing | https://www.appsmith.com/pricing | May 30, 2026 | Safe after final pricing-page recheck |
| Appsmith announced SOC 2 Type II completion on September 29, 2022 | Official blog | https://www.appsmith.com/blog/appsmith-has-been-certified-soc-2-type-ii | May 30, 2026 | Safe if exact scope/current status verified |
| Appsmith security docs say Appsmith encrypts datasource credentials and does not store data returned from datasources | Official docs | https://docs.appsmith.com/connect-data/overview | May 30, 2026 | Safe if attributed |
| Appsmith Trust Center exists for security posture and documentation requests | Official Trust Center | https://security.appsmith.com/ | May 30, 2026 | Safe if attributed |
| Appsmith community post disclosed CVE-2026-22794 affecting older versions | Official/community Appsmith source | https://community.appsmith.com/content/blog/version-192-and-lower-important-security-notice-cve-2026-22794-recent-version-updates | May 30, 2026 | Safe as security-history note; include fixed-version context after verification |

## 4) Pricing Notes

| Pricing item | Price or limit observed | Source | Status |
|---|---:|---|---|
| Free | $0; up to 5 users for cloud; 5 workspaces; 3 Git repos; Google SSO; 3 standard roles; public apps; community support | https://www.appsmith.com/pricing | Official, needs final recheck |
| Paid user-based plans | Pricing page uses user-based pricing and says no extra developer classes | https://www.appsmith.com/pricing | Official, needs full pricing capture |
| Enterprise | Appsmith Enterprise has flexible pricing / demo path | https://www.appsmith.com/enterprise | Sales verification required |
| Self-hosting | Appsmith is open-source and self-hostable according to official positioning/docs | https://www.appsmith.com/ and https://docs.appsmith.com/ | Deployment/security cost requires separate evaluation |
| AI usage | Appsmith AI is documented; exact pricing/usage limits not fully captured in this pass | https://docs.appsmith.com/connect-data/reference/appsmith-ai | Needs pricing/account verification |
| Agents | Appsmith Agents docs exist; pricing/access not captured in this pass | https://docs.appsmithai.com/ | Needs verification |

Pricing status: `official pricing source found — exact paid-tier prices, cloud vs self-host terms, AI usage, agents access, SSO/RBAC/audit features, and enterprise pricing must be captured before publication`.

Pricing caution: Appsmith total cost can include user seats, hosting, self-hosting infrastructure, DevOps/security maintenance, AI usage, LLM providers, enterprise controls, and internal developer time.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Credential handling | Docs say Appsmith encrypts datasource credentials and stores them securely | https://docs.appsmith.com/connect-data/overview | Test cloud/self-host behavior and secrets exposure |
| Returned datasource data | Docs say Appsmith does not store data returned from datasources and acts as a proxy layer | https://docs.appsmith.com/connect-data/overview | Verify logging/caching/export behavior in tests |
| Appsmith AI privacy | Appsmith AI docs say prompts, outputs, embeddings, and data are not used to fine-tune models | https://docs.appsmith.com/connect-data/reference/appsmith-ai | Preserve exact claim; review vendor/model subprocessors if needed |
| SOC 2 Type II | Official 2022 blog says SOC 2 Type II audit was completed | https://www.appsmith.com/blog/appsmith-has-been-certified-soc-2-type-ii | Current report/scope must be verified through Trust Center |
| Security measures | Official docs include a security section and Trust Center | https://docs.appsmith.com/product/security and https://security.appsmith.com/ | Review artifacts before strong claims |
| 2026 CVE | Appsmith community post disclosed CVE-2026-22794 in older versions | https://community.appsmith.com/content/blog/version-192-and-lower-important-security-notice-cve-2026-22794-recent-version-updates | Treat as transparent security-history signal, not proof of current insecurity |
| Self-hosting | Self-hosted deployments depend on customer patching and configuration | Official self-hosting/open-source posture | Include patch-management testing |

Production-readiness summary: Appsmith has strong developer/internal-tool evidence and meaningful security documentation, but Appsmith apps can access databases/APIs and execute business logic. NoCodeReviewed must test RBAC, secrets exposure, query permissions, AI-generated output, self-host patching, auditability, and agent behavior before production-readiness claims.

## 6) Autonomy Notes

Appsmith should be classified as **low-code internal app development with AI integrations and agents**, not as a consumer prompt-to-app builder. Appsmith AI supports AI queries/actions inside apps, while Appsmith Agents appear to support embedded AI assistants connected to data and workflows. Full autonomous operations safety is not verified.

| Autonomy question | Current evidence answer |
|---|---|
| Can Appsmith build internal tools with low code? | Official docs support this |
| Can Appsmith integrate AI features into apps? | Official Appsmith AI docs support this |
| Can Appsmith Agents use knowledge sources/data/workflows? | Appsmith AI docs domain supports this, but access/pricing needs verification |
| Can Appsmith safely automate business workflows autonomously? | Not verified |
| Does self-hosting remove all security concerns? | No — customer patching/configuration remains critical |

## 7) Strengths From Official or Verified Sources Only

- Open-source, self-hostable internal-tool platform positioning.
- Official docs clearly explain core building blocks: widgets, datasources, queries, JavaScript, Git, deploy, and sharing.
- Appsmith AI docs include concrete AI actions and privacy statements.
- Appsmith has an official Trust Center and a SOC 2 Type II announcement.
- Security docs address credential encryption and datasource-data handling.
- Public 2026 CVE disclosure gives a concrete patch-management testing dimension for self-hosted deployments.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| More technical than general no-code builders | Product/docs positioning | Likely best for developers/technical teams |
| AI-generated output not verified | No hands-on test record | Needs AI-query benchmark |
| Agents access/pricing not captured | Separate docs domain surfaced but pricing unclear | Needs verification |
| Compliance scope requires Trust Center artifacts | SOC 2 blog is from 2022 | Current report needed |
| Self-hosting requires patch management | 2026 CVE source + architecture reasoning | Test versioning/update process |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Retool AI | Closest technical internal-tool/AI workflow platform comparison |
| ToolJet AI | Open-source/internal-tool builder alternative |
| UI Bakery AI | Low-code internal app builder with AI features |
| Budibase | Open-source low-code internal app platform |
| Softr AI / Glide AI | Less technical portal/internal-tool alternatives |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. Appsmith is an open-source low-code platform for building internal applications.
2. Appsmith apps are built from widgets, datasources, queries, JavaScript, and deployment/sharing workflows.
3. Appsmith AI docs describe AI features including text generation, image classification, and sentiment analysis.
4. Appsmith AI docs say prompts, outputs, embeddings, and data are not shared with other users and are not used to fine-tune models.
5. Appsmith announced completion of a SOC 2 Type II audit in 2022 and maintains a Trust Center.
6. Appsmith disclosed a 2026 security vulnerability affecting older versions, which makes patch-management review important for self-hosted customers.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Appsmith AI is production-ready for sensitive workflows” | AI output and privacy/subprocessor handling need validation | AI benchmark + security review |
| “Appsmith apps are secure by default” | App security depends on permissions, data sources, business logic, hosting | RBAC/secrets/query tests |
| “Appsmith is SOC 2 Type II compliant today” | 2022 blog needs current artifact verification | Trust Center report review |
| “Appsmith Agents safely automate workflows” | Agent behavior/blast radius untested | Agent benchmark with approvals/logs |
| “Self-hosting is safer than cloud” | Depends on customer patching, infra, monitoring | Deployment/security benchmark |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Internal app build | Build admin dashboard on test database | App reads/writes records correctly |
| 2 | RBAC test | Create admin/editor/viewer roles | Each role has intended access only |
| 3 | Secrets test | Connect database/API credentials | Credentials are not exposed in client UI/logs |
| 4 | AI query test | Use Appsmith AI to classify/summarize records | Outputs meet accuracy threshold and are reviewable |
| 5 | Prompt-injection test | Feed malicious user content into AI query | App does not expose hidden context or secrets |
| 6 | Self-host patch test | Deploy older/non-current test instance in safe environment and review update process | Update guidance and version checks documented |
| 7 | Audit/logging test | Inspect change and query logs where available | Actor/time/action traceability documented |
| 8 | Agent test | Build small Appsmith Agent workflow if accessible | Agent respects role/data boundaries |
| 9 | Cost tracking | Record seats, hosting, AI, and agent costs | Cost table completed |
| 10 | Comparison | Repeat internal-tool benchmark in Retool and ToolJet | Comparative evidence table produced |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | Appsmith homepage, Appsmith docs, Appsmith AI docs, Appsmith pricing page, Appsmith security docs, Appsmith Trust Center, Appsmith SOC 2 blog, Appsmith CVE community/security post, Appsmith Agents docs domain |
| Reputable third-party | None used in this file |
| Anecdotal/user-reported | None used in this file |
| Needs testing | Internal-tool build quality, RBAC, secrets exposure, AI output, prompt injection, agent safety, self-host patching, pricing/cost benchmark |

