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
                priority, SLA and aging, roster coverage, the people-management suite,
                fair performance signals, and how Ops connects to the rest of Ourox.
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
                  workload, staffing, and performance.
                </p>
                <p>
                  Detection can decide that something needs attention. Ops answers the
                  management question: who owns it, how urgent is it, what clock is running,
                  who is available to handle it, and what happens if it waits.
                </p>
                <p>
                  Phase 1.5 extends Ops beyond queue and SLA management into a people-management
                  suite: roster sub-views for coverage and assignment, separate fairness and
                  performance signals, QA and behavioural reads, and a Reviews workspace that
                  compacts those signals into a per-analyst pack for manager review.
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
                  The Roster area is no longer one long scroll. It is organised into focused
                  sub-views, each answering a different management question. A compact sub-nav
                  switches between them without leaving the Roster workspace.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">Roster</strong> shows who
                  is on the team and their role. Fraud Analysts hold decision authority for RFR,
                  LAR, Urgent work, escalations, QA, and final sign-off. Junior Analysts handle
                  structured intake, evidence preparation, and SOP-driven follow-up. Protected
                  capacity is visible: senior analysts cannot be fully consumed by routine intake
                  because complex cases, escalations, QA, and final decisions require available
                  decision authority.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">Daily Ownership</strong>{" "}
                  assigns an owner and backup to each stream and to the Urgent overlay. Ownership
                  rotates so high-priority queues are planned, not randomly picked up. Shift
                  coverage shows whether every shift has decision authority and intake coverage.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">Weekly Schedule</strong>,{" "}
                  <strong className="font-medium text-ourox-ink/85">Fairness</strong>,{" "}
                  <strong className="font-medium text-ourox-ink/85">Performance</strong>, and{" "}
                  <strong className="font-medium text-ourox-ink/85">QA</strong> are covered in
                  the sections below. Each is a read-only view built from the same synthetic
                  roster and schedule data.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">Reviews</strong> sits as a
                  separate top-level screen in the Ops side-nav, between Roster and KPI. It
                  compacts the people-management signals into a per-analyst review pack for
                  managers — described in the Reviews section.
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
                  The Weekly Schedule sub-view shows who is on shift each day and what queue
                  work they are assigned. Rows are people; columns are Monday through Sunday.
                  Each cell carries a compact shift code and queue tag — for example a day shift
                  on RFR, or OFF for a rest day.
                </p>
                <p>
                  Clicking a cell opens detail: the full shift label, assigned stream or task
                  type, and any handoff note. The view is designed for scanning a week at a
                  glance without horizontal scrolling.
                </p>
                <p>
                  A per-day coverage summary sits below the grid. It answers whether each day
                  has enough Fraud Analyst decision authority and Junior Analyst intake
                  coverage. Cases that cross a shift boundary need explicit handoff; the
                  schedule makes those boundaries visible so coverage gaps are caught before
                  they become SLA risk.
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
                  Fairness answers a rostering question, not a performance question: was hard
                  work distributed evenly within each role?
                </p>
                <p>
                  The Fairness sub-view measures weighted difficulty only. Each analyst&apos;s
                  weekly assigned-case complexity is summed from their schedule task tags, using
                  the same stream weights as the KPI layer — RFR and LAR count more than DSP or
                  PRF; Urgent and QA tasks add further weight. The result is compared role by
                  role: Fraud Analyst against Fraud Analyst, Junior Analyst against Junior
                  Analyst. Cross-role comparison would be misleading because the work itself
                  differs.
                </p>
                <p>
                  An analyst marked over-loaded is carrying disproportionately hard work for
                  their role peers. That is an equity signal for the manager, not evidence that
                  the analyst is under-performing. Conversely, under-loaded does not mean the
                  analyst is excelling — it may simply mean they were given lighter assignments.
                </p>
                <p>
                  Fairness is read-only. It flags imbalance; it does not reassign work. Volume,
                  throughput, and SLA-pickup behaviour are deliberately excluded from this
                  calculation and live in Performance and QA instead.
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
                  Performance answers a throughput question: how much work did the analyst get
                  through on what they were assigned?
                </p>
                <p>
                  The Performance sub-view shows two related figures side by side. Raw volume
                  is the count of cases handled — useful context, but dangerous on its own
                  because it rewards easy, fast work. Weighted throughput applies the same
                  complexity weights used in Fairness, so an analyst who closes fewer cases but
                  handles more RFR and LAR work can still show strong weighted throughput.
                </p>
                <p>
                  Role-appropriate extras sit alongside the headline figures. Fraud Analysts
                  are measured on decision-bearing throughput, SLA compliance on owned queues,
                  escalation accuracy, and decision documentation. Junior Analysts are measured on
                  intake throughput, intake SLA, evidence completeness, SOP adherence, and
                  hand-off quality.
                </p>
                <p>
                  Performance is not a cases-closed leaderboard. High raw volume of easy work
                  is not the same as high weighted throughput on hard work.
                </p>
              </OpsGuideProse>
            </OpsGuideSection>

            <OpsGuideSection
              id={OPS_GUIDE_SECTIONS[8].id}
              number={OPS_GUIDE_SECTIONS[8].number}
              title={OPS_GUIDE_SECTIONS[8].title}
            >
              <OpsGuideProse>
                <p>
                  QA and behaviour are related but distinct management reads. Both appear in the
                  QA sub-view and are kept separate from fairness and throughput.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">Quality</strong> is based on
                  sampled case review. Each analyst has a QA score derived from pass and fail
                  samples, with defect categories when a sample fails. A fast analyst with poor
                  quality is a risk, not a star. When the sample size is small, the read is
                  marked provisional rather than treated as conclusive.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">Behaviour</strong> is a
                  separate signal: SLA-pickup. It measures whether an analyst takes their
                  share of urgent and tight-SLA cases, or leaves that pressure to others.
                  Avoidance is a coaching signal, not a throughput penalty. Taking more than a
                  fair share of urgent work is a positive reliability signal. Behaviour is
                  compared to a role-expected share, not to a team-wide cases-closed count.
                </p>
                <p>
                  Neither quality nor SLA-pickup belongs inside the fairness calculation. Fairness
                  measures what work was assigned; QA measures whether that work was done
                  correctly and whether the analyst stepped up when urgency demanded it.
                </p>
              </OpsGuideProse>
            </OpsGuideSection>

            <OpsGuideSection
              id={OPS_GUIDE_SECTIONS[9].id}
              number={OPS_GUIDE_SECTIONS[9].number}
              title={OPS_GUIDE_SECTIONS[9].title}
            >
              <OpsGuideProse>
                <p>
                  The people-management suite is built on a four-signals principle. Fairness,
                  performance, quality, and behaviour are kept distinct — never blended into a
                  single cases-closed rank or one composite score.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">Fairness</strong> — was
                  hard work distributed evenly within the role? Set by rostering; not a measure
                  of analyst skill.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">Performance</strong> — how
                  much work did the analyst get through, weighted for complexity? Reflects
                  throughput on assigned work.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">Quality</strong> — was the
                  work done correctly? Based on QA sampling and defect patterns.
                </p>
                <p>
                  <strong className="font-medium text-ourox-ink/85">Behaviour</strong> — does the
                  analyst take their share of urgent and tight-SLA work? A distinct behavioural
                  signal, separate from both quality and volume.
                </p>
                <p>
                  A second separation runs through all four signals: what the analyst controls
                  versus what rostering controls. Quality, behaviour, and throughput on
                  assigned work reflect on the analyst. How much hard work they were given
                  reflects on the manager and the roster — it belongs in fairness and workload
                  context, not in a performance penalty.
                </p>
                <p>
                  The KPI Board at the team level and the Roster sub-views at the individual
                  level both follow this principle. Reviews compacts the same separation into a
                  per-analyst pack.
                </p>
              </OpsGuideProse>
            </OpsGuideSection>

            <OpsGuideSection
              id={OPS_GUIDE_SECTIONS[10].id}
              number={OPS_GUIDE_SECTIONS[10].number}
              title={OPS_GUIDE_SECTIONS[10].title}
            >
              <OpsGuideProse>
                <p>
                  Reviews is where a fraud-ops manager prepares an individual review. The
                  landing screen lists every analyst grouped by role — Fraud Analyst and Junior
                  Analyst — with a headline read and an option to open the full pack.
                </p>
                <p>
                  The per-analyst review pack assembles five signal sections in one place:
                  Workload (the fairness distribution fact), Performance (raw volume and
                  weighted throughput), Quality (QA score and sample detail), Behaviour
                  (SLA-pickup share versus role-expected), and Reliability (attendance, leave,
                  handoffs, and assigned days as context). Each section stands alone; there is
                  no collapsed composite score.
                </p>
                <p>
                  A mock AI copilot generates a deterministic review draft from the same
                  structured data. It follows an embedded fairness rubric that instructs the
                  model to assess each dimension separately, compare within role only, separate
                  analyst-controlled signals from rostering-controlled workload, and mark thin
                  samples as provisional. The rubric is visible in the UI so the reasoning is
                  inspectable, not hidden.
                </p>
                <p>
                  The copilot output is decision-support, not a verdict. It produces a short
                  scorecard, a disposition label, and one or two concrete manager actions — then
                  closes with an explicit human-in-the-loop line: the manager makes the final
                  call. A live API integration is on the roadmap; the current build uses a
                  deterministic generator with no external model call.
                </p>
              </OpsGuideProse>
            </OpsGuideSection>

            <OpsGuideSection
              id={OPS_GUIDE_SECTIONS[11].id}
              number={OPS_GUIDE_SECTIONS[11].number}
              title={OPS_GUIDE_SECTIONS[11].title}
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
              id={OPS_GUIDE_SECTIONS[12].id}
              number={OPS_GUIDE_SECTIONS[12].number}
              title={OPS_GUIDE_SECTIONS[12].title}
            >
              <OpsGuideProse>
                <p>
                  Ourox Ops uses synthetic and illustrative operations data only. The cases,
                  queues, SLA clocks, roster, shift coverage, fairness reads, performance
                  figures, QA samples, and review drafts are procedurally generated to
                  demonstrate fraud-operations management concepts.
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
