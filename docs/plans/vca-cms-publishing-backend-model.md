# VibeCode Authority CMS Publishing Backend Model

## Principle

The local JSON store is a prototype control plane. Production publishing should separate structured evidence records from CMS page composition so verdicts, citations, slugs, drafts, and refresh states remain governed.

## Content Types

| Type | Purpose | Key fields | Source |
| --- | --- | --- | --- |
| Tool | Canonical platform entity used across reviews, comparisons, rankings, and benchmark runs | name, slug, category, officialUrl, affiliateStatus, currentScore, status | tools, review records, source snapshots |
| ReviewPage | Public review surface with verdict, score, pros/cons, evidence gates, and disclosure state | tool, slug, verdict, score, evidenceState, trustBadges, canonicalUrl | review records, benchmark runs, artifacts, QA checks |
| ComparisonPage | Two-tool buying-intent page with evidence parity, category boundary, and provisional winner state | toolA, toolB, slug, winnerState, evidenceParity, canonicalUrl | review records, benchmark runs, source snapshots |
| BestOfGuide | Use-case ranking page with methodology, provisional labels, and internal links | title, slug, useCase, rankedTools, evidenceWindow, canonicalUrl | best-of guides, readiness rows, QA checks |
| BenchmarkPage | Original proof page for benchmark task, tool output, artifacts, and score movement | tool, benchmark, slug, prompt, result, artifacts, score | benchmark runs, artifacts |
| ReportPage | Recurring authority report with evidence window, findings, exclusions, and sponsorship state | title, slug, issueDate, evidenceWindow, findings, methodology, canonicalUrl | authority reports, evidence graph, QA checks |

## Publishing States

| State | Meaning | Exit condition |
| --- | --- | --- |
| Queued | Page is planned but evidence requirements are not attached | Assign owner, URL, keyword, evidence gate, and benchmark/source requirements |
| Drafting | Brief exists and evidence capture is in progress | Attach required records and generate controlled draft |
| Evidence review | Draft exists but claims need validation | Resolve unsupported claims and evidence gaps |
| Ready | Page passes QA, disclosure, freshness, and canonical URL checks | Publish or schedule |
| Published | Public canonical URL is live and eligible for distribution | Monitor freshness, corrections, and ranking movement |
| Refresh needed | Source, benchmark, correction, or policy signal invalidated part of the page | Refresh evidence, update page, and log material changes |

## Migration Sequence

1. Keep local JSON as the prototype source until schemas stabilize.
2. Move core entities into database tables with stable IDs before adding a headless CMS.
3. Use the CMS for page composition, editorial workflow, scheduled publish, and previews.
4. Keep benchmarks, artifacts, source snapshots, and QA checks in structured data tables.
5. Generate public pages from CMS entries joined with evidence records and freshness state.

## Backend Boundary

- Structured data: benchmarks, source snapshots, artifacts, QA, review records.
- CMS data: page composition, editorial notes, publish state, canonical URLs, previews.
- Generated pages: CMS entries joined with evidence records at build or request time.

## Operating Outcome

This model lets the ecosystem move from local prototype to production publishing without losing evidence discipline. The CMS manages pages; the evidence database proves claims.
