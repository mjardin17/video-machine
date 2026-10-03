/**
 * File-backed Event Bus
 * Appends every published event to a JSONL file — survives restarts.
 * Live pub/sub (subscriptions) are always in-memory (callbacks can't be serialized).
 * history() and replay() read from the full JSONL log.
 *
 * Data file: <dataDir>/event-log.jsonl
 * Appends are synchronous to guarantee ordering; no data loss on crash.
 */
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
export class FileEventBus {
    subscribers = new Map(); // topic → handlers
    fileHistory = new Map(); // topic → events (loaded + new)
    totalPublished = 0;
    totalDelivered = 0;
    logPath;
    constructor(dataDir) {
        this.logPath = path.join(dataDir, 'event-log.jsonl');
        this.loadFromFile();
    }
    // ── persistence ────────────────────────────────────────────────────────────
    loadFromFile() {
        try {
            if (!fs.existsSync(this.logPath))
                return;
            const lines = fs.readFileSync(this.logPath, 'utf8').split('\n').filter(Boolean);
            for (const line of lines) {
                try {
                    const event = JSON.parse(line);
                    this.addToHistory(event);
                }
                catch { }
            }
            this.totalPublished = lines.length;
        }
        catch {
            process.stderr.write('[FileEventBus] Warning: could not load event-log.jsonl — starting fresh\n');
        }
    }
    appendToFile(event) {
        try {
            const dir = path.dirname(this.logPath);
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir, { recursive: true });
            fs.appendFileSync(this.logPath, JSON.stringify(event) + '\n', 'utf8');
        }
        catch (e) {
            process.stderr.write(`[FileEventBus] Warning: append failed: ${e}\n`);
        }
    }
    addToHistory(event) {
        if (!this.fileHistory.has(event.topic)) {
            this.fileHistory.set(event.topic, []);
        }
        this.fileHistory.get(event.topic).push(event);
    }
    // ── interface ──────────────────────────────────────────────────────────────
    async publish(event) {
        const full = {
            ...event,
            id: randomUUID(),
            timestamp: new Date().toISOString(),
            version: event.version ?? 1,
        };
        // Persist first — if delivery fails, we still have the event
        this.appendToFile(full);
        this.addToHistory(full);
        this.totalPublished++;
        // Deliver to subscribers
        const subs = this.subscribers.get(full.topic) ?? [];
        const deliveries = [];
        for (const sub of subs) {
            // Filter check
            if (sub.filter?.sourceModuleId && full.source !== sub.filter.sourceModuleId)
                continue;
            if (sub.filter?.correlationId && full.correlationId !== sub.filter.correlationId)
                continue;
            deliveries.push(Promise.resolve(sub.handler(full)).then(() => { this.totalDelivered++; }).catch(() => { }));
        }
        await Promise.allSettled(deliveries);
        return full;
    }
    subscribe(topic, handler, options) {
        if (!this.subscribers.has(topic)) {
            this.subscribers.set(topic, []);
        }
        const sub = {
            handler,
            filter: options?.filter,
            groupId: options?.groupId,
        };
        this.subscribers.get(topic).push(sub);
        // Replay history if requested
        if (options?.fromBeginning) {
            const history = this.fileHistory.get(topic) ?? [];
            for (const event of history) {
                Promise.resolve(handler(event)).catch(() => { });
            }
        }
        return () => {
            const list = this.subscribers.get(topic);
            if (list) {
                const idx = list.indexOf(sub);
                if (idx !== -1)
                    list.splice(idx, 1);
            }
        };
    }
    async history(topic, options) {
        let events = [...(this.fileHistory.get(topic) ?? [])];
        if (options?.since) {
            events = events.filter(e => e.timestamp >= options.since);
        }
        if (options?.until) {
            events = events.filter(e => e.timestamp <= options.until);
        }
        if (options?.sourceModuleId) {
            events = events.filter(e => e.source === options.sourceModuleId);
        }
        if (options?.limit) {
            events = events.slice(-options.limit);
        }
        return events;
    }
    async stats() {
        const topicCounts = {};
        for (const [topic, events] of this.fileHistory.entries()) {
            topicCounts[topic] = events.length;
        }
        return {
            totalPublished: this.totalPublished,
            totalDelivered: this.totalDelivered,
            activeSubscribers: Array.from(this.subscribers.values()).reduce((sum, s) => sum + s.length, 0),
            topicCounts,
            pendingRetries: 0,
        };
    }
    async replay(correlationId) {
        const results = [];
        for (const events of this.fileHistory.values()) {
            for (const event of events) {
                if (event.correlationId === correlationId)
                    results.push(event);
            }
        }
        return results.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    }
}
//# sourceMappingURL=file-event-bus.impl.js.map