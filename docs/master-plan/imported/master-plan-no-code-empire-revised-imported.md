## Engineering Rehabilitation Strategy

### The 'Vibe-Rot' Intervention
The current project state exhibits a classic symptom of over-planning: 'documentation obesity.' With 94 documentation files and a survivability score of 38, the project is intellectually complete but technically bankrupt. We must stop drafting blueprints and start pouring concrete. The immediate priority is the **Dependency Restoration**. No further development can occur until the `package.json` is a true reflection of the imports found in the 343 files. 

### Resolving the Polyglot Sprawl
The project relies on a dangerous mix of Node.js for the frontend and Python for report generation. Without a unified orchestration layer, the 'Engineering Debt' interest will bankrupt the project within months of launch. We will implement **Dockerization** to ensure that the specific versions of ReportLab and Vite coexist without conflict. This will also facilitate a move away from manual script triggers, which currently pose a terminal risk to scaling.

### Data Integrity and Sync
The 'local-store.json' is a ticking time bomb. While efficient for a static prototype, the lack of a validation strategy means a single typo in a JSON schema could break the entire UI. We will implement a **Validation Middleware** that runs during the build step. This script will cross-reference the strategic documentation's requirements against the actual JSON data structures before the Vite build is finalized.

### Operationalizing Growth
To move from a 'disconnected prototype' to a 'No Code Empire,' we must automate site regeneration. This plan pivots from manual execution to a **CLI-driven workflow**. By the end of Phase 4, a single command should be able to ingestion new specs, run the Python generators, and deploy the updated React static assets. This eliminates the high manual maintenance index identified in the audit and prepares the project for a multi-user or multi-tenant future.