/**
 * Event Bus — In-Process Implementation
 * Dev: pure in-memory pub/sub with history ring buffer.
 * Prod: swap to Redis pub/sub + PostgreSQL EventLog for durability.
 */
import type { EventBus, DomainEvent, EventHandler, SubscribeOptions, HistoryOptions, EventBusStats, Unsubscribe } from '../interfaces/index.js';
export declare class InProcessEventBus implements EventBus {
    private subscribers;
    private _history;
    private _stats;
    publish(event: Omit<DomainEvent, 'id' | 'timestamp'>): Promise<DomainEvent>;
    subscribe(topic: string, handler: EventHandler, options?: SubscribeOptions): Unsubscribe;
    history(topic: string, options?: HistoryOptions): Promise<DomainEvent[]>;
    stats(): Promise<EventBusStats>;
    replay(correlationId: string): Promise<DomainEvent[]>;
}
//# sourceMappingURL=event-bus.impl.d.ts.map