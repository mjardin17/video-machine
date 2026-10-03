/**
 * EMPIRE MODULE CONTRACT — Frozen Interface
 * Every module in Empire OS — including Empire Assistant — implements this.
 * The platform injects CoreServices at init time. Modules never own these services.
 *
 * Empire Assistant is a MODULE, not a core service.
 * It CONSUMES CoreServices. It does NOT own memory, AI routing, or orchestration.
 *
 * STABILITY STATUS: FROZEN — do not change without Josh approval.
 */
/**
 * BaseModule: optional abstract base class modules can extend.
 * Provides default implementations for boilerplate methods.
 * Not required — modules can implement EmpireModule directly.
 */
export class BaseModule {
    services;
    config;
    async init(services, config) {
        this.services = services;
        this.config = config;
        await this.onInit();
    }
    /**
     * Override this instead of init() to keep service injection clean.
     */
    async onInit() { }
    async handleEvent(_event) {
        // Default: no-op. Override to handle events.
    }
    async health() {
        return { status: 'healthy', checkedAt: new Date().toISOString() };
    }
    async shutdown() {
        // Default: no-op. Override for cleanup.
    }
    /**
     * Convenience: emit an event through the platform's event bus.
     */
    emit(topic, payload, correlationId) {
        return this.services.eventBus.publish({
            topic,
            source: this.moduleId,
            payload,
            correlationId,
        });
    }
}
//# sourceMappingURL=empire-module.js.map