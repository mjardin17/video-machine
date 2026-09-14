import type { ProductPhoto, SelectedPhotos } from "./types.js";

const area = (photo: ProductPhoto) => photo.width * photo.height;

export function selectPhotos(photos: ProductPhoto[]): SelectedPhotos {
  const sorted = photos.filter((photo) => photo.approved).sort((a, b) => area(b) - area(a) || a.id.localeCompare(b.id));
  if (sorted.length < 2) throw new Error("At least two approved photos are required");
  return { hero: sorted[0], detail: sorted[1], alternate: sorted[2], proof: sorted[3] };
}
