interface Props {
  value: number;
  roleAverage: number;
  maxScale?: number;
}

export function OpsFairnessBar({ value, roleAverage, maxScale }: Props) {
  const scale = maxScale ?? Math.max(value, roleAverage, 1) * 1.15;
  const valuePct = Math.min(100, (value / scale) * 100);
  const avgPct = Math.min(100, (roleAverage / scale) * 100);

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div
        className="relative h-2 min-w-0 flex-1 rounded-sm bg-ourox-obsidianMid/50"
        role="img"
        aria-label={`Weighted difficulty ${value}, role average ${roleAverage}`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-sm bg-ourox-ink/25"
          style={{ width: `${valuePct}%` }}
        />
        <div
          className="absolute inset-y-0 w-px bg-ourox-yellow/80"
          style={{ left: `${avgPct}%` }}
          aria-hidden="true"
        />
      </div>
      <span className="shrink-0 tabular-nums text-[10px] text-ourox-ink/60">{value.toFixed(1)}</span>
    </div>
  );
}
