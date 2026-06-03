# Schema Notes

The parser outputs three first-class normalized records:

1. VaultConversation
2. VaultDocument
3. VaultArtifact

Artifacts are intentionally lightweight at this stage. They mark operationally useful content without pretending to fully understand it.

Future systems should consume artifacts and generate richer records:
- evidence records
- decision records
- workflow templates
- Codex tasks
- memory candidates
