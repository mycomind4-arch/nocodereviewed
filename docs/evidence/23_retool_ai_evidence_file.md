# 23 — Retool AI Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — official AI, pricing, platform, and security-positioning sources found; hands-on internal-tool, agent, governance, and permission testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | Retool AI |
| Vendor / maintainer | Retool |
| Product category | Internal software platform with AI app-building, AI workflows, AI integrations, and agent capabilities |
| Primary user | Engineering, operations, support, data, IT, security, and enterprise teams building internal tools and operational software |
| Core posture | Build, deploy, and govern internal software with database/API/LLM connections and AI-assisted development/workflows |
| Current evidence confidence | High for official product/pricing positioning and AI credit/agent billing information; medium for security posture pending security artifact review; low for generated-app quality and agent reliability because no NoCodeReviewed hands-on testing exists yet |

## 2) Official Positioning

Retool’s homepage positions the product as:

> “Build internal software better, with AI.”

Source URL: https://retool.com/  
Source type: Official homepage  
Accessed: May 30, 2026

Retool’s homepage also says users can connect to any database, API, or LLM and leverage AI throughout the business.

Source URL: https://retool.com/  
Source type: Official homepage  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| Retool helps teams build, deploy, and manage internal tools with a unified engine | Official homepage | https://retool.com/ | May 30, 2026 | Safe if attributed |
| Retool connects to databases, APIs, and LLMs | Official homepage | https://retool.com/ | May 30, 2026 | Safe if attributed; specific connectors require verification |
| Retool is positioned for production-ready internal software | Official homepage | https://retool.com/ | May 30, 2026 | Treat as vendor claim; needs testing/security review |
| Retool AI integration page says users can start free | Official AI integration page | https://retool.com/integrations/retool-ai | May 30, 2026 | Safe if attributed |
| Retool AI integration page references SOC 2 Type II compliant security controls | Official AI integration page | https://retool.com/integrations/retool-ai | May 30, 2026 | Safe if exact scope verified |
| Retool pricing includes AI prompting credits by tier | Official pricing | https://retool.com/pricing | May 30, 2026 | Safe after final pricing capture |
| Retool pricing says agents are billed separately from AI credit pool and every plan includes up to 20 agent hours/month | Official pricing FAQ | https://retool.com/pricing | May 30, 2026 | Safe after final pricing capture |
| Retool pricing includes separate builder, internal-user, external-user, and enterprise pricing dimensions | Official pricing | https://retool.com/pricing | May 30, 2026 | Safe after final pricing capture |

## 4) Pricing Notes

| Pricing item | Price or limit observed | Source | Status |
|---|---:|---|---|
| Free | Pricing page shows Free tier with AI prompting credits | https://retool.com/pricing | Official, needs final capture |
| Team / paid entry | Pricing page snippet shows $10/month builder pricing in one tier | https://retool.com/pricing | Official, needs final capture |
| Business / advanced paid tier | Pricing page snippet shows $50/month builder pricing in one tier | https://retool.com/pricing | Official, needs final capture |
| Enterprise | Custom pricing | https://retool.com/pricing | Sales verification required |
| Builder users | Pricing is organized around builder users with AI credits | https://retool.com/pricing | Official |
| Internal users | Pricing page lists internal user pricing dimensions | https://retool.com/pricing | Official |
| External users | Pricing page includes external-user pricing for some tiers | https://retool.com/pricing | Official; plan-dependent |
| AI credits | Pricing page lists AI prompting credits by tier | https://retool.com/pricing | Official; volatile |
| Agents | Pricing FAQ says agents are billed separately and every plan includes up to 20 agent hours/month | https://retool.com/pricing | Official; must recheck |
| Additional AI capacity | Pricing FAQ says Enterprise can buy additional credit packs or use own API key for unlimited AI usage | https://retool.com/pricing | Official; needs contract verification |

Pricing status: `official pricing source found — exact tier names, prices, user categories, AI credits, agent hours, overages, BYO API key terms, and Enterprise terms must be captured immediately before publication`.

Pricing caution: Retool pricing is multidimensional. Total cost can vary by builder users, internal users, external users, AI credits, agent hours, workflows, self-host/cloud deployment, integrations, and Enterprise controls.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Production-ready positioning | Homepage claims production-ready/enterprise-grade posture | https://retool.com/ | Treat as vendor claim until app/security tests are complete |
| SOC 2 Type II controls | Retool AI integration page references SOC 2 Type II compliant security controls | https://retool.com/integrations/retool-ai | Verify exact report and scope before compliance publication |
| Governance at scale | Homepage emphasizes managing/orchestrating/scaling internal software | https://retool.com/ | Governance features require plan-specific verification |
| AI credits/agents | Pricing distinguishes AI prompting credits from agents | https://retool.com/pricing | Agent workloads require separate cost and safety testing |
| Database/API/LLM access | Homepage says Retool connects to databases, APIs, and LLMs | https://retool.com/ | High-power integrations require secrets, permissions, and audit testing |
| Security review | Retool itself says users should not choose between speed and passing security review | https://retool.com/ | Editorial review must validate with evidence rather than repeat as conclusion |

