# NoCodeReviewed Evidence Brief: Lovable

Framework note: This brief follows the uploaded NoCodeReviewed instruction set: cautious, evidence-first, no invented hands-on results, no invented pricing, and no publication claims without evidence status. 
Last updated: **May 29, 2026**. Official sources accessed May 29, 2026.

## 1. Research Status

**Status: needs-hands-on-testing**

Lovable has enough official documentation to draft a cautious tool profile, pricing page, security questions, autonomy questions, and testing plan. It is **not ready for final review claims** about reliability, code quality, production-readiness, security outcomes, or real-world app quality because NoCodeReviewed has not yet performed hands-on builds.

## 2. Tool Identity

| Field               | Evidence brief                                                                                                                                                                                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tool name           | Lovable                                                                                                                                                                                                                                                               |
| Website             | lovable.dev                                                                                                                                                                                                                                                           |
| Category            | AI app builder / no-code and AI-assisted web app builder                                                                                                                                                                                                              |
| Primary positioning | “Create apps and websites by chatting with AI.” Lovable’s homepage also says users can describe an app or website, watch it become a working prototype, iterate with feedback, and deploy. ([Lovable][1])                                                             |
| Main audience       | Founders, product teams, designers, marketers, operations teams, builders, and non-technical users; official site navigation includes pages for founders, product managers, designers, marketers, sales, ops, people, prototyping, and internal tools. ([Lovable][1]) |
| Main use cases      | Prototypes, web apps, websites, internal tools, app frontends, Supabase-backed apps, published web apps, and AI-enabled app features. ([Lovable][1])                                                                                                                  |

## 3. Official Positioning

### Verified from official source

Lovable positions itself as an AI app builder that lets users create apps and websites through chat. Its homepage says: “Create apps and websites by chatting with AI.” It describes a workflow where the user starts with an idea, describes the app or website, sees a working prototype generated, refines it with feedback, and deploys. ([Lovable][1])

Official docs also describe a development workflow: describe what you want to build, review and iterate on the generated application, sync code to GitHub, then deploy and govern according to your standards. ([Lovable Documentation][2])

### Needs verification

NoCodeReviewed still needs to verify, through hands-on testing, how consistently Lovable can turn vague prompts into working apps, how much correction is required, how secure generated backend logic is, and whether generated projects are maintainable enough for production use.

## 4. Core Product Claims

| Product claim                                                                                                |                                                                                                                        Evidence status | Publication classification                                             |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------: | ---------------------------------------------------------------------- |
| Lovable creates apps and websites by chatting with AI.                                                       |                                                                                 Official homepage supports positioning. ([Lovable][1]) | **Safe to mention**                                                    |
| Lovable can turn a description, screenshots, or docs into a working prototype.                               |                                                                                                Official homepage claim. ([Lovable][1]) | **Safe to mention as official positioning; needs testing for quality** |
| Users can iterate with feedback and deploy.                                                                  |                                                                        Official homepage and publish docs support this. ([Lovable][1]) | **Safe to mention**                                                    |
| Lovable supports Supabase integration for database, auth, storage, realtime, and edge functions.             |                                                                               Official docs support this. ([Lovable Documentation][3]) | **Safe to mention**                                                    |
| Lovable can add authentication through Lovable Cloud or Supabase.                                            |                                                                                             Official FAQ supports this. ([Lovable][4]) | **Safe to mention; implementation quality needs testing**              |
| Lovable supports GitHub sync/export for code backup, collaboration, local IDE work, and external deployment. |                                        Official docs support GitHub sync and code download on paid plans. ([Lovable Documentation][5]) | **Safe to mention**                                                    |
| Lovable apps can be hosted outside Lovable.                                                                  |   Official docs say apps can be hosted anywhere, while the Lovable editor/AI agent cannot be self-hosted. ([Lovable Documentation][6]) | **Safe to mention with caveats**                                       |
| Lovable is production-ready for any business app.                                                            | Official docs describe deployment/security capabilities, but production-readiness depends on generated app, configuration, and review. | **Do not claim yet**                                                   |
| Lovable-generated apps are secure by default.                                                                |                    Official security page claims security scanning and controls, but app-level security must be tested. ([Lovable][7]) | **Needs hands-on testing**                                             |
| Lovable fixes its own errors reliably.                                                                       |                                                                                    Not established by official evidence reviewed here. | **Needs hands-on testing**                                             |
| Lovable is better than Bolt.new, Replit Agent, Cursor, or v0.                                                |                                                                                                 No comparative evidence in this brief. | **Do not claim yet**                                                   |

