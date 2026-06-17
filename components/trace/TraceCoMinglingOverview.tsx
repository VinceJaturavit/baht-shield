import type { TraceCase } from "@/lib/trace/types";
import { TRACE_BOUNDARY } from "@/lib/trace/boundary";
import { TraceAmount } from "./TraceAmount";
import { TraceLearningNote } from "./TraceLearningNote";

interface TraceCoMinglingOverviewProps {
  traceCase: TraceCase;
}

export function TraceCoMinglingOverview({ traceCase }: TraceCoMinglingOverviewProps) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-trace-heading mb-1">
        Understand why method choice changes attribution
      </h2>
      <p className="mb-4 text-xs text-trace-secondary leading-relaxed">
        {TRACE_BOUNDARY.frozenPoolCaption}
      </p>

      <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs rounded-lg border border-trace-border bg-trace-card px-4 py-4">
        <div>
          <span className="text-trace-secondary block">Pool total before outflow</span>
          <TraceAmount
            amount={traceCase.poolTotalBeforeOutflow}
            asset={traceCase.asset}
            className="text-trace-heading text-sm mt-0.5 font-medium"
          />
        </div>
        <div>
          <span className="text-trace-secondary block">Frozen (seized) amount</span>
          <TraceAmount
            amount={traceCase.frozenAmount}
            asset={traceCase.asset}
            className="text-trace-primary text-sm mt-0.5 font-medium"
          />
        </div>
        <div>
          <span className="text-trace-secondary block">Co-mingled</span>
          <span className="text-trace-heading font-medium mt-0.5 block">Yes — victim and scammer funds mixed</span>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <TraceLearningNote title="What is co-mingling?">
          Co-mingling means multiple sources of value entered the same pool before the seized
          outflow. Once mixed, the investigator must apply a defensible tracing method.
        </TraceLearningNote>
        <TraceLearningNote title="Why do FIFO and LIFO differ?">
          FIFO follows the earliest supported deposits first. LIFO follows the latest supported
          deposits first. In this case, that difference changes Alice from 10,000 under FIFO to 0
          under LIFO.
        </TraceLearningNote>
      </div>

      <p className="text-xs text-trace-body leading-relaxed">
        Proceed to Method decision to compare FIFO, LIFO, LIBR, and pro-rata on the same frozen
        pool and select a defensible approach.
      </p>
    </section>
  );
}
