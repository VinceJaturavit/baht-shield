"use client";

import { useState } from "react";
import type { EnrichedCase, WalletProfileData } from "@/lib/wallet-profile";
import { SeverityBadge } from "@/components/SeverityBadge";
import { EmptyState } from "./EmptyState";
import { ClosureNoteBuilder } from "./ClosureNoteBuilder";

interface CaseHistoryPanelProps {
  cases: EnrichedCase[];
  walletProfile: WalletProfileData;
}

function formatTHB(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(amount);
}

const DECISION_STYLES: Record<string, string> = {
  pending: "border-signal-border bg-signal-surfaceSubtle text-signal-slate",
  clear: "border-signal-border bg-signal-surface text-signal-body",
  close_account: "border-signal-border bg-signal-surfaceSubtle text-risk-critical",
  escalate_compliance: "border-signal-amberBorder bg-signal-amberSubtle text-signal-body",
  monitor: "border-signal-border bg-signal-surface text-signal-body",
  suspend_wallet: "border-signal-border bg-signal-surfaceSubtle text-risk-high",
};

export function CaseHistoryPanel({ cases, walletProfile }: CaseHistoryPanelProps) {
  // Only one builder open at a time; clicking same case toggles it closed
  const [openCaseId, setOpenCaseId] = useState<string | null>(null);

  function handleDraftNote(caseId: string) {
    setOpenCaseId((prev) => (prev === caseId ? null : caseId));
  }

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-signal-ink">Case history</h2>
        {cases.length > 0 && (
          <span className="inline-flex items-center rounded-full border border-signal-border bg-signal-surfaceSubtle px-2 py-0.5 text-xs font-medium tabular-nums text-signal-slate">
            {cases.length}
          </span>
        )}
      </div>

      {cases.length === 0 ? (
        <EmptyState title="No linked cases found for this wallet." />
      ) : (
        <div className="space-y-4">
          {cases.map((c) => {
            const decisionKey = (c.decision ?? "").toLowerCase();
            const decisionStyle =
              DECISION_STYLES[decisionKey] ?? "border-signal-border bg-signal-muted text-signal-secondary";
            const isOpen = openCaseId === c.case_id;

            return (
              <div
                key={c.case_id}
                className="rounded-signal border border-signal-border bg-signal-surface shadow-signalSubtle overflow-hidden"
              >
                {/* Case header */}
                <div className="px-6 py-3.5 bg-signal-surfaceSubtle border-b border-signal-borderSubtle flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-mono font-semibold text-signal-ink">{c.case_id}</span>
                    {c.alert && <SeverityBadge severity={c.alert.severity} />}
                  </div>
                  <span
                    className={`inline-flex items-center rounded-signalSm border px-2 py-0.5 text-[11px] font-medium ${decisionStyle}`}
                  >
                    {c.decision || "pending"}
                  </span>
                </div>

                {/* Case body */}
                <div className="px-6 py-4 grid grid-cols-2 gap-x-6 gap-y-3">
                  {c.alert && (
                    <>
                      <div>
                        <p className="text-[11px] text-signal-faint uppercase tracking-wide">Alert</p>
                        <p className="text-xs font-mono text-signal-body mt-0.5">{c.alert_id}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-signal-faint uppercase tracking-wide">Rule</p>
                        <p className="text-xs text-signal-body mt-0.5 break-all">
                          {c.alert.rule_name}
                        </p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-[11px] text-signal-faint uppercase tracking-wide">Owner</p>
                    <p className="text-xs text-signal-body mt-0.5">{c.owner}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-signal-faint uppercase tracking-wide">Loss Amount</p>
                    <p className="text-xs font-semibold tabular-nums text-signal-heading mt-0.5">
                      {formatTHB(c.loss_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-signal-faint uppercase tracking-wide">Opened</p>
                    <p className="text-xs text-signal-body mt-0.5">{c.opened_at}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-signal-faint uppercase tracking-wide">Closed</p>
                    <p className="text-xs text-signal-body mt-0.5">
                      {c.closed_at ?? (
                        <span className="text-signal-faint">Open</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Case notes */}
                {c.notes.length > 0 && (
                  <div className="px-6 py-3 border-t border-signal-borderSubtle">
                    <p className="text-[11px] uppercase tracking-wide text-signal-faint mb-2">
                      Notes ({c.notes.length})
                    </p>
                    <div className="space-y-2">
                      {c.notes.map((note) => (
                        <div key={note.note_id} className="rounded-signalSm border border-signal-borderSubtle bg-signal-surfaceSubtle px-3 py-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-medium text-signal-secondary capitalize">
                              {note.author_type}
                            </span>
                            <span className="text-[11px] text-signal-faint">{note.timestamp}</span>
                          </div>
                          <p className="text-xs text-signal-body leading-relaxed">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Draft closure note action */}
                <div className="px-6 py-3 border-t border-signal-borderSubtle bg-signal-surface flex items-center gap-3">
                  <button
                    onClick={() => handleDraftNote(c.case_id)}
                    className={`inline-flex items-center gap-1.5 rounded-signalSm px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-1 ${
                      isOpen
                        ? "bg-signal-indigo text-white hover:bg-signal-indigoHover"
                        : "bg-signal-surface text-signal-indigo border border-signal-indigoBorder hover:bg-signal-indigoSubtle"
                    }`}
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {isOpen ? "Close note builder" : "Draft closure note"}
                  </button>
                  {isOpen && (
                    <span className="text-[11px] text-signal-secondary">
                      Structured evidence toggles → deterministic note
                    </span>
                  )}
                </div>

                {/* Inline closure note builder */}
                {isOpen && (
                  <div className="px-5 pb-5">
                    <ClosureNoteBuilder caseData={c} walletProfile={walletProfile} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
