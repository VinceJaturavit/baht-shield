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
          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full table-fixed">
              <colgroup>
                <col className="w-[88px]" />
                <col className="w-[110px]" />
                <col className="w-[120px]" />
                <col className="w-[190px]" />
                <col className="w-[260px]" />
                <col className="w-[150px]" />
              </colgroup>
              <thead>
                <tr className="border-b border-signal-border bg-signal-muted">
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-signal-secondary uppercase tracking-wide">
                    #
                  </th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-medium text-signal-secondary uppercase tracking-wide">
                    Direction
                  </th>
                  <th className="px-3 py-2.5 text-right text-[11px] font-medium text-signal-secondary uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-medium text-signal-secondary uppercase tracking-wide">
                    Channel
                  </th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-medium text-signal-secondary uppercase tracking-wide">
                    Beneficiary
                  </th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-medium text-signal-secondary uppercase tracking-wide">
                    Device
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-signal-borderSubtle">
                {transactions.map((txn, idx) => {
                  const isInbound = txn.direction === "inbound" || txn.txn_id.endsWith("_IN");
                  const beneficiaryLabel = txn.beneficiary
                    ? `${txn.beneficiary.name} · ${txn.beneficiary.wallet_provider} · ${txn.beneficiary.country}`
                    : (txn.beneficiary_id || "—");

                  return (
                    <tr
                      key={txn.txn_id}
                      className="hover:bg-signal-bg transition-colors"
                    >
                      {/* Sequence */}
                      <td className="px-4 py-3 text-xs text-signal-faint tabular-nums">
                        <span
                          className="block truncate font-mono"
                          title={txn.txn_id}
                        >
                          {idx + 1}
                        </span>
                      </td>

                      {/* Direction */}
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-signal-body">
                          <span
                            className={`inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                              isInbound ? "bg-severity-low" : "bg-signal-accent"
                            }`}
                          />
                          {isInbound ? "In" : "Out"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-3 py-3 text-right text-xs tabular-nums font-medium text-signal-heading">
                        {formatTHB(txn.amount)}
                      </td>

                      {/* Channel */}
                      <td
                        className="px-3 py-3 text-xs text-signal-secondary truncate max-w-0"
                        title={txn.channel}
                      >
                        {txn.channel}
                      </td>

                      {/* Beneficiary */}
                      <td
                        className="px-3 py-3 text-xs text-signal-body truncate max-w-0"
                        title={beneficiaryLabel}
                      >
                        {txn.beneficiary ? (
                          <>
                            {txn.beneficiary.name}
                            <span className="text-signal-faint ml-1">
                              ({txn.beneficiary.country})
                            </span>
                          </>
                        ) : (
                          <span className="text-signal-faint">
                            {txn.beneficiary_id || "—"}
                          </span>
                        )}
                      </td>

                      {/* Device */}
                      <td
                        className="px-3 py-3 text-xs font-mono text-signal-faint truncate max-w-0"
                        title={txn.device_id || "—"}
                      >
                        {txn.device_id || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