Production-readiness summary: Retool has strong enterprise/internal-tool positioning and appears more governance-oriented than consumer no-code app builders. However, Retool AI and agents can touch high-value internal data and workflows, so NoCodeReviewed must test permissions, secrets handling, data-source scope, auditability, approval gates, AI credit consumption, agent-hour consumption, and workflow side effects.

## 6) Autonomy Notes

Retool AI should be classified as **AI-assisted internal software and workflow development**, with emerging agent behavior. Official pricing explicitly distinguishes AI prompting credits from agents and says every plan includes agent hours. Do not claim Retool agents can safely automate business operations without testing.

| Autonomy question | Current evidence answer |
|---|---|
| Can Retool connect internal tools to databases/APIs/LLMs? | Official homepage supports this |
| Does Retool include AI prompting credits? | Official pricing supports this |
| Does Retool include agents? | Official pricing FAQ supports agent hours |
| Are agents billed separately from AI credits? | Official pricing FAQ says yes |
| Can agents safely run business workflows autonomously? | Not verified |

## 7) Strengths From Official or Verified Sources Only

- Retool has clear official positioning for internal tools and operational software rather than consumer app generation.
- Retool pricing exposes AI credits and agent-hour dimensions, which can be measured in testing.
- Retool connects to databases, APIs, and LLMs, making it relevant for real enterprise workflows.
- Retool AI page references SOC 2 Type II compliant security controls.
- The separate pricing for builders, internal users, external users, AI credits, and agents supports a detailed cost model.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| Retool is more technical than general no-code app builders | Product category/positioning | Compare against Appsmith, ToolJet, UI Bakery, not only Bubble/Glide |
| Production-ready claims need verification | Vendor positioning | Test app security and governance |
| Agents are separately billed | Official pricing FAQ | Cost and limits must be tracked |
| AI credits vary by tier | Official pricing | Benchmark prompts required |
| Compliance scope needs artifact review | SOC 2 claim source | Review Trust Center/report before publication |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Appsmith AI | Open-source/internal-tool builder alternative with AI features |
| ToolJet AI | Internal-tool platform alternative |
| UI Bakery AI | Internal-tool builder with AI and enterprise controls |
| Glide AI | Less technical no-code internal-tool/app builder |
| Softr AI | Portal/internal-tool builder for less technical teams |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. Retool positions itself as a platform for building internal software with AI.
2. Retool says it can connect to databases, APIs, and LLMs.
3. Retool pricing includes AI prompting credits by tier.
4. Retool pricing FAQ says agents are billed separately from AI credits and that every plan includes up to 20 agent hours per month.
5. Retool should be evaluated as an internal-software/workflow platform, not as a consumer website builder.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Retool AI is production-ready from day one” | Vendor positioning needs security/governance validation | Internal-tool benchmark and security review |
| “Retool agents can safely automate operations” | Agent reliability and blast radius untested | Agent workflow tests with approvals/logging |
| “Retool is SOC 2 Type II compliant” | Exact scope/report required | Security artifact or Trust Center review |
| “Retool is cheaper than Softr/Glide for internal tools” | Pricing model is multidimensional | Standard team/user/app/AI benchmark |
| “Retool connects to any database/API/LLM” | Broad vendor claim; specific connectors vary | Connector matrix and test integrations |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Internal tool build | Build admin CRM on test database | App reads/writes records correctly |
| 2 | Permission model | Create admin/operator/viewer roles | Each role sees and can change only intended data |
| 3 | Secrets handling | Connect database/API credentials | Secrets are not exposed in UI/logs/client code |
| 4 | AI prompt-to-query | Use Retool AI to generate query or app logic | Generated query is correct and safe |
| 5 | Workflow automation | Build workflow using data + AI step | Workflow executes only intended actions |
| 6 | Agent test | Assign bounded operational task to agent | Agent respects scope and logs actions |
| 7 | Approval/blast-radius test | Ask agent to perform risky bulk update | Requires approval or refuses/asks clarification |
| 8 | Auditability | Review logs/history for AI/agent actions | Actor, time, resource, and action are traceable |
| 9 | Cost tracking | Record builder/internal/external user needs, AI credits, agent hours | Cost table completed |
| 10 | Comparison | Repeat internal-tool brief in Appsmith, Softr, and Glide | Comparative evidence table produced |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | Retool homepage, Retool pricing page, Retool AI integration page |
| Reputable third-party | None used in this file |
| Anecdotal/user-reported | None used in this file |
| Needs testing | Internal-tool generation, permissions, secrets, AI-generated queries, workflow side effects, agents, audit logs, AI credits/agent hours, compliance scope |

