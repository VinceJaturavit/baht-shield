"use client";

import { useEffect, useRef } from "react";
import type { OpsCase } from "@/lib/ops/types";
import {
  buildWhyHereRationale,
  formatDuration,
  formatTimeRemaining,
  getSlaPressure,
  getSlaRuleForCase,
  OPS_REFERENCE_NOW,
} from "@/lib/ops/sla";
import { OpsPriorityBadge } from "./OpsPriorityBadge";
import { OpsStatusBadge } from "./OpsStatusBadge";
import { OpsSlaPressureBadge } from "./OpsSlaPressureBadge";
import { OpsImpactBreakdown } from "./OpsImpactBreakdown";

interface Props {
  caseItem: OpsCase | null;
  onClose: () => void;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-ourox-obsidianLight px-3 py-2">
      <div className="text-xs text-ourox-ink/50">{label}</div>
      <div className="text-sm font-medium text-ourox-ink">{value}</div>
    </div>
  );
}

export function OpsSlaDrawer({ caseItem, onClose }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!caseItem) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    drawerRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [caseItem, onClose]);

  if (!caseItem) return null;

  const rule = getSlaRuleForCase(caseItem);
  const pressure = getSlaPressure(caseItem, OPS_REFERENCE_NOW);
  const rationale = buildWhyHereRationale(caseItem, OPS_REFERENCE_NOW);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`SLA breakdown for ${caseItem.id}`}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col overflow-y-auto bg-ourox-obsidian shadow-2xl focus:outline-none"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-ourox-obsidianMid px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ourox-ink/50">
              SLA breakdown
            </p>
            <h2 className="mt-0.5 font-mono text-sm font-bold text-ourox-ink">{caseItem.id}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-ourox-ink/50 transition hover:bg-ourox-obsidianMid hover:text-ourox-ink"
            aria-label="Close drawer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M12.207 3.793a1 1 0 010 1.414L9.414 8l2.793 2.793a1 1 0 01-1.414 1.414L8 9.414l-2.793 2.793a1 1 0 01-1.414-1.414L6.586 8 3.793 5.207a1 1 0 011.414-1.414L8 6.586l2.793-2.793a1 1 0 011.414 0z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-6 p-6">
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ourox-orange">
              Case summary
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <MetaRow label="Stream" value={`${caseItem.stream} — ${caseItem.streamLabel}`} />
              <MetaRow label="Type" value={caseItem.type} />
              <div className="rounded bg-ourox-obsidianLight px-3 py-2">
                <div className="text-xs text-ourox-ink/50">Priority</div>
                <div className="mt-1">
                  <OpsPriorityBadge tier={caseItem.priorityTier} />
                </div>
              </div>
              <div className="rounded bg-ourox-obsidianLight px-3 py-2">
                <div className="text-xs text-ourox-ink/50">Status</div>
                <div className="mt-1">
                  <OpsStatusBadge status={caseItem.status} />
                </div>
              </div>
              <MetaRow label="Urgency reason" value={caseItem.urgencyReason} />
              <MetaRow label="Owner" value={caseItem.owner} />
              <MetaRow label="Queue" value={caseItem.queue} />
              <MetaRow
                label="Created"
                value={new Date(caseItem.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              />
              <MetaRow label="Case age" value={formatDuration(caseItem.ageMinutes)} />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ourox-orange">
              SLA clock
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <MetaRow label="SLA rule ref" value={caseItem.slaRuleRef} />
              <MetaRow label="Clock type" value={rule.clockType} />
              <MetaRow label="Start trigger" value={rule.startTrigger} />
              <MetaRow label="Duration" value={formatDuration(rule.durationMinutes)} />
              <MetaRow
                label="SLA due"
                value={new Date(caseItem.slaDue).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              />
              <div className="rounded bg-ourox-obsidianLight px-3 py-2">
                <div className="text-xs text-ourox-ink/50">Time remaining / overdue</div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-ourox-ink">
                    {formatTimeRemaining(caseItem, OPS_REFERENCE_NOW)}
                  </span>
                  <OpsSlaPressureBadge pressure={pressure} />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ourox-orange">
              Cost of delay
            </h3>
            <p className="text-sm leading-relaxed text-ourox-ink/75">{rule.costOfDelay}</p>
          </section>

          <section className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ourox-ink/50">
              Why this case sits here
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ourox-ink/85">{rationale}</p>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ourox-orange">
              Impact breakdown
            </h3>
            <p className="mb-3 text-xs leading-relaxed text-ourox-ink/55">
              Impact = consequence of delay (financial, social, incident). SLA = time to breach.
              Triage on both.
            </p>
            <OpsImpactBreakdown impact={caseItem.impact} />
          </section>
        </div>
      </div>
    </>
  );
}
