import type { AspectRatio, Campaign, CreateCampaignInput } from "../domain/types.js";

export interface BossListerCampaignRequest extends CreateCampaignInput {}

export interface BossListerCampaignStatus {
  campaignId: string;
  externalProductId: string;
  status: Campaign["status"];
  outputs: Array<{ aspectRatio: AspectRatio; status: string; artifactUrl?: string }>;
}

export interface BossListerWebhookPayload extends BossListerCampaignStatus {
  event: "campaign.completed" | "campaign.failed";
}

export function toBossListerStatus(campaign: Campaign): BossListerCampaignStatus {
  return {
    campaignId: campaign.id,
    externalProductId: campaign.input.externalProductId,
    status: campaign.status,
    outputs: campaign.jobs.map((job) => ({ aspectRatio: job.aspectRatio, status: job.status, artifactUrl: campaign.artifacts.find((artifact) => artifact.jobId === job.id)?.url }))
  };
}
