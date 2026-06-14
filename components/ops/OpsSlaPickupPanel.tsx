import { OPS_HANDLED_CASES } from "@/data/ops/ops-handled-cases";
import type { OpsQaRow } from "@/lib/ops/qa-types";
import { OpsIndicatorLabel, type OpsIndicatorTone } from "./OpsIndicatorLabel";

interface Props {
  rows: OpsQaRow[];
}

function slaPickupTone(status: OpsQaRow["slaPickupStatus"]): OpsIndicatorTone {
  switch (status) {
    case "Avoidance risk":
      return "risk";
    case "Watch":
      return "watch";
    default:
      return "good";
  }
}

function urgentHandledCount(analystId: string): number {
  return OPS_HANDLED_CASES.filter(
    (c) => c.analystId === analystId && c.wasUrgentOrNearBreach,
  ).length;
}

function SlaPickupGroupTable({ groupLabel, rows }: { groupLabel: string; rows: OpsQaRow[] }) {
  if (rows.length === 0) return null;

  return (
    <div className="min-w-0 space-y-2">
      <h5 className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/40">
        {groupLabel}
      </h5>
      <div className="min-w-0 border border-ourox-obsidianMid/70 bg-ourox-obsidian/20">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/40">
              <th className="w-[18%] px-2 py-1.5 font-semibold">Analyst</th>
              <th className="w-[14%] px-2 py-1.5 font-semibold">Role</th>
              <th className="w-[14%] px-2 py-1.5 font-semibold">Urgent handled</th>
              <th className="w-[16%] px-2 py-1.5 font-semibold">Pickup share</th>
              <th className="w-[16%] px-2 py-1.5 font-semibold">Role expected</th>
              <th className="w-[22%] px-2 py-1.5 font-semibold">Behaviour read</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.analystId}
                className="border-b border-ourox-obsidianMid/60 last:border-b-0"
              >
                <td className="px-2 py-1.5">
                  <span className="block truncate text-[11px] font-medium text-ourox-ink">
                    {row.analystName}
                  </span>
                </td>
                <td className="px-2 py-1.5 text-[10px] text-ourox-ink/55">{row.role}</td>
                <td className="px-2 py-1.5 tabular-nums text-[11px] text-ourox-ink/70">
                  {urgentHandledCount(row.analystId)}
                </td>
                <td className="px-2 py-1.5 tabular-nums text-[11px] text-ourox-ink/70">
                  {row.urgentPickupShare.toFixed(1)}%
                </td>
                <td className="px-2 py-1.5 tabular-nums text-[11px] text-ourox-ink/70">
                  {row.roleExpectedUrgentPickupShare.toFixed(1)}%
                </td>
                <td className="px-2 py-1.5">
                  <OpsIndicatorLabel
                    label={row.slaPickupStatus}
                    tone={slaPickupTone(row.slaPickupStatus)}
                    detail={row.slaPickupDetail}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function OpsSlaPickupPanel({ rows }: Props) {
  const fraudAnalysts = rows.filter((r) => r.role === "Fraud Analyst");
  const juniorAnalysts = rows.filter((r) => r.role === "Junior Analyst");

  return (
    <div className="min-w-0 space-y-3">
      <div>
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
          SLA-pickup behaviour
        </h4>
        <p className="mt-1 max-w-3xl text-[10px] leading-relaxed text-ourox-ink/50">
          SLA-pickup behaviour shows whether analysts take their share of urgent or near-breach
          work. It is behavioural visibility, not a productivity penalty.
        </p>
      </div>
      <div className="space-y-4">
        <SlaPickupGroupTable groupLabel="Fraud Analysts" rows={fraudAnalysts} />
        <SlaPickupGroupTable groupLabel="Junior Analysts" rows={juniorAnalysts} />
      </div>
    </div>
  );
}
