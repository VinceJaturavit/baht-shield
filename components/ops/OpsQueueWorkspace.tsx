"use client";

import type { OpsCase } from "@/lib/ops/types";
import { OpsQueueBoard } from "./OpsQueueBoard";

interface Props {
  cases: OpsCase[];
  selectedId: string | null;
  onSelect: (caseItem: OpsCase) => void;
}

export function OpsQueueWorkspace({ cases, selectedId, onSelect }: Props) {
  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-ourox-ink">Queue Board</h2>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ourox-ink/55">
          Priority overlay and stream queues — sorted by urgency and SLA pressure.
        </p>
      </div>

      <OpsQueueBoard cases={cases} selectedId={selectedId} onSelect={onSelect} />
    </div>
  );
}
