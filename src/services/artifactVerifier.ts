import type { Artifact } from "../domain/types.js";

export function isVerifiedMp4(artifact: Artifact): boolean {
  return artifact.mimeType === "video/mp4" && Boolean(artifact.url) && Boolean(artifact.verifiedAt);
}
