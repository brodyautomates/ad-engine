export interface CampaignInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  keyBenefits: string;
  tone: string;
  websiteUrl?: string;
}

export interface AdConcept {
  id: number;
  name: string;
  hook: string;
  script: string;
  toneDirection: string;
  targetEmotion: string;
  visualNotes: string;
  cta: string;
  duration: string;
}

export interface CampaignOutput {
  concepts: AdConcept[];
  landingPageHtml: string;
}

// Arcads types for frontend
export interface Actor {
  id: string;
  name: string;
  gender: string;
  age: string;
  thumbnailUrl: string;
}

export interface Situation {
  id: string;
  name: string;
  thumbnailUrl: string;
  actorId: string;
  actorName: string;
}

export interface Voice {
  id: string;
  name: string;
  gender: string;
  age: string;
  accent: string;
  descriptive: string;
  audioUrl: string;
}

export interface VideoJob {
  conceptId: number;
  status: "idle" | "selecting" | "generating" | "complete" | "error";
  situationId?: string;
  voiceId?: string;
  scriptId?: string;
  videoId?: string;
  videoUrl?: string;
  error?: string;
}
