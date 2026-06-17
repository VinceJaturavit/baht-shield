// Ourox Guide — /guide (Spec-022, Spec-004, Verity-Spec-P3-002)
// Comprehensive reviewer overview: calm enterprise document, anchor-friendly.
// No marketing splash. No animation. No decorative illustrations.

"use client";

import { useState } from "react";
import Link from "next/link";
import { OuroxShell } from "@/components/ourox/OuroxShell";
import { TRACING_METHODOLOGY_GUIDE_ANCHOR } from "@/lib/verity/onchain-methodology-copy";

interface Section {
  id: string;
  number: string;
  title: string;
}

const SECTIONS: Section[] = [
  { id: "reviewer-overview", number: "—", title: "Reviewer overview" },
  { id: "what-ourox-is", number: "1", title: "What Ourox is" },
  { id: "lifecycle-loop", number: "2", title: "Lifecycle loop" },
  { id: "arbiter", number: "3", title: "Arbiter" },
  { id: "verity", number: "4", title: "Verity" },
  { id: "agentic-investigation", number: "5", title: "Agentic investigation" },
  { id: "on-chain-tracing-methodology", number: "5a", title: "On-chain tracing methodology" },
  { id: "ops", number: "6", title: "Ops" },
  { id: "ai-philosophy", number: "7", title: "AI philosophy" },
  { id: "synthetic-boundary", number: "8", title: "Synthetic boundary" },
  { id: "where-to-click", number: "9", title: "Where to click" },
  { id: "typologies", number: "10", title: "Typologies demonstrated" },
  { id: "technical-architecture", number: "11", title: "Technical architecture" },
  { id: "roadmap", number: "12", title: "Roadmap" },
];

function SectionHeading({
  id,
  number,
  title,
}: {
  id: string;
  number: string;
  title: string;
}) {
  return (
    <h2
      id={id}
      className="mb-5 flex items-baseline gap-3 text-xl font-semibold tracking-tight text-ourox-ink scroll-mt-24"
    >
      <span
        className="shrink-0 font-mono text-sm font-normal text-ourox-orange"
        aria-hidden="true"
      >
        {number}
      </span>
      {title}
    </h2>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 text-sm leading-7 text-ourox-ink/70">{children}</div>
  );
}

function FeatureItem({ name, description }: { name: string; description: string }) {
  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/50 px-5 py-4">
      <div className="mb-1 text-sm font-semibold text-ourox-ink">{name}</div>
      <p className="text-sm leading-6 text-ourox-ink/60">{description}</p>
    </div>
  );
}

function ArchitectureExpander({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-ourox-ink">{title}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`shrink-0 text-ourox-ink/50 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M8 10.707l-4.354-4.353a1 1 0 00-1.414 1.414l5.061 5.061a1 1 0 001.414 0l5.061-5.06a1 1 0 00-1.414-1.415L8 10.707z" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-ourox-obsidianMid px-5 pb-5 pt-4">
          <div className="space-y-4 text-sm leading-7 text-ourox-ink/70">{children}</div>
        </div>
      )}
    </div>
  );
}

