import type { ParsedPatternVariable, VariableCategory } from "@/lib/types";
import { VARIABLE_CATEGORY_STYLES } from "@/lib/variable-chips";

const LEGEND_ORDER: VariableCategory[] = [
  "Device/SIM",
  "Endpoint/Beneficiary",
  "Behavior/Velocity",
  "Identity/KYC",
  "Other",
];

interface VariableChipLegendProps {
  chips: ParsedPatternVariable[];
}

export function VariableChipLegend({ chips }: VariableChipLegendProps) {
  const presentCategories = new Set(chips.map((c) => c.category));
  const categories = LEGEND_ORDER.filter((cat) => presentCategories.has(cat));

  if (categories.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
      <span className="text-[10px] uppercase tracking-wide text-signal-faint font-medium">
        Legend:
      </span>
      {categories.map((cat) => {
        const styles = VARIABLE_CATEGORY_STYLES[cat];
        return (
          <span key={cat} className="inline-flex items-center gap-1 text-[11px] text-signal-secondary">
            <span
              className={`inline-block h-2 w-2 rounded-full ${styles.dot}`}
              aria-hidden="true"
            />
            {styles.label}
          </span>
        );
      })}
    </div>
  );
}
