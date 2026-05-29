# NoCodeReviewed GPT System Map

## Brand Architecture (Always Enforce)

- **NoCodeReviewed** = main public-facing website and brand
- **Vibe Code Authority (VCA)** = internal testing, scoring, security, and methodology framework
- Correct phrasing: *"NoCodeReviewed ratings are powered by the Vibe Code Authority testing framework."*
- Never rename NoCodeReviewed to Vibe Code Authority
- Do not make Vibe Code Authority the main public brand. It may appear publicly only as the testing, scoring, and methodology framework behind NoCodeReviewed. Correct public usage: "NoCodeReviewed ratings are powered by the Vibe Code Authority testing framework."

---

## The 8 Specialized GPTs

| # | GPT Name | Primary Role |
|---|----------|--------------|
| 01 | Autonomous Infrastructure Architect | System design, data models, status workflows, automation boundaries |
| 02 | Evidence Review Researcher | Research tool facts, source claims, prepare evidence briefs |
| 03 | Prompt Template Product Builder | Create prompt vaults, SaaS blueprints, downloadable prompt assets |
| 04 | SEO Internal Linking Strategist | URL architecture, keyword maps, internal link plans, schema |
| 05 | Security Production Readiness Auditor | Auth, deployment, API key, and launch readiness checklists |
| 06 | Content Editor Quality Gate | Pre-publish content audit, publish decisions, claim verification |
| 07 | Claude Build Manager | Decompose strategy into one-task Claude prompts, manage build flow |
| 08 | Backlink Network Planner | Plan the 10-site owned media network safely and legitimately |

---

## Which GPT to Use for Which Task

| Task | GPT to Use |
|------|-----------|
| Design the tool data model or status workflow | GPT 01 |
| Define how the publish queue should work | GPT 01 |
| Research a specific tool before writing about it | GPT 02 |
| Verify pricing or feature claims | GPT 02 |
| Build a Lovable prompt pack for Gumroad | GPT 03 |
| Create a SaaS MVP blueprint | GPT 03 |
| Plan URL structure for a new tool category | GPT 04 |
| Plan internal links between review pages | GPT 04 |
| Audit a Lovable-built app before launch | GPT 05 |
| Review a review page before publishing | GPT 06 |
| Convert a spec into a Claude build prompt | GPT 07 |
| Plan how the 10-site network links together | GPT 08 |

---

## Recommended Workflow — Normal Build Cycle

```
Step 1: GPT 02 — Evidence Review Researcher
         Research the tool. Gather official claims, pricing, security notes.
         Output: Evidence brief with safe-to-publish claims and testing gaps.

Step 2: GPT 01 — Autonomous Infrastructure Architect
         Check data model and status fields for the tool.
         Confirm content status, evidence status, pricing status.
         Output: Status audit, any schema additions needed.

Step 3: GPT 03 — Prompt Template Product Builder (if applicable)
         Create prompt assets for the tool if a prompt pack is planned.
         Output: Copy-ready prompt vault entries.

Step 4: GPT 04 — SEO Internal Linking Strategist
         Map the tool review page into the site architecture.
         Output: URL, meta title, suggested internal links, anchor text plan.

Step 5: GPT 07 — Claude Build Manager
         Convert the above into one-task-at-a-time Claude implementation prompts.
         Output: Sequenced Claude prompts with acceptance criteria.

Step 6: Claude implements
         Execute GPT 07 prompts one at a time. Review output before moving on.

Step 7: GPT 06 — Content Editor Quality Gate
         Audit the written content before scheduling for publish.
         Output: Publish decision (approve / approve with edits / needs evidence / rewrite / do not publish).

Step 8: GPT 05 — Security Production Readiness Auditor
         Audit any security claims, checklists, or risky deployment assertions.
         Output: Security audit report with credibility-safe language.

Step 9: GPT 08 — Backlink Network Planner (future use only)
         Used only when planning cross-site linking for the 10-site network.
         Not part of individual tool review cycles.
```

---

## How Claude Fits In

Claude (claude.ai / Claude API) is the **build executor**. Claude does not plan. Claude does not decide what to build next. Claude receives one-task prompts from **GPT 07 (Claude Build Manager)** and implements them. Claude should never be given the full project spec and asked to build everything. Every Claude prompt must include stop conditions, acceptance criteria, and files not to touch.

---

## How OpenAI Codex / Codex CLI Fits In (Future)

Codex is not currently in the active workflow. When introduced, it will handle automated code generation tasks that require repo-level context. GPT 07 (Claude Build Manager) will be adapted to produce Codex-compatible task files. Codex should be used for: boilerplate generation, file scaffolding, repetitive code patterns. Codex should not be used for: content decisions, architectural decisions, or any task requiring brand judgment.

---

## What Not To Do

- Do not give any GPT the full project spec and ask it to plan everything
- Do not use GPT 03 to write evidence-backed review claims
- Do not use GPT 02 to build prompts or templates
- Do not use GPT 08 during the individual tool review cycle — it is for network expansion only
- Do not use GPT 06 to approve content that GPT 02 has flagged as needing testing
- Do not use GPT 07 to create multi-file mega-prompts — always one task at a time
- Do not publish anything without GPT 06 approval
- Do not publish anything with unverified security claims without GPT 05 review
- Do not position Vibe Code Authority as the main site identity. It is the methodology framework label — public only as a supporting reference, never as the primary brand

---

## Overlap Risks and Mitigation

| Potential Overlap | How to Avoid It |
|-------------------|----------------|
| GPT 01 and GPT 07 (both touch architecture) | GPT 01 designs the system. GPT 07 creates Claude prompts to build it. Never combine. |
| GPT 02 and GPT 06 (both review claims) | GPT 02 researches before writing. GPT 06 audits after writing. Sequential, not interchangeable. |
| GPT 04 and GPT 08 (both involve links) | GPT 04 handles internal linking within NoCodeReviewed. GPT 08 handles cross-domain network strategy only. |
| GPT 05 and GPT 06 (both gate publishing) | GPT 06 gates content quality and claim accuracy. GPT 05 gates security assertions and technical accuracy. Run both for pages with security sections. |

---

## Order of Creation (Recommended)

**Do not create all 8 GPTs at once.** Build them as you need them. Use each one before creating the next.

1. **Create GPT 02 first** — Evidence Review Researcher. Without accurate research, every other GPT works on bad data. No review content should be produced without running it first.
2. **Create GPT 07 second** — Claude Build Manager. This is your highest-frequency tool during active build phases. A well-scoped GPT 07 is the single biggest protection against Claude overbuilding.
3. **Create GPT 06 third** — Content Editor Quality Gate. Once you have evidence briefs and Claude is building pages, you need a gate before anything goes live.
4. **Create GPT 01 fourth** — Autonomous Infrastructure Architect. Once the first few builds have run, you'll have real architecture questions to answer.
5. Create GPT 03, 04, 05, and 08 only when you have active use cases for them.

## Normal Build Workflow (Summary)

```
Evidence brief (GPT 02)
  → Page/content brief
    → Claude build prompt (GPT 07)
      → Claude implements
        → Content quality gate (GPT 06)
          → Security/production audit for risky claims (GPT 05)
            → Publish decision
```

---

*Last updated: May 2026 | NoCodeReviewed / Vibe Code Authority internal documentation*
