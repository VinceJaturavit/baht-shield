/**
 * Baht-Shield — Synthetic Seed Data Generator
 * Spec-001: Synthetic Dataset Generator
 *
 * All data is synthetic and illustrative.
 * No real customer data. No prior employer IP. No Kraken/Payward references.
 */

import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Deterministic seed — same output every run
// ---------------------------------------------------------------------------
faker.seed(20260530);

const SEED_DATE = new Date("2026-05-30T12:00:00Z");
const OUTPUT_DIR = path.join(process.cwd(), "data", "seed");

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

function pad(n: number, len = 6): string {
  return String(n).padStart(len, "0");
}

function isoTs(date: Date): string {
  return date.toISOString();
}

function daysAgo(days: number): Date {
  const d = new Date(SEED_DATE);
  d.setDate(d.getDate() - days);
  return d;
}

function hoursAgo(hours: number): Date {
  const d = new Date(SEED_DATE);
  d.setHours(d.getHours() - hours);
  return d;
}

function randBetween(min: number, max: number): number {
  return faker.number.int({ min, max });
}

function randFloat(min: number, max: number, decimals = 2): number {
  return parseFloat(faker.number.float({ min, max, fractionDigits: decimals }).toFixed(decimals));
}

function pickOne<T>(arr: T[]): T {
  return arr[faker.number.int({ min: 0, max: arr.length - 1 })];
}

function fakeThaiFakePhone(suffix: number): string {
  return `+6699000${String(suffix).padStart(4, "0")}`;
}

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

interface User {
  user_id: string;
  created_at: string;
  country: string;
  kyc_tier: string;
  segment: string;
}

interface WalletAccount {
  wallet_id: string;
  user_id: string;
  status: string;
  balance: number;
  last_active_at: string;
}

interface KycEvent {
  kyc_event_id: string;
  user_id: string;
  doc_type: string;
  liveness_score: number;
  decision: string;
}

interface Device {
  device_id: string;
  user_id: string;
  first_seen_at: string;
  os: string;
  risk_score: number;
}

interface PhoneSimBinding {
  binding_id: string;
  user_id: string;
  msisdn: string;
  sim_change_count: number;
}

interface Beneficiary {
  beneficiary_id: string;
  name: string;
  bank_code: string;
  wallet_provider: string;
  country: string;
}

interface Transaction {
  txn_id: string;
  wallet_id: string;
  direction: string;
  amount: number;
  channel: string;
  beneficiary_id: string;
  device_id: string;
}

interface Alert {
  alert_id: string;
  rule_name: string;
  severity: string;
  wallet_id: string;
  status: string;
}

interface Case {
  case_id: string;
  alert_id: string;
  owner: string;
  decision: string;
  loss_amount: number;
  opened_at: string;
  closed_at: string | null;
}

interface CaseNote {
  note_id: string;
  case_id: string;
  author_type: string;
  content: string;
  timestamp: string;
}

interface AnalystPattern {
  pattern_id: string;
  name: string;
  variables: string;
  cluster_type: string;
  status: string;
  created_by: string;
}

interface GraphEdge {
  from_entity: string;
  to_entity: string;
  edge_type: string;
  weight: number;
}

// ---------------------------------------------------------------------------
// Global data stores
// ---------------------------------------------------------------------------

const users: User[] = [];
const walletAccounts: WalletAccount[] = [];
const kycEvents: KycEvent[] = [];
const devices: Device[] = [];
const phoneSimBindings: PhoneSimBinding[] = [];
const beneficiaries: Beneficiary[] = [];
const transactions: Transaction[] = [];
const alerts: Alert[] = [];
const cases: Case[] = [];
const caseNotes: CaseNote[] = [];
const analystPatterns: AnalystPattern[] = [];
const graphEdges: GraphEdge[] = [];

// Counters for sequential IDs
let txnCounter = 1;
let alertCounter = 1;
let noteCounter = 1;

// Lookup sets for referential integrity
const userIds = new Set<string>();
const walletIds = new Set<string>();
const deviceIds = new Set<string>();
const beneficiaryIds = new Set<string>();
const alertIds = new Set<string>();
const caseIds = new Set<string>();

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

const COUNTRIES = ["TH", "MM", "KH", "LA", "VN", "PH", "ID", "MY"];
const COUNTRY_WEIGHTS = [65, 10, 5, 3, 5, 4, 4, 4]; // Thailand-heavy

const KYC_TIERS = ["basic", "verified", "enhanced"];
const SEGMENTS = ["retail", "migrant_worker", "merchant", "student", "freelancer", "small_business"];
const DOC_TYPES = ["thai_id_card", "passport", "work_permit", "pink_card", "business_registration"];
const OS_TYPES = ["iOS", "Android", "Android_low_cost", "Web"];
const BANK_CODES = ["BKK", "SCB", "KTB", "KBANK", "BAY", "AGENT", "XBDR"];
const WALLET_PROVIDERS = ["baht_wallet", "bank_account", "agent_cashout", "convenience_cashout", "cross_border_wallet"];
const CHANNELS = ["wallet_transfer", "qr_payment", "agent_cashin", "agent_cashout", "convenience_cashout", "bill_pay", "cross_border_remittance", "card_topup"];
const ALERT_STATUSES = ["new", "in_review", "escalated", "closed"];
const CASE_DECISIONS = ["pending", "clear", "close_account", "escalate_compliance", "monitor", "suspend_wallet"];
const ANALYST_NAMES = ["Nattawut P.", "Siriporn K.", "Malee T.", "Anucha W.", "Wanida S.", "Priya M.", "Theerawat C.", "Kanokwan B."];

function weightedCountry(): string {
  const total = COUNTRY_WEIGHTS.reduce((a, b) => a + b, 0);
  let r = faker.number.int({ min: 0, max: total - 1 });
  for (let i = 0; i < COUNTRIES.length; i++) {
    r -= COUNTRY_WEIGHTS[i];
    if (r < 0) return COUNTRIES[i];
  }
  return "TH";
}

