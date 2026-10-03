/**
 * File-backed Memory Bus
 * Persists all memory entries to disk as JSON. Survives server restarts.
 * Drop-in replacement for InMemoryMemoryBus — identical interface.
 *
 * Data file: <dataDir>/memory-bus.json
 * Writes are atomic (temp file + rename) to prevent corruption.
 */
import fs from 'node:fs';
import path from 'node:path';
export class FileMemoryBus {
    store = new Map();
    subscribers = new Map();
    filePath;
    constructor(dataDir) {
        this.filePath = path.join(dataDir, 'memory-bus.json');
        this.load();
    }
    // ── persistence ────────────────────────────────────────────────────────────
    load() {
        try {
            if (!fs.existsSync(this.filePath))
                return;
            const raw = fs.readFileSync(this.filePath, 'utf8');
            const data = JSON.parse(raw);
            for (const [k, v] of Object.entries(data)) {
                // Skip already-expired entries on load
                if (v.expiresAt !== undefined && Date.now() > v.expiresAt)
                    continue;
                this.store.set(k, v);
            }
        }
        catch {
            // Corrupt file — start fresh; old data is logged as warning
            process.stderr.write('[FileMemoryBus] Warning: could not load memory-bus.json — starting fresh\n');
        }
    }
    persist() {
        try {
            const dir = path.dirname(this.filePath);
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir, { recursive: true });
            const data = Object.fromEntries(this.store);
            const tmp = this.filePath + '.tmp';
            fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
            fs.renameSync(tmp, this.filePath); // atomic on same filesystem
        }
        catch (e) {
            process.stderr.write(`[FileMemoryBus] Warning: persist failed: ${e}\n`);
        }
    }
    // ── helpers ────────────────────────────────────────────────────────────────
    storeKey(key, scope) {
        return `${scope}:${key}`;
    }
    isExpired(stored) {
        return stored.expiresAt !== undefined && Date.now() > stored.expiresAt;
    }
    matchPattern(pattern, key) {
        const regex = new RegExp('^' + pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
        return regex.test(key);
    }
    notifySubscribers(key, entry, change) {
        for (const [pattern, handlers] of this.subscribers.entries()) {
            if (this.matchPattern(pattern, key)) {
                for (const handler of handlers) {
                    Promise.resolve(handler(entry, change)).catch(() => { });
                }
            }
        }
    }
    // ── interface ──────────────────────────────────────────────────────────────
    async read(key, scope = 'global') {
        const stored = this.store.get(this.storeKey(key, scope));
        if (!stored)
            return null;
        if (this.isExpired(stored)) {
            this.store.delete(this.storeKey(key, scope));
            this.persist();
            return null;
        }
        return stored.entry;
    }
    async write(key, value, options = {}) {
        const scope = options.scope ?? 'global';
        const storeKey = this.storeKey(key, scope);
        const now = new Date().toISOString();
        const existing = this.store.get(storeKey);
        const entry = {
            key,
            value,
            scope,
            moduleId: options.moduleId,
            createdAt: existing?.entry.createdAt ?? now,
            updatedAt: now,
            tags: options.tags,
            expiresAt: options.ttlSeconds
                ? new Date(Date.now() + options.ttlSeconds * 1000).toISOString()
                : undefined,
        };
        this.store.set(storeKey, {
            entry,
            expiresAt: options.ttlSeconds ? Date.now() + options.ttlSeconds * 1000 : undefined,
        });
        this.persist();
        this.notifySubscribers(key, entry, 'write');
    }
    async delete(key, scope = 'global') {
        const storeKey = this.storeKey(key, scope);
        const stored = this.store.get(storeKey);
        if (stored) {
            this.store.delete(storeKey);
            this.persist();
            this.notifySubscribers(key, stored.entry, 'delete');
        }
    }
    async search(query) {
        const results = [];
        for (const [, stored] of this.store.entries()) {
            if (this.isExpired(stored))
                continue;
            const { entry } = stored;
            if (query.scope && entry.scope !== query.scope)
                continue;
            if (query.moduleId && entry.moduleId !== query.moduleId)
                continue;
            if (query.keyPattern && !this.matchPattern(query.keyPattern, entry.key))
                continue;
            if (query.tags?.length) {
                const hasAll = query.tags.every(t => entry.tags?.includes(t));
                if (!hasAll)
                    continue;
            }
            results.push(entry);
        }
        const offset = query.offset ?? 0;
        const limit = query.limit ?? 100;
        return results.slice(offset, offset + limit);
    }
    subscribe(pattern, handler) {
        if (!this.subscribers.has(pattern)) {
            this.subscribers.set(pattern, new Set());
        }
        this.subscribers.get(pattern).add(handler);
        return () => { this.subscribers.get(pattern)?.delete(handler); };
    }
    async clear(scope, moduleId) {
        let count = 0;
        for (const [key, stored] of this.store.entries()) {
            if (stored.entry.scope !== scope)
                continue;
            if (moduleId && stored.entry.moduleId !== moduleId)
                continue;
            this.store.delete(key);
            count++;
        }
        if (count > 0)
            this.persist();
        return count;
    }
}
//# sourceMappingURL=file-memory-bus.impl.js.map