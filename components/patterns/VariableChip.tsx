import type { ParsedPatternVariable } from "@/lib/types";
import { VARIABLE_CATEGORY_STYLES } from "@/lib/variable-chips";

interface VariableChipProps {
  variable: ParsedPatternVariable;
}

export function VariableChip({ variable }: VariableChipProps) {
  const styles = VARIABLE_CATEGORY_STYLES[variable.category];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium leading-tight ${styles.chip}`}
      title={`${styles.label}: ${variable.raw}`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`}
        aria-hidden="true"
      />
      {variable.label}
    </span>
  );
}
