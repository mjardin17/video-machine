/**
 * EVENT BUS — Frozen Interface
 * Pub/sub backbone. Modules talk to each other through events.
 * No module imports another module directly — only events.
 *
 * STABILITY STATUS: FROZEN — do not change without Josh approval.
 */
import type { Unsubscribe } from './memory-bus.js';
export interface DomainEvent {
    id: string;
    topic: string;
    source: string;
    payload: unknown;
    timestamp: string;
    correlationId?: string;
    causationId?: string;
    version?: number;
}
export type EventHandler = (event: DomainEvent) => void | Promise<void>;
export interface EventFilter {
    sourceModuleId?: string;
    correlationId?: string;
    payloadMatch?: Record<string, unknown>;
}
export interface SubscribeOptions {
    filter?: EventFilter;
    fromBeginning?: boolean;
    groupId?: string;
}
export interface HistoryOptions {
    since?: string;
    until?: string;
    limit?: number;
    sourceModuleId?: string;
}
export interface EventBusStats {
    totalPublished: number;
    totalDelivered: number;
    activeSubscribers: number;
    topicCounts: Record<string, number>;
    pendingRetries: number;
}
/**
 * Well-known topics — modules MUST use these string constants.
 * Adding a new topic requires updating this list and AGENT_MEMORY.md.
 */
export declare const TOPICS: {
    readonly RENDER_QUEUED: "render.queued";
    readonly RENDER_STARTED: "render.started";
    readonly RENDER_COMPLETED: "render.completed";
    readonly RENDER_FAILED: "render.failed";
    readonly SCRIPT_CREATED: "script.created";
    readonly EPISODE_UPLOADED: "episode.uploaded";
    readonly AGENT_ACTION: "agent.action";
    readonly AGENT_ERROR: "agent.error";
    readonly WORKFLOW_STARTED: "workflow.started";
    readonly WORKFLOW_STEP_DONE: "workflow.step.completed";
    readonly WORKFLOW_COMPLETED: "workflow.completed";
    readonly WORKFLOW_FAILED: "workflow.failed";
    readonly MODULE_REGISTERED: "module.registered";
    readonly MODULE_HEALTH_CHANGED: "module.health.changed";
    readonly SYSTEM_ALERT: "system.alert";
};
export type KnownTopic = typeof TOPICS[keyof typeof TOPICS];
/**
 * EventBus: the nervous system of Empire OS.
 * All cross-module communication happens here.
 * Backed by Redis pub/sub (ephemeral) + PostgreSQL EventLog (durable).
 */
export interface EventBus {
    publish(event: Omit<DomainEvent, 'id' | 'timestamp'>): Promise<DomainEvent>;
    subscribe(topic: string, handler: EventHandler, options?: SubscribeOptions): Unsubscribe;
    history(topic: string, options?: HistoryOptions): Promise<DomainEvent[]>;
    stats(): Promise<EventBusStats>;
    replay(correlationId: string): Promise<DomainEvent[]>;
}
//# sourceMappingURL=event-bus.d.ts.map