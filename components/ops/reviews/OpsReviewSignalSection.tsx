import { OpsIndicatorLabel, type OpsIndicatorTone } from "../OpsIndicatorLabel";

interface MetricRow {
  label: string;
  value: string;
}

interface Props {
  title: string;
  caption: string;
  metrics: MetricRow[];
  readLabel?: string;
  readTone?: OpsIndicatorTone;
  caveat?: string;
  isLast?: boolean;
}

export function OpsReviewSignalSection({
  title,
  caption,
  metrics,
  readLabel,
  readTone,
  caveat,
  isLast = false,
}: Props) {
  return (
    <section
      className={`min-w-0 px-3 py-3 sm:px-4 ${isLast ? "" : "border-b border-ourox-obsidianMid/60"}`}
    >
      <h3 className="[font-family:var(--font-montserrat),system-ui,sans-serif] text-xs font-semibold text-ourox-ink">
        {title}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-ourox-ink/60">{caption}</p>
      <dl className="mt-2.5 space-y-2">
        {metrics.map(({ label, value }) => (
          <div
            key={label}
            className="grid min-w-0 grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline"
          >
            <dt className="text-xs text-ourox-ink/60">{label}</dt>
            <dd className="min-w-0 break-words text-xs font-medium tabular-nums text-ourox-ink/85 sm:text-right">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      {readLabel && readTone && (
        <div className="mt-2.5">
          <OpsIndicatorLabel label={readLabel} tone={readTone} />
        </div>
      )}
      {caveat && (
        <p className="mt-2 text-xs text-ourox-orange/90">{caveat}</p>
      )}
    </section>
  );
}

function fairnessTone(tag: string): OpsIndicatorTone {
  if (tag === "Over-loaded" || tag === "Under-loaded") return "watch";
  return "neutral";
}

function performanceTone(read: string): OpsIndicatorTone {
  if (read === "Needs review") return "risk";
  if (read === "Watch") return "watch";
  return "good";
}

function behaviourTone(read: string): OpsIndicatorTone {
  if (read === "Avoidance risk") return "risk";
  if (read === "Watch") return "watch";
  return "good";
}

export { fairnessTone, performanceTone, behaviourTone };
