import type { WalletProfileData } from "@/lib/wallet-profile";
import { VariableChipGroup } from "@/components/patterns/VariableChipGroup";
import { getPatternFamily } from "@/lib/scenario-utils";

interface KeyEvidenceSummaryProps {
  walletProfile: WalletProfileData;
}

interface EvidenceCardProps {
  label: string;
  children: React.ReactNode;
}

function EvidenceCard({ label, children }: EvidenceCardProps) {
  return (
    <div className="rounded-signalSm border border-signal-borderSubtle bg-signal-surfaceSubtle p-4">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-signal-meta">
        {label}
      </p>
      {children}
    </div>
  );
}

export function KeyEvidenceSummary({ walletProfile }: KeyEvidenceSummaryProps) {
  const { matchedPatterns, cases, transactions } = walletProfile;
  const topPattern = matchedPatterns[0] ?? null;
  const hasMatch = Boolean(topPattern);

  if (!hasMatch && cases.length === 0) {
    return (
      <div className="rounded-signal border border-dashed border-signal-border bg-signal-surface px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-signal-meta mb-1">
          Evidence summary
        </p>
        <p className="text-sm text-signal-slate">
          No scenario-linked evidence found for this wallet. Review available wallet, device,
          transaction, and case context manually.
        </p>
      </div>
    );
  }

  const patternFamily = topPattern
    ? getPatternFamily({
        pattern_id: topPattern.pattern_id,
        name: topPattern.name,
        cluster_type: topPattern.cluster_type,
      })
    : "Other";

  return (
    <div className="rounded-signal border border-signal-border bg-signal-surface px-6 py-5 shadow-signalSubtle">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-signal-meta">
        Evidence summary
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* 1 — Pattern match */}
        <EvidenceCard label="Matched pattern">
          {hasMatch ? (
            <>
              <p className="text-sm font-semibold text-signal-heading leading-snug">
                {topPattern!.name}
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-signal-accent">
                {topPattern!.pattern_id}
              </p>
            </>
          ) : (
            <p className="text-sm text-signal-faint italic">
              No analyst-curated pattern linked
            </p>
          )}
        </EvidenceCard>

        {/* 2 — Defining signals */}
        <EvidenceCard label="Top signals">
          {hasMatch && topPattern!.variables ? (
            <VariableChipGroup
              variables={topPattern!.variables}
              patternFamily={patternFamily}
              compact
            />
          ) : (
            <p className="text-sm text-signal-faint italic">No signal variables linked</p>
          )}
        </EvidenceCard>

        {/* 3 — Linked cases */}
        <EvidenceCard label="Linked cases">
          {cases.length > 0 ? (
            <>
              <p className="text-2xl font-bold tabular-nums text-signal-heading">
                {cases.length}
              </p>
              <p className="text-[11px] text-signal-secondary mt-0.5">
                {cases.length === 1 ? "case" : "cases"} connected to this wallet
              </p>
            </>
          ) : (
            <p className="text-sm text-signal-faint italic">No linked cases</p>
          )}
        </EvidenceCard>

        {/* 4 — Naive-miss */}
        <EvidenceCard label="What a naive score may miss">
          <p className="text-xs text-signal-body leading-relaxed">
            {hasMatch
              ? topPattern!.naive_miss_note
              : "Naive scoring may miss distributed signals across cases, endpoints, or prior analyst decisions."}
          </p>
        </EvidenceCard>

        {/* 5 — Transaction sequence */}
        <EvidenceCard label="Transaction sequence">
          {transactions.length > 0 ? (
            <>
              <p className="text-2xl font-bold tabular-nums text-signal-heading">
                {transactions.length}
              </p>
              <p className="text-[11px] text-signal-secondary mt-0.5">
                synthetic transactions ordered by txn_id sequence
              </p>
            </>
          ) : (
            <p className="text-sm text-signal-faint italic">No transactions on record</p>
          )}
        </EvidenceCard>
      </div>
    </div>
  );
}
