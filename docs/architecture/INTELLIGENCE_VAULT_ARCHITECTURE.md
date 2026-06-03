# Intelligence Vault Architecture

The Intelligence Vault is the future source of truth for NoCodeReviewed. It should store evidence, claims, tool metadata, quality gates, recommendations, and generated content outputs without inventing unsupported claims.

## Foundation Principles

- Supabase becomes the durable source of truth.
- n8n orchestrates ingestion and generation workflows.
- The free auditor/recommendation engine is the flagship product.
- Reviews, comparisons, tutorials, and microsites become outputs of evidence and quality gates.
- Public claims must trace back to evidence.
- Affiliate or sponsored mechanics must be disclosed and separated from evidence.

## Core Data Domains

### Tools

Stores platform identity and stable metadata:

- slug
- name
- category
- official URL
- affiliate URL where applicable
- status
- freshness dates

### Evidence Sources

Stores source-level provenance:

- tool slug
- source URL
- source type
- publisher
- captured date
- source quality score
- raw excerpt or reference pointer

### Evidence Items

Stores individual evidence-backed facts or observations:

- tool slug
- evidence type
- extracted claim
- source URL
- confidence
- metadata

### Claims

Stores public claims that may appear in reviews or comparisons:

- tool slug
- category
- claim text
- confidence
- evidence count
- status

### Scores

Stores scored dimensions only when methodology and supporting evidence exist:

- dimension
- score
- evidence claims
- confidence
- scoring version

### Project Audits

Stores user-submitted auditor results separately from public platform reviews:

- project metadata
- static audit result
- recommendations
- privacy/access fields
- share state

### Content Pages

Stores generated drafts and approved public outputs:

- page type
- slug
- title
- content JSON
- status
- quality gate status

### Automation Runs

Stores workflow execution state:

- run type
- input payload summary
- output summary
- quality status
- errors

## Ingestion Flow

1. Evidence enters through curated markdown files, chat exports, official source notes, benchmark runs, or future crawlers.
2. n8n normalizes the payload.
3. LLM extraction proposes structured evidence bundles.
4. A quality gate blocks thin, hype-driven, or unsupported output.
5. Supabase RPC stores the normalized bundle.
6. Public pages read only approved or publishable records.

## Output Flow

Reviews, comparisons, tutorials, and microsites should be generated from:

- approved tools
- evidence items
- claims with evidence counts
- scores with methodology
- quality-gated content drafts

No output should use invented testimonials, pricing, claims, rankings, or review scores.

## Phase 1 Boundary

Phase 1 documents and inventories the system. It does not:

- apply live schemas
- activate n8n
- replace the app frontend
- generate new reviews
- publish automated content
- add payment logic

