/**
 * Memory Bus — In-Memory + Redis-ready Implementation
 * Hot layer: Map (dev) / Redis (prod).
 * Cold layer: PostgreSQL via AgentLog table (add MemoryEntry model for prod).
 */
import type { MemoryBus, MemoryEntry, MemoryScope, MemoryQuery, MemoryHandler, MemoryWriteOptions, Unsubscribe } from '../interfaces/index.js';
export declare class InMemoryMemoryBus implements MemoryBus {
    private store;
    private subscribers;
    private storeKey;
    private isExpired;
    private matchPattern;
    private notifySubscribers;
    read(key: string, scope?: MemoryScope): Promise<MemoryEntry | null>;
    write(key: string, value: unknown, options?: MemoryWriteOptions): Promise<void>;
    delete(key: string, scope?: MemoryScope): Promise<void>;
    search(query: MemoryQuery): Promise<MemoryEntry[]>;
    subscribe(pattern: string, handler: MemoryHandler): Unsubscribe;
    clear(scope: MemoryScope, moduleId?: string): Promise<number>;
}
//# sourceMappingURL=memory-bus.impl.d.ts.map