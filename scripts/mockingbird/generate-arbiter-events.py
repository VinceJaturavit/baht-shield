#!/usr/bin/env python3
"""
Mockingbird — Arbiter Phase 2 Synthetic Event Generator

PURPOSE: Offline-only synthetic data generation for Arbiter demo coverage.
This script is NEVER imported by Next.js, NEVER called by the API route,
and is NOT part of the request path. It is a one-time generation tool.

Run: python3 scripts/mockingbird/generate-arbiter-events.py
Output:
  data/arbiter/mockingbird-events.json    (scored events, 353 total)
  data/arbiter/mockingbird-history.json   (prior tx history for rolling windows)

Phase 2 changes vs Phase 1:
  - Fraud scenarios now have time-clustered bursts so velocity_1h,
    withdrawal_after_deposit, and daily_cumulative_thb fire properly.
  - mockingbird-history.json provides prior transaction context for
    Mockingbird wallets so context.ts can compute real rolling windows.
  - Counts expanded: 200 background, 50+ per fraud scenario.
  - Cold-start: background wallets get diffuse prior history so
    walletMeanOutbound30d is non-zero; fraud wallets get burst history.
  - _scenario_label remains metadata only; it never enters scoring.

Scenario counts:
  background:            200
  onboarding_mule_farm:   50
  sleeper_activation:     50
  app_scam_cashout:       50 + 3 ATO = 53

All data is synthetic. No real customer data, no prior-employer logic.
_scenario_label is metadata only; it never enters feature/score/rule pipelines.
"""

import json
import random
import os
from datetime import datetime, timedelta, timezone

# ── Deterministic seed ───────────────────────────────────────────────────────
random.seed(20260602)

BASE_TS = datetime(2026, 5, 30, 12, 0, 0, tzinfo=timezone.utc)

EVENTS_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "data", "arbiter", "mockingbird-events.json"
)
HISTORY_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "data", "arbiter", "mockingbird-history.json"
)

# ── Helpers ──────────────────────────────────────────────────────────────────

def ts_offset(base: datetime, hours_ago: float) -> str:
    return (base - timedelta(hours=hours_ago)).isoformat().replace("+00:00", "Z")

def rand_geo_th():
    return {"lat": round(random.uniform(5.6, 20.5), 4), "lon": round(random.uniform(97.3, 105.7), 4)}

def rand_geo_abroad():
    return {"lat": round(random.uniform(48.0, 55.0), 4), "lon": round(random.uniform(2.0, 20.0), 4)}

def rand_amount_normal():
    """Normal background transaction: 200–8 000 THB."""
    return round(random.uniform(200, 8_000), 2)

def rand_amount_mule():
    """Mule farm transaction: 15 000–75 000 THB."""
    return round(random.uniform(15_000, 75_000), 2)

def rand_amount_sleeper():
    """Sleeper burst transaction: 20 000–80 000 THB."""
    return round(random.uniform(20_000, 80_000), 2)

def rand_amount_scam():
    """APP scam cashout: 30 000–150 000 THB."""
    return round(random.choice([30_000, 50_000, 75_000, 100_000, 150_000]) * random.uniform(0.9, 1.1), 2)

# ── Output lists ─────────────────────────────────────────────────────────────
events = []    # goes to mockingbird-events.json
history = []   # goes to mockingbird-history.json

# ────────────────────────────────────────────────────────────────────────────
# 1. ONBOARDING MULE FARM (50 events)
#
#    Temporal shape:
#      - 10 shared devices; 5 wallets per device (50 wallets total)
#      - Each wallet has a "cluster timestamp" T (event time)
#      - History: 1 inbound at T-120min, then 3 rapid outbound at
#        T-45, T-30, T-15 min.
#      - These 3 history outbounds are also in the 30d window, giving
#        a non-zero walletMeanOutbound30d.
#
#    Drives: velocity_1h (3 prior outbound in window),
#            withdrawal_after_deposit (inbound then rapid outbound),
#            daily_cumulative_thb (burst outbound sum),
#            device_account_count (5 wallets per device)
# ────────────────────────────────────────────────────────────────────────────
shared_devices_mf = [f"DEV_SHARED_MF_{i:03d}" for i in range(1, 11)]  # 10 shared devices

