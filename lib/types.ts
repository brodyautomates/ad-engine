export interface CampaignInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  keyBenefits: string;
  tone: string;
  landingPageUrl?: string;
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
