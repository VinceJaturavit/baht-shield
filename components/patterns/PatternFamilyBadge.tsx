import { PATTERN_FAMILY_COLORS } from "@/lib/scenario-utils";
import type { PatternFamily } from "@/lib/types";

interface PatternFamilyBadgeProps {
  family: PatternFamily;
}

export function PatternFamilyBadge({ family }: PatternFamilyBadgeProps) {
  const classes = PATTERN_FAMILY_COLORS[family] ?? PATTERN_FAMILY_COLORS["Other"];
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${classes}`}
    >
      {family}
    </span>
  );
}
