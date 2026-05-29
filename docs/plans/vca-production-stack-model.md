# VibeCode Authority Production Stack Model

## Principle

The moat is evidence quality, not stack complexity. Use boring, auditable infrastructure that keeps public pages, CMS composition, structured evidence, artifacts, automations, and analytics clearly separated.

## Stack Layers

| Layer | Responsibility | Recommendation | Boundary |
| --- | --- | --- | --- |
| Frontend app | Render reviews, comparisons, best-of hubs, reports, dashboards, and admin workflows | Next.js or equivalent route-first framework with static generation for public pages | No public page ships without evidence state, canonical URL, and disclosure data |
| Structured database | Store tools, benchmark runs, source snapshots, artifacts, review records, QA checks, and corrections | Relational database with stable IDs, foreign keys, timestamps, and audit fields | Evidence records stay structured; do not hide source data in CMS rich text |
| Headless CMS | Manage page composition, editorial workflow, previews, scheduled publishing, and canonical metadata | Add after schemas stabilize; join CMS entries to evidence records | CMS can arrange pages but cannot invent scores, freshness, or evidence states |
| Artifact storage | Store screenshots, recordings, generated app exports, repos, reports, and social assets | Object storage with metadata linked to tool, benchmark, and page | No artifact is citeable without source context and created-at metadata |
| Automation workers | Run source checks, benchmark queues, draft generation, refresh tasks, and report packaging | Queue-backed jobs with retry logs, approvals, kill switches, and human review gates | Workers prepare evidence and drafts; they cannot publish final recommendations directly |
| Analytics and observability | Track page performance, evidence engagement, CTA behavior, freshness risk, and job failures | Event tracking plus logs for API routes, jobs, source checks, and publishing actions | Analytics must include evidence/disclosure/freshness state |

## Implementation Phases

1. Static authority prototype: finalize information architecture, review surfaces, operating models, and local capture forms.
2. Database-backed admin: move local JSON records into structured tables with stable IDs and relationships.
3. CMS public publishing: generate canonical public pages from CMS entries joined with evidence records.
4. Automation and refresh jobs: run source freshness, benchmark queues, report packaging, and refresh tasks.
5. Revenue and distribution: enable affiliate CTAs, reports, newsletter, social cards, and analytics with trust controls.

## Decision Rules

- Choose boring production infrastructure over novelty.
- Keep evidence records portable across reports, public pages, exports, and audits.
- Separate editorial content from benchmark/source data.
- Instrument every public event with page, tool, evidence state, disclosure state, and freshness state.
- Automate record creation and refresh queues before automating publication.

## Operating Outcome

This model gives the platform a production build path without weakening the evidence system. Public pages become fast and polished, while the authority record remains structured, auditable, and portable.
