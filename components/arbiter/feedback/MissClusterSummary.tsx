"use client";

import type { TypologyMissSummary } from "@/lib/arbiter/feedback-analysis";

interface Props {
  totalMisses: number;
  typologyRows: TypologyMissSummary[];
}

function pct(v: number) {
  return `${(v * 100).toFixed(0)}%`;
}

export function MissClusterSummary({ totalMisses, typologyRows }: Props) {
  const top = typologyRows[0];

  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 p-5">
      <h3 className="mb-1 text-sm font-semibold tracking-wide text-ourox-ink">
        ML-high / rule-low misses
      </h3>
      <p className="mb-4 text-xs text-ourox-ink/40">
        Model probability high while rule decision is APPROVE or STEP_UP — synthetic
        evaluation disagreements only.
      </p>

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Total misses" value={String(totalMisses)} />
        <Stat label="Top typology" value={top?.displayName ?? "—"} />
        <Stat label="Top share" value={top ? pct(top.share) : "—"} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-ourox-obsidianMid text-ourox-ink/40">
              <th className="pb-2 pr-4 font-medium">Typology</th>
              <th className="pb-2 pr-4 font-medium">Miss count</th>
              <th className="pb-2 pr-4 font-medium">Share</th>
              <th className="pb-2 font-medium">Common signal pattern</th>
            </tr>
          </thead>
          <tbody>
            {typologyRows.map((row) => (
              <tr
                key={row.typology}
                className="border-b border-ourox-obsidianMid/50 text-ourox-ink/70"
              >
                <td className="py-2.5 pr-4 font-medium text-ourox-ink">{row.displayName}</td>
                <td className="py-2.5 pr-4 font-mono">{row.count}</td>
                <td className="py-2.5 pr-4 font-mono">{pct(row.share)}</td>
                <td className="py-2.5 text-ourox-ink/50">{row.commonSignalPattern}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ourox-obsidianMid bg-ourox-obsidian/50 px-3 py-2.5">
      <div className="text-xs text-ourox-ink/40">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-ourox-ink">{value}</div>
    </div>
  );
}
