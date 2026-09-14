import type { RenderJob } from "../domain/types.js";

export class MockRenderQueue {
  enqueue(job: RenderJob): RenderJob {
    return { ...job, status: "QUEUED" };
  }
}

export const renderQueue = new MockRenderQueue();
