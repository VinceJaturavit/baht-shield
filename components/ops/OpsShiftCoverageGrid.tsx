import type { OpsShiftCoverage } from "@/lib/ops/shift-coverage";
import { OpsIndicatorLabel } from "./OpsIndicatorLabel";

interface Props {
  rows: OpsShiftCoverage[];
}

function presentNames(names: string[]): string {
  if (names.length === 0) return "None";
  return names.join(", ");
}

export function OpsShiftCoverageGrid({ rows }: Props) {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-xs font-semibold text-ourox-ink">Shift coverage</h3>
        <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-ourox-ink/55">
          Decision authority must be present on every shift where a tight-SLA stream is live.
          RFR, LAR, and PRO cannot wait for the next day if a statutory deadline, authority
          response, or funds-in-flight decision is active.
        </p>
        <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-ourox-ink/45">
          Cases crossing a shift boundary require explicit handoff so urgency reason, SLA clock,
          and next action are not lost.
        </p>
      </div>

      <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
              <th className="w-[14%] px-2.5 py-2 font-semibold">Shift</th>
              <th className="w-[14%] px-2.5 py-2 font-semibold">Coverage</th>
              <th className="w-[22%] px-2.5 py-2 font-semibold">Fraud Analysts</th>
              <th className="w-[22%] px-2.5 py-2 font-semibold">Junior Analysts</th>
              <th className="w-[14%] px-2.5 py-2 font-semibold">Authority</th>
              <th className="w-[14%] px-2.5 py-2 font-semibold">Handoff</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const presentFraudAnalysts = row.fraudAnalysts
                .filter((m) => m.attendance === "Present")
                .map((m) => m.name);
              const presentJuniorAnalysts = row.juniorAnalysts
                .filter((m) => m.attendance === "Present")
                .map((m) => m.name);

              return (
                <tr
                  key={row.shift}
                  className="border-b border-ourox-obsidianMid/70 last:border-b-0"
                >
                  <td className="px-2.5 py-2 font-medium text-ourox-ink">{row.shift}</td>
                  <td className="px-2.5 py-2">
                    <OpsIndicatorLabel
                      label={row.status}
                      tone={row.status === "Covered" ? "good" : "risk"}
                      detail={row.gapReason}
                    />
                  </td>
                  <td className="px-2.5 py-2 text-[11px] text-ourox-ink/70">
                    {presentNames(presentFraudAnalysts)}
                  </td>
                  <td className="px-2.5 py-2 text-[11px] text-ourox-ink/70">
                    {presentNames(presentJuniorAnalysts)}
                  </td>
                  <td className="px-2.5 py-2">
                    <OpsIndicatorLabel
                      label={row.hasDecisionAuthority ? "Present" : "Missing"}
                      tone={row.hasDecisionAuthority ? "good" : "risk"}
                    />
                    <span className="mt-0.5 block text-[10px] text-ourox-ink/45">
                      Intake: {row.intakeCount} staffed
                    </span>
                  </td>
                  <td className="px-2.5 py-2 text-[11px] text-ourox-ink/65">
                    {row.handoffCount > 0
                      ? `${row.handoffCount} case${row.handoffCount === 1 ? "" : "s"} handed off to next shift`
                      : "No pending handoffs"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
