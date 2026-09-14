export const aspectRatios = ["9:16", "1:1", "16:9"] as const;
export type AspectRatio = (typeof aspectRatios)[number];

export type CampaignStatus = "REJECTED" | "QUEUED" | "PROCESSING" | "SUCCEEDED" | "FAILED";
export type RenderJobStatus = "QUEUED" | "PROCESSING" | "SUCCEEDED" | "FAILED";
export type PhotoRole = "hero" | "detail" | "alternate" | "proof";

export interface ProductPhoto {
  id: string;
  url: string;
  width: number;
  height: number;
  approved: boolean;
  alt?: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface CreateCampaignInput {
  externalProductId: string;
  title: string;
  price: Money;
  condition?: string;
  size?: string;
  brand?: string;
  cta: string;
  photos: ProductPhoto[];
  aspectRatios?: AspectRatio[];
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  approvedPhotoCount: number;
  hasLargePhoto: boolean;
}

export interface SelectedPhotos {
  hero: ProductPhoto;
  detail: ProductPhoto;
  alternate?: ProductPhoto;
  proof?: ProductPhoto;
}

export interface Scene {
  order: number;
  durationSeconds: number;
  photoId: string;
  headline?: string;
  detail?: string;
  cta?: string;
}

export interface ScenePlan {
  template: "clean-showcase";
  aspectRatio: AspectRatio;
  durationSeconds: number;
  scenes: Scene[];
}

export interface RenderJob {
  id: string;
  aspectRatio: AspectRatio;
  status: RenderJobStatus;
  scenePlan: ScenePlan;
  artifactId?: string;
  error?: string;
}

export interface Artifact {
  id: string;
  jobId: string;
  url: string;
  mimeType: "video/mp4";
  verifiedAt: string;
}

export interface AuditEvent {
  at: string;
  type: string;
  message: string;
}

export interface Campaign {
  id: string;
  input: CreateCampaignInput;
  status: CampaignStatus;
  eligibility: EligibilityResult;
  selectedPhotos?: SelectedPhotos;
  jobs: RenderJob[];
  artifacts: Artifact[];
  auditEvents: AuditEvent[];
  createdAt: string;
  updatedAt: string;
}
