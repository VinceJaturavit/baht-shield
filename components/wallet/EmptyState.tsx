interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-signal border border-signal-border bg-signal-muted px-6 py-8 text-center">
      <p className="text-sm font-medium text-signal-secondary">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-signal-faint">{description}</p>
      )}
    </div>
  );
}
