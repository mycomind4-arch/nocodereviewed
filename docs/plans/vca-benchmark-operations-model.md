# VibeCode Authority Benchmark Operations Model

## Principle

Benchmarks move rankings only when they are repeatable, documented, and attached to evidence.

## Benchmark Protocol

| Step | Owner | Output |
| --- | --- | --- |
| Prepare | Researcher | Confirm account, plan, source snapshot, and benchmark prompt version |
| Run | Tester | Execute prompt without hidden manual rescue and record prompt count |
| Inspect | Reviewer | Capture screenshots, output URL/export, code notes, data model notes, and defects |
| Deploy | Tester | Record whether deployment passed, failed, or needed manual repair |
| Score | Editor | Apply scoring rubric, note evidence gaps, and attach final QA |

## Prompt Families

| Family | Checks |
| --- | --- |
| SaaS MVP Dashboard | Auth, dashboard, CRUD, settings, states, deploy notes |
| Directory App | Search, filters, detail pages, submit flow, review queue |
| Internal Tool | Tables, forms, roles, calendar, audit log |
| Landing Page | Conversion sections, responsiveness, design quality |
| AI Wrapper | Server-side API, secrets, history, failure handling |

## Failure Taxonomy

| Failure | Meaning | Severity |
| --- | --- | --- |
| Prompt drift | Tool ignored required app scope, data model, or user flow | Medium |
| Broken core flow | Auth, CRUD, search, forms, or state failed | High |
| Deploy blocked | App could not deploy/export without manual repair | High |
| Security ambiguity | Secrets, database rules, auth boundaries, or user data handling were unclear | High |
| Handoff risk | Code or project structure was too unclear to maintain confidently | Medium |
| Evidence gap | Screenshots, output URL, source snapshot, or notes were insufficient | Blocking |

## Publish Rule

A benchmark can support a review only when it has:

1. Tool name
2. Benchmark prompt family
3. Deploy status
4. Evidence notes
5. Artifact
6. Score or explicit reason why unscored
7. Final QA before any ranking claim
