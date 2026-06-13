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
  { id: "roster-capacity-shifts", number: "5", title: "Roster, capacity & shifts" },
  { id: "fair-kpis", number: "6", title: "Fair KPIs" },
  { id: "how-it-connects", number: "7", title: "How it connects" },
  { id: "synthetic-boundary", number: "8", title: "Synthetic boundary" },
];

export const OPS_GUIDE_SECTION_IDS = OPS_GUIDE_SECTIONS.map((s) => s.id);
