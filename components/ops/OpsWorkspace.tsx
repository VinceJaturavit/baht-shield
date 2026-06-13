"use client";

import { useState } from "react";
import type { OpsCase } from "@/lib/ops/types";
import { OPS_CASES } from "@/data/ops/ops-cases";
import { OpsSyntheticBanner } from "./OpsSyntheticBanner";
import { OpsSideNav, type OpsWorkspaceView } from "./OpsSideNav";
import { OpsQueueWorkspace } from "./OpsQueueWorkspace";
import { OpsAgingDashboard } from "./OpsAgingDashboard";
import { OpsRosterWorkspace } from "./OpsRosterWorkspace";
import { OpsKpiWorkspace } from "./OpsKpiWorkspace";
import { OpsSlaDrawer } from "./OpsSlaDrawer";

const WORKSPACE_BADGE: Record<OpsWorkspaceView, string> = {
  queue: "Queue Board",
  aging: "Aging & SLA",
  roster: "Roster",
  kpi: "KPI",
};

export function OpsWorkspace() {
  const [workspace, setWorkspace] = useState<OpsWorkspaceView>("queue");
  const [selected, setSelected] = useState<OpsCase | null>(null);

  return (
    <div className="min-h-screen bg-ourox-obsidian">
      <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 lg:px-6 lg:py-10">
        <header>
          <div className="mb-2 flex items-center gap-3">
            <img
              src="/logos/ourox-ops-horizontal.svg"
              alt="Ourox Ops"
              height={40}
              style={{ height: 40, width: "auto" }}
            />
            <span className="rounded-full border border-ourox-orange/30 bg-ourox-orange/10 px-2 py-0.5 text-xs font-semibold text-ourox-orange">
              {WORKSPACE_BADGE[workspace]}
            </span>
          </div>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-ourox-ink/60">
            Ops runs the operation after an alert becomes a case — queues, SLA, ownership, and
            performance.
          </p>
        </header>

        <OpsSyntheticBanner />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <OpsSideNav active={workspace} onSelect={setWorkspace} />

          <div className="min-w-0 flex-1">
            {workspace === "queue" && (
              <OpsQueueWorkspace
                cases={OPS_CASES}
                selectedId={selected?.id ?? null}
                onSelect={setSelected}
              />
            )}
            {workspace === "aging" && <OpsAgingDashboard cases={OPS_CASES} />}
            {workspace === "roster" && <OpsRosterWorkspace cases={OPS_CASES} />}
            {workspace === "kpi" && <OpsKpiWorkspace cases={OPS_CASES} />}
          </div>
        </div>
      </div>

      <OpsSlaDrawer caseItem={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
