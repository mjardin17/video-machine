/**
 * Plugin Registry — In-Memory Implementation
 * Production: swap backing store to PostgreSQL via Prisma.
 * This impl is the source of truth for all registered plugins/modules.
 */
import type { PluginRegistry, PluginDescriptor, PluginFilter, PluginStatus, RegistryStats } from '../interfaces/index.js';
export declare class InMemoryPluginRegistry implements PluginRegistry {
    private store;
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
//# sourceMappingURL=plugin-registry.impl.d.ts.map