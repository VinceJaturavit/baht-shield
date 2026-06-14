import type { OpsReviewPack } from "@/lib/ops/reviews-types";

interface Props {
  pack: OpsReviewPack;
  onBack: () => void;
}

export function OpsReviewPackHeader({ pack, onBack }: Props) {
  return (
    <div className="min-w-0 space-y-2 border-b border-ourox-obsidianMid/60 pb-3">
      <button
        type="button"
        onClick={onBack}
        className="text-xs font-medium text-ourox-ink/55 hover:text-ourox-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
      >
        Back to Reviews
      </button>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h2 className="[font-family:var(--font-montserrat),system-ui,sans-serif] text-base font-semibold text-ourox-ink">{pack.name}</h2>
        <span className="text-xs text-ourox-ink/60">{pack.role}</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 [font-family:var(--font-space-mono),monospace] text-[11px] text-ourox-ink/55">
        <span>Streams: {pack.streamsCovered.join(", ")}</span>
        <span>{pack.shiftSummary}</span>
        <span>{pack.capacitySummary}</span>
      </div>
    </div>
  );
}
