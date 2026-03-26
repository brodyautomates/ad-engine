import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { CampaignInput } from "@/lib/types";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const input: CampaignInput = await req.json();

  const conceptsPrompt = `You are an expert ad creative director. Generate 4 video ad concepts for the following product. These concepts will be imported into Arcads.ai to create AI UGC-style video ads.

Product: ${input.productName}
Description: ${input.productDescription}
Target Audience: ${input.targetAudience}
Key Benefits: ${input.keyBenefits}
Tone: ${input.tone}

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

Requirements:
- Self-contained HTML with inline CSS (no external dependencies except Google Fonts Inter)
- Dark theme: background #0a0a0a, text #f0f0f0, accent #00FFAB
- Sections: Hero with headline + subheadline + CTA button, Benefits (3-4 cards), Social proof placeholder, Final CTA
- Mobile responsive
- Clean, modern, premium feel
- The headline should match the ad hooks in energy and messaging
- CTA buttons should use the accent color (#00FFAB) with dark text

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
    // Try to extract JSON from the response
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
  // Strip markdown fences if present
  if (landingPageHtml.startsWith("```")) {
    landingPageHtml = landingPageHtml
      .replace(/^```html?\n?/, "")
      .replace(/\n?```$/, "");
  }

  return NextResponse.json({ concepts, landingPageHtml });
}
