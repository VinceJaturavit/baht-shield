import { surface, text } from "@/lib/design-tokens";

interface AnalyticsPanelProps {
  title: string;
  caption: string;
  sourceNote: string;
  children: React.ReactNode;
}

export function AnalyticsPanel({
  title,
  caption,
  sourceNote,
  children,
}: AnalyticsPanelProps) {
  return (
    <div className={`${surface.cardPadded} flex flex-col gap-4`}>
      <div>
        <h2 className={text.sectionTitle}>{title}</h2>
        <p className="mt-1 text-[13px] leading-5 text-signal-slate italic">
          {caption}
        </p>
      </div>

      <div className="flex-1">{children}</div>

      <p className="border-t border-signal-borderSubtle pt-3 text-[11px] leading-4 text-signal-meta">
        {sourceNote}
      </p>
    </div>
  );
}