for i in range(1, 51):
    wallet_id = f"WAL_MF_{i:03d}"
    device_id = shared_devices_mf[(i - 1) % len(shared_devices_mf)]
    # Cluster timestamp: random within last 48h of BASE_TS
    hours_ago = random.uniform(1, 47)
    cluster_ts = BASE_TS - timedelta(hours=hours_ago)
    cluster_iso = cluster_ts.isoformat().replace("+00:00", "Z")

    # Burst history: 3 outbound transactions in the 45 min before cluster_ts
    # These drive velocity_1h AND establish walletMeanOutbound30d
    burst_amounts = [rand_amount_mule() for _ in range(3)]
    for j, (delay_min, burst_amt) in enumerate(zip([45, 30, 15], burst_amounts)):
        history.append({
            "wallet_id": wallet_id,
            "timestamp": ts_offset(cluster_ts, delay_min / 60),
            "amount": burst_amt,
            "direction": "outbound",
            "device_id": device_id,
            "beneficiary_id": f"BEN_AGENT_{((i + j) % 3) + 1:03d}",
            "geo": rand_geo_th(),
            "channel": "promptpay",
        })

    # Inbound: 1 large deposit ~2h before burst (drives withdrawal_after_deposit)
    inbound_amount = round(sum(burst_amounts) * random.uniform(0.9, 1.3), 2)
    history.append({
        "wallet_id": wallet_id,
        "timestamp": ts_offset(cluster_ts, 2.0 + random.uniform(0, 0.5)),
        "amount": inbound_amount,
        "direction": "inbound",
        "device_id": device_id,
        "beneficiary_id": None,
        "geo": rand_geo_th(),
        "channel": "promptpay",
    })

    # Main scored event
    amount = rand_amount_mule()
    has_facial = amount <= 50_000 or random.random() > 0.6
    ben_suffix = f"{(i % 3) + 1:03d}"
    events.append({
        "event_id": f"EVT_MF_{i:04d}",
        "wallet_id": wallet_id,
        "timestamp": cluster_iso,
        "amount_thb": amount,
        "direction": "outbound",
        "rail": "promptpay",
        "beneficiary_id": f"BEN_AGENT_{ben_suffix}",
        "device_id": device_id,
        "ip_country": "TH",
        "has_facial_scan": has_facial,
        "geo": rand_geo_th(),
        "source": "mockingbird",
        "_scenario_label": "onboarding_mule_farm",
    })

