import { AppShell } from "@/components/AppShell";
import { AlertQueueTable } from "@/components/AlertQueueTable";
import { alerts } from "@/lib/seed-data";

export default function AlertsPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-signal-heading">Alert Queue</h1>
        <p className="mt-2 text-[15px] text-signal-secondary">
          Live operations view — filter by status, sort by severity, click a row
          to open the wallet profile.
        </p>
      </div>
      <AlertQueueTable alerts={alerts} />
    </AppShell>
  );
}
