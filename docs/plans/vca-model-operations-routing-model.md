# VibeCode Authority Model Operations Routing Model

## Principle

Autonomous publishing quality depends on routing the right model to the right risk level. Cheap models can prepare work. Stronger models should be reserved for evidence reasoning, final synthesis, audits, and revenue-sensitive pages.

## Routing Tiers

| Tier | Use | Quality Gate | Budget Rule |
| --- | --- | --- | --- |
| Fast Drafting | Brief expansion, outline variants, metadata, refresh summaries, social copy | Must preserve source IDs, disclosure state, and blocked claim list | Use low-cost models unless the task touches verdicts or legal-sensitive claims |
| Evidence Reasoning | Claim extraction, evidence parity checks, contradiction review, benchmark interpretation | Must produce a structured claim map and cite record IDs for every conclusion | Use stronger models when comparisons affect rankings, best-of guides, or reports |
| Editorial Synthesis | Final draft pass, report narrative, executive summaries, buyer recommendations | Must run after evidence reasoning and before human approval | Reserve premium models for publish-candidate pages and monetized surfaces |
| Audit and Challenge | Adversarial review, unsupported-claim detection, sponsor/disclosure checks | Must independently inspect generated output against evidence records | Run on high-value pages, major ranking changes, and production-ready claims |

## Task Policies

| Task | Required Inputs | Blocked Outputs |
| --- | --- | --- |
| Source Snapshot Summary | Official URL, captured text, checked date, source type, affected fields | New pricing claims, legal interpretation, or vendor comparison language |
| Benchmark Interpretation | Prompt, tool output, screenshots, deploy notes, failure taxonomy, reviewer notes | Score changes without QA record or cross-tool winner claims without parity |
| Review Article Draft | Review record, claim ledger, benchmark runs, artifacts, source snapshots | Final verdict, affiliate CTA, or production-ready claim without approval |
| Best-of Recommendation | Eligible reviews, category boundary, evidence window, monetization disclosure | Overall winner language when categories or evidence windows do not match |

## Logging Requirements

Every model call should store:

- Prompt version.
- Input record IDs.
- Output hash.
- Estimated cost.
- Model route.
- Failure mode, when a retry happens.
- Reviewer status.

## Escalation Rules

- Retry with a stronger model only after recording the failure mode.
- High-cost model routes require a publish candidate, revenue page, report, or major correction trigger.
- Any output that changes verdict, score, ranking, disclosure, or CTA state requires human approval.
- Generated copy cannot cite sources that were not present in the prompt context.
- Audit routes must be independent from the drafting route.

## Operating Rule

Use cheap automation for preparation. Spend expensive reasoning only where authority, revenue, or reader trust is at stake.
