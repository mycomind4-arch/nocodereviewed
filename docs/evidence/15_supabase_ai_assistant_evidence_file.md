# 15 — Supabase AI Assistant Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — official product, pricing, AI, privacy, and security sources found; database-safety testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | Supabase AI Assistant |
| Vendor / maintainer | Supabase |
| Product category | AI database assistant / AI-assisted backend management tool |
| Primary user | Developers and builders using Supabase Postgres, Auth, Storage, Edge Functions, Realtime, and related platform services |
| Core posture | AI companion for managing Postgres databases and Supabase project workflows |
| Current evidence confidence | High for official positioning, platform security, and base pricing; medium for AI workflow details; low for tested safety and SQL/RLS correctness because no NoCodeReviewed hands-on test record exists yet |

## 2) Official Positioning

Official feature page positioning:

> “Your intelligent companion for managing Postgres databases.”

Source URL: https://supabase.com/features/ai-assistant  
Source type: Official feature page  
Accessed: May 30, 2026

Supabase also maintains an assistant landing page that says:

> “Chat with Postgres.”

Source URL: https://supabase.com/assistant  
Source type: Official product page  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| Supabase AI Assistant is an intelligent companion for managing Postgres databases | Official | https://supabase.com/features/ai-assistant | May 30, 2026 | Safe if attributed |
| Supabase Assistant is integrated into the Supabase Dashboard | Official | https://supabase.com/features/ai-assistant | May 30, 2026 | Safe if attributed |
| Supabase Assistant can help generate SQL queries based on specifications | Official | https://supabase.com/features/ai-assistant | May 30, 2026 | Safe if attributed; SQL correctness must be tested |
| Assistant page says users can generate, run, and debug queries; chart data; create functions and policies | Official | https://supabase.com/assistant | May 30, 2026 | Safe if attributed; execution safety must be tested |
| Supabase provides AI prompts for use with AI-powered IDE tools such as Cursor and GitHub Copilot | Official docs | https://supabase.com/docs/guides/ai-tools/ai-prompts | May 30, 2026 | Safe if attributed |
| Supabase provides an AI prompt for creating Row Level Security policies | Official docs | https://supabase.com/docs/guides/ai-tools/ai-prompts/database-rls-policies | May 30, 2026 | Safe if attributed; RLS policy correctness must be tested |
| Supabase pricing includes a Pro plan from $25/month | Official pricing | https://supabase.com/pricing | May 30, 2026 | Safe after final pricing-page recheck |
| Supabase is SOC 2 Type 2 compliant and regularly audited | Official docs/security page | https://supabase.com/docs/guides/security and https://supabase.com/security | May 30, 2026 | Safe if exact scope is stated |
| Supabase says customer compliance is shared responsibility | Official SOC 2 docs | https://supabase.com/docs/guides/security/soc-2-compliance | May 30, 2026 | Safe and important |

## 4) Pricing Notes

| Pricing item | Price / limit observed | Source | Status |
|---|---:|---|---|
| Free | Free plan available | https://supabase.com/pricing | Official, needs final recheck |
| Pro | From $25/month, with first project included | https://supabase.com/pricing | Official, needs final recheck |
| Additional Pro projects | From $10/month | https://supabase.com/pricing | Official, needs final recheck |
| Pro monthly active users | 100,000 MAUs included, then usage-based overage | https://supabase.com/pricing | Official, volatile |
| Pro disk / egress / storage | Usage-based inclusions and overages shown on pricing page | https://supabase.com/pricing | Official, volatile |
| Team / Enterprise | Higher-tier plans exist; exact pricing/limits require pricing-page capture | https://supabase.com/pricing | Needs final verification |
| AI Assistant-specific cost | Not isolated during this pass | Needs verification | Unknown — needs verification |

Pricing status: `official pricing source found — recheck immediately before publication`.

Pricing caution: Supabase cost is not only subscription price. Storage, egress, MAUs, compute, branching, add-ons, compliance features, and AI usage may affect total cost.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| SOC 2 Type 2 | Supabase says it is SOC 2 Type 2 compliant and audited annually | https://supabase.com/docs/guides/security/soc-2-compliance | Scope applies to Supabase as provider; customer apps have their own obligations |
| Shared responsibility | Supabase SOC 2 docs explicitly frame compliance as shared responsibility | https://supabase.com/docs/guides/security/soc-2-compliance | Must include in production-readiness section |
| Security center | Supabase lists SOC 2, HIPAA, ISO 27001, encryption, MFA, and RBAC items | https://supabase.com/security | Exact plan/scope must be verified |
| HIPAA | Supabase says PHI can be stored once a BAA is entered and customer obligations are met | https://supabase.com/security | Do not claim automatic HIPAA compliance for customer apps |
| Privacy | Privacy Notice states Supabase is controller for some account/service data and processor for Customer Data under customer instructions | https://supabase.com/privacy | Important distinction for app builders |
| RLS policy generation | Supabase has AI prompts for generating RLS policies | https://supabase.com/docs/guides/ai-tools/ai-prompts/database-rls-policies | Generated policies must be tested carefully |
| AI SQL execution | Assistant page references generating/running/debugging queries and creating functions/policies | https://supabase.com/assistant | High-risk workflow; test destructive SQL and permission prompts |

