import type { Campaign } from "../domain/types.js";

export class CampaignStore {
  private readonly campaigns = new Map<string, Campaign>();

  save(campaign: Campaign): Campaign {
    this.campaigns.set(campaign.id, campaign);
    return campaign;
  }

  get(id: string): Campaign | undefined {
    return this.campaigns.get(id);
  }
}

export const campaignStore = new CampaignStore();
