/**
 * File-backed Event Bus
 * Appends every published event to a JSONL file — survives restarts.
 * Live pub/sub (subscriptions) are always in-memory (callbacks can't be serialized).
 * history() and replay() read from the full JSONL log.
 *
 * Data file: <dataDir>/event-log.jsonl
 * Appends are synchronous to guarantee ordering; no data loss on crash.
 */
import type { EventBus, DomainEvent, EventHandler, SubscribeOptions, HistoryOptions, EventBusStats, Unsubscribe } from '../interfaces/index.js';
export declare class FileEventBus implements EventBus {
    private subscribers;
    private fileHistory;
    private totalPublished;
    private totalDelivered;
    private readonly logPath;
    constructor(dataDir: string);
    private loadFromFile;
    private appendToFile;
    private addToHistory;
    publish(event: Omit<DomainEvent, 'id' | 'timestamp'>): Promise<DomainEvent>;
    subscribe(topic: string, handler: EventHandler, options?: SubscribeOptions): Unsubscribe;
    history(topic: string, options?: HistoryOptions): Promise<DomainEvent[]>;
    stats(): Promise<EventBusStats>;
    replay(correlationId: string): Promise<DomainEvent[]>;
}
//# sourceMappingURL=file-event-bus.impl.d.ts.map