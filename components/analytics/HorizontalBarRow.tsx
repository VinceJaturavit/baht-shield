interface HorizontalBarRowProps {
  label: string;
  value: string | number;
  share?: number;
  maxShare?: number;
  description?: string;
}

export function HorizontalBarRow({
  label,
  value,
  share,
  maxShare = 1,
  description,
}: HorizontalBarRowProps) {
  const barPct =
    share !== undefined && maxShare > 0
      ? Math.round((share / maxShare) * 100)
      : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[13px] leading-5 text-signal-body">
          {label}
        </span>
        <span className="shrink-0 tabular-nums text-[13px] font-medium text-signal-ink">
          {value}
          {share !== undefined && (
            <span className="ml-1.5 text-signal-meta font-normal">
              ({Math.round(share * 100)}%)
            </span>
          )}
        </span>
      </div>
      {description && (
        <p className="text-[11px] text-signal-meta">{description}</p>
      )}
      {share !== undefined && (
        <div
          className="h-1.5 w-full rounded-full bg-signal-borderSubtle"
          role="presentation"
          aria-hidden="true"
        >
          <div
            className="h-1.5 rounded-full bg-signal-indigo"
            style={{ width: `${barPct}%` }}
          />
        </div>
      )}
    </div>
  );
}
