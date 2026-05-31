# 26 — WeWeb Evidence File

Created: May 30, 2026  
Access date for live-source checks: May 30, 2026  
Public brand: NoCodeReviewed  
Evidence status: `in-progress — official AI, homepage, pricing-update, deployment/export, and production-positioning sources found; hands-on backend/auth/security/code-export testing required before publication`

## 1) Tool Identity

| Field | Evidence note |
|---|---|
| Tool | WeWeb AI / WeWeb |
| Vendor / maintainer | WeWeb |
| Product category | AI-assisted no-code / visual web-app builder with code export and backend integrations |
| Primary user | Founders, product teams, agencies, technical operators, and businesses building SaaS apps, portals, internal tools, directories, and custom web apps |
| Core posture | Prompt-to-working-app generation followed by full visual editing, backend/data/auth/workflow configuration, deployment, and Vue.js code export/self-hosting |
| Current evidence confidence | High for official AI/product positioning, code-export claims, deployment posture, and pricing-update source; medium for pricing details because separate pricing page was not fully extractable; low for production/security because no NoCodeReviewed hands-on benchmark exists yet |

## 2) Official Positioning

WeWeb’s homepage says:

> “Build Web-Apps 10x Faster with AI & No-Code.”

Source URL: https://www.weweb.io/  
Source type: Official homepage  
Accessed: May 30, 2026

WeWeb’s AI product page says:

> “Prompt WeWeb AI to build your app. See it, edit it, scale it.”

Source URL: https://www.weweb.io/product/ai  
Source type: Official AI product page  
Accessed: May 30, 2026

## 3) Official Claims With URLs and Access Dates

| Claim | Evidence category | Source | Access date | Publication status |
|---|---|---|---|---|
| WeWeb is a visual development platform powered by AI for building custom applications without coding experience | Official homepage | https://www.weweb.io/ | May 30, 2026 | Safe if attributed; production-readiness requires testing |
| WeWeb AI goes from prompt to working app, then lets users fine-tune pixels, queries, and workflows in a drag-and-drop editor | Official AI page | https://www.weweb.io/product/ai | May 30, 2026 | Safe if attributed; output quality requires testing |
| WeWeb AI works with app context including components, data, auth, and workflows | Official AI page | https://www.weweb.io/product/ai | May 30, 2026 | Safe if attributed; must test correctness |
| WeWeb AI generated outputs can be edited in the visual editor | Official AI page | https://www.weweb.io/product/ai | May 30, 2026 | Safe if attributed |
| WeWeb lets users add custom JavaScript, CSS, or Vue.js components | Official AI page/homepage | https://www.weweb.io/product/ai and https://www.weweb.io/ | May 30, 2026 | Safe if attributed |
| WeWeb says every paid plan includes Vue.js code export at no extra cost | Official AI page | https://www.weweb.io/product/ai | May 30, 2026 | Safe after final pricing recheck |
| WeWeb can deploy on WeWeb CDN or export a Vue.js single-page application and self-host | Official AI page/homepage | https://www.weweb.io/product/ai and https://www.weweb.io/ | May 30, 2026 | Safe if attributed; export quality must be tested |
| WeWeb says it does not charge per app user | Official homepage | https://www.weweb.io/ | May 30, 2026 | Safe if attributed; pricing fine print still required |
| WeWeb says it can connect to APIs and databases such as Airtable, Xano, and Supabase | Official homepage | https://www.weweb.io/ | May 30, 2026 | Safe if attributed; specific integration behavior must be tested |
| WeWeb February 13, 2025 changelog announced updated pricing structure | Official changelog | https://www.weweb.io/changelog/2025-02-13-pricing | May 30, 2026 | Useful pricing-change context |
| Separate pricing page identified as April 2026 update | Official pricing page | https://pricing.weweb.io/ | May 30, 2026 | Exact current pricing needs capture/verification |

## 4) Pricing Notes

