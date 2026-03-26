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
        <label className="block text-[13px] font-medium text-text-secondary mb-1.5 tracking-tight">
          Product Name
        </label>
        <input
          name="productName"
          required
          placeholder="e.g., FitCoach Pro"
          className="w-full bg-white/60 border border-divider rounded-xl px-4 py-3 text-[15px] text-text-primary placeholder:text-text-tertiary"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-text-secondary mb-1.5 tracking-tight">
          Product Description
        </label>
        <textarea
          name="productDescription"
          required
          rows={3}
          placeholder="What does it do? What problem does it solve?"
          className="w-full bg-white/60 border border-divider rounded-xl px-4 py-3 text-[15px] text-text-primary placeholder:text-text-tertiary resize-none"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-text-secondary mb-1.5 tracking-tight">
          Target Audience
        </label>
        <input
          name="targetAudience"
          required
          placeholder="e.g., Busy professionals aged 25-40"
          className="w-full bg-white/60 border border-divider rounded-xl px-4 py-3 text-[15px] text-text-primary placeholder:text-text-tertiary"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-text-secondary mb-1.5 tracking-tight">
          Key Benefits
        </label>
        <textarea
          name="keyBenefits"
          required
          rows={2}
          placeholder="List 3-4 key benefits, one per line"
          className="w-full bg-white/60 border border-divider rounded-xl px-4 py-3 text-[15px] text-text-primary placeholder:text-text-tertiary resize-none"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-text-secondary mb-1.5 tracking-tight">
          Tone
        </label>
        <select
          name="tone"
          className="w-full bg-white/60 border border-divider rounded-xl px-4 py-3 text-[15px] text-text-primary appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%236e6e73' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 16px center",
          }}
        >
          <option value="excited and energetic">Excited & Energetic</option>
          <option value="calm and authoritative">Calm & Authoritative</option>
          <option value="friendly and relatable">Friendly & Relatable</option>
          <option value="urgent and persuasive">Urgent & Persuasive</option>
          <option value="professional and trustworthy">Professional & Trustworthy</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-white font-semibold text-[15px] py-3.5 rounded-xl hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2.5">
            <svg className="animate-spin-slow h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating...
          </span>
        ) : (
          "Generate Ad Concepts"
        )}
      </button>
    </form>
  );
}
