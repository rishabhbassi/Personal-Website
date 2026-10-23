import { useId, useState } from "react";
import { illustrativeSurge } from "../../simulation/surgePricing";
import "./MechanismStepper.css";

const SENSITIVITY = 1.2;
const DEMAND = 170;
const FLEET = 150;
const COORDINATED = 75;

const priceFor = (supply) =>
  illustrativeSurge({ demand: DEMAND, supply, sensitivity: SENSITIVITY });

const STEPS = [
  {
    label: "The ratio",
    title: "The price is a ratio.",
    supply: FLEET,
    signal: FLEET,
    groupOnline: COORDINATED,
    body: "A dispatch interval has 170 requests and 150 available drivers. With the toy formula, the multiplier rises to 1.16× and 20 requests go unmet. Nothing is being manipulated yet; the signal is doing what it was designed to do.",
    note: "The platform sees a ratio, not a motive.",
  },
  {
    label: "The lever",
    title: "Drivers can read the denominator.",
    supply: FLEET,
    signal: FLEET,
    groupOnline: COORDINATED,
    body: "The same ratio is visible to drivers. The coordinated group works out that removing 75 drivers would take the observed supply from 150 to 75 without changing demand. The multiplier would move from 1.16× to 2.52×.",
    note: "No new riders are needed to move the price; only fewer visible drivers.",
  },
  {
    label: "Withhold",
    title: "A group goes offline.",
    supply: FLEET - COORDINATED,
    signal: FLEET - COORDINATED,
    groupOnline: 0,
    body: "Seventy-five drivers switch off together. The platform now observes 75 available drivers against 170 requests, so the multiplier jumps to 2.52×. The group earns nothing during this step; it is paying a cost to move the signal.",
    note: "The shortage is real to the pricing system. It was manufactured by the denominator.",
  },
  {
    label: "The cost",
    title: "The wait lands on riders.",
    supply: FLEET - COORDINATED,
    signal: FLEET - COORDINATED,
    groupOnline: 0,
    body: "Unmet requests rise from 20 to 95 in this stylised step. Riders wait longer, pay more, or leave. The platform's signal says scarcity. The scarcity exists, but it did not come from demand.",
    note: "The model treats every withheld driver as one unavailable unit of capacity.",
  },
  {
    label: "Return",
    title: "Return into the surge.",
    supply: FLEET,
    signal: FLEET - COORDINATED,
    groupOnline: COORDINATED,
    body: "The group returns while the price still reflects the previous observation. With this model's one-step lag, its 75 drivers can serve at 2.52× before the next observation resets the signal. That timing is the exploit: the group sells into a price it helped create.",
    note: "A one-step observation lag is an assumption, not a description of any platform.",
  },
];

export default function MechanismStepper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const headingId = useId();
  const statusId = useId();
  const step = STEPS[activeIndex];
  const price = priceFor(step.signal);
  const unmet = Math.max(0, DEMAND - step.supply);
  const countMax = 200;
  const meterPercent = ((price - 1) / 2) * 100;

  const selectPrevious = () => setActiveIndex((index) => Math.max(0, index - 1));
  const selectNext = () => setActiveIndex((index) => Math.min(STEPS.length - 1, index + 1));

  return (
    <div className="mech">
      <div className="mech-stepper" role="group" aria-label="Five-step mechanism explainer">
        {STEPS.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className={`mech-step${index === activeIndex ? " is-active" : ""}`}
            aria-pressed={index === activeIndex}
            aria-controls={headingId}
            onClick={() => setActiveIndex(index)}
          >
            <span className="mech-step-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="mech-step-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mech-panel" role="region" aria-labelledby={headingId}>
        <div className="mech-copy">
          <p className="mech-kicker">
            Step {String(activeIndex + 1).padStart(2, "0")} of 05
          </p>
          <h3 id={headingId}>{step.title}</h3>
          <p className="mech-body">{step.body}</p>
          <p className="mech-note">{step.note}</p>

          <div className="mech-actions">
            <button
              type="button"
              onClick={selectPrevious}
              disabled={activeIndex === 0}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={selectNext}
              disabled={activeIndex === STEPS.length - 1}
            >
              Next step
            </button>
          </div>
        </div>

        <figure className="mech-figure">
          <div className="mech-counts">
            <div className="mech-count-row">
              <span className="mech-count-label">Demand</span>
              <span className="mech-track" aria-hidden="true">
                <span
                  className="mech-fill"
                  style={{
                    width: `${(DEMAND / countMax) * 100}%`,
                    background: "#eb6834",
                  }}
                />
              </span>
              <span className="mech-count-value">{DEMAND}</span>
            </div>
            <div className="mech-count-row">
              <span className="mech-count-label">Available</span>
              <span className="mech-track" aria-hidden="true">
                <span
                  className="mech-fill"
                  style={{
                    width: `${(step.supply / countMax) * 100}%`,
                    background: "#2a78d6",
                  }}
                />
              </span>
              <span className="mech-count-value">{step.supply}</span>
            </div>
            <p className="mech-scale-caption">
              Requests and drivers share one scale (0–{countMax} units per step).
            </p>

            <dl className="mech-mini-stats">
              <div>
                <dt>Group online</dt>
                <dd>{step.groupOnline}</dd>
              </div>
              <div>
                <dt>Unmet (proxy)</dt>
                <dd>{unmet}</dd>
              </div>
            </dl>
          </div>

          <div className="mech-price">
            <p className="mech-price-label">Illustrative multiplier</p>
            <p className="mech-price-value">{price.toFixed(2)}×</p>
            <div
              className="mech-meter"
              aria-hidden="true"
              style={{ "--mech-meter": `${Math.max(0, Math.min(100, meterPercent))}%` }}
            >
              <span className="mech-meter-marker" />
            </div>
            <div className="mech-meter-scale">
              <span>1×</span>
              <span>3×</span>
            </div>
            <p className="mech-figure-caption">
              Toy formula output. Counts exclude ordinary breaks.
            </p>
          </div>
        </figure>
      </div>

      <p className="mech-sr-only" id={statusId} aria-live="polite">
        Step {activeIndex + 1} of 5: {step.title}. {DEMAND} requests, {step.supply} drivers
        available, illustrative multiplier {price.toFixed(2)} times, {unmet} unmet requests.
      </p>
    </div>
  );
}