// ---------------------------------------------------------------------------
// Step 1 — Background users
// ---------------------------------------------------------------------------

function generateBackgroundUsers(count: number): void {
  console.log(`  Generating ${count} background users...`);
  for (let i = 1; i <= count; i++) {
    const userId = `USR_${pad(i)}`;
    const createdDaysAgo = randBetween(30, 730);
    users.push({
      user_id: userId,
      created_at: isoTs(daysAgo(createdDaysAgo)),
      country: weightedCountry(),
      kyc_tier: pickOne(KYC_TIERS),
      segment: pickOne(SEGMENTS),
    });
    userIds.add(userId);
  }
}

// ---------------------------------------------------------------------------
// Step 2 — Wallet accounts (one per user)
// ---------------------------------------------------------------------------

function generateWalletAccounts(): void {
  console.log(`  Generating wallet accounts...`);
  const STATUSES = ["active", "active", "active", "active", "dormant", "under_review", "suspended", "closed"];
  users.forEach((u, i) => {
    const walletId = `WAL_${pad(i + 1)}`;
    const lastActiveDaysAgo = randBetween(0, 60);
    walletAccounts.push({
      wallet_id: walletId,
      user_id: u.user_id,
      status: pickOne(STATUSES),
      balance: randBetween(50, 50000),
      last_active_at: isoTs(daysAgo(lastActiveDaysAgo)),
    });
    walletIds.add(walletId);
  });
}

// ---------------------------------------------------------------------------
// Step 3 — KYC events (one per user, some with rejections)
// ---------------------------------------------------------------------------

function generateKycEvents(): void {
  console.log(`  Generating KYC events...`);
  let counter = 1;
  users.forEach((u) => {
    const docType = pickOne(DOC_TYPES);
    const decision = faker.number.float() < 0.82 ? "approved" : faker.number.float() < 0.5 ? "rejected" : "manual_review";
    kycEvents.push({
      kyc_event_id: `KYC_${pad(counter++)}`,
      user_id: u.user_id,
      doc_type: docType,
      liveness_score: randFloat(0.55, 0.99),
      decision,
    });
  });
}

// ---------------------------------------------------------------------------
// Step 4 — Devices (one per user, some shared later via scenarios)
// ---------------------------------------------------------------------------

function generateDevices(): void {
  console.log(`  Generating devices...`);
  users.forEach((u, i) => {
    const deviceId = `DEV_${pad(i + 1)}`;
    devices.push({
      device_id: deviceId,
      user_id: u.user_id,
      first_seen_at: isoTs(daysAgo(randBetween(1, 400))),
      os: pickOne(OS_TYPES),
      risk_score: randBetween(5, 85),
    });
    deviceIds.add(deviceId);
  });
}

// ---------------------------------------------------------------------------
// Step 5 — Phone/SIM bindings
// ---------------------------------------------------------------------------

function generatePhoneSimBindings(): void {
  console.log(`  Generating phone/SIM bindings...`);
  let simCounter = 1;
  users.forEach((u) => {
    const msisdn = `+66${randBetween(80, 99)}${String(randBetween(1000000, 9999999))}`;
    phoneSimBindings.push({
      binding_id: `SIM_${pad(simCounter++)}`,
      user_id: u.user_id,
      msisdn,
      sim_change_count: randBetween(0, 3),
    });
  });
}

// ---------------------------------------------------------------------------
// Step 6 — Beneficiaries (background + scenario endpoints added later)
// ---------------------------------------------------------------------------

function generateBeneficiaries(count: number): void {
  console.log(`  Generating ${count} beneficiaries...`);
  for (let i = 1; i <= count; i++) {
    const benId = `BEN_${pad(i)}`;
    const bankCode = pickOne(BANK_CODES);
    const provider = bankCode === "AGENT" ? "agent_cashout"
      : bankCode === "XBDR" ? "cross_border_wallet"
      : pickOne(["baht_wallet", "bank_account"]);
    beneficiaries.push({
      beneficiary_id: benId,
      name: `${faker.person.lastName()} ${faker.finance.accountNumber(6)}`,
      bank_code: bankCode,
      wallet_provider: provider,
      country: weightedCountry(),
    });
    beneficiaryIds.add(benId);
  }
}

// ---------------------------------------------------------------------------
// Step 7 — Background transactions
// ---------------------------------------------------------------------------

function generateBackgroundTransactions(targetCount: number): void {
  console.log(`  Generating ~${targetCount} background transactions...`);
  const bgWallets = walletAccounts.filter((w) => w.status === "active" || w.status === "dormant");
  const bgDeviceList = devices.slice(0, bgWallets.length);
  const benList = beneficiaries.slice(0, 800);

  for (let i = 0; i < targetCount; i++) {
    const wallet = bgWallets[i % bgWallets.length];
    const device = bgDeviceList[i % bgDeviceList.length];
    const ben = benList[i % benList.length];
    const channel = pickOne(CHANNELS);
    const direction = channel === "agent_cashin" || channel === "card_topup" ? "inbound" : "outbound";
    const txnId = `TXN_${pad(txnCounter++, 7)}`;
    transactions.push({
      txn_id: txnId,
      wallet_id: wallet.wallet_id,
      direction,
      amount: randBetween(50, 15000),
      channel,
      beneficiary_id: ben.beneficiary_id,
      device_id: device.device_id,
    });
  }
}

// ---------------------------------------------------------------------------
// Scenario helpers
// ---------------------------------------------------------------------------

