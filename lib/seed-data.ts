// Local JSON seed imports — no database, no API routes, no external fetch.
// Seed files live in data/seed/ and must NOT be modified at runtime.

import alertsRaw from "@/data/seed/alerts.json";
import casesRaw from "@/data/seed/cases.json";
import transactionsRaw from "@/data/seed/transactions.json";
import walletAccountsRaw from "@/data/seed/wallet_accounts.json";
import analystPatternsRaw from "@/data/seed/analyst_patterns.json";
import usersRaw from "@/data/seed/users.json";
import kycEventsRaw from "@/data/seed/kyc_events.json";
import devicesRaw from "@/data/seed/devices.json";
import simBindingsRaw from "@/data/seed/phone_sim_bindings.json";
import beneficiariesRaw from "@/data/seed/beneficiaries.json";
import caseNotesRaw from "@/data/seed/case_notes.json";
import graphEdgesRaw from "@/data/seed/graph_edges.json";

import type {
  Alert,
  FraudCase,
  Transaction,
  WalletAccount,
  AnalystPattern,
  User,
  KycEvent,
  Device,
  SimBinding,
  Beneficiary,
  CaseNote,
  GraphEdge,
} from "./types";

export const alerts = alertsRaw as Alert[];
export const cases = casesRaw as FraudCase[];
export const transactions = transactionsRaw as Transaction[];
export const walletAccounts = walletAccountsRaw as WalletAccount[];
export const analystPatterns = analystPatternsRaw as AnalystPattern[];
export const users = usersRaw as User[];
export const kycEvents = kycEventsRaw as KycEvent[];
export const devices = devicesRaw as Device[];
export const simBindings = simBindingsRaw as SimBinding[];
export const beneficiaries = beneficiariesRaw as Beneficiary[];
export const caseNotes = caseNotesRaw as CaseNote[];
export const graphEdges = graphEdgesRaw as GraphEdge[];
