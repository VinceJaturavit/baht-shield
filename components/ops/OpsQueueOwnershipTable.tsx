import type { OpsQueueOwnership } from "@/lib/ops/roster-types";

interface Props {
  rows: OpsQueueOwnership[];
}

export function OpsQueueOwnershipTable({ rows }: Props) {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-xs font-semibold text-ourox-ink">Daily queue ownership</h3>
        <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-ourox-ink/55">
          Decision-bearing queues have officer ownership. Structured intake queues can be
          contractor-owned under SOP, with officer escalation available.
        </p>
        <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-ourox-ink/45">
          Officers own RFR, LAR, Urgent, and escalation-heavy work. Contractors support DSP and PRF
          intake under SOP. This keeps decision-bearing queues covered while protecting officer
          capacity for complex cases.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30">
        <table className="w-full min-w-[800px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
              <th className="px-3 py-2 font-semibold">Queue</th>
              <th className="px-3 py-2 font-semibold">Ownership rule</th>
              <th className="px-3 py-2 font-semibold">Owner today</th>
              <th className="px-3 py-2 font-semibold">Backup</th>
              <th className="px-3 py-2 font-semibold">Next rotation</th>
              <th className="px-3 py-2 font-semibold">Rotation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.queueCode}
                className="border-b border-ourox-obsidianMid/70 last:border-b-0"
              >
                <td className="px-3 py-2.5">
                  <span className="font-medium text-ourox-ink">{row.queueLabel}</span>
                  <span className="ml-1.5 text-[10px] text-ourox-ink/40">{row.queueCode}</span>
                </td>
                <td className="max-w-[12rem] px-3 py-2.5 text-[11px] leading-snug text-ourox-ink/60">
                  {row.ownershipRule}
                </td>
                <td className="px-3 py-2.5 font-medium text-ourox-ink">{row.ownerOfDay}</td>
                <td className="px-3 py-2.5 text-ourox-ink/75">{row.backup}</td>
                <td className="px-3 py-2.5 text-ourox-ink/75">{row.nextOwner}</td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-ourox-ink/65">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-ourox-orange/70"
                      aria-hidden="true"
                    />
                    {row.rotationNote}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
