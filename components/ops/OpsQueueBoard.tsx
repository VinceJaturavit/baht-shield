"use client";

import { useMemo } from "react";
import type { OpsCase } from "@/lib/ops/types";
import { OPS_STREAMS } from "@/lib/ops/streams";
import { sortOpsCases, OPS_REFERENCE_NOW } from "@/lib/ops/sla";
import { OpsStreamColumn } from "./OpsStreamColumn";
import { OpsCaseCard } from "./OpsCaseCard";

interface Props {
  cases: OpsCase[];
  selectedId: string | null;
  onSelect: (caseItem: OpsCase) => void;
}

export function OpsQueueBoard({ cases, selectedId, onSelect }: Props) {
  const urgentCases = useMemo(
    () =>
      sortOpsCases(
        cases.filter((c) => c.priorityTier === "Urgent"),
        OPS_REFERENCE_NOW,
      ),
    [cases],
  );

  const streamCases = useMemo(() => {
    const byStream: Record<string, OpsCase[]> = {};
    for (const stream of OPS_STREAMS) {
      byStream[stream.code] = cases.filter(
        (c) => c.stream === stream.code && c.priorityTier !== "Urgent",
      );
    }
    return byStream;
  }, [cases]);

  return (
    <div className="space-y-6">
      {/* Urgent overlay band */}
      <section
        aria-labelledby="ops-urgent-overlay"
        className="rounded-xl border-2 border-dashed border-ourox-orange/40 bg-ourox-orange/[0.04] p-4"
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded border border-ourox-orange/50 bg-ourox-obsidian text-[10px] font-bold text-ourox-orange"
                aria-hidden="true"
              >
                !
              </span>
              <h2
                id="ops-urgent-overlay"
                className="text-sm font-semibold uppercase tracking-wider text-ourox-ink"
              >
                Urgent overlay
              </h2>
              <span className="rounded-full border border-ourox-orange/30 bg-ourox-orange/10 px-2 py-0.5 text-[11px] font-semibold text-ourox-orange">
                {urgentCases.length} cases
              </span>
            </div>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ourox-ink/60">
              Cross-stream cases routed above standard queues because cost of delay is high.
            </p>
          </div>
        </div>

        {urgentCases.length === 0 ? (
          <p className="text-xs text-ourox-ink/45">No urgent cases in the overlay.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {urgentCases.map((caseItem) => (
              <OpsCaseCard
                key={caseItem.id}
                caseItem={caseItem}
                selected={selectedId === caseItem.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </section>

      {/* Stream columns */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ourox-ink/50">
          Stream queues — priority then SLA pressure
        </h2>
        <div className="grid gap-4 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2">
          {OPS_STREAMS.map((stream) => (
            <OpsStreamColumn
              key={stream.code}
              stream={stream.code}
              cases={streamCases[stream.code] ?? []}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
