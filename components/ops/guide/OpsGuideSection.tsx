interface Props {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}

export function OpsGuideSectionHeading({ id, number, title }: Omit<Props, "children">) {
  return (
    <h2
      id={id}
      className="mb-5 flex items-baseline gap-3 text-xl font-semibold tracking-tight text-ourox-ink scroll-mt-24"
    >
      <span
        className="shrink-0 font-mono text-sm font-normal text-ourox-orange"
        aria-hidden="true"
      >
        {number}
      </span>
      {title}
    </h2>
  );
}

export function OpsGuideProse({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 text-sm leading-7 text-ourox-ink/70">{children}</div>
  );
}

export function OpsGuideSection({ id, number, title, children }: Props) {
  return (
    <section aria-labelledby={id}>
      <OpsGuideSectionHeading id={id} number={number} title={title} />
      {children}
    </section>
  );
}
