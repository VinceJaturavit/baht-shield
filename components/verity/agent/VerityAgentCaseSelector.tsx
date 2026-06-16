"use client";

import type { VerityAgentSeedCase } from "@/lib/verity/agent-types";
import { SCENARIO_COLORS } from "@/lib/scenario-utils";

interface VerityAgentCaseSelectorProps {
  seedCases: VerityAgentSeedCase[];
  selectedCaseId: string;
  onSelect: (caseId: string) => void;
}

export function VerityAgentCaseSelector({
  seedCases,
  selectedCaseId,
  onSelect,
}: VerityAgentCaseSelectorProps) {
  return (
    <section className="rounded-signal border border-signal-border bg-signal-surface p-5 shadow-signalSubtle">
      <h2 className="text-lg font-semibold text-signal-ink">Select seed case</h2>
      <p className="mt-1 text-[13px] text-signal-slate">
        Choose a synthetic case from one of the three Verity scenarios. Each run
        is deterministic and uses local seed data only.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {seedCases.map((sc) => {
          const selected = sc.caseId === selectedCaseId;
          return (
            <button
              key={sc.caseId}
              type="button"
              onClick={() => onSelect(sc.caseId)}
              className={`rounded-signalSm border px-4 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2 ${
                selected
                  ? "border-signal-indigo bg-signal-indigoSubtle"
                  : "border-signal-borderSubtle bg-signal-surfaceSubtle hover:border-signal-border hover:bg-signal-surface"
              }`}
            >
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${SCENARIO_COLORS[sc.scenario]}`}
              >
                {sc.scenario}
              </span>
              <div className="mt-2 text-sm font-semibold text-signal-ink">
                {sc.caseId}
              </div>
              {sc.entityId && (
                <div className="mt-0.5 text-xs text-signal-slate">
                  Entity: {sc.entityId}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