function addAlert(walletId: string, ruleName: string, severity: string): string {
  const alertId = `ALT_${pad(alertCounter++)}`;
  alerts.push({
    alert_id: alertId,
    rule_name: ruleName,
    severity,
    wallet_id: walletId,
    status: pickOne(ALERT_STATUSES),
  });
  alertIds.add(alertId);
  return alertId;
}

function addCase(
  caseId: string,
  alertId: string,
  decision: string,
  lossAmount: number,
  openedDaysAgo: number,
  closedDaysAgo: number | null
): void {
  const openedAt = isoTs(daysAgo(openedDaysAgo));
  const closedAt = closedDaysAgo !== null ? isoTs(daysAgo(closedDaysAgo)) : null;
  cases.push({
    case_id: caseId,
    alert_id: alertId,
    owner: pickOne(ANALYST_NAMES),
    decision,
    loss_amount: lossAmount,
    opened_at: openedAt,
    closed_at: closedAt,
  });
  caseIds.add(caseId);
}

function addNote(caseId: string, authorType: string, content: string, daysAgoN: number): void {
  caseNotes.push({
    note_id: `NOTE_${pad(noteCounter++)}`,
    case_id: caseId,
    author_type: authorType,
    content,
    timestamp: isoTs(daysAgo(daysAgoN)),
  });
}

// ---------------------------------------------------------------------------
// Step 8 — Scenario 1: Onboarding Mule Farm
// ---------------------------------------------------------------------------

function injectOnboardingMuleFarm(): void {
  console.log("  Injecting Scenario 1: Onboarding Mule Farm...");

  const MULE_COUNT = 55;
  const SHARED_DEVICES = 8;
  const muleUserBase = users.length;

  // Shared devices for the farm
  const sharedDeviceIds: string[] = [];
  for (let d = 1; d <= SHARED_DEVICES; d++) {
    const devId = `DEV_SHARED_MF_${pad(d, 3)}`;
    sharedDeviceIds.push(devId);
    deviceIds.add(devId);
    // Register device — user_id points to first mule that will use it
    devices.push({
      device_id: devId,
      user_id: `USR_MF_${pad(1, 3)}`, // linked to first mule; others share it
      first_seen_at: isoTs(daysAgo(randBetween(5, 10))),
      os: "Android_low_cost",
      risk_score: randBetween(12, 38), // LOW — naive rule won't fire
    });
  }

  // Shared SIM group for the farm
  const sharedSimPhone = "+66990000001";

  // Clustered signup window — all within 72 hours of 20 days ago
  const clusterBase = daysAgo(20);

  for (let i = 1; i <= MULE_COUNT; i++) {
    const userId = `USR_MF_${pad(i, 3)}`;
    const walletId = `WAL_MF_${pad(i, 3)}`;
    const kycId = `KYC_MF_A_${pad(i, 4)}`;
    const simId = `SIM_MF_${pad(i, 3)}`;
    const assignedDevice = sharedDeviceIds[i % SHARED_DEVICES];

    // User — signed up in a tight 72-hour cluster
    const offsetHours = randBetween(0, 71);
    const signupDate = new Date(clusterBase.getTime() + offsetHours * 3600 * 1000);
    users.push({
      user_id: userId,
      created_at: isoTs(signupDate),
      country: "TH",
      kyc_tier: "basic",
      segment: "retail",
    });
    userIds.add(userId);

    // Wallet — mostly active or under_review
    const wStatus = i <= 45 ? "active" : "under_review";
    walletAccounts.push({
      wallet_id: walletId,
      user_id: userId,
      status: wStatus,
      balance: randBetween(100, 3000),
      last_active_at: isoTs(daysAgo(randBetween(1, 5))),
    });
    walletIds.add(walletId);

    // KYC — approved, liveness clustered 0.82–0.96
    kycEvents.push({
      kyc_event_id: kycId,
      user_id: userId,
      doc_type: "thai_id_card", // repeated artifact
      liveness_score: randFloat(0.82, 0.96),
      decision: "approved", // passes individually
    });

    // Device — shared with others (risk < 40)
    devices.push({
      device_id: `DEV_MF_${pad(i, 3)}`,
      user_id: userId,
      first_seen_at: isoTs(signupDate),
      os: "Android_low_cost",
      risk_score: randBetween(10, 35),
    });
    deviceIds.add(`DEV_MF_${pad(i, 3)}`);

    // SIM binding — similar range to show clustering
    phoneSimBindings.push({
      binding_id: simId,
      user_id: userId,
      msisdn: fakeThaiFakePhone(i),
      sim_change_count: randBetween(0, 2),
    });

    // Small transactions — individually look normal
    const benId = beneficiaries[i % 200]?.beneficiary_id ?? "BEN_000001";
    for (let t = 0; t < 3; t++) {
      transactions.push({
        txn_id: `TXN_MF_${pad(i, 3)}_${t + 1}`,
        wallet_id: walletId,
        direction: t === 0 ? "inbound" : "outbound",
        amount: randBetween(200, 3500),
        channel: "wallet_transfer",
        beneficiary_id: benId,
        device_id: assignedDevice,
      });
    }

    // Alert + Case for first 25 mules
    if (i <= 25) {
      const alertId = addAlert(walletId, "PATTERN_MULE_FARM_CLUSTER", "high");
      const caseId = `CASE_MF_${pad(i, 3)}`;
      const isOpen = i > 20;
      addCase(
        caseId,
        alertId,
        isOpen ? "pending" : "close_account",
        randBetween(0, 8000),
        randBetween(3, 15),
        isOpen ? null : randBetween(1, 2)
      );
      addNote(caseId, "system", `Alert fired: PATTERN_MULE_FARM_CLUSTER. Wallet ${walletId} linked to shared device cluster.`, randBetween(3, 15));
      addNote(caseId, "ai_copilot", `Pattern match: Onboarding Mule Farm (PAT_MF_001). Device ${assignedDevice} shared across ${MULE_COUNT} accounts registered within 72h. Individual liveness score ${randFloat(0.82, 0.96)} — acceptable. Cluster liveness variance < 0.14 — suspicious. Individual device risk ${randBetween(10, 35)} — below threshold. Shared device count: ${SHARED_DEVICES}. Naive rules: no individual trigger. Pattern layer: cluster detected.`, randBetween(2, 14));
      addNote(caseId, "analyst", `Confirmed mule farm. Accounts share device ${assignedDevice}. Recommending close_account across cluster.`, randBetween(1, 3));

      // Graph edges
      graphEdges.push({ from_entity: walletId, to_entity: assignedDevice, edge_type: "shared_device", weight: randBetween(70, 99) });
      graphEdges.push({ from_entity: walletId, to_entity: "PAT_MF_001", edge_type: "pattern_match", weight: randBetween(80, 99) });
      graphEdges.push({ from_entity: userId, to_entity: sharedSimPhone, edge_type: "shared_sim", weight: randBetween(60, 90) });
    }
  }

  // Cross-device graph edges between shared devices
  for (let d = 0; d < sharedDeviceIds.length; d++) {
    for (let d2 = d + 1; d2 < sharedDeviceIds.length; d2++) {
      graphEdges.push({ from_entity: sharedDeviceIds[d], to_entity: sharedDeviceIds[d2], edge_type: "shared_device", weight: randBetween(50, 85) });
    }
  }

  console.log(`    MF: ${MULE_COUNT} users, ${SHARED_DEVICES} shared devices, 25 cases`);
}

