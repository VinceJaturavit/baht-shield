import type { WalletProfileData } from "@/lib/wallet-profile";

interface WalletSummaryPanelProps {
  data: WalletProfileData;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-signal-borderSubtle last:border-0">
      <span className="text-xs font-medium text-signal-secondary shrink-0 w-40">{label}</span>
      <span className="text-sm text-signal-heading text-right font-mono break-all">{value}</span>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  active: "border border-signal-border bg-white text-signal-body",
  suspended: "border border-signal-border bg-signal-muted text-severity-critical",
  closed: "border border-signal-border bg-signal-muted text-signal-secondary",
  frozen: "border border-signal-border bg-signal-muted text-signal-body",
};

export function WalletSummaryPanel({ data }: WalletSummaryPanelProps) {
  const { wallet, user, latestKycEvent } = data;
  const statusKey = (wallet.status ?? "").toLowerCase();
  const statusStyle =
    STATUS_STYLES[statusKey] ??
    "border border-signal-border bg-signal-muted text-signal-secondary";

  return (
    <section>
      <h2 className="text-lg font-semibold text-signal-heading mb-3">Wallet Summary</h2>
      <div className="rounded-signal border border-signal-border bg-white px-6 py-5 shadow-signal divide-y divide-signal-borderSubtle">
        {/* Wallet fields */}
        <div className="pb-3 mb-1">
          <p className="text-[11px] uppercase tracking-wide text-signal-faint mb-2">Wallet</p>
          <Row label="Wallet ID" value={wallet.wallet_id} />
          <Row
            label="Status"
            value={
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle}`}>
                {wallet.status}
              </span>
            }
          />
          <Row
            label="Balance"
            value={
              <span className="font-semibold">
                {new Intl.NumberFormat("th-TH", {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 2,
                }).format(wallet.balance)}
              </span>
            }
          />
          <Row label="Last Active" value={wallet.last_active_at ?? "—"} />
        </div>

        {/* User fields */}
        <div className="py-3">
          <p className="text-[11px] uppercase tracking-wide text-signal-faint mb-2 pt-1">User</p>
          <Row label="User ID" value={user?.user_id ?? <span className="text-signal-faint text-xs">Not available in seed data</span>} />
          <Row label="Country" value={user?.country ?? <span className="text-signal-faint text-xs">Not available in seed data</span>} />
          <Row label="Segment" value={user?.segment ?? <span className="text-signal-faint text-xs">Not available in seed data</span>} />
          <Row label="KYC Tier" value={user?.kyc_tier ?? <span className="text-signal-faint text-xs">Not available in seed data</span>} />
        </div>

        {/* KYC Event */}
        <div className="pt-3">
          <p className="text-[11px] uppercase tracking-wide text-signal-faint mb-2 pt-1">KYC Event</p>
          {latestKycEvent ? (
            <>
              <Row label="Decision" value={
                <span className={`inline-flex items-center rounded-full border border-signal-border px-2 py-0.5 text-xs font-medium ${
                  latestKycEvent.decision === "approved"
                    ? "bg-white text-signal-body"
                    : latestKycEvent.decision === "rejected"
                    ? "bg-signal-muted text-severity-critical"
                    : "bg-signal-muted text-signal-secondary"
                }`}>
                  {latestKycEvent.decision}
                </span>
              } />
              <Row label="Document Type" value={latestKycEvent.doc_type} />
              <Row
                label="Liveness Score"
                value={
                  <span className={latestKycEvent.liveness_score >= 0.8 ? "text-signal-body" : "text-severity-high"}>
                    {(latestKycEvent.liveness_score * 100).toFixed(0)}%
                  </span>
                }
              />
            </>
          ) : (
            <p className="text-xs text-signal-faint">Not available in seed data</p>
          )}
        </div>
      </div>
    </section>
  );
}
