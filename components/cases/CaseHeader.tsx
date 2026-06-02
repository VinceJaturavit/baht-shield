import Link from "next/link";
import type { EnrichedCaseDetail } from "@/lib/types";
import { SeverityBadge } from "@/components/SeverityBadge";
import { ScenarioChip } from "@/components/alerts/ScenarioChip";
import { CaseDecisionBadge } from "./CaseDecisionBadge";

function formatTHB(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(amount);
}

interface CaseHeaderProps {
  caseDetail: EnrichedCaseDetail;
}

export function CaseHeader({ caseDetail }: CaseHeaderProps) {
  return (
    <div className="mb-3 overflow-hidden rounded-signal border border-signal-border bg-signal-surface shadow-signalSubtle">
      {/* Title row */}
      <div className="border-b border-signal-borderSubtle bg-signal-surfaceSubtle px-6 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-xl font-semibold text-signal-ink">
                Case {caseDetail.case_id}
              </h1>
              <SeverityBadge severity={caseDetail.severity} />
              <ScenarioChip scenario={caseDetail.scenario} />
            </div>
            <p className="mt-1 text-[11px] text-signal-secondary">
              Investigation detail assembled from synthetic alert, wallet, pattern, and case-note
              data.
            </p>
          </div>

          <a
            href="#closure-note"
            className="inline-flex items-center gap-1.5 rounded-signalSm border border-signal-accentBorder bg-signal-accentSubtle px-4 py-2 text-sm font-medium text-signal-accent transition-colors hover:bg-signal-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-accent focus-visible:ring-offset-1"
          >
            <svg
              className="h-4 w-4"
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
            Draft closure note
          </a>
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 px-6 py-3 sm:grid-cols-3 lg:grid-cols-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-signal-faint">Decision / Status</p>
          <div className="mt-1">
            <CaseDecisionBadge
              decision={caseDetail.decision}
              investigation_status={caseDetail.investigation_status}
            />
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-signal-faint">Owner</p>
          <p className="mt-1 text-xs text-signal-body">{caseDetail.owner || "Unassigned"}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-signal-faint">Synthetic Loss</p>
          <p className="mt-1 text-xs font-semibold tabular-nums text-signal-heading">
            {formatTHB(caseDetail.loss_amount)}
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-signal-faint">Linked Wallet</p>
          {caseDetail.wallet_id ? (
            <Link
              href={`/wallet/${caseDetail.wallet_id}`}
              className="mt-1 block font-mono text-xs text-signal-indigo hover:underline focus:outline-none focus-visible:underline"
            >
              {caseDetail.wallet_id}
            </Link>
          ) : (
            <p className="mt-1 text-xs text-signal-faint">—</p>
          )}
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-signal-faint">Linked Pattern</p>
          {caseDetail.linked_pattern_id ? (
            <Link
              href={`/patterns?patternId=${caseDetail.linked_pattern_id}`}
              className="mt-1 block font-mono text-xs text-signal-indigo hover:underline focus:outline-none focus-visible:underline"
            >
              {caseDetail.linked_pattern_id}
            </Link>
          ) : (
            <p className="mt-1 text-xs text-signal-faint">—</p>
          )}
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-signal-faint">Opened</p>
          <p className="mt-1 text-xs text-signal-body">{caseDetail.opened_at || "—"}</p>
          {caseDetail.age_label && (
            <p className="mt-0.5 text-[10px] text-signal-secondary" title="Age from case opened_at">
              {caseDetail.age_label}
            </p>
          )}
        </div>

        {caseDetail.closed_at && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-signal-faint">Closed</p>
            <p className="mt-1 text-xs text-signal-body">{caseDetail.closed_at}</p>
          </div>
        )}

        <div>
          <p className="text-[11px] uppercase tracking-wide text-signal-faint">Alert</p>
          <p className="mt-1 font-mono text-xs text-signal-body">{caseDetail.alert_id}</p>
        </div>
      </div>
    </div>
  );
}
