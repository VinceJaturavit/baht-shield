// Ourox Guide — /guide (Spec-022, Spec-004)
// Comprehensive living guide: 9 sections, calm enterprise document, anchor-friendly.
// No marketing splash. No animation. No decorative illustrations.
// Roadmap structured for future updates.

"use client";

import { useState } from "react";
import Link from "next/link";
import { OuroxShell } from "@/components/ourox/OuroxShell";

interface Section {
  id: string;
  number: string;
  title: string;
}

const SECTIONS: Section[] = [
  { id: "what-ourox-is", number: "1", title: "What Ourox is" },
  { id: "three-pillars", number: "2", title: "The three pillars" },
  { id: "ops-features", number: "3", title: "Ops — fraud operations management" },
  { id: "verity-features", number: "4", title: "Verity — features & functions" },
  { id: "arbiter-features", number: "5", title: "Arbiter — features & functions" },
  { id: "how-they-connect", number: "6", title: "How they connect — the loop" },
  { id: "typologies", number: "7", title: "Typologies demonstrated" },
  { id: "synthetic-data", number: "8", title: "Synthetic data & boundaries" },
  { id: "technical-architecture", number: "9", title: "Technical architecture" },
  { id: "roadmap", number: "10", title: "Roadmap" },
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
                How Ourox works
              </h1>
              <p className="max-w-xl text-base leading-7 text-ourox-ink/60">
                A structured guide to the platform, its three pillars, the synthetic data
                boundary, and the roadmap.
              </p>
              <p
                className="mt-4 text-xs text-ourox-ink/30 tracking-wide"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Synthetic data only&nbsp;&nbsp;·&nbsp;&nbsp;Learning and portfolio
                platform&nbsp;&nbsp;·&nbsp;&nbsp;Updated over time
              </p>
            </div>

            {/* Section 1 — What Ourox is */}
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

            {/* Section 2 — The three pillars */}
            <section aria-labelledby="three-pillars">
              <SectionHeading id="three-pillars" number="2" title="The three pillars" />
              <Prose>
                <p>
                  Ourox has three pillars: Ops runs the fraud operation, Verity investigates
                  and captures pattern intelligence, and Arbiter scores, tunes, and compares
                  decisioning logic. They are designed to be explored together, but each is
                  usable independently.
                </p>
              </Prose>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-base font-semibold text-ourox-ink">Ops</span>
                    <span
                      className="text-xs text-ourox-ink/40 tracking-wide"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      Fraud Operations
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-ourox-ink/60">
                    Ops is the operations layer after an alert becomes a case. It shows queues,
                    priority, SLA, aging, roster coverage, protected capacity, and fair KPIs.
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
                <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-base font-semibold text-ourox-ink">Verity</span>
                    <span
                      className="text-xs text-ourox-ink/40 tracking-wide"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      Investigation & Pattern Intelligence
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-ourox-ink/60">
                    Verity is the investigation and pattern-intelligence workspace. It shows
                    how analysts triage alerts, review wallet and entity evidence, work cases,
                    identify recurring fraud patterns, and capture the variables that a naive
                    score may miss.
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
                    <span className="text-base font-semibold text-ourox-ink">Arbiter</span>
                    <span
                      className="text-xs text-ourox-ink/40 tracking-wide"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                    >
                      Risk Scoring & Decisioning
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-ourox-ink/60">
                    Arbiter is the risk scoring and decisioning sandbox. It shows how
                    synthetic transaction events become features, scores, rules, decisions, and
                    tuning metrics.
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
              </div>
            </section>

            {/* Section 3 — Ops */}
            <section aria-labelledby="ops-features">
              <SectionHeading
                id="ops-features"
                number="3"
                title="Ops — fraud operations management"
              />
              <Prose>
                <p>
                  Ops is the fraud operations management layer of Ourox. It shows how work is
                  managed after an alert becomes a case: queues, priority, SLA, aging, roster
                  coverage, protected capacity, and fair KPIs.
                </p>
                <p>
                  The Ops layer makes visible the management choices behind a fraud function:
                  which work is urgent, which clock is running, who owns the queue, whether the
                  team has decision authority on shift, and whether performance is measured
                  fairly.
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

            {/* Section 4 — Verity features */}
            <section aria-labelledby="verity-features">
              <SectionHeading
                id="verity-features"
                number="4"
                title="Verity — features & functions"
              />
              <Prose>
                <p>
                  Verity is organized around the workflow of a fraud analyst: see what needs
                  attention, investigate the evidence, build a case, close with a structured
                  note, and feed patterns back into shared intelligence.
                </p>
              </Prose>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <FeatureItem
                  name="Dashboard"
                  description="Fraud-ops overview and Head-of-Fraud view: workload, scenario distribution, trend visibility, and operating posture."
                />
                <FeatureItem
                  name="Alert Queue"
                  description="Triage by scenario, severity, and case context; shows how investigation work enters the analyst queue."
                />
                <FeatureItem
                  name="Cases"
                  description="Investigation workflow and closure-note builder; demonstrates structured case handling and evidence capture."
                />
                <FeatureItem
                  name="Wallets / Entities"
                  description="Wallet profile, evidence summary, and AI copilot context with human-in-the-loop framing."
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

            {/* Section 5 — Arbiter features */}
            <section aria-labelledby="arbiter-features">
              <SectionHeading
                id="arbiter-features"
                number="5"
                title="Arbiter — features & functions"
              />
              <Prose>
                <p>
                  Arbiter models the scoring layer end-to-end. A synthetic transaction event
                  enters the pipeline and exits as a scored, ruled, and decided record with a
                  full explainability trail.
                </p>
              </Prose>

              <div className="mt-6 space-y-5">
                {/* Pipeline */}
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

                {/* Scoring explorer */}
                <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 px-5 py-5">
                  <div className="mb-2 text-sm font-semibold text-ourox-ink">
                    Scoring explorer
                  </div>
                  <p className="text-sm leading-6 text-ourox-ink/60">
                    The Scoring explorer shows how each event is scored and decided. It
                    exposes the feature values, weighted score contribution, fired rules, and
                    final decision precedence — for example, when a rule blocks an event even
                    though the score band alone would approve it. Twelve features, full
                    explainability, GoRules Zen-Engine JDM, and decision precedence are all
                    visible in one place.
                  </p>
                </div>

                {/* Tuning workspace */}
                <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 px-5 py-5">
                  <div className="mb-2 text-sm font-semibold text-ourox-ink">
                    Tuning workspace
                  </div>
                  <p className="text-sm leading-6 text-ourox-ink/60">
                    The Tuning workspace shows the fraud-strategy tradeoff: move a threshold
                    or feature weight, then watch precision, recall, false-positive rate, and
                    review volume change. Rule back-testing and shadow mode demonstrate how a
                    strategy team can test logic before treating it as live decisioning.
                    Per-typology metrics show where performance varies by fraud scenario.
                  </p>
                </div>

                {/* Model view */}
                <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 px-5 py-5">
                  <div className="mb-2 text-sm font-semibold text-ourox-ink">
                    Model — ML vs rules
                  </div>
                  <p className="text-sm leading-6 text-ourox-ink/60">
                    The Model view shows an offline-trained logistic-regression score alongside
                    the transparent rule-weighted score. It compares what the synthetic dataset
                    taught the model to weight against the analyst-designed hand weights, and
                    highlights events where the two systems disagree. This is a learning-grade
                    second opinion on synthetic data. The rule engine remains authoritative.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 — How they connect */}
            <section aria-labelledby="how-they-connect">
              <SectionHeading
                id="how-they-connect"
                number="6"
                title="How they connect — the loop"
              />
              <Prose>
                <p>
                  The name Ourox references the Ouroboros — the symbol of a loop that feeds
                  itself. Arbiter scores and routes work. Verity captures what analysts learn
                  from investigations: patterns, matched variables, case outcomes, and
                  evidence. Ops runs the operation after work becomes a case: ownership, SLA,
                  staffing, quality, and performance.
                </p>
                <p>
                  The intended loop is that scoring routes investigation, investigation
                  explains what is happening, operations manages the work to completion, and
                  operational outcomes feed back into better detection and routing. In the
                  current platform, the pillars are demonstrated as connected concepts using
                  synthetic data. The guide and roadmap track which parts of the loop are live
                  now and which are planned.
                </p>
              </Prose>

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

            {/* Section 7 — Typologies */}
            <section aria-labelledby="typologies">
              <SectionHeading
                id="typologies"
                number="7"
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
                  name="Onboarding mule farm"
                  description="Multiple new wallets share devices or onboarding patterns; the signal is the cluster, not one suspicious account in isolation."
                />
                <FeatureItem
                  name="Sleeper-mule activation"
                  description="A dormant wallet wakes up and begins rapid outbound movement; the signal is the change from baseline."
                />
                <FeatureItem
                  name="APP scam cash-out"
                  description="Victim funds move toward a new or high-risk beneficiary; the signal is the beneficiary and pass-through pattern."
                />
              </div>
            </section>

            {/* Section 8 — Synthetic data */}
            <section aria-labelledby="synthetic-data">
              <SectionHeading
                id="synthetic-data"
                number="8"
                title="Synthetic data & boundaries"
              />
              <Prose>
                <p>
                  Ourox uses synthetic data only. The scenarios, wallets, transactions,
                  cases, and patterns are illustrative and designed to teach fraud-operations
                  concepts. The platform is not connected to real customer data, employer
                  systems, or production decisioning infrastructure.
                </p>
                <p>
                  The synthetic boundary means: no real financial crime victims are
                  represented, no real employer or client data is used, no prior-employer
                  scoring logic is reproduced, and no vendor systems are reverse-engineered.
                  The product is built for learning and portfolio demonstration only.
                </p>
              </Prose>

              <div
                className="mt-6 rounded-lg border border-ourox-obsidianMid bg-ourox-obsidianLight/40 px-5 py-4"
              >
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

            {/* Section 9 — Technical architecture */}
            <section aria-labelledby="technical-architecture">
              <SectionHeading
                id="technical-architecture"
                number="9"
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
                    incidentally elevated features. That makes the model and tuning views
                    less toy-like and more useful for learning.
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

            {/* Section 10 — Roadmap */}
            <section aria-labelledby="roadmap">
              <SectionHeading id="roadmap" number="10" title="Roadmap" />
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
                    "Ops MVP shipped: Queue Board, Aging & SLA, Roster & Assignment, KPI Board, and Ops Guide.",
                    "Verity: investigation workspace, alert triage queue, case workflow and closure-note builder, wallet and entity view, pattern intelligence library, analytics.",
                    "Arbiter: scoring explorer with 12 features and full explainability, GoRules Zen-Engine JDM rule evaluation, decision precedence, tuning workspace, confusion matrix, precision / recall / FPR / F1 metrics, per-typology breakdown, rule back-testing, shadow mode.",
                    "Arbiter Phase 3 — ML score: offline-trained logistic-regression score shown beside the transparent rule score, with learned importance vs hand weights, calibration bins, held-out metrics, and ML-vs-rule disagreement cases. Learning-grade second opinion on synthetic data; rules remain the decisioning authority.",
                    "Feedback-loop demonstration v1 — model-vs-rule disagreement cases are grouped into a miss pattern, converted into one simulated candidate refinement, and back-tested before any human decision.",
                  ]}
                />
                <RoadmapBand
                  phase="Next"
                  items={[
                    "Live Verity → Arbiter feedback wiring: case outcomes and analyst-curated patterns flowing back into scoring as labels or rule suggestions.",
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
