"use client";

import { AdConcept } from "@/lib/types";
import { useState } from "react";

interface Props {
  concept: AdConcept;
  index: number;
}

export default function ConceptCard({ concept, index }: Props) {
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

        {/* Footer */}
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
      </div>
    </div>
  );
}
