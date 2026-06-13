"use client";

import { useMemo, useState } from "react";
import type { OpsCase, OpsStreamCode } from "@/lib/ops/types";
import { OPS_STREAM_CODES } from "@/lib/ops/streams";
import { buildSortedQueueSections } from "@/lib/ops/queue";
import { OpsQueueList } from "./OpsQueueList";

interface Props {
  cases: OpsCase[];
  selectedId: string | null;
  onSelect: (caseItem: OpsCase) => void;
}

type QueueView = "urgent" | "by-stream";
type StreamFilter = "all" | OpsStreamCode;

const STREAM_FILTERS: { value: StreamFilter; label: string }[] = [
  { value: "all", label: "All streams" },
  ...OPS_STREAM_CODES.map((code) => ({ value: code as StreamFilter, label: code })),
];

export function OpsQueueBoard({ cases, selectedId, onSelect }: Props) {
  const [view, setView] = useState<QueueView>("by-stream");
  const [streamFilter, setStreamFilter] = useState<StreamFilter>("all");

  const { urgentCases, mainQueueCases } = useMemo(
    () => buildSortedQueueSections(cases, streamFilter),
    [cases, streamFilter],
  );

  const isUrgent = view === "urgent";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex items-center gap-1 rounded border border-ourox-obsidianMid p-0.5"
          role="group"
          aria-label="Queue view"
        >
          <button
            type="button"
            onClick={() => setView("urgent")}
            aria-pressed={isUrgent}
            className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange ${
              isUrgent
                ? "bg-ourox-orange/10 text-ourox-orange"
                : "text-ourox-ink/60 hover:text-ourox-ink"
            }`}
          >
            Urgent
          </button>
          <button
            type="button"
            onClick={() => setView("by-stream")}
            aria-pressed={!isUrgent}
            className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange ${
              !isUrgent
                ? "bg-ourox-orange/10 text-ourox-orange"
                : "text-ourox-ink/60 hover:text-ourox-ink"
            }`}
          >
            By stream
          </button>
        </div>

        {!isUrgent && (
          <div
            className="flex flex-wrap items-center gap-1"
            role="group"
            aria-label="Filter by stream"
          >
            {STREAM_FILTERS.map(({ value, label }) => {
              const active = streamFilter === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStreamFilter(value)}
                  aria-pressed={active}
                  className={`rounded border px-2.5 py-1 text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange ${
                    active
                      ? "border-ourox-orange/40 bg-ourox-orange/10 text-ourox-orange"
                      : "border-ourox-obsidianMid text-ourox-ink/60 hover:border-ourox-obsidianMid hover:bg-ourox-obsidianLight/50 hover:text-ourox-ink"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {isUrgent ? (
        <section aria-labelledby="ops-urgent-overlay">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded border border-ourox-orange/50 text-[9px] font-bold text-ourox-orange"
              aria-hidden="true"
            >
              !
            </span>
            <h3
              id="ops-urgent-overlay"
              className="text-xs font-semibold uppercase tracking-wider text-ourox-ink"
            >
              Urgent overlay
            </h3>
            <span className="text-[11px] tabular-nums text-ourox-ink/50">
              {urgentCases.length} cases
            </span>
          </div>
          <p className="mb-3 max-w-2xl text-xs leading-relaxed text-ourox-ink/55">
            Cross-stream cases routed above standard queues because cost of delay is high.
          </p>

          <OpsQueueList
            cases={urgentCases}
            selectedId={selectedId}
            onSelect={onSelect}
            labelledBy="ops-urgent-overlay"
            emptyMessage="No urgent cases in the overlay."
          />
        </section>
      ) : (
        <section aria-labelledby="ops-main-queue">
          <div className="mb-3">
            <h3
              id="ops-main-queue"
              className="text-xs font-semibold uppercase tracking-wider text-ourox-ink/70"
            >
              Stream queue — priority then SLA pressure
            </h3>
            <p className="mt-1 text-[11px] text-ourox-ink/45">
              {mainQueueCases.length} cases · urgent overlay excluded
            </p>
          </div>

          <OpsQueueList
            cases={mainQueueCases}
            selectedId={selectedId}
            onSelect={onSelect}
            labelledBy="ops-main-queue"
            emptyMessage={
              streamFilter === "all"
                ? "No cases in the main queue."
                : `No ${streamFilter} cases in the main queue.`
            }
          />
        </section>
      )}
    </div>
  );
}
