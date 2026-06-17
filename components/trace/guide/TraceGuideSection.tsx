interface Props {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function TraceGuideSectionHeading({ id, title }: Omit<Props, "children">) {
  return (
    <h2
      id={id}
      className="mb-4 text-lg font-semibold tracking-tight text-trace-heading scroll-mt-24"
    >
      {title}
    </h2>
  );
}

export function TraceGuideProse({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3 text-sm leading-relaxed text-trace-body">{children}</div>;
}

export function TraceGuideSection({ id, title, children }: Props) {
  return (
    <section aria-labelledby={id}>
      <TraceGuideSectionHeading id={id} title={title} />
      {children}
    </section>
  );
}
