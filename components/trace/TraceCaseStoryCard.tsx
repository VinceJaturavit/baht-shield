interface TraceCaseStoryCardProps {
  story: string;
}

export function TraceCaseStoryCard({ story }: TraceCaseStoryCardProps) {
  return (
    <section className="rounded border border-trace-border bg-trace-card px-4 py-3">
      <h2 className="text-xs font-semibold text-trace-heading mb-1.5">Case story</h2>
      <p className="text-xs text-trace-body leading-relaxed">{story}</p>
    </section>
  );
}
