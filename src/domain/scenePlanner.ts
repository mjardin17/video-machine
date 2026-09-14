import { buildCleanShowcasePlan } from "../templates/cleanShowcase.js";
import type { AspectRatio, CreateCampaignInput, SelectedPhotos } from "./types.js";

export function buildScenePlan(input: CreateCampaignInput, photos: SelectedPhotos, aspectRatio: AspectRatio) {
  return buildCleanShowcasePlan(input, photos, aspectRatio);
}
