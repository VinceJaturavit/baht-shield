import type { EnrichedTransaction } from "@/lib/wallet-profile";
import { EmptyState } from "./EmptyState";

interface TransactionTimelineProps {
  transactions: EnrichedTransaction[];
}

function formatTHB(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function TransactionTimeline({ transactions }: TransactionTimelineProps) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-signal-heading">
          Transaction Timeline — Sequence Order
        </h2>
        <p className="text-[13px] text-signal-secondary mt-0.5">
          Transactions are ordered by synthetic txn_id sequence. The seed data does not contain
          transaction timestamps.
        </p>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions found for this wallet in the synthetic seed data."
        />
      ) : (
        <div className="rounded-signal border border-signal-border bg-white shadow-signal overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[3rem_1fr_6rem_7rem_6rem_1fr_7rem] gap-x-3 px-4 py-2.5 bg-signal-muted border-b border-signal-border">
            <span className="text-[11px] font-medium text-signal-secondary uppercase tracking-wide">#</span>
            <span className="text-[11px] font-medium text-signal-secondary uppercase tracking-wide">Txn ID</span>
            <span className="text-[11px] font-medium text-signal-secondary uppercase tracking-wide">Direction</span>
            <span className="text-[11px] font-medium text-signal-secondary uppercase tracking-wide text-right">Amount</span>
            <span className="text-[11px] font-medium text-signal-secondary uppercase tracking-wide">Channel</span>
            <span className="text-[11px] font-medium text-signal-secondary uppercase tracking-wide">Beneficiary</span>
            <span className="text-[11px] font-medium text-signal-secondary uppercase tracking-wide">Device</span>
          </div>

          <div className="divide-y divide-signal-borderSubtle">
            {transactions.map((txn, idx) => {
              const isInbound = txn.direction === "inbound" || txn.txn_id.endsWith("_IN");
              return (
                <div
                  key={txn.txn_id}
                  className="grid grid-cols-[3rem_1fr_6rem_7rem_6rem_1fr_7rem] gap-x-3 px-4 py-3 hover:bg-signal-bg transition-colors"
                >
                  <span className="text-xs text-signal-faint tabular-nums">{idx + 1}</span>
                  <span className="text-xs font-mono text-signal-body truncate" title={txn.txn_id}>
                    {txn.txn_id}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-signal-body">
                    <span className={`inline-block h-1.5 w-1.5 rounded-full ${isInbound ? "bg-severity-low" : "bg-signal-accent"}`} />
                    {isInbound ? "In" : "Out"}
                  </span>
                  <span className="text-xs text-right tabular-nums font-medium text-signal-heading">
                    {formatTHB(txn.amount)}
                  </span>
                  <span className="text-xs text-signal-secondary">{txn.channel}</span>
                  <span className="text-xs text-signal-body truncate">
                    {txn.beneficiary ? (
                      <span title={`${txn.beneficiary.name} · ${txn.beneficiary.wallet_provider} · ${txn.beneficiary.country}`}>
                        {txn.beneficiary.name}
                        <span className="text-signal-faint ml-1">({txn.beneficiary.country})</span>
                      </span>
                    ) : (
                      <span className="text-signal-faint">{txn.beneficiary_id || "—"}</span>
                    )}
                  </span>
                  <span className="text-xs font-mono text-signal-faint truncate" title={txn.device_id}>
                    {txn.device_id || "—"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="px-4 py-2.5 bg-signal-muted border-t border-signal-borderSubtle">
            <p className="text-[11px] text-signal-secondary">
              {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} · ordered by txn_id sequence
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
