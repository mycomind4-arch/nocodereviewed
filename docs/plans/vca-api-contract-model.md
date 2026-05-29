# VibeCode Authority API Contract Model

## Principle

The API should preserve evidence integrity across admin screens, CMS publishing, workers, analytics, and public pages. Public reads, admin writes, worker jobs, and event capture need separate contracts and security boundaries.

## Endpoint Families

| Family | Endpoints | Consumers | Contract |
| --- | --- | --- | --- |
| Evidence capture | `/api/source-snapshots`, `/api/benchmark-runs`, `/api/artifacts`, `/api/quality-checks` | Admin app, benchmark workers, source watcher | Create structured evidence records with stable IDs, timestamps, tool_id, and evidence state |
| Editorial workflow | `/api/article-briefs`, `/api/review-records`, `/api/pages`, `/api/corrections` | Admin app, CMS sync, editorial review queues | Manage publish state, verdicts, claim checks, canonical URLs, and correction notes |
| Public read API | `/api/public/reviews/{slug}`, `/api/public/compare/{slug}`, `/api/public/reports/{slug}` | Public frontend and generated routes | Return only publishable, disclosure-ready, canonicalized page data with evidence badges |
| Automation jobs | `/api/jobs/source-watch`, `/api/jobs/benchmark`, `/api/jobs/refresh`, `/api/jobs/report-package` | Scheduled workers and manual admin triggers | Create reviewable job records and never mutate public verdicts without approval |
| Analytics events | `/api/events/review-opened`, `/api/events/cta-clicked`, `/api/events/report-requested` | Public frontend, newsletter, reports, distribution assets | Capture page, tool, evidence state, disclosure state, freshness state, and session context |

## Validation Rules

- POST and PATCH requests must validate required fields before writing records.
- Public read endpoints must filter out unpublished, blocked, or non-canonical pages.
- Every mutating endpoint must write `created_at`/`updated_at` and actor/job context.
- Evidence endpoints must reject records without a `tool_id` or `page_id` relationship when one is required.
- Affiliate, sponsor, pricing, and production claims must include disclosure/freshness fields in the response.

## Security Boundaries

- Public endpoints are read-only and return no admin notes, private vendor contacts, or draft records.
- Admin endpoints require authenticated users and role-based permissions.
- Worker endpoints require signed job tokens and write audit logs.
- Artifact uploads must validate file type, size, metadata, and evidence linkage.
- Rate-limit public endpoints and all form submissions to protect the evidence store.

## Operating Outcome

This contract lets VibeCode Authority evolve from a local prototype into a production platform without blurring public reads, admin edits, worker automation, and analytics capture.
