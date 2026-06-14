import type { OpsCaseImpact } from "@/lib/ops/types";
import { IMPACT_RULE_ROWS, IMPACT_RULE_SUMMARY } from "@/lib/ops/impact";
import { OpsImpactBadge } from "./OpsImpactBadge";

function formatThb(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount);
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-ourox-obsidianLight px-3 py-2">
      <div className="text-xs text-ourox-ink/50">{label}</div>
      <div className="text-sm font-medium text-ourox-ink">{value}</div>
    </div>
  );
}

interface Props {
  impact: OpsCaseImpact;
}

export function OpsImpactBreakdown({ impact }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <MetaRow
          label="Financial exposure"
          value={`${formatThb(impact.financialExposureThb)} (${impact.financialExposureBand})`}
        />
        <MetaRow label="Social / reputational pressure" value={impact.socialPressure} />
        <MetaRow label="Incident severity" value={impact.incidentSeverity} />
        <div className="rounded bg-ourox-obsidianLight px-3 py-2">
          <div className="text-xs text-ourox-ink/50">Derived impact tier</div>
          <div className="mt-1">
            <OpsImpactBadge tier={impact.impactTier} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight p-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ourox-ink/50">
          Rationale
        </h4>
        <ul className="mt-2 space-y-1 text-sm leading-relaxed text-ourox-ink/80">
          {impact.impactRationale.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/40 p-3">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ourox-ink/50">
          Transparent rule
        </h4>
        <p className="mt-2 text-xs leading-relaxed text-ourox-ink/65">{IMPACT_RULE_SUMMARY}</p>
        <ul className="mt-2 space-y-0.5 text-[11px] leading-relaxed text-ourox-ink/55">
          {IMPACT_RULE_ROWS.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
