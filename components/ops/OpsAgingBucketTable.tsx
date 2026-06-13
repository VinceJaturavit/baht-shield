"use client";

import type { OpsAgingRow } from "@/lib/ops/aging";

interface Props {
  rows: OpsAgingRow[];
  groupLabel: string;
}

function CountCell({ count, emphasis }: { count: number; emphasis?: "at-risk" | "breached" }) {
  if (count === 0) {
    return <span className="text-ourox-ink/25">—</span>;
  }

  if (emphasis === "at-risk") {
    return (
      <span className="inline-flex items-center gap-1.5 tabular-nums font-semibold text-ourox-orange">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ourox-orange" aria-hidden="true" />
        {count}
      </span>
    );
  }

  if (emphasis === "breached") {
    return (
      <span className="inline-flex items-center gap-1.5 tabular-nums text-red-300/90">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/70" aria-hidden="true" />
        {count}
      </span>
    );
  }

  return <span className="tabular-nums text-ourox-ink/80">{count}</span>;
}

export function OpsAgingBucketTable({ rows, groupLabel }: Props) {
  if (rows.length === 0) {
    return (
      <p className="px-3 py-4 text-xs text-ourox-ink/45">No active cases to display.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30">
      <table className="w-full min-w-[880px] border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
            <th className="px-3 py-2 font-semibold">{groupLabel}</th>
            <th className="px-3 py-2 text-right font-semibold">Total</th>
            <th className="px-3 py-2 text-right font-semibold">Fresh 0–25%</th>
            <th className="px-3 py-2 text-right font-semibold">Mid 25–75%</th>
            <th
              className="border-l border-ourox-orange/20 bg-ourox-orange/[0.04] px-3 py-2 text-right font-semibold text-ourox-orange"
              scope="col"
            >
              <span className="inline-flex items-center justify-end gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ourox-orange" aria-hidden="true" />
                At-Risk 75–100%
              </span>
            </th>
            <th className="px-3 py-2 text-right font-semibold">
              <span className="inline-flex items-center justify-end gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500/70" aria-hidden="true" />
                Breached &gt;100%
              </span>
            </th>
            <th className="border-l border-ourox-obsidianMid px-3 py-2 text-right font-semibold">
              Waiting on us
            </th>
            <th className="px-3 py-2 text-right font-semibold">Waiting on external</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.groupKey}
              className="border-b border-ourox-obsidianMid/70 last:border-b-0"
            >
              <td className="px-3 py-2 font-medium text-ourox-ink">{row.groupLabel}</td>
              <td className="px-3 py-2 text-right tabular-nums text-ourox-ink/75">{row.total}</td>
              <td className="px-3 py-2 text-right">
                <CountCell count={row.fresh} />
              </td>
              <td className="px-3 py-2 text-right">
                <CountCell count={row.mid} />
              </td>
              <td className="border-l border-ourox-orange/15 bg-ourox-orange/[0.03] px-3 py-2 text-right">
                <CountCell count={row.atRisk} emphasis="at-risk" />
              </td>
              <td className="px-3 py-2 text-right">
                <CountCell count={row.breached} emphasis="breached" />
              </td>
              <td className="border-l border-ourox-obsidianMid px-3 py-2 text-right">
                <CountCell count={row.waitingOnUs} />
              </td>
              <td className="px-3 py-2 text-right">
                <CountCell count={row.waitingOnExternal} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
