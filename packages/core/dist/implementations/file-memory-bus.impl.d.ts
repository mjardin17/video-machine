/**
 * File-backed Memory Bus
 * Persists all memory entries to disk as JSON. Survives server restarts.
 * Drop-in replacement for InMemoryMemoryBus — identical interface.
 *
 * Data file: <dataDir>/memory-bus.json
 * Writes are atomic (temp file + rename) to prevent corruption.
 */
import type { MemoryBus, MemoryEntry, MemoryScope, MemoryQuery, MemoryHandler, MemoryWriteOptions, Unsubscribe } from '../interfaces/index.js';
export declare class FileMemoryBus implements MemoryBus {
    private store;
    private subscribers;
    private readonly filePath;
    constructor(dataDir: string);
    private load;
    private persist;
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
//# sourceMappingURL=file-memory-bus.impl.d.ts.map