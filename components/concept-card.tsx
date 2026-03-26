"use client";

import { AdConcept, Situation, Voice, VideoJob } from "@/lib/types";
import { useState } from "react";

interface Props {
  concept: AdConcept;
  index: number;
  productName: string;
  productDescription: string;
  videoJob: VideoJob;
  onStartArcads: (conceptId: number) => void;
  onSituationSelected: (conceptId: number, situation: Situation) => void;
  onVoiceSelected: (conceptId: number, voice: Voice | null) => void;
}

export default function ConceptCard({
  concept,
  index,
  videoJob,
  onStartArcads,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copyScript = () => {
    navigator.clipboard.writeText(concept.script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="glass shadow-soft animate-fade-up hover:shadow-medium transition-shadow duration-300"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/8 flex items-center justify-center">
              <span className="text-[13px] font-semibold text-accent">
                {String(concept.id).padStart(2, "0")}
              </span>
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-text-primary leading-tight">
                {concept.name}
              </h3>
              <p className="text-[12px] text-text-tertiary mt-0.5">
                {concept.duration}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-text-tertiary bg-surface rounded-full px-2.5 py-1">
            {concept.targetEmotion}
          </span>
        </div>

        {/* Hook */}
        <div className="mb-4 bg-accent/5 rounded-xl px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-accent/60 mb-1">
            Hook
          </p>
          <p className="text-[14px] font-medium text-text-primary leading-snug">
            &ldquo;{concept.hook}&rdquo;
          </p>
        </div>

        {/* Script */}
        <div className="mb-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-text-tertiary mb-1.5">
            Script
          </p>
          <p
            className={`text-[14px] leading-relaxed text-text-secondary ${
              expanded ? "" : "line-clamp-3"
            }`}
          >
            {concept.script}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[13px] font-medium text-accent mt-1.5 hover:underline"
          >
            {expanded ? "Show less" : "Read full script"}
          </button>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-surface/80 rounded-xl px-3 py-2.5">
            <p className="text-[11px] text-text-tertiary mb-0.5">Tone</p>
            <p className="text-[13px] font-medium text-text-primary">
              {concept.toneDirection}
            </p>
          </div>
          <div className="bg-surface/80 rounded-xl px-3 py-2.5">
            <p className="text-[11px] text-text-tertiary mb-0.5">Visuals</p>
            <p className="text-[13px] font-medium text-text-primary line-clamp-2">
              {concept.visualNotes}
            </p>
          </div>
        </div>

        {/* CTA + Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-divider">
          <p className="text-[13px] text-text-secondary">
            <span className="text-text-tertiary">CTA: </span>
            {concept.cta}
          </p>
          <button
            onClick={copyScript}
            className={`text-[13px] font-medium px-4 py-2 rounded-xl transition-all active:scale-95 ${
              copied
                ? "bg-green-50 text-green-600"
                : "bg-accent/8 text-accent hover:bg-accent/12"
            }`}
          >
            {copied ? "Copied" : "Copy Script"}
          </button>
        </div>

        {/* Arcads Section */}
        <div className="mt-4 pt-4 border-t border-divider">
          {videoJob.status === "idle" && (
            <button
              onClick={() => onStartArcads(concept.id)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-[14px] py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Generate Video with Arcads
            </button>
          )}

          {videoJob.status === "selecting" && (
            <div className="flex items-center gap-2 text-[13px] text-text-secondary">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Selecting actor & voice...
            </div>
          )}

          {videoJob.status === "generating" && (
            <div className="bg-purple-50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2.5">
                <svg
                  className="animate-spin h-4 w-4 text-purple-500"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span className="text-[13px] font-medium text-purple-700">
                  Generating video...
                </span>
              </div>
              <p className="text-[12px] text-purple-500 mt-1 ml-[26px]">
                This usually takes 1-3 minutes
              </p>
            </div>
          )}

          {videoJob.status === "complete" && videoJob.videoUrl && (
            <div className="rounded-xl overflow-hidden border border-divider">
              <video
                src={videoJob.videoUrl}
                controls
                className="w-full rounded-xl"
                poster=""
              />
              <div className="p-3 flex items-center justify-between bg-surface/50">
                <span className="text-[12px] font-medium text-green-600 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Video ready
                </span>
                <a
                  href={videoJob.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-medium text-accent hover:underline"
                >
                  Download
                </a>
              </div>
            </div>
          )}

          {videoJob.status === "error" && (
            <div className="bg-red-50 rounded-xl px-4 py-3">
              <p className="text-[13px] text-red-600">
                {videoJob.error || "Generation failed"}
              </p>
              <button
                onClick={() => onStartArcads(concept.id)}
                className="text-[13px] font-medium text-red-500 mt-1 hover:underline"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
