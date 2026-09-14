import { randomUUID } from "node:crypto";
import { selectPhotos } from "./photoSelector.js";
import { evaluateEligibility } from "./qualityGate.js";
import { buildScenePlan } from "./scenePlanner.js";
import type { Campaign, CreateCampaignInput } from "./types.js";
import { renderQueue } from "../services/renderQueue.js";

export function createCampaign(input: CreateCampaignInput): Campaign {
  const createdAt = new Date().toISOString();
  const eligibility = evaluateEligibility(input);
  const auditEvents = [{ at: createdAt, type: "campaign.received", message: "Campaign request accepted for evaluation" }];
  if (!eligibility.eligible) {
    return { id: `cf_${randomUUID()}`, input, status: "REJECTED", eligibility, jobs: [], artifacts: [], auditEvents: [...auditEvents, { at: createdAt, type: "campaign.rejected", message: eligibility.reasons.join("; ") }], createdAt, updatedAt: createdAt };
  }
  const selectedPhotos = selectPhotos(input.photos);
  const jobs = (input.aspectRatios ?? ["9:16"]).map((aspectRatio) => renderQueue.enqueue({ id: `job_${randomUUID()}`, aspectRatio, status: "QUEUED", scenePlan: buildScenePlan(input, selectedPhotos, aspectRatio) }));
  return { id: `cf_${randomUUID()}`, input, status: "QUEUED", eligibility, selectedPhotos, jobs, artifacts: [], auditEvents: [...auditEvents, { at: createdAt, type: "campaign.queued", message: "Mock render jobs queued; no renderer is connected" }], createdAt, updatedAt: createdAt };
}