## 5. Pricing Verification Notes

**Recommended `pricingStatus`: `verified-official-docs-needs-manual-screenshot`**

Lovable’s official docs state that it is a subscription service with a free plan and several paid plans, and that credits are required to send messages in Lovable. ([Lovable Documentation][8])

| Plan area            | Verified notes                                                                                                                                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Free plan            | Official docs say Free includes 5 daily credits, capped at 30 per month; workspace collaboration with unlimited members; and private projects. ([Lovable Documentation][8])                                                                                                                 |
| Pro plan             | Official docs say Pro includes 5 daily credits up to 150/month, monthly credits depending on plan, unlimited workspace collaboration, roles and permissions, private projects, custom domains, ability to remove the “Edit with Lovable” badge, and Code mode. ([Lovable Documentation][8]) |
| Business plan        | Official docs say Business includes everything in Pro plus SSO, restricted workspace projects, opt out of data training, and reusable design templates. ([Lovable Documentation][8])                                                                                                        |
| Exact prices         | Official FAQ/search result says Free is $0, Pro is $25/month, Business is $50/month, Enterprise is custom, and annual billing saves about 16%. This should be manually rechecked on the live pricing page before publication. ([Lovable][9])                                                |
| Cloud / AI usage     | Lovable Cloud docs mention usage-based pricing and a $25 free usage/month temporary offering, subject to change. This requires manual verification before publishing because it is explicitly temporary. ([Lovable Documentation][10])                                                      |
| Manual checks needed | Capture pricing-page screenshot, confirm monthly vs annual toggle, confirm credits per paid tier, confirm rollover rules, confirm Cloud/AI usage costs, confirm custom domain availability by tier, confirm private project rules, confirm data-training opt-out availability.              |

## 6. Security and Production-Readiness Questions

Before NoCodeReviewed calls any Lovable-built app production-ready, answer these through hands-on testing and source review:

| Area                  | Questions to answer                                                                                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication        | Does Lovable create secure signup, login, logout, password reset, session handling, and protected routes? Does it default to Lovable Cloud or Supabase auth?                                                                                  |
| Database rules        | Does it create correct row-level security policies for every user-owned table? Are reads/writes scoped to the authenticated user or role?                                                                                                     |
| API keys              | Does it avoid exposing secrets client-side? Official FAQ says not to enter API keys directly and recommends secrets in Lovable Cloud or Supabase Edge Functions. ([Lovable][4])                                                               |
| Environment variables | Are secrets environment-scoped, encrypted, and hidden from generated frontend code? Official security page claims secrets are encrypted at rest and scoped to environments. ([Lovable][7])                                                    |
| Admin routes          | Are admin pages protected server-side, not just hidden in the UI?                                                                                                                                                                             |
| Role-based access     | Can Lovable correctly implement user, admin, owner, client, and vendor roles? Can NoCodeReviewed bypass routes with direct URLs or API calls?                                                                                                 |
| Payments/webhooks     | Are Stripe or other payment webhooks verified server-side? Are idempotency, signature verification, and failure handling implemented?                                                                                                         |
| Deployment settings   | Are public/private publishing controls clear? Official docs say Free and Pro published apps are accessible to anyone with the link; Business and Enterprise can restrict access to workspace members. ([Lovable Documentation][11])           |
| Error messages        | Do generated apps leak stack traces, table names, keys, user IDs, or implementation details?                                                                                                                                                  |
| Data privacy          | What personal data is sent to Lovable, Supabase, OpenAI, Google, OpenRouter, or other subprocessors? Lovable’s privacy policy says services rely on third-party providers including Supabase, OpenAI, Google, and OpenRouter. ([Lovable][12]) |
| Code ownership/export | Can the code be downloaded and synced to GitHub? Official docs say GitHub sync supports backup, collaboration, local IDE work, and external deployment; paid plans can download the codebase. ([Lovable Documentation][5])                    |
| Manual review         | Does Lovable warn when generated code needs human review? Does its security scanner catch seeded vulnerabilities?                                                                                                                             |

