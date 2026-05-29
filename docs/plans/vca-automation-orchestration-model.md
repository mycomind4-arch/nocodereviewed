# VibeCode Authority Automation Orchestration Model

## Principle

Automation can accelerate research, evidence capture, drafting, refreshes, and QA. It cannot bypass publish gates or human approval for final recommendations.

## Agents

| Agent | Cadence | Output | Approval |
| --- | --- | --- | --- |
| Source Watcher | Daily | Fresh source snapshots, invalidation tasks, affected page list | Human review for legal/privacy changes and monetized pricing claims |
| Benchmark Runner | Weekly batch | Benchmark runs, screenshots, deploy notes, failure taxonomy, artifacts | Human review before scores affect rankings |
| Brief Builder | On demand | Article brief with publish gate, angle, links, evidence checklist | Human review before autonomous drafting |
| Draft Generator | After brief approval | Draft article/report with provisional labels where needed | Cannot publish directly |
| Quality Gateway | Before publish | Pass/block QA record and contradiction notes | Human review for final recommendations and monetized pages |
| Refresh Agent | Weekly | Refresh queue, revised briefs, affected reports, provisional labels | Human review when rankings or verdicts change |

## Approval Sequence

1. Evidence captured
2. Brief approved
3. Draft generated
4. Quality gateway passed
5. Disclosure checked
6. Publish approved

Automation can assist through drafting. Final recommendations require human approval.

## Kill Switches

Pause autonomous publishing when:

- Quality pass rate falls below threshold for the latest batch.
- Pricing or policy changes affect a monetized recommendation.
- Benchmark outputs contradict current rankings.
- Draft includes unsupported production-ready, fastest, cheapest, or best-overall claims.
- Affiliate or sponsor content appears without disclosure readiness.

## Operating Rule

The system should be autonomous in preparation and conservative in publication.
