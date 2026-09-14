import { createCampaign } from "../domain/campaignFactory.js";
import { parseCreateCampaignInput } from "../domain/validation.js";
import { toBossListerStatus } from "../connectors/bossLister.js";
import { campaignStore } from "../services/campaignStore.js";

export async function createCampaignResponse(body: unknown) {
  const campaign = campaignStore.save(createCampaign(parseCreateCampaignInput(body)));
  return { campaign, integrationStatus: toBossListerStatus(campaign) };
}

export function getCampaignResponse(campaignId: string) {
  const campaign = campaignStore.get(campaignId);
  return campaign ? { campaign, integrationStatus: toBossListerStatus(campaign) } : undefined;
}
