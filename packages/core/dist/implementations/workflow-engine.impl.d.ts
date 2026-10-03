/**
 * Workflow Engine — Implementation
 * State-machine orchestrator for multi-step pipelines.
 * Each step delegates work to a module via the ModuleGateway.
 * Persists instance state in-memory (dev) / PostgreSQL (prod).
 */
import type { WorkflowEngine, WorkflowDefinition, WorkflowInstance, WorkflowFilter, StartOptions } from '../interfaces/index.js';
import type { ModuleGateway } from '../interfaces/index.js';
import type { EventBus } from '../interfaces/index.js';
export declare class InMemoryWorkflowEngine implements WorkflowEngine {
    private readonly gateway;
    private readonly eventBus;
    protected _definitions: Map<string, WorkflowDefinition>;
    protected _instances: Map<string, WorkflowInstance>;
    constructor(gateway: ModuleGateway, eventBus: EventBus);
    define(workflow: WorkflowDefinition): Promise<void>;
    undefine(workflowId: string): Promise<void>;
    definitions(): Promise<WorkflowDefinition[]>;
    start(workflowId: string, input: unknown, options?: StartOptions): Promise<WorkflowInstance>;
    private makeInstance;
    private runInstance;
    private resolveInput;
    private failInstance;
    status(instanceId: string): Promise<WorkflowInstance>;
    cancel(instanceId: string, reason?: string): Promise<void>;
    pause(instanceId: string): Promise<void>;
    resume(instanceId: string, input?: unknown): Promise<void>;
    list(filter?: WorkflowFilter): Promise<WorkflowInstance[]>;
    approve(instanceId: string, stepId: string, approverId: string): Promise<void>;
    reject(instanceId: string, stepId: string, approverId: string, reason: string): Promise<void>;
}
//# sourceMappingURL=workflow-engine.impl.d.ts.map