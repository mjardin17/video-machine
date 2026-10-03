/**
 * File-backed Workflow Engine
 * Extends InMemoryWorkflowEngine, persisting definitions and instances to JSON.
 * On startup, loads saved state so in-flight workflows survive server restarts.
 *
 * Data file: <dataDir>/workflow-state.json
 * Writes are atomic (temp file + rename) to prevent corruption.
 */
import type { WorkflowDefinition, WorkflowInstance, StartOptions } from '../interfaces/index.js';
import type { ModuleGateway, EventBus } from '../interfaces/index.js';
import { InMemoryWorkflowEngine } from './workflow-engine.impl.js';
export declare class FileWorkflowEngine extends InMemoryWorkflowEngine {
    private readonly filePath;
    constructor(gateway: ModuleGateway, eventBus: EventBus, dataDir: string);
    private load;
    private persist;
    define(workflow: WorkflowDefinition): Promise<void>;
    undefine(workflowId: string): Promise<void>;
    start(workflowId: string, input: unknown, options?: StartOptions): Promise<WorkflowInstance>;
    cancel(instanceId: string, reason?: string): Promise<void>;
    pause(instanceId: string): Promise<void>;
    resume(instanceId: string, input?: unknown): Promise<void>;
    approve(instanceId: string, stepId: string, approverId: string): Promise<void>;
    reject(instanceId: string, stepId: string, approverId: string, reason: string): Promise<void>;
}
//# sourceMappingURL=file-workflow-engine.impl.d.ts.map