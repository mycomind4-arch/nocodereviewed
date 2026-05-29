# VibeCode Authority Site Architecture And URL Model

## Principle

The public site should scale through a controlled sitemap, not through ad hoc pages. Every URL needs a purpose, launch rule, evidence gate, and internal-link obligation.

## Public Sections

| Section | Purpose | URL pattern | Launch rule |
| --- | --- | --- | --- |
| Reviews | Primary evidence-backed platform pages for every tracked tool | `/reviews/{tool}` | Publish only after review record, benchmark run, fresh source snapshot, artifact, and QA exist |
| Compare | Direct and adjacent buying-intent comparisons | `/compare/{tool-a}-vs-{tool-b}` | Both tools need comparable evidence or visible evidence-gap labels |
| Best | Use-case ranked guides for founders, operators, agencies, and technical builders | `/best/{use-case}` | Rank only evidence-backed tools; mark incomplete entries as provisional |
| Benchmarks | Original build tests, proof assets, and repeatable benchmark detail pages | `/benchmarks/{benchmark}/{tool}` | Requires prompt, output artifact, deploy/handoff notes, and scoring record |
| Reports | Recurring authority products with dated evidence windows | `/reports/{report}` | Requires methodology, evidence window, claim ledger pass, and QA |
| Method | Public explanation of scoring, taxonomy, evidence, corrections, and disclosure | `/methodology` | Must stay available from every review, comparison, best-of guide, and report |

## URL Governance Rules

- Use stable, lowercase, hyphenated slugs for every tool, benchmark, report, and use case.
- Never publish multiple URLs for the same canonical verdict surface.
- Redirect or canonicalize renamed platforms instead of creating duplicate reviews.
- Do not launch thin alternative pages before the original review and best-of hub exist.
- Every public URL must declare its evidence gate and internal-link obligations.

## Launch Queue

| Priority | Cluster | URLs |
| --- | --- | --- |
| P0 | Core reviews | `/reviews/lovable`, `/reviews/bolt-new`, `/reviews/replit-agent`, `/reviews/v0`, `/reviews/cursor`, `/reviews/base44`, `/reviews/windsurf` |
| P0 | Core comparisons | `/compare/lovable-vs-bolt-new`, `/compare/lovable-vs-replit-agent`, `/compare/cursor-vs-windsurf` |
| P1 | Use-case hubs | `/best/founders`, `/best/saas-mvp`, `/best/internal-tools`, `/best/landing-pages` |
| P1 | Authority reports | `/reports/vibe-coding-platform-index`, `/reports/prompt-to-app-benchmark`, `/reports/production-readiness-watchlist` |

## Navigation Hierarchy

1. Reviews
2. Compare
3. Best
4. Benchmarks
5. Reports
6. Method

## Operating Outcome

This model keeps the anchor site organized as content scales. The site can add hundreds of pages without losing canonical structure, internal-link discipline, or evidence requirements.
