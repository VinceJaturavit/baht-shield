// Verity dashboard — moved from app/page.tsx (Spec-018 routing).
// All Verity sub-routes (/alerts, /cases, /entities, /patterns, etc.) remain at their
// current paths. This page is the product entry point at /verity.

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/MetricCard";
import { alerts } from "@/lib/seed-data";
import { cases } from "@/lib/seed-data";
import { getDashboardMetrics, formatTHB } from "@/lib/metrics";
import { SCENARIO_COLORS, type ScenarioType } from "@/lib/scenario-utils";

export default function VerityDashboardPage() {
  const m = getDashboardMetrics(alerts, cases);

  const scenarioRows: { label: ScenarioType; count: number; color: string }[] = [
    {
      label: "Onboarding Mule Farm",
      count: m.scenarioBreakdown["Onboarding Mule Farm"],
      color: SCENARIO_COLORS["Onboarding Mule Farm"],
    },
    {
      label: "Sleeper Mule Activation",
      count: m.scenarioBreakdown["Sleeper Mule Activation"],
      color: SCENARIO_COLORS["Sleeper Mule Activation"],
    },
    {
      label: "APP Scam Cash-out Ring",
      count: m.scenarioBreakdown["APP Scam Cash-out Ring"],
      color: SCENARIO_COLORS["APP Scam Cash-out Ring"],
    },
  ];

  const sortedDecisions = Object.entries(m.decisionMix).sort(
    ([, a], [, b]) => b - a
  );

  const severityRows = [
    { label: "Critical", count: m.alertsBySeverity.critical, bar: "bg-risk-critical" },
    { label: "High", count: m.alertsBySeverity.high, bar: "bg-risk-high" },
    { label: "Medium", count: m.alertsBySeverity.medium, bar: "bg-risk-medium" },
    { label: "Low", count: m.alertsBySeverity.low, bar: "bg-risk-low" },
  ];
  const maxSeverityCount = Math.max(...severityRows.map((r) => r.count), 1);

  return (
    <AppShell>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[30px] leading-[38px] font-semibold tracking-tight text-signal-ink">
          Fraud Operations Overview
        </h1>
        <p className="mt-2 text-[15px] leading-6 text-signal-slate">
          How a Head of Fraud sees synthetic e-wallet risk across alerts, cases,
          loss exposure, and pattern-linked activity.
        </p>
        <p className="mt-3 text-sm">
          <Link
            href="/verity/agent"
            className="font-medium text-signal-indigo underline underline-offset-2 hover:text-signal-indigoHover focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2 rounded-sm"
          >
            Agentic Investigation
          </Link>
          <span className="text-signal-slate">
            {" "}
            — human-gated investigation copilot (Phase 3)
          </span>
        </p>
      </div>

      {/* Top metric tiles */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard
          title="Synthetic loss exposure"
          value={formatTHB(m.totalSyntheticLosses)}
          description="Total across all case loss amounts"
          accent="red"
        />
        <MetricCard
          title="Open alert backlog"
          value={m.openAlertCount.toLocaleString()}
          description={`of ${m.totalAlertCount} total alerts`}
          accent="amber"
        />
        <MetricCard
          title="Pattern-linked wallets"
          value={m.scenarioWalletCount.toLocaleString()}
          description="Tied to analyst-curated patterns"
          accent="purple"
        />
        <MetricCard
          title="Total cases"
          value={m.totalCaseCount.toLocaleString()}
          description={`${m.totalScenarioCases} scenario + ${m.totalCaseCount - m.totalScenarioCases} background`}
          accent="blue"
        />
      </div>

      {/* Secondary sections — explicit two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column: Severity mix + Case decision mix */}
        <div className="space-y-6">
          {/* Alerts by severity */}
          <div className="rounded-signal border border-signal-border bg-signal-surface p-6 shadow-signalSubtle">
            <h2 className="mb-1 text-lg font-semibold text-signal-ink">
              Severity mix
            </h2>
            <p className="mb-4 text-[13px] text-signal-slate">
              Distribution across {m.totalAlertCount} alerts
            </p>
            <div className="space-y-3">
              {severityRows.map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium text-signal-body">{row.label}</span>
                    <span className="tabular-nums text-signal-slate">{row.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-signal-surfaceSubtle">
                    <div
                      className={`h-2 rounded-full ${row.bar}`}
                      style={{
                        width: `${(row.count / maxSeverityCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Case decision mix */}
          <div className="rounded-signal border border-signal-border bg-signal-surface p-6 shadow-signalSubtle">
            <h2 className="mb-1 text-lg font-semibold text-signal-ink">
              Case decision mix
            </h2>
            <p className="mb-4 text-[13px] text-signal-slate">
              How {m.totalCaseCount} cases were resolved — grouped by analyst decision
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {sortedDecisions.map(([decision, count]) => (
                <div
                  key={decision}
                  className="rounded-signalSm border border-signal-borderSubtle bg-signal-surfaceSubtle p-4 text-center"
                >
                  <div className="text-xl font-semibold tabular-nums text-signal-ink">{count}</div>
                  <div className="mt-1 text-xs text-signal-slate break-words">
                    {decision.replace(/_/g, " ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Open vs closed + Scenario breakdown */}
        <div className="space-y-6">
          {/* Open vs closed */}
          <div className="rounded-signal border border-signal-border bg-signal-surface p-6 shadow-signalSubtle">
            <h2 className="mb-1 text-lg font-semibold text-signal-ink">
              Cases — open vs closed
            </h2>
            <p className="mb-4 text-[13px] text-signal-slate">
              Based on presence of a closed_at timestamp
            </p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-semibold tabular-nums text-signal-ink">
                  {m.openClosedCases.open}
                </div>
                <div className="text-xs text-signal-slate">Open</div>
              </div>
              <div className="flex-1 h-2.5 overflow-hidden rounded-full bg-signal-surfaceSubtle">
                <div
                  className="h-2.5 rounded-full bg-signal-indigo"
                  style={{
                    width: `${(m.openClosedCases.closed / m.totalCaseCount) * 100}%`,
                  }}
                />
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold tabular-nums text-signal-indigo">
                  {m.openClosedCases.closed}
                </div>
                <div className="text-xs text-signal-slate">Closed</div>
              </div>
            </div>
          </div>

          {/* Scenario breakdown */}
          <div className="rounded-signal border border-signal-border bg-signal-surface p-6 shadow-signalSubtle">
            <h2 className="mb-1 text-lg font-semibold text-signal-ink">
              Scenario case breakdown
            </h2>
            <p className="mb-3 text-[13px] text-signal-slate">
              Pattern-linked wallets are derived from cases tied to
              analyst-curated mule / scam patterns.
            </p>
            <div className="space-y-2">
              {scenarioRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between"
                >
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${row.color}`}
                  >
                    {row.label}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-signal-ink">
                    {row.count} cases
                  </span>
                </div>
              ))}
              <div className="mt-2 border-t border-signal-borderSubtle pt-2 flex justify-between text-xs text-signal-slate">
                <span>Total scenario cases</span>
                <span className="font-semibold tabular-nums text-signal-ink">
                  {m.totalScenarioCases}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
