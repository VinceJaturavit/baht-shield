"use client";

import type { OpsCase, OpsStreamCode } from "@/lib/ops/types";
import { getStreamDefinition } from "@/lib/ops/streams";
import { getSlaPressure, sortOpsCases, OPS_REFERENCE_NOW } from "@/lib/ops/sla";
import { OpsCaseCard } from "./OpsCaseCard";

interface Props {
  stream: OpsStreamCode;
  cases: OpsCase[];
  selectedId: string | null;
  onSelect: (caseItem: OpsCase) => void;
}

export function OpsStreamColumn({ stream, cases, selectedId, onSelect }: Props) {
  const def = getStreamDefinition(stream);
  const sorted = sortOpsCases(cases, OPS_REFERENCE_NOW);
  const atRisk = sorted.filter((c) => {
    const p = getSlaPressure(c, OPS_REFERENCE_NOW);
    return p === "Near breach" || p === "Breached";
  }).length;

  return (
    <section
      aria-labelledby={`ops-stream-${stream}`}
      className="flex min-h-[320px] flex-col rounded-xl border border-ourox-obsidianMid bg-ourox-obsidian/50"
    >
      <header className="border-b border-ourox-obsidianMid px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3
              id={`ops-stream-${stream}`}
              className="font-mono text-sm font-bold tracking-wide text-ourox-orange"
            >
              {stream}
            </h3>
            <p className="mt-0.5 text-xs font-medium text-ourox-ink/80">{def.label}</p>
          </div>
          <span className="rounded-full border border-ourox-obsidianMid bg-ourox-obsidianLight px-2 py-0.5 text-[11px] font-semibold text-ourox-ink/70">
            {sorted.length}
          </span>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-ourox-ink/50">{def.slaCharacter}</p>
        {atRisk > 0 && (
          <p className="mt-2 text-[11px] font-medium text-ourox-orange/90">
            {atRisk} near breach or breached
          </p>
        )}
      </header>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        {sorted.length === 0 ? (
          <p className="py-6 text-center text-xs text-ourox-ink/40">No cases in this stream</p>
        ) : (
          sorted.map((caseItem) => (
            <OpsCaseCard
              key={caseItem.id}
              caseItem={caseItem}
              selected={selectedId === caseItem.id}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </section>
  );
}
