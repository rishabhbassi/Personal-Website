/**
 * Illustrative market model for Case Study 001 — The Surge Pricing Exploit.
 *
 * This is a deliberately small "toy" model, not Uber's pricing formula and not a
 * description of any production system. It exists to make the incentive dynamics
 * discussed in the published research explorable. All assumptions are exported so
 * the interface can disclose them.
 *
 * Determinism: the demand sequence and legitimate-break schedule are generated
 * from a fixed seed. Running the same parameters and seed always produces the
 * same result.
 */

export const MODEL_ASSUMPTIONS = Object.freeze({
  switchOffThreshold: 1.35,
  returnThreshold: 1.55,
  patienceSteps: 6,
  smoothingWindow: 10,
  legitBreakRate: 0.01,
  legitBreakDuration: 2,
  supplyFloor: 0.5,
  minSurge: 1,
  maxSurge: 3,
  // Price at step t uses the supply observed at t−1. This one-step observation
  // lag is what lets returning drivers serve at the elevated multiplier before
  // the next observation resets it. It is an assumption, not a platform detail.
  pricingObservationLag: 1,
});

export const POLICY_KEYS = ["baseline", "freeze", "smoothed"];

export const POLICIES = [
  {
    key: "baseline",
    label: "Baseline",
    shortLabel: "Baseline",
    description:
      "Pricing responds to the current observed supply–demand imbalance. No extra anti-manipulation mechanism.",
  },
  {
    key: "freeze",
    label: "Freeze period",
    shortLabel: "Freeze",
    description:
      "After a driver goes offline, an illustrative delay applies before they can return to the matching pool.",
  },
  {
    key: "smoothed",
    label: "Smoothed signal",
    shortLabel: "Smoothed",
    description:
      "Pricing uses the median of the last ten supply observations, so short coordinated dips barely move the price signal.",
  },
];

export const DEFAULT_PARAMS = Object.freeze({
  demand: 120,
  drivers: 150,
  strategicShare: 0.5,
  sensitivity: 1.2,
  responseDelay: 3,
  cooldown: 5,
  steps: 60,
  seed: 42,
  policy: "baseline",
});

export const PARAM_BOUNDS = Object.freeze({
  demand: { min: 60, max: 260, step: 5 },
  drivers: { min: 60, max: 300, step: 5 },
  strategicShare: { min: 0, max: 0.8, step: 0.05 },
  sensitivity: { min: 0.4, max: 2.4, step: 0.1 },
  responseDelay: { min: 0, max: 10, step: 1 },
  cooldown: { min: 0, max: 10, step: 1 },
  steps: { min: 30, max: 120, step: 10 },
});

export const SCENARIOS = [
  {
    key: "switch-off",
    label: "Coordinated switch-off",
    note: "Enough drivers coordinate to withhold supply; demand is otherwise ordinary.",
    params: { ...DEFAULT_PARAMS },
  },
  {
    key: "demand-spike",
    label: "Genuine demand spike",
    note: "Demand exceeds the fully online fleet; no strategic withholding is needed to create scarcity.",
    params: {
      ...DEFAULT_PARAMS,
      demand: 240,
      drivers: 150,
      strategicShare: 0.4,
      seed: 7,
    },
  },
  {
    key: "supply-shortage",
    label: "Genuine supply shortage",
    note: "The fleet is small relative to demand, so surge reflects real scarcity rather than manipulation.",
    params: {
      ...DEFAULT_PARAMS,
      demand: 150,
      drivers: 110,
      strategicShare: 0.3,
      seed: 11,
    },
  },
];

export const METRIC_DEFINITIONS = Object.freeze([
  {
    key: "peakSurge",
    label: "Peak multiplier",
    definition: "The highest illustrative surge multiplier reached in the run.",
  },
  {
    key: "avgSurge",
    label: "Average multiplier",
    definition: "The mean illustrative multiplier across all simulated steps.",
  },
  {
    key: "volatility",
    label: "Volatility",
    definition: "Population standard deviation of the illustrative multiplier. Higher means more oscillation.",
  },
  {
    key: "stepsAboveThreshold",
    label: "Steps above 1.5×",
    definition: "Number of steps in which the illustrative multiplier exceeds 1.5×.",
  },
  {
    key: "unmetTotal",
    label: "Unmet requests",
    definition:
      "Sum over steps of max(0, demand − available drivers). Each available driver can serve one request per step in this model.",
  },
  {
    key: "supplyGapSteps",
    label: "Longest supply gap",
    definition:
      "Longest consecutive run of steps in which available drivers fall below 90% of the total fleet.",
  },
  {
    key: "strategicOnlineTime",
    label: "Strategic online-time",
    definition:
      "Driver-steps in which strategically coordinated drivers were online. Lower values mean the group spent less time in the matching pool.",
  },
  {
    key: "earningsPerOnlineStep",
    label: "Earnings rate (proxy)",
    definition:
      "Illustrative fare units (base fare = 1) per online driver-step, assuming requests are split proportionally among available drivers. A higher value means the group earned more per hour worked, not necessarily more in total. Not actual earnings.",
  },
  {
    key: "legitFriction",
    label: "Legit-driver friction",
    definition:
      "Model proxy for extra restriction imposed on legitimate breaks: freeze policy = extra blocked driver-steps beyond a normal two-step break; smoothed signal = 0.",
  },
]);

