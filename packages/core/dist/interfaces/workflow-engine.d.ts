/**
 * WORKFLOW ENGINE — Frozen Interface
 * Multi-step pipeline orchestration. Defines how work moves through the system.
 * The render pipeline (script→images→TTS→FFmpeg→MP4) is one workflow.
 * Empire Assistant triggers workflows — it does not implement them.
 *
 * STABILITY STATUS: FROZEN — do not change without Josh approval.
 */
export type WorkflowStepType = 'action' | 'decision' | 'parallel' | 'wait' | 'human-approval';
export type WorkflowInstanceStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
export interface WorkflowStep {
    id: string;
    type: WorkflowStepType;
    name: string;
    description?: string;
    moduleId: string;
    action: string;
    inputMapping?: Record<string, string>;
    outputMapping?: Record<string, string>;
    onSuccess?: string;
    onFailure?: string;
    retryPolicy?: RetryPolicy;
    timeoutMs?: number;
    conditions?: WorkflowCondition[];
    branches?: string[][];
    waitForEvent?: string;
    approvers?: string[];
    approvalTimeoutMs?: number;
}
export interface WorkflowCondition {
    variable: string;
    operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains' | 'exists';
    value?: unknown;
    nextStepId: string;
}
export interface RetryPolicy {
    maxAttempts: number;
    backoffMs: number;
    backoffMultiplier?: number;
    maxBackoffMs?: number;
}
export interface WorkflowTrigger {
    type: 'event' | 'schedule' | 'api' | 'manual';
    topic?: string;
    cron?: string;
    inputSchema?: Record<string, unknown>;
}
export interface WorkflowDefinition {
    id: string;
    name: string;
    version: string;
    description: string;
    steps: WorkflowStep[];
    initialStep: string;
    inputSchema?: Record<string, unknown>;
    outputSchema?: Record<string, unknown>;
    triggers?: WorkflowTrigger[];
    tags?: string[];
}
export interface WorkflowStepResult {
    stepId: string;
    status: StepStatus;
    output?: unknown;
    error?: string;
    startedAt: string;
    completedAt?: string;
    attempts: number;
}
export interface WorkflowInstance {
    id: string;
    definitionId: string;
    definitionVersion: string;
    status: WorkflowInstanceStatus;
    input: unknown;
    output?: unknown;
    variables: Record<string, unknown>;
    currentStepId?: string;
    stepResults: WorkflowStepResult[];
    triggeredBy: string;
    createdAt: string;
    startedAt?: string;
    completedAt?: string;
    error?: string;
    correlationId?: string;
}
export interface WorkflowFilter {
    definitionId?: string;
    status?: WorkflowInstanceStatus | WorkflowInstanceStatus[];
    triggeredBy?: string;
    since?: string;
    limit?: number;
}
/**
 * WorkflowEngine: orchestrates multi-step pipelines across modules.
 * The render pipeline, upload pipeline, script pipeline all run here.
 * Empire Assistant starts workflows; it doesn't define pipeline logic.
 */
export interface WorkflowEngine {
    define(workflow: WorkflowDefinition): Promise<void>;
    undefine(workflowId: string): Promise<void>;
    definitions(): Promise<WorkflowDefinition[]>;
    start(workflowId: string, input: unknown, options?: StartOptions): Promise<WorkflowInstance>;
    status(instanceId: string): Promise<WorkflowInstance>;
    cancel(instanceId: string, reason?: string): Promise<void>;
    pause(instanceId: string): Promise<void>;
    resume(instanceId: string, input?: unknown): Promise<void>;
    list(filter?: WorkflowFilter): Promise<WorkflowInstance[]>;
    approve(instanceId: string, stepId: string, approverId: string): Promise<void>;
    reject(instanceId: string, stepId: string, approverId: string, reason: string): Promise<void>;
}
export interface StartOptions {
    correlationId?: string;
    dryRun?: boolean;
    priority?: 'low' | 'normal' | 'high';
}
//# sourceMappingURL=workflow-engine.d.ts.map