// ---------------------------------------------------------------------------
// Step 9 — Scenario 2: Sleeper Mule Activation
// ---------------------------------------------------------------------------

function injectSleeperMuleActivation(): void {
  console.log("  Injecting Scenario 2: Sleeper Mule Activation...");

  const SLEEPER_COUNT = 60;
  const SHARED_ENDPOINTS = 7; // beneficiaries all sleepers converge on

  // Shared destination beneficiaries
  const sleeperBenIds: string[] = [];
  for (let b = 1; b <= SHARED_ENDPOINTS; b++) {
    const benId = `BEN_SM_END_${pad(b, 3)}`;
    beneficiaries.push({
      beneficiary_id: benId,
      name: `Endpoint Cashout ${b} (synthetic)`,
      bank_code: b <= 4 ? "AGENT" : "XBDR",
      wallet_provider: b <= 4 ? "agent_cashout" : "cross_border_wallet",
      country: b <= 5 ? "TH" : pickOne(["MM", "KH", "LA"]),
    });
    beneficiaryIds.add(benId);
    sleeperBenIds.push(benId);
  }

  for (let i = 1; i <= SLEEPER_COUNT; i++) {
    const userId = `USR_SM_${pad(i, 3)}`;
    const walletId = `WAL_SM_${pad(i, 3)}`;
    const deviceId = `DEV_SM_${pad(i, 3)}`;
    const simId = `SIM_SM_${pad(i, 3)}`;

    // User created 120–300 days ago — AGED
    const createdDaysBack = randBetween(120, 300);
    users.push({
      user_id: userId,
      created_at: isoTs(daysAgo(createdDaysBack)),
      country: "TH",
      kyc_tier: "verified",
      segment: "retail",
    });
    userIds.add(userId);

    // Wallet — was dormant, now recently active
    walletAccounts.push({
      wallet_id: walletId,
      user_id: userId,
      status: "active",
      balance: randBetween(500, 12000),
      last_active_at: isoTs(daysAgo(randBetween(1, 7))), // RECENTLY activated
    });
    walletIds.add(walletId);

    // KYC — clean
    kycEvents.push({
      kyc_event_id: `KYC_SM_${pad(i, 4)}`,
      user_id: userId,
      doc_type: "thai_id_card",
      liveness_score: randFloat(0.75, 0.95),
      decision: "approved",
    });

    // Device — normal risk score
    devices.push({
      device_id: deviceId,
      user_id: userId,
      first_seen_at: isoTs(daysAgo(createdDaysBack)),
      os: pickOne(["Android", "iOS"]),
      risk_score: randBetween(5, 30), // LOW — individually looks fine
    });
    deviceIds.add(deviceId);

    phoneSimBindings.push({
      binding_id: simId,
      user_id: userId,
      msisdn: `+6681${String(randBetween(1000000, 9999999))}`,
      sim_change_count: 0,
    });

    // Transactions — moderate amounts, below naive thresholds
    const endpointBen = sleeperBenIds[i % SHARED_ENDPOINTS];
    transactions.push({
      txn_id: `TXN_SM_${pad(i, 3)}_IN`,
      wallet_id: walletId,
      direction: "inbound",
      amount: randBetween(900, 7500), // moderate
      channel: "wallet_transfer",
      beneficiary_id: beneficiaries[randBetween(0, 400)]?.beneficiary_id ?? "BEN_000001",
      device_id: deviceId,
    });
    transactions.push({
      txn_id: `TXN_SM_${pad(i, 3)}_OUT`,
      wallet_id: walletId,
      direction: "outbound",
      amount: randBetween(800, 7000), // passes out rapidly
      channel: i % 3 === 0 ? "cross_border_remittance" : "agent_cashout",
      beneficiary_id: endpointBen,
      device_id: deviceId,
    });

    // Alert + Case for first 30
    if (i <= 30) {
      const alertId = addAlert(walletId, "PATTERN_SLEEPER_MULE_ACTIVATION", "high");
      const caseId = `CASE_SM_${pad(i, 3)}`;
      const isOpen = i > 25;
      addCase(
        caseId,
        alertId,
        isOpen ? "pending" : "suspend_wallet",
        randBetween(1000, 25000),
        randBetween(2, 10),
        isOpen ? null : randBetween(1, 2)
      );
      addNote(caseId, "system", `Alert fired: PATTERN_SLEEPER_MULE_ACTIVATION. Wallet ${walletId} dormant ${createdDaysBack - 7} days then sudden activity.`, randBetween(2, 10));
      addNote(caseId, "ai_copilot", `Pattern match: Sleeper Mule Activation (PAT_SM_001). Account age: ${createdDaysBack} days. Last active: 1–7 days ago. Inbound: ${randBetween(900, 7500)} THB. Outbound same day to known endpoint ${endpointBen}. Individual device risk: ${randBetween(5, 30)} — below threshold. Individual transaction amount: below 10,000 THB. Pattern layer: dormant-then-spike matched; shared endpoint with ${SLEEPER_COUNT - 1} other accounts.`, randBetween(1, 9));
      addNote(caseId, "analyst", `Sleeper confirmed. Fast pass-through to ${endpointBen}. Suspending wallet. Escalating endpoint cluster.`, randBetween(1, 2));

      graphEdges.push({ from_entity: walletId, to_entity: endpointBen, edge_type: "cashout_endpoint", weight: randBetween(75, 95) });
      graphEdges.push({ from_entity: walletId, to_entity: "PAT_SM_001", edge_type: "pattern_match", weight: randBetween(80, 98) });
      graphEdges.push({ from_entity: endpointBen, to_entity: "PAT_ENDPOINT_001", edge_type: "cashout_endpoint", weight: randBetween(60, 90) });
    }
  }

  // Cross-sleeper endpoint convergence edges
  for (let b = 0; b < sleeperBenIds.length; b++) {
    graphEdges.push({ from_entity: sleeperBenIds[b], to_entity: "PAT_SM_001", edge_type: "pattern_match", weight: randBetween(70, 95) });
  }

  console.log(`    SM: ${SLEEPER_COUNT} sleeper wallets, ${SHARED_ENDPOINTS} shared endpoints, 30 cases`);
}

