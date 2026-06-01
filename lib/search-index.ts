// Local in-memory search index for the SignalOS command bar.
// No backend, no API, no external search library.
// Sources: lib/seed-data.ts only.

import {
  walletAccounts,
  alerts,
  cases,
  analystPatterns,
  devices,
  beneficiaries,
  transactions,
} from "./seed-data";
import type { SearchResult, SearchResultType } from "./types";

// ---------------------------------------------------------------------------
// Command actions
// ---------------------------------------------------------------------------

const COMMAND_ACTIONS: SearchResult[] = [
  {
    id: "cmd-dashboard",
    type: "command",
    title: "Open Dashboard",
    subtitle: "Go to the main dashboard",
    route: "/",
    keywords: ["dashboard", "home", "overview", "open dashboard"],
  },
  {
    id: "cmd-alerts",
    type: "command",
    title: "Open Alert Queue",
    subtitle: "Review active alerts",
    route: "/alerts",
    keywords: ["alerts", "alert queue", "queue", "open alert"],
  },
  {
    id: "cmd-patterns",
    type: "command",
    title: "View Pattern Intelligence",
    subtitle: "Browse analyst-curated patterns",
    route: "/patterns",
    keywords: ["patterns", "pattern intelligence", "analyst patterns"],
  },
  {
    id: "cmd-cases",
    type: "command",
    title: "Open Cases",
    subtitle: "Case management",
    route: "/cases",
    keywords: ["cases", "case management", "open cases"],
  },
  {
    id: "cmd-entities",
    type: "command",
    title: "Open Wallets / Entities",
    subtitle: "Entity-level search and review",
    route: "/entities",
    keywords: ["wallets", "entities", "wallet entities", "open entities"],
  },
  {
    id: "cmd-analytics",
    type: "command",
    title: "Open Analytics",
    subtitle: "Operational KPIs and trends",
    route: "/analytics",
    keywords: ["analytics", "kpis", "trends", "performance", "open analytics"],
  },
  {
    id: "cmd-settings",
    type: "command",
    title: "Open Settings",
    subtitle: "Workspace configuration",
    route: "/settings",
    keywords: ["settings", "configuration", "preferences", "open settings"],
  },
  {
    id: "cmd-clear-filters",
    type: "command",
    title: "Clear filters",
    subtitle: "Reset Alert Queue filters",
    route: "/alerts",
    keywords: ["clear", "reset", "filters", "clear filters"],
  },
];

// ---------------------------------------------------------------------------
// Build index
// ---------------------------------------------------------------------------

let _cachedIndex: SearchResult[] | null = null;

