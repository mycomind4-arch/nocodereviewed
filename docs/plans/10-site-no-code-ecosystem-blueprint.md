# 10-Site No-Code Ecosystem Blueprint

This blueprint consolidates the project docs into one operating plan for the No-Code Empire: a 10-site affiliate/content ecosystem powered by a shared no-code review engine, programmatic SEO, quality control, monetization intelligence, audience tracking, CRO testing, and a unified admin layer.

## Strategic Refocus

The ecosystem should now focus primarily on vibe coding and AI app-builder platforms: Lovable, Bolt.new, Replit Agent, v0, Cursor, Base44, Windsurf, and the wider 28-tool category map.

Traditional no-code tools still matter, but they are supporting context. The authority position is:

> The best independent testing lab and buying guide for AI app builders, vibe coding tools, and production-ready no-code/AI software creation.

The autonomous blog system for this refocus lives at `docs/plans/vibe-coding-authority-autonomous-blog-system.md`.

## Revision Principles

This revision keeps the 10-site ambition, but changes the operating logic:

1. Prove one site before multiplying the pattern.
2. Treat automation as production assistance, not a substitute for original judgment.
3. Prioritize first-hand review evidence, screenshots, pricing checks, tool testing notes, and transparent methodology.
4. Avoid tactics whose only purpose is ranking manipulation.
5. Add gates so the network cannot scale while quality, indexing, monetization, or trust signals are weak.

The best version of this project is not "10 AI affiliate sites." It is a focused no-code research network with useful tools, repeatable testing, current data, and clear editorial standards.

## Executive Shape

The ecosystem should be built as one repeatable site operating system, not 10 unrelated websites.

Site 1 is the anchor: No-Code Platform Reviews. It proves the schema, content engine, pSEO templates, affiliate tracking, dashboard, automations, author persona model, and quality gateway.

Sites 2-10 are focused vertical sites. Each gets its own domain, Lovable project, Supabase instance, SITE_ID, author persona, voice baseline, keyword queue, and niche-specific tool database. They reuse the same engine stack and report into the same network dashboard.

Do not launch all 10 sites just because the docs define all 10. Launch only when the previous site has passed the network expansion gate.

Recommended order:

1. Site 1: Platform Reviews.
2. Site 2: Automation.
3. Site 5: AI Integration.
4. Site 4: Ecommerce.
5. Site 3: Database/Backend.
6. Sites 6-10 only after the first five prove the model.

This order favors the verticals with the clearest affiliate intent, strongest tool ecosystems, and most obvious interactive-tool opportunities.

## The 10 Sites

| Site | Vertical | Primary Angle | Best Domain Profile | Main Money Pages |
| --- | --- | --- | --- | --- |
| 1 | Platform Reviews | Broad no-code platform reviews and comparisons | Former SaaS review blogs, software comparison sites, best-tools sites | Reviews, comparisons, alternatives, pricing, best-of lists |
| 2 | Automation | Zapier, Make, n8n, workflow automation, productivity systems | Former Zapier/Make tutorial blogs, workflow automation communities | Tool reviews, integration pages, workflow tutorials |
| 3 | Database/Backend | Airtable, Supabase, Xano, Baserow, backend builders | Former no-code backend/dev blogs, Airtable/Notion communities | Backend comparisons, database alternatives, app-stack guides |
| 4 | Ecommerce | Shopify, Webflow Ecommerce, no-code storefronts, checkout tools | Former ecommerce tool review sites, Shopify alternative blogs | Platform reviews, fee calculators, ecommerce stack pages |
| 5 | AI Integration | AI builders, chatbots, no-code AI automation, agent workflows | Former AI tools directories or AI/no-code crossover blogs | AI tool reviews, AI workflow tutorials, chatbot builder comparisons |
| 6 | Agencies | No-code tools for agencies, freelancers, service businesses | Former agency resource sites, web design tool review blogs | Client workflow stacks, agency toolkits, proposal/client portal tools |
| 7 | Analytics/SEO | No-code analytics, SEO tools, rank tracking, dashboards | Former SEO tool comparison sites, analytics review blogs | Analytics reviews, SEO stack comparisons, reporting dashboard tools |
| 8 | SaaS Founders | Founder stacks, MVP builders, productized SaaS no-code tools | Former indie hacker or SaaS bootstrapper blogs | MVP builder comparisons, startup stack guides, founder tutorials |
| 9 | Design/UI | Webflow, Framer, Figma-adjacent tools, UI builders | Former Figma alternative blogs, design tool review sites | Builder comparisons, design-to-site workflows, template/tool roundups |
| 10 | Solopreneurs | One-person business stacks, simple automations, creator tools | Former solopreneur tool-stack or tools-I-use blogs | Stack guides, budget tools, simple workflow tutorials |

