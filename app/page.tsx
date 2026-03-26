"use client";

import { useState } from "react";
import CampaignForm from "@/components/campaign-form";
import ConceptCard from "@/components/concept-card";
import LandingPreview from "@/components/landing-preview";
import { CampaignInput, CampaignOutput } from "@/lib/types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<CampaignOutput | null>(null);
  const [activeTab, setActiveTab] = useState<"concepts" | "landing">(
    "concepts"
  );
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (input: CampaignInput) => {
    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        throw new Error("Generation failed");
      }

      const data: CampaignOutput = await res.json();
      setOutput(data);
      setActiveTab("concepts");
    } catch {
      setError("Something went wrong. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportAllScripts = () => {
    if (!output) return;
    const scripts = output.concepts
      .map(
        (c) =>
          `--- CONCEPT ${c.id}: ${c.name} ---\nHook: ${c.hook}\n\nScript:\n${c.script}\n\nTone: ${c.toneDirection}\nCTA: ${c.cta}\nDuration: ${c.duration}\n`
      )
      .join("\n\n");
    navigator.clipboard.writeText(scripts);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-mint flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Ad Engine
              </h1>
              <p className="text-xs text-text-secondary">
                Concept to campaign in seconds
              </p>
            </div>
          </div>
          {output && (
            <button
              onClick={() => {
                setOutput(null);
                setError(null);
              }}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              New Campaign
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {!output && !loading ? (
          /* INPUT STATE */
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Create Your Ad Campaign
              </h2>
              <p className="text-text-secondary">
                Enter your product details. We&apos;ll generate Arcads-ready
                video concepts and a matching landing page.
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <CampaignForm onSubmit={handleGenerate} loading={loading} />
            </div>
          </div>
        ) : loading ? (
          /* LOADING STATE */
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 rounded-xl bg-mint/10 flex items-center justify-center mb-4 animate-pulse-mint">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-mint"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-1">
              Generating your campaign...
            </h3>
            <p className="text-sm text-text-secondary">
              Building 4 ad concepts + a matching landing page
            </p>
          </div>
        ) : error ? (
          /* ERROR STATE */
          <div className="max-w-md mx-auto text-center py-32">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setOutput(null);
              }}
              className="text-sm text-mint hover:underline"
            >
              Try again
            </button>
          </div>
        ) : output ? (
          /* OUTPUT STATE */
          <div>
            {/* Tab Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1 bg-surface-overlay rounded-lg p-1 border border-border">
                <button
                  onClick={() => setActiveTab("concepts")}
                  className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "concepts"
                      ? "bg-mint text-black"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Ad Concepts ({output.concepts.length})
                </button>
                <button
                  onClick={() => setActiveTab("landing")}
                  className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "landing"
                      ? "bg-mint text-black"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Landing Page
                </button>
              </div>

              {activeTab === "concepts" && (
                <button
                  onClick={exportAllScripts}
                  className="text-sm bg-mint/10 text-mint px-4 py-2 rounded-lg hover:bg-mint/20 transition-colors"
                >
                  Export All Scripts
                </button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === "concepts" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {output.concepts.map((concept, i) => (
                  <ConceptCard key={concept.id} concept={concept} index={i} />
                ))}
              </div>
            ) : (
              <LandingPreview html={output.landingPageHtml} />
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}
