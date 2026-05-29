# VibeCode Authority Production Readiness Model

## Principle

Do not call a vibe-coded app production-ready until security, data, deploy, export, and handoff evidence exists.

## Production Checks

| Area | Minimum | Evidence | Blocker |
| --- | --- | --- | --- |
| Authentication | Login, logout, sessions, roles, account boundaries | Screenshots, generated app test notes, auth configuration notes | Private-data apps cannot be production-ready without verified auth |
| Data rules | Tables, row ownership, permissions, validation, destructive actions | Schema notes, export/code, data flow screenshots, manual test notes | Block if users can access or mutate unauthorized data |
| Secrets | API keys and tokens are server-side or environment-scoped | Repo/export inspection, environment variable notes, AI wrapper benchmark notes | Any exposed secret blocks production-ready language |
| Deployment | App deploys, loads, refreshes, and handles basic errors | Deployment URL, deploy notes, artifact, benchmark run status | Manual repair must be disclosed |
| Export and handoff | App can be exported, transferred, or maintained | Repo/export URL, file structure notes, handoff risk assessment | No handoff path limits recommendation to prototype use |
| Compliance posture | Privacy/data policy, retention, training-data claims captured | Terms/privacy source snapshot and data-risk notes | Unknown data policy blocks sensitive-data recommendations |

## Risk Bands

| Band | Meaning |
| --- | --- |
| Prototype-safe | Good for demos, mockups, validation, and low-risk internal experiments |
| Pilot-safe | Limited users after auth, data, deploy, and handoff checks pass |
| Production-candidate | Evidence supports deployment, security, maintainability, and QA |
| Blocked | Security, data, deploy, disclosure, or evidence gaps make recommendation unsafe |

## Operating Rule

Production readiness is not a marketing claim. It is an evidence state.