## 7. Autonomy Questions

| Autonomy area    | Questions to measure                                                                                                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Prompt-to-app    | Can Lovable create a working app from a single prompt without manual coding?                                                                                                                                                               |
| Iteration        | Can it correctly interpret feedback such as “make the dashboard client-specific” or “add approval workflow”?                                                                                                                               |
| Multi-page flows | Can it build login, onboarding, dashboard, settings, billing, and admin pages with coherent navigation?                                                                                                                                    |
| Backend logic    | Can it create tables, relationships, policies, functions, and server-side actions without breaking app logic?                                                                                                                              |
| Error fixing     | When an error appears, can Lovable identify root cause and fix it without creating regressions?                                                                                                                                            |
| Deployment       | Can it publish successfully, update published apps, connect domains, and separate preview vs production changes? Official docs say publishing deploys a snapshot and later changes require Publish → Update. ([Lovable Documentation][11]) |
| Human review     | Where does a human need to review architecture, security, database permissions, data handling, generated copy, legal compliance, and billing logic?                                                                                        |

## 8. Likely Strengths

| Strength                                                                            | Label                                                 | Evidence                                                                                                                      |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Fast prompt-based prototyping for apps and websites                                 | Evidence-backed as positioning; quality needs testing | Homepage describes prompt-to-prototype workflow. ([Lovable][1])                                                               |
| Supabase-backed backend path                                                        | Evidence-backed                                       | Docs describe database, auth, storage, realtime, and edge functions via Supabase. ([Lovable Documentation][3])                |
| GitHub sync and code export path                                                    | Evidence-backed                                       | Docs describe GitHub sync, local IDE workflow, external deployment, and paid-plan code download. ([Lovable Documentation][5]) |
| Built-in publishing                                                                 | Evidence-backed                                       | Docs describe publishing to a live URL and updating/unpublishing. ([Lovable Documentation][11])                               |
| Security/compliance documentation is unusually visible for a no-code AI app builder | Evidence-backed                                       | Security page, trust center, DPA, SOC 2/ISO/GDPR references, and security scanner claims are public. ([Lovable][7])           |
| Good fit for early prototypes and internal tool exploration                         | Likely but needs testing                              | Supported by positioning and use-case pages, but performance must be tested.                                                  |

## 9. Likely Limitations

| Limitation                                                         | Label                     | Evidence                                                                                                                                                                                        |
| ------------------------------------------------------------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Production-readiness depends on user review and app configuration  | Evidence-backed / caution | Official docs distinguish publishing from project access, mention plan-based access controls, and security docs describe founder responsibilities. ([Lovable Documentation][11])                |
| Free and Pro published apps are public to anyone with the link     | Evidence-backed           | Publish docs state website access cannot be restricted on Free and Pro plans. ([Lovable Documentation][11])                                                                                     |
| Backend portability may require Supabase-equivalent services       | Evidence-backed           | Deployment docs say plain PostgreSQL migration is not supported out of the box because apps rely on Supabase-specific auth, storage, realtime, and edge functions. ([Lovable Documentation][6]) |
| The Lovable editor/AI agent cannot be self-hosted                  | Evidence-backed           | Deployment docs explicitly say the editor and AI agent are managed services and cannot be self-hosted or deployed inside a customer VPC. ([Lovable Documentation][6])                           |
| Credit limits may constrain testing on Free plan                   | Evidence-backed           | Free plan has 5 daily credits up to 30/month. ([Lovable Documentation][8])                                                                                                                      |
| Generated app security may vary by prompt complexity               | Likely but needs testing  | Official scanner claims exist, but NoCodeReviewed has not tested generated apps.                                                                                                                |
| Complex marketplace/payment workflows may require developer review | Assumption                | Must be tested before publishing.                                                                                                                                                               |

## 10. Safe Claims NoCodeReviewed Can Probably Publish

These are conservative and source-backed:

