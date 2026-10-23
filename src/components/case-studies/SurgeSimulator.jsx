import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_PARAMS,
  MODEL_ASSUMPTIONS,
  PARAM_BOUNDS,
  POLICIES,
  SCENARIOS,
  simulateAll,
} from "../../simulation/surgePricing";
import {
  CHART_COLORS,
  formatInteger,
  formatMultiplier,
  formatPercent,
} from "./chartUtils";
import { PolicyComparisonBars, TimeSeriesChart } from "./SurgeCharts";
import "./SurgeSimulator.css";

const scenarioByKey = (key) => SCENARIOS.find((scenario) => scenario.key === key);

function RangeControl({ id, label, value, min, max, step, onChange, display, hint }) {
  return (
    <div className="sim-control">
      <div className="sim-control-head">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{display}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {hint ? (
        <p className="sim-hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function MetricTile({ label, value, unit }) {
  return (
    <div className="sim-stat">
      <dt>{label}</dt>
      <dd>
        {value}
        {unit ? <span className="sim-stat-unit">{unit}</span> : null}
      </dd>
    </div>
  );
}

export default function SurgeSimulator() {
  const [params, setParams] = useState({ ...DEFAULT_PARAMS });
  const [scenarioKey, setScenarioKey] = useState("switch-off");
  const [activePolicy, setActivePolicy] = useState("baseline");
  const [cursor, setCursor] = useState(DEFAULT_PARAMS.steps - 1);
  const [playing, setPlaying] = useState(false);

  const simulation = useMemo(() => simulateAll(params), [params]);
  const activeRun = simulation.runs[activePolicy];
  const totalSteps = activeRun.timeline.length;
  const safeCursor = Math.min(cursor, totalSteps - 1);
  const visibleTimeline = activeRun.timeline.slice(0, safeCursor + 1);
  const metrics = activeRun.metrics;

  useEffect(() => {
    setCursor(Math.max(0, params.steps - 1));
    setPlaying(false);
  }, [params]);

  useEffect(() => {
    if (!playing) return undefined;
    if (safeCursor >= totalSteps - 1) {
      setPlaying(false);
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setCursor((current) => Math.min(totalSteps - 1, current + 1));
    }, 260);
    return () => window.clearTimeout(timer);
  }, [playing, safeCursor, totalSteps]);

  const updateParam = (key, value) => {
    setParams((current) => ({ ...current, [key]: value }));
    setScenarioKey("custom");
  };

  const applyScenario = (scenario) => {
    setParams({ ...scenario.params });
    setScenarioKey(scenario.key);
  };

  const resetModel = () => {
    setParams({ ...DEFAULT_PARAMS });
    setScenarioKey("switch-off");
    setActivePolicy("baseline");
  };

  const changePolicy = (key) => {
    setActivePolicy(key);
    setCursor(totalSteps - 1);
    setPlaying(false);
  };

  const handlePlayPause = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (safeCursor >= totalSteps - 1) setCursor(0);
    setPlaying(true);
  };

  const stepForward = () => {
    setPlaying(false);
    setCursor((current) => Math.min(totalSteps - 1, current + 1));
  };

  const replay = () => {
    setPlaying(false);
    setCursor(0);
  };

  const showFullRun = () => {
    setPlaying(false);
    setCursor(totalSteps - 1);
  };

  const activePolicyInfo = POLICIES.find((policy) => policy.key === activePolicy);
  const activeScenario = scenarioByKey(scenarioKey);
  const freezeMetrics = simulation.runs.freeze.metrics;
  const freezeDeterred = freezeMetrics.freezeDeters;
  const freezeDisabled = params.cooldown === 0;
  const baselineMetrics = simulation.runs.baseline.metrics;
  const smoothedMetrics = simulation.runs.smoothed.metrics;
  const smoothedRateDiff =
    smoothedMetrics.earningsPerOnlineStep - baselineMetrics.earningsPerOnlineStep;
  const smoothedRateComparison =
    Math.abs(smoothedRateDiff) < 0.01
      ? "about the same as"
      : smoothedRateDiff > 0
        ? "higher than"
        : "lower than";
  const lowestAverage = Math.min(
    baselineMetrics.avgSurge,
    freezeMetrics.avgSurge,
    smoothedMetrics.avgSurge,
  );
  const smoothedHasLowestAverage = smoothedMetrics.avgSurge === lowestAverage;
  const statusText =
    safeCursor >= totalSteps - 1
      ? `Full run shown · ${totalSteps} of ${totalSteps} steps`
      : playing
        ? `Playing · step ${safeCursor + 1} of ${totalSteps}`
        : `Paused at step ${safeCursor + 1} of ${totalSteps}`;

  return (
    <section className="sim-shell" aria-labelledby="sim-title">
      <header className="sim-header">
        <p className="sim-eyebrow">Interactive model / not a production system</p>
        <h2 id="sim-title">Run the marketplace.</h2>
        <p className="sim-lede">
          A deliberately small simulation of the mechanism discussed above. It is not Uber&apos;s
          pricing system, it contains no company data, and every number is illustrative. The same
          parameters and seed always produce the same run.
        </p>
      </header>

      <div className="sim-scenarios" aria-label="Scenario presets">
        <div className="sim-scenario-buttons">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.key}
              type="button"
              className={`sim-scenario${scenarioKey === scenario.key ? " is-active" : ""}`}
              aria-pressed={scenarioKey === scenario.key}
              onClick={() => applyScenario(scenario)}
            >
              {scenario.label}
            </button>
          ))}
          <button type="button" className="sim-reset" onClick={resetModel}>
            Reset model
          </button>
        </div>
        <p className="sim-scenario-note">
          {activeScenario
            ? activeScenario.note
            : "Custom settings. The seed fixes the demand noise and the schedule of ordinary breaks."}
        </p>
      </div>

      <div className="sim-layout">
        <aside className="sim-controls" aria-labelledby="sim-controls-title">
          <div className="sim-controls-head">
            <h3 id="sim-controls-title">Parameters</h3>
            <span className="sim-seed-badge">seed {params.seed}</span>
          </div>

          <RangeControl
            id="sim-demand"
            label="Demand"
            value={params.demand}
            min={PARAM_BOUNDS.demand.min}
            max={PARAM_BOUNDS.demand.max}
            step={PARAM_BOUNDS.demand.step}
            display={`${params.demand} / step`}
            onChange={(value) => updateParam("demand", value)}
            hint="Ride requests per dispatch step."
          />
          <RangeControl
            id="sim-drivers"
            label="Drivers in fleet"
            value={params.drivers}
            min={PARAM_BOUNDS.drivers.min}
            max={PARAM_BOUNDS.drivers.max}
            step={PARAM_BOUNDS.drivers.step}
            display={`${params.drivers} total`}
            onChange={(value) => updateParam("drivers", value)}
            hint="Strategic and non-strategic drivers combined."
          />
          <RangeControl
            id="sim-strategic"
            label="Strategic share"
            value={params.strategicShare}
            min={PARAM_BOUNDS.strategicShare.min}
            max={PARAM_BOUNDS.strategicShare.max}
            step={PARAM_BOUNDS.strategicShare.step}
            display={formatPercent(params.strategicShare)}
            onChange={(value) => updateParam("strategicShare", value)}
            hint="The fraction of drivers assumed to coordinate switch-offs."
          />
          <RangeControl
            id="sim-sensitivity"
            label="Price sensitivity (k)"
            value={params.sensitivity}
            min={PARAM_BOUNDS.sensitivity.min}
            max={PARAM_BOUNDS.sensitivity.max}
            step={PARAM_BOUNDS.sensitivity.step}
            display={params.sensitivity.toFixed(1)}
            onChange={(value) => updateParam("sensitivity", value)}
            hint="How strongly the illustrative price reacts to a supply–demand gap."
          />
          <RangeControl
            id="sim-delay"
            label="Strategic response delay"
            value={params.responseDelay}
            min={PARAM_BOUNDS.responseDelay.min}
            max={PARAM_BOUNDS.responseDelay.max}
            step={PARAM_BOUNDS.responseDelay.step}
            display={`${params.responseDelay} steps`}
            onChange={(value) => updateParam("responseDelay", value)}
            hint="How long the coordinated group waits before it may return."
          />
          <RangeControl
            id="sim-cooldown"
            label="Freeze duration"
            value={params.cooldown}
            min={PARAM_BOUNDS.cooldown.min}
            max={PARAM_BOUNDS.cooldown.max}
            step={PARAM_BOUNDS.cooldown.step}
            display={`${params.cooldown} steps`}
            onChange={(value) => updateParam("cooldown", value)}
            hint="Used by the freeze policy only. At 6+ steps, this model assumes the freeze deters a coordinated switch-off."
          />
          <RangeControl
            id="sim-duration"
            label="Run duration"
            value={params.steps}
            min={PARAM_BOUNDS.steps.min}
            max={PARAM_BOUNDS.steps.max}
            step={PARAM_BOUNDS.steps.step}
            display={`${params.steps} steps`}
            onChange={(value) => updateParam("steps", value)}
          />

          <div className="sim-seed-control">
            <label htmlFor="sim-seed">Seed</label>
            <div className="sim-seed-row">
              <input
                id="sim-seed"
                type="number"
                min="1"
                max="99999"
                step="1"
                value={params.seed}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (Number.isFinite(next) && next > 0) updateParam("seed", Math.round(next));
                }}
              />
              <button
                type="button"
                onClick={() => updateParam("seed", Math.floor(Math.random() * 9000) + 1000)}
              >
                New seed
              </button>
            </div>
            <p className="sim-hint">Repeatable: re-enter this seed to reproduce the run.</p>
          </div>

          <details className="sim-assumptions">
            <summary>What this model assumes</summary>
            <div className="sim-assumptions-body">
              <p>
                Price rule:{" "}
                <code>P = clamp(1, 3, 1 + k × max(0, D / S_signal − 1))</code>. Every available
                driver can serve one request per step.
              </p>
              <ul>
                <li>
                  Pricing at step <em>t</em> uses the supply observed at <em>t−1</em>. This
                  one-step lag lets returning drivers serve at the elevated multiplier for one
                  step before it resets. It is an assumption, not a platform detail.
                </li>
                <li>
                  Baseline and freeze policies use last step&apos;s available supply for{" "}
                  <code>S_signal</code>; the smoothed policy uses the median of the last ten
                  observed supply values.
                </li>
                <li>
                  Coordinated drivers switch off when the previous multiplier falls below{" "}
                  {MODEL_ASSUMPTIONS.switchOffThreshold}×. They may return after the response
                  delay (and any freeze) once the multiplier reaches{" "}
                  {MODEL_ASSUMPTIONS.returnThreshold}×, or after{" "}
                  {MODEL_ASSUMPTIONS.patienceSteps} steps regardless.
                </li>
                <li>
                  If the freeze is at least {MODEL_ASSUMPTIONS.patienceSteps} steps, the model
                  assumes coordinated drivers do not start a switch-off at all. This deterrence
                  assumption is a modelling choice, not an empirical finding.
                </li>
                <li>
                  Each non-strategic driver has a {formatPercent(MODEL_ASSUMPTIONS.legitBreakRate)}{" "}
                  chance per step of an ordinary two-step break. Under the freeze policy, those
                  drivers are blocked for the full freeze duration.
                </li>
                <li>
                  Demand is a 24-step cycle plus seeded noise. The same seed produces the same
                  demand and break schedule under every policy.
                </li>
                <li>
                  The earnings rate is an illustrative proxy: base fare 1, with requests split
                  proportionally among available drivers. It is not actual pay, and it ignores
                  costs, incentives, and driver preferences.
                </li>
              </ul>
            </div>
          </details>
        </aside>

        <div className="sim-main">
          <div className="sim-toolbar">
            <div className="sim-policy-group" role="group" aria-label="Choose a policy to inspect">
              {POLICIES.map((policy) => (
                <button
                  key={policy.key}
                  type="button"
                  className={`sim-policy-button${activePolicy === policy.key ? " is-active" : ""}`}
                  aria-pressed={activePolicy === policy.key}
                  onClick={() => changePolicy(policy.key)}
                >
                  {policy.label}
                </button>
              ))}
            </div>
            <div className="sim-run-controls">
              <button type="button" className="sim-play" onClick={handlePlayPause}>
                {playing ? "Pause" : safeCursor >= totalSteps - 1 ? "Play from start" : "Play"}
              </button>
              <button type="button" onClick={stepForward} disabled={safeCursor >= totalSteps - 1}>
                Step
              </button>
              <button type="button" onClick={replay}>
                Replay
              </button>
              <button type="button" onClick={showFullRun} disabled={safeCursor >= totalSteps - 1}>
                Full run
              </button>
            </div>
          </div>

          <p className="sim-policy-description">{activePolicyInfo.description}</p>
          <p className="sim-status" aria-live={playing ? "off" : "polite"}>
            {statusText}
          </p>

          <dl className="sim-stats">
            <MetricTile label="Peak multiplier" value={formatMultiplier(metrics.peakSurge)} />
            <MetricTile label="Average" value={formatMultiplier(metrics.avgSurge)} />
            <MetricTile label="Unmet requests" value={formatInteger(metrics.unmetTotal)} />
            <MetricTile
              label="Strategic online-time"
              value={formatInteger(metrics.strategicOnlineTime)}
              unit="driver-steps"
            />
          </dl>

          <div className="sim-charts">
            <TimeSeriesChart
              title="Surge multiplier"
              subtitle="The illustrative price signal. The model caps the multiplier at 3×."
              data={visibleTimeline}
              series={[
                {
                  key: "surge",
                  label: "Surge multiplier",
                  color: CHART_COLORS.surge,
                  format: formatMultiplier,
                },
              ]}
              yMin={1}
              yMax={3}
              yTickCount={4}
              yFormat={(value) => `${value.toFixed(1)}×`}
              peakSeriesKey="surge"
              ariaLabel={`Surge multiplier over ${totalSteps} simulated steps`}
              tableColumns={[
                { key: "surge", label: "Surge", format: formatMultiplier },
                { key: "signal", label: "Supply signal", format: formatInteger },
              ]}
              footnote="Toy model output, not observed pricing."
            />

            <TimeSeriesChart
              title="Demand vs available supply"
              subtitle="Every available driver can serve one request per step in this model."
              data={visibleTimeline}
              series={[
                {
                  key: "demand",
                  label: "Demand",
                  color: CHART_COLORS.demand,
                  format: formatInteger,
                },
                {
                  key: "availableSupply",
                  label: "Available drivers",
                  color: CHART_COLORS.supply,
                  format: formatInteger,
                },
              ]}
              yMin={0}
              yFormat={formatInteger}
              ariaLabel={`Demand and available supply over ${totalSteps} simulated steps`}
              tableColumns={[
                { key: "demand", label: "Demand", format: formatInteger },
                { key: "availableSupply", label: "Available", format: formatInteger },
                { key: "unmet", label: "Unmet (proxy)", format: formatInteger },
              ]}
              footnote="The gap between the lines is the unmet-demand proxy."
            />

            <TimeSeriesChart
              title="Who is online"
              subtitle="The aqua line isolates the coordinated group. Ordinary breaks also move the blue line."
              data={visibleTimeline}
              series={[
                {
                  key: "availableSupply",
                  label: "Available drivers",
                  color: CHART_COLORS.supply,
                  format: formatInteger,
                },
                {
                  key: "strategicOnline",
                  label: "Strategic drivers online",
                  color: CHART_COLORS.strategic,
                  format: formatInteger,
                },
              ]}
              yMin={0}
              yMax={params.drivers}
              yFormat={formatInteger}
              ariaLabel={`Available drivers and strategic drivers online over ${totalSteps} simulated steps`}
              tableColumns={[
                { key: "availableSupply", label: "Available", format: formatInteger },
                { key: "strategicOnline", label: "Strategic online", format: formatInteger },
                { key: "strategicOffline", label: "Strategic offline", format: formatInteger },
                { key: "legitOffline", label: "Legit offline", format: formatInteger },
              ]}
              footnote="Counts are drivers, not requests."
            />
          </div>
        </div>
      </div>

      <section className="sim-comparison" aria-labelledby="sim-comparison-title">
        <div className="sim-comparison-head">
          <div>
            <p className="sim-eyebrow">Same demand, same seed, three mechanisms</p>
            <h3 id="sim-comparison-title">A comparison, not a scoreboard.</h3>
          </div>
          <p>
            Each policy is run against the identical demand sequence and ordinary-break schedule.
            Values below are full-run results. No row validates a policy in the real world.
          </p>
        </div>

        <PolicyComparisonBars runs={simulation.runs} />

        <div className="sim-table-wrap">
          <table className="sim-comparison-table">
            <caption>
              Full-run outcomes for the current parameters. Hover-free: every value is printed.
            </caption>
            <thead>
              <tr>
                <th scope="col">Measure</th>
                {POLICIES.map((policy) => (
                  <th key={policy.key} scope="col">
                    {policy.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Peak multiplier</th>
                {POLICIES.map((policy) => (
                  <td key={policy.key}>
                    {formatMultiplier(simulation.runs[policy.key].metrics.peakSurge)}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Average multiplier</th>
                {POLICIES.map((policy) => (
                  <td key={policy.key}>
                    {formatMultiplier(simulation.runs[policy.key].metrics.avgSurge)}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Volatility (SD)</th>
                {POLICIES.map((policy) => (
                  <td key={policy.key}>
                    {simulation.runs[policy.key].metrics.volatility.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Steps above 1.5×</th>
                {POLICIES.map((policy) => (
                  <td key={policy.key}>
                    {formatInteger(simulation.runs[policy.key].metrics.stepsAboveThreshold)}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Unmet requests</th>
                {POLICIES.map((policy) => (
                  <td key={policy.key}>
                    {formatInteger(simulation.runs[policy.key].metrics.unmetTotal)}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Longest supply gap</th>
                {POLICIES.map((policy) => (
                  <td key={policy.key}>
                    {simulation.runs[policy.key].metrics.supplyGapSteps} steps
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Strategic online-time</th>
                {POLICIES.map((policy) => (
                  <td key={policy.key}>
                    {formatInteger(simulation.runs[policy.key].metrics.strategicOnlineTime)}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Earnings rate (proxy)</th>
                {POLICIES.map((policy) => (
                  <td key={policy.key}>
                    {simulation.runs[policy.key].metrics.earningsPerOnlineStep.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Legit-driver friction</th>
                {POLICIES.map((policy) => (
                  <td key={policy.key}>
                    {formatInteger(simulation.runs[policy.key].metrics.legitFriction)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div
          className={`sim-callout${freezeDeterred || freezeDisabled ? "" : " is-warning"}`}
          role="note"
        >
          {freezeDisabled ? (
            <p>
              Freeze is set to 0 steps, so the freeze policy is equivalent to baseline. Raise it to
              see how duration changes the result.
            </p>
          ) : freezeDeterred ? (
            <p>
              At {params.cooldown} steps, the model&apos;s deterrence assumption is active: the
              coordinated group does not initiate a switch-off. The result is not evidence that a
              real freeze would work; it is a consequence of that assumption. The cost is{" "}
              {formatInteger(freezeMetrics.legitFriction)} blocked driver-steps for ordinary breaks.
            </p>
          ) : (
            <p>
              At {params.cooldown} steps, the freeze is shorter than the model&apos;s{" "}
              {MODEL_ASSUMPTIONS.patienceSteps}-step patience horizon. The coordinated group can
              still return once it expires, so the freeze can prolong an outage rather than
              prevent it. Try the slider at {MODEL_ASSUMPTIONS.patienceSteps} or above.
            </p>
          )}
        </div>

        <p className="sim-insight">
          <strong>What this run suggests:</strong> the smoothed signal has{" "}
          {smoothedHasLowestAverage ? "the lowest" : "a lower"} average multiplier, but the
          coordinated group&apos;s earnings rate is{" "}
          {smoothedMetrics.earningsPerOnlineStep.toFixed(2)} fare units per online step,{" "}
          {smoothedRateComparison} the baseline&apos;s{" "}
          {baselineMetrics.earningsPerOnlineStep.toFixed(2)}. Smoothing changes when the reward
          arrives; it does not by itself remove the reward. The freeze at {params.cooldown} steps{" "}
          {freezeDeterred
            ? "suppresses the switch-off only because the model's deterrence assumption is active."
            : "is shorter than the patience horizon, so the group can still return into the high-price step."}{" "}
          These are hypotheses generated by a toy model, not findings about any real platform.
        </p>

        <p className="sim-definition">
          <strong>How to read this:</strong> “Unmet requests” is a proxy, not a measure of rider
          experience. “Strategic online-time” counts driver-steps online. “Earnings rate” is
          illustrative fare units per online driver-step, not actual pay; it ignores costs,
          incentives, and driver preferences. Volatility is the standard deviation of the
          illustrative multiplier. “Legit-driver friction” counts extra blocked driver-steps beyond
          a normal two-step break. The model has no queues, repositioning, matching constraints, or
          learning.
        </p>
      </section>
    </section>
  );
}
