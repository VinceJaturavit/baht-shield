import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { WalletSummaryPanel } from "@/components/wallet/WalletSummaryPanel";
import { DeviceSimPanel } from "@/components/wallet/DeviceSimPanel";
import { TransactionTimeline } from "@/components/wallet/TransactionTimeline";
import { MatchedPatternsPanel } from "@/components/wallet/MatchedPatternsPanel";
import { CaseHistoryPanel } from "@/components/wallet/CaseHistoryPanel";
import { AICopilotPanel } from "@/components/wallet/AICopilotPanel";
import { getWalletProfile } from "@/lib/wallet-profile";

interface WalletProfilePageProps {
  params: { walletId: string };
}

export default function WalletProfilePage({ params }: WalletProfilePageProps) {
  const { walletId } = params;
  const profile = getWalletProfile(walletId);

  return (
    <AppShell>
      <div className="max-w-5xl">
        {/* Back link */}
        <Link
          href="/alerts"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-signal-secondary hover:text-signal-heading transition-colors"
        >
          ← Back to Alert Queue
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-signal-heading">Wallet Profile</h1>
          <p className="text-[15px] text-signal-secondary mt-2">
            Investigation view for synthetic wallet{" "}
            <span className="font-mono font-semibold text-signal-accent">{walletId}</span>
          </p>
        </div>

        {/* Not found */}
        {!profile ? (
          <div className="rounded-signal border border-dashed border-signal-border bg-white p-8 text-center">
            <p className="text-sm font-medium text-signal-body">
              Wallet not found in synthetic seed data.
            </p>
            <p className="mt-1 text-xs text-signal-faint font-mono">{walletId}</p>
            <Link
              href="/alerts"
              className="mt-4 inline-flex items-center gap-1 text-sm text-signal-accent hover:underline"
            >
              ← Back to Alert Queue
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 1. Wallet Summary */}
            <WalletSummaryPanel data={profile} />

            {/* 2. Device + SIM */}
            <DeviceSimPanel
              devices={profile.devices}
              simBindings={profile.simBindings}
            />

            {/* 3. Transaction Timeline */}
            <TransactionTimeline transactions={profile.transactions} />

            {/* 4. Matched Analyst Patterns — most important panel */}
            <MatchedPatternsPanel patterns={profile.matchedPatterns} />

            {/* 5. AI Copilot — deterministic, synthetic demo */}
            <AICopilotPanel walletProfile={profile} />

            {/* 6. Case History */}
            <CaseHistoryPanel cases={profile.cases} walletProfile={profile} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