// ---------------------------------------------------------------------------
// Step 10 — Scenario 3: APP Scam Cash-out Ring
// ---------------------------------------------------------------------------

function injectAppScamCashoutRing(): void {
  console.log("  Injecting Scenario 3: APP Scam Cash-out Ring...");

  const VICTIM_COUNT = 45;
  const MULE_COUNT = 15;
  const CASHOUT_ENDPOINT_COUNT = 4;

  // Known cash-out endpoint beneficiaries (curated list)
  const cashoutBenIds: string[] = [];
  for (let c = 1; c <= CASHOUT_ENDPOINT_COUNT; c++) {
    const benId = `BEN_APP_END_${pad(c, 3)}`;
    beneficiaries.push({
      beneficiary_id: benId,
      name: `Known Cashout Point ${c} (synthetic)`,
      bank_code: c <= 2 ? "AGENT" : "XBDR",
      wallet_provider: c <= 2 ? "convenience_cashout" : "cross_border_wallet",
      country: c <= 3 ? "TH" : "MM",
    });
    beneficiaryIds.add(benId);
    cashoutBenIds.push(benId);

    graphEdges.push({ from_entity: benId, to_entity: "PAT_ENDPOINT_001", edge_type: "cashout_endpoint", weight: randBetween(85, 99) });
    graphEdges.push({ from_entity: benId, to_entity: "PAT_APP_001", edge_type: "pattern_match", weight: randBetween(80, 98) });
  }

  // Cross-border exit
  const crossBorderBen = `BEN_APP_XBDR_001`;
  beneficiaries.push({
    beneficiary_id: crossBorderBen,
    name: "Cross-Border Exit Point 001 (synthetic)",
    bank_code: "XBDR",
    wallet_provider: "cross_border_wallet",
    country: "MM",
  });
  beneficiaryIds.add(crossBorderBen);
  graphEdges.push({ from_entity: crossBorderBen, to_entity: "PAT_ENDPOINT_002", edge_type: "cross_border_exit", weight: randBetween(85, 99) });

  // Mule wallets
  const mulWalletIds: string[] = [];
  for (let m = 1; m <= MULE_COUNT; m++) {
    const userId = `USR_APP_MUL_${pad(m, 3)}`;
    const walletId = `WAL_APP_MUL_${pad(m, 3)}`;
    const deviceId = `DEV_APP_MUL_${pad(m, 3)}`;

    users.push({
      user_id: userId,
      created_at: isoTs(daysAgo(randBetween(30, 180))),
      country: "TH",
      kyc_tier: "basic",
      segment: "retail",
    });
    userIds.add(userId);

    walletAccounts.push({
      wallet_id: walletId,
      user_id: userId,
      status: "active",
      balance: randBetween(200, 5000),
      last_active_at: isoTs(daysAgo(randBetween(1, 14))),
    });
    walletIds.add(walletId);

    kycEvents.push({
      kyc_event_id: `KYC_APP_MUL_${pad(m, 4)}`,
      user_id: userId,
      doc_type: "thai_id_card",
      liveness_score: randFloat(0.78, 0.95),
      decision: "approved",
    });

    devices.push({
      device_id: deviceId,
      user_id: userId,
      first_seen_at: isoTs(daysAgo(randBetween(30, 180))),
      os: "Android",
      risk_score: randBetween(10, 35),
    });
    deviceIds.add(deviceId);

    phoneSimBindings.push({
      binding_id: `SIM_APP_MUL_${pad(m, 3)}`,
      user_id: userId,
      msisdn: `+6682${String(randBetween(1000000, 9999999))}`,
      sim_change_count: randBetween(0, 1),
    });

    mulWalletIds.push(walletId);
  }

  // Victim wallets — send money (victims, not mules)
  for (let v = 1; v <= VICTIM_COUNT; v++) {
    const userId = `USR_APP_VIC_${pad(v, 3)}`;
    const walletId = `WAL_APP_VIC_${pad(v, 3)}`;
    const deviceId = `DEV_APP_VIC_${pad(v, 3)}`;
    const targetMuleWallet = mulWalletIds[v % MULE_COUNT];
    const targetCashout = cashoutBenIds[v % CASHOUT_ENDPOINT_COUNT];

    users.push({
      user_id: userId,
      created_at: isoTs(daysAgo(randBetween(60, 400))),
      country: pickOne(["TH", "TH", "TH", "MM", "VN"]),
      kyc_tier: pickOne(["verified", "enhanced"]),
      segment: pickOne(["retail", "student", "merchant"]),
    });
    userIds.add(userId);

    walletAccounts.push({
      wallet_id: walletId,
      user_id: userId,
      status: "active",
      balance: randBetween(0, 2000),
      last_active_at: isoTs(daysAgo(randBetween(1, 30))),
    });
    walletIds.add(walletId);

    kycEvents.push({
      kyc_event_id: `KYC_APP_VIC_${pad(v, 4)}`,
      user_id: userId,
      doc_type: pickOne(["thai_id_card", "passport"]),
      liveness_score: randFloat(0.72, 0.99),
      decision: "approved",
    });

    devices.push({
      device_id: deviceId,
      user_id: userId,
      first_seen_at: isoTs(daysAgo(randBetween(60, 400))),
      os: pickOne(["iOS", "Android"]),
      risk_score: randBetween(5, 40),
    });
    deviceIds.add(deviceId);

    phoneSimBindings.push({
      binding_id: `SIM_APP_VIC_${pad(v, 3)}`,
      user_id: userId,
      msisdn: `+6683${String(randBetween(1000000, 9999999))}`,
      sim_change_count: 0,
    });

    // Victim sends → mule wallet (looks like normal transfer)
    transactions.push({
      txn_id: `TXN_APP_VIC_${pad(v, 3)}_OUT`,
      wallet_id: walletId,
      direction: "outbound",
      amount: randBetween(1500, 9500), // below 10k naive threshold
      channel: "wallet_transfer",
      beneficiary_id: targetMuleWallet.replace("WAL", "BEN") + "_proxy", // conceptual link
      device_id: deviceId,
    });

    // Mule wallet sends → cashout endpoint
    transactions.push({
      txn_id: `TXN_APP_MUL_${pad(v, 3)}_OUT`,
      wallet_id: targetMuleWallet,
      direction: "outbound",
      amount: randBetween(1400, 9000),
      channel: v % 4 === 0 ? "cross_border_remittance" : pickOne(["agent_cashout", "convenience_cashout"]),
      beneficiary_id: targetCashout,
      device_id: `DEV_APP_MUL_${pad((v % MULE_COUNT) + 1, 3)}`,
    });

    // Graph: victim → mule → cashout
    graphEdges.push({ from_entity: walletId, to_entity: targetMuleWallet, edge_type: "paid_beneficiary", weight: randBetween(60, 85) });
    graphEdges.push({ from_entity: targetMuleWallet, to_entity: targetCashout, edge_type: "cashout_endpoint", weight: randBetween(75, 95) });
  }

  // Alerts + Cases (30 for APP scam)
  for (let i = 1; i <= 30; i++) {
    const muleWallet = mulWalletIds[i % MULE_COUNT];
    const alertId = addAlert(muleWallet, "PATTERN_APP_SCAM_CASHOUT_RING", "critical");
    const caseId = `CASE_APP_${pad(i, 3)}`;
    const cashoutBen = cashoutBenIds[i % CASHOUT_ENDPOINT_COUNT];
    const isOpen = i > 25;
    addCase(
      caseId,
      alertId,
      isOpen ? "pending" : "escalate_compliance",
      randBetween(3000, 45000),
      randBetween(1, 14),
      isOpen ? null : randBetween(1, 3)
    );
    addNote(caseId, "system", `Alert fired: PATTERN_APP_SCAM_CASHOUT_RING. Mule wallet ${muleWallet} receiving from multiple victims, passing to known cashout ${cashoutBen}.`, randBetween(1, 14));
    addNote(caseId, "ai_copilot", `Pattern match: APP Scam Cash-out Ring (PAT_APP_001). Endpoint ${cashoutBen} appears in ${randBetween(5, 18)} cases. Fan-in from ${randBetween(3, 8)} victim wallets detected. Each transaction ${randBetween(1500, 9500)} THB — below naive threshold. Victim-authorized payments — naive rules do not fire. Endpoint intelligence: PAT_ENDPOINT_001 curated list match. Pattern layer: cashout endpoint reuse detected.`, randBetween(1, 13));
    addNote(caseId, "analyst", `APP scam confirmed. Victim funds routed through ${muleWallet} to ${cashoutBen}. Escalating to compliance. Blocking endpoint cluster.`, randBetween(1, 2));

    graphEdges.push({ from_entity: muleWallet, to_entity: "PAT_APP_001", edge_type: "pattern_match", weight: randBetween(80, 99) });
    if (i % 5 === 0) {
      graphEdges.push({ from_entity: cashoutBen, to_entity: crossBorderBen, edge_type: "cross_border_exit", weight: randBetween(70, 92) });
    }
  }

  console.log(`    APP: ${VICTIM_COUNT} victim wallets, ${MULE_COUNT} mule wallets, ${CASHOUT_ENDPOINT_COUNT} cashout endpoints, 30 cases`);
}

