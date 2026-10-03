/**
 * MEMORY BUS — Frozen Interface
 * Shared persistent memory layer. No module owns this.
 * Empire Assistant reads/writes here like any other module.
 *
 * STABILITY STATUS: FROZEN — do not change without Josh approval.
 */
export type MemoryScope = 'global' | 'session' | 'module' | 'user';
export interface MemoryEntry {
    key: string;
    value: unknown;
    scope: MemoryScope;
    moduleId?: string;
    userId?: string;
    createdAt: string;
    updatedAt: string;
    expiresAt?: string;
    tags?: string[];
}
export interface MemoryQuery {
    scope?: MemoryScope;
    moduleId?: string;
    tags?: string[];
    keyPattern?: string;
    limit?: number;
    offset?: number;
}
export type MemoryHandler = (entry: MemoryEntry, change: 'write' | 'delete') => void | Promise<void>;
export type Unsubscribe = () => void;
/**
 * MemoryBus: shared context store across the entire platform.
 * Implemented once by the platform. Injected into every module.
 * Backed by Redis (hot) + PostgreSQL (cold) in production.
 */
export interface MemoryBus {
    read(key: string, scope?: MemoryScope): Promise<MemoryEntry | null>;
    write(key: string, value: unknown, options?: MemoryWriteOptions): Promise<void>;
    delete(key: string, scope?: MemoryScope): Promise<void>;
    search(query: MemoryQuery): Promise<MemoryEntry[]>;
    subscribe(pattern: string, handler: MemoryHandler): Unsubscribe;
    clear(scope: MemoryScope, moduleId?: string): Promise<number>;
}
export interface MemoryWriteOptions {
    scope?: MemoryScope;
    ttlSeconds?: number;
    tags?: string[];
    moduleId?: string;
}
//# sourceMappingURL=memory-bus.d.ts.map