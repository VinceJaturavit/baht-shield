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
      </div>

      <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
              <th className="w-[18%] px-2.5 py-2 font-semibold">Queue</th>
              <th className="w-[22%] px-2.5 py-2 font-semibold">Rule</th>
              <th className="w-[16%] px-2.5 py-2 font-semibold">Owner</th>
              <th className="w-[14%] px-2.5 py-2 font-semibold">Backup</th>
              <th className="w-[14%] px-2.5 py-2 font-semibold">Next</th>
              <th className="w-[16%] px-2.5 py-2 font-semibold">Rotation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.queueCode}
                className="border-b border-ourox-obsidianMid/70 last:border-b-0"
              >
                <td className="px-2.5 py-2">
                  <span className="block font-medium text-ourox-ink">{row.queueLabel}</span>
                  <span className="text-[10px] text-ourox-ink/40">{row.queueCode}</span>
                </td>
                <td className="px-2.5 py-2 text-[11px] leading-snug text-ourox-ink/60">
                  {row.ownershipRule}
                </td>
                <td className="px-2.5 py-2 font-medium text-ourox-ink">{row.ownerOfDay}</td>
                <td className="px-2.5 py-2 text-ourox-ink/75">{row.backup}</td>
                <td className="px-2.5 py-2 text-ourox-ink/75">{row.nextOwner}</td>
                <td className="px-2.5 py-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-ourox-ink/65">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-ourox-orange/70"
                      aria-hidden="true"
                    />
                    <span className="line-clamp-2">{row.rotationNote}</span>
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