// ---------------------------------------------------------------------------
// Step 11 — Background alerts (noise)
// ---------------------------------------------------------------------------

function generateBackgroundAlerts(count: number): void {
  console.log(`  Generating ${count} background alerts...`);
  const BACKGROUND_RULES = [
    "RULE_HIGH_AMOUNT_TRANSFER",
    "RULE_DEVICE_RISK_MEDIUM",
    "RULE_KYC_REVIEW",
    "RULE_CASHOUT_FREQUENCY",
    "RULE_FAILED_KYC_ATTEMPT",
    "RULE_DORMANT_REACTIVATION",
    "RULE_CROSS_BORDER_TRANSFER",
  ];
  const SEVERITIES = ["low", "low", "medium", "medium", "high"];
  const bgWallets = walletAccounts.filter((w) => !w.wallet_id.startsWith("WAL_MF") && !w.wallet_id.startsWith("WAL_SM") && !w.wallet_id.startsWith("WAL_APP"));

  for (let i = 0; i < count; i++) {
    const wallet = bgWallets[i % bgWallets.length];
    addAlert(wallet.wallet_id, pickOne(BACKGROUND_RULES), pickOne(SEVERITIES));
  }
}

// ---------------------------------------------------------------------------
// Step 12 — Background cases (noise)
// ---------------------------------------------------------------------------

