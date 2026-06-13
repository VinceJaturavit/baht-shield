"use client";

import type { OpsCase } from "@/lib/ops/types";
import { getStreamDefinition } from "@/lib/ops/streams";
import {
  formatDuration,
  formatTimeRemaining,
  getSlaPressure,
  OPS_REFERENCE_NOW,
} from "@/lib/ops/sla";
import { OpsPriorityBadge } from "./OpsPriorityBadge";
import { OpsSlaPressureBadge } from "./OpsSlaPressureBadge";
import { OpsStatusBadge } from "./OpsStatusBadge";

interface Props {
  cases: OpsCase[];
  selectedId: string | null;
  onSelect: (caseItem: OpsCase) => void;
  emptyMessage?: string;
  labelledBy?: string;
}

const GRID_COLS =
  "grid-cols-[minmax(5.5rem,6.5rem)_minmax(6.5rem,7.5rem)_3rem_minmax(9rem,1fr)_minmax(6.5rem,7.5rem)_minmax(5.5rem,6.5rem)_minmax(5.5rem,6.5rem)_3rem_minmax(4.5rem,5.5rem)_minmax(5.5rem,7rem)]";

function QueueListHeader() {
  return (
    <div
      className={`hidden lg:grid ${GRID_COLS} min-w-[980px] gap-x-2 border-b border-ourox-obsidianMid px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45`}
      aria-hidden="true"
    >
      <span>Priority</span>
      <span>Case ID</span>
      <span>Stream</span>
      <span>Type / reason</span>
      <span>SLA status</span>
      <span>SLA due</span>
      <span>Remaining</span>
      <span>Age</span>
      <span>Owner</span>
      <span>Status</span>
    </div>
  );
}

function QueueListRow({
  caseItem,
  selected,
  onSelect,
}: {
  caseItem: OpsCase;
  selected: boolean;
  onSelect: (caseItem: OpsCase) => void;
}) {
  const pressure = getSlaPressure(caseItem, OPS_REFERENCE_NOW);
  const streamDef = getStreamDefinition(caseItem.stream);

  return (
    <button
      type="button"
      onClick={() => onSelect(caseItem)}
      aria-pressed={selected}
      className={`grid w-full min-w-[980px] gap-x-2 gap-y-0.5 border-b border-ourox-obsidianMid/70 px-3 py-1.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ourox-orange lg:items-center ${GRID_COLS} ${
        selected
          ? "bg-ourox-orange/[0.06]"
          : "hover:bg-ourox-obsidianLight/40"
      }`}
    >
      <span className="flex items-center">
        <OpsPriorityBadge tier={caseItem.priorityTier} compact />
      </span>

      <span
        className="font-mono text-[11px] font-semibold text-ourox-ink"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        {caseItem.id}
      </span>

      <span
        className="font-mono text-[11px] font-bold text-ourox-orange"
        title={streamDef.label}
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        {caseItem.stream}
      </span>

      <span className="min-w-0 lg:col-span-1">
        <span className="block truncate text-xs font-medium text-ourox-ink">{caseItem.type}</span>
        <span className="block truncate text-[11px] text-ourox-ink/55">
          {caseItem.urgencyReason}
        </span>
      </span>

      <span className="flex items-center lg:col-start-auto">
        <OpsSlaPressureBadge pressure={pressure} />
      </span>

      <span className="text-[11px] tabular-nums text-ourox-ink/75">
        {new Date(caseItem.slaDue).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>

      <span className="text-[11px] tabular-nums text-ourox-ink/75">
        {formatTimeRemaining(caseItem, OPS_REFERENCE_NOW)}
      </span>

      <span className="text-[11px] tabular-nums text-ourox-ink/60">
        {formatDuration(caseItem.ageMinutes)}
      </span>

      <span className="truncate text-[11px] text-ourox-ink/75">{caseItem.owner}</span>

      <span className="flex items-center">
        <OpsStatusBadge status={caseItem.status} />
      </span>
    </button>
  );
}

export function OpsQueueList({ cases, selectedId, onSelect, emptyMessage, labelledBy }: Props) {
  if (cases.length === 0) {
    return (
      <p className="px-3 py-4 text-xs text-ourox-ink/45">
        {emptyMessage ?? "No cases in this queue."}
      </p>
    );
  }

  return (
    <div
      role="table"
      aria-labelledby={labelledBy}
      className="overflow-x-auto rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30"
    >
      <QueueListHeader />
      <div role="rowgroup">
        {cases.map((caseItem) => (
          <QueueListRow
            key={caseItem.id}
            caseItem={caseItem}
            selected={selectedId === caseItem.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
