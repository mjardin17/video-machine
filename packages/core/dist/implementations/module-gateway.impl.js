/**
 * Module Gateway — Implementation
 * Routes internal requests to registered modules via HTTP.
 * Modules never call each other directly — always through here.
 */
export class HttpModuleGateway {
    registry = new Map();
    healthCache = new Map();
    HEALTH_TTL_MS = 30_000;
    async register(descriptor) {
        this.registry.set(descriptor.id, descriptor);
    }
    async unregister(moduleId) {
        this.registry.delete(moduleId);
        this.healthCache.delete(moduleId);
    }
    async list() {
        return Array.from(this.registry.values());
    }
    async status(moduleId) {
        const cached = this.healthCache.get(moduleId);
        if (cached && Date.now() - cached.checkedAt < this.HEALTH_TTL_MS) {
            return cached.status;
        }
        return this.pollHealth(moduleId);
    }
    async pollHealth(moduleId) {
        const descriptor = this.registry.get(moduleId);
        if (!descriptor)
            return 'offline';
        try {
            const url = `${descriptor.baseUrl}${descriptor.healthPath}`;
            const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
            const status = res.ok ? 'healthy' : 'degraded';
            this.healthCache.set(moduleId, { status, checkedAt: Date.now() });
            return status;
        }
        catch {
            this.healthCache.set(moduleId, { status: 'offline', checkedAt: Date.now() });
            return 'offline';
        }
    }
    async hasCapability(capability) {
        return Array.from(this.registry.values()).some(m => m.capabilities.includes(capability));
    }
    async findByCapability(capability) {
        return Array.from(this.registry.values()).filter(m => m.capabilities.includes(capability));
    }
    async route(request) {
        const start = Date.now();
        // Resolve target module
        let target;
        if (request.moduleId) {
            target = this.registry.get(request.moduleId);
            if (!target)
                throw new Error(`Module not found: ${request.moduleId}`);
        }
        else if (request.capability) {
            const candidates = await this.findByCapability(request.capability);
            // Pick by priority (higher = preferred), then first registered
            target = candidates.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))[0];
            if (!target)
                throw new Error(`No module with capability: ${request.capability}`);
        }
        else {
            throw new Error('GatewayRequest requires moduleId or capability');
        }
        const url = `${target.baseUrl}${request.path}`;
        const timeout = request.timeoutMs ?? 30_000;
        const headers = {
            'Content-Type': 'application/json',
            'X-Correlation-Id': request.correlationId ?? crypto.randomUUID(),
            'X-Source-Module': 'empire-os-gateway',
            ...request.headers,
        };
        const res = await fetch(url, {
            method: request.method,
            headers,
            body: request.body !== undefined ? JSON.stringify(request.body) : undefined,
            signal: AbortSignal.timeout(timeout),
        });
        let body;
        const contentType = res.headers.get('content-type') ?? '';
        if (contentType.includes('application/json')) {
            body = await res.json();
        }
        else {
            body = await res.text();
        }
        return {
            status: res.status,
            body,
            headers: Object.fromEntries(res.headers.entries()),
            moduleId: target.id,
            durationMs: Date.now() - start,
        };
    }
}
//# sourceMappingURL=module-gateway.impl.js.map