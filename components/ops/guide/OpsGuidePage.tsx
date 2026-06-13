import Link from "next/link";
import { OpsGuideSectionIndex } from "./OpsGuideSectionIndex";
import { OpsGuideSection, OpsGuideProse } from "./OpsGuideSection";
import { OPS_GUIDE_SECTIONS } from "./ops-guide-sections";

export function OpsGuidePage() {
  return (
    <div className="min-h-screen bg-ourox-obsidian">
      <main
        className="mx-auto max-w-[1280px] px-6 py-14 lg:py-20"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <OpsGuideSectionIndex />

          <div className="min-w-0 flex-1 space-y-16">
            <div className="border-b border-ourox-obsidianMid pb-10">
              <div className="mb-4">
                <img
                  src="/logos/ourox-ops-horizontal.svg"
                  alt="Ourox Ops"
                  height={36}
                  style={{ height: 36, width: "auto" }}
                />
              </div>
              <p
                className="mb-2 text-xs font-medium uppercase tracking-wider text-ourox-orange"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Ops Guide
              </p>
              <h1 className="mb-3 text-[26px] font-semibold leading-tight tracking-tight text-ourox-ink">
                How Ops works
              </h1>
              <p className="max-w-xl text-base leading-7 text-ourox-ink/60">
                A structured guide to fraud operations management: intake streams, queue
                priority, SLA and aging, roster coverage, fair KPIs, and how Ops connects to
                the rest of Ourox.
              </p>
              <p
                className="mt-4 text-xs text-ourox-ink/30 tracking-wide"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Synthetic data only&nbsp;&nbsp;·&nbsp;&nbsp;Public-safe
                documentation&nbsp;&nbsp;·&nbsp;&nbsp;Updated over time
              </p>
            </div>

            <OpsGuideSection
              id={OPS_GUIDE_SECTIONS[0].id}
              number={OPS_GUIDE_SECTIONS[0].number}
              title={OPS_GUIDE_SECTIONS[0].title}
            >
              <OpsGuideProse>
                <p>
                  Ops is the fraud operations management layer of Ourox. It starts after an
                  alert becomes a case and focuses on the work required to run the operation:
                  queues, ownership, SLA, evidence handling, escalation, quality control,
                  workload, and performance.
                </p>
                <p>
                  Detection can decide that something needs attention. Ops answers the
                  management question: who owns it, how urgent is it, what clock is running,
                  who is available to handle it, and what happens if it waits.
                </p>
              </OpsGuideProse>
            </OpsGuideSection>

            <OpsGuideSection
              id={OPS_GUIDE_SECTIONS[1].id}
              number={OPS_GUIDE_SECTIONS[1].number}
              title={OPS_GUIDE_SECTIONS[1].title}
            >
              <OpsGuideProse>
                <p>
                  Ops routes work through five intake streams. Each stream has a different
                  deadline character and escalation sensitivity.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">RFR</strong> — Regulatory
                  Fraud Reporting. Statutory or formal reporting work with the tightest
                  deadline character.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">LAR</strong> — Legal &amp;
                  Authority Requests. Authority or legal-response work with request-specific
                  deadlines and escalation sensitivity.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">PRO</strong> — Proactive
                  Alerts. Proactive fraud alerts where funds or exposure may still be moving.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">DSP</strong> — Dispute
                  &amp; Complaint. Customer dispute and complaint cases with update and
                  resolution expectations.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">PRF</strong> — Profile
                  Review. Profile or account review work with longer SLA and dashboard-managed
                  backlog.
                </p>
                <p>
                  Urgent is not a stream. It is a cross-stream priority overlay. An RFR near
                  deadline, an LAR with an explicit deadline, or a PRO case with funds still in
                  flight can be routed above normal queue order because the cost of delay is
                  higher.
                </p>
              </OpsGuideProse>
            </OpsGuideSection>

            <OpsGuideSection
              id={OPS_GUIDE_SECTIONS[2].id}
              number={OPS_GUIDE_SECTIONS[2].number}
              title={OPS_GUIDE_SECTIONS[2].title}
            >
              <OpsGuideProse>
                <p>
                  Ops queues are not FIFO. A fraud queue is ranked by cost of delay: priority
                  tier first, then SLA pressure. A fresh low-risk profile review should not sit
                  above an urgent funds-in-flight case just because it arrived earlier.
                </p>
                <p>
                  The Queue Board separates the Urgent overlay from standard stream queues,
                  then ranks cases by priority and time-to-deadline. Complex work, QA review,
                  and reopened cases appear as distinct queue types — but the same principle
                  applies: the next case is not always the oldest case; it is the case where
                  delay creates the most harm.
                </p>
              </OpsGuideProse>
            </OpsGuideSection>

            <OpsGuideSection
              id={OPS_GUIDE_SECTIONS[3].id}
              number={OPS_GUIDE_SECTIONS[3].number}
              title={OPS_GUIDE_SECTIONS[3].title}
            >
              <OpsGuideProse>
                <p>
                  SLA breach tells you the deadline has already been missed. Aging tells you
                  where damage is about to happen.
                </p>
                <p>
                  The Aging &amp; SLA screen uses percentage-of-SLA buckets instead of raw
                  hours. A case can be At-Risk whether its SLA is six hours or three days,
                  because the question is how much of its own clock has been consumed.
                </p>
                <p>
                  Fresh means 0–25% of SLA consumed. Mid means 25–75%. At-Risk means
                  75–100%, where the team can still act before breach. Breached means the
                  deadline is already missed.
                </p>
                <p>
                  Ops also separates work waiting on the team from work waiting on an external
                  party. Both need attention, but the management action is different: internal
                  waits require capacity and ownership; external waits require chasing,
                  documentation, and follow-up discipline.
                </p>
              </OpsGuideProse>
            </OpsGuideSection>

            <OpsGuideSection
              id={OPS_GUIDE_SECTIONS[4].id}
              number={OPS_GUIDE_SECTIONS[4].number}
              title={OPS_GUIDE_SECTIONS[4].title}
            >
              <OpsGuideProse>
                <p>
                  Ops separates decision-bearing work from structured intake. Fraud Analysts
                  hold decision authority for RFR, LAR, Urgent work, escalations, QA, and
                  final sign-off. Junior Analysts handle structured intake, evidence
                  preparation, and SOP-driven follow-up.
                </p>
                <p>
                  The Roster screen makes protected capacity visible. Fraud Analysts cannot be
                  fully consumed by routine intake because complex cases, escalations, QA, and
                  final decisions require available senior capacity.
                </p>
                <p>
                  Daily ownership assigns an owner and backup to each stream and to the Urgent
                  overlay. Ownership rotates so high-priority queues are planned, not randomly
                  picked up. Shift coverage shows whether every shift has decision authority
                  and intake coverage, and reminds the team that cases crossing a shift
                  boundary need explicit handoff.
                </p>
              </OpsGuideProse>
            </OpsGuideSection>

            <OpsGuideSection
              id={OPS_GUIDE_SECTIONS[5].id}
              number={OPS_GUIDE_SECTIONS[5].number}
              title={OPS_GUIDE_SECTIONS[5].title}
            >
              <OpsGuideProse>
                <p>
                  The KPI Board avoids a common operations mistake: ranking everyone by raw
                  cases closed. That punishes the hard, slow, high-stakes work and rewards only
                  speed.
                </p>
                <p>
                  Ourox Ops uses complexity-weighted productivity so RFR and LAR work count
                  differently from routine DSP or PRF intake. It also uses role-appropriate
                  metrics. Fraud Analysts are measured on weighted throughput, SLA compliance
                  on decision-bearing queues, QA quality, escalation accuracy, and decision
                  documentation. Junior Analysts are measured on intake throughput, intake SLA,
                  evidence completeness, SOP adherence, and hand-off quality.
                </p>
              </OpsGuideProse>
            </OpsGuideSection>

            <OpsGuideSection
              id={OPS_GUIDE_SECTIONS[6].id}
              number={OPS_GUIDE_SECTIONS[6].number}
              title={OPS_GUIDE_SECTIONS[6].title}
            >
              <OpsGuideProse>
                <p>
                  Ourox has three pillars. Arbiter demonstrates scoring and decisioning logic.
                  Verity demonstrates investigation and pattern intelligence. Ops demonstrates
                  how the fraud function is actually run after work becomes a case.
                </p>
                <p>
                  Together they show the lifecycle: scoring routes work, investigation explains
                  what is happening, and operations manages ownership, SLA, staffing, quality,
                  and performance. The loop closes when operational outcomes and investigation
                  patterns become structured input for better future detection and routing.
                </p>
              </OpsGuideProse>
            </OpsGuideSection>

            <OpsGuideSection
              id={OPS_GUIDE_SECTIONS[7].id}
              number={OPS_GUIDE_SECTIONS[7].number}
              title={OPS_GUIDE_SECTIONS[7].title}
            >
              <OpsGuideProse>
                <p>
                  Ourox Ops uses synthetic and illustrative operations data only. The cases,
                  queues, SLA clocks, roster, shift coverage, and KPI values are procedurally
                  generated to demonstrate fraud-operations management concepts.
                </p>
                <p>
                  No real customer data, employer data, or production queue data is used. The
                  goal is to make the operating model visible without exposing confidential
                  systems or real cases.
                </p>
              </OpsGuideProse>
            </OpsGuideSection>

            <div className="flex flex-wrap items-center gap-6 border-t border-ourox-obsidianMid pt-8">
              <Link
                href="/ops"
                className="text-sm text-ourox-orange/70 underline underline-offset-2 transition-colors hover:text-ourox-orange"
              >
                ← Back to Ops
              </Link>
              <Link
                href="/guide"
                className="text-sm text-ourox-ink/40 underline underline-offset-2 transition-colors hover:text-ourox-ink"
              >
                Ourox Guide
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