## Shared Site Operating System

Every site should use the same core architecture:

1. Lovable-built frontend and admin UI.
2. Supabase database, auth, scheduled jobs, and edge functions.
3. Vercel deployment.
4. Resend for alerts/newsletter.
5. LLM Abstraction Layer for all model calls.
6. Content Engine for original articles.
7. Quality Gateway before anything publishes.
8. pSEO Engine for scalable long-tail pages.
9. Monetization Engine for affiliate click tracking and offer priority.
10. Audience Engine for first-party behavioral data.
11. CRO Engine after at least two weeks of audience baselines.
12. Smart Admin Dashboard as the unified command center.
13. Execution Integrity Engine as the verification/self-healing layer.
14. n8n workflow stack for off-site automation, link building, auditing, and social distribution.

Every site should also have a local evidence layer:

1. Tool testing notes.
2. Screenshots or screen recordings.
3. Pricing verification history.
4. Changelog of major review updates.
5. Clear disclosure of affiliate relationships.
6. Editorial methodology tied to actual scoring dimensions.

Without this evidence layer, the network risks becoming a polished wrapper around generic summaries.

## Engine Install Order

Do not install engines randomly. The docs imply this dependency chain:

1. Base schema and tool database.
2. Evidence and methodology tables.
3. LLM Abstraction Layer.
4. Content Engine.
5. Quality Gateway.
6. Smart Admin Dashboard.
7. pSEO Engine.
8. Monetization Engine.
9. Audience Engine.
10. CRO Engine, only after two weeks of audience baseline data.
11. Execution Integrity Engine.

The Evidence layer should exist before the Content Engine scales. Reviews should be able to cite tool tests, screenshots, pricing checks, and methodology notes from the database.

## Site 1 Build Spec

Site 1 should be the canonical build. It already has the clearest prompt in `docs/prompts/site1_lovable_build_prompt.md`.

Core routes:

| Route Type | Pattern | Purpose |
| --- | --- | --- |
| Home | `/` | Search-first entry into reviews, comparisons, best lists, and categories |
| Review | `/reviews/[tool]` | Main affiliate money page for each tool |
| Comparison | `/compare/[tool-a]-vs-[tool-b]` | Buyer-intent comparison page |
| Alternatives | `/[tool]-alternatives` | Commercial alternative queries |
| Pricing | `/[tool]-pricing` | Transactional pricing queries |
| Best by category | `/best-[category]` | Category roundup pages |
| Best by use case | `/best-[category]-for-[use-case]` | Programmatic use-case pages |
| Integrations | `/integrate/[tool-a]-[tool-b]` | Best for automation-focused sites |
| Articles | `/blog/[slug]` | Content Engine editorial pieces |
| Tools directory | `/tools` | Database browsing and internal-link hub |
| Methodology | `/methodology` | E-E-A-T and review process |
| Author | `/author/[persona]` | Persona authority footprint |
| Admin | `/admin` and `/content-admin` | Private operations layer |

Site 1 should include the interactive tools already present in `src/components`: recommendation wizard, ROI calculator, platform finder, comparison matrix, pricing tracker, runway calculator, tech stack builder, project planner, microtool directory, template library, and success story database.

## Programmatic SEO System

pSEO is the scale layer. It should assemble pages from structured data, not generate prose for every page.

pSEO should be capped at first. Do not open the full page floodgate on a new domain.

Recommended Site 1 sequence:

