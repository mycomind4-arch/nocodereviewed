# Vibe Code Project Auditor — Build Instructions

**Version:** 1.0  
**Purpose:** A universal artifact that accepts any zipped vibe-code / no-code project, reads its structure and documents, and produces a live, interactive audit dashboard with site preview, completion tracking, risk analysis, and gap identification.

---

## What this artifact does

1. Accepts a `.zip` file upload from the user
2. Reads the zip manifest without extracting (lists all files and sizes)
3. Reads key files selectively: README, index.html, main JS/TS app file, package.json, all markdown docs, any SQL schema files
4. Parses the project structure to infer: what's built, what's missing, what's risky
5. Renders a tabbed dashboard with: live site preview (iframe), completed checklist, missing items, document browser, risk table, and freeform Claude Q&A
6. Recalculates readiness score from actual checked-off items (not a hardcoded number)
7. Allows the user to mark risks as acknowledged/deferred/resolved
8. Allows the user to open and read any document inline
9. Uses the Anthropic API internally (Claude-in-Claude) to analyze the uploaded project and generate the audit findings dynamically

---

## Core architecture decisions

### Why Claude-in-Claude (Anthropic API inside the artifact)

The artifact cannot statically know what project will be uploaded. It must call the Anthropic API with the extracted file contents to generate findings dynamically. This is the only way the same artifact works for VibeCode Authority, a SaaS boilerplate, a design system, or any other zip project.

### Why JSZip for zip parsing

The artifact runs entirely in the browser (React or HTML). It cannot run Node.js `unzip` commands. JSZip is the standard browser-side zip library and is available on cdnjs.

### Why iframe for site preview

If the project has an `index.html`, it should be rendered live using a blob URL injected into an iframe — not a painted mockup. This is the single most important improvement over v1.

### State management

Use React `useState` for: uploaded file, parsed project data, active tab, document viewer state, risk acknowledgement state, API loading state, API error state.

---

## Tech stack for the artifact

- **Framework:** React (`.jsx` artifact in Claude)
- **Zip parsing:** JSZip from cdnjs — `https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js`
- **AI analysis:** Anthropic API at `https://api.anthropic.com/v1/messages` — model `claude-sonnet-4-20250514`
- **Icons:** Tabler outline icon webfont (already loaded in Claude artifacts)
- **Styling:** Inline styles using Claude CSS variables (no external stylesheet needed)

---

## File reading strategy

When the zip is loaded, read files in this priority order and pass their content to the API:

### Always read (if present)
| File pattern | Why |
|---|---|
| `README.md` | Project overview, folder map, notes |
| `index.html` | Entry point, reveals framework, title |
| `package.json` | Dependencies, scripts, project name |
| `**/server.mjs` or `**/server.js` | API surface, data persistence model |
| `**/src/static-app.js` or main app file | Largest JS file = main app logic |
| Any `.sql` file | Database schema = what's designed vs built |
| `**/docs/**/*.md` (first 20) | Planning docs, model docs, roadmaps |
| `**/scripts/*.md` | Build/run scripts may contain spec info |

### Size limits (important — API context window)
- Cap any single file at **8,000 characters** before sending to the API
- Cap total content sent to the API at **60,000 characters**
- For large JS files (like static-app.js): send first 3,000 chars + last 1,000 chars + grep for function names using `Object.keys()` or string matching on `function ` declarations
- For SQL files: send the full file if under 8,000 chars (schema is dense and important)
- For markdown docs: send first 2,000 chars of each, up to 20 docs total

### What to extract from the zip manifest (no file reading needed)
- Total file count
- Directory structure (unique folder paths)
- File type distribution (how many `.md`, `.js`, `.ts`, `.tsx`, `.sql`, `.html`, `.css` files)
- Largest files by size (signals where the real work is)
- Empty directories (signals planned but unbuilt sections)

---

## API prompt design

Send one API call after zip parsing is complete. Structure the prompt as follows:

