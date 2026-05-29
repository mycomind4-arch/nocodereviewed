# VibeCode Authority Programmatic SEO Model

## Principle

Scale pages only where evidence can scale with them.

Programmatic SEO should not create thin pages. Every template must have a matching evidence path, internal-link rule, and publish gate.

## Template Families

| Template | URL Pattern | Intent | Publish Gate |
| --- | --- | --- | --- |
| Platform review | `/reviews/{tool}` | Evaluate one platform | Review record, benchmark run, fresh source snapshot, artifact, final QA |
| Versus comparison | `/compare/{tool-a}-vs-{tool-b}` | Compare two tools | Comparable benchmark runs, source snapshots for both tools, evidence gap labels |
| Best-of use case | `/best/{use-case}` | Rank tools for a buyer job | Three evidence-backed ranked tools or clear provisional labels |
| Benchmark report | `/reports/{report}` | Publish recurring findings | Dated evidence window, benchmark data, claim-ledger compliance, QA notes |
| Build log | `/build-log/{benchmark}-{tool}` | Show original proof | Prompt transcript, screenshots, output link/export, manual fixes, deploy result |
| Alternative page | `/alternatives/{tool}` | Capture switching/comparison intent | Same-category reviews, use-case fit, evidence gaps, pricing/source snapshots |

## Internal Link Rules

1. Every review links to its benchmark, one same-category comparison, one best-of hub, and methodology.
2. Every best-of page links to ranked reviews and marks provisional tools clearly.
3. Every comparison page links back to both reviews and the relevant claims-ledger rule.
4. Every report links to methodology, readiness, and the underlying review cluster.
5. Every build log links to the tool review, benchmark detail, and report that uses the evidence.

## Launch Order

1. Platform reviews
2. Versus comparisons
3. Best-of hubs
4. Build logs
5. Authority reports
6. Alternative pages

Launch core tools first. Expand only after the evidence capture process is repeatable.

## Blockers

A programmatic page is blocked when:

- It has no original evidence record.
- It repeats another template without adding intent-specific value.
- It has no internal links into the evidence system.
- It claims a ranking without benchmark support.
- It depends on stale pricing or source claims.