| Pricing item | Evidence note | Source | Status |
|---|---|---|---|
| Start free | AI page says users can start building for free and pay when ready to publish | https://www.weweb.io/product/ai | Official, needs account/pricing verification |
| Paid plans include code export | AI page says every paid plan includes Vue.js code export at no extra cost | https://www.weweb.io/product/ai | Official, needs final pricing recheck |
| No per-app-user charge | Homepage says WeWeb does not charge per app user | https://www.weweb.io/ | Official claim; verify plan fine print |
| Pricing update | Changelog announced updated pricing structure on February 13, 2025 | https://www.weweb.io/changelog/2025-02-13-pricing | Official historical context |
| April 2026 pricing page | Separate pricing page surfaced as April 2026 update but extract was limited | https://pricing.weweb.io/ | Needs manual capture |
| Token/AI usage | Pricing snippets referenced token bundles, but exact plan matrix not safely captured | https://pricing.weweb.io/ | Unknown — needs verification |
| Backend cost | WeWeb is frontend/visual app layer with backend integrations; external backend/API costs may apply | Official integration/deployment posture | Needs benchmark |
| Enterprise | Enterprise path implied by product positioning; exact terms not captured | Needs sales verification | Unknown — needs verification |

Pricing status: `official pricing sources found but exact plan matrix not fully captured — current tier prices, token limits, app/project limits, hosting limits, code-export availability, seats, and Enterprise terms must be verified before publication`.

Pricing caution: WeWeb may avoid per-app-user fees, but total cost can include WeWeb plan, AI/token usage, backend service such as Xano/Supabase, database hosting, API providers, authentication, file storage, CDN/hosting, custom code maintenance, and implementation services.

## 5) Security / Production-Readiness Notes

| Topic | Evidence note | Source | Publication caution |
|---|---|---|---|
| Frontend/backend separation | Homepage says WeWeb’s modular architecture connects to preferred stack and can connect internal databases without replication | https://www.weweb.io/ | Security depends heavily on backend/API/auth configuration |
| Code export | AI page says paid plans can export Vue.js SPA and self-host | https://www.weweb.io/product/ai | Exported code must be reviewed/build-tested |
| Auth/context | AI page says WeWeb AI works with app context including auth and role-based access | https://www.weweb.io/product/ai | Must test permissions; do not assume AI config is correct |
| Production positioning | Homepage and AI page repeatedly say production-grade/production-ready | https://www.weweb.io/ and https://www.weweb.io/product/ai | Treat as vendor claim until benchmark passes |
| Data integrations | Homepage mentions APIs, Airtable, Xano, Supabase, and databases | https://www.weweb.io/ | Test secrets, CORS, server-side actions, and RLS/backend permissions |
| Compliance language | Homepage mentions staying compliant with SOC2, HIPAA, and GDPR while keeping data on user servers | https://www.weweb.io/ | This is architecture/vendor positioning, not proof of app compliance |

Production-readiness summary: WeWeb has strong architecture claims around visual editing, backend integrations, code export, and self-hosting. The biggest review risk is overstating production readiness. NoCodeReviewed should test generated workflows, backend permission boundaries, auth/role behavior, API secret handling, exported Vue app quality, and total cost before publishing production-readiness claims.

## 6) Autonomy Notes

WeWeb AI should be classified as **AI-assisted visual web-app generation with human-editable output**, not a fully autonomous software engineer. Official evidence supports prompt-to-working-app generation, app blueprinting, visual editing, workflows, data/auth context, and code export. Human testing remains required for backend security, auth, role rules, generated logic, and deployment.

| Autonomy question | Current evidence answer |
|---|---|
| Can WeWeb AI generate a working app from a prompt? | Official AI page supports this |
| Can users edit generated output visually? | Official AI page supports this |
| Does WeWeb support custom code and Vue components? | Official sources support this |
| Can paid users export Vue.js code? | Official AI page supports this |
| Can WeWeb AI prove generated app security? | Not verified |
| Can WeWeb replace backend/security engineering? | Not verified |

## 7) Strengths From Official or Verified Sources Only

- Clear official AI page with concrete workflow: prompt, build, edit, scale.
- Generated outputs are described as native visual-editor elements, workflows, database schemas, and app structures rather than opaque code only.
- Code export and self-hosting are central differentiators in official positioning.
- WeWeb supports external backend/API/database integrations rather than forcing a single backend.
- No per-app-user pricing claim is potentially important for scaling, but must be verified against full pricing terms.

## 8) Limitations From Official / Verified / Reputable Sources