```
You are a professional vibe code project auditor. You have been given the contents of a zipped project. 
Analyze the project and return a JSON object with exactly this structure:

{
  "projectName": string,
  "projectType": string (e.g. "Authority blog", "SaaS app", "Design system", "Internal tool"),
  "buildPhase": string (e.g. "Static prototype", "MVP alpha", "Beta", "Production"),
  "readinessPercent": number (0-100, your honest assessment),
  "summary": string (2-3 sentences, plain language),
  "completed": [
    { "id": string, "label": string, "detail": string, "category": string }
  ],
  "missing": [
    { 
      "id": string, 
      "label": string, 
      "detail": string, 
      "phase": string, 
      "effort": "hours" | "days" | "weeks",
      "blockedBy": string | null,
      "category": string
    }
  ],
  "risks": [
    { 
      "id": string,
      "label": string, 
      "detail": string, 
      "severity": "blocking" | "high" | "medium" | "low",
      "status": "open"
    }
  ],
  "metrics": {
    "totalFiles": number,
    "docFiles": number,
    "sourceFiles": number,
    "emptyDirs": number,
    "hasDatabase": boolean,
    "hasAuth": boolean,
    "hasTests": boolean,
    "hasDeployConfig": boolean,
    "hasCICD": boolean,
    "evidenceCount": number
  },
  "documents": [
    { "name": string, "path": string, "type": string, "summary": string }
  ],
  "siteHasPreview": boolean,
  "previewEntryFile": string | null
}

Return ONLY valid JSON. No markdown fences. No preamble.

PROJECT FILES:
[insert extracted file contents here]

ZIP MANIFEST SUMMARY:
[insert file list and directory structure here]
```

### Important prompt rules
- Instruct the model to be **adversarially honest** — err toward marking things missing, not completed
- Tell it to infer `effort` from complexity, not optimism
- Tell it that `blockedBy` should name the specific missing item that must exist first
- Tell it that `evidenceCount` is specifically the count of actual test runs, benchmarks, or captured data — not planned ones

---

## Component structure

Build the artifact as a single React component with these logical sections:

### 1. Upload zone
```
[ Drop a .zip project file here, or click to browse ]
```
- Use `<input type="file" accept=".zip">` hidden behind a styled drop zone
- On file select: call `parseZip(file)` 
- Show file name and size once loaded
- Show a "Re-analyze" button after first analysis

### 2. Loading state
While the API call is in flight, show:
- Animated progress indicator (CSS keyframe, not a library)
- Sequential loading messages: "Reading zip structure...", "Extracting key files...", "Sending to Claude for analysis...", "Building audit report..."
- Use `setTimeout` to cycle through messages every 1.2s

### 3. Score bar (always visible once loaded)
5 metric cards in a row:
- Overall readiness % (from API, with animated progress bar)
- Files analyzed (from zip manifest)
- Items completed (count of completed[] array)
- Items missing (count of missing[] array)
- Open risks (count of risks[] where status === "open")

All numbers are derived from live state, not hardcoded.

### 4. Tab bar
6 tabs: Preview | Completed | Missing | Documents | Risks | Ask Claude

### 5. Tab panels

#### Preview tab
```javascript
// If siteHasPreview is true and we have index.html content:
const blob = new Blob([indexHtmlContent], { type: 'text/html' });
const url = URL.createObjectURL(blob);
// Render: <iframe src={url} style={{ width: '100%', height: '400px', border: 'none' }} />
```
If the project has linked CSS/JS that won't load in isolation, show a message: "Live preview available — external assets require a local server. Showing structural preview." Then render a simplified structural mockup instead (parse `<title>`, `<nav>`, `<h1>` from the HTML and display them).

If `siteHasPreview` is false, show a placeholder: "No index.html found in this project."

#### Completed tab
Render `completed[]` as a checklist. Each item:
- Green check icon
- Label (bold)
- Detail (secondary text)
- Category badge

Group by `category` if more than 8 items. Add a count: "12 of 12 items".

#### Missing tab
Render `missing[]` grouped by `phase`. Each item:
- Red X icon
- Label + effort badge (hours/days/weeks)
- Detail
- If `blockedBy` is non-null: show "Blocked by: [label]" in amber

Add a filter bar at the top: All | Hours | Days | Weeks — filters by effort level.

#### Documents tab
Render `documents[]` as a grid of cards. Each card shows:
- File icon (based on type)
- Document name
- Type badge
- Summary (1 line)
- "Read" button

