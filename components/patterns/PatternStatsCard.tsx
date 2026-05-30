import type { PatternSummary } from "@/lib/types";

interface PatternStatsCardProps {
  patterns: PatternSummary[];
}

export function PatternStatsCard({ patterns }: PatternStatsCardProps) {
  const totalPatterns = patterns.length;
  const verifiedCount = patterns.filter((p) => p.status === "verified").length;
  const uniqueWallets = new Set(patterns.flatMap((p) => p.linked_wallets.map((w) => w.wallet_id)));
  const totalCaseApprox = patterns.reduce((sum, p) => sum + p.linked_case_count, 0);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="rounded-signal border border-signal-border bg-white p-5 shadow-signal">
        <div className="text-3xl font-semibold tabular-nums text-signal-heading">
          {totalPatterns}
        </div>
        <div className="mt-1 text-xs uppercase tracking-wide text-signal-secondary">
          Total patterns
        </div>
      </div>
      <div className="rounded-signal border border-signal-border bg-white p-5 shadow-signal">
        <div className="text-3xl font-semibold tabular-nums text-signal-heading">
          {uniqueWallets.size}
        </div>
        <div className="mt-1 text-xs uppercase tracking-wide text-signal-secondary">
          Linked wallets
        </div>
      </div>
      <div className="rounded-signal border border-signal-border bg-white p-5 shadow-signal">
        <div className="text-3xl font-semibold tabular-nums text-signal-heading">
          {totalCaseApprox}
        </div>
        <div className="mt-1 text-xs uppercase tracking-wide text-signal-secondary">
          Linked cases (Σ)
        </div>
      </div>
      <div className="rounded-signal border border-signal-border bg-white p-5 shadow-signal">
        <div className="text-3xl font-semibold tabular-nums text-signal-accent">
          {verifiedCount}
        </div>
        <div className="mt-1 text-xs uppercase tracking-wide text-signal-secondary">
          Verified patterns
        </div>
      </div>
    </div>
  );
}