function generateBackgroundCases(count: number): void {
  console.log(`  Generating ${count} background cases...`);
  const bgAlerts = alerts.filter((a) => !a.rule_name.startsWith("PATTERN_"));
  for (let i = 1; i <= count && i <= bgAlerts.length; i++) {
    const alert = bgAlerts[i - 1];
    const caseId = `CASE_${pad(i + 1000)}`;
    addCase(
      caseId,
      alert.alert_id,
      pickOne(CASE_DECISIONS),
      randBetween(0, 20000),
      randBetween(1, 30),
      faker.number.float() < 0.7 ? randBetween(1, 25) : null
    );
    addNote(caseId, "analyst", `Reviewed. Decision: ${pickOne(CASE_DECISIONS)}.`, randBetween(1, 30));
    addNote(caseId, "system", `Case auto-created from alert ${alert.alert_id}.`, randBetween(1, 30));
  }
}

// ---------------------------------------------------------------------------
// Step 13 — Analyst patterns
// ---------------------------------------------------------------------------

function generateAnalystPatterns(): void {
  console.log("  Generating analyst patterns...");

  const required: AnalystPattern[] = [
    {
      pattern_id: "PAT_MF_001",
      name: "Onboarding Mule Farm Cluster",
      variables: "shared_device_count >= 6; signup_window <= 72h; repeated_doc_type = thai_id_card; liveness_scores_clustered = true; individual_device_score < 40",
      cluster_type: "onboarding_mule",
      status: "verified",
      created_by: "analyst",
    },
    {
      pattern_id: "PAT_SM_001",
      name: "Sleeper Mule Activation Cluster",
      variables: "account_age_days >= 120; days_since_last_active > 90; inbound_count >= 2 in 24h; outbound_to_known_endpoint = true; individual_velocity_below_threshold = true",
      cluster_type: "sleeper_mule",
      status: "verified",
      created_by: "analyst",
    },
    {
      pattern_id: "PAT_APP_001",
      name: "APP Scam Cash-out Ring",
      variables: "endpoint_reuse_count >= 5_cases; victim_fan_in >= 3; outbound_channel in [agent_cashout, convenience_cashout, cross_border_remittance]; amount_per_hop < 10000 THB; victim_authorized_payment = true",
      cluster_type: "app_scam_cashout",
      status: "verified",
      created_by: "fraud_intelligence",
    },
    {
      pattern_id: "PAT_ENDPOINT_001",
      name: "Known Agent Cash-out Endpoint",
      variables: "beneficiary_wallet_provider = agent_cashout; endpoint_appears_in_cases >= 3; linked_to_mule_wallet = true",
      cluster_type: "cashout_endpoint",
      status: "verified",
      created_by: "analyst",
    },
    {
      pattern_id: "PAT_ENDPOINT_002",
      name: "Cross-Border Exit Endpoint",
      variables: "beneficiary_country in [MM, KH, LA]; channel = cross_border_remittance; linked_to_mule_ring = true; amount_per_txn < 10000 THB",
      cluster_type: "cashout_endpoint",
      status: "probable",
      created_by: "fraud_intelligence",
    },
  ];

  analystPatterns.push(...required);

  // Additional background/emerging patterns
  const extras = [
    { id: "PAT_BG_001", name: "High-Frequency QR Merchant Split", cluster: "background_noise", status: "emerging" },
    { id: "PAT_BG_002", name: "Cross-Border Migrant Remittance Cluster", cluster: "background_noise", status: "emerging" },
    { id: "PAT_BG_003", name: "SIM Swap Account Takeover Precursor", cluster: "onboarding_mule", status: "probable" },
    { id: "PAT_BG_004", name: "Repeated Failed KYC — Re-submission Ring", cluster: "onboarding_mule", status: "emerging" },
    { id: "PAT_BG_005", name: "Agent Cash-in Structuring Pattern", cluster: "cashout_endpoint", status: "probable" },
    { id: "PAT_BG_006", name: "Student Segment Peer-Transfer Ring", cluster: "background_noise", status: "emerging" },
    { id: "PAT_BG_007", name: "Convenience Cashout Velocity Burst", cluster: "app_scam_cashout", status: "probable" },
    { id: "PAT_BG_008", name: "Multi-Wallet Fan-Out Pre-Exit", cluster: "sleeper_mule", status: "probable" },
    { id: "PAT_BG_009", name: "Low-Cost Device Cluster Registration", cluster: "onboarding_mule", status: "emerging" },
    { id: "PAT_BG_010", name: "Bill Pay Structuring — Round-Amount Cluster", cluster: "background_noise", status: "retired" },
  ];

  extras.forEach((e, idx) => {
    analystPatterns.push({
      pattern_id: e.id,
      name: e.name,
      variables: `cluster_type = ${e.cluster}; analyst_flagged = true; case_count >= ${randBetween(2, 15)}`,
      cluster_type: e.cluster,
      status: e.status,
      created_by: pickOne(["analyst", "fraud_intelligence", "system_seed"]),
    });
  });
}