1. Publish 25 manually reviewed tool pages.
2. Publish 25 comparison/alternative pages.
3. Wait for indexing and quality signals.
4. Expand to 200 pSEO pages.
5. Expand beyond 200 only if indexed pages receive impressions, users engage, and quality checks pass.

Required structured data per tool:

- Name, slug, tagline, logo, website URL, affiliate URL.
- Categories and tags.
- Pricing tiers and free plan details.
- Rating dimensions.
- Pros and cons.
- Best-for audiences.
- Integrations.
- Verdict and review summary.

Page families:

| Family | Example | Primary Intent |
| --- | --- | --- |
| Tool vs tool | `/compare/webflow-vs-framer` | Commercial buyer comparison |
| Alternatives | `/webflow-alternatives` | Commercial switching query |
| Pricing | `/webflow-pricing` | Transactional price check |
| Category best | `/best-website-builders` | Commercial discovery |
| Use case | `/best-website-builders-for-agencies` | Commercial niche fit |
| Industry | `/no-code-tools-for-real-estate` | Vertical discovery |
| Integrations | `/integrate/airtable-zapier` | Automation stack query |
| Free tools | `/free-website-builders` | Email capture and top-funnel |
| Pros and cons | `/webflow-pros-and-cons` | Consideration-stage search |
| Beginner tutorial | `/how-to-use-webflow` | E-E-A-T and informational authority |

Every pSEO page should link to the deeper Content Engine article when it exists. If no deep article exists and the pSEO page gets impressions, the Monetization Engine should inject the matching review/comparison into the keyword queue.

Suppress pSEO pages when data is thin. A tool must meet the minimum data completeness threshold before it can produce pricing, comparison, alternatives, or best-of pages.

## Content Cluster Model

The docs are explicit: do not publish isolated articles at scale. Publish clusters.

Each cluster should include:

- One pillar article.
- Three to five supporting tutorials or best-of pages.
- Two to three tool reviews.
- One comparison page.
- Internal links added before the cluster goes live.

The workflow should check that every new article has at least three internal links and that the cluster links back to its pillar page before publication.

## Quality Rules

All articles and pSEO pages pass through the Quality Gateway.

Pre-gate checks:

- Hallucinated tool/pricing claims against the tools table.
- Banned phrase detection.
- Duplicate detection.
- Structural minimums by article type.

Gateway dimensions:

- Specificity.
- Verdict clarity.
- Original angle.
- Limitations.
- Structure.
- No banned phrases.
- Voice drift.
- Pricing accuracy.
- Footprint signal.
- Conversion fit.

Default pass threshold: 72 out of 106 for original articles. pSEO can use a lower threshold around 60 because pages are template-assembled and intentionally thinner.

Add three hard gates before publication:

1. Evidence gate: review/comparison pages must include at least one evidence record, such as a test note, screenshot, pricing check, or cited tool data source.
2. Disclosure gate: pages with affiliate links must include clear affiliate disclosure.
3. Originality gate: pages must add a verdict, decision framework, or tested finding that is not merely a summary of tool marketing copy.

If a page cannot pass these gates, it should stay draft.

## Monetization System

The monetization layer should use affiliate revenue first, then sponsored placements, newsletter ads, and paid templates/tools later.

Core mechanics:

- Track every affiliate click by page, article type, tool, click position, and session.
- Maintain `affiliate_links.monetization_priority`.
- Score offers by commission rate, cookie window, recurring structure, and stability.
- Calculate Revenue Efficiency Score for monetized pages.
- Detect monetization gaps weekly.
- Inject high-value missing review/comparison keywords into the Content Engine queue.
- Audit affiliate links weekly.

Affiliate application priority:

1. PartnerStack.
2. Impact.
3. ShareASale.
4. Direct programs: Webflow, Framer, Bubble, Shopify.
5. CJ/Paddle/Lemon Squeezy and tool-specific direct programs.

## Audience And CRO Loop

Audience Engine captures first-party behavior with no third-party tracking dependency:

- Page enter.
- Scroll depth.
- Time on page.
- Affiliate clicks.
- Newsletter signup.
- Internal-link clicks.
- Page exit.

