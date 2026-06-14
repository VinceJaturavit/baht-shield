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
    <section className="min-w-0 border border-ourox-obsidianMid/60 bg-ourox-obsidian/15 px-3 py-2.5">
      <h3 className="text-[11px] font-semibold text-ourox-ink">{title}</h3>
      <p className="mt-1 text-[10px] leading-relaxed text-ourox-ink/50">{caption}</p>
      <dl className="mt-2 space-y-1">
        {metrics.map(({ label, value }) => (
          <div key={label} className="flex flex-wrap gap-x-2 text-[10px]">
            <dt className="shrink-0 text-ourox-ink/45">{label}</dt>
            <dd className="text-ourox-ink/75">{value}</dd>
          </div>
        ))}
      </dl>
      {readLabel && readTone && (
        <div className="mt-2">
          <OpsIndicatorLabel label={readLabel} tone={readTone} />
        </div>
      )}
      {caveat && (
        <p className="mt-1.5 text-[10px] text-ourox-orange/90">{caveat}</p>
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
