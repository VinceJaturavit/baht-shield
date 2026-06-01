import { AppShell } from "./AppShell";
import { SyntheticDataLabel } from "./SyntheticDataLabel";

interface PlannedCapabilityPageProps {
  title: string;
  description: string;
  plannedTag?: string;
}

export function PlannedCapabilityPage({
  title,
  description,
  plannedTag = "Planned — Spec 010+",
}: PlannedCapabilityPageProps) {
  return (
    <AppShell>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="rounded-signal border border-signal-border bg-white p-8 shadow-signal">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-signal-secondary">
              Planned capability
            </p>
            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-signal-heading">
              {title}
            </h1>
            <p className="mb-5 text-[15px] leading-relaxed text-signal-secondary">
              {description}
            </p>
            <span className="inline-flex items-center rounded-full border border-signal-border bg-signal-muted px-3 py-1 text-xs font-medium text-signal-secondary">
              {plannedTag}
            </span>
            <p className="mt-6 text-xs text-signal-secondary/70">
              This placeholder is intentionally minimal. It marks planned product
              scope without adding unfinished functionality.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
