# VibeCode Authority Data And Export Model

## Principle

The site should be powered by an evidence graph, not isolated posts.

The current prototype stores records in `data/local-store.json`. That is acceptable for local build-out, but the schema should remain ready for database, CMS, report, and programmatic page export.

## Collections

| Collection | Purpose | Required Fields |
| --- | --- | --- |
| `benchmarkRuns` | Repeatable test results that move scores, comparisons, reports, and build logs | `tool`, `benchmark`, `deployStatus`, `evidenceNotes` |
| `articleBriefs` | Controlled article briefs before autonomous drafting | `title`, `targetKeyword`, `articleType`, `requiredEvidence`, `angle`, `publishGate` |
| `evidenceSnapshots` | Official source, pricing, feature, and limitation snapshots | `tool`, `sourceType`, `sourceUrl`, `pricingSummary`, `featureSummary` |
| `reviewRecords` | Editor verdicts, scores, pros, cons, affiliate URLs, publish notes | `tool`, `status`, `verdict`, `pros`, `cons` |
| `artifacts` | Screenshots, app URLs, repos, exports, recordings, benchmark proof | `tool`, `artifactType`, `title`, `url` |
| `qualityChecks` | Final QA scores and disclosure readiness | `tool`, `evidenceScore`, `factualityScore`, `originalityScore`, `seoScore`, `disclosureReady`, `notes` |

## Export Rules

1. Export JSON first; add SQL or CMS sync after schemas stabilize.
2. Every exported review includes evidence gates and latest freshness state.
3. Reports export with a dated evidence window and supporting source records.
4. Programmatic pages export only when template evidence requirements are satisfied.
5. Monetized pages export disclosure readiness and affiliate/sponsor separation status.

## Database Migration Target

Move the collections into relational tables with foreign keys around:

- tool
- article
- benchmark
- source snapshot
- artifact
- quality check
- report
- programmatic page template

## Operating Rule

Do not generate or export final pages from loose text. Export from records that can be inspected, refreshed, and invalidated.