/** Small, fast deterministic PRNG (mulberry32). */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Demand per step = a mild 24-step cycle plus seeded noise. Demand is generated
 * once per run and shared by every policy, so comparisons are like-for-like.
 */
export function createDemandSequence({ demand, steps, seed }) {
  const rng = mulberry32((seed ^ 0x9e3779b9) >>> 0);
  const sequence = [];
  for (let t = 0; t < steps; t += 1) {
    const cycle = Math.sin((2 * Math.PI * (t % 24)) / 24);
    const noise = rng() * 2 - 1;
    const value = demand * (1 + 0.1 * cycle + 0.06 * noise);
    sequence.push(Math.max(1, Math.round(value)));
  }
  return sequence;
}

/**
 * A venue-independent schedule of legitimate breaks (breaks, safety stops,
 * connectivity problems). Generated per driver in virtual time, so the same
 * break *intentions* occur under every policy; only the return time changes.
 */
export function createBreakEvents({ drivers, strategicShare, steps, seed }) {
  const strategicCount = Math.round(drivers * strategicShare);
  const baselineCount = Math.max(0, drivers - strategicCount);
  const rng = mulberry32((seed ^ 0x27d4eb2d) >>> 0);
  const events = [];
  for (let driver = 0; driver < baselineCount; driver += 1) {
    let busyUntil = -1;
    for (let t = 0; t < steps; t += 1) {
      if (t <= busyUntil) continue;
      if (rng() < MODEL_ASSUMPTIONS.legitBreakRate) {
        events.push({ driver, start: t, baseDuration: MODEL_ASSUMPTIONS.legitBreakDuration });
        busyUntil = t + MODEL_ASSUMPTIONS.legitBreakDuration - 1;
      }
    }
  }
  return events;
}

/** Baseline-driver availability per step for a given freeze duration. */
function buildBaselineAvailability(events, baselineCount, steps, freezeDuration) {
  const available = new Array(steps).fill(baselineCount);
  events.forEach((event) => {
    const duration = Math.max(event.baseDuration, freezeDuration);
    const end = Math.min(steps, event.start + duration);
    for (let t = event.start; t < end; t += 1) {
      available[t] -= 1;
    }
  });
  return available;
}

