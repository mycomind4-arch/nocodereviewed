/**
 * evidenceLogger.js
 * Builds Vault-compatible (or future) evidence records for agent runs.
 * Records stay local_private by default.
 */

import { createRunId } from './safetyGuard.js';

export function createEvidenceRecord({ runId, goal, inspection, plan, changedFiles, commandResults, outcome, startedAt }) {
  const id = `artifact_agent_run_${runId}`;
  return {
    id,
    schema_version: 'vault.v1',
    record_type: 'VaultArtifact',
    source_platform: 'agent-swarm-coder',
    source_ref: {
      raw_path: `outputs/coding-agent-runs/${runId}/`,
      run_dir: runId
    },
    created_at: startedAt,
    tags: ['agent-swarm-coder', 'implementation-run', outcome || 'dry-run'],
    privacy_level: 'local_private',
    run_id: runId,
    summary: `Coding agent run: ${goal}`,
    artifacts: (changedFiles || []).map(cf => ({
      type: 'file-edit',
      path: cf.path || cf,
      action: cf.action || 'change'
    })),
    plan_objective: plan?.objective,
    files_changed: (changedFiles || []).map(cf => cf.path || cf),
    commands_run: (commandResults || []).filter(Boolean).map(r => r.command),
    outcome: outcome || 'dry-run',
    meta: {
      project: inspection?.packageInfo?.name || 'unknown',
      test_commands: plan?.testCommands || []
    }
  };
}

export default {
  createEvidenceRecord
};