On "Read" click: expand an inline panel below the card showing the actual file content (loaded from the zip on demand — lazy load, don't preload all docs). Use `<pre>` with `white-space: pre-wrap` for markdown. Render as plain text, not parsed markdown (simpler, no library needed).

#### Risks tab
Render `risks[]` as a table with columns: Risk | Detail | Severity | Status.

Each row has a dropdown on the Status column: Open | Acknowledged | Deferred | Resolved.

On status change: update local state (no API call needed). The open risks count in the score bar updates in real time.

Color severity badges: Blocking = dark red bg, High = red, Medium = amber, Low = green.

Add a summary line above the table: "X of Y risks are open. Z are blocking."

#### Ask Claude tab
A freeform textarea + submit button. On submit:

```javascript
// Include project context in the system prompt
const systemPrompt = `You are auditing a project called "${auditData.projectName}". 
Here is the audit summary: ${JSON.stringify(auditData.summary)}
Completed items: ${auditData.completed.map(c => c.label).join(', ')}
Missing items: ${auditData.missing.map(m => m.label).join(', ')}
Open risks: ${auditData.risks.filter(r => r.status === 'open').map(r => r.label).join(', ')}
Answer questions about this specific project.`;

// Call API with user's question
```

Show a conversation thread (messages array in state). Each user message and Claude response rendered in alternating style. Limit to last 10 exchanges to avoid context overflow.

Add 4 pre-loaded suggested questions as buttons below the textarea. These should be generated dynamically from the audit findings (e.g. if `hasAuth` is false: "What's the simplest auth implementation for this project?"). Since you can't generate these before the API call completes, derive them from `missing[]` after analysis: take the first 4 missing items and format as questions.

---

## Readiness score calculation

Do not use the API's `readinessPercent` as-is. Recalculate it in the UI from live state:

```javascript
function calcReadiness(completed, missing, risks) {
  const totalTasks = completed.length + missing.length;
  if (totalTasks === 0) return 0;
  const taskScore = (completed.length / totalTasks) * 60; // 60% weight on tasks
  const blockingRisks = risks.filter(r => r.severity === 'blocking' && r.status === 'open').length;
  const riskPenalty = Math.min(blockingRisks * 10, 30); // up to 30% penalty
  const baseScore = taskScore - riskPenalty;
  return Math.max(0, Math.min(100, Math.round(baseScore)));
}
```

This means: resolving a risk in the UI updates the score in real time without another API call.

---

## Error handling

Cover these failure cases:

| Failure | Handler |
|---|---|
| File is not a zip | Show: "Please upload a .zip file." Clear the input. |
| Zip is empty or has no readable files | Show: "This zip has no readable text files. Try a project zip with source code and docs." |
| API returns non-JSON | Try to extract JSON from the response with a regex (`/\{[\s\S]*\}/`). If that fails, show error with raw response in a collapsed `<details>` element. |
| API call fails (network error) | Show retry button. Keep the zip in state so the user doesn't have to re-upload. |
| File content exceeds token budget | Truncate silently (the user doesn't need to know). Log a console warning. |
| iframe preview fails to load | Catch the `onError` event. Fall back to structural mockup. |

---

## Design system rules (Claude artifact environment)

Follow these rules exactly — the artifact runs inside Claude's iframe sandbox:

- **No `localStorage` or `sessionStorage`** — use React state only
- **No `position: fixed`** — breaks iframe height calculation
- **No external fonts** — use `var(--font-sans)`, `var(--font-mono)`, `var(--font-serif)`
- **All colors via CSS variables** — `var(--color-text-primary)`, `var(--color-background-secondary)`, etc. — never hardcode hex values for text or backgrounds
- **Tabler icons only** — `<i className="ti ti-NAME">` — outline variants only (no `-filled` suffix)
- **No gradients, shadows, or blur** — flat surfaces only
- **Sentence case everywhere** — no Title Case or ALL CAPS in UI labels
- **Font weights: 400 and 500 only** — never 600 or 700
- **Border weight: 0.5px** — except featured/accent items which use 2px
- **Border radius:** `var(--border-radius-md)` for small elements, `var(--border-radius-lg)` for cards
- **Metric cards:** `background: var(--color-background-secondary)`, no border, `border-radius: var(--border-radius-md)`, padding 1rem

---

## Semantic color usage

Use CSS variable semantic colors (not hardcoded hex) for status meaning:

| State | Background | Text |
|---|---|---|
| Completed / success | `var(--color-background-success)` | `var(--color-text-success)` |
| Warning / partial | `var(--color-background-warning)` | `var(--color-text-warning)` |
| Error / missing | `var(--color-background-danger)` | `var(--color-text-danger)` |
| Info / neutral | `var(--color-background-info)` | `var(--color-text-info)` |

For severity badges and status pills, use these — they automatically adapt to dark mode.

---

## CDN imports (allowed in Claude artifacts)

```javascript
// JSZip — load via script tag in HTML head, or dynamic import:
// https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js

// In React artifact, import dynamically:
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  script.onload = () => setJszipReady(true);
  document.head.appendChild(script);
}, []);
```

No other CDN libraries are needed. Do not import chart libraries, markdown parsers, or syntax highlighters — they add complexity without proportional value for an audit tool.

---

## Zip parsing implementation

```javascript
async function parseZip(file) {
  const JSZip = window.JSZip; // loaded from CDN
  const zip = await JSZip.loadAsync(file);
  
  const manifest = []; // { path, size, isDir }
  const fileContents = {}; // { path: string_content }
  
  // Build manifest
  zip.forEach((relativePath, zipEntry) => {
    manifest.push({
      path: relativePath,
      size: zipEntry._data?.uncompressedSize || 0,
      isDir: zipEntry.dir
    });
  });
  
  // Determine which files to read
  const toRead = selectFilesToRead(manifest);
  
  // Read selected files
  for (const path of toRead) {
    try {
      const content = await zip.file(path).async('string');
      fileContents[path] = content.slice(0, 8000); // hard cap
    } catch (e) {
      // skip binary files that fail string decode
    }
  }
  
  return { manifest, fileContents };
}

function selectFilesToRead(manifest) {
  const priorities = [];
  const files = manifest.filter(f => !f.isDir).map(f => f.path);
  
  // Tier 1: always read
  const tier1Patterns = [
    /README\.md$/i, /index\.html?$/i, /package\.json$/,
    /server\.(mjs|js)$/, /\.sql$/
  ];
  tier1Patterns.forEach(pattern => {
    const match = files.find(f => pattern.test(f));
    if (match) priorities.push(match);
  });
  
  // Tier 2: largest JS/TS file (main app)
  const jsFiles = files
    .filter(f => /\.(js|ts|jsx|tsx)$/.test(f) && !f.includes('node_modules'))
    .sort((a, b) => {
      const sizeA = manifest.find(m => m.path === a)?.size || 0;
      const sizeB = manifest.find(m => m.path === b)?.size || 0;
      return sizeB - sizeA;
    });
  if (jsFiles[0]) priorities.push(jsFiles[0]);
  
  // Tier 3: markdown docs (up to 20)
  const mdFiles = files
    .filter(f => /\.md$/.test(f) && !priorities.includes(f))
    .slice(0, 20);
  priorities.push(...mdFiles);
  
  // Deduplicate
  return [...new Set(priorities)];
}
```

---

## Build sequence (step-by-step)

Follow this order when writing the artifact code:

1. **Scaffold the component** — `export default function ProjectAuditor()` with state variables defined
2. **Load JSZip** via `useEffect` script injection, set `jszipReady` state when loaded
3. **Build the upload zone** — file input, drop zone styling, `onChange` handler
4. **Build `parseZip()`** — returns `{ manifest, fileContents }`
5. **Build `buildApiPrompt()`** — takes `{ manifest, fileContents }`, returns the prompt string with file content injected
6. **Build `callAuditApi()`** — posts to Anthropic API, parses JSON response, sets `auditData` state
7. **Build `calcReadiness()`** — pure function, takes current state, returns 0-100
8. **Build the loading state UI** — cycling messages, spinner
9. **Build the score bar** — 5 metric cards, all driven by state
10. **Build the tab bar** — 6 buttons, `activeTab` state
11. **Build each panel** in order: Preview → Completed → Missing → Documents → Risks → Ask Claude
12. **Wire up interactivity** — risk status dropdowns, document reader, ask Claude conversation
13. **Add error boundaries** around the API call and zip parsing

---

## Known limitations to document for users

Include a small footer in the artifact that says:

> "This audit runs entirely in your browser. Zip contents are sent to the Anthropic API for analysis. No data is stored. Re-upload your zip after making changes to get an updated audit."

Also note:
- Live preview only works if `index.html` is self-contained or uses relative paths to assets also inside the zip
- The API analysis improves with more documentation — projects with thorough READMEs and planning docs produce more accurate audits
- Maximum recommended zip size: 50MB (larger zips may be slow to parse in the browser)

---

## Prompting Claude to build this

Use this prompt to generate the artifact in one shot:

```
Build a React artifact that is a universal vibe code project auditor. 

A user uploads a .zip file of any project. The artifact:
1. Parses the zip using JSZip (load from cdnjs: https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js)
2. Reads key files: README, index.html, package.json, largest JS file, all .sql files, up to 20 .md docs
3. Sends the content to the Anthropic API (claude-sonnet-4-20250514) with a prompt asking for a JSON audit report
4. Renders the audit as a tabbed dashboard: Preview | Completed | Missing | Documents | Risks | Ask Claude

The API response must match this schema:
{ projectName, projectType, buildPhase, readinessPercent, summary, completed[], missing[], risks[], metrics{}, documents[], siteHasPreview, previewEntryFile }

Each completed item: { id, label, detail, category }
Each missing item: { id, label, detail, phase, effort (hours/days/weeks), blockedBy, category }
Each risk: { id, label, detail, severity (blocking/high/medium/low), status ("open") }

UI rules:
- All colors via CSS variables (var(--color-text-primary) etc) — never hardcode hex
- Tabler outline icons only: <i className="ti ti-NAME">
- No gradients, shadows, localStorage, or position:fixed
- Font weights 400 and 500 only
- 0.5px borders

Score bar: 5 metric cards — readiness %, files analyzed, completed count, missing count, open risks. Readiness recalculates live using: (completed / total_tasks * 60) minus (blocking_open_risks * 10), max 100.

Preview tab: render index.html in an iframe using a blob URL. If preview fails, show structural mockup from parsed HTML.

Missing tab: group by phase, show effort badges, show blockedBy in amber when non-null. Filter bar: All / Hours / Days / Weeks.

Documents tab: card grid, "Read" button lazy-loads file content from zip and shows it inline.

Risks tab: table with live status dropdown (Open/Acknowledged/Deferred/Resolved). Changing status updates the readiness score in real time.

Ask Claude tab: textarea + submit. System prompt includes full audit context. Shows conversation thread. 4 suggested questions generated from first 4 missing items.

Error handling: non-zip files, empty zips, API failures (show retry), JSON parse failures (try regex extraction, show raw in <details>).

Loading state: cycling messages ("Reading zip...", "Extracting files...", "Analyzing with Claude...", "Building report...") every 1.2s.

No external libraries except JSZip.
```

---

## Checklist before shipping the artifact

- [ ] Upload zone accepts `.zip` only, rejects other file types gracefully
- [ ] Loading messages cycle correctly and stop when analysis completes
- [ ] Score bar numbers all derive from state, none hardcoded
- [ ] Readiness score updates when a risk status changes in the Risks tab
- [ ] Missing tab filter buttons (All/Hours/Days/Weeks) work correctly
- [ ] Document reader lazy-loads on "Read" click, does not preload
- [ ] Ask Claude conversation persists within the session
- [ ] Suggested questions in Ask Claude tab match the actual missing items
- [ ] API errors show retry button without losing the zip
- [ ] Non-zip file upload shows a clear error message
- [ ] Dark mode: all text readable, no hardcoded colors breaking
- [ ] iframe preview falls back gracefully if assets are missing
- [ ] No `console.error` spam from blocked file types in zip

---

# AI Subcontractor Workflow

## Overview

Codex is the primary builder. Claude and ChatGPT act as specialist subcontractors for specific deliverables — documentation, prompts, schemas, UI components, copy — that get dropped into an `intake/` folder inside the project. Codex picks them up and integrates them without having to generate them itself.

This is a human-in-the-loop orchestration pattern: you are the router. You decide what to subcontract, which AI to use for it, and when to hand the output to Codex.

---

## Intake folder convention

All AI-generated subcontractor outputs land in one place:

```
/intake/
  /ready/       ← Codex can consume these immediately
  /review/      ← human must approve before Codex uses them
  /archive/     ← used, superseded, or rejected outputs
```

Each file in `/intake/ready/` must include a header block so Codex knows what to do with it:

```
---
subcontractor: claude | chatgpt
type: component | schema | prompt | copy | spec | config
target: path/where/codex/should/place/or/use/this
instruction: one sentence telling Codex exactly what to do with this file
date: YYYY-MM-DD
---
```

Example header for a React component:

```
---
subcontractor: claude
type: component
target: src/components/RiskTable.jsx
instruction: Replace the existing RiskTable component with this file verbatim.
date: 2026-05-28
---
```

Codex's intake instruction (add this to Codex's system prompt or AGENTS.md):

```
Before starting any task, check /intake/ready/ for files with a valid header block. 
Process each file according to its `instruction` field. Move processed files to /intake/archive/.
Do not modify files in /intake/review/ — those require human approval first.
```

---

## What to subcontract to Claude vs ChatGPT

These are rough guidelines based on what each model does well for this class of work. Adjust based on your own experience.

| Work type | Best model | Why |
|---|---|---|
| React component with complex state | Claude | Stronger at multi-state UI, constraint following |
| Detailed system prompt / persona | Claude | Better at nuanced instruction design |
| JSON schema design | Claude | More precise structural reasoning |
| SQL schema / migration | Claude | Reliable table design, foreign key reasoning |
| Marketing copy / headlines | ChatGPT | More natural tone variation |
| SEO meta descriptions (bulk) | ChatGPT | Fast, consistent, good keyword integration |
| Spec documents / PRDs | Either | Depends on your preference |
| Code refactoring with tests | ChatGPT (o3/o4) | Stronger at test-driven edits |
| Architecture decision records | Claude | More operationally skeptical |
| Image generation prompts | ChatGPT (DALL-E) | Native integration |
| Data transformation scripts | Either | Test both, keep whichever works |

---

## Subcontractable elements of the auditor artifact

The following elements of the project auditor can be broken out and subcontracted independently. Each entry includes: what it is, which model to use, whether Claude can build it on the spot right now, and the prompt to use if doing it separately.

---

### 1. Zip parser module

**What it is:** The `parseZip()` and `selectFilesToRead()` functions as a standalone JS module.  
**Model:** Claude  
**Build on the spot:** Yes — ask Claude in this conversation.  
**Intake filename:** `intake/ready/zip-parser-module.js`  
**Intake instruction:** `Copy the exported functions into src/utils/zipParser.js and import them in the main auditor component.`

**Prompt for standalone build:**
```
Write a browser-compatible JavaScript module (no Node.js APIs) that:
1. Accepts a File object (.zip)
2. Uses JSZip (available as window.JSZip) to parse it
3. Returns a promise resolving to { manifest: [], fileContents: {} }

manifest items: { path: string, size: number, isDir: boolean }
fileContents: keys are file paths, values are string content (max 8000 chars each)

File selection priority:
- Tier 1 (always): README.md, index.html, package.json, server.mjs/server.js, any .sql file
- Tier 2: largest .js/.ts/.jsx/.tsx file not in node_modules
- Tier 3: up to 20 .md files not already selected

Export as ES module: export { parseZip, selectFilesToRead }
Include JSDoc comments.
Total content budget: 60,000 chars across all files combined — truncate evenly if exceeded.
```

---

### 2. Anthropic API audit prompt template

**What it is:** The exact system + user prompt sent to the Anthropic API, as a JS template literal function.  
**Model:** Claude  
**Build on the spot:** Yes — ask Claude in this conversation.  
**Intake filename:** `intake/ready/audit-prompt-template.js`  
**Intake instruction:** `Import buildAuditPrompt from this file and use it in the callAuditApi() function in place of the inline prompt string.`

**Prompt for standalone build:**
```
Write a JavaScript function called buildAuditPrompt(manifest, fileContents) that returns 
an object { system: string, user: string } for use as an Anthropic API call.

The system prompt should instruct the model to act as an adversarially honest project auditor.
The user prompt should inject the manifest summary and file contents and ask for a JSON response
matching this exact schema:

{
  projectName, projectType, buildPhase, readinessPercent, summary,
  completed: [{ id, label, detail, category }],
  missing: [{ id, label, detail, phase, effort, blockedBy, category }],
  risks: [{ id, label, detail, severity, status }],
  metrics: { totalFiles, docFiles, sourceFiles, emptyDirs, hasDatabase, hasAuth, 
             hasTests, hasDeployConfig, hasCICD, evidenceCount },
  documents: [{ name, path, type, summary }],
  siteHasPreview, previewEntryFile
}

effort values: "hours" | "days" | "weeks"
severity values: "blocking" | "high" | "medium" | "low"
status default: "open"

Rules to embed in the system prompt:
- Be adversarially honest — err toward marking things missing, not completed
- evidenceCount = actual test runs captured, not planned
- blockedBy = specific label of the blocking missing item, not a category
- Return ONLY valid JSON, no markdown fences, no preamble

Export as: export { buildAuditPrompt }
```

---

### 3. Risk table component

**What it is:** A standalone React component for the Risks tab — table with live status dropdown, severity badges, blocking summary line, readiness impact indicator.  
**Model:** Claude  
**Build on the spot:** Yes — ask Claude in this conversation.  
**Intake filename:** `intake/ready/RiskTable.jsx`  
**Intake instruction:** `Place in src/components/RiskTable.jsx. Import and use in the main auditor component as <RiskTable risks={risks} onRiskUpdate={handleRiskUpdate} />`

**Prompt for standalone build:**
```
Build a React component called RiskTable.

Props:
- risks: array of { id, label, detail, severity, status }
- onRiskUpdate: function(id, newStatus) called when a risk's status changes

Renders a table with columns: Risk | Detail | Severity | Status
Status column is a <select> with options: Open | Acknowledged | Deferred | Resolved

Above the table: a summary line showing "X of Y risks open. Z are blocking."

Severity badge colors (use inline styles, CSS variables only):
- blocking: background var(--color-background-danger), color var(--color-text-danger)
- high: slightly lighter danger variant
- medium: background var(--color-background-warning), color var(--color-text-warning)  
- low: background var(--color-background-success), color var(--color-text-success)

Rules:
- No hardcoded hex colors
- No external libraries
- 0.5px borders, var(--border-radius-md) corners
- Font weights 400 and 500 only
- Sentence case labels
- Tabler outline icons: <i className="ti ti-NAME">
- Works in dark mode (CSS variables handle it)

When status changes to Resolved or Acknowledged, visually mute that row (opacity 0.5).
```

---

### 4. Document browser component

**What it is:** A React component for the Documents tab — file card grid with lazy-load inline reader.  
**Model:** Claude  
**Build on the spot:** Yes — ask Claude in this conversation.  
**Intake filename:** `intake/ready/DocumentBrowser.jsx`  
**Intake instruction:** `Place in src/components/DocumentBrowser.jsx. Import and use as <DocumentBrowser documents={documents} onReadFile={handleReadFile} />`

**Prompt for standalone build:**
```
Build a React component called DocumentBrowser.

Props:
- documents: array of { name, path, type, summary }
- onReadFile: async function(path) returns string content of the file

Renders a CSS grid of cards (auto-fill, minmax 200px).
Each card shows: file icon (Tabler), document name, type badge, 1-line summary, and a "Read" button.

On "Read" click:
- Call onReadFile(path) — it's async, show a small loading spinner on the card while waiting
- When content arrives, expand an inline panel BELOW the card (not a modal, not a separate route)
- Show content in a <pre> with white-space: pre-wrap, font-family var(--font-mono), font-size 13px
- Show a "Close" button to collapse the panel
- Only one document can be open at a time

File type to icon mapping (Tabler):
- .md → ti-file-text
- .sql → ti-database
- .js/.ts/.jsx/.tsx → ti-brand-javascript  
- .html → ti-file-type-html
- .json → ti-file-code
- .css → ti-file-type-css
- other → ti-file

Rules: CSS variables only, no hardcoded hex, no external libraries, 0.5px borders, sentence case.
```

---

### 5. Readiness score calculator

**What it is:** A pure JS utility function for calculating the live readiness score from state.  
**Model:** Either (it's simple math)  
**Build on the spot:** Yes — trivial, include inline.  
**Intake filename:** `intake/ready/readiness-calculator.js`  
**Intake instruction:** `Import calcReadiness from this file and call it wherever readiness % is displayed.`

**Prompt for standalone build:**
```
Write a pure JavaScript function called calcReadiness(completed, missing, risks).

Inputs:
- completed: array (any shape)
- missing: array (any shape)  
- risks: array of { severity: string, status: string }

Logic:
- totalTasks = completed.length + missing.length
- if totalTasks === 0, return 0
- taskScore = (completed.length / totalTasks) * 60
- blockingOpen = risks.filter(r => r.severity === 'blocking' && r.status === 'open').length
- highOpen = risks.filter(r => r.severity === 'high' && r.status === 'open').length
- penalty = (blockingOpen * 15) + (highOpen * 5), capped at 40
- result = taskScore - penalty, clamped to [0, 100], rounded to integer

Export as: export { calcReadiness }
Include one line of JSDoc.
```

---

### 6. Intake folder + header convention (for Codex)

**What it is:** The AGENTS.md entry or Codex system prompt addition that teaches Codex the intake workflow.  
**Model:** Claude  
**Build on the spot:** Yes — ask Claude in this conversation.  
**Intake filename:** `intake/ready/AGENTS-intake-section.md`  
**Intake instruction:** `Append the contents of this file to AGENTS.md (or create AGENTS.md if it doesn't exist).`

**Prompt for standalone build:**
```
Write the AGENTS.md section that instructs Codex how to process an intake folder.

The intake folder lives at /intake/ and has three subdirectories: ready/, review/, archive/

Each file in ready/ has a YAML frontmatter header with fields:
- subcontractor: claude | chatgpt
- type: component | schema | prompt | copy | spec | config
- target: destination path within the project
- instruction: one sentence telling Codex what to do
- date: ISO date

Write clear, unambiguous instructions for Codex covering:
1. When to check the intake folder (before starting any task)
2. How to read and follow the instruction field
3. What to do with the file after processing (move to archive/)
4. What to do if a file in ready/ has a missing or ambiguous instruction (move to review/, log a note)
5. What NOT to do (don't modify review/ files, don't delete archive/ files)

Write in the imperative voice. Use a numbered list for the processing steps. Keep it under 300 words.
```

---

### 7. SEO meta + structured data (per tool review page)

**What it is:** JSON-LD structured data and meta tag templates for individual tool review pages.  
**Model:** ChatGPT  
**Build on the spot:** No — needs your actual tool list and site URL first.  
**Intake filename:** `intake/ready/seo-meta-templates.js`  
**Intake instruction:** `Import generateToolMeta from this file. Call it with each tool object when rendering review page <head> tags.`

**Prompt for standalone build (use in ChatGPT):**
```
Write a JavaScript function called generateToolMeta(tool, siteUrl) that returns an object
containing all SEO meta tags and JSON-LD structured data for a tool review page.

tool object shape:
{ name, slug, category, score, verdict, price, bestFor, updated }

Return:
{
  title: string (format: "{name} Review {year} — {category} | VibeCode Authority"),
  description: string (155 chars max, includes score and verdict snippet),
  canonical: string (siteUrl + "/review/" + tool.slug),
  ogTitle: string,
  ogDescription: string,
  jsonLd: object (Review schema with author, datePublished, reviewRating, itemReviewed)
}

Use current year dynamically (new Date().getFullYear()).
reviewRating: ratingValue = tool.score / 10 (convert 0-100 to 0-10 scale), bestRating: 10.
itemReviewed: SoftwareApplication type.
Export as: export { generateToolMeta }
```

---

### 8. Quality gate validator

**What it is:** A JS function that runs a review record through the 5 quality thresholds and returns pass/fail with reasons.  
**Model:** Claude  
**Build on the spot:** Yes — ask Claude in this conversation.  
**Intake filename:** `intake/ready/quality-gate-validator.js`  
**Intake instruction:** `Import validateQualityGate from this file. Call it before any review record is marked publish-ready in the admin panel.`

**Prompt for standalone build:**
```
Write a JavaScript function called validateQualityGate(reviewRecord, evidenceRecord).

reviewRecord shape:
{ toolName, evidenceScore, factualityScore, originalityScore, seoScore, 
  hasDisclosure, hasBenchmarkRun, hasPricingSnapshot, hasArtifact, finalVerdict }

evidenceRecord shape:
{ benchmarkRuns: number, artifacts: number, snapshots: number, qualityChecks: number }

Thresholds:
- evidenceScore >= 80
- factualityScore >= 85
- originalityScore >= 80
- seoScore >= 75
- hasDisclosure === true
- hasBenchmarkRun === true
- hasPricingSnapshot === true
- evidenceRecord.benchmarkRuns >= 1
- evidenceRecord.artifacts >= 1

Returns:
{
  pass: boolean,
  score: number (0-100, percentage of thresholds met),
  failures: [{ threshold: string, required: string, actual: string }],
  warnings: [string],
  recommendation: "publish" | "review" | "block"
}

recommendation logic:
- All pass → "publish"
- score >= 70 and no hard failures → "review"  
- Any hard failure (hasDisclosure, hasBenchmarkRun, hasPricingSnapshot) → "block"

Export as: export { validateQualityGate }
Include JSDoc and inline comments explaining each threshold.
```

---

## Workflow summary for the builder

When you're working in Codex and hit a piece that would be faster to subcontract:

1. Look up the element in the table above
2. Check "Build on the spot" — if yes, open Claude or ChatGPT and paste the prompt
3. The AI generates the file. Add the intake header block to the top.
4. Drop the file in `/intake/ready/`
5. Tell Codex: "Check the intake folder and process any ready files before continuing."
6. Codex integrates it and moves the file to `/intake/archive/`

For elements not in the table above, the pattern to follow when creating a new subcontract task:

- Write a prompt that specifies: input shape, output shape, export name, rules (CSS variables, no external libs, etc.)
- Include the intake header in the file before dropping it
- Keep each subcontracted file to a single responsibility — one function, one component, one schema
- Never subcontract something that requires knowing the live project state — those must stay in Codex

---

## Elements that should NOT be subcontracted

These require Codex's full project context and should stay in the primary build:

- The main component wiring (how all subcontracted pieces connect)
- State management between components
- Any API call that needs live env vars or secrets
- Routing logic
- Anything that reads from or writes to the local filesystem
- The final integration test

