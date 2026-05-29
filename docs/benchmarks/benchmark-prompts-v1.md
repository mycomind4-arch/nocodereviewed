# Vibe Coding Benchmark Prompts v1

These prompts are the first standardized test suite for evaluating AI app builders. Use the exact prompts when possible. Record any deviations in the benchmark run.

## Prompt Rules

- Do not mention the tool being tested inside the prompt.
- Do not add manual clarifications unless the tool asks and the clarification is recorded.
- Use the same prompt across every comparable tool.
- Capture screenshots before making manual repairs.
- Record all failed generations.

## Benchmark 1: SaaS MVP Dashboard

**Family:** SaaS MVP  
**Purpose:** Tests app structure, auth assumptions, dashboard UI, database modeling, and deployment readiness.

```text
Build a responsive SaaS MVP for a product called LaunchPulse.

The app helps founders track weekly startup progress.

Requirements:
- Public landing page with hero, three feature sections, pricing section, FAQ, and email capture.
- Auth flow with sign up, log in, log out, and protected dashboard.
- Dashboard with weekly metrics: revenue, active users, churn, runway, experiments shipped.
- CRUD table for experiments with status, owner, expected impact, due date, and result.
- Simple settings page for company name and default currency.
- Use a clean B2B SaaS design: white background, dark text, restrained orange accent.
- Include empty states, loading states, and error states.
- Make it responsive for mobile and desktop.
- Add clear instructions for how to deploy and what environment variables are needed.
```

## Benchmark 2: Directory App

**Family:** Directory  
**Purpose:** Tests listings, filters, detail pages, submit flow, and data schema.

```text
Build a responsive directory app called StackScout.

The app lists AI app-building tools for founders.

Requirements:
- Home page with search, category filters, and featured tools.
- Directory listing page with cards for each tool.
- Tool detail page with overview, pricing summary, best-for tags, pros, cons, and alternatives.
- Submit-a-tool form with validation.
- Admin-style review queue for submitted tools.
- Data model for tools, categories, pricing, reviews, and submissions.
- Include at least 8 realistic sample tools.
- Use clean editorial technology styling, not a playful startup look.
- Add empty states, loading states, and error states.
- Make it responsive for mobile and desktop.
- Add deployment notes and environment variable notes.
```

## Benchmark 3: Internal Tool

**Family:** Internal tool  
**Purpose:** Tests CRUD quality, forms, tables, permissions assumptions, and operational UI.

```text
Build an internal operations dashboard called OpsDesk.

The app helps a small team manage vendor renewals.

Requirements:
- Protected dashboard layout with sidebar navigation.
- Vendors table with name, category, owner, renewal date, monthly cost, status, and notes.
- Add/edit vendor form with validation.
- Renewal calendar view grouped by month.
- Alerts panel for renewals due in the next 30 days.
- Simple role model: admin can edit, viewer can only read.
- Audit log showing recent changes.
- Use dense, practical business software styling.
- Include empty states, loading states, and error states.
- Make it responsive for tablet and desktop.
- Add deployment notes and environment variable notes.
```

## Benchmark 4: Landing Page

**Family:** Landing page  
**Purpose:** Tests design quality, responsiveness, conversion sections, and speed to usable output.

```text
Build a high-converting landing page for a product called PromptProof.

PromptProof helps teams test AI-generated app builders before choosing one.

Requirements:
- Hero section with clear headline, subheadline, primary CTA, and secondary CTA.
- Social proof section with three customer quote cards.
- Problem/solution section.
- Feature grid with six features.
- Benchmark report preview section.
- Pricing section with three tiers.
- FAQ section.
- Newsletter signup.
- Footer with disclosure, privacy, and contact links.
- Visual style should feel like serious software research, not generic AI hype.
- Fully responsive for mobile and desktop.
```

## Benchmark 5: AI Wrapper App

**Family:** AI wrapper  
**Purpose:** Tests API handling assumptions, secrets, user inputs, response history, and safety around environment variables.

```text
Build an AI wrapper app called BriefForge.

The app turns messy meeting notes into structured project briefs.

Requirements:
- Landing page explaining the product.
- Authenticated app page with text input for meeting notes.
- Generate button that calls an AI API through a server-side function.
- Never expose API keys in client-side code.
- Response output with sections: summary, decisions, open questions, action items, risks.
- Save generated briefs to a user-specific history table.
- Brief detail page.
- Delete brief action.
- Settings page for preferred output style.
- Include empty states, loading states, error states, and API failure handling.
- Add environment variable documentation.
- Make it responsive for mobile and desktop.
```

## Benchmark 6: Repair Test

**Family:** Failure recovery  
**Purpose:** Tests whether the tool can diagnose and fix its own broken output.

Use after the tool produces an initial app.

```text
Review the app you just built and identify the five most likely production issues.

Then fix the top three issues.

Focus on:
- Broken navigation or routes.
- Missing states.
- Unsafe client-side secrets.
- Weak database or auth assumptions.
- Forms that do not validate correctly.
- Components that will break on mobile.

Explain what you changed and why.
```

## Benchmark 7: Handoff Test

**Family:** Handoff/export  
**Purpose:** Tests whether the output can be maintained by a human.

```text
Create a handoff document for this app.

Include:
- Project structure.
- Key routes and components.
- Data model.
- Environment variables.
- Deployment steps.
- Known limitations.
- What a developer should review before production launch.
- Suggested next five improvements.
```

