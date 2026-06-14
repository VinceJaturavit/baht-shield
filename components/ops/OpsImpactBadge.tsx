import type { OpsImpactTier } from "@/lib/ops/types";
import { getImpactTone } from "@/lib/ops/impact";
import { OpsIndicatorLabel } from "./OpsIndicatorLabel";

interface Props {
  tier: OpsImpactTier;
  compact?: boolean;
}

export function OpsImpactBadge({ tier, compact = false }: Props) {
  return (
    <OpsIndicatorLabel
      label={tier}
      tone={getImpactTone(tier)}
      className={compact ? "text-[10px]" : undefined}
    />
  );
}
