import type { Device, SimBinding } from "@/lib/types";
import { EmptyState } from "./EmptyState";

interface DeviceSimPanelProps {
  devices: Device[];
  simBindings: SimBinding[];
}

function getRiskLabel(score: number): { label: string; dot: string } {
  if (score >= 70) return { label: "High", dot: "bg-severity-critical" };
  if (score >= 40) return { label: "Elevated", dot: "bg-severity-high" };
  return { label: "Low / Moderate", dot: "bg-severity-low" };
}

export function DeviceSimPanel({ devices, simBindings }: DeviceSimPanelProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-signal-ink mb-1">Device + SIM</h2>
      <p className="text-[13px] text-signal-slate mb-4">
        Standalone device risk may look low even when shared-device behavior creates cluster risk.
      </p>

      <div className="space-y-4">
        {/* Devices */}
        <div>
          <p className="text-[11px] uppercase tracking-wide text-signal-faint mb-2">
            Devices ({devices.length})
          </p>
          {devices.length === 0 ? (
            <EmptyState title="No devices found for this user." />
          ) : (
            <div className="space-y-2">
              {devices.map((device) => {
                const risk = getRiskLabel(device.risk_score);
                return (
                  <div
                    key={device.device_id}
                    className="rounded-signal border border-signal-border bg-signal-surface px-4 py-3 shadow-signalSubtle"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-mono text-signal-body truncate">{device.device_id}</p>
                        <p className="text-xs text-signal-secondary mt-0.5">
                          {device.os} · First seen: {device.first_seen_at}
                        </p>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-signal-border bg-white px-2.5 py-0.5 text-[11px] font-medium text-signal-body">
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${risk.dot}`} />
                        {risk.label} <span className="tabular-nums text-signal-secondary">({device.risk_score})</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SIM Bindings */}
        <div>
          <p className="text-[11px] uppercase tracking-wide text-signal-faint mb-2">
            SIM Bindings ({simBindings.length})
          </p>
          {simBindings.length === 0 ? (
            <EmptyState title="No SIM bindings found for this user." />
          ) : (
            <div className="space-y-2">
              {simBindings.map((sim) => (
                <div
                  key={sim.binding_id}
                  className="rounded-signal border border-signal-border bg-signal-surface px-4 py-3 shadow-signalSubtle"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-signal-body">{sim.msisdn}</p>
                      <p className="text-xs text-signal-secondary mt-0.5">Binding ID: {sim.binding_id}</p>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-signal-border bg-white px-2.5 py-0.5 text-[11px] font-medium text-signal-body">
                      {sim.sim_change_count >= 3 && (
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-severity-high" />
                      )}
                      <span className="tabular-nums">{sim.sim_change_count}</span> SIM swap{sim.sim_change_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
