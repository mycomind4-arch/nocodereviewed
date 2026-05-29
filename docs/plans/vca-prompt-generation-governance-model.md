# VibeCode Authority Prompt Generation Governance Model

## Principle

Autonomous writing should accelerate evidence-backed publishing, not replace evidence. Generated output must stay inside the records, benchmarks, screenshots, disclosures, and methodology already approved by the system.

## Generation Surfaces

| Surface | Inputs | Outputs | Boundary |
| --- | --- | --- | --- |
| Article Briefs | SEO template, audience segment, taxonomy, claim standards, required evidence | Controlled outline, angle, internal links, evidence checklist, publish gate | Briefs can start drafting but cannot create factual claims without records |
| Review Drafts | Review record, benchmark runs, snapshots, artifacts, QA requirements, category playbook | Draft sections, provisional labels, citations needed, blocked claims | Drafts cannot publish until quality gateway and disclosure checks pass |
| Comparison Summaries | Two review records, comparable benchmark evidence, source freshness, category boundary | Decision summary, evidence parity notes, winner state, unresolved gaps | No winner language when evidence parity is incomplete |
| Report Narratives | Evidence window, benchmark data, source snapshots, corrections, ranking movement | Executive summary, findings, exclusions, changes since last report | Report text must preserve evidence window and methodology constraints |
| Distribution Copy | Published page, verdict state, disclosure state, evidence badges, correction status | Newsletter, social, video, and card copy linked back to source pages | Distribution copy cannot be stronger than the underlying published page |

## Prompt Contracts

| Contract | Rule | Fail Condition |
| --- | --- | --- |
| Grounding | Use only provided evidence records, snapshots, benchmark notes, artifacts, and approved taxonomy | Hallucinated product facts, unsupported pricing, or uncited feature claims |
| Claim Strength | Match language to evidence state: provisional, evidence-backed, or blocked | Best, fastest, cheapest, or production-ready claims without mapped evidence |
| Disclosure | Carry affiliate, sponsor, vendor-provided evidence, and correction status into generated copy | Monetized or vendor-influenced text without visible disclosure state |
| Category Accuracy | Use controlled taxonomy and state when comparisons are direct, adjacent, or buyer-intent based | Flattening AI IDEs, prompt-to-app builders, UI generators, and no-code incumbents into one category |
| Actionability | Generate next actions for missing evidence, blockers, QA, and refresh tasks | Polished prose that hides unresolved evidence gaps |

## Validation Rules

- Generated text must list every claim that requires a source, benchmark, artifact, or QA record.
- Generated verdicts must include verdict state: blocked, provisional, evidence-backed, or ready.
- Generated comparisons must state evidence parity for both tools.
- Generated report sections must include evidence window and exclusions.
- Generated distribution copy must link to a canonical published page and preserve disclosure state.
- Generated drafts cannot update scores, rankings, verdicts, CTAs, or public pages without approval.

## Workflow

1. Load approved evidence records and source snapshots.
2. Apply the prompt contract for the target surface.
3. Generate the brief, draft, summary, or distribution copy.
4. Extract claims, citations needed, and unresolved evidence gaps.
5. Send the output through the quality gateway.
6. Require approval before public publishing, score changes, ranking movement, or monetized CTAs.

## Operating Rule

The system can generate drafts autonomously. It cannot generate authority autonomously. Authority comes from repeatable evidence, visible boundaries, and conservative publication gates.
