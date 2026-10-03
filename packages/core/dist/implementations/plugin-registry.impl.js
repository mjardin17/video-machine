/**
 * Plugin Registry — In-Memory Implementation
 * Production: swap backing store to PostgreSQL via Prisma.
 * This impl is the source of truth for all registered plugins/modules.
 */
export class InMemoryPluginRegistry {
    store = new Map();
    async register(descriptor) {
        const now = new Date().toISOString();
        const existing = this.store.get(descriptor.id);
        const full = {
            ...descriptor,
            registeredAt: existing?.registeredAt ?? now,
            updatedAt: now,
        };
        this.store.set(descriptor.id, full);
        return full;
    }
    async unregister(pluginId) {
        this.store.delete(pluginId);
    }
    async update(pluginId, updates) {
        const existing = this.store.get(pluginId);
        if (!existing)
            throw new Error(`Plugin not found: ${pluginId}`);
        const updated = {
            ...existing,
            ...updates,
            id: existing.id,
            registeredAt: existing.registeredAt,
            updatedAt: new Date().toISOString(),
        };
        this.store.set(pluginId, updated);
        return updated;
    }
    async get(pluginId) {
        return this.store.get(pluginId) ?? null;
    }
    async list(filter) {
        let results = Array.from(this.store.values());
        if (!filter)
            return results;
        if (filter.type) {
            const types = Array.isArray(filter.type) ? filter.type : [filter.type];
            results = results.filter(p => types.includes(p.type));
        }
        if (filter.status) {
            const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
            results = results.filter(p => statuses.includes(p.status));
        }
        if (filter.capability) {
            results = results.filter(p => p.capabilities.some(c => c.name === filter.capability));
        }
        if (filter.tags?.length) {
            results = results.filter(p => filter.tags.every(t => p.tags?.includes(t)));
        }
        return results;
    }
    async hasCapability(capability) {
        return Array.from(this.store.values()).some(p => p.status === 'active' && p.capabilities.some(c => c.name === capability));
    }
    async findByCapability(capability) {
        return Array.from(this.store.values()).filter(p => p.status === 'active' && p.capabilities.some(c => c.name === capability));
    }
    async setStatus(pluginId, status, errorMessage) {
        const existing = this.store.get(pluginId);
        if (!existing)
            throw new Error(`Plugin not found: ${pluginId}`);
        this.store.set(pluginId, {
            ...existing,
            status,
            errorMessage: status === 'error' ? errorMessage : undefined,
            updatedAt: new Date().toISOString(),
        });
    }
    async stats() {
        const plugins = Array.from(this.store.values());
        const byType = {};
        const byStatus = {};
        const capSet = new Set();
        for (const p of plugins) {
            byType[p.type] = (byType[p.type] ?? 0) + 1;
            byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;
            p.capabilities.forEach(c => capSet.add(c.name));
        }
        return {
            total: plugins.length,
            byType,
            byStatus,
            capabilities: Array.from(capSet),
        };
    }
    async validateDependencies(pluginId) {
        const plugin = this.store.get(pluginId);
        if (!plugin)
            throw new Error(`Plugin not found: ${pluginId}`);
        const missing = [];
        for (const dep of plugin.dependencies ?? []) {
            const found = this.store.get(dep.pluginId);
            if (!found && !dep.optional)
                missing.push(dep.pluginId);
        }
        return { valid: missing.length === 0, missing };
    }
}
//# sourceMappingURL=plugin-registry.impl.js.map