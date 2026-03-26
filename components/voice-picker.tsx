"use client";

import { useState, useEffect, useRef } from "react";
import { Voice } from "@/lib/types";

interface Props {
  onSelect: (voice: Voice) => void;
  onSkip: () => void;
  onClose: () => void;
}

export default function VoicePicker({ onSelect, onSkip, onClose }: Props) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchVoices();
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const fetchVoices = async () => {
    try {
      const res = await fetch("/api/arcads/voices");
      const data = await res.json();
      setVoices(Array.isArray(data) ? data : data.data || []);
    } catch {
      setVoices([]);
    }
    setLoading(false);
  };

  const playPreview = (voice: Voice) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (playingId === voice.id) {
      setPlayingId(null);
      return;
    }
    if (voice.audioUrl) {
      const audio = new Audio(voice.audioUrl);
      audio.onended = () => setPlayingId(null);
      audio.play();
      audioRef.current = audio;
      setPlayingId(voice.id);
    }
  };

  const filteredVoices =
    filter === "all"
      ? voices
      : voices.filter(
          (v) => v.gender?.toLowerCase() === filter.toLowerCase()
        );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-elevated border border-divider w-full max-w-xl max-h-[80vh] overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <div>
            <h3 className="text-[17px] font-semibold text-text-primary">
              Choose a Voice
            </h3>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              Optional — Arcads can auto-match a voice
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-divider transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-divider flex items-center justify-between">
          <div className="flex gap-2">
            {["all", "male", "female"].map((g) => (
              <button
                key={g}
                onClick={() => setFilter(g)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                  filter === g
                    ? "bg-text-primary text-white"
                    : "bg-surface text-text-secondary hover:bg-divider"
                }`}
              >
                {g === "all"
                  ? "All"
                  : g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={onSkip}
            className="text-[13px] font-medium text-accent hover:underline"
          >
            Skip — auto-match
          </button>
        </div>

        {/* Voice list */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-[14px] text-text-tertiary">
                Loading voices...
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredVoices.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-divider hover:border-accent/20 hover:bg-accent/3 transition-all group"
                >
                  {/* Play button */}
                  <button
                    onClick={() => playPreview(v)}
                    className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
                      playingId === v.id
                        ? "bg-accent text-white"
                        : "bg-surface text-text-secondary group-hover:bg-accent/10 group-hover:text-accent"
                    }`}
                  >
                    {playingId === v.id ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-text-primary">
                      {v.name}
                    </p>
                    <p className="text-[12px] text-text-tertiary truncate">
                      {[v.gender, v.age, v.accent, v.descriptive]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>

                  {/* Select */}
                  <button
                    onClick={() => onSelect(v)}
                    className="text-[13px] font-medium text-accent bg-accent/8 px-4 py-2 rounded-xl hover:bg-accent/12 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                  >
                    Select
                  </button>
                </div>
              ))}
              {filteredVoices.length === 0 && (
                <p className="text-center text-[14px] text-text-tertiary py-8">
                  No voices found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
