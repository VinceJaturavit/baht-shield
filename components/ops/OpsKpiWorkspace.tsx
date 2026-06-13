"use client";

import { useMemo, useState } from "react";
import type { OpsCase } from "@/lib/ops/types";
import { OPS_TEAM } from "@/data/ops/ops-team";
import {
  getIndividualKpis,
  getQueueHealthKpis,
  getTeamKpiSummary,
} from "@/lib/ops/kpi";
import type { OpsKpiView } from "@/lib/ops/kpi-types";
import { OpsKpiViewToggle } from "./OpsKpiViewToggle";
import { OpsKpiTeamView } from "./OpsKpiTeamView";
import { OpsKpiIndividualView } from "./OpsKpiIndividualView";
import { OpsKpiQueueHealthView } from "./OpsKpiQueueHealthView";
import { OpsKpiWeightingNote } from "./OpsKpiWeightingNote";

interface Props {
  cases: OpsCase[];
}

export function OpsKpiWorkspace({ cases }: Props) {
  const [view, setView] = useState<OpsKpiView>("team");

  const teamSummary = useMemo(() => getTeamKpiSummary(cases, OPS_TEAM), [cases]);
  const individualKpis = useMemo(() => getIndividualKpis(cases, OPS_TEAM), [cases]);
  const queueHealthKpis = useMemo(() => getQueueHealthKpis(cases), [cases]);

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-ourox-ink">KPI Board</h2>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-ourox-ink/60">
          Ranking everyone on cases closed punishes the hard, slow, high-stakes work. This board
          uses complexity-weighted productivity and role-appropriate metrics.
        </p>
        <p className="mt-1 max-w-3xl text-[11px] leading-relaxed text-ourox-ink/45">
          Fraud Analysts and Junior Analysts are measured differently because their authority,
          risk, and work type are different.
        </p>
      </div>

      <OpsKpiViewToggle value={view} onChange={setView} />

      {view === "team" && <OpsKpiTeamView summary={teamSummary} />}
      {view === "individual" && <OpsKpiIndividualView kpis={individualKpis} />}
      {view === "queueHealth" && <OpsKpiQueueHealthView kpis={queueHealthKpis} />}

      <OpsKpiWeightingNote />
    </div>
  );
}
