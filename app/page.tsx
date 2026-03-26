"use client";

import { useState } from "react";
import CampaignForm from "@/components/campaign-form";
import ConceptCard from "@/components/concept-card";
import LandingPreview from "@/components/landing-preview";
import { CampaignInput, CampaignOutput } from "@/lib/types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<CampaignOutput | null>(null);
  const [activeTab, setActiveTab] = useState<"concepts" | "landing">("concepts");
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

      if (!res.ok) throw new Error("Generation failed");

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
      <header className="sticky top-0 z-50 border-b border-divider bg-white/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-accent to-blue-400 flex items-center justify-center shadow-soft">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-text-primary">
              Ad Engine
            </span>
          </div>

          {output && (
            <button
              onClick={() => {
                setOutput(null);
                setError(null);
              }}
              className="text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              New Campaign
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {!output && !loading ? (
          /* ---- INPUT STATE ---- */
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-[32px] font-bold tracking-tight text-text-primary leading-tight">
                Create your campaign.
              </h2>
              <p className="text-[17px] text-text-secondary mt-2 leading-relaxed">
                Generate Arcads-ready video concepts<br />
                and a matching landing page.
              </p>
            </div>

            <div className="glass shadow-medium p-7">
              <CampaignForm onSubmit={handleGenerate} loading={loading} />
            </div>
          </div>
        ) : loading ? (
          /* ---- LOADING STATE ---- */
          <div className="flex flex-col items-center justify-center py-36">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/8 flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-accent"
                >
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-2xl border-2 border-accent/20 animate-ping" />
            </div>
            <h3 className="text-[17px] font-semibold text-text-primary mb-1">
              Generating your campaign
            </h3>
            <p className="text-[14px] text-text-tertiary">
              4 ad concepts + landing page
            </p>

            {/* Progress pills */}
            <div className="flex items-center gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1.5 w-8 rounded-full bg-accent/15 overflow-hidden"
                >
                  <div
                    className="h-full bg-accent rounded-full animate-shimmer"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          /* ---- ERROR STATE ---- */
          <div className="max-w-md mx-auto text-center py-36">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <p className="text-[15px] text-red-500 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setOutput(null);
              }}
              className="text-[13px] font-medium text-accent hover:underline"
            >
              Try again
            </button>
          </div>
        ) : output ? (
          /* ---- OUTPUT STATE ---- */
          <div>
            {/* Tab Bar */}
            <div className="flex items-center justify-between mb-7">
              <div className="flex bg-white/60 rounded-xl p-1 border border-divider shadow-soft">
                <button
                  onClick={() => setActiveTab("concepts")}
                  className={`px-5 py-2 rounded-[10px] text-[13px] font-medium transition-all ${
                    activeTab === "concepts"
                      ? "bg-white text-text-primary shadow-soft"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Ad Concepts
                  <span className="ml-1.5 text-text-tertiary">
                    {output.concepts.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("landing")}
                  className={`px-5 py-2 rounded-[10px] text-[13px] font-medium transition-all ${
                    activeTab === "landing"
                      ? "bg-white text-text-primary shadow-soft"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Landing Page
                </button>
              </div>

              {activeTab === "concepts" && (
                <button
                  onClick={exportAllScripts}
                  className="text-[13px] font-medium bg-white border border-divider text-text-secondary px-4 py-2 rounded-xl hover:text-text-primary shadow-soft active:scale-95 transition-all"
                >
                  Export All
                </button>
              )}
            </div>

            {/* Content */}
            {activeTab === "concepts" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
