# 16 — Bubble AI Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — official AI, pricing, privacy-rule, and SOC 2 sources found; hands-on app/security testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | Bubble AI / Bubble AI App Generator |
| Vendor / maintainer | Bubble Group, Inc. / Bubble |
| Product category | No-code web and mobile app builder with AI-assisted app generation |
| Primary user | Nontechnical founders, operators, agencies, product teams, and businesses building web/mobile apps without traditional code |
| Core posture | Prompt-assisted no-code app creation inside Bubble’s visual development platform |
| Current evidence confidence | High for official AI-generator positioning, pricing-page existence, privacy-rule docs, and SOC 2 platform claims; low for generated-app quality and security because no NoCodeReviewed hands-on test record exists yet |

## 2) Official Positioning

Bubble’s AI app generator page states:

> “Bubble’s AI app generator lets you build complete apps in minutes.”

Source URL: https://bubble.io/ai-app-generator  
Source type: Official product page  
Accessed: May 30, 2026

Bubble’s manual describes the AI app generator as automating the initial app creation process and delivering a working MVP in minutes.

Source URL: https://manual.bubble.io/help-guides/ai/bubbles-ai-app-generator/about-ai-app-generation  
Source type: Official documentation  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| Bubble AI app generator starts with a text-based prompt and recommended features | Official product page | https://bubble.io/ai-app-generator | May 30, 2026 | Safe if attributed |
| Bubble says users can iterate, deploy, and scale using drag-and-drop visual development | Official product page | https://bubble.io/ai-app-generator | May 30, 2026 | Safe if attributed; scaling must be tested |
| Bubble manual says the AI app generator is in beta | Official docs | https://manual.bubble.io/help-guides/ai/bubbles-ai-app-generator/about-ai-app-generation | May 30, 2026 | Safe if still current at publication |
| Bubble manual says AI generation creates foundational design and structure that users refine/customize | Official docs | https://manual.bubble.io/help-guides/ai/bubbles-ai-app-generator/about-ai-app-generation | May 30, 2026 | Safe if attributed |
| Bubble docs say the initial app has a built-in database and workflows | Official docs | https://manual.bubble.io/ | May 30, 2026 | Safe if attributed; test workflow completeness |
| Bubble AI Agent can create and edit data types and fields | Official docs | https://manual.bubble.io/help-guides/ai/generate-data-types-from-the-data-tab | May 30, 2026 | Safe if attributed; test data model quality |
| Bubble has a privacy-rule system for controlling access to data types | Official docs | https://manual.bubble.io/core-resources/data/privacy | May 30, 2026 | Safe and important |
| Bubble recommends users never deploy apps with sensitive data without proper privacy rules | Official docs | https://manual.bubble.io/core-resources/data/privacy | May 30, 2026 | Safe and important |
| Bubble says its platform is SOC 2 Type II compliant for security | Official docs | https://manual.bubble.io/help-guides/infrastructure/compliance/soc-2-type-ii | May 30, 2026 | Safe if exact scope is stated |
| Bubble says platform SOC 2 does not automatically make individual Bubble apps SOC 2 compliant | Official docs | https://manual.bubble.io/help-guides/infrastructure/compliance/soc-2-type-ii | May 30, 2026 | Safe and important |

## 4) Pricing Notes

| Pricing item | Evidence note | Source | Status |
|---|---|---|---|
| Free building | Bubble pricing page says users can start building for free | https://bubble.io/pricing | Official, needs final pricing capture |
| Starter launch path | Bubble pricing page says users can upgrade to Starter when ready to launch | https://bubble.io/pricing | Official, needs final pricing capture |
| Web, Mobile, Web + Mobile pricing | Bubble pricing page includes platform-specific pricing choices | https://bubble.io/pricing | Official, volatile |
| Project-level plans | Bubble manual says plans are selected at the project level | https://manual.bubble.io/account-and-marketplace/account-and-billing/pricing-plans | Official |
| Workload usage | Bubble pricing docs cover workload usage; workload tiers may be necessary as apps grow | https://manual.bubble.io/account-and-marketplace/account-and-billing/pricing-plans | Official |
| Enterprise | Enterprise options exist | https://bubble.io/pricing and https://manual.bubble.io/help-guides/bubble-for-enterprise/security-and-compliance | Needs sales verification |
| AI-generator specific cost | Not isolated during this pass | Needs account/pricing verification | Unknown — needs verification |

Pricing status: `official pricing sources found — exact tier prices/limits must be captured immediately before publication`.

Pricing caution: Bubble pricing can vary by web/mobile selection, plan tier, workload usage, and enterprise terms. Do not publish simplified affordability claims without a standard workload benchmark.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Privacy rules | Bubble docs say privacy rules prevent users from seeing/modifying data they should not access | https://manual.bubble.io/core-resources/data/privacy | Must be tested on generated apps |
| Sensitive data warning | Bubble docs recommend never deploying sensitive-data apps without proper privacy rules | https://manual.bubble.io/core-resources/data/privacy | Strong safe limitation to publish |
| SOC 2 Type II | Bubble says the platform is SOC 2 Type II compliant for security | https://manual.bubble.io/help-guides/infrastructure/compliance/soc-2-type-ii | Scope applies to Bubble platform, not automatically individual apps |
| App compliance transfer | Bubble docs explicitly say individual apps do not automatically become SOC 2 compliant | https://manual.bubble.io/help-guides/infrastructure/compliance/soc-2-type-ii | Must include in production-readiness section |
| App security planning | Bubble docs emphasize users must establish privacy/security policies and legal documentation | https://manual.bubble.io/help-guides/security/planning-app-security | Builder responsibility remains material |
| Abuse risk | 2026 reporting says attackers abused Bubble-hosted apps for phishing; Bubble infrastructure was not described as compromised | TechRadar/Kaspersky reporting, March 2026 | Reputable third-party risk signal; frame as abuse/governance risk, not inherent insecurity |

