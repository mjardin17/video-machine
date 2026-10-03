/**
 * AI Router — Implementation
 * Routes requests to the right AI based on strategy, availability, and capability.
 * Model priority: Claude=code/arch, Gemini=research/scripts, GPT=copy, Ollama=local fallback.
 * Actual API calls are delegated to provider adapters (not included here — add your keys).
 */
import type { AIRouter, AIRequest, AIResponse, AITask, AITaskResult, AIModel, AIProvider, AICapability, AIRoutingStrategy, RoutingStats } from '../interfaces/index.js';
/**
 * ConfigurableAIRouter: extends AIRouter with adapter registration.
 * Use this type in server.ts instead of casting to DefaultAIRouter.
 * Kept in implementations (not frozen interfaces) because it is a runtime concern.
 */
export interface ConfigurableAIRouter extends AIRouter {
    registerAdapter(adapter: AIProviderAdapter): void;
    setDefaultStrategy(strategy: AIRoutingStrategy): Promise<void>;
}
export interface AIProviderAdapter {
    provider: AIProvider;
    models: AIModel[];
    complete(messages: AIRequest['messages'], model: string, options: {
        maxTokens?: number;
        temperature?: number;
    }): Promise<{
        content: string;
        inputTokens: number;
        outputTokens: number;
        durationMs: number;
    }>;
    isAvailable(): Promise<boolean>;
}
export declare class DefaultAIRouter implements AIRouter {
    private adapters;
    private defaultStrategy;
    private callLog;
    registerAdapter(adapter: AIProviderAdapter): void;
    private selectModel;
    complete(request: AIRequest): Promise<AIResponse>;
    task(task: AITask): Promise<AITaskResult>;
    models(filter?: {
        provider?: AIProvider;
        capability?: AICapability;
    }): Promise<AIModel[]>;
    stats(windowMinutes?: number): Promise<RoutingStats>;
    setDefaultStrategy(strategy: AIRoutingStrategy): Promise<void>;
}
//# sourceMappingURL=ai-router.impl.d.ts.map