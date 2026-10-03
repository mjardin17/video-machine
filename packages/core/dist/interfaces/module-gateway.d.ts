/**
 * MODULE GATEWAY — Frozen Interface
 * Internal API gateway. Every module registers here.
 * External requests come in → gateway routes to the right module.
 *
 * STABILITY STATUS: FROZEN — do not change without Josh approval.
 */
export type ModuleStatus = 'healthy' | 'degraded' | 'offline' | 'starting';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export interface ModuleEndpoint {
    path: string;
    method: HttpMethod;
    description: string;
    inputSchema?: Record<string, unknown>;
    outputSchema?: Record<string, unknown>;
    auth?: boolean;
    rateLimit?: number;
}
export interface ModuleDescriptor {
    id: string;
    name: string;
    version: string;
    description: string;
    capabilities: string[];
    endpoints: ModuleEndpoint[];
    healthPath: string;
    baseUrl: string;
    priority?: number;
}
export interface GatewayRequest {
    moduleId?: string;
    capability?: string;
    path: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    body?: unknown;
    correlationId?: string;
    timeoutMs?: number;
}
export interface GatewayResponse {
    status: number;
    body: unknown;
    headers?: Record<string, string>;
    moduleId: string;
    durationMs: number;
}
/**
 * ModuleGateway: the platform's internal service mesh.
 * Every capability is addressable through here.
 * Modules never call each other directly — always through the gateway.
 */
export interface ModuleGateway {
    register(descriptor: ModuleDescriptor): Promise<void>;
    unregister(moduleId: string): Promise<void>;
    route(request: GatewayRequest): Promise<GatewayResponse>;
    list(): Promise<ModuleDescriptor[]>;
    status(moduleId: string): Promise<ModuleStatus>;
    hasCapability(capability: string): Promise<boolean>;
    findByCapability(capability: string): Promise<ModuleDescriptor[]>;
}
//# sourceMappingURL=module-gateway.d.ts.map