1. “Lovable is positioned as an AI app builder for creating apps and websites through chat.” ([Lovable][1])
2. “Lovable’s official workflow emphasizes describing what you want to build, reviewing and iterating on the generated app, syncing code to GitHub, and deploying under your own standards.” ([Lovable Documentation][2])
3. “Lovable supports Supabase integration for database, authentication, storage, realtime, and edge functions.” ([Lovable Documentation][3])
4. “Lovable supports GitHub sync for code backup, collaboration, local IDE work, and external deployment.” ([Lovable Documentation][5])
5. “Lovable projects can be published to a live URL; publishing deploys a snapshot, and later changes require publishing an update.” ([Lovable Documentation][11])
6. “Lovable provides public security, privacy, and compliance documentation, including SOC 2 Type II, ISO 27001, GDPR, DPA, data residency, RBAC, and security scanning claims.” ([Lovable][7])

Do **not** publish claims that Lovable is secure, production-ready, better than competitors, or able to replace developers without NoCodeReviewed test evidence.

## 11. Claims That Require Hands-On Testing

Do not publish these as fact yet:

* Lovable can build a complete SaaS dashboard from one prompt.
* Lovable reliably creates secure auth and role-based access.
* Lovable generates correct Supabase RLS policies.
* Lovable can build production-ready marketplace flows.
* Lovable can safely integrate Stripe payments and webhooks.
* Lovable fixes its own bugs without regressions.
* Lovable-generated code is clean, maintainable, and easy for developers to extend.
* Lovable apps perform well under realistic usage.
* Lovable security scanner catches common app vulnerabilities.
* Lovable is easier, faster, or more autonomous than Bolt.new, Replit Agent, Cursor, v0, Bubble AI, or FlutterFlow AI.

## 12. Recommended Lovable Microsite Pages

| Page                             | Recommended evidence content                                                                                         |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `/tools/lovable`                 | Neutral tool overview, official positioning, use cases, evidence status, and links to testing pages.                 |
| `/tools/lovable/review`          | Evidence-based review draft only after hands-on testing. Before testing, show “review in progress.”                  |
| `/tools/lovable/pricing`         | Pricing table from official pricing/docs, screenshots, credit explanations, Cloud/AI usage notes, last-checked date. |
| `/tools/lovable/security`        | Security claims from official docs, production-readiness checklist, RLS/auth/API key test results once available.    |
| `/tools/lovable/autonomy`        | Autonomy scorecard: prompt-to-app, iteration, backend, debugging, deployment, human review.                          |
| `/tools/lovable/test-lab`        | Test methodology, test builds, evidence screenshots, generated code notes, pass/fail criteria.                       |
| `/tools/lovable/prompts`         | Starter prompts used in NoCodeReviewed tests, with clear labels that results may vary.                               |
| `/tools/lovable/templates`       | Official template categories and NoCodeReviewed template test outcomes after testing.                                |
| `/tools/lovable/alternatives`    | Comparison map by workflow: prompt app builders, agentic IDEs, visual builders, frontend generators.                 |
| `/tools/lovable/vs/bolt-new`     | Focus on browser-based app generation, backend/deployment workflow, code access, autonomy, security review.          |
| `/tools/lovable/vs/replit-agent` | Focus on agentic full-stack building, hosting, debugging, database, logs, deployment.                                |
| `/tools/lovable/vs/cursor`       | Focus on no-code chat builder vs developer IDE, control, code editing, maintainability.                              |
| `/tools/lovable/final-verdict`   | Publish only after test lab completion and human approval gate. Include “best for / not for” cautiously.             |

## 13. Testing Plan

### Test 1: SaaS dashboard

| Field                       | Plan                                                                                                                                                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test goal                   | Build a multi-tenant SaaS dashboard with login, user-specific data, admin view, billing placeholder, and charts.                                                                                                                  |
| Starter prompt              | “Build a SaaS analytics dashboard for small agencies. Include signup/login, onboarding, dashboard metrics, client projects, team members, billing settings, and an admin-only user management page. Use a clean B2B SaaS design.” |
| What to measure             | Pages generated, auth flow, data model, RLS, admin protection, UI consistency, error rate, iteration count, deployment success.                                                                                                   |
| Evidence to capture         | Initial prompt, generated app screenshots, database schema, RLS policies, auth settings, error logs, deploy URL, generated code snippets.                                                                                         |
| Security checks             | Try accessing another user’s data; direct-load admin routes; inspect client bundle for keys; test logout/session expiry.                                                                                                          |
| Production-readiness checks | Custom domain path, environment separation, error handling, empty states, loading states, mobile layout, analytics/privacy notices.                                                                                               |
| Failure signs               | Public admin data, missing RLS, fake auth, exposed keys, broken deploy, nonfunctional forms, hardcoded sample data presented as real.                                                                                             |

