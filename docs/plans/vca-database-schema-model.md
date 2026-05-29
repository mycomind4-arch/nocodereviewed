# VibeCode Authority Database Schema Model

## Principle

The production database must preserve evidence relationships. Tools, source snapshots, benchmark runs, artifacts, review records, quality checks, pages, and citations should be queryable by stable IDs rather than duplicated into page text.

## Core Tables

| Table | Purpose | Key fields | Relationships |
| --- | --- | --- | --- |
| tools | Canonical platform records | id, slug, name, category, official_url, affiliate_status, created_at, updated_at | Parent table for reviews, snapshots, benchmarks, artifacts, QA, and pages |
| source_snapshots | Official pricing, docs, changelog, terms, privacy, and limitations evidence | id, tool_id, source_type, source_url, summary, captured_at, expires_at | Belongs to tools; supports claims, pages, reports, and freshness gates |
| benchmark_runs | Repeatable benchmark execution and scoring records | id, tool_id, benchmark_id, deploy_status, final_score, evidence_notes, run_at | Belongs to tools and benchmark definitions; links to artifacts and review records |
| artifacts | Screenshots, generated app URLs, deploy links, exports, repos, recordings, and proof assets | id, tool_id, benchmark_run_id, artifact_type, title, url, created_at | Belongs to tools; optionally belongs to benchmark runs and public pages |
| review_records | Editorial verdicts, scores, pros/cons, affiliate URLs, and publish notes | id, tool_id, status, score, verdict, pros, cons, updated_at | Belongs to tools; feeds review pages, comparisons, and best-of rankings |
| quality_checks | Evidence, factuality, originality, SEO, and disclosure readiness gates | id, tool_id, page_id, scores, disclosure_ready, notes, checked_at | Belongs to tools or pages; blocks publication when thresholds fail |
| pages | Canonical public CMS-backed page records | id, slug, page_type, canonical_url, publish_state, evidence_state, published_at | Joins to tools, evidence records, reports, and internal-link records |

## Relationships

- `tools.id -> source_snapshots.tool_id`
- `tools.id -> benchmark_runs.tool_id`
- `benchmark_runs.id -> artifacts.benchmark_run_id`
- `tools.id -> review_records.tool_id`
- `tools.id -> quality_checks.tool_id`
- `pages.id -> quality_checks.page_id`
- `pages.id -> page_evidence.page_id`
- `source_snapshots.id / benchmark_runs.id / artifacts.id -> page_evidence.evidence_id`

## Indexes

- Unique index on `tools.slug`.
- Unique index on `pages.canonical_url`.
- Composite index on `source_snapshots(tool_id, source_type, captured_at)`.
- Composite index on `benchmark_runs(tool_id, benchmark_id, run_at)`.
- Composite index on `quality_checks(page_id, checked_at)`.
- Index `page_evidence` by `page_id` and `evidence_type` for fast citation rendering.

## Migration Rules

- Add stable IDs before migrating local JSON records.
- Preserve original `created_at` and `captured_at` timestamps during import.
- Never store tool names as primary references once `tool_id` exists.
- Use join tables for page evidence instead of duplicating source URLs into page content.
- Keep schema migrations reversible until the CMS and public routes are stable.

## Operating Outcome

This schema turns the prototype into an auditable evidence platform. Public pages, reports, rankings, and corrections can all point back to durable source records.
