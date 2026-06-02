import type { CaseNote } from "@/lib/types";

interface CaseTimelineProps {
  notes: CaseNote[];
}

// Normalize author_type → display label and style
function getNoteType(authorType: string): {
  label: string;
  containerClass: string;
  labelClass: string;
  dot: string;
} {
  const key = (authorType ?? "").toLowerCase().replace(/[^a-z_]/g, "");

  switch (key) {
    case "system":
      return {
        label: "System event",
        containerClass: "border-signal-borderSubtle bg-signal-surfaceSubtle",
        labelClass: "text-signal-secondary",
        dot: "bg-signal-faintSlate",
      };
    case "ai_copilot":
    case "aicopilot":
      return {
        label: "AI-assisted draft",
        containerClass: "border-signal-indigoBorder bg-signal-indigoSubtle",
        labelClass: "text-signal-indigo",
        dot: "bg-signal-indigo",
      };
    case "analyst":
      return {
        label: "Analyst note",
        containerClass: "border-signal-border bg-signal-surface",
        labelClass: "text-signal-body",
        dot: "bg-signal-slate",
      };
    case "decision":
      return {
        label: "Decision",
        containerClass: "border-signal-border bg-signal-surface",
        labelClass: "text-signal-ink font-semibold",
        dot: "bg-signal-ink",
      };
    case "escalation":
      return {
        label: "Escalation",
        containerClass: "border-signal-amberBorder bg-signal-amberSubtle",
        labelClass: "text-signal-body",
        dot: "bg-signal-amber",
      };
    case "closure":
      return {
        label: "Closure",
        containerClass: "border-signal-accentBorder bg-signal-accentSubtle/40",
        labelClass: "text-signal-accent",
        dot: "bg-signal-accent",
      };
    default:
      return {
        label: "Note",
        containerClass: "border-signal-borderSubtle bg-signal-surface",
        labelClass: "text-signal-secondary",
        dot: "bg-signal-faintSlate",
      };
  }
}

export function CaseTimeline({ notes }: CaseTimelineProps) {
  if (notes.length === 0) {
    return (
      <section className="overflow-hidden rounded-signal border border-signal-border bg-signal-surface shadow-signalSubtle">
        <div className="border-b border-signal-borderSubtle bg-signal-surfaceSubtle px-5 py-3">
          <h2 className="text-sm font-semibold text-signal-ink">Case timeline</h2>
        </div>
        <div className="px-5 py-8 text-center text-sm text-signal-secondary">
          No case notes found for this synthetic case.
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-signal border border-signal-border bg-signal-surface shadow-signalSubtle">
      <div className="border-b border-signal-borderSubtle bg-signal-surfaceSubtle px-5 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-signal-ink">Case timeline</h2>
          <span className="inline-flex items-center rounded-full border border-signal-border bg-signal-surfaceSubtle px-2 py-0.5 text-xs font-medium tabular-nums text-signal-slate">
            {notes.length}
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-signal-faint">Sorted ascending by timestamp</p>
      </div>

      <div className="space-y-3 px-5 py-4">
        {notes.map((note) => {
          const { label, containerClass, labelClass, dot } = getNoteType(note.author_type);
          return (
            <div
              key={note.note_id}
              className={`overflow-hidden rounded-signalSm border ${containerClass}`}
            >
              <div className="flex items-center justify-between border-b border-inherit px-4 py-2">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${labelClass}`}>
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
                  {label}
                </span>
                <span className="text-[11px] text-signal-faint">
                  {note.timestamp || "—"}
                </span>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs leading-relaxed text-signal-body">{note.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
