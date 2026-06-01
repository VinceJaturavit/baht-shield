import type { WalletProfileData } from "@/lib/wallet-profile";
import { AICopilotPanel } from "./AICopilotPanel";
import { CompactClosureEntry } from "./CompactClosureEntry";

interface StickyInvestigationPanelProps {
  walletProfile: WalletProfileData;
}

export function StickyInvestigationPanel({ walletProfile }: StickyInvestigationPanelProps) {
  const hasLinkedCases = walletProfile.cases.length > 0;

  return (
    <div className="space-y-4 xl:sticky xl:top-24 xl:self-start">
      <AICopilotPanel walletProfile={walletProfile} />
      <CompactClosureEntry hasLinkedCases={hasLinkedCases} />
    </div>
  );
}
