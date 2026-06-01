import type { AlertScenario } from "@/lib/types";

interface ScenarioChipProps {
  scenario: AlertScenario;
}

const SCENARIO_CONFIG: Record<
  AlertScenario,
  { label: string; className: string }
> = {
  "Onboarding Mule Farm": {
    label: "Mule Farm",
    className:
      "bg-purple-50 text-purple-700 border-purple-200",
  },
  "Sleeper Mule Activation": {
    label: "Sleeper Mule",
    className:
      "bg-amber-50 text-amber-700 border-amber-200",
  },
  "APP Scam Cash-out Ring": {
    label: "APP Scam",
    className:
      "bg-red-50 text-red-700 border-red-200",
  },
  "Endpoint Intelligence": {
    label: "Endpoint",
    className:
      "bg-blue-50 text-blue-700 border-blue-200",
  },
  Background: {
    label: "—",
    className:
      "bg-transparent text-signal-faint border-transparent",
  },
};

export function ScenarioChip({ scenario }: ScenarioChipProps) {
  const config = SCENARIO_CONFIG[scenario] ?? SCENARIO_CONFIG["Background"];

  if (scenario === "Background") {
    return (
      <span className="text-sm text-signal-faint" aria-label="Background — no scenario cluster">
        —
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
      aria-label={`Scenario: ${scenario}`}
    >
      {config.label}
    </span>
  );
}
