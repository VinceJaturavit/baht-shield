import type { AlertQueueKpis } from "@/lib/types";

interface AlertQueueKpiStripProps {
  kpis: AlertQueueKpis;
}

function formatTHB(amount: number): string {
  if (amount >= 1_000_000) {
    return `฿${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `฿${(amount / 1_000).toFixed(0)}K`;
  }
  return `฿${amount.toLocaleString("th-TH")}`;
}

interface KpiTileProps {
  label: string;
  value: string | number;
  caption?: string;
  highlight?: boolean;
}

function KpiTile({ label, value, caption, highlight = false }: KpiTileProps) {
  return (
    <div className="flex flex-col gap-0.5 rounded-signal border border-signal-border bg-white px-4 py-3 shadow-signal min-w-0">
      <span className="text-[11px] font-medium uppercase tracking-wide text-signal-secondary truncate">
        {label}
      </span>
      <span
        className={`text-xl font-semibold tabular-nums ${
          highlight ? "text-signal-accent" : "text-signal-heading"
        }`}
      >
        {value}
      </span>
      {caption && (
        <span className="text-[11px] text-signal-faint truncate">{caption}</span>
      )}
    </div>
  );
}

export function AlertQueueKpiStrip({ kpis }: AlertQueueKpiStripProps) {
  return (
    <div
      className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      aria-label="Alert queue summary"
    >
      <KpiTile
        label="Open Alerts"
        value={kpis.open_alert_count}
      />
      <KpiTile
        label="Escalated"
        value={kpis.escalated_alert_count}
        highlight={kpis.escalated_alert_count > 0}
      />
      <KpiTile
        label="Critical / High"
        value={kpis.high_severity_count}
      />
      <KpiTile
        label="Synthetic Linked-Case Loss"
        value={formatTHB(kpis.total_synthetic_loss_exposure)}
        caption="Synthetic · linked-case loss only"
      />
      <KpiTile
        label="Scenario-Linked"
        value={kpis.scenario_linked_alert_count}
        caption="Non-background alerts"
      />
    </div>
  );
}
