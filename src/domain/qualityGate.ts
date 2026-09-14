import type { CreateCampaignInput, EligibilityResult } from "./types.js";

export function evaluateEligibility(input: CreateCampaignInput): EligibilityResult {
  const approved = input.photos.filter((photo) => photo.approved);
  const hasLargePhoto = approved.some((photo) => Math.min(photo.width, photo.height) >= 1200);
  const reasons: string[] = [];
  if (!input.title.trim()) reasons.push("A title is required");
  if (!input.cta.trim()) reasons.push("A call to action is required");
  if (input.price.amount < 0) reasons.push("A non-negative price is required");
  if (approved.length < 2) reasons.push("At least two approved photos are required");
  if (!hasLargePhoto) reasons.push("At least one approved photo must be at least 1200px on its shortest edge");
  return { eligible: reasons.length === 0, reasons, approvedPhotoCount: approved.length, hasLargePhoto };
}
