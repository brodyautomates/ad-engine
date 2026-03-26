"use client";

import { useState, useEffect } from "react";
import { Situation } from "@/lib/types";

interface Props {
  onSelect: (situation: Situation) => void;
  onClose: () => void;
}

interface ActorData {
  id: string;
  name: string;
  gender: string;
  age: string;
  thumbnailUrl: string;
}

export default function ActorPicker({ onSelect, onClose }: Props) {
  const [actors, setActors] = useState<ActorData[]>([]);
  const [situations, setSituations] = useState<Situation[]>([]);
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSituations, setLoadingSituations] = useState(false);
  const [genderFilter, setGenderFilter] = useState<string>("all");

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/arcads/actors");
      const data = await res.json();
      setActors(Array.isArray(data) ? data : data.data || []);
    } catch {
      setActors([]);
    }
    setLoading(false);
  };

  const selectActor = async (actorId: string) => {
    setSelectedActorId(actorId);
    setLoadingSituations(true);
    try {
      const res = await fetch(`/api/arcads/actors?actorId=${actorId}`);
      const data = await res.json();
      setSituations(Array.isArray(data) ? data : data.data || []);
    } catch {
      setSituations([]);
    }
    setLoadingSituations(false);
  };

  const filteredActors =
    genderFilter === "all"
      ? actors
      : actors.filter(
          (a) => a.gender?.toLowerCase() === genderFilter.toLowerCase()
        );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-elevated border border-divider w-full max-w-2xl max-h-[80vh] overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <div>
            <h3 className="text-[17px] font-semibold text-text-primary">
              {selectedActorId ? "Choose a Setting" : "Choose an Actor"}
            </h3>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              {selectedActorId
                ? "Select the scene for your video"
                : "Select an AI avatar for your ad"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedActorId && (
              <button
                onClick={() => {
                  setSelectedActorId(null);
                  setSituations([]);
                }}
                className="text-[13px] font-medium text-accent hover:underline"
              >
                Back
              </button>
            )}
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
        </div>

        {/* Filters (actors view) */}
        {!selectedActorId && (
          <div className="px-6 py-3 border-b border-divider flex gap-2">
            {["all", "male", "female"].map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                  genderFilter === g
                    ? "bg-text-primary text-white"
                    : "bg-surface text-text-secondary hover:bg-divider"
                }`}
              >
                {g === "all" ? "All" : g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-[14px] text-text-tertiary">
                Loading actors...
              </div>
            </div>
          ) : selectedActorId ? (
            /* Situations grid */
            loadingSituations ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-[14px] text-text-tertiary">
                  Loading settings...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {situations.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSelect(s)}
                    className="group relative rounded-2xl overflow-hidden border border-divider hover:border-accent/30 hover:shadow-medium transition-all"
                  >
                    {s.thumbnailUrl ? (
                      <img
                        src={s.thumbnailUrl}
                        alt={s.name}
                        className="w-full aspect-video object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-video bg-surface flex items-center justify-center">
                        <span className="text-[13px] text-text-tertiary">
                          {s.name}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-[12px] font-medium text-white">
                        {s.name}
                      </span>
                    </div>
                  </button>
                ))}
                {situations.length === 0 && (
                  <p className="col-span-3 text-center text-[14px] text-text-tertiary py-8">
                    No settings available for this actor
                  </p>
                )}
              </div>
            )
          ) : (
            /* Actors grid */
            <div className="grid grid-cols-4 gap-3">
              {filteredActors.map((a) => (
                <button
                  key={a.id}
                  onClick={() => selectActor(a.id)}
                  className="group relative rounded-2xl overflow-hidden border border-divider hover:border-accent/30 hover:shadow-medium transition-all"
                >
                  {a.thumbnailUrl ? (
                    <img
                      src={a.thumbnailUrl}
                      alt={a.name}
                      className="w-full aspect-[3/4] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] bg-surface flex items-center justify-center">
                      <span className="text-[20px]">👤</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <div>
                      <p className="text-[13px] font-medium text-white">
                        {a.name}
                      </p>
                      <p className="text-[11px] text-white/70">
                        {a.age} · {a.gender}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              {filteredActors.length === 0 && (
                <p className="col-span-4 text-center text-[14px] text-text-tertiary py-8">
                  No actors found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
