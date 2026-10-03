/**
 * EVENT BUS — Frozen Interface
 * Pub/sub backbone. Modules talk to each other through events.
 * No module imports another module directly — only events.
 *
 * STABILITY STATUS: FROZEN — do not change without Josh approval.
 */
/**
 * Well-known topics — modules MUST use these string constants.
 * Adding a new topic requires updating this list and AGENT_MEMORY.md.
 */
export const TOPICS = {
    // Render pipeline
    RENDER_QUEUED: 'render.queued',
    RENDER_STARTED: 'render.started',
    RENDER_COMPLETED: 'render.completed',
    RENDER_FAILED: 'render.failed',
    // Script / Episode
    SCRIPT_CREATED: 'script.created',
    EPISODE_UPLOADED: 'episode.uploaded',
    // Agent activity
    AGENT_ACTION: 'agent.action',
    AGENT_ERROR: 'agent.error',
    // Workflow
    WORKFLOW_STARTED: 'workflow.started',
    WORKFLOW_STEP_DONE: 'workflow.step.completed',
    WORKFLOW_COMPLETED: 'workflow.completed',
    WORKFLOW_FAILED: 'workflow.failed',
    // Module lifecycle
    MODULE_REGISTERED: 'module.registered',
    MODULE_HEALTH_CHANGED: 'module.health.changed',
    // System
    SYSTEM_ALERT: 'system.alert',
};
//# sourceMappingURL=event-bus.js.map