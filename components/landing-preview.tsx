"use client";

import { useState } from "react";

interface Props {
  html: string;
}

export default function LandingPreview({ html }: Props) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "landing-page.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-up">
      {/* Controls */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex bg-white/60 rounded-xl p-1 border border-divider shadow-soft">
          <button
            onClick={() => setView("preview")}
            className={`px-5 py-2 rounded-[10px] text-[13px] font-medium transition-all ${
              view === "preview"
                ? "bg-white text-text-primary shadow-soft"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setView("code")}
            className={`px-5 py-2 rounded-[10px] text-[13px] font-medium transition-all ${
              view === "code"
                ? "bg-white text-text-primary shadow-soft"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Source
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copyHtml}
            className={`text-[13px] font-medium px-4 py-2 rounded-xl transition-all active:scale-95 ${
              copied
                ? "bg-green-50 text-green-600 border border-green-100"
                : "bg-white border border-divider text-text-secondary hover:text-text-primary shadow-soft"
            }`}
          >
            {copied ? "Copied" : "Copy HTML"}
          </button>
          <button
            onClick={downloadHtml}
            className="text-[13px] font-medium bg-accent text-white px-4 py-2 rounded-xl hover:bg-accent-hover active:scale-95 transition-all"
          >
            Download
          </button>
        </div>
      </div>

      {/* Content */}
      {view === "preview" ? (
        <div className="glass shadow-elevated overflow-hidden">
          {/* Browser Chrome */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-divider bg-white/40">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-surface/80 rounded-lg px-4 py-1.5 text-[12px] text-text-tertiary text-center font-mono">
                landing-page.html
              </div>
            </div>
          </div>
          <iframe
            srcDoc={html}
            className="w-full h-[620px]"
            title="Landing Page Preview"
            sandbox="allow-scripts"
          />
        </div>
      ) : (
        <div className="glass shadow-elevated overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-divider bg-white/40">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <span className="ml-4 text-[12px] text-text-tertiary font-mono">
              index.html
            </span>
          </div>
          <pre className="p-5 text-[13px] text-text-secondary overflow-auto max-h-[620px] font-mono leading-relaxed bg-white/30">
            <code>{html}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
