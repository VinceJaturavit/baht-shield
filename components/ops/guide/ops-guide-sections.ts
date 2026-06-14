export interface OpsGuideSectionMeta {
  id: string;
  number: string;
  title: string;
}

export const OPS_GUIDE_SECTIONS: OpsGuideSectionMeta[] = [
  { id: "what-ops-is", number: "1", title: "What Ops is" },
  { id: "intake-streams", number: "2", title: "The five intake streams" },
  { id: "queues-priority", number: "3", title: "Queues & priority" },
  { id: "sla-aging", number: "4", title: "SLA & aging" },
  { id: "roster-sub-views", number: "5", title: "Roster sub-views" },
  { id: "weekly-schedule-coverage", number: "6", title: "Weekly schedule & coverage" },
  { id: "fairness", number: "7", title: "Fairness" },
  { id: "performance", number: "8", title: "Performance" },
  { id: "qa-behaviour", number: "9", title: "QA & behaviour" },
  { id: "four-signals", number: "10", title: "The four signals" },
  { id: "reviews", number: "11", title: "Reviews" },
  { id: "how-it-connects", number: "12", title: "How it connects" },
  { id: "synthetic-boundary", number: "13", title: "Synthetic boundary" },
];

export const OPS_GUIDE_SECTION_IDS = OPS_GUIDE_SECTIONS.map((s) => s.id);
