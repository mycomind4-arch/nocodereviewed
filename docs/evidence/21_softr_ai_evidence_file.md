# 21 — Softr AI Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — official AI app generator, pricing, security, and SOC 2 sources found; hands-on portal/internal-tool testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | Softr AI / Softr AI Co-Builder |
| Vendor / maintainer | Softr |
| Product category | No-code AI business app builder for portals, internal tools, dashboards, intranets, and data-backed apps |
| Primary user | Nontechnical operations teams, SMBs, agencies, client-portal builders, and teams building internal tools on top of business data |
| Core posture | AI-assisted no-code business app creation with drag-and-drop UI, data-source sync, permissions, portals, dashboards, and internal-tool workflows |
| Current evidence confidence | High for official positioning, pricing-page existence, permissions/security claims, and SOC 2 source; low for generated-app quality and permission correctness because no NoCodeReviewed hands-on test record exists yet |

## 2) Official Positioning

Softr’s homepage says:

> “Build and launch custom AI-powered portals and internal tools in minutes, no code required.”

Source URL: https://www.softr.io/  
Source type: Official homepage  
Accessed: May 30, 2026

Softr’s AI app generator page positions Softr AI Co-Builder as a way to build real business software with AI.

Source URL: https://www.softr.io/ai-app-generator  
Source type: Official AI product page  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| Softr builds AI-powered portals and internal tools without code | Official homepage | https://www.softr.io/ | May 30, 2026 | Safe if attributed |
| Softr can sync with data sources | Official homepage | https://www.softr.io/ | May 30, 2026 | Safe if attributed; specific sources require verification |
| Softr AI Co-Builder is positioned for building real business software with AI | Official AI page | https://www.softr.io/ai-app-generator | May 30, 2026 | Safe if attributed |
| Softr AI page describes custom user groups and advanced permissions | Official AI page | https://www.softr.io/ai-app-generator | May 30, 2026 | Safe if attributed; permission behavior must be tested |
| Softr AI page claims SOC 2 Type II, GDPR compliance, audit logging, and server-side rules | Official AI page | https://www.softr.io/ai-app-generator | May 30, 2026 | Safe only with exact wording and scope caution |
| Softr pricing includes Basic, Professional, Business, and Enterprise framing | Official pricing | https://www.softr.io/pricing | May 30, 2026 | Safe after final pricing-page recheck |
| Softr blog announced SOC 2 certification on March 28, 2024 | Official blog | https://www.softr.io/blog/soc2-certification | May 30, 2026 | Safe if exact type/scope confirmed |

## 4) Pricing Notes

| Tier / pricing item | Price or status observed | Source | Status |
|---|---:|---|---|
| Basic | $49/month shown in search result snippet for official pricing page | https://www.softr.io/pricing | Official pricing page found; exact current price needs final capture |
| Professional | $139/month shown in search result snippet for official pricing page | https://www.softr.io/pricing | Official pricing page found; exact current price needs final capture |
| Business | Plan exists on pricing page | https://www.softr.io/pricing | Needs final capture |
| Enterprise | Enterprise/custom path exists | https://www.softr.io/pricing | Needs sales verification |
| AI-specific usage | Not isolated during this pass | Needs verification | Unknown — needs verification |
| Data-source/integration limits | Not fully captured during this pass | Needs verification | Unknown — needs verification |

Pricing status: `official pricing page found — exact tier prices, app/user limits, data-source limits, permission features, AI usage, and Enterprise terms must be captured immediately before publication`.

Pricing caution: Softr cost can depend on plan tier, internal/external users, number of apps, custom domains, permissions, data sources, integrations, audit logs, and Enterprise requirements.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| SOC 2 | Softr blog says Softr is officially SOC 2 certified; AI page references SOC 2 Type II | https://www.softr.io/blog/soc2-certification and https://www.softr.io/ai-app-generator | Verify exact report, period, and scope before strong compliance claim |
| GDPR | AI app generator page claims GDPR compliance | https://www.softr.io/ai-app-generator | State as vendor claim; verify DPA/privacy docs for production review |
| Audit logging | AI page mentions audit logging | https://www.softr.io/ai-app-generator | Plan and scope must be verified |
| Server-side rules | AI page claims robust server-side rules enforced automatically | https://www.softr.io/ai-app-generator | Critical claim; must test permissions and data exposure |
| User groups/permissions | AI page mentions custom user groups and advanced permissions | https://www.softr.io/ai-app-generator | Must test role-based visibility and actions |
| Data-source sync | Homepage says Softr syncs with data sources | https://www.softr.io/ | Connected-source permissions can create leakage risk if misconfigured |

