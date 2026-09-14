import { assertFactualText, formatPrice } from "../domain/factGuard.js";
import type { CreateCampaignInput, ScenePlan, SelectedPhotos, AspectRatio } from "../domain/types.js";

export function buildCleanShowcasePlan(input: CreateCampaignInput, photos: SelectedPhotos, aspectRatio: AspectRatio): ScenePlan {
  const title = assertFactualText(input.title);
  const descriptors = [input.brand, input.condition, input.size].filter((value): value is string => Boolean(value)).map(assertFactualText);
  const detail = descriptors.join(" • ");
  const price = formatPrice(input.price.amount, input.price.currency);
  return {
    template: "clean-showcase",
    aspectRatio,
    durationSeconds: 15,
    scenes: [
      { order: 1, durationSeconds: 4, photoId: photos.hero.id, headline: title },
      { order: 2, durationSeconds: 4, photoId: photos.detail.id, detail: detail || undefined },
      { order: 3, durationSeconds: 4, photoId: (photos.alternate ?? photos.hero).id, detail: price },
      { order: 4, durationSeconds: 3, photoId: (photos.proof ?? photos.detail).id, cta: assertFactualText(input.cta) }
    ]
  };
}
