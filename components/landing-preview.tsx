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
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 bg-surface-overlay rounded-lg p-1 border border-border">
          <button
            onClick={() => setView("preview")}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
              view === "preview"
                ? "bg-mint text-black font-medium"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setView("code")}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
              view === "code"
                ? "bg-mint text-black font-medium"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Code
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copyHtml}
            className="text-xs bg-surface-overlay border border-border text-text-secondary px-3 py-1.5 rounded-lg hover:text-text-primary transition-colors"
          >
            {copied ? "Copied!" : "Copy HTML"}
          </button>
          <button
            onClick={downloadHtml}
            className="text-xs bg-mint/10 text-mint px-3 py-1.5 rounded-lg hover:bg-mint/20 transition-colors"
          >
            Download
          </button>
        </div>
      </div>

      {view === "preview" ? (
        <div className="glass rounded-xl overflow-hidden glow">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-text-secondary font-mono">
              landing-page.html
            </span>
          </div>
          <iframe
            srcDoc={html}
            className="w-full h-[600px] bg-white"
            title="Landing Page Preview"
            sandbox="allow-scripts"
          />
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-text-secondary font-mono">
              HTML
            </span>
          </div>
          <pre className="p-4 text-sm text-text-secondary overflow-auto max-h-[600px] font-mono leading-relaxed">
            <code>{html}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