| Limitation | Evidence basis | Notes |
|---|---|---|
| Exact current pricing not fully captured | Pricing page extract limited | Manual pricing capture required |
| Production-readiness is vendor positioning | Official marketing claim | Benchmark required |
| Backend security depends on chosen backend and configuration | Architecture/integration posture | Test Supabase/Xano/API permissions |
| Code export quality not verified | No hands-on test record | Export/build/review test required |
| Compliance language can be misunderstood | Homepage architecture language | Do not imply generated apps are SOC2/HIPAA/GDPR compliant |

## 9) Comparison Candidates With Rationale

| Candidate | Rationale |
|---|---|
| Bubble AI | No-code web app builder with built-in backend/workflows |
| FlutterFlow AI | Visual app builder with AI and code export posture |
| Toddle | Visual web-app builder with code/control orientation |
| Webflow AI | Website/experience builder comparison, less app-backend oriented |
| Builder.io Fusion / v0 | AI-assisted web front-end generation comparison |

## 10) Safe Claims to Publish

These claims are safe only with source attribution:

1. WeWeb positions itself as an AI-powered visual development platform for building custom web applications.
2. WeWeb AI can generate a working app from a prompt and then let users edit pixels, queries, and workflows visually according to WeWeb’s AI page.
3. WeWeb says AI-generated outputs are editable in its visual editor.
4. WeWeb says every paid plan includes Vue.js code export at no extra cost.
5. WeWeb can deploy on its CDN or export a Vue.js single-page application for self-hosting according to official sources.
6. WeWeb should be reviewed as a visual frontend/web-app builder that depends on backend/auth/integration configuration, not as a guaranteed secure full-stack autonomous builder.

## 11) Claims Requiring Verification

| Claim | Why it needs verification | Test / source needed |
|---|---|---|
| “WeWeb AI builds production-ready apps” | Vendor positioning requires evidence | End-to-end app/security benchmark |
| “Code export removes vendor lock-in completely” | Export quality, buildability, dependencies, and ongoing maintainability need review | Export/build/source review |
| “WeWeb is cheaper at scale because it does not charge per app user” | Backend/hosting/token/seat costs may dominate | Standard cost benchmark |
| “WeWeb can securely handle enterprise data” | Depends on backend, auth, APIs, secrets, deployment | Security review and Trust Center/security docs |
| “AI correctly configures roles/auth/workflows” | Critical access-control behavior must be tested | Cross-user permission tests |

## 12) Testing Plan

| Order | Test | Method | Pass criteria |
|---:|---|---|---|
| 1 | Prompt-to-app build | Generate customer portal or SaaS dashboard | App creates pages, data model, workflows, and auth scaffold |
| 2 | Visual editability | Modify generated layout/workflow manually | Changes work without repeated prompting |
| 3 | Backend integration | Connect Supabase or Xano test backend | Reads/writes work through intended APIs only |
| 4 | Auth/RBAC | Create admin/member/client roles | Each role sees and changes only intended data |
| 5 | Secrets/API test | Inspect whether keys/secrets are exposed client-side | No sensitive secret in browser bundle/network where avoidable |
| 6 | Workflow test | Run create/update/delete workflows | Workflow logic is correct and bounded |
| 7 | Code export | Export Vue.js SPA on eligible plan | Project builds locally and dependencies are clear |
| 8 | Self-host deploy | Deploy export to Vercel/Netlify/Cloudflare or equivalent | App works outside WeWeb hosting |
| 9 | Cost tracking | Record plan, AI tokens, backend, hosting, and implementation time | Total-cost table completed |
| 10 | Comparison | Repeat app brief in Bubble and FlutterFlow | Comparative evidence table produced |

## 13) Research Status

Research status: `in-progress`  
Last updated: May 30, 2026  
Publication approval: `not approved`  
Human approval gate: Required before any NoCodeReviewed publication.

## Source Categories

| Category | Sources |
|---|---|
| Official | WeWeb homepage, WeWeb AI product page, WeWeb pricing page, WeWeb pricing changelog |
| Reputable third-party | None used in this file |
| Anecdotal/user-reported | None used in this file |
| Needs testing | Prompt-to-app quality, backend integration, auth/RBAC, API secrets, workflow correctness, code export, self-host deployment, pricing/token benchmark, security/compliance docs |