# ────────────────────────────────────────────────────────────────────────────
# 2. SLEEPER ACTIVATION (50 events)
#
#    Temporal shape:
#      - Older wallets: dormancy 90–300 days
#      - Old history: 5 transactions at T-150d to T-200d (180d baseline)
#      - 1 inbound at T-120min
#      - Burst: 3 outbound at T-50, T-30, T-10 min
#      - Main event at T (outbound)
#
#    Drives: sleeper_velocity_shock (long dormancy + 24h outbound burst),
#            velocity_1h (3 prior outbound in 60min),
#            daily_cumulative_thb (large burst sum),
#            withdrawal_after_deposit (inbound then rapid outbound)
# ────────────────────────────────────────────────────────────────────────────
for i in range(1, 51):
    wallet_id = f"WAL_SM_{i:03d}"
    device_id = f"DEV_SM_{i:03d}"
    dormancy_days = random.randint(90, 300)
    hours_ago = random.uniform(0.5, 12)
    cluster_ts = BASE_TS - timedelta(hours=hours_ago)
    cluster_iso = cluster_ts.isoformat().replace("+00:00", "Z")

    # Old history: 5 transactions to establish 180d mean/std baseline
    old_amounts = [round(random.uniform(5_000, 25_000), 2) for _ in range(5)]
    old_offset_days = random.uniform(150, 200)
    for j, old_amt in enumerate(old_amounts):
        history.append({
            "wallet_id": wallet_id,
            "timestamp": ts_offset(cluster_ts, (old_offset_days - j * 2) * 24),
            "amount": old_amt,
            "direction": "outbound",
            "device_id": device_id,
            "beneficiary_id": f"BEN_{(i * 7 + j) % 100:06d}",
            "geo": rand_geo_th(),
            "channel": "bank_transfer",
        })

    # Inbound deposit 2h before burst (drives withdrawal_after_deposit)
    inbound_amount = round(random.uniform(40_000, 120_000), 2)
    history.append({
        "wallet_id": wallet_id,
        "timestamp": ts_offset(cluster_ts, 2.0 + random.uniform(0, 0.5)),
        "amount": inbound_amount,
        "direction": "inbound",
        "device_id": device_id,
        "beneficiary_id": None,
        "geo": rand_geo_th(),
        "channel": "bank_transfer",
    })

    # Rapid outbound burst: 3 transactions in the 50min before cluster_ts
    for delay_min in [50, 30, 10]:
        history.append({
            "wallet_id": wallet_id,
            "timestamp": ts_offset(cluster_ts, delay_min / 60),
            "amount": rand_amount_sleeper(),
            "direction": "outbound",
            "device_id": device_id,
            "beneficiary_id": f"BEN_XBDR_{i:03d}",
            "geo": rand_geo_th(),
            "channel": "bank_transfer",
        })

    # Main scored event
    amount = rand_amount_sleeper()
    events.append({
        "event_id": f"EVT_SM_{i:04d}",
        "wallet_id": wallet_id,
        "timestamp": cluster_iso,
        "amount_thb": amount,
        "direction": "outbound",
        "rail": "bank_transfer",
        "beneficiary_id": f"BEN_XBDR_{i:03d}",
        "device_id": device_id,
        "ip_country": "TH",
        "has_facial_scan": random.random() > 0.3,
        "geo": rand_geo_th(),
        "source": "mockingbird",
        "_scenario_label": "sleeper_activation",
    })

