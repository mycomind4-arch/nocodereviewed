# Sample Implementation Package for agent-swarm-coder

schema_version: agent-package.v1

## Objective
Demonstrate safe package execution by creating a harmless demo artifact file and running a read-only diagnostic command. All changes are local to the agent tests area and fully reversible via backups.

## Files to Create or Modify

### create: tools/internal/agent-swarm-coder/tests/fixtures/package-demo-artifact.txt
```text
This file was created by the agent-swarm-coder package execution test run.
It is a safe, non-functional artifact used only to verify the parser, planner, fileOps, and output writer in package mode.
Created at package execution time.
```

## Implementation Steps
1. Parse this package (md or json equivalent).
2. Run safety analysis (expect no blocks for this safe package).
3. (dry-run) Record intent to create the artifact.
4. (with --apply) Actually write the file + backup.
5. Execute the diagnostic command.
6. Emit full package-execution-* output artifacts.

## Test Commands
- node --version

## Commands
- node --version

## QA Checklist
- [ ] Review package-execution-summary.md
- [ ] Confirm the demo artifact was (or would be) created under tests/fixtures/
- [ ] Check that no secrets or destructive actions were attempted
- [ ] Verify backups would be created on real apply

## Risk Checklist
- Low risk: only creates a new .txt in tests/fixtures (gitignored or harmless)
- No modifications to production source
- No deletes
- No secret files touched

## Rollback Notes
Standard .bak-<timestamp> files are created next to any written target. Use cp or git checkout to restore. The demo artifact can simply be deleted if undesired.

## Evidence Requirements
If this run is used to validate the tool, consider capturing the evidence-record.json as a VaultArtifact for the coder tool itself.

## Next Action
- Run with --dry-run first (always).
- If plan clean, re-run with --apply to actually land the demo file.
- Extend parser to support more patch formats or full unified diffs in future upgrade.
- Add this capability note to the agent's CODING_AGENT_ARCHITECTURE.md
