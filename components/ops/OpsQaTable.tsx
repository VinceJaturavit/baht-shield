import type { OpsQaRow } from "@/lib/ops/qa-types";
import { OpsIndicatorLabel, type OpsIndicatorTone } from "./OpsIndicatorLabel";

interface Props {
  groupLabel: string;
  rows: OpsQaRow[];
}

function qaReadTone(status: OpsQaRow["qaReadStatus"]): OpsIndicatorTone {
  switch (status) {
    case "Needs review":
      return "risk";
    case "Watch":
      return "watch";
    default:
      return "good";
  }
}

function QaGroupTable({ groupLabel, rows }: Props) {
  if (rows.length === 0) return null;

  return (
    <div className="min-w-0 space-y-2">
      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
        {groupLabel}
      </h4>
      <div className="min-w-0 border border-ourox-obsidianMid/70 bg-ourox-obsidian/20">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/40">
              <th className="w-[16%] px-2 py-1.5 font-semibold">Analyst</th>
              <th className="w-[14%] px-2 py-1.5 font-semibold">Role</th>
              <th className="w-[10%] px-2 py-1.5 font-semibold">Samples</th>
              <th className="w-[9%] px-2 py-1.5 font-semibold">Passed</th>
              <th className="w-[9%] px-2 py-1.5 font-semibold">Failed</th>
              <th className="w-[10%] px-2 py-1.5 font-semibold">QA score</th>
              <th className="w-[18%] px-2 py-1.5 font-semibold">Top defect</th>
              <th className="w-[14%] px-2 py-1.5 font-semibold">Read</th>
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
                  {row.qaSampleCount}
                </td>
                <td className="px-2 py-1.5 tabular-nums text-[11px] text-ourox-ink/70">
                  {row.qaPassCount}
                </td>
                <td className="px-2 py-1.5 tabular-nums text-[11px] text-ourox-ink/70">
                  {row.qaFailCount}
                </td>
                <td className="px-2 py-1.5 tabular-nums text-[11px] text-ourox-ink/70">
                  {row.qaScore.toFixed(1)}%
                </td>
                <td className="px-2 py-1.5 text-[10px] text-ourox-ink/55">
                  {row.topDefectCategory ?? "—"}
                </td>
                <td className="px-2 py-1.5">
                  <OpsIndicatorLabel
                    label={row.qaReadStatus}
                    tone={qaReadTone(row.qaReadStatus)}
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

interface TableProps {
  fraudAnalysts: OpsQaRow[];
  juniorAnalysts: OpsQaRow[];
}

export function OpsQaTable({ fraudAnalysts, juniorAnalysts }: TableProps) {
  return (
    <div className="space-y-4">
      <QaGroupTable groupLabel="Fraud Analysts" rows={fraudAnalysts} />
      <QaGroupTable groupLabel="Junior Analysts" rows={juniorAnalysts} />
    </div>
  );
}