Production-readiness summary: Softr has strong business-app and permissions positioning, but NoCodeReviewed should not treat permission/security claims as proven until role visibility, field visibility, action permissions, source-data sync, audit logs, and sharing behavior are tested on a realistic app.

## 6) Autonomy Notes

Softr AI is best classified as **AI-assisted no-code business app creation**, not a fully autonomous software engineer. Official evidence supports AI-assisted app generation for portals/internal tools and a no-code editor with permissions. It does not support claims that Softr autonomously validates app security, data permissions, or production readiness.

| Autonomy question | Current evidence answer |
|---|---|
| Can Softr help generate business apps with AI? | Official AI page supports this |
| Is Softr focused on portals/internal tools? | Official homepage supports this |
| Can it enforce permissions? | Official AI page claims this, but testing is required |
| Can it autonomously prove data security? | Not verified |
| Should humans review before publication? | Yes |

## 7) Strengths From Official or Verified Sources Only

- Strong fit for portals, internal tools, dashboards, intranets, and business apps rather than generic websites.
- Official AI app generator page includes concrete governance-relevant concepts: user groups, permissions, audit logging, and server-side rules.
- Official pricing page is available and plan structure is clear enough for follow-up capture.
- Official SOC 2 announcement/source exists.
- Data-source sync is central to Softr’s product positioning, making it useful for Airtable/Google Sheets/database-backed business apps.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| Permission correctness not verified | No hands-on test record | Cross-user/field/action tests required |
| Compliance scope needs artifact review | SOC 2/GDPR vendor claims | Review Trust Center/DPA/security docs before publication |
| AI output quality not verified | No benchmark | Test generated app completeness |
| Pricing details not fully captured | Pricing page found but exact matrix not extracted | Final pricing capture required |
| Connected-data security depends on configuration | Product architecture reasoning | Test data-source sync and visibility rules |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Glide AI | Data-backed no-code app builder with AI columns/actions |
| Stacker | Data-backed portals/internal tools alternative |
| Noloco | Client portal/internal tool builder alternative |
| Bubble AI | Broader no-code app generator with workflows/database |
| Retool AI | More technical internal-tool builder with AI workflows |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. Softr positions itself as a no-code platform for building AI-powered portals and internal tools.
2. Softr’s AI app generator page describes user groups and advanced permissions as part of the product experience.
3. Softr’s pricing page includes Basic, Professional, Business, and Enterprise-style plan framing.
4. Softr has an official SOC 2 certification announcement, and its AI page references SOC 2 Type II and GDPR compliance.
5. Softr should be reviewed as a business-app/portal/internal-tool builder, not as a general autonomous coding agent.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Softr-generated apps are secure by default” | Permissions/data-source sync can be misconfigured | Role, field, action, and data-source access tests |
| “Server-side rules are enforced automatically” | Vendor claim needs hands-on validation | Cross-user access and API inspection where possible |
| “Softr is SOC 2 Type II compliant” | Exact audit scope/report period needed | Trust Center or SOC 2 artifact review |
| “Softr AI builds complete production software” | Generated-app completeness and reliability untested | Benchmark app workflow |
| “Softr is cheaper than Glide/Bubble” | Pricing depends on users, apps, data sources, and features | Standard cost model |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Prompt-to-portal build | Generate client portal or internal tracker | App creates useful pages, data structure, and navigation |
| 2 | Data-source sync | Connect Airtable/Google Sheet/test database | Records sync correctly without unintended exposure |
| 3 | User groups | Configure Admin, Staff, Client roles | Each group sees only intended pages/data/actions |
| 4 | Field-level visibility | Hide sensitive fields from lower roles | Restricted fields are inaccessible, not just hidden visually |
| 5 | Action permissions | Test create/update/delete actions by role | Unauthorized users cannot perform restricted actions |
| 6 | Audit logging | Trigger key events and inspect logs if plan supports it | Relevant events appear with actor/time/action |
| 7 | Public/private sharing | Test invite-only and public routes | Private pages require correct authentication |
| 8 | AI generation quality | Evaluate generated app vs requirements checklist | Missing/incorrect features documented |
| 9 | Cost tracking | Record required plan for benchmark app | Cost table produced |
| 10 | Comparison | Repeat portal brief in Glide and Retool | Comparative evidence table created |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | Softr homepage, Softr AI app generator page, Softr pricing page, Softr SOC 2 certification blog |
| Reputable third-party | None used in this file |
| Anecdotal/user-reported | None used in this file |
| Needs testing | Permission enforcement, field visibility, action restrictions, data-source sync safety, audit logs, AI output quality, pricing benchmark |

