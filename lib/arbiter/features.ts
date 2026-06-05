// Arbiter Phase 1 — Feature Layer
//
// Computes all 12 Phase 1 fraud features from the event + server-side context.
// IMPORTANT: This function accepts only Omit<ArbiterEvent, '_scenario_label'>.
// The _scenario_label field is stripped at the API layer before reaching here.
// No feature uses or reads _scenario_label.

import type { ArbiterEvent, ArbiterFeatureResult } from './contract';
import { getArbiterHistoricalContext } from './context';
import { normalizeFeatureValue } from './normalize';

// ---------------------------------------------------------------------------
// Haversine distance — public formula, km
// ---------------------------------------------------------------------------
function haversineKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ---------------------------------------------------------------------------
// Main feature computation
// _scenario_label CANNOT appear in this signature by type constraint.
// ---------------------------------------------------------------------------
export async function computeArbiterFeatures(
  event: Omit<ArbiterEvent, '_scenario_label'>,
): Promise<ArbiterFeatureResult[]> {
  const ctx = await getArbiterHistoricalContext(event);
  const eventTs = new Date(event.timestamp);

  // F1 — amt_to_mean_ratio with cold-start guard
  // Cold-start guard: wallets with insufficient 30d outbound history are assigned
  // neutral amount-ratio risk so first large legitimate transfers do not max the
  // score purely due to missing history.
  const amtToMeanRatio =
    ctx.walletOutboundCount30d < 3
      ? 1.0  // neutral value (normalizes to 0.1 via /10 cap) — does not inflate cold wallets
      : event.amount_thb / (ctx.walletMeanOutbound30d + 1);

  // F2 — velocity_1h (rolling 60-minute outbound count; Spec-002: driven by MB history)
  const velocity1h = ctx.walletOutboundCountLast60m;

  // F3 — account_age_days
  const walletCreatedTs = new Date(ctx.walletCreatedAt);
  const accountAgeDays = Math.max(
    0,
    Math.floor((eventTs.getTime() - walletCreatedTs.getTime()) / (1000 * 3600 * 24)),
  );

  // F4 — is_new_beneficiary (true if beneficiary created within 48h of event)
  const isNewBeneficiary = (() => {
    if (!event.beneficiary_id || !ctx.beneficiaryCreatedAt) return false;
    const benTs = new Date(ctx.beneficiaryCreatedAt);
    const ageHours = (eventTs.getTime() - benTs.getTime()) / (1000 * 3600);
    return ageHours >= 0 && ageHours < 48;
  })();

  // F5 — device_account_count
  const deviceAccountCount = ctx.distinctWalletsOnDevice;

  // F6 — withdrawal_after_deposit
  // sum outbound last 1h / (sum inbound last 24h + 1)
  const withdrawalAfterDeposit = ctx.walletOutboundSumLast1h / (ctx.walletInboundSumLast24h + 1);

  // F7 — sleeper_velocity_shock
  // max(0, z-score of 24h outbound vs 180d baseline) * ln(dormancy_days + e)
  // Gate: only non-zero when dormancyDays >= 30
  const sleeperVelocityShock = (() => {
    if (ctx.dormancyDays < 30) return 0;
    const zscore =
      ctx.walletOutboundStd180d > 0
        ? (ctx.walletOutboundSumLast24h - ctx.walletOutboundMean180d) /
          ctx.walletOutboundStd180d
        : 0;
    const shock = Math.max(0, zscore) * Math.log(ctx.dormancyDays + Math.E);
    return shock;
  })();

  // F8 — geo_velocity (km/h via Haversine)
  const geoVelocity = (() => {
    const current = event.geo;
    const prev = ctx.previousGeo;
    const prevTs = ctx.previousGeoTimestamp ? new Date(ctx.previousGeoTimestamp) : null;
    if (!current || !prev || !prevTs) return 0;
    const hoursElapsed = (eventTs.getTime() - prevTs.getTime()) / (1000 * 3600);
    if (hoursElapsed <= 0) return 0;
    const km = haversineKm(prev.lat, prev.lon, current.lat, current.lon);
    return km / hoursElapsed;
  })();

  // F9 — is_night_transaction (Thailand local time UTC+7, 00:00–05:00)
  const isNightTransaction = (() => {
    const localHour = (eventTs.getUTCHours() + 7) % 24;
    return localHour >= 0 && localHour < 5;
  })();

  // F10 — daily_cumulative_thb (rolling 24h outbound sum)
  const dailyCumulativeThb = ctx.walletOutboundSumLast24h;

  // F11 — beneficiary_risk_tier
  const beneficiaryRiskTier = ctx.beneficiaryRiskTier;

  // F12 — pattern_match_count (from graph_edges; see context.ts and seed assessment)
  const patternMatchCount = ctx.patternMatchCount;

  // ---------------------------------------------------------------------------
  // Build result array with normalized values and explanations
  // ---------------------------------------------------------------------------
  const features: Array<{
    key: string;
    value: number | boolean | string;
    explanation: string;
  }> = [
    {
      key: 'amt_to_mean_ratio',
      value: amtToMeanRatio,
      explanation:
        ctx.walletOutboundCount30d < 3
          ? `Cold-start guard applied (${ctx.walletOutboundCount30d} prior outbound in 30d, need ≥ 3): neutral amount-ratio risk assigned. First large legitimate transfers should not max the score purely due to missing history.`
          : `Transaction amount is ${amtToMeanRatio.toFixed(2)}× the wallet 30d mean — detects unusually large movement.`,
    },
    {
      key: 'velocity_1h',
      value: velocity1h,
      explanation: `${velocity1h} outbound transaction(s) in the last 60 min — detects rapid burst behaviour.`,
    },
    {
      key: 'account_age_days',
      value: accountAgeDays,
      explanation: `Wallet is ${accountAgeDays} day(s) old — new wallets with high movement are higher risk.`,
    },
    {
      key: 'is_new_beneficiary',
      value: isNewBeneficiary,
      explanation: isNewBeneficiary
        ? 'Beneficiary first seen < 48 h ago — new cash-out endpoints increase mule/APP-scam risk.'
        : 'Beneficiary is established (≥ 48 h old).',
    },
    {
      key: 'device_account_count',
      value: deviceAccountCount,
      explanation: `${deviceAccountCount} distinct wallet(s) share this device — detects mule farms or device sharing.`,
    },
    {
      key: 'withdrawal_after_deposit',
      value: withdrawalAfterDeposit,
      explanation: `Outbound/inbound ratio is ${withdrawalAfterDeposit.toFixed(3)} — detects rapid pass-through after funding.`,
    },
    {
      key: 'sleeper_velocity_shock',
      value: sleeperVelocityShock,
      explanation:
        ctx.dormancyDays < 30
          ? `Dormancy ${ctx.dormancyDays} d < 30 d gate — sleeper shock not triggered.`
          : `Dormancy ${ctx.dormancyDays} d, shock score ${sleeperVelocityShock.toFixed(3)} — detects sudden wallet reactivation.`,
    },
    {
      key: 'geo_velocity',
      value: geoVelocity,
      explanation:
        geoVelocity === 0
          ? 'No prior geo available — velocity set to 0.'
          : `Travel speed ${geoVelocity.toFixed(0)} km/h from previous location — detects impossible travel.`,
    },
    {
      key: 'is_night_transaction',
      value: isNightTransaction,
      explanation: isNightTransaction
        ? 'Transaction occurred 00:00–05:00 Thailand local time.'
        : 'Transaction occurred during daytime hours.',
    },
    {
      key: 'daily_cumulative_thb',
      value: dailyCumulativeThb,
      explanation: `Rolling 24 h outbound total is ฿${dailyCumulativeThb.toLocaleString()} — detects daily cap/new-user movement risk.`,
    },
    {
      key: 'beneficiary_risk_tier',
      value: beneficiaryRiskTier,
      explanation: `Beneficiary risk tier: ${beneficiaryRiskTier} — known or suspected risky endpoint.`,
    },
    {
      key: 'pattern_match_count',
      value: patternMatchCount,
      explanation:
        patternMatchCount > 0
          ? `${patternMatchCount} analyst pattern(s) matched to this wallet via graph edges.`
          : 'No analyst patterns matched to this wallet.',
    },
  ];

  return features.map((f) => ({
    ...f,
    normalized_value: normalizeFeatureValue(f.key, f.value),
  }));
}
