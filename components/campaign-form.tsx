"use client";

import { CampaignInput } from "@/lib/types";

interface Props {
  onSubmit: (input: CampaignInput) => void;
  loading: boolean;
}

export default function CampaignForm({ onSubmit, loading }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSubmit({
      productName: form.get("productName") as string,
      productDescription: form.get("productDescription") as string,
      targetAudience: form.get("targetAudience") as string,
      keyBenefits: form.get("keyBenefits") as string,
      tone: form.get("tone") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          Product Name
        </label>
        <input
          name="productName"
          required
          placeholder="e.g., FitCoach Pro"
          className="w-full bg-surface-overlay border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          Product Description
        </label>
        <textarea
          name="productDescription"
          required
          rows={3}
          placeholder="What does it do? What problem does it solve?"
          className="w-full bg-surface-overlay border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary/50 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          Target Audience
        </label>
        <input
          name="targetAudience"
          required
          placeholder="e.g., Busy professionals aged 25-40 who want to get fit"
          className="w-full bg-surface-overlay border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary/50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          Key Benefits
        </label>
        <textarea
          name="keyBenefits"
          required
          rows={2}
          placeholder="List 3-4 key benefits, one per line"
          className="w-full bg-surface-overlay border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary/50 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          Tone
        </label>
        <select
          name="tone"
          className="w-full bg-surface-overlay border border-border rounded-lg px-4 py-3 text-text-primary appearance-none cursor-pointer"
        >
          <option value="excited and energetic">Excited & Energetic</option>
          <option value="calm and authoritative">Calm & Authoritative</option>
          <option value="friendly and relatable">Friendly & Relatable</option>
          <option value="urgent and persuasive">Urgent & Persuasive</option>
          <option value="professional and trustworthy">
            Professional & Trustworthy
          </option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-mint text-black font-semibold py-3.5 rounded-lg hover:bg-mint-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
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
            Generating Concepts...
          </span>
        ) : (
          "Generate Ad Concepts"
        )}
      </button>
    </form>
  );
}
