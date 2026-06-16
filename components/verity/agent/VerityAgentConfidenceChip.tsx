"use client";

type VerityAgentConfidenceChipProps = {
  confidence: "Low" | "Medium" | "High";
  showLabel?: boolean;
};

function getConfidenceClasses(confidence: "Low" | "Medium" | "High"): string {
  switch (confidence) {
    case "High":
      return "border border-signal-indigo/40 bg-signal-indigoSubtle text-signal-indigo";
    case "Medium":
      return "border border-risk-medium/40 bg-risk-medium/10 text-risk-medium";
    case "Low":
      return "border border-signal-border bg-signal-muted text-signal-secondary";
  }
}

export function VerityAgentConfidenceChip({
  confidence,
  showLabel = true,
}: VerityAgentConfidenceChipProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold ${getConfidenceClasses(confidence)}`}
    >
      {showLabel ? confidence : null}
    </span>
  );
}
