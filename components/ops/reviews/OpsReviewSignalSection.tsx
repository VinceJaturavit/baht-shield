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
}

export function OpsReviewSignalSection({
  title,
  caption,
  metrics,
  readLabel,
  readTone,
  caveat,
}: Props) {
  return (
    <section className="min-w-0 border border-ourox-obsidianMid/60 bg-ourox-obsidian/15 px-3 py-3">
      <h3 className="[font-family:var(--font-montserrat),system-ui,sans-serif] text-xs font-semibold text-ourox-ink">{title}</h3>
      <p className="mt-1 text-[11px] leading-relaxed text-ourox-ink/55">{caption}</p>
      <dl className="mt-2.5 space-y-1.5">
        {metrics.map(({ label, value }) => (
          <div key={label} className="flex min-w-0 flex-wrap gap-x-2 text-xs">
            <dt className="shrink-0 text-ourox-ink/50">{label}</dt>
            <dd className="min-w-0 break-words text-ourox-ink/85">{value}</dd>
          </div>
        ))}
      </dl>
      {readLabel && readTone && (
        <div className="mt-2.5">
          <OpsIndicatorLabel label={readLabel} tone={readTone} />
        </div>
      )}
      {caveat && (
        <p className="mt-2 text-[11px] text-ourox-orange/90">{caveat}</p>
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
