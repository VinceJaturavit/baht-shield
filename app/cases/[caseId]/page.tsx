import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getCaseDetail } from "@/lib/cases";
import { getWalletProfile } from "@/lib/wallet-profile";
import { CaseHeader } from "@/components/cases/CaseHeader";
import { CaseEvidencePanel } from "@/components/cases/CaseEvidencePanel";
import { CaseTimeline } from "@/components/cases/CaseTimeline";
import { CaseDetailCopilotPanel } from "@/components/cases/CaseDetailCopilotPanel";
import { ClosureNoteSection } from "@/components/cases/ClosureNoteSection";

interface PageProps {
  params: Promise<{ caseId: string }>;
}

export default async function CaseDetailPage({ params }: PageProps) {
  const { caseId } = await params;
  const caseDetail = getCaseDetail(caseId);

  if (!caseDetail) {
    return (
      <AppShell>
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-signal-ink">Case not found</h1>
        <p className="text-sm text-signal-secondary">
          {caseId} was not found in synthetic seed data.
        </p>
        <Link
          href="/cases"
          className="rounded-signalSm border border-signal-border bg-signal-surface px-4 py-2 text-sm font-medium text-signal-body hover:bg-signal-surfaceSubtle focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo"
        >
          ← Back to Cases
        </Link>
      </div>
      </AppShell>
    );
  }

  const walletProfile = caseDetail.wallet_id
    ? getWalletProfile(caseDetail.wallet_id)
    : null;

  return (
    <AppShell>
    <div>
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link
          href="/cases"
          className="text-xs text-signal-indigo hover:underline focus:outline-none focus-visible:underline"
        >
          ← Cases
        </Link>
      </div>

      {/* Header */}
      <CaseHeader caseDetail={caseDetail} />

      {/* Why-this-case */}
      <div className="mb-6 border-t border-signal-borderSubtle mt-4 pt-4">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-signal-meta">
          Why this case
        </p>
        <div className="rounded-signalSm border border-signal-indigoBorder bg-signal-indigoSubtle px-4 py-3">
          <p className="text-[11px] font-medium text-signal-secondary leading-relaxed">
            {caseDetail.why_this_case}
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          {/* Evidence / Linkage */}
          <CaseEvidencePanel caseDetail={caseDetail} />

          {/* Case Timeline */}
          <CaseTimeline notes={caseDetail.notes} />

          {/* Closure Note Builder */}
          <section id="closure-note">
            <div className="mb-2">
              <h2 className="text-sm font-semibold text-signal-ink">Structured closure note</h2>
              <p className="text-[11px] text-signal-secondary mt-0.5">
                Deterministic evidence-toggle builder. No persistence, no API, no LLM call.
              </p>
            </div>
            <ClosureNoteSection
              caseDetail={caseDetail}
              walletProfile={walletProfile}
            />
          </section>
        </div>

        {/* Sticky right column */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <CaseDetailCopilotPanel caseDetail={caseDetail} />
        </aside>
      </div>
    </div>
    </AppShell>
  );
}
