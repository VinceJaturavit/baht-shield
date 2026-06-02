import type { AlertScenario } from "@/lib/types";

interface ScenarioChipProps {
  scenario: AlertScenario;
}

const SCENARIO_CONFIG: Record<
  AlertScenario,
  { label: string; dot: string }
> = {
  "Onboarding Mule Farm": {
    label: "Mule Farm",
    dot: "bg-signal-indigo",
  },
  "Sleeper Mule Activation": {
    label: "Sleeper Mule",
    dot: "bg-signal-amber",
  },
  "APP Scam Cash-out Ring": {
    label: "APP Scam",
    dot: "bg-risk-high",
  },
  "Endpoint Intelligence": {
    label: "Endpoint",
    dot: "bg-signal-slate",
  },
  Background: {
    label: "—",
    dot: "bg-signal-faintSlate",
  },
};

export function ScenarioChip({ scenario }: ScenarioChipProps) {
  const config = SCENARIO_CONFIG[scenario] ?? SCENARIO_CONFIG["Background"];

  if (scenario === "Background") {
    return (
      <span className="text-sm text-signal-meta" aria-label="Background — no scenario cluster">
        —
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-signal-border bg-signal-surfaceSubtle px-2.5 py-0.5 text-xs font-medium text-signal-body"
      aria-label={`Scenario: ${scenario}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
