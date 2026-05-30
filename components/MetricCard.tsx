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
  // system the metric figure uses indigo only for the primary/accented tiles.
  const valueClass =
    accent === "purple" || accent === "blue"
      ? "text-signal-accent"
      : "text-signal-heading";

  return (
    <div className="rounded-signal border border-signal-border bg-white p-6 shadow-signal">
      <p className="text-xs font-medium uppercase tracking-wide text-signal-secondary">
        {title}
      </p>
      <p className={`mt-3 text-3xl font-semibold tabular-nums ${valueClass}`}>
        {value}
      </p>
      {description && (
        <p className="mt-2 text-[13px] text-signal-secondary">{description}</p>
      )}
    </div>
  );
}