function RoadmapBand({
  phase,
  items,
}: {
  phase: "Current" | "Next" | "Later";
  items: string[];
}) {
  const accent =
    phase === "Current"
      ? "border-emerald-700/50 text-emerald-400"
      : phase === "Next"
      ? "border-ourox-orange/50 text-ourox-orange"
      : "border-ourox-obsidianMid text-ourox-ink/40";

  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 p-5">
      <div className={`mb-3 text-xs font-semibold uppercase tracking-wider ${accent}`}>
        {phase}
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-ourox-ink/70">
            <span
              className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-ourox-ink/30"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function GuidePage() {
  return (
    <OuroxShell currentProduct="Guide">
      <main
        className="mx-auto max-w-[1280px] px-6 py-14 lg:py-20"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Sidebar — section index (sticky on desktop) */}
          <aside className="shrink-0 lg:w-52 lg:sticky lg:top-8 lg:self-start">
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-wider text-ourox-ink/40"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              Ourox Guide
            </p>
            <nav aria-label="Guide sections">
              <ol className="space-y-1">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex items-baseline gap-2 rounded px-2 py-1 text-xs text-ourox-ink/50 transition-colors hover:bg-ourox-obsidianMid hover:text-ourox-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange"
                    >
                      <span className="shrink-0 font-mono text-ourox-orange/60">{s.number}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-6 border-t border-ourox-obsidianMid pt-5">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs text-ourox-ink/40 transition-colors hover:text-ourox-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange rounded"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M11.5 7h-9M6.5 10.5 3 7l3.5-3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back to Ourox
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1 space-y-16">
            {/* Page header */}
            <div className="border-b border-ourox-obsidianMid pb-10">
              <p
                className="mb-2 text-xs font-medium uppercase tracking-wider text-ourox-orange"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Ourox Guide
              </p>
              <h1 className="mb-3 text-[26px] font-semibold leading-tight tracking-tight text-ourox-ink">
                Ourox reviewer guide
              </h1>
              <p className="max-w-xl text-base leading-7 text-ourox-ink/60">
                A plain-language overview of the Ourox platform for recruiters, hiring
                managers, and fraud or risk reviewers. Synthetic data only.
              </p>
              <p
                className="mt-4 text-xs text-ourox-ink/30 tracking-wide"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Synthetic data only&nbsp;&nbsp;·&nbsp;&nbsp;Learning and portfolio
                platform&nbsp;&nbsp;·&nbsp;&nbsp;Updated over time
              </p>
            </div>

            {/* Reviewer overview */}
            <section aria-labelledby="reviewer-overview">
              <SectionHeading id="reviewer-overview" number="—" title="Reviewer overview" />
              <Prose>
                <p>
                  Ourox is a synthetic fraud-tech portfolio platform that demonstrates the
                  fraud lifecycle end to end: scoring and decisioning, investigation and
                  pattern intelligence, and operations management.
                </p>
                <p>
                  Ourox is built to show how fraud product, investigation, and operations
                  thinking connect. It does not use real customer data or production systems.
                  The goal is to make a full fraud lifecycle visible: risk signals are scored,
                  cases are investigated, operations teams manage workload and decisions, and
                  confirmed outcomes feed back into the system.
                </p>
                <p>
                  This guide is the starting point. Use the section index to jump to each
                  pillar, the agentic investigation route, the AI philosophy, and a short
                  map of where to click.
                </p>
              </Prose>
            </section>

            {/* What Ourox is */}
            <section aria-labelledby="what-ourox-is">
              <SectionHeading id="what-ourox-is" number="1" title="What Ourox is" />
              <Prose>
                <p>
                  Ourox is a synthetic fraud-tech learning and portfolio platform. It
                  demonstrates how fraud investigation, analyst-curated pattern intelligence,
                  risk scoring, rules, and decisioning can connect into one operating loop.
                </p>
                <p>
                  The thesis is simple: fraud teams should not treat analyst judgment as a
                  loose note at the end of an investigation. Pattern intelligence can become
                  structured input back into scoring and decisioning. Ops demonstrates how the
                  fraud function is run after work becomes a case. Verity demonstrates the
                  investigation layer. Arbiter demonstrates the scoring and tuning layer.
                </p>
                <p>
                  All data is synthetic and illustrative. Ourox is not a production fraud
                  system and does not use real customer or employer data.
                </p>
              </Prose>
            </section>

            {/* Lifecycle loop */}
            <section aria-labelledby="lifecycle-loop">
              <SectionHeading id="lifecycle-loop" number="2" title="Lifecycle loop" />
              <Prose>
                <p>
                  Ourox has three pillars. Arbiter is the scoring and decisioning sandbox.
                  Verity is the investigation and pattern-intelligence layer. Ops is the
                  fraud-operations management layer. They are designed to be explored together,
                  but each is usable independently.
                </p>
                <p>
                  Arbiter scores and routes work. Verity investigates and explains the case.
                  Ops runs the queues, staffing, SLA, QA, and review process. Confirmed outcomes
                  feed back into patterns and decisioning.
                </p>
                <p>
                  The loop matters because fraud systems improve when investigation outcomes
                  and operator feedback return to detection and decisioning.
                </p>
              </Prose>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-base font-semibold text-ourox-ink">Arbiter</span>
                    <span
                      className="text-xs text-ourox-ink/40 tracking-wide"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      Scoring &amp; decisioning
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-ourox-ink/60">
                    Synthetic transaction signals become features, scores, rules, decisions,
                    and feedback in a transparent sandbox.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/arbiter"
                      className="text-xs text-ourox-orange/70 underline underline-offset-2 hover:text-ourox-orange transition-colors"
                    >
                      Open Arbiter
                    </Link>
                  </div>
                </div>
                <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-base font-semibold text-ourox-ink">Verity</span>
                    <span
                      className="text-xs text-ourox-ink/40 tracking-wide"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      Investigation &amp; patterns
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-ourox-ink/60">
                    Analysts triage alerts, review evidence, work cases, and capture recurring
                    fraud patterns that scoring alone may miss.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/verity"
                      className="text-xs text-ourox-orange/70 underline underline-offset-2 hover:text-ourox-orange transition-colors"
                    >
                      Open Verity
                    </Link>
                  </div>
                </div>
                <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-base font-semibold text-ourox-ink">Ops</span>
                    <span
                      className="text-xs text-ourox-ink/40 tracking-wide"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      Operations management
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-ourox-ink/60">
                    Queues, priority, SLA, aging, roster coverage, and fair performance
                    signals after an alert becomes a case.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/ops"
                      className="text-xs text-ourox-orange/70 underline underline-offset-2 hover:text-ourox-orange transition-colors"
                    >
                      Open Ops
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 px-5 py-5">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium text-ourox-ink">Arbiter</span>
                  <span className="text-xs text-ourox-ink/40">scoring &amp; decisioning</span>
                  <svg
                    width="20"
                    height="14"
                    viewBox="0 0 20 14"
                    fill="none"
                    aria-hidden="true"
                    className="mx-1"
                  >
                    <path
                      d="M2 7h16M12 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-ourox-orange/50"
                    />
                  </svg>
                  <span className="font-medium text-ourox-ink">Verity</span>
                  <span className="text-xs text-ourox-ink/40">investigation &amp; patterns</span>
                  <svg
                    width="20"
                    height="14"
                    viewBox="0 0 20 14"
                    fill="none"
                    aria-hidden="true"
                    className="mx-1"
                  >
                    <path
                      d="M2 7h16M12 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-ourox-orange/50"
                    />
                  </svg>
                  <span className="font-medium text-ourox-ink">Ops</span>
                  <span className="text-xs text-ourox-ink/40">operations &amp; performance</span>
                  <svg
                    width="20"
                    height="14"
                    viewBox="0 0 20 14"
                    fill="none"
                    aria-hidden="true"
                    className="mx-1"
                  >
                    <path
                      d="M2 7h16M12 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-ourox-orange/50"
                    />
                  </svg>
                  <span className="font-medium text-ourox-ink">next detection cycle</span>
                </div>
              </div>
            </section>

            {/* Arbiter */}
            <section aria-labelledby="arbiter">
              <SectionHeading id="arbiter" number="3" title="Arbiter" />
              <Prose>
                <p>
                  Arbiter is the scoring and decisioning sandbox. It shows how synthetic
                  transaction signals become features, scores, rules, decisions, and feedback.
                  The important design choice is transparency: the system exposes weighted
                  features, rule triggers, threshold tuning, and disagreement between rules
                  and model output rather than hiding decisions behind a black box.
                </p>
                <p>
                  Key surfaces include a transparent weighted scoring explorer, a rules engine
                  with visible precedence, threshold tuning with precision and recall tradeoffs,
                  an ML second-opinion view that compares model output to hand weights, and a
                  feedback and disagreement view for learning from misses.
                </p>
              </Prose>

              <div className="mt-6 space-y-5">
                <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 px-5 py-5">
                  <div className="mb-3 text-sm font-semibold text-ourox-ink">
                    Six-stage pipeline
                  </div>
                  <div className="mb-3 flex flex-wrap items-center gap-1.5">
                    {[
                      "signals",
                      "features",
                      "score",
                      "rules",
                      "decision",
                      "feedback",
                    ].map((stage, i, arr) => (
                      <span key={stage} className="flex items-center gap-1.5">
                        <span
                          className="rounded border border-ourox-obsidianMid bg-ourox-obsidianMid px-2.5 py-1 font-mono text-xs text-ourox-ink/70"
                          style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                          {stage}
                        </span>
                        {i < arr.length - 1 && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M2 5h6M6 2.5 8.5 5 6 7.5"
                              stroke="currentColor"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-ourox-ink/30"
                            />
                          </svg>
                        )}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-ourox-ink/60">
                    A synthetic transaction event becomes engineered features, a transparent
                    weighted score, rule evaluation, and a final decision.
                  </p>
                </div>

                <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 px-5 py-5">
                  <div className="mb-2 text-sm font-semibold text-ourox-ink">
                    Tuning and model views
                  </div>
                  <p className="text-sm leading-6 text-ourox-ink/60">
                    The Tuning workspace shows the fraud-strategy tradeoff: move a threshold
                    or feature weight, then watch precision, recall, false-positive rate, and
                    review volume change. The Model view shows an offline-trained logistic
                    regression score alongside the transparent rule-weighted score, with
                    disagreement cases highlighted. The rule engine remains authoritative; ML
                    is a learning-grade second opinion on synthetic data.
                  </p>
                </div>
              </div>
            </section>

            {/* Verity */}
            <section aria-labelledby="verity">
              <SectionHeading id="verity" number="4" title="Verity" />
              <Prose>
                <p>
                  Verity is the investigation and pattern-intelligence layer. It helps a
                  reviewer move from an alert to a structured view of entities, relationships,
                  evidence, and recurring patterns. The pattern library represents
                  analyst-curated intelligence: the part of fraud operations where investigators
                  capture the behaviours that scoring alone may miss.
                </p>
                <p>
                  Verity is organized around the workflow of a fraud analyst: see what needs
                  attention, investigate the evidence, build a case, close with a structured
                  note, and feed patterns back into shared intelligence. Synthetic scenarios
                  (Onboarding Mule Farm, Sleeper Mule Activation, APP Scam Cash-out Ring)
                  demonstrate distinct typologies with procedurally generated alerts, cases,
                  and entities.
                </p>
              </Prose>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <FeatureItem
                  name="Dashboard"
                  description="Fraud-ops overview: workload, scenario distribution, trend visibility, and operating posture."
                />
                <FeatureItem
                  name="Alert Queue"
                  description="Triage by scenario, severity, and case context; shows how investigation work enters the analyst queue."
                />
                <FeatureItem
                  name="Cases"
                  description="Investigation workflow and closure-note builder; structured case handling and evidence capture."
                />
                <FeatureItem
                  name="Wallets / Entities"
                  description="Wallet profile, evidence summary, and copilot context with human-in-the-loop framing."
                />
                <FeatureItem
                  name="Pattern Intelligence"
                  description="Analyst-curated pattern library, matched variables, and examples of what a naive score may miss."
                />
                <FeatureItem
                  name="Analytics"
                  description="Portfolio-level fraud insight across scenarios, outcomes, and operational signals."
                />
              </div>
            </section>

            {/* Agentic investigation */}
            <section aria-labelledby="agentic-investigation">
              <SectionHeading
                id="agentic-investigation"
                number="5"
                title="Agentic investigation"
              />
              <Prose>
                <p>
                  The Agentic Investigation route demonstrates governed agentic AI for fraud
                  investigation. It runs a case through four human-gated stages: intake and
                  scoping, evidence assembly, decision draft, and action proposal. The agent
                  does not make the decision. It assembles evidence, cites its findings,
                  proposes a judgment, and records each human approval, denial, or edit in an
                  audit trail.
                </p>
                <p>
                  The flow is Intake, Investigate, Decide, Action. Evidence chains are
                  deterministic and exam-ready. The route is decision-support, not verdict: no
                  autonomous material action. A live API integration is documented as a future
                  roadmap item; the current implementation uses mock, deterministic outputs on
                  synthetic seed cases.
                </p>
                <p>
                  AI compresses the work around a decision, not the decision itself.
                </p>
                <p>
                  <Link
                    href="/verity/agent"
                    className="text-ourox-orange/70 underline underline-offset-2 hover:text-ourox-orange transition-colors"
                  >
                    Open Agentic Investigation
                  </Link>
                </p>
              </Prose>
            </section>

            {/* On-chain tracing methodology */}
            <section aria-labelledby="on-chain-tracing-methodology">
              <SectionHeading
                id={TRACING_METHODOLOGY_GUIDE_ANCHOR.id}
                number="5a"
                title={TRACING_METHODOLOGY_GUIDE_ANCHOR.title}
              />
              <Prose>
                <p>{TRACING_METHODOLOGY_GUIDE_ANCHOR.summary}</p>
                <p>
                  Run{" "}
                  <Link
                    href="/verity/agent"
                    className="text-ourox-orange/70 underline underline-offset-2 hover:text-ourox-orange transition-colors"
                  >
                    Agentic Investigation
                  </Link>
                  , open the Investigate stage on an APP Scam case, and expand{" "}
                  <strong className="font-medium text-ourox-ink/80">
                    Tracing methodology
                  </strong>{" "}
                  in the on-chain trace area for the full guide: forward vs backward
                  tracing, co-mingling, FIFO/LIFO/LIBR/pro-rata, UTXO vs account-based
                  chains, VASP recovery endpoints, and the freeze → seize → restitution
                  pathway.
                </p>
              </Prose>
            </section>

            {/* Ops */}
            <section aria-labelledby="ops">
              <SectionHeading id="ops" number="6" title="Ops" />
              <Prose>
                <p>
                  Ops is the fraud-operations management layer. It shows what happens after
                  alerts become work: queues, SLA clocks, ownership, staffing, handoffs, QA,
                  performance review, and management reporting. It deliberately avoids a simple
                  cases-closed ranking. Instead, it separates fairness, throughput, quality,
                  and behaviour so a manager can review analysts without flattening complex work
                  into one number.
                </p>
                <p>
                  Five intake streams (RFR, DSP, LAR, PRO, PRF) feed non-FIFO priority queues
                  with SLA and aging views. Roster covers daily ownership, weekly schedule,
                  protected capacity, and shift coverage. Fairness uses complexity-weighted KPIs.
                  The four-signals people-management model separates fairness, performance,
                  quality, and behaviour. Reviews compacts those signals into a per-analyst pack
                  with a mock copilot for decision-support review drafting. An impact-tier overlay
                  on the Queue Board helps triage by severity and exposure.
                </p>
                <p>
                  <Link
                    href="/ops/guide"
                    className="text-ourox-orange/70 underline underline-offset-2 hover:text-ourox-orange transition-colors"
                  >
                    Read the Ops guide
                  </Link>
                </p>
              </Prose>
            </section>

            {/* AI philosophy */}
            <section aria-labelledby="ai-philosophy">
              <SectionHeading id="ai-philosophy" number="7" title="AI philosophy" />
              <Prose>
                <p>
                  The AI design philosophy is intentionally conservative. Ourox uses AI-style
                  workflows to assemble evidence, compare patterns, draft summaries, and prepare
                  decisions, but the human owns the decision. The controls are similar to what a
                  manager would expect from a junior analyst: scoped tasks, cited evidence, review
                  gates, editability, and an audit trail.
                </p>
                <p>
                  AI compresses the work around a decision, not the decision itself. Human
                  approval is required at every gate in the agentic investigation flow. Design
                  choices favour deterministic, explainable outputs over opaque automation. No
                  autonomous material action is implemented. Audit trails record what the system
                  proposed and what the human approved, denied, or edited.
                </p>
              </Prose>
            </section>

            {/* Synthetic boundary */}
            <section aria-labelledby="synthetic-boundary">
              <SectionHeading id="synthetic-boundary" number="8" title="Synthetic boundary" />
              <Prose>
                <p>
                  Ourox uses synthetic data only. The alerts, cases, entities, patterns,
                  transactions, and review outputs are generated for demonstration and learning.
                  The platform does not contain real customer data, employer data, confidential
                  workflows, production thresholds, or live vendor enrichment.
                </p>
                <p>
                  The synthetic boundary means: no real financial crime victims are represented,
                  no real employer or client data is used, and no vendor systems are
                  reverse-engineered. The product is built for learning and portfolio
                  demonstration only. All surfaces are public-safe.
                </p>
              </Prose>

              <div className="mt-6 rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 px-5 py-4">
                <p
                  className="text-xs text-ourox-ink/50 tracking-wide"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  Synthetic data only&nbsp;&nbsp;·&nbsp;&nbsp;No real customer
                  data&nbsp;&nbsp;·&nbsp;&nbsp;No employer
                  data&nbsp;&nbsp;·&nbsp;&nbsp;Not production software
                </p>
              </div>
            </section>

            {/* Where to click */}
            <section aria-labelledby="where-to-click">
              <SectionHeading id="where-to-click" number="9" title="Where to click" />
              <Prose>
                <ul className="list-none space-y-3 pl-0">
                  <li>
                    Start at{" "}
                    <Link href="/ops" className="text-ourox-orange/70 underline underline-offset-2 hover:text-ourox-orange">
                      /ops
                    </Link>{" "}
                    for the operations command center.
                  </li>
                  <li>
                    Open <strong className="font-medium text-ourox-ink/80">Queue Board</strong> to
                    see priority, SLA, and impact triage.
                  </li>
                  <li>
                    Open <strong className="font-medium text-ourox-ink/80">Roster → Fairness</strong> to
                    see workload-equity logic.
                  </li>
                  <li>
                    Open <strong className="font-medium text-ourox-ink/80">Roster → Reviews</strong> or
                    top-level Reviews to see the analyst review pack and mock copilot.
                  </li>
                  <li>
                    Open{" "}
                    <Link href="/verity/agent" className="text-ourox-orange/70 underline underline-offset-2 hover:text-ourox-orange">
                      /verity/agent
                    </Link>{" "}
                    to run the human-gated agentic investigation.
                  </li>
                  <li>
                    Open{" "}
                    <Link href="/arbiter" className="text-ourox-orange/70 underline underline-offset-2 hover:text-ourox-orange">
                      Arbiter
                    </Link>{" "}
                    to inspect scoring, rules, tuning, and feedback.
                  </li>
                  <li>
                    Read{" "}
                    <Link href="/ops/guide" className="text-ourox-orange/70 underline underline-offset-2 hover:text-ourox-orange">
                      /ops/guide
                    </Link>{" "}
                    for deeper operations detail.
                  </li>
                </ul>
              </Prose>
            </section>

            {/* Typologies */}
            <section aria-labelledby="typologies">
              <SectionHeading
                id="typologies"
                number="10"
                title="Typologies demonstrated"
              />
              <Prose>
                <p>
                  Ourox demonstrates three synthetic fraud typologies. Each is designed to
                  show a distinct signal pattern — not just a high risk score, but a
                  structured argument for why the behaviour is suspicious.
                </p>
              </Prose>
              <div className="mt-6 space-y-3">
                <FeatureItem
                  name="Onboarding Mule Farm"
                  description="Multiple new wallets share devices or onboarding patterns; the signal is the cluster, not one suspicious account in isolation."
                />
                <FeatureItem
                  name="Sleeper Mule Activation"
                  description="A dormant wallet wakes up and begins rapid outbound movement; the signal is the change from baseline."
                />
                <FeatureItem
                  name="APP Scam Cash-out Ring"
                  description="Victim funds move toward a new or high-risk beneficiary; the signal is the beneficiary and pass-through pattern."
                />
              </div>
            </section>

            {/* Technical architecture */}
            <section aria-labelledby="technical-architecture">
              <SectionHeading
                id="technical-architecture"
                number="11"
                title="Technical architecture"
              />
              <Prose>
                <p>
                  Ourox uses procedurally generated synthetic data. The dataset is not
                  copied from real customers or prior employer systems. Background activity
                  is randomized for variety, while fraud scenarios are deliberately shaped
                  around public fraud typologies such as mule onboarding, sleeper mule
                  activation, and APP scam cash-out.
                </p>
              </Prose>

              <div className="mt-6 space-y-3">
                <ArchitectureExpander title="How the synthetic data is made">
                  <p>
                    The dataset has two layers. The first is a base synthetic seed
                    containing wallets, users, transactions, alerts, cases, devices,
                    patterns, and graph links. That seed is enriched with timestamps and
                    geo fields so temporal features such as velocity, dormancy,
                    pass-through behaviour, and geo movement can be demonstrated.
                  </p>
                  <p>
                    The second layer is an offline Python scenario generator. It creates
                    targeted fraud-typology events with the temporal and structural shape
                    the features need: mule onboarding, sleeper-mule activation, and APP
                    scam cash-out. The generator also adds a realistic overlap zone: some
                    fraud has weaker or partial signals, and some background activity has
                    incidentally elevated features.
                  </p>
                </ArchitectureExpander>

                <ArchitectureExpander title="How Arbiter scores">
                  <p>
                    Arbiter starts with deterministic features computed from synthetic
                    events and history. Those features feed a transparent weighted score,
                    then explicit rules run through a GoRules Zen-Engine JDM. Rule
                    precedence is visible: a rule can block an event even when the score
                    band alone would approve it.
                  </p>
                  <p>
                    The ML model is separate. It is trained offline on synthetic labels
                    and exported as static JSON artifacts. The app imports those artifacts
                    to compare model score, learned importance, calibration, and
                    disagreement cases. There is no runtime model inference. The rule
                    engine remains the decisioning authority; ML is shown as a second
                    opinion for analysis.
                  </p>
                </ArchitectureExpander>

                <ArchitectureExpander title="Stack">
                  <p>
                    Ourox is built as a Next.js application deployed on Vercel.
                    Arbiter&apos;s rules use a GoRules Zen-Engine JDM file. Synthetic data
                    generation and ML training run offline in Python. The deployed app
                    reads generated JSON artifacts; it does not run Python, a model
                    server, or request-time inference.
                  </p>
                </ArchitectureExpander>
              </div>
            </section>

            {/* Roadmap */}
            <section aria-labelledby="roadmap">
              <SectionHeading id="roadmap" number="12" title="Roadmap" />
              <Prose>
                <p>
                  The roadmap is structured in three horizons. It is designed to be updated
                  over time as the platform evolves.
                </p>
              </Prose>

              <div className="mt-6 space-y-4">
                <RoadmapBand
                  phase="Current"
                  items={[
                    "Ops Phase 1.5 shipped: Queue Board, Aging & SLA, Roster sub-views (Daily Ownership, Weekly Schedule, Fairness, Performance, QA), Reviews with per-analyst pack and mock AI copilot, KPI Board, and Ops Guide.",
                    "Verity: investigation workspace, alert triage queue, case workflow and closure-note builder, wallet and entity view, pattern intelligence library, analytics.",
                    "Verity Phase 3: Agentic Investigation at /verity/agent — human-gated four-stage flow with deterministic evidence chains and exam-ready audit trail.",
                    "Arbiter: scoring explorer with 12 features and full explainability, GoRules Zen-Engine JDM rule evaluation, decision precedence, tuning workspace, confusion matrix, precision / recall / FPR / F1 metrics, per-typology breakdown, rule back-testing, shadow mode.",
                    "Arbiter Phase 3 — ML score: offline-trained logistic-regression score shown beside the transparent rule score, with learned importance vs hand weights, calibration bins, held-out metrics, and ML-vs-rule disagreement cases.",
                    "Feedback-loop demonstration v1 — model-vs-rule disagreement cases are grouped into a miss pattern, converted into one simulated candidate refinement, and back-tested before any human decision.",
                  ]}
                />
                <RoadmapBand
                  phase="Next"
                  items={[
                    "Live Verity → Arbiter feedback wiring: case outcomes and analyst-curated patterns flowing back into scoring as labels or rule suggestions.",
                    "Live model API for agentic investigation (governed, human-gated; not autonomous).",
                    "Next Ops loops may extend reporting, QA review, assignment simulation, or Verity/Ops wiring.",
                  ]}
                />
                <RoadmapBand
                  phase="Later"
                  items={[
                    "Governance and readiness layer: document how a fraud function measures control coverage, typology gaps, and operating-model maturity.",
                  ]}
                />
              </div>

              <p className="mt-5 text-xs text-ourox-ink/30">
                Roadmap reflects planned learning and portfolio scope. Not a product release
                commitment.
              </p>
            </section>

            {/* Footer nav */}
            <div className="border-t border-ourox-obsidianMid pt-8 flex flex-wrap items-center gap-6">
              <Link
                href="/"
                className="text-sm text-ourox-orange/70 underline underline-offset-2 hover:text-ourox-orange transition-colors"
              >
                ← Back to Ourox
              </Link>
              <Link
                href="/ops"
                className="text-sm text-ourox-ink/40 underline underline-offset-2 hover:text-ourox-ink transition-colors"
              >
                Open Ops
              </Link>
              <Link
                href="/verity"
                className="text-sm text-ourox-ink/40 underline underline-offset-2 hover:text-ourox-ink transition-colors"
              >
                Open Verity
              </Link>
              <Link
                href="/verity/agent"
                className="text-sm text-ourox-ink/40 underline underline-offset-2 hover:text-ourox-ink transition-colors"
              >
                Agentic Investigation
              </Link>
              <Link
                href="/arbiter"
                className="text-sm text-ourox-ink/40 underline underline-offset-2 hover:text-ourox-ink transition-colors"
              >
                Open Arbiter
              </Link>
            </div>
          </div>
        </div>
      </main>
    </OuroxShell>
  );
}
