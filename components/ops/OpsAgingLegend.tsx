export function OpsAgingLegend() {
  return (
    <p className="text-[11px] leading-relaxed text-ourox-ink/55">
      <span className="inline-flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-ourox-orange"
          aria-hidden="true"
        />
        <span className="font-medium text-ourox-orange">At-Risk</span>
      </span>
      {" — still savable before SLA breach. "}
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/70" aria-hidden="true" />
        <span className="font-medium text-ourox-ink/70">Breached</span>
      </span>
      {" — deadline already missed."}
    </p>
  );
}
