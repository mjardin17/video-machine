/**
 * Integration test — bootstrap() + all 6 CoreServices
 * This is EA stability criterion 4: a test module instantiates and calls all 6 CoreServices.
 *
 * This test verifies:
 *   1. bootstrap() resolves without throwing
 *   2. All 6 services are present on the returned CoreServices object
 *   3. Each service responds correctly to a baseline operation
 *   4. The singleton pattern works (second call returns same instance)
 *   5. Services are genuinely wired (WorkflowEngine uses the injected EventBus)
 */
export {};
//# sourceMappingURL=bootstrap.test.d.ts.map