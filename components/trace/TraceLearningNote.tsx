import type { ReactNode } from "react";

interface TraceLearningNoteProps {
  title: string;
  children: ReactNode;
}

export function TraceLearningNote({ title, children }: TraceLearningNoteProps) {
  return (
    <details className="rounded border border-trace-border bg-trace-surface">
      <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-trace-primary hover:bg-trace-muted transition-colors">
        {title}
      </summary>
      <div className="border-t border-trace-border px-3 py-2 text-xs text-trace-body leading-relaxed">
        {children}
      </div>
    </details>
  );
}
