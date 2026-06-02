import { AppShell } from "@/components/AppShell";
import { AlertQueueTable } from "@/components/AlertQueueTable";

export default function AlertsPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-[30px] leading-[38px] font-semibold tracking-tight text-signal-ink">Alert Queue</h1>
        <p className="mt-2 text-[15px] leading-6 text-signal-slate">
          Live operations view — triage by scenario, severity, and case context. Click a row to open the wallet profile.
        </p>
      </div>
      <AlertQueueTable />
    </AppShell>
  );
}
