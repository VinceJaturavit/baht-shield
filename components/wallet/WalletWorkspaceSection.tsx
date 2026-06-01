interface WalletWorkspaceSectionProps {
  title: string;
  description?: string;
  id?: string;
  children: React.ReactNode;
}

export function WalletWorkspaceSection({
  title,
  description,
  id,
  children,
}: WalletWorkspaceSectionProps) {
  return (
    <div id={id} className="space-y-4">
      <div className="border-b border-signal-border pb-3">
        <h2 className="text-base font-semibold text-signal-heading">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-signal-secondary">{description}</p>
        )}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