# ────────────────────────────────────────────────────────────────────────────
# 3. APP SCAM CASH-OUT (50 events)
#
#    Temporal shape:
#      - Large inbound transfer at T-40min (victim funds arrive)
#      - 3 prior outbound transactions at T-20d, T-15d, T-10d
#        (establishes walletMeanOutbound30d for amt_to_mean_ratio)
#      - Main event at T: large outbound to new/black/dark-grey beneficiary
#
#    Drives: withdrawal_after_deposit (large inbound then near-equal outbound),
#            beneficiary_risk_tier (black/dark-grey),
#            is_new_beneficiary (BEN_NEW_ prefix),
#            amt_to_mean_ratio (current amount >> established 30d mean)
# ────────────────────────────────────────────────────────────────────────────
for i in range(1, 51):
    wallet_id = f"WAL_APP_{i:03d}"
    device_id = f"DEV_APP_{i:03d}"
    hours_ago = random.uniform(0.5, 24)
    cluster_ts = BASE_TS - timedelta(hours=hours_ago)
    cluster_iso = cluster_ts.isoformat().replace("+00:00", "Z")

    # Scam amount (the victim's funds that get cashed out)
    scam_amount = rand_amount_scam()

    # Large inbound 30–60 min before the outbound (the victim transfer arrives)
    inbound_amount = round(scam_amount * random.uniform(0.95, 1.05), 2)
    history.append({
        "wallet_id": wallet_id,
        "timestamp": ts_offset(cluster_ts, random.uniform(0.5, 1.0)),
        "amount": inbound_amount,
        "direction": "inbound",
        "device_id": device_id,
        "beneficiary_id": None,
        "geo": rand_geo_th(),
        "channel": "promptpay",
    })

    # 3 prior outbound transactions to establish a 30d mean
    # These are at normal amounts (smaller than the scam), creating a
    # large amt_to_mean_ratio for the current scam event.
    prior_normal_amounts = [round(random.uniform(1_000, 8_000), 2) for _ in range(3)]
    for j, prior_amt in enumerate(prior_normal_amounts):
        history.append({
            "wallet_id": wallet_id,
            "timestamp": ts_offset(cluster_ts, (10 + j * 5) * 24),
            "amount": prior_amt,
            "direction": "outbound",
            "device_id": device_id,
            "beneficiary_id": f"BEN_{(i * 11 + j) % 100:06d}",
            "geo": rand_geo_th(),
            "channel": "promptpay",
        })

    # Beneficiary: mix of black, dark-grey, and new
    if i % 3 == 0:
        ben_id = f"BEN_HIGHRISK_{i:03d}"
    elif i % 3 == 1:
        ben_id = f"BEN_MEDRISK_{i:03d}"
    else:
        ben_id = f"BEN_NEW_{i:03d}"

    geo = rand_geo_abroad() if i % 4 == 0 else rand_geo_th()
    events.append({
        "event_id": f"EVT_APP_{i:04d}",
        "wallet_id": wallet_id,
        "timestamp": cluster_iso,
        "amount_thb": scam_amount,
        "direction": "outbound",
        "rail": "promptpay",
        "beneficiary_id": ben_id,
        "device_id": device_id,
        "ip_country": "TH",
        "has_facial_scan": random.random() > 0.4,
        "geo": geo,
        "source": "mockingbird",
        "_scenario_label": "app_scam_cashout",
    })

# ────────────────────────────────────────────────────────────────────────────
# 4. BACKGROUND (200 events)
#
#    Temporal shape:
#      - Temporally diffuse: events spread over last 7 days
#      - ~100 wallets get modest diffuse prior history (5–10 transactions
#        in the last 30d at various spacings) to establish a non-zero mean
#      - ~100 wallets have no prior history (cold-start guard applies)
#      - No burst activity, no clustering
#
#    Avoids: inflated velocity_1h, withdrawal_after_deposit,
#             daily_cumulative_thb
# ────────────────────────────────────────────────────────────────────────────
rails = ["promptpay", "bank_transfer", "internal"]

for i in range(1, 201):
    wallet_id = f"WAL_BG_{i:03d}"
    device_id = f"DEV_BG_{i:03d}"
    hours_ago = random.uniform(1, 168)
    event_ts = BASE_TS - timedelta(hours=hours_ago)
    event_iso = event_ts.isoformat().replace("+00:00", "Z")

    # First 100 background wallets get diffuse prior history
    # (gives a stable low walletMeanOutbound30d so amt_to_mean_ratio doesn't
    # pin at cold-start neutral for all background events)
    if i <= 100:
        num_prior = random.randint(3, 8)
        for j in range(num_prior):
            # Scatter prior transactions across last 30d, but NOT in last 2h
            # (keeps velocity_1h = 0 and withdrawal_after_deposit = 0)
            prior_hours = random.uniform(3, 720)  # 3h to 30d ago
            history.append({
                "wallet_id": wallet_id,
                "timestamp": ts_offset(event_ts, prior_hours),
                "amount": rand_amount_normal(),
                "direction": random.choice(["outbound", "inbound"]),
                "device_id": device_id,
                "beneficiary_id": f"BEN_{(i * 13 + j) % 200:06d}",
                "geo": rand_geo_th(),
                "channel": random.choice(rails),
            })

    amount = rand_amount_normal()
    direction = random.choice(["outbound", "inbound"])
    events.append({
        "event_id": f"EVT_BG_{i:04d}",
        "wallet_id": wallet_id,
        "timestamp": event_iso,
        "amount_thb": amount,
        "direction": direction,
        "rail": random.choice(rails),
        "beneficiary_id": f"BEN_{i:06d}",
        "device_id": device_id,
        "ip_country": "TH",
        "has_facial_scan": True,
        "geo": rand_geo_th(),
        "source": "mockingbird",
        "_scenario_label": "background",
    })

