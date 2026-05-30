import Link from "next/link";
import type { PatternSummary } from "@/lib/types";
import { PatternFamilyBadge } from "./PatternFamilyBadge";

interface PatternDetailPanelProps {
  pattern: PatternSummary | null;
}

const STATUS_CLASSES: Record<string, string> = {
  verified: "border border-signal-accentBorder bg-signal-accentSubtle text-signal-accent",
  probable: "border border-signal-border bg-white text-signal-body",
  emerging: "border border-signal-border bg-signal-muted text-signal-secondary",
  retired: "border border-signal-border bg-signal-muted text-signal-faint",
};

export function PatternDetailPanel({ pattern }: PatternDetailPanelProps) {
  if (!pattern) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center rounded-signal border border-dashed border-signal-border bg-white p-8 text-sm text-signal-faint">
        Select a pattern to view details.
      </div>
    );
  }

  const statusClass =
    STATUS_CLASSES[pattern.status] ??
    "border border-signal-border bg-signal-muted text-signal-secondary";

  return (
    <div className="rounded-signal border border-signal-border bg-white shadow-signal">
      {/* Header */}
      <div className="border-b border-signal-borderSubtle px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-signal-heading">{pattern.name}</h2>
            <p className="mt-0.5 font-mono text-xs text-signal-faint">{pattern.pattern_id}</p>
          </div>
          <PatternFamilyBadge family={pattern.family} />
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-signal-body">
          <span>
            <span className="text-signal-faint">Status:</span>{" "}
            <span className={`inline-flex items-center rounded-signalSm px-1.5 py-0.5 font-medium ${statusClass}`}>
              {pattern.status}
            </span>
          </span>
          <span>
            <span className="text-signal-faint">Cluster type:</span>{" "}
            <span className="font-medium text-signal-heading">{pattern.cluster_type}</span>
          </span>
          <span>
            <span className="text-signal-faint">Created by:</span>{" "}
            <span className="font-medium text-signal-heading">{pattern.created_by}</span>
          </span>
        </div>
      </div>

      {/* Variables */}
      <div className="border-b border-signal-borderSubtle px-6 py-5">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-signal-secondary">
          Matched Variables / Pattern Criteria
        </h3>
        <pre className="whitespace-pre-wrap rounded-signalSm border border-signal-borderSubtle bg-signal-muted px-3 py-2.5 font-mono text-xs leading-relaxed text-signal-body">
          {pattern.variables}
        </pre>
      </div>

      {/* Naive-miss note */}
      <div className="border-b border-signal-borderSubtle px-6 py-5">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-signal-secondary">
          What a naive score may miss
        </h3>
        <div className="rounded-signalSm border-l-2 border-signal-accentBorder bg-signal-accentSubtle px-4 py-3">
          <p className="text-sm leading-snug text-signal-body">{pattern.naive_miss_note}</p>
        </div>
      </div>

      {/* Linked wallets */}
      <div className="px-6 py-5">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-signal-secondary">
          Linked Wallets{" "}
          <span className="ml-1 rounded-full bg-signal-muted px-1.5 py-0.5 tabular-nums text-signal-secondary">
            {pattern.linked_wallet_count}
          </span>
        </h3>

        {pattern.linked_wallets.length === 0 ? (
          <p className="text-sm text-signal-faint">
            No linked wallets found in synthetic graph edges.
          </p>
        ) : (
          <div className="overflow-hidden rounded-signalSm border border-signal-borderSubtle">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-signal-borderSubtle bg-signal-muted">
                  <th className="px-3 py-2 text-left font-medium uppercase tracking-wide text-signal-secondary">Wallet ID</th>
                  <th className="px-3 py-2 text-right font-medium uppercase tracking-wide text-signal-secondary">Alerts</th>
                  <th className="px-3 py-2 text-right font-medium uppercase tracking-wide text-signal-secondary">Cases</th>
                  <th className="px-3 py-2 text-right font-medium text-signal-secondary"></th>
                </tr>
              </thead>
              <tbody>
                {pattern.linked_wallets.map((w) => (
                  <tr
                    key={w.wallet_id}
                    className="border-b border-signal-borderSubtle last:border-0 hover:bg-signal-bg"
                  >
                    <td className="px-3 py-2.5 font-mono text-signal-body">{w.wallet_id}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-signal-secondary">{w.linked_alert_count}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-signal-secondary">{w.linked_case_count}</td>
                    <td className="px-3 py-2.5 text-right">
                      <Link
                        href={`/wallet/${w.wallet_id}`}
                        className="font-medium text-signal-accent hover:text-signal-accentHover hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
