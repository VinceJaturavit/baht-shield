import type { PatternFamily } from "@/lib/types";
import { parsePatternVariables, rankChips } from "@/lib/variable-chips";
import { VariableChip } from "./VariableChip";
import { VariableChipLegend } from "./VariableChipLegend";

interface VariableChipGroupProps {
  variables: string;
  patternFamily?: PatternFamily;
  compact?: boolean;
  showLegend?: boolean;
}

const COMPACT_LIMIT = 4;

export function VariableChipGroup({
  variables,
  patternFamily,
  compact = false,
  showLegend = false,
}: VariableChipGroupProps) {
  const parsed = parsePatternVariables(variables);
  const ranked = rankChips(parsed, patternFamily);

  if (ranked.length === 0) {
    return (
      <span className="text-xs text-signal-faint italic">No variables</span>
    );
  }

  const visible = compact ? ranked.slice(0, COMPACT_LIMIT) : ranked;
  const hidden = compact ? ranked.length - COMPACT_LIMIT : 0;

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {visible.map((v) => (
          <VariableChip key={v.raw} variable={v} />
        ))}
        {hidden > 0 && (
          <span className="inline-flex items-center rounded-md border border-signal-borderSubtle bg-signal-muted px-2 py-0.5 text-xs text-signal-faint">
            +{hidden} more
          </span>
        )}
      </div>
      {showLegend && <VariableChipLegend chips={ranked} />}
    </div>
  );
}
