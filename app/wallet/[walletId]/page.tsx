import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { WalletSummaryPanel } from "@/components/wallet/WalletSummaryPanel";
import { DeviceSimPanel } from "@/components/wallet/DeviceSimPanel";
import { TransactionTimeline } from "@/components/wallet/TransactionTimeline";
import { MatchedPatternsPanel } from "@/components/wallet/MatchedPatternsPanel";
import { CaseHistoryPanel } from "@/components/wallet/CaseHistoryPanel";
import { WalletInvestigationHeader } from "@/components/wallet/WalletInvestigationHeader";
import { KeyEvidenceSummary } from "@/components/wallet/KeyEvidenceSummary";
import { WalletWorkspaceSection } from "@/components/wallet/WalletWorkspaceSection";
import { StickyInvestigationPanel } from "@/components/wallet/StickyInvestigationPanel";
import { getWalletProfile, type MatchedPatternDisplay, type EnrichedCase } from "@/lib/wallet-profile";
import { getPatternFamily } from "@/lib/scenario-utils";

interface WalletProfilePageProps {
  params: { walletId: string };
}

// ---------------------------------------------------------------------------
// Lightweight scenario-label derivation — uses already-computed walletProfile data
// ---------------------------------------------------------------------------
function deriveScenarioLabel(
  matchedPatterns: MatchedPatternDisplay[],
  cases: EnrichedCase[]
): { scenarioLabel: string; hasScenarioMatch: boolean } {
  // Tier 1: matched pattern family
  if (matchedPatterns && matchedPatterns.length > 0) {
    const family = getPatternFamily({
      pattern_id: matchedPatterns[0].pattern_id,
      name: matchedPatterns[0].name,
      cluster_type: matchedPatterns[0].cluster_type,
    });
    if (family === "Onboarding Mule Farm")
      return { scenarioLabel: "Onboarding Mule Farm", hasScenarioMatch: true };
    if (family === "Sleeper Mule Activation")
      return { scenarioLabel: "Sleeper Mule Activation", hasScenarioMatch: true };
    if (family === "APP Scam Cash-out")
      return { scenarioLabel: "APP Scam Cash-out Ring", hasScenarioMatch: true };
    if (family === "Endpoint Intelligence")
      return { scenarioLabel: "Endpoint Pattern", hasScenarioMatch: true };
  }

  // Tier 2: case_id prefix
  if (cases && cases.length > 0) {
    const caseId = cases[0].case_id;
    if (caseId.startsWith("CASE_MF"))
      return { scenarioLabel: "Onboarding Mule Farm", hasScenarioMatch: true };
    if (caseId.startsWith("CASE_SM"))
      return { scenarioLabel: "Sleeper Mule Activation", hasScenarioMatch: true };
    if (caseId.startsWith("CASE_APP"))
      return { scenarioLabel: "APP Scam Cash-out Ring", hasScenarioMatch: true };
  }

  // Tier 3: alert rule name
  if (cases && cases.length > 0) {
    for (const c of cases) {
      if (!c.alert) continue;
      const rule = c.alert.rule_name.toUpperCase();
      if (rule.includes("MULE_FARM"))
        return { scenarioLabel: "Onboarding Mule Farm", hasScenarioMatch: true };
      if (rule.includes("SLEEPER_MULE"))
        return { scenarioLabel: "Sleeper Mule Activation", hasScenarioMatch: true };
      if (rule.includes("APP_SCAM"))
        return { scenarioLabel: "APP Scam Cash-out Ring", hasScenarioMatch: true };
    }
  }

  return { scenarioLabel: "No scenario match", hasScenarioMatch: false };
}

export default function WalletProfilePage({ params }: WalletProfilePageProps) {
  const { walletId } = params;
  const profile = getWalletProfile(walletId);

  return (
    <AppShell>
      {/* Back link */}
      <Link
        href="/alerts"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-signal-secondary hover:text-signal-heading transition-colors"
      >
        ← Back to Alert Queue
      </Link>

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
        <>
          {/* Investigation header */}
          {(() => {
            const { scenarioLabel, hasScenarioMatch } = deriveScenarioLabel(
              profile.matchedPatterns,
              profile.cases
            );
            const primaryPatternName =
              profile.matchedPatterns.length > 0
                ? profile.matchedPatterns[0].name
                : undefined;
            return (
              <WalletInvestigationHeader
                walletId={profile.wallet.wallet_id}
                status={profile.wallet.status}
                balance={profile.wallet.balance}
                scenarioLabel={scenarioLabel}
                primaryPatternName={primaryPatternName}
                hasScenarioMatch={hasScenarioMatch}
              />
            );
          })()}

          {/* Key Evidence Summary */}
          <div className="mt-5">
            <KeyEvidenceSummary walletProfile={profile} />
          </div>

          {/* Two-column investigation workspace */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            {/* Main evidence column */}
            <div className="space-y-10">
              {/* Entity evidence */}
              <WalletWorkspaceSection
                title="Entity evidence"
                description="Identity, KYC, device, and SIM context for this wallet."
              >
                <WalletSummaryPanel data={profile} />
                <DeviceSimPanel
                  devices={profile.devices}
                  simBindings={profile.simBindings}
                />
              </WalletWorkspaceSection>

              {/* Behavioural evidence */}
              <WalletWorkspaceSection
                title="Behavioural evidence"
                description="Transaction sequence and analyst-curated pattern matches."
              >
                <TransactionTimeline transactions={profile.transactions} />
                <MatchedPatternsPanel patterns={profile.matchedPatterns} />
              </WalletWorkspaceSection>

              {/* Case history */}
              <WalletWorkspaceSection
                id="case-history"
                title="Case history"
                description="Linked investigation cases, decisions, notes, and closure-note workflow."
              >
                <CaseHistoryPanel cases={profile.cases} walletProfile={profile} />
              </WalletWorkspaceSection>
            </div>

            {/* Sticky right panel */}
            <StickyInvestigationPanel walletProfile={profile} />
          </div>
        </>
      )}
    </AppShell>
  );
}
