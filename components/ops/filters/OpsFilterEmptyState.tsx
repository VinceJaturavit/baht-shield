interface Props {
  title: string;
  description: string;
}

export function OpsFilterEmptyState({ title, description }: Props) {
  return (
    <div className="rounded-lg border border-ourox-obsidianMid bg-ourox-obsidian/30 px-3 py-4">
      <p className="text-xs font-medium text-ourox-ink/70">{title}</p>
      <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-ourox-ink/45">
        {description}
      </p>
    </div>
  );
}