export function buildSearchIndex(): SearchResult[] {
  if (_cachedIndex) return _cachedIndex;

  // Build a user_id → wallet_id lookup for device and beneficiary routing
  const userToWallet = new Map<string, string>();
  for (const w of walletAccounts) {
    if (!userToWallet.has(w.user_id)) {
      userToWallet.set(w.user_id, w.wallet_id);
    }
  }

  // Build a beneficiary_id → wallet_id lookup via transactions
  const benToWallet = new Map<string, string>();
  for (const t of transactions) {
    if (t.beneficiary_id && !benToWallet.has(t.beneficiary_id)) {
      benToWallet.set(t.beneficiary_id, t.wallet_id);
    }
  }

  // Build an alert_id → wallet_id lookup for case routing
  const alertToWallet = new Map<string, string>();
  for (const a of alerts) {
    alertToWallet.set(a.alert_id, a.wallet_id);
  }

  const results: SearchResult[] = [...COMMAND_ACTIONS];

  // Wallets
  for (const w of walletAccounts) {
    results.push({
      id: w.wallet_id,
      type: "wallet",
      title: w.wallet_id,
      subtitle: `Wallet · ${w.status} · ฿${w.balance.toLocaleString()}`,
      route: `/wallet/${w.wallet_id}`,
      keywords: [w.wallet_id.toLowerCase(), w.user_id.toLowerCase(), w.status],
    });
  }

  // Alerts
  for (const a of alerts) {
    results.push({
      id: a.alert_id,
      type: "alert",
      title: a.alert_id,
      subtitle: `Alert · ${a.rule_name} · ${a.severity}`,
      route: `/alerts?alertId=${a.alert_id}`,
      keywords: [
        a.alert_id.toLowerCase(),
        a.rule_name.toLowerCase(),
        a.wallet_id.toLowerCase(),
        a.severity,
        a.status,
      ],
    });
  }

  // Cases
  for (const c of cases) {
    const walletId = alertToWallet.get(c.alert_id);
    const route = walletId
      ? `/wallet/${walletId}?caseId=${c.case_id}`
      : `/cases?caseId=${c.case_id}`;
    const subtitle = walletId
      ? `Case · ${c.decision} · linked wallet ${walletId}`
      : `Case · ${c.decision} · owner ${c.owner}`;
    results.push({
      id: c.case_id,
      type: "case",
      title: c.case_id,
      subtitle,
      route,
      keywords: [
        c.case_id.toLowerCase(),
        c.alert_id.toLowerCase(),
        c.decision.toLowerCase(),
        c.owner.toLowerCase(),
        ...(walletId ? [walletId.toLowerCase()] : []),
      ],
    });
  }

  // Patterns
  for (const p of analystPatterns) {
    results.push({
      id: p.pattern_id,
      type: "pattern",
      title: p.pattern_id,
      subtitle: `Pattern · ${p.name}`,
      route: `/patterns?patternId=${p.pattern_id}`,
      keywords: [
        p.pattern_id.toLowerCase(),
        p.name.toLowerCase(),
        p.cluster_type.toLowerCase(),
        p.status.toLowerCase(),
        ...p.variables.toLowerCase().split(/[\s,;]+/).filter(Boolean),
      ],
    });
  }

  // Devices
  for (const d of devices) {
    const walletId = userToWallet.get(d.user_id);
    const route = walletId
      ? `/wallet/${walletId}?deviceId=${d.device_id}`
      : `/entities?deviceId=${d.device_id}`;
    results.push({
      id: d.device_id,
      type: "device",
      title: d.device_id,
      subtitle: `Device · ${d.os} · risk ${d.risk_score}${walletId ? ` · wallet ${walletId}` : ""}`,
      route,
      keywords: [
        d.device_id.toLowerCase(),
        d.user_id.toLowerCase(),
        d.os.toLowerCase(),
        String(d.risk_score),
        ...(walletId ? [walletId.toLowerCase()] : []),
      ],
    });
  }

  // Endpoints / Beneficiaries
  for (const b of beneficiaries) {
    const walletId = benToWallet.get(b.beneficiary_id);
    const route = walletId
      ? `/wallet/${walletId}?beneficiaryId=${b.beneficiary_id}`
      : `/entities?beneficiaryId=${b.beneficiary_id}`;
    results.push({
      id: b.beneficiary_id,
      type: "endpoint",
      title: b.beneficiary_id,
      subtitle: `Endpoint · ${b.bank_code || b.wallet_provider || "—"} · ${b.country}`,
      route,
      keywords: [
        b.beneficiary_id.toLowerCase(),
        b.name.toLowerCase(),
        (b.bank_code || "").toLowerCase(),
        (b.wallet_provider || "").toLowerCase(),
        b.country.toLowerCase(),
        ...(walletId ? [walletId.toLowerCase()] : []),
      ],
    });
  }

  _cachedIndex = results;
  return results;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

const TYPE_PRIORITY: Record<SearchResultType, number> = {
  command: 0,
  wallet: 1,
  alert: 2,
  case: 3,
  pattern: 4,
  device: 5,
  endpoint: 6,
};

export function searchSignalOS(query: string): SearchResult[] {
  const index = buildSearchIndex();
  const q = query.trim().toLowerCase();

  if (!q) {
    // Empty query: show all commands + top 4 of each object type
    const commands = index.filter((r) => r.type === "command");
    const objects = (["wallet", "alert", "case", "pattern", "device", "endpoint"] as SearchResultType[]).flatMap(
      (type) => index.filter((r) => r.type === type).slice(0, 4)
    );
    return [...commands, ...objects].slice(0, 40);
  }

  const exactId: SearchResult[] = [];
  const startsWith: SearchResult[] = [];
  const includes: SearchResult[] = [];

  for (const item of index) {
    const inTitle = item.title.toLowerCase();
    const inSubtitle = (item.subtitle ?? "").toLowerCase();
    const inKeywords = item.keywords.join(" ");

    if (inTitle === q) {
      exactId.push(item);
    } else if (
      inTitle.startsWith(q) ||
      item.keywords.some((k) => k.startsWith(q))
    ) {
      startsWith.push(item);
    } else if (
      inTitle.includes(q) ||
      inSubtitle.includes(q) ||
      inKeywords.includes(q)
    ) {
      includes.push(item);
    }
  }

  const sortByType = (a: SearchResult, b: SearchResult) =>
    TYPE_PRIORITY[a.type] - TYPE_PRIORITY[b.type];

  const merged = [
    ...exactId.sort(sortByType),
    ...startsWith.sort(sortByType),
    ...includes.sort(sortByType),
  ];

  // Deduplicate by id
  const seen = new Set<string>();
  const deduped: SearchResult[] = [];
  for (const r of merged) {
    if (!seen.has(r.id)) {
      seen.add(r.id);
      deduped.push(r);
    }
  }

  return deduped.slice(0, 40);
}

// ---------------------------------------------------------------------------
// Group
// ---------------------------------------------------------------------------

const GROUP_ORDER: SearchResultType[] = [
  "command",
  "wallet",
  "alert",
  "case",
  "pattern",
  "device",
  "endpoint",
];

export function groupSearchResults(
  results: SearchResult[]
): Partial<Record<SearchResultType, SearchResult[]>> {
  const groups: Partial<Record<SearchResultType, SearchResult[]>> = {};

  for (const item of results) {
    const group = groups[item.type] ?? [];
    if (group.length < 8) {
      group.push(item);
      groups[item.type] = group;
    }
  }

  // Re-order keys by GROUP_ORDER
  const ordered: Partial<Record<SearchResultType, SearchResult[]>> = {};
  for (const type of GROUP_ORDER) {
    if (groups[type]?.length) {
      ordered[type] = groups[type];
    }
  }

  return ordered;
}