It segments readers by traffic source, engagement tier, and content affinity.

CRO Engine starts only after two weeks of baseline data. It should test one element at a time: CTA placement, CTA copy, headline, article structure, offer positioning, or pSEO template section. Winners go into `cro_pattern_library`, and the Content Engine should reference those patterns before generating new articles.

## Authority And E-E-A-T

Before content scales, every site needs:

- A named author or transparent editorial identity.
- Author page.
- Methodology page.
- LinkedIn profile with real activity if there is a real person behind the author.
- Twitter/X profile if it can be maintained honestly.
- GitHub profile for Sites 2, 3, 5, and 8 only if there is real technical activity to show.
- Two or three external posts on Medium or LinkedIn only if they represent genuine editorial work.
- Clear affiliate disclosure.
- Last-verified dates on reviews, pricing pages, and comparisons.

Do not invent fake credentials, fake companies, fake testing history, or fake social proof. If the network uses editorial pen names, the methodology page should be honest about how research, testing, AI assistance, and human review work.

The goal is not fake polish. The goal is that each site behaves like a real editorial property with a real review process.

## Domain And Link Strategy

Domain acquisition comes before build work.

Primary domain target per site:

- DR 15-35.
- 20-100 referring domains.
- Topically relevant tech/SaaS/no-code history.
- Indexed within the last 24 months.
- No manual actions.
- Moz spam score under 5 percent.
- Anchor diversity with no keyword over 30 percent.

Risk revision:

- Expired domains are acceptable only when the new site is topically aligned with the domain's history and users would not be misled.
- Do not buy unrelated expired domains for authority transfer.
- Do not create a hidden network of low-value sites to disguise scaled content.
- Do not use redirect domains as the primary growth lever.

Redirect layer, if used conservatively:

- Buy cheap tool-specific expired domains when relevant.
- 301 them only to genuinely relevant review, comparison, or alternatives pages.
- Track domain, DR, target URL, and acquisition date.
- Do not build content on redirect domains.
- Cap this tactic until Site 1 has proven organic traction from its own content.

Link acquisition:

- HARO/Connectively expert responses using site personas.
- BrightLocal/Whitespark citation submissions on launch.
- Medium, LinkedIn, Substack, and Quora-derived republishing with canonical links.
- Monthly press releases.
- Broken-link outreach.
- Scholarship page on Site 1 for .edu outreach.

Link acquisition should be relevance-first. If a link tactic would look strange to a real reader or journalist, skip it.

## n8n Workflow Map

The docs refer to 15 workflows. This is the clean operating map:

| Workflow | Purpose |
| --- | --- |
| WF-01 | Generate content from keyword queue |
| WF-02 | Publish clusters only after internal links pass checks |
| WF-03 | Weekly pricing verification |
| WF-04 | Parasite SEO republishing to Medium/LinkedIn/Substack |
| WF-05 | HARO/Connectively response drafting |
| WF-06 | Monthly press release automation |
| WF-07 | Social automation for author personas |
| WF-08 | Performance, ranking, and GSC monitoring |
| WF-09 | Broken-link outreach |
| WF-10 | Newsletter assembly and send |
| WF-11 | Sitemap regeneration and IndexNow ping |
| WF-12 | Affiliate link auditor |
| WF-13 | 301 redirect domain auditor |
| WF-14 | Competitor backlink monitor |
| WF-15 | System health and emergency alert digest |

Automation safety limits:

- WF-01 cannot publish directly until the Quality Gateway and Evidence gate pass.
- WF-02 cannot publish partial clusters.
- WF-04 should create rewritten, shorter companion posts with canonical/source links, not copied duplicates.
- WF-05 should draft journalist responses but require human approval before sending.
- WF-07 should cap social posting so personas do not look automated.
- WF-12 and WF-15 are mandatory before affiliate content scales.

## Rollout Sequence

### Phase 0: Pre-Build

- Acquire/vet domains for all 10 sites.
- Create required accounts.
- Submit affiliate applications.
- Create all author persona footprints.
- Prepare environment variables and API keys.

### Phase 1: Anchor Site

