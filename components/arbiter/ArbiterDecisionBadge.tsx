// ArbiterDecisionBadge — professional decision indicator (Spec-022)
// No emoji. Small filled dot + text label. Color is never the sole status cue.
// Dark-theme safe. Consistent across table chips, drawer badges, fired-rule pills.

import type { ArbiterDecision } from '@/lib/arbiter/contract';

type Size = 'sm' | 'md';

interface Props {
  decision: ArbiterDecision;
  size?: Size;
}

interface DecisionStyle {
  dot: string;
  bg: string;
  border: string;
  text: string;
  label: string;
}

const STYLES: Record<ArbiterDecision, DecisionStyle> = {
  BLOCK: {
    dot: 'bg-red-500',
    bg: 'bg-red-950/50',
    border: 'border-red-700/60',
    text: 'text-red-400',
    label: 'Block',
  },
  REVIEW: {
    dot: 'bg-amber-500',
    bg: 'bg-amber-950/50',
    border: 'border-amber-700/60',
    text: 'text-amber-400',
    label: 'Review',
  },
  STEP_UP: {
    dot: 'bg-blue-500',
    bg: 'bg-blue-950/50',
    border: 'border-blue-700/60',
    text: 'text-blue-400',
    label: 'Step Up',
  },
  APPROVE: {
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-700/50',
    text: 'text-emerald-400',
    label: 'Approve',
  },
};

export function ArbiterDecisionBadge({ decision, size = 'sm' }: Props) {
  const s = STYLES[decision];
  const textSize = size === 'md' ? 'text-sm' : 'text-xs';
  const px = size === 'md' ? 'px-3 py-1' : 'px-2 py-0.5';
  const dotSize = size === 'md' ? 'h-2 w-2' : 'h-1.5 w-1.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${textSize} ${px} ${s.bg} ${s.border} ${s.text}`}
      aria-label={`Decision: ${s.label}`}
    >
      <span
        className={`inline-block shrink-0 rounded-full ${dotSize} ${s.dot}`}
        aria-hidden="true"
      />
      {s.label}
    </span>
  );
}
