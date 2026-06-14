import type { OpsQaRow } from "@/lib/ops/qa-types";
import { OpsQaTable } from "./OpsQaTable";

interface Props {
  fraudAnalysts: OpsQaRow[];
  juniorAnalysts: OpsQaRow[];
}

export function OpsQaSamplingPanel({ fraudAnalysts, juniorAnalysts }: Props) {
  return (
    <div className="min-w-0 space-y-2">
      <h4 className="text-[10px] font-semibold uppercase tracking-wider text-ourox-ink/45">
        QA sampling
      </h4>
      <p className="max-w-3xl text-[10px] leading-relaxed text-ourox-ink/50">
        Sampled closed work reviewed for pass/fail and defect category. QA score reflects sample
        pass rate — not throughput or cases closed.
      </p>
      <OpsQaTable fraudAnalysts={fraudAnalysts} juniorAnalysts={juniorAnalysts} />
    </div>
  );
}