// ---------------------------------------------------------------------------
// Step 14 — Extra graph edges (background connectivity)
// ---------------------------------------------------------------------------

function generateExtraGraphEdges(count: number): void {
  console.log(`  Generating ${count} extra graph edges...`);
  const bgWallets = walletAccounts.filter((w) => w.status === "active").slice(0, 500);
  const bgBens = beneficiaries.slice(0, 300);

  for (let i = 0; i < count; i++) {
    const wallet = bgWallets[i % bgWallets.length];
    const ben = bgBens[i % bgBens.length];
    graphEdges.push({
      from_entity: wallet.wallet_id,
      to_entity: ben.beneficiary_id,
      edge_type: "paid_beneficiary",
      weight: randBetween(10, 60),
    });
  }
}

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------

function writeSeedFiles(): void {
  console.log("\n  Writing JSON seed files...");
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files: Record<string, unknown[]> = {
    "users.json": users,
    "wallet_accounts.json": walletAccounts,
    "kyc_events.json": kycEvents,
    "devices.json": devices,
    "phone_sim_bindings.json": phoneSimBindings,
    "beneficiaries.json": beneficiaries,
    "transactions.json": transactions,
    "alerts.json": alerts,
    "cases.json": cases,
    "case_notes.json": caseNotes,
    "analyst_patterns.json": analystPatterns,
    "graph_edges.json": graphEdges,
  };

  for (const [filename, data] of Object.entries(files)) {
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`    ✅ ${filename}: ${data.length.toLocaleString()} records`);
  }
}

// ---------------------------------------------------------------------------
// Write seed manifest
// ---------------------------------------------------------------------------

function writeSeedManifest(): void {
  const mfCases = cases.filter((c) => c.case_id.startsWith("CASE_MF_")).length;
  const smCases = cases.filter((c) => c.case_id.startsWith("CASE_SM_")).length;
  const appCases = cases.filter((c) => c.case_id.startsWith("CASE_APP_")).length;
  const totalScenarioCases = mfCases + smCases + appCases;

  const manifest = {
    generated_at: isoTs(new Date()),
    seed_date: "2026-05-30",
    note: "All data synthetic and illustrative — no real customer or employer data. No Kraken/Payward references.",
    table_counts: {
      users: users.length,
      wallet_accounts: walletAccounts.length,
      kyc_events: kycEvents.length,
      devices: devices.length,
      phone_sim_bindings: phoneSimBindings.length,
      beneficiaries: beneficiaries.length,
      transactions: transactions.length,
      alerts: alerts.length,
      cases: cases.length,
      case_notes: caseNotes.length,
      analyst_patterns: analystPatterns.length,
      graph_edges: graphEdges.length,
    },
    scenario_counts: {
      onboarding_mule_farm_cases: mfCases,
      sleeper_mule_activation_cases: smCases,
      app_scam_cashout_ring_cases: appCases,
      total_scenario_cases: totalScenarioCases,
    },
    required_patterns: analystPatterns.filter((p) => ["PAT_MF_001", "PAT_SM_001", "PAT_APP_001", "PAT_ENDPOINT_001", "PAT_ENDPOINT_002"].includes(p.pattern_id)).map((p) => p.pattern_id),
    timing_note: "transactions table has no timestamp field per Spec-001. Sequence encoded in txn_id prefixes (TXN_SM_NNN_IN before TXN_SM_NNN_OUT). Timing logic documented in case_notes.",
    contrast_note: "Scenario accounts: individual device risk < 40, KYC approved, amounts < 10,000 THB. Pattern layer detects clusters via shared devices, shared endpoints, graph edges, and curated analyst_patterns.",
    spec: "Spec-001-synthetic-data-seed",
    version: "1.0.0",
  };

  const manifestPath = path.join(OUTPUT_DIR, "seed_manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`    ✅ seed_manifest.json`);

  console.log("\n  Scenario summary:");
  console.log(`    Onboarding Mule Farm cases: ${mfCases}`);
  console.log(`    Sleeper Mule Activation cases: ${smCases}`);
  console.log(`    APP Scam Cash-out Ring cases: ${appCases}`);
  console.log(`    Total scenario cases: ${totalScenarioCases}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log("=== Baht-Shield Synthetic Seed Generator (Spec-001) ===");
  console.log("All data synthetic and illustrative. No real data.\n");

  const BACKGROUND_USER_COUNT = 10000;
  const BACKGROUND_BEN_COUNT = 900;
  const BACKGROUND_TXN_COUNT = 160000;
  const BACKGROUND_ALERT_COUNT = 380;
  const BACKGROUND_CASE_COUNT = 250;
  const EXTRA_EDGE_COUNT = 1200;

  console.log("Phase 1: Background data");
  generateBackgroundUsers(BACKGROUND_USER_COUNT);
  generateWalletAccounts();
  generateKycEvents();
  generateDevices();
  generatePhoneSimBindings();
  generateBeneficiaries(BACKGROUND_BEN_COUNT);
  generateBackgroundTransactions(BACKGROUND_TXN_COUNT);

  console.log("\nPhase 2: Fraud scenarios");
  injectOnboardingMuleFarm();
  injectSleeperMuleActivation();
  injectAppScamCashoutRing();

  console.log("\nPhase 3: Alerts, cases, patterns, edges");
  generateBackgroundAlerts(BACKGROUND_ALERT_COUNT);
  generateBackgroundCases(BACKGROUND_CASE_COUNT);
  generateAnalystPatterns();
  generateExtraGraphEdges(EXTRA_EDGE_COUNT);

  console.log("\nPhase 4: Writing files");
  writeSeedFiles();
  writeSeedManifest();

  console.log("\n=== Seed generation complete ===");
}

main().catch((err) => {
  console.error("Seed generation failed:", err);
  process.exit(1);
});