# ────────────────────────────────────────────────────────────────────────────
# 5. ATO-STYLE GEO VELOCITY EVENTS (3 events — R2 test coverage)
#
#    Uses seed wallet IDs (WAL_000001, WAL_000003, WAL_000004).
#    The migrate-transactions.ts script places a Bangkok-geo transaction
#    on each of these wallets at a specific anchor timestamp.
#    These events occur 30 min after the anchor, with Tokyo/Sydney/Berlin geo.
#    geo_velocity > 9000 km/h → R2 fires.
#    Labelled app_scam_cashout — no new ArbiterScenarioLabel needed.
# ────────────────────────────────────────────────────────────────────────────
ATO_ANCHORS = [
    ("WAL_000001", "2026-05-30T09:30:00.000Z", "2026-05-30T10:00:00.000Z",
     {"lat": 35.6762, "lon": 139.6503}, "EVT_ATO_0001", "BEN_HIGHRISK_ATO1"),
    ("WAL_000003", "2026-05-30T09:00:00.000Z", "2026-05-30T09:30:00.000Z",
     {"lat": -33.8688, "lon": 151.2093}, "EVT_ATO_0002", "BEN_HIGHRISK_ATO2"),
    ("WAL_000004", "2026-05-30T08:45:00.000Z", "2026-05-30T09:15:00.000Z",
     {"lat": 52.5200, "lon": 13.4050}, "EVT_ATO_0003", "BEN_MEDRISK_ATO3"),
]

for (wallet_id, _anchor_ts, ato_ts, geo_abroad, event_id, ben_id) in ATO_ANCHORS:
    events.append({
        "event_id": event_id,
        "wallet_id": wallet_id,
        "timestamp": ato_ts,
        "amount_thb": round(random.uniform(20_000, 50_000), 2),
        "direction": "outbound",
        "rail": "bank_transfer",
        "beneficiary_id": ben_id,
        "device_id": f"DEV_{wallet_id}",
        "ip_country": "TH",
        "has_facial_scan": False,
        "geo": geo_abroad,
        "source": "mockingbird",
        "_scenario_label": "app_scam_cashout",
    })

# ── Write outputs ─────────────────────────────────────────────────────────────
os.makedirs(os.path.dirname(EVENTS_PATH), exist_ok=True)

with open(EVENTS_PATH, "w", encoding="utf-8") as f:
    json.dump(events, f, ensure_ascii=False, indent=2)

with open(HISTORY_PATH, "w", encoding="utf-8") as f:
    json.dump(history, f, ensure_ascii=False, indent=2)

print(f"Mockingbird Phase 2: wrote {len(events)} events to {EVENTS_PATH}")
print(f"Mockingbird Phase 2: wrote {len(history)} history records to {HISTORY_PATH}")

breakdown = {}
for e in events:
    label = e["_scenario_label"]
    breakdown[label] = breakdown.get(label, 0) + 1
print("\nEvent breakdown:")
for label, count in sorted(breakdown.items()):
    print(f"  {label}: {count} events")

history_breakdown = {}
for h in history:
    wid = h["wallet_id"].split("_")[1]
    key = f"WAL_{wid}_*"
    history_breakdown[key] = history_breakdown.get(key, 0) + 1
print(f"\nTotal history records: {len(history)}")
print("\nATO events:")
for e in events:
    if e["event_id"].startswith("EVT_ATO_"):
        print(f"  {e['event_id']}  wallet={e['wallet_id']}  ts={e['timestamp']}  geo={e['geo']}")
