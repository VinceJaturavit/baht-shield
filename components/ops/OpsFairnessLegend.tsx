export function OpsFairnessLegend() {
  return (
    <div className="space-y-1.5 border-t border-ourox-obsidianMid/60 pt-3">
      <p className="text-[10px] leading-relaxed text-ourox-ink/50">
        Weights: RFR ×2.5 · LAR ×2.25 · PRO ×1.75 · DSP ×1.0 · PRF ×0.8. Urgent and QA are
        treated as high-difficulty planned work.
      </p>
      <p className="text-[10px] leading-relaxed text-ourox-ink/40">
        This view does not measure how much work someone completed or whether they picked up
        urgent cases quickly. Those are separate QA/performance signals for a later loop.
      </p>
    </div>
  );
}
