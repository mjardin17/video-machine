/**
 * PLUGIN REGISTRY — Frozen Interface
 * Central catalog of every module, tool, connector, and AI provider in the system.
 * Nothing runs unless it's registered here.
 *
 * STABILITY STATUS: FROZEN — do not change without Josh approval.
 */
export type PluginType = 'module' | 'tool' | 'connector' | 'ai-provider' | 'workflow';
export type PluginStatus = 'active' | 'inactive' | 'error' | 'starting' | 'deprecated';
export interface PluginCapability {
    name: string;
    version: string;
    description?: string;
}
export interface PluginDependency {
    pluginId: string;
    minVersion: string;
    optional?: boolean;
}
export interface PluginDescriptor {
    id: string;
    name: string;
    version: string;
    type: PluginType;
    description: string;
    author?: string;
    capabilities: PluginCapability[];
    dependencies?: PluginDependency[];
    config?: Record<string, unknown>;
    status: PluginStatus;
    errorMessage?: string;
    registeredAt: string;
    updatedAt: string;
    baseUrl?: string;
    tags?: string[];
}
export interface PluginFilter {
    type?: PluginType | PluginType[];
    status?: PluginStatus | PluginStatus[];
    capability?: string;
    tags?: string[];
}
export interface RegistryStats {
    total: number;
    byType: Record<PluginType, number>;
    byStatus: Record<PluginStatus, number>;
    capabilities: string[];
}
/**
 * PluginRegistry: the source of truth for what exists in Empire OS.
 * Before a module can receive requests or publish events, it must be registered.
 * The registry is read by the ModuleGateway to route requests.
 */
export interface PluginRegistry {
    register(descriptor: Omit<PluginDescriptor, 'registeredAt' | 'updatedAt'>): Promise<PluginDescriptor>;
    unregister(pluginId: string): Promise<void>;
    update(pluginId: string, updates: Partial<PluginDescriptor>): Promise<PluginDescriptor>;
    get(pluginId: string): Promise<PluginDescriptor | null>;
    list(filter?: PluginFilter): Promise<PluginDescriptor[]>;
    hasCapability(capability: string): Promise<boolean>;
    findByCapability(capability: string): Promise<PluginDescriptor[]>;
    setStatus(pluginId: string, status: PluginStatus, errorMessage?: string): Promise<void>;
    stats(): Promise<RegistryStats>;
    validateDependencies(pluginId: string): Promise<{
        valid: boolean;
        missing: string[];
    }>;
}
//# sourceMappingURL=plugin-registry.d.ts.map