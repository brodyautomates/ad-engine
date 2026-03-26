"use client";

import { useState, useEffect } from "react";
import { Situation } from "@/lib/types";

interface Props {
  onSelect: (situation: Situation) => void;
  onClose: () => void;
}

interface SituationData {
  id: string;
  tags: string[];
  imageUrl: string;
  previewUrl: string;
  defaultVoiceId: string;
}

interface ActorGroup {
  id: string;
  name: string;
  gender: string;
  age: string;
  imageUrl: string;
  situations: SituationData[];
}

export default function ActorPicker({ onSelect, onClose }: Props) {
  const [actors, setActors] = useState<ActorGroup[]>([]);
  const [selectedActor, setSelectedActor] = useState<ActorGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState<string>("all");

  useEffect(() => {
    fetchActors("all");
  }, []);

  const fetchActors = async (gender: string) => {
    setLoading(true);
    try {
      const param = gender !== "all" ? `?gender=${gender}` : "";
      const res = await fetch(`/api/arcads/actors${param}`);
      const data = await res.json();
      setActors(Array.isArray(data) ? data : []);
    } catch {
      setActors([]);
    }
    setLoading(false);
  };

  const handleGenderChange = (g: string) => {
    setGenderFilter(g);
    setSelectedActor(null);
    fetchActors(g);
  };

  const handleSelectSituation = (actor: ActorGroup, sit: SituationData) => {
    onSelect({
      id: sit.id,
      name: `${actor.name} — ${sit.tags.join(", ")}`,
      thumbnailUrl: sit.imageUrl,
      actorId: actor.id,
      actorName: actor.name,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-elevated border border-divider w-full max-w-3xl max-h-[85vh] overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <div>
            <h3 className="text-[17px] font-medium text-text-primary">
              {selectedActor
                ? `${selectedActor.name} — Choose a Setting`
                : "Choose an Actor"}
            </h3>
            <p className="text-[13px] text-text-tertiary mt-0.5">
              {selectedActor
                ? "Pick the scene for your video"
                : `${actors.length} actors available`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedActor && (
              <button
                onClick={() => setSelectedActor(null)}
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

        {/* Filters */}
        {!selectedActor && (
          <div className="px-6 py-3 border-b border-divider flex gap-2">
            {["all", "male", "female"].map((g) => (
              <button
                key={g}
                onClick={() => handleGenderChange(g)}
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
        <div className="p-5 overflow-y-auto max-h-[calc(85vh-130px)]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3 text-[14px] text-text-tertiary">
                <svg
                  className="animate-spin h-5 w-5 text-accent"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-20"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Loading actors...
              </div>
            </div>
          ) : selectedActor ? (
            /* Situations for selected actor */
            <div className="grid grid-cols-3 gap-3">
              {selectedActor.situations.map((sit) => (
                <button
                  key={sit.id}
                  onClick={() => handleSelectSituation(selectedActor, sit)}
                  className="group relative rounded-2xl overflow-hidden border border-divider hover:border-accent/30 hover:shadow-medium transition-all"
                >
                  {sit.imageUrl ? (
                    <img
                      src={sit.imageUrl}
                      alt={sit.tags.join(", ")}
                      className="w-full aspect-[3/4] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] bg-surface flex items-center justify-center">
                      <span className="text-[13px] text-text-tertiary">
                        {sit.tags.join(", ")}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-[12px] font-medium text-white">
                      {sit.tags.join(", ")}
                    </span>
                  </div>
                </button>
              ))}
              {selectedActor.situations.length === 0 && (
                <p className="col-span-3 text-center text-[14px] text-text-tertiary py-12">
                  No settings available for this actor
                </p>
              )}
            </div>
          ) : (
            /* Actor grid */
            <div className="grid grid-cols-4 gap-3">
              {actors.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedActor(a)}
                  className="group relative rounded-2xl overflow-hidden border border-divider hover:border-accent/30 hover:shadow-medium transition-all"
                >
                  {a.imageUrl ? (
                    <img
                      src={a.imageUrl}
                      alt={a.name}
                      className="w-full aspect-[3/4] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] bg-surface flex items-center justify-center">
                      <span className="text-[24px] text-text-tertiary">
                        {a.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                    <div>
                      <p className="text-[13px] font-medium text-white leading-tight">
                        {a.name}
                      </p>
                      <p className="text-[11px] text-white/70">
                        {a.age} · {a.situations.length} setting
                        {a.situations.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              {actors.length === 0 && (
                <p className="col-span-4 text-center text-[14px] text-text-tertiary py-12">
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
