/**
 * File-backed Workflow Engine
 * Extends InMemoryWorkflowEngine, persisting definitions and instances to JSON.
 * On startup, loads saved state so in-flight workflows survive server restarts.
 *
 * Data file: <dataDir>/workflow-state.json
 * Writes are atomic (temp file + rename) to prevent corruption.
 */
import fs from 'node:fs';
import path from 'node:path';
import { InMemoryWorkflowEngine } from './workflow-engine.impl.js';
export class FileWorkflowEngine extends InMemoryWorkflowEngine {
    filePath;
    constructor(gateway, eventBus, dataDir) {
        super(gateway, eventBus);
        this.filePath = path.join(dataDir, 'workflow-state.json');
        this.load();
    }
    // ── persistence ────────────────────────────────────────────────────────────
    load() {
        try {
            if (!fs.existsSync(this.filePath))
                return;
            const raw = fs.readFileSync(this.filePath, 'utf8');
            const data = JSON.parse(raw);
            for (const def of data.definitions ?? []) {
                this._definitions.set(def.id, def);
            }
            for (const inst of data.instances ?? []) {
                // Only restore non-terminal instances that were active
                // 'running' instances become 'paused' after restart (can't resume mid-step)
                if (inst.status === 'running') {
                    inst.status = 'paused';
                    inst.error = 'Server restarted mid-execution — instance paused. Resume manually.';
                }
                this._instances.set(inst.id, inst);
            }
        }
        catch {
            process.stderr.write('[FileWorkflowEngine] Warning: could not load workflow-state.json — starting fresh\n');
        }
    }
    persist() {
        try {
            const dir = path.dirname(this.filePath);
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir, { recursive: true });
            const data = {
                definitions: Array.from(this._definitions.values()),
                instances: Array.from(this._instances.values()),
                savedAt: new Date().toISOString(),
            };
            const tmp = this.filePath + '.tmp';
            fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
            fs.renameSync(tmp, this.filePath);
        }
        catch (e) {
            process.stderr.write(`[FileWorkflowEngine] Warning: persist failed: ${e}\n`);
        }
    }
    // ── overrides ──────────────────────────────────────────────────────────────
    async define(workflow) {
        await super.define(workflow);
        this.persist();
    }
    async undefine(workflowId) {
        await super.undefine(workflowId);
        this.persist();
    }
    async start(workflowId, input, options = {}) {
        const instance = await super.start(workflowId, input, options);
        this.persist();
        return instance;
    }
    async cancel(instanceId, reason) {
        await super.cancel(instanceId, reason);
        this.persist();
    }
    async pause(instanceId) {
        await super.pause(instanceId);
        this.persist();
    }
    async resume(instanceId, input) {
        await super.resume(instanceId, input);
        this.persist();
    }
    async approve(instanceId, stepId, approverId) {
        await super.approve(instanceId, stepId, approverId);
        this.persist();
    }
    async reject(instanceId, stepId, approverId, reason) {
        await super.reject(instanceId, stepId, approverId, reason);
        this.persist();
    }
}
//# sourceMappingURL=file-workflow-engine.impl.js.map