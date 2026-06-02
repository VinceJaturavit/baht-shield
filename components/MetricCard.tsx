interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  accent?: "default" | "red" | "amber" | "blue" | "green" | "purple";
}

export function MetricCard({
  title,
  value,
  description,
  accent = "default",
}: MetricCardProps) {
  // Accent is retained as a prop for API compatibility. In the SignalOS design
  // system indigo is reserved for one or two key figures; everything else uses
  // ink so the dashboard does not become equal-weight card soup.
  const valueClass =
    accent === "purple" || accent === "blue"
      ? "text-signal-indigo"
      : "text-signal-ink";

  return (
    <div className="rounded-signal border border-signal-border bg-signal-surface p-5 shadow-signalSubtle">
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-signal-meta">
        {title}
      </p>
      <p className={`mt-3 text-[30px] leading-9 font-semibold tabular-nums ${valueClass}`}>
        {value}
      </p>
      {description && (
        <p className="mt-1.5 text-[13px] leading-5 text-signal-slate">{description}</p>
      )}
    </div>
  );
}
