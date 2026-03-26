"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import CampaignForm from "@/components/campaign-form";
import ConceptCard from "@/components/concept-card";
import LandingPreview from "@/components/landing-preview";
import ActorPicker from "@/components/actor-picker";
import VoicePicker from "@/components/voice-picker";
import {
  CampaignInput,
  CampaignOutput,
  VideoJob,
  Situation,
  Voice,
} from "@/lib/types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<CampaignOutput | null>(null);
  const [campaignInput, setCampaignInput] = useState<CampaignInput | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"concepts" | "landing">(
    "concepts"
  );
  const [error, setError] = useState<string | null>(null);

  // Arcads state
  const [videoJobs, setVideoJobs] = useState<Record<number, VideoJob>>({});
  const [activeConceptId, setActiveConceptId] = useState<number | null>(null);
  const [showActorPicker, setShowActorPicker] = useState(false);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [pendingSituation, setPendingSituation] = useState<Situation | null>(
    null
  );
  const pollingRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      Object.values(pollingRef.current).forEach(clearInterval);
    };
  }, []);

  const handleGenerate = async (input: CampaignInput) => {
    setLoading(true);
    setError(null);
    setOutput(null);
    setCampaignInput(input);

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

      // Initialize video jobs
      const jobs: Record<number, VideoJob> = {};
      data.concepts.forEach((c) => {
        jobs[c.id] = { conceptId: c.id, status: "idle" };
      });
      setVideoJobs(jobs);
    } catch {
      setError("Something went wrong. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateJob = useCallback(
    (conceptId: number, update: Partial<VideoJob>) => {
      setVideoJobs((prev) => ({
        ...prev,
        [conceptId]: { ...prev[conceptId], ...update },
      }));
    },
    []
  );

  // Start Arcads flow: open actor picker
  const handleStartArcads = (conceptId: number) => {
    setActiveConceptId(conceptId);
    updateJob(conceptId, { status: "selecting" });
    setShowActorPicker(true);
  };

  // Actor/situation selected → show voice picker
  const handleSituationSelected = (_conceptId: number, situation: Situation) => {
    setPendingSituation(situation);
    setShowActorPicker(false);
    setShowVoicePicker(true);
  };

  // Voice selected (or skipped) → trigger generation
  const handleVoiceSelected = async (
    _conceptId: number,
    voice: Voice | null
  ) => {
    setShowVoicePicker(false);

    if (!activeConceptId || !pendingSituation || !output || !campaignInput)
      return;

    const concept = output.concepts.find((c) => c.id === activeConceptId);
    if (!concept) return;

    updateJob(activeConceptId, {
      status: "generating",
      situationId: pendingSituation.id,
      voiceId: voice?.id,
    });

    try {
      const res = await fetch("/api/arcads/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: campaignInput.productName,
          productDescription: campaignInput.productDescription,
          conceptName: concept.name,
          script: concept.script,
          situationId: pendingSituation.id,
          voiceId: voice?.id,
        }),
      });

      if (!res.ok) throw new Error("Arcads generation failed");

      const data = await res.json();
      updateJob(activeConceptId, { scriptId: data.scriptId });

      // Start polling for completion
      startPolling(activeConceptId, data.scriptId);
    } catch (e) {
      updateJob(activeConceptId, {
        status: "error",
        error: e instanceof Error ? e.message : "Generation failed",
      });
    }

    setPendingSituation(null);
    setActiveConceptId(null);
  };

  const startPolling = (conceptId: number, scriptId: string) => {
    const key = String(conceptId);

    // Clear any existing polling for this concept
    if (pollingRef.current[key]) {
      clearInterval(pollingRef.current[key]);
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/arcads/status?scriptId=${scriptId}`);
        const data = await res.json();

        if (data.status === "complete") {
          clearInterval(pollingRef.current[key]);
          delete pollingRef.current[key];
          updateJob(conceptId, {
            status: "complete",
            videoId: data.videoId,
            videoUrl: data.videoUrl,
          });
        } else if (data.status === "error") {
          clearInterval(pollingRef.current[key]);
          delete pollingRef.current[key];
          updateJob(conceptId, {
            status: "error",
            error: data.error,
          });
        }
      } catch {
        // Keep polling on network errors
      }
    }, 10000); // Poll every 10 seconds

    pollingRef.current[key] = interval;
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
      <header className="sticky top-0 z-40 border-b border-divider bg-white/70 backdrop-blur-xl">
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
                setCampaignInput(null);
                setVideoJobs({});
                Object.values(pollingRef.current).forEach(clearInterval);
                pollingRef.current = {};
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
                Generate Arcads-ready video concepts
                <br />
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
              >
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

            {activeTab === "concepts" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {output.concepts.map((concept, i) => (
                  <ConceptCard
                    key={concept.id}
                    concept={concept}
                    index={i}
                    productName={campaignInput?.productName || ""}
                    productDescription={
                      campaignInput?.productDescription || ""
                    }
                    videoJob={
                      videoJobs[concept.id] || {
                        conceptId: concept.id,
                        status: "idle",
                      }
                    }
                    onStartArcads={handleStartArcads}
                    onSituationSelected={handleSituationSelected}
                    onVoiceSelected={handleVoiceSelected}
                  />
                ))}
              </div>
            ) : (
              <LandingPreview html={output.landingPageHtml} />
            )}
          </div>
        ) : null}
      </main>

      {/* Arcads Modals */}
      {showActorPicker && activeConceptId !== null && (
        <ActorPicker
          onSelect={(situation) =>
            handleSituationSelected(activeConceptId, situation)
          }
          onClose={() => {
            setShowActorPicker(false);
            if (activeConceptId !== null) {
              updateJob(activeConceptId, { status: "idle" });
            }
            setActiveConceptId(null);
          }}
        />
      )}

      {showVoicePicker && activeConceptId !== null && (
        <VoicePicker
          onSelect={(voice) => handleVoiceSelected(activeConceptId, voice)}
          onSkip={() => handleVoiceSelected(activeConceptId, null)}
          onClose={() => {
            setShowVoicePicker(false);
            if (activeConceptId !== null) {
              updateJob(activeConceptId, { status: "idle" });
            }
            setActiveConceptId(null);
            setPendingSituation(null);
          }}
        />
      )}
    </div>
  );
}
