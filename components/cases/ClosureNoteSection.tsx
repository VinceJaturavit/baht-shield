"use client";

import type { EnrichedCaseDetail } from "@/lib/types";
import type { WalletProfileData, EnrichedCase } from "@/lib/wallet-profile";
import { ClosureNoteBuilder } from "@/components/wallet/ClosureNoteBuilder";

interface ClosureNoteSectionProps {
  caseDetail: EnrichedCaseDetail;
  walletProfile: WalletProfileData | null;
}

export function ClosureNoteSection({ caseDetail, walletProfile }: ClosureNoteSectionProps) {
  if (!walletProfile) {
    return (
      <div className="rounded-signal border border-signal-borderSubtle bg-signal-surfaceSubtle px-5 py-6 text-sm text-signal-secondary">
        Closure note builder unavailable — linked wallet context is missing for this case.
      </div>
    );
  }

  // Bridge EnrichedCaseDetail → EnrichedCase (the shape ClosureNoteBuilder expects)
  const enrichedCase: EnrichedCase = {
    case_id: caseDetail.case_id,
    alert_id: caseDetail.alert_id,
    owner: caseDetail.owner,
    decision: caseDetail.decision,
    loss_amount: caseDetail.loss_amount,
    opened_at: caseDetail.opened_at,
    closed_at: caseDetail.closed_at,
    alert: caseDetail.linkedAlert,
    notes: caseDetail.notes,
  };

  return <ClosureNoteBuilder caseData={enrichedCase} walletProfile={walletProfile} />;
}
