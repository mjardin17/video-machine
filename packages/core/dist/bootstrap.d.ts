/**
 * EMPIRE OS CORE — Bootstrap
 * Wires all 6 core services together and returns a ready CoreServices object.
 * Import this in apps/api/main.py equivalent for Node, or in your Next.js server init.
 *
 * Usage:
 *   import { bootstrap } from '@empire-os/core/bootstrap'
 *   const services = await bootstrap()
 *   // Pass services to every module via module.init(services, config)
 */
import type { CoreServices } from './interfaces/empire-module.js';
export interface BootstrapOptions {
    /** Skip registering built-in workflow definitions (useful in tests) */
    skipBuiltinWorkflows?: boolean;
    /**
     * Directory to store persistent data files.
     * When set, FileMemoryBus / FileEventBus / FileWorkflowEngine are used instead of
     * in-memory implementations. State survives server restarts.
     * Example: '.empire-data'  (relative to CWD) or an absolute path.
     */
    dataDir?: string;
}
export declare function bootstrap(options?: BootstrapOptions): Promise<CoreServices>;
/** Reset singleton (tests only) */
export declare function _resetBootstrap(): void;
//# sourceMappingURL=bootstrap.d.ts.map