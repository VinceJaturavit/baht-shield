import { CasesTable } from "@/components/cases/CasesTable";

export default function CasesPage() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-signal-ink">Cases</h1>
        <p className="mt-1 text-sm text-signal-secondary">
          Investigation portfolio across linked alerts, wallets, analyst patterns, and closure
          decisions.
        </p>
      </div>

      <CasesTable />
    </div>
  );
}
