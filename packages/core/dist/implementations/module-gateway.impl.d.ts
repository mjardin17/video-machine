/**
 * Module Gateway — Implementation
 * Routes internal requests to registered modules via HTTP.
 * Modules never call each other directly — always through here.
 */
import type { ModuleGateway, ModuleDescriptor, GatewayRequest, GatewayResponse, ModuleStatus } from '../interfaces/index.js';
export declare class HttpModuleGateway implements ModuleGateway {
    private registry;
    private healthCache;
    private readonly HEALTH_TTL_MS;
    register(descriptor: ModuleDescriptor): Promise<void>;
    unregister(moduleId: string): Promise<void>;
    list(): Promise<ModuleDescriptor[]>;
    status(moduleId: string): Promise<ModuleStatus>;
    private pollHealth;
    hasCapability(capability: string): Promise<boolean>;
    findByCapability(capability: string): Promise<ModuleDescriptor[]>;
    route(request: GatewayRequest): Promise<GatewayResponse>;
}
//# sourceMappingURL=module-gateway.impl.d.ts.map