### Test 2: Client portal

| Field                       | Plan                                                                                                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test goal                   | Build a secure client portal with file/document areas, project status, comments, and client-specific access.                                                                |
| Starter prompt              | “Create a client portal for a design agency. Clients should log in, see only their projects, upload files, comment on milestones, approve deliverables, and view invoices.” |
| What to measure             | Tenant isolation, upload handling, comments, approval states, role separation, database rules.                                                                              |
| Evidence to capture         | Client A vs Client B screenshots, storage rules, table policies, route list, generated code.                                                                                |
| Security checks             | Cross-client URL guessing, file access tests, role escalation, upload type/size controls.                                                                                   |
| Production-readiness checks | Audit trail, file deletion behavior, backups, notification logic, privacy copy.                                                                                             |
| Failure signs               | Shared file visibility, missing approval persistence, unprotected routes, insecure uploads.                                                                                 |

### Test 3: Marketplace MVP

| Field                       | Plan                                                                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test goal                   | Test whether Lovable can handle multi-sided marketplace logic.                                                                                                                        |
| Starter prompt              | “Build a local services marketplace where customers can browse providers, book services, message providers, leave reviews, and where providers can manage listings and availability.” |
| What to measure             | Data relationships, booking state machine, user roles, search/filter quality, messaging model, review permissions.                                                                    |
| Evidence to capture         | Schema diagram, generated pages, booking flow screenshots, role tests, code snippets.                                                                                                 |
| Security checks             | Provider/customer role bypass, review fraud prevention, message privacy, booking manipulation.                                                                                        |
| Production-readiness checks | Payment readiness, dispute handling placeholders, moderation tools, email notifications.                                                                                              |
| Failure signs               | Users can edit others’ listings, fake bookings, inconsistent booking states, exposed messages.                                                                                        |

### Test 4: Internal CRM

| Field                       | Plan                                                                                                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test goal                   | Build an internal CRM with role-based access, pipeline stages, notes, tasks, and reporting.                                                                                       |
| Starter prompt              | “Build an internal CRM for a B2B sales team. Include leads, companies, contacts, pipeline stages, notes, tasks, owner assignment, manager reporting, and role-based permissions.” |
| What to measure             | CRUD reliability, role permissions, data filtering, table design, dashboard accuracy, update flows.                                                                               |
| Evidence to capture         | Lead lifecycle screenshots, schema, RLS rules, manager vs rep access, error logs.                                                                                                 |
| Security checks             | Rep tries to access another rep’s leads; manager permissions; direct API calls; exposed internal notes.                                                                           |
| Production-readiness checks | CSV import/export, duplicate handling, audit trail, backups, search, permissions management.                                                                                      |
| Failure signs               | Broken CRUD, missing role logic, incorrect dashboard counts, no data isolation.                                                                                                   |

### Test 5: AI content tool

| Field                       | Plan                                                                                                                                                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Test goal                   | Test AI feature integration inside a Lovable-built app.                                                                                                                                                                |
| Starter prompt              | “Build an AI content brief generator for SEO teams. Users enter a keyword, audience, and competitor URLs. The app generates a content outline, title ideas, FAQ questions, and stores each brief in a user dashboard.” |
| What to measure             | AI connector behavior, model configuration, prompt handling, storage, rate limits, cost visibility, privacy warnings.                                                                                                  |
| Evidence to capture         | AI setup screens, generated output, stored briefs, secrets configuration, usage/cost notes.                                                                                                                            |
| Security checks             | Prompt injection, user data leakage, exposed model keys, unauthorized brief access.                                                                                                                                    |
| Production-readiness checks | Usage limits, retry/failure handling, moderation, export, cost guardrails.                                                                                                                                             |
| Failure signs               | API keys in frontend, hallucinated competitor data presented as verified, no cost limits, shared private briefs.                                                                                                       |

## 14. Comparison Candidates

