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
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30">
      <table className="w-full table-fixed border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-ourox-obsidianMid text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
            <th className="w-[18%] px-2.5 py-2 font-semibold">{groupLabel}</th>
            <th className="w-[8%] px-2.5 py-2 text-right font-semibold">Total</th>
            <th className="w-[10%] px-2.5 py-2 text-right font-semibold">Fresh</th>
            <th className="w-[10%] px-2.5 py-2 text-right font-semibold">Mid</th>
            <th
              className="w-[12%] border-l border-ourox-orange/20 bg-ourox-orange/[0.04] px-2.5 py-2 text-right font-semibold text-ourox-orange"
              scope="col"
            >
              <span className="inline-flex items-center justify-end gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-ourox-orange" aria-hidden="true" />
                At-Risk
              </span>
            </th>
            <th className="w-[12%] px-2.5 py-2 text-right font-semibold">
              <span className="inline-flex items-center justify-end gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500/70" aria-hidden="true" />
                Breached
              </span>
            </th>
            <th className="w-[15%] border-l border-ourox-obsidianMid px-2.5 py-2 text-right font-semibold">
              On us
            </th>
            <th className="w-[15%] px-2.5 py-2 text-right font-semibold">External</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.groupKey}
              className="border-b border-ourox-obsidianMid/70 last:border-b-0"
            >
              <td className="px-2.5 py-2 font-medium text-ourox-ink">{row.groupLabel}</td>
              <td className="px-2.5 py-2 text-right tabular-nums text-ourox-ink/75">{row.total}</td>
              <td className="px-2.5 py-2 text-right">
                <CountCell count={row.fresh} />
              </td>
              <td className="px-2.5 py-2 text-right">
                <CountCell count={row.mid} />
              </td>
              <td className="border-l border-ourox-orange/15 bg-ourox-orange/[0.03] px-2.5 py-2 text-right">
                <CountCell count={row.atRisk} emphasis="at-risk" />
              </td>
              <td className="px-2.5 py-2 text-right">
                <CountCell count={row.breached} emphasis="breached" />
              </td>
              <td className="border-l border-ourox-obsidianMid px-2.5 py-2 text-right">
                <CountCell count={row.waitingOnUs} />
              </td>
              <td className="px-2.5 py-2 text-right">
                <CountCell count={row.waitingOnExternal} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
