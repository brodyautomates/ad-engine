import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { CampaignInput } from "@/lib/types";
import { scrapeBrand, BrandAssets } from "@/lib/scrape";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const input: CampaignInput = await req.json();

  // Scrape brand website if URL provided
  let brandContext = "";
  let brandAssets: BrandAssets | null = null;

  if (input.websiteUrl) {
    try {
      brandAssets = await scrapeBrand(input.websiteUrl);
      brandContext = `
BRAND WEBSITE DATA (scraped from ${input.websiteUrl}):
- Logo URL: ${brandAssets.logoUrl || "not found"}
- Favicon: ${brandAssets.faviconUrl || "not found"}
- OG Image: ${brandAssets.ogImage || "not found"}
- Brand Colors: ${brandAssets.colors.join(", ") || "not detected"}
- Brand Fonts: ${brandAssets.fonts.join(", ") || "not detected"}
- Site Title: ${brandAssets.title || "not found"}
- Site Description: ${brandAssets.description || "not found"}
- Key Headings: ${brandAssets.headingTexts.join(" | ") || "none found"}
`;
    } catch {
      // Scraping failed — continue without brand data
    }
  }

  const conceptsPrompt = `You are an expert ad creative director. Generate 4 video ad concepts for the following product. These concepts will be imported into Arcads.ai to create AI UGC-style video ads.

Product: ${input.productName}
Description: ${input.productDescription}
Target Audience: ${input.targetAudience}
Key Benefits: ${input.keyBenefits}
Tone: ${input.tone}
${brandContext}

For each concept, provide:
- name: A short creative name for the concept (2-4 words)
- hook: The opening line (first 3 seconds) — must stop the scroll
- script: The full spoken script for the AI avatar (30-60 seconds of speech, roughly 80-150 words). Write it exactly as it should be spoken — conversational, natural, no stage directions.
- toneDirection: How the avatar should deliver it (e.g., "excited and fast-paced", "calm authority", "relatable friend")
- targetEmotion: The primary emotion this ad triggers (e.g., "FOMO", "curiosity", "relief")
- visualNotes: Brief notes on what visuals/b-roll could overlay (for editing)
- cta: The specific call to action
- duration: Estimated video length (e.g., "30s", "45s", "60s")

Return ONLY valid JSON in this exact format, no markdown code fences:
{"concepts": [{"id": 1, "name": "", "hook": "", "script": "", "toneDirection": "", "targetEmotion": "", "visualNotes": "", "cta": "", "duration": ""}]}`;

  const landingPrompt = `You are an expert landing page designer and copywriter. Create a complete, self-contained HTML landing page for this product. The page should match the messaging of video ads targeting this audience.

Product: ${input.productName}
Description: ${input.productDescription}
Target Audience: ${input.targetAudience}
Key Benefits: ${input.keyBenefits}
Tone: ${input.tone}

${
  brandAssets
    ? `CRITICAL: This is an EXISTING BRAND. You MUST replicate their exact visual identity:
- Brand Colors: ${brandAssets.colors.join(", ")}
- Brand Fonts: ${brandAssets.fonts.join(", ")} — load these from Google Fonts if they're Google fonts, otherwise use similar system fonts
- Logo: ${brandAssets.logoUrl ? `Include their logo using this URL: ${brandAssets.logoUrl}` : "Use the brand name as text"}
- Favicon: ${brandAssets.faviconUrl || "none"}
- OG Image: ${brandAssets.ogImage ? `Use as hero background or header image: ${brandAssets.ogImage}` : "none"}
- Their headline style: ${brandAssets.headingTexts.join(" | ")}
- Match the overall look and feel of their website at ${input.websiteUrl}
- Use their PRIMARY brand color for CTA buttons and accents
- Use their SECONDARY colors for backgrounds and highlights
- The landing page should look like it was built BY this brand's design team

Key CSS patterns from their site:
${brandAssets.cssSnippet.slice(0, 1500)}`
    : `Requirements:
- Dark theme: background #0a0a0a, text #f0f0f0, accent #E86733
- CTA buttons should use the accent color with white text`
}

General requirements:
- Self-contained HTML with inline CSS (external Google Fonts links are OK)
- Sections: Hero with headline + subheadline + CTA button, Benefits (3-4 cards), Social proof placeholder, Final CTA
- Mobile responsive
- Clean, modern, premium feel
- The headline should match the ad hooks in energy and messaging

Return ONLY the complete HTML. No markdown fences, no explanation.`;

  const [conceptsRes, landingRes] = await Promise.all([
    client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: conceptsPrompt }],
    }),
    client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: landingPrompt }],
    }),
  ]);

  const conceptsText =
    conceptsRes.content[0].type === "text" ? conceptsRes.content[0].text : "";
  const landingText =
    landingRes.content[0].type === "text" ? landingRes.content[0].text : "";

  let concepts;
  try {
    const parsed = JSON.parse(conceptsText);
    concepts = parsed.concepts;
  } catch {
    const match = conceptsText.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      concepts = parsed.concepts;
    } else {
      return NextResponse.json(
        { error: "Failed to parse concepts" },
        { status: 500 }
      );
    }
  }

  let landingPageHtml = landingText;
  if (landingPageHtml.startsWith("```")) {
    landingPageHtml = landingPageHtml
      .replace(/^```html?\n?/, "")
      .replace(/\n?```$/, "");
  }

  return NextResponse.json({ concepts, landingPageHtml });
}
