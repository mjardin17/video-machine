import { aspectRatios, type AspectRatio, type CreateCampaignInput, type ProductPhoto } from "./types.js";

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

function parsePhoto(value: unknown, index: number): ProductPhoto {
  if (!isRecord(value) || !isNonEmptyString(value.id) || !isNonEmptyString(value.url) || typeof value.width !== "number" || typeof value.height !== "number" || typeof value.approved !== "boolean") {
    throw new Error(`photos[${index}] must include id, url, width, height, and approved`);
  }
  return { id: value.id, url: value.url, width: value.width, height: value.height, approved: value.approved, alt: isNonEmptyString(value.alt) ? value.alt : undefined };
}

export function parseCreateCampaignInput(value: unknown): CreateCampaignInput {
  if (!isRecord(value)) throw new Error("Request body must be a JSON object");
  if (!isNonEmptyString(value.externalProductId)) throw new Error("externalProductId is required");
  if (!isNonEmptyString(value.title)) throw new Error("title is required");
  if (!isNonEmptyString(value.cta)) throw new Error("cta is required");
  if (!isRecord(value.price) || typeof value.price.amount !== "number" || !Number.isFinite(value.price.amount) || value.price.amount < 0 || !isNonEmptyString(value.price.currency)) {
    throw new Error("price.amount must be a non-negative number and price.currency is required");
  }
  if (!Array.isArray(value.photos)) throw new Error("photos must be an array");
  const requested = Array.isArray(value.aspectRatios) ? value.aspectRatios : ["9:16"];
  if (!requested.every((ratio): ratio is AspectRatio => typeof ratio === "string" && (aspectRatios as readonly string[]).includes(ratio))) {
    throw new Error("aspectRatios contains an unsupported value");
  }
  const uniqueRatios = [...new Set(requested)] as AspectRatio[];
  return {
    externalProductId: value.externalProductId.trim(),
    title: value.title.trim(),
    price: { amount: value.price.amount, currency: value.price.currency.trim().toUpperCase() },
    condition: isNonEmptyString(value.condition) ? value.condition.trim() : undefined,
    size: isNonEmptyString(value.size) ? value.size.trim() : undefined,
    brand: isNonEmptyString(value.brand) ? value.brand.trim() : undefined,
    cta: value.cta.trim(),
    photos: value.photos.map(parsePhoto),
    aspectRatios: uniqueRatios
  };
}
