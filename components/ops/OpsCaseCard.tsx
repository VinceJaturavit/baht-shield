"use client";

import type { OpsCase } from "@/lib/ops/types";
import {
  formatDuration,
  formatTimeRemaining,
  getSlaPressure,
  OPS_REFERENCE_NOW,
} from "@/lib/ops/sla";
import { OpsPriorityBadge } from "./OpsPriorityBadge";
import { OpsStatusBadge } from "./OpsStatusBadge";
import { OpsSlaPressureBadge } from "./OpsSlaPressureBadge";

interface Props {
  caseItem: OpsCase;
  onSelect: (caseItem: OpsCase) => void;
  selected?: boolean;
}

export function OpsCaseCard({ caseItem, onSelect, selected }: Props) {
  const pressure = getSlaPressure(caseItem, OPS_REFERENCE_NOW);

  return (
    <button
      type="button"
      onClick={() => onSelect(caseItem)}
      aria-pressed={selected}
      className={`w-full rounded-lg border px-3 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ourox-obsidian ${
        selected
          ? "border-ourox-orange/60 bg-ourox-orange/5"
          : "border-ourox-obsidianMid bg-ourox-obsidianLight hover:border-ourox-obsidianMid hover:bg-ourox-obsidianMid/40"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs font-bold text-ourox-ink">{caseItem.id}</p>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-ourox-ink/50">
            {caseItem.stream}
          </p>
        </div>
        <OpsPriorityBadge tier={caseItem.priorityTier} compact />
      </div>

      <p className="mt-2 text-sm font-medium text-ourox-ink">{caseItem.type}</p>
      <p className="mt-1 text-xs leading-relaxed text-ourox-ink/65">{caseItem.urgencyReason}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <OpsSlaPressureBadge pressure={pressure} />
        <OpsStatusBadge status={caseItem.status} />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
        <div>
          <dt className="text-ourox-ink/45">SLA due</dt>
          <dd className="font-medium text-ourox-ink/80">
            {new Date(caseItem.slaDue).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </dd>
        </div>
        <div>
          <dt className="text-ourox-ink/45">Remaining</dt>
          <dd className="font-medium text-ourox-ink/80">
            {formatTimeRemaining(caseItem, OPS_REFERENCE_NOW)}
          </dd>
        </div>
        <div>
          <dt className="text-ourox-ink/45">Age</dt>
          <dd className="font-medium text-ourox-ink/80">
            {formatDuration(caseItem.ageMinutes)}
          </dd>
        </div>
        <div>
          <dt className="text-ourox-ink/45">Owner</dt>
          <dd className="font-medium text-ourox-ink/80">{caseItem.owner}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-ourox-ink/45">Queue</dt>
          <dd className="font-medium text-ourox-ink/80">{caseItem.queue}</dd>
        </div>
      </dl>
    </button>
  );
}