- Build Site 1 with Lovable using the existing Site 1 prompt.
- Run base Supabase schema.
- Seed 100 tools.
- Build public routes and admin routes.
- Add pSEO templates.
- Add interactive tools.
- Deploy to Vercel.
- Configure Resend, GSC, GA, and UptimeRobot.
- Build n8n WF-01 through WF-15.
- Verify end to end before publishing at scale.

### Phase 2: SEO And Trust Infrastructure

- Implement schema markup.
- Split sitemap by content type.
- Add IndexNow.
- Add methodology and author pages.
- Start citation submissions.
- Publish first external persona posts.
- Set up pricing verification and page-speed monitoring.

### Phase 3: Controlled Content Launch

- Publish the first complete content cluster.
- Keep output conservative until quality pass rates, indexing, and affiliate tracking are proven.
- Watch gateway failures, pricing gaps, impressions, and click behavior.
- Tune prompts and pSEO templates.

Controlled launch gate:

- 20 published pages indexed.
- 10 reviews include evidence records.
- Affiliate click tracking verified.
- Sitemap and IndexNow verified.
- No unresolved Quality Gateway systemic failure.
- At least one full pricing verification cycle completed.

### Phase 4: Network Expansion

- Clone the operating system to Sites 2-10 on a rolling two-week cadence.
- Each site gets its own identity block, voice baseline, tools database, keywords, and persona.
- Start with the verticals most likely to monetize: Automation, AI Integration, Ecommerce, then Database/Backend.

Network expansion gate:

- Site 1 has at least 60 indexed pages.
- Search Console shows impressions across at least three page families.
- Gateway pass rate is between 65 percent and 85 percent.
- At least 20 percent of reviews have human/evidence enrichment.
- No unresolved broken affiliate links.
- At least one monetization gap has been detected and resolved.
- Site 1 can run for two weeks without manual emergency repair.

Do not launch another site until this gate passes. The worst failure mode is cloning a weak system nine times.

### Phase 5: Optimization And Scale

- Activate Audience Engine.
- Wait two weeks.
- Activate CRO Engine.
- Use Monetization Engine gaps to guide new content.
- Use pSEO impressions to trigger deeper articles.
- Use Execution Integrity Engine to detect schema drift, route failures, broken workflows, and missing dependencies.

## Build Priorities

If everything feels too big, build in this order:

1. Site 1 public site and admin.
2. Tool database, evidence tables, and affiliate link tracking.
3. Review/comparison/best-of routes.
4. Methodology, author/editorial identity, disclosure, and pricing verification.
5. Content Engine and Quality Gateway.
6. Conservative pSEO pages.
7. n8n workflows for publishing, pricing checks, sitemap, affiliate audit, and alerts.
8. Monetization Engine.
9. Audience Engine.
10. CRO Engine.
11. Sites 2-10.

## Immediate Next Actions

1. Treat `docs/prompts/site1_lovable_build_prompt.md` as the anchor build prompt.
2. Merge the current component inventory into Site 1 as interactive lead magnets.
3. Create one master Supabase schema that includes engine tables from Content, Gateway, pSEO, Monetization, Audience, CRO, LLM, Integrity, and Evidence docs.
4. Create a per-site identity sheet for all 10 sites, but only activate Site 1.
5. Turn the 15 n8n workflows into importable workflow specs with safety gates.
6. Build Site 1 first and freeze the template before cloning.
7. Add launch-gate dashboards so scaling cannot happen accidentally.

## What I Would Cut Or Delay

Cut for now:

- Aggressive exact-match-domain buying.
- Full 50,000-page pSEO expansion.
- Any fake persona footprint.
- Any workflow that publishes, posts, or emails externally without approval before trust is proven.

Delay:

- Sites 6-10.
- CRO Engine until there is enough audience data.
- Sponsored content until the first site has credibility.
- Large-scale redirect-domain acquisition until organic traction is real.

Keep:

- Site 1 anchor build.
- Interactive tools.
- Tool database.
- Quality Gateway.
- Pricing verification.
- Conservative pSEO.
- Affiliate tracking.
- Evidence-based reviews.
- Network dashboard.
