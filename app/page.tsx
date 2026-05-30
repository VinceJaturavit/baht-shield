import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/MetricCard";
import { alerts } from "@/lib/seed-data";
import { cases } from "@/lib/seed-data";
import { getDashboardMetrics, formatTHB } from "@/lib/metrics";
import { SCENARIO_COLORS, type ScenarioType } from "@/lib/scenario-utils";

export default function DashboardPage() {
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
    { label: "Critical", count: m.alertsBySeverity.critical, bar: "bg-severity-critical" },
    { label: "High", count: m.alertsBySeverity.high, bar: "bg-severity-high" },
    { label: "Medium", count: m.alertsBySeverity.medium, bar: "bg-severity-medium" },
    { label: "Low", count: m.alertsBySeverity.low, bar: "bg-severity-low" },
  ];
  const maxSeverityCount = Math.max(...severityRows.map((r) => r.count), 1);

  return (
    <AppShell>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-signal-heading">
          Executive Dashboard
        </h1>
        <p className="mt-2 text-[15px] text-signal-secondary">
          How a Head of Fraud sees synthetic e-wallet risk across alerts, cases,
          losses, and scenario-linked activity.
        </p>
      </div>

      {/* Top metric tiles */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard
          title="Total Synthetic Losses"
          value={formatTHB(m.totalSyntheticLosses)}
          description="Sum of all case loss amounts"
          accent="red"
        />
        <MetricCard
          title="Open Alerts"
          value={m.openAlertCount.toLocaleString()}
          description={`of ${m.totalAlertCount} total alerts`}
          accent="amber"
        />
        <MetricCard
          title="Scenario-Linked Wallets"
          value={m.scenarioWalletCount.toLocaleString()}
          description="Wallets tied to analyst-curated patterns"
          accent="purple"
        />
        <MetricCard
          title="Total Cases"
          value={m.totalCaseCount.toLocaleString()}
          description={`${m.totalScenarioCases} scenario + ${m.totalCaseCount - m.totalScenarioCases} background`}
          accent="blue"
        />
      </div>

      {/* Secondary sections — two column grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alerts by severity */}
        <div className="rounded-signal border border-signal-border bg-white p-6 shadow-signal">
          <h2 className="mb-1 text-lg font-semibold text-signal-heading">
            Alerts by Severity
          </h2>
          <p className="mb-4 text-[13px] text-signal-secondary">
            Distribution across {m.totalAlertCount} alerts
          </p>
          <div className="space-y-3">
            {severityRows.map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-signal-body">{row.label}</span>
                  <span className="tabular-nums text-signal-secondary">{row.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-signal-muted">
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

        {/* Open vs closed + scenario breakdown */}
        <div className="space-y-6">
          {/* Open vs closed */}
          <div className="rounded-signal border border-signal-border bg-white p-6 shadow-signal">
            <h2 className="mb-1 text-lg font-semibold text-signal-heading">
              Cases — Open vs Closed
            </h2>
            <p className="mb-4 text-[13px] text-signal-secondary">
              Based on presence of closed_at timestamp
            </p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-semibold tabular-nums text-signal-heading">
                  {m.openClosedCases.open}
                </div>
                <div className="text-xs text-signal-secondary">Open</div>
              </div>
              <div className="flex-1 h-2.5 overflow-hidden rounded-full bg-signal-muted">
                <div
                  className="h-2.5 rounded-full bg-signal-accent"
                  style={{
                    width: `${(m.openClosedCases.closed / m.totalCaseCount) * 100}%`,
                  }}
                />
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold tabular-nums text-signal-accent">
                  {m.openClosedCases.closed}
                </div>
                <div className="text-xs text-signal-secondary">Closed</div>
              </div>
            </div>
          </div>

          {/* Scenario breakdown */}
          <div className="rounded-signal border border-signal-border bg-white p-6 shadow-signal">
            <h2 className="mb-1 text-lg font-semibold text-signal-heading">
              Scenario Case Breakdown
            </h2>
            <p className="mb-3 text-[13px] text-signal-secondary">
              Scenario-linked wallets are derived from cases tied to
              analyst-curated mule/scam patterns.
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
                  <span className="text-sm font-semibold tabular-nums text-signal-heading">
                    {row.count} cases
                  </span>
                </div>
              ))}
              <div className="mt-2 border-t border-signal-borderSubtle pt-2 flex justify-between text-xs text-signal-secondary">
                <span>Total scenario cases</span>
                <span className="font-semibold tabular-nums text-signal-heading">
                  {m.totalScenarioCases}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Case decision mix */}
        <div className="rounded-signal border border-signal-border bg-white p-6 shadow-signal lg:col-span-2">
          <h2 className="mb-1 text-lg font-semibold text-signal-heading">
            Case Decision Mix
          </h2>
          <p className="mb-4 text-[13px] text-signal-secondary">
            How {m.totalCaseCount} cases were resolved — grouped by analyst decision
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {sortedDecisions.map(([decision, count]) => (
              <div
                key={decision}
                className="rounded-signalSm border border-signal-borderSubtle bg-signal-muted p-4 text-center"
              >
                <div className="text-xl font-semibold tabular-nums text-signal-heading">{count}</div>
                <div className="mt-1 text-xs text-signal-secondary break-words">
                  {decision.replace(/_/g, " ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
