import { campaignStore } from "../services/campaignStore.js";
import { isVerifiedMp4 } from "../services/artifactVerifier.js";

export function getArtifactsResponse(campaignId: string) {
  const campaign = campaignStore.get(campaignId);
  if (!campaign) return undefined;
  return { campaignId, artifacts: campaign.artifacts.filter(isVerifiedMp4) };
}
