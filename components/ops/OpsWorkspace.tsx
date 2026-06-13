"use client";

import { useState } from "react";
import type { OpsCase } from "@/lib/ops/types";
import { OPS_CASES } from "@/data/ops/ops-cases";
import { OpsSyntheticBanner } from "./OpsSyntheticBanner";
import { OpsQueueBoard } from "./OpsQueueBoard";
import { OpsSlaDrawer } from "./OpsSlaDrawer";

export function OpsWorkspace() {
  const [selected, setSelected] = useState<OpsCase | null>(null);

  return (
    <div className="min-h-screen bg-ourox-obsidian">
      <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 lg:px-6 lg:py-10">
        <header>
          <div className="mb-2 flex items-center gap-3">
            <img
              src="/logos/ourox-ops-horizontal.svg"
              alt="Ourox Ops"
              height={52}
              style={{ height: 52, width: "auto" }}
            />
            <span className="rounded-full border border-ourox-orange/30 bg-ourox-orange/10 px-2 py-0.5 text-xs font-semibold text-ourox-orange">
              Queue Board
            </span>
          </div>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-ourox-ink/60">
            Ops runs the operation after an alert becomes a case — queues, SLA, ownership, and
            performance.
          </p>
        </header>

        <OpsSyntheticBanner />

        <OpsQueueBoard
          cases={OPS_CASES}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
        />
      </div>

      <OpsSlaDrawer caseItem={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