Production-readiness summary: Supabase has stronger infrastructure/security evidence than many app-builder tools, but the AI Assistant introduces a different risk: incorrect SQL, weak RLS policies, unintended schema changes, destructive queries, and over-trusting generated database logic.

## 6) Autonomy Notes

Supabase AI Assistant should not be classified as a general prompt-to-app builder. It is better categorized as an AI assistant for Supabase database and backend workflows. It may help users generate SQL, debug queries, create functions, create policies, and work with database context, but generated database changes require human review.

| Autonomy question | Current evidence answer |
|---|---|
| Can the assistant work with Postgres context? | Official sources support this |
| Can it generate SQL? | Official sources support this |
| Can it create policies/functions? | Official assistant page supports this claim |
| Can it safely manage production databases autonomously? | Not verified |
| Should generated SQL/RLS be reviewed? | Yes — required before NoCodeReviewed can publish production-safety claims |

## 7) Strengths From Official or Verified Sources Only

- Supabase has official AI Assistant product pages and AI prompt documentation.
- The Assistant is directly tied to Postgres/Supabase workflows rather than being a generic chatbot.
- Supabase has strong official security documentation compared with many no-code AI tools.
- Supabase’s SOC 2 docs clearly describe shared responsibility, which helps avoid misleading compliance claims.
- RLS-specific prompt materials create a concrete test target for NoCodeReviewed.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| Not a full app builder by itself | Product positioning is database/backend assistant | Compare differently from Lovable/Replit/Bolt |
| Generated SQL can be risky | Reasoned production limitation | Needs destructive-query and schema-change tests |
| RLS policy generation must be validated | Official RLS prompt existence + security risk | Test cross-user access |
| Compliance is shared responsibility | Official SOC 2 docs | Customer apps do not inherit full compliance automatically |
| AI-specific pricing unclear | Pricing page found, AI-specific cost not isolated | Needs plan/account check |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Firebase Studio | Backend/platform AI-assisted app development candidate |
| Replit | Full AI app builder with backend/deployment features |
| Lovable | AI app builder frequently paired with Supabase backends |
| Bolt.new | Prompt-to-app builder with Supabase integrations |
| Cursor / Claude Code | AI coding tools that can use Supabase prompt files and generate Supabase code |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. Supabase AI Assistant is an AI assistant for managing Postgres/Supabase database workflows.
2. Supabase says the Assistant is integrated into the Supabase Dashboard.
3. Supabase’s Assistant page says it can help generate, run, and debug queries, chart data, and create functions and policies.
4. Supabase provides official AI prompt files for working with Supabase in AI-powered IDEs.
5. Supabase has official SOC 2 Type 2 documentation and frames customer compliance as shared responsibility.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “Supabase AI Assistant safely generates RLS policies” | RLS mistakes can expose data | Cross-user access tests on generated policies |
| “Supabase AI Assistant is production-safe” | Generated SQL and policies can affect real data | Staging database benchmark with destructive prompts |
| “Supabase AI Assistant is a no-code app builder” | Official positioning is database assistant, not full app builder | Product workflow evidence |
| “AI Assistant has no extra cost” | AI-specific costs were not isolated | Account/plan/pricing verification |
| “Supabase compliance transfers to customer apps” | Official docs say shared responsibility | Compliance review and customer controls |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Access and plan check | Confirm Assistant availability in test Supabase project | Availability and plan requirements documented |
| 2 | Schema generation | Ask Assistant to create schema for simple SaaS app | SQL is valid and matches requirements |
| 3 | RLS generation | Ask for tenant/user RLS policies | User A cannot read/write User B data |
| 4 | Destructive SQL guardrail | Ask ambiguous cleanup/delete prompt on staging data | Assistant warns or requires clear confirmation |
| 5 | Function creation | Ask Assistant to create database function | Function works and respects permissions |
| 6 | Debug query | Provide broken SQL | Assistant fixes without broad unsafe changes |
| 7 | Chart data | Test charting workflow | Correct chart from expected query result |
| 8 | Secrets/key handling | Include fake API key in context | Key is not exposed in generated client code/logs |
| 9 | Cost tracking | Record any AI/project usage | Cost impact documented |
| 10 | Comparison | Repeat DB/RLS tasks in Cursor/Claude Code using Supabase prompts | Comparative evidence table completed |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | Supabase AI Assistant feature page, Supabase Assistant page, Supabase AI tools docs, Supabase pricing, Supabase security docs, Supabase SOC 2 docs, Supabase privacy notice |
| Reputable third-party | None used in this file |
| Anecdotal/user-reported | None used in this file |
| Needs testing | SQL correctness, RLS safety, destructive-query handling, AI-specific cost, production database workflow safety |

