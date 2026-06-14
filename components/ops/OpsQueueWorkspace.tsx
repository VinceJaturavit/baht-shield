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
          Cases read on two axes: priority and SLA pressure (time to breach), and impact tier
          (consequence of delay). A fresh but Critical case should not be buried by a pure SLA
          sort; a near-breach Low-impact case still needs action, but for a different reason.
        </p>
      </div>

      <OpsQueueBoard cases={cases} selectedId={selectedId} onSelect={onSelect} />
    </div>
  );
}