Production-readiness summary: Bubble has mature platform/security documentation and explicit privacy-rule controls, but generated apps still require builder-side privacy-rule configuration, security review, workload planning, and compliance work. The AI generator should be treated as a starting point, not as proof of production readiness.

## 6) Autonomy Notes

Bubble AI is an AI-assisted no-code app creation workflow. Official docs describe it as automating the initial app creation process and generating a foundational app structure, database, and workflows. The safest framing is **AI-assisted MVP generation inside Bubble’s no-code platform**.

| Autonomy question | Current evidence answer |
|---|---|
| Can Bubble generate an app from a prompt? | Official sources support this |
| Does it generate a complete production app? | Not verified |
| Does it generate database/workflows? | Official docs support built-in database/workflow claim |
| Does it automatically secure generated data? | Not verified; privacy rules require testing |
| Is the AI generator beta? | Official docs identified it as beta during source pass |

## 7) Strengths From Official or Verified Sources Only

- Bubble has official documentation for AI app generation rather than only marketing copy.
- Bubble’s manual explicitly positions AI generation as a starting point users refine in the visual editor.
- Bubble has documented privacy rules and warns users not to deploy sensitive apps without proper privacy rules.
- Bubble has official SOC 2 Type II platform documentation and clearly states that platform compliance does not automatically transfer to apps.
- Bubble’s visual builder and workload pricing docs provide concrete testing dimensions.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| AI generator was described as beta | Official docs | Recheck status before publication |
| Generated app security is not guaranteed | Privacy-rule docs and production reasoning | Must test every generated app |
| SOC 2 does not transfer to apps automatically | Official SOC 2 docs | Critical safe limitation |
| Workload pricing can affect operating cost | Official pricing/manual docs | Needs benchmark |
| Abuse risk exists for hosted app platforms | 2026 third-party reporting | Use carefully as governance risk |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| FlutterFlow AI | Visual app builder with AI generation and code export posture |
| Adalo | No-code app builder for mobile/web app creation |
| Glide AI | No-code app builder with AI/data workflows |
| Softr AI | No-code app builder for portals/internal tools |
| Base44 | AI app builder with backend-included positioning |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. Bubble offers an AI app generator that starts from a text prompt.
2. Bubble’s docs describe the AI generator as producing a foundational app structure that users can refine in Bubble’s visual editor.
3. Bubble documentation says generated/created Bubble apps require proper privacy rules before handling sensitive data.
4. Bubble says its platform is SOC 2 Type II compliant for security, but individual Bubble apps do not automatically become SOC 2 compliant.
5. Bubble’s pricing model includes free building and paid launch/scaling plans, with workload usage as an important cost dimension.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Bubble AI builds complete production apps” | Official docs frame generation as foundational/beta; production readiness requires tests | Generated app benchmark and security review |
| “AI-generated Bubble apps are secure by default” | Privacy rules must be implemented correctly | Cross-user data access tests |
| “Bubble is SOC 2 compliant, so your app is too” | Official docs say compliance does not automatically transfer | Compliance scope language and customer controls |
| “Bubble AI is cheaper than FlutterFlow/Base44” | Pricing depends on workload and platform choice | Standardized workload cost benchmark |
| “Bubble AI handles mobile and web equally well” | Needs web/mobile build tests | Build same app for web and mobile paths |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Prompt-to-app generation | Build simple marketplace or CRM from prompt | App generates with pages, database, and workflows |
| 2 | Feature confirmation flow | Review AI-recommended features | Missing/incorrect features can be added clearly |
| 3 | Data model review | Inspect generated data types and fields | Data model is coherent and not duplicative |
| 4 | Privacy-rule test | Create two users and private records | User A cannot access User B records |
| 5 | Workflow test | Run core create/update/delete workflow | Workflow succeeds and respects permissions |
| 6 | Mobile path check | Generate or adapt for mobile if available | Mobile app path is documented and functional |
| 7 | Workload/cost tracking | Simulate realistic usage | Workload units/cost impact recorded |
| 8 | Security checklist | Run Bubble privacy/security review | No obvious exposed sensitive data |
| 9 | Abuse/responsibility review | Check hosted domain, login page, and phishing-like warning behavior if available | Governance observations documented safely |
| 10 | Comparison benchmark | Repeat same brief in FlutterFlow, Glide, and Base44 | Comparative evidence table created |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | Bubble AI app generator page, Bubble manual AI docs, Bubble pricing page/manual, Bubble privacy-rule docs, Bubble SOC 2 docs, Bubble security docs |
| Reputable third-party | TechRadar/Kaspersky reporting on phishing abuse of Bubble-hosted apps |
| Anecdotal/user-reported | None used in this file |
| Needs testing | Generated app quality, privacy rules, workload cost, mobile/web parity, production security |