function median(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

/** Price rule used by the baseline and freeze policies. */
export function illustrativeSurge({ demand, supply, sensitivity }) {
  const safeSupply = Math.max(MODEL_ASSUMPTIONS.supplyFloor, supply);
  const ratio = demand / safeSupply;
  return clamp(
    MODEL_ASSUMPTIONS.minSurge,
    MODEL_ASSUMPTIONS.maxSurge,
    1 + sensitivity * Math.max(0, ratio - 1),
  );
}

/**
 * Run one policy. `shared` contains the demand sequence, break events and the
 * driver split, so every policy is evaluated against identical external inputs.
 */
export function simulatePolicy(policyKey, params, shared) {
  const { demandSequence, breakEvents, baselineCount, strategicCount } = shared;
  const freezeDuration = policyKey === "freeze" ? params.cooldown : 0;
  const baselineAvailability = buildBaselineAvailability(
    breakEvents,
    baselineCount,
    params.steps,
    freezeDuration,
  );
  const freezeDeters = policyKey === "freeze" && params.cooldown >= MODEL_ASSUMPTIONS.patienceSteps;

  let strategicOnline = strategicCount;
  let offlineStart = null;
  let previousSurge = MODEL_ASSUMPTIONS.minSurge;
  // Seed the robust signal with the fleet's full size, as if the platform had
  // observed a normal supply level for a full window before this run began.
  const supplyHistory = new Array(MODEL_ASSUMPTIONS.smoothingWindow).fill(params.drivers);
  // One-step observation lag: pricing at t uses the supply seen before t.
  let laggedSupply = baselineAvailability[0] + strategicCount;
  const timeline = [];

  for (let t = 0; t < params.steps; t += 1) {
    // Strategic group decision, based on the price observed in the previous step.
    if (t > 0) {
      if (strategicOnline === strategicCount) {
        if (!freezeDeters && previousSurge < MODEL_ASSUMPTIONS.switchOffThreshold) {
          strategicOnline = 0;
          offlineStart = t;
        }
      } else {
        const elapsed = t - offlineStart;
        const minimumOffline = Math.max(params.responseDelay, freezeDuration);
        const priceHasRecovered = previousSurge >= MODEL_ASSUMPTIONS.returnThreshold;
        const patienceExhausted = elapsed >= MODEL_ASSUMPTIONS.patienceSteps;
        if (elapsed >= minimumOffline && (priceHasRecovered || patienceExhausted)) {
          strategicOnline = strategicCount;
          offlineStart = null;
        }
      }
    }

    const availableBaseline = baselineAvailability[t];
    const availableSupply = availableBaseline + strategicOnline;
    const demand = demandSequence[t];

    // The signal is what pricing can observe at this step: last step's supply
    // for the baseline and freeze policies, or a robust median history for the
    // smoothed policy. The current step's supply is recorded afterwards.
    const signal =
      policyKey === "smoothed"
        ? median(supplyHistory.slice(-MODEL_ASSUMPTIONS.smoothingWindow))
        : laggedSupply;

    const surge = illustrativeSurge({
      demand,
      supply: signal,
      sensitivity: params.sensitivity,
    });

    const unmet = Math.max(0, demand - availableSupply);
    const strategicOffline = strategicCount - strategicOnline;
    const strategicTrips =
      availableSupply > 0
        ? Math.min(strategicOnline, demand * (strategicOnline / availableSupply))
        : 0;
    const strategicEarnings = surge * strategicTrips;

    timeline.push({
      t,
      demand,
      availableSupply,
      availableBaseline,
      legitOffline: baselineCount - availableBaseline,
      strategicOnline,
      strategicOffline,
      signal,
      surge,
      unmet,
      strategicTrips,
      strategicEarnings,
    });

    supplyHistory.push(availableSupply);
    laggedSupply = availableSupply;
    previousSurge = surge;
  }

  const metrics = computeMetrics(timeline, params, policyKey, breakEvents);
  return { policy: policyKey, timeline, metrics };
}

export function computeMetrics(timeline, params, policyKey = "baseline", breakEvents = []) {
  const surges = timeline.map((row) => row.surge);
  const totalSurge = surges.reduce((sum, value) => sum + value, 0);
  const mean = totalSurge / Math.max(1, timeline.length);
  const variance =
    surges.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, timeline.length);
  const demandTotal = timeline.reduce((sum, row) => sum + row.demand, 0);
  const unmetTotal = timeline.reduce((sum, row) => sum + row.unmet, 0);

  let longestGap = 0;
  let currentGap = 0;
  timeline.forEach((row) => {
    if (row.availableSupply < params.drivers * 0.9) {
      currentGap += 1;
      longestGap = Math.max(longestGap, currentGap);
    } else {
      currentGap = 0;
    }
  });

  const freezeExtra = Math.max(0, params.cooldown - MODEL_ASSUMPTIONS.legitBreakDuration);
  const legitFriction =
    policyKey === "freeze" ? breakEvents.length * freezeExtra : 0;
  const strategicOnlineTime = timeline.reduce((sum, row) => sum + row.strategicOnline, 0);
  const strategicEarnings = timeline.reduce((sum, row) => sum + row.strategicEarnings, 0);

  return {
    peakSurge: Math.max(...surges),
    avgSurge: mean,
    volatility: Math.sqrt(variance),
    stepsAboveThreshold: surges.filter((value) => value > 1.5).length,
    unmetTotal,
    unmetShare: demandTotal > 0 ? unmetTotal / demandTotal : 0,
    supplyGapSteps: longestGap,
    strategicOnlineTime,
    strategicEarnings,
    earningsPerOnlineStep:
      strategicOnlineTime > 0 ? strategicEarnings / strategicOnlineTime : 0,
    legitFriction,
    freezeDeters: policyKey === "freeze" && params.cooldown >= MODEL_ASSUMPTIONS.patienceSteps,
  };
}

/** Run all three policies under identical demand and break assumptions. */
export function simulateAll(params) {
  const strategicCount = Math.round(params.drivers * params.strategicShare);
  const baselineCount = Math.max(0, params.drivers - strategicCount);
  const shared = {
    demandSequence: createDemandSequence(params),
    breakEvents: createBreakEvents(params),
    strategicCount,
    baselineCount,
  };

  const runs = {};
  POLICY_KEYS.forEach((key) => {
    runs[key] = simulatePolicy(key, params, shared);
  });

  return {
    params,
    shared,
    runs,
    assumptions: MODEL_ASSUMPTIONS,
  };
}