| Competitor     | Comparison focus                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Bolt.new       | Prompt-to-full-stack app generation, browser dev environment, code visibility, deployment, backend integrations.         |
| Replit Agent   | Agentic coding, debugging, hosting, logs, database setup, production deployment workflow.                                |
| Cursor         | Developer-centric AI coding versus Lovable’s chat/no-code workflow; code control, maintainability, team engineering fit. |
| v0 by Vercel   | Frontend/UI generation, React/Next.js workflow, design fidelity, handoff to developer deployment.                        |
| Bubble AI      | Visual no-code app building, database/workflow control, plugin ecosystem, production app maturity.                       |
| FlutterFlow AI | Cross-platform/mobile app building, Firebase/Supabase integrations, visual development, export options.                  |

## 15. Source Notes

### Official sources used

| Source category            | Source                       | Notes                                                                                                                                  |
| -------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Official homepage          | Lovable homepage             | Positioning, workflow, template examples, audience signals. ([Lovable][1])                                                             |
| Official pricing/docs      | Plans and credits            | Free/Pro/Business feature and credit notes. ([Lovable Documentation][8])                                                               |
| Official FAQ               | Lovable FAQ                  | Auth, backend, APIs, API key cautions, compliance FAQ. ([Lovable][4])                                                                  |
| Official docs              | Supabase integration         | Database, auth, storage, realtime, edge functions. ([Lovable Documentation][3])                                                        |
| Official docs              | GitHub integration           | Code sync, backup, collaboration, local IDE, external deployment, code download. ([Lovable Documentation][5])                          |
| Official docs              | Publishing                   | Live URL publishing, access controls, publish snapshots, unpublish/update behavior. ([Lovable Documentation][11])                      |
| Official docs              | Deployment/hosting/ownership | Lovable Cloud, external hosting, self-managed infrastructure, portability caveats. ([Lovable Documentation][6])                        |
| Official security page     | Security at Lovable          | SSO/RBAC, secrets, data residency, data training, scanning, WAF, compliance claims. ([Lovable][7])                                     |
| Official privacy/DPA       | Privacy Policy and DPA       | Third-party providers, security measures, breach notification, SOC 2/ISO report access. ([Lovable][12])                                |
| Official AI connector docs | AI features for your app     | Built-in AI features, supported use cases, permission preferences, default model for in-app AI features. ([Lovable Documentation][13]) |

### Third-party / anecdotal sources

Not used for conclusions in this brief. Future research should include reputable third-party security coverage, developer reviews, user reports, and community complaints, clearly labeled as anecdotal unless independently verified.

## 16. Final Recommendation

NoCodeReviewed should proceed with a **Lovable microsite foundation**, but publish it as an evidence-backed research hub rather than a final verdict. The next required steps are:

1. Capture dated screenshots of Lovable pricing and plan limits.
2. Run the five hands-on builds above.
3. Archive prompts, screenshots, schema, generated code, errors, and deployment results.
4. Perform security review for auth, RLS, API keys, admin routes, and published access.
5. Add a human approval gate before publishing any “review,” “security,” “autonomy,” or “final verdict” claims.

[1]: https://lovable.dev/ "AI App Builder | Vibe Code Apps & Websites with AI, Fast"
[2]: https://docs.lovable.dev/introduction/welcome "Welcome to Lovable - Lovable Documentation"
[3]: https://docs.lovable.dev/integrations/supabase "Connect to Supabase - Lovable Documentation"
[4]: https://lovable.dev/faq/getting-started/lovable-ai-cost "FAQ - Lovable Documentation"
[5]: https://docs.lovable.dev/integrations/github "Connect to GitHub - Lovable Documentation"
[6]: https://docs.lovable.dev/tips-tricks/deployment-hosting-ownership "Deployment, hosting, and ownership options with Lovable Cloud - Lovable Documentation"
[7]: https://lovable.dev/security "Security at Lovable | Build Apps Faster"
[8]: https://docs.lovable.dev/introduction/plans-and-credits "Plans and credits - Lovable Documentation"
[9]: https://lovable.dev/faq/getting-started/lovable-ai-cost?utm_source=chatgpt.com "What is the cost of Lovable AI?"
[10]: https://docs.lovable.dev/integrations/cloud "Lovable Cloud - Lovable Documentation"
[11]: https://docs.lovable.dev/features/publish "Publish your Lovable project - Lovable Documentation"
[12]: https://lovable.dev/privacy "Lovable Privacy Policy"
[13]: https://docs.lovable.dev/integrations/ai "AI features for your app - Lovable Documentation"
