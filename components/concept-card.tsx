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
      className="glass rounded-xl p-5 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-mono text-mint">
            CONCEPT {concept.id}
          </span>
          <h3 className="text-lg font-semibold mt-0.5">{concept.name}</h3>
        </div>
        <span className="text-xs bg-surface-overlay border border-border rounded-full px-3 py-1 text-text-secondary">
          {concept.duration}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-sm text-text-secondary mb-1">Hook</p>
        <p className="text-mint font-medium">&ldquo;{concept.hook}&rdquo;</p>
      </div>

      <div className="mb-3">
        <p className="text-sm text-text-secondary mb-1">Script</p>
        <p
          className={`text-sm leading-relaxed ${expanded ? "" : "line-clamp-3"}`}
        >
          {concept.script}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-mint mt-1 hover:underline"
        >
          {expanded ? "Show less" : "Show full script"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <p className="text-text-secondary text-xs">Tone</p>
          <p>{concept.toneDirection}</p>
        </div>
        <div>
          <p className="text-text-secondary text-xs">Emotion</p>
          <p>{concept.targetEmotion}</p>
        </div>
        <div className="col-span-2">
          <p className="text-text-secondary text-xs">Visual Notes</p>
          <p>{concept.visualNotes}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <p className="text-sm">
          <span className="text-text-secondary">CTA:</span> {concept.cta}
        </p>
        <button
          onClick={copyScript}
          className="text-xs bg-mint/10 text-mint px-3 py-1.5 rounded-lg hover:bg-mint/20 transition-colors"
        >
          {copied ? "Copied!" : "Copy Script"}
        </button>
      </div>
    </div>
  );
}
