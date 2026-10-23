import { useEffect, useRef, useState } from "react";
import MechanismStepper from "./MechanismStepper";
import SurgeSimulator from "./SurgeSimulator";
import "./SurgePricingCaseStudy.css";

const SECTIONS = [
  { id: "cs-overview", label: "Overview" },
  { id: "cs-mechanism", label: "Mechanism" },
  { id: "cs-incentive", label: "Incentive" },
  { id: "cs-simulation", label: "Simulation" },
  { id: "cs-interventions", label: "Interventions" },
  { id: "cs-tradeoffs", label: "Trade-offs" },
  { id: "cs-recommendation", label: "Recommendation" },
  { id: "cs-limitations", label: "Limitations" },
  { id: "cs-sources", label: "Sources" },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

function ReadingProgress({ scrollRef }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = element.scrollHeight - element.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, element.scrollTop / max)) : 0);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    element.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      element.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [scrollRef]);

  return (
    <div className="cs-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

function SectionHead({ number, title, kicker }) {
  return (
    <div className="cs-section-head">
      <span className="cs-section-number">{number}</span>
      <div>
        {kicker ? <p className="cs-section-kicker">{kicker}</p> : null}
        <h2>{title}</h2>
      </div>
    </div>
  );
}

function Tag({ children, kind }) {
  return <span className={`cs-tag cs-tag--${kind}`}>{children}</span>;
}

function HeroVisual() {
  return (
    <figure className="cs-hero-figure" aria-labelledby="cs-hero-figure-caption">
      <div className="cs-hero-figure-top">
        <span>Toy model / illustrative step</span>
        <span className="cs-hero-figure-status">supply withheld</span>
      </div>

      <div className="cs-hero-price-row">
        <p className="cs-hero-price-label">Illustrative multiplier</p>
        <p className="cs-hero-price">
          2.52<span>×</span>
        </p>
      </div>

      <svg
        className="cs-hero-spark"
        viewBox="0 0 320 72"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line x1="0" y1="62" x2="320" y2="62" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
        <path
          d="M0 54 L56 52 L92 54 L114 50 L132 16 L158 14 L186 18 L214 15 L252 17 L320 13"
          fill="none"
          stroke="#b9a6ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="132" cy="16" r="4" fill="#b9a6ff" stroke="#111111" strokeWidth="2" />
        <text x="132" y="8" textAnchor="middle" fill="#d9d1ff" fontSize="9">
          spike
        </text>
      </svg>

      <div className="cs-hero-stat-row">
        <div>
          <span>Demand</span>
          <strong>170</strong>
          <em>requests</em>
        </div>
        <div>
          <span>Available</span>
          <strong>75</strong>
          <em>of 150 drivers</em>
        </div>
        <div>
          <span>Unmet</span>
          <strong>95</strong>
          <em>proxy</em>
        </div>
      </div>

      <div className="cs-hero-fleet">
        <p className="cs-hero-fleet-label">
          <span className="cs-hero-fleet-key" aria-hidden="true" /> available
          <span className="cs-hero-fleet-key is-off" aria-hidden="true" /> withheld
          <span>· each square ≈ 5 drivers</span>
        </p>
        <div className="cs-hero-dots" aria-hidden="true">
          {Array.from({ length: 30 }, (_, index) => (
            <span key={index} className={index % 2 === 1 ? "is-offline" : ""} />
          ))}
        </div>
      </div>

      <figcaption id="cs-hero-figure-caption" className="cs-hero-figure-caption">
        Illustrative values from the case-study formula, not observed data. Half the fleet is
        visible to the price signal in this step; the multiplier rises before the group returns.
      </figcaption>
    </figure>
  );
}

export default function SurgePricingCaseStudy({ onBack, onClosePortfolio }) {
  const pageRef = useRef(null);
  const backRef = useRef(null);
  const backCallbackRef = useRef(onBack);

  useEffect(() => {
    backCallbackRef.current = onBack;
  }, [onBack]);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;
    const previousFocus = document.activeElement;
    backRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        backCallbackRef.current?.();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = [...page.querySelectorAll(FOCUSABLE)].filter(
        (node) => node.offsetParent !== null,
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    page.addEventListener("keydown", handleKeyDown);
    return () => {
      page.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  const scrollTo = (id) => {
    const target = pageRef.current?.querySelector(`#${id}`);
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div
      className="cs-page"
      ref={pageRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cs-title"
    >
      <header className="cs-topbar">
        <div className="cs-topbar-inner">
          <button type="button" className="cs-back" ref={backRef} onClick={onBack}>
            <span aria-hidden="true">←</span> Case studies
          </button>
          <p className="cs-topbar-label">Case study 001 / Marketplace mechanisms</p>
          <p className="cs-topbar-status">Research prototype</p>
        </div>
        <ReadingProgress scrollRef={pageRef} />
      </header>

      <main>
        <section className="cs-hero" aria-labelledby="cs-title">
          <div className="cs-hero-inner">
            <div className="cs-hero-copy">
              <p className="cs-eyebrow">Case study 001 / Marketplace mechanisms</p>
              <h1 id="cs-title" aria-label="The Surge Pricing Exploit">
                The Surge
                <br />
                Pricing <span>Exploit</span>
              </h1>
              <p className="cs-subtitle">
                What happens when people learn to game the algorithm?
              </p>
              <p className="cs-hero-lede">
                Dynamic pricing is meant to pull drivers toward demand. But a price signal is also
                a target. When a group can move the supply number, the market can be made to
                misread a shortage — and the people who created it can sell into the result.
              </p>
              <p className="cs-hero-disclaimer">
                Independent research and interactive simulation. Not affiliated with Uber. No
                internal code, driver records, or production metrics were used.
              </p>
            </div>
            <HeroVisual />
          </div>

          <div className="cs-hero-footer">
            <button type="button" className="cs-scroll-cue" onClick={() => scrollTo("cs-overview")}>
              Read the investigation <span aria-hidden="true">↓</span>
            </button>
            <p>~10 minutes · one interactive model · sources at the end</p>
          </div>
        </section>

        <nav className="cs-contents" aria-label="Case study contents">
          {SECTIONS.map((section, index) => (
            <button
              key={section.id}
              type="button"
              className="cs-contents-link"
              onClick={() => scrollTo(section.id)}
            >
              <span>{String(index).padStart(2, "0")}</span>
              {section.label}
            </button>
          ))}
        </nav>

        <section id="cs-overview" className="cs-section cs-overview">
          <SectionHead number="00" title="What this is" kicker="Overview" />
          <div className="cs-overview-grid">
            <div className="cs-prose">
              <p className="cs-dropcap">
                On a ride-hailing platform, a trip can cost more when demand is high relative to
                the drivers available. The multiplier is intended to do two jobs at once: ration
                scarce capacity and attract more drivers. The mechanism assumes that supply is
                responding to demand. It cannot guarantee that supply is responding honestly.
              </p>
              <p>
                This case study is an independent investigation of one failure mode: coordinated
                supply withholding. It is not a report of a specific incident, and it does not
                accuse any platform or group of drivers of wrongdoing. It is a structured way to
                ask what the published research establishes, what it only hypothesises, and what
                a transparent toy model can — and cannot — show.
              </p>
              <p>
                The centrepiece is a small simulation. You set demand, fleet size, the strategic
                share, how long the group waits, and the policy; the model returns price,
                availability, unmet demand, and a comparison of three interventions. Every number
                is illustrative. The value is in the mechanism, not the decimals.
              </p>

              <dl className="cs-meta-list">
                <div>
                  <dt>Type</dt>
                  <dd>Independent research and interactive simulation</dd>
                </div>
                <div>
                  <dt>Topics</dt>
                  <dd>
                    Dynamic pricing · game theory · marketplace economics · mechanism design ·
                    simulation
                  </dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>Research prototype</dd>
                </div>
                <div>
                  <dt>Evidence base</dt>
                  <dd>Published research plus a stated toy model. No field data.</dd>
                </div>
              </dl>

              <div className="cs-note cs-note--warning">
                <p>
                  <strong>Independent, not insider.</strong> This page does not use Uber&apos;s
                  source code, internal driver data, production metrics, or company decisions. It
                  makes no claim about what any platform has deployed. The freeze period discussed
                  later is a proposed mechanism in the research literature, not evidence of a real
                  policy.
                </p>
              </div>
            </div>

            <aside className="cs-evidence-key" aria-labelledby="cs-evidence-title">
              <h3 id="cs-evidence-title">How to read the evidence</h3>
              <p>
                Claims are labelled so that a documented finding is not confused with a
                hypothesis, an interpretation, or a simulation assumption.
              </p>
              <ul>
                <li>
                  <Tag kind="documented">Documented</Tag>
                  <span>Supported by a cited source&apos;s data or formal result.</span>
                </li>
                <li>
                  <Tag kind="hypothesis">Hypothesis</Tag>
                  <span>The source authors&apos; proposed explanation, not field-verified.</span>
                </li>
                <li>
                  <Tag kind="analysis">Analysis</Tag>
                  <span>My synthesis or interpretation, not a source claim.</span>
                </li>
                <li>
                  <Tag kind="model">Model</Tag>
                  <span>A stated assumption or output of the simulation, not observed data.</span>
                </li>
              </ul>
              <p className="cs-evidence-footnote">
                Full citations and research notes appear in the sources section. The literature
                is model-based and qualitative; none of it is a production audit.
              </p>
            </aside>
          </div>
        </section>

        <section id="cs-mechanism" className="cs-section">
          <SectionHead number="01" title="The mechanism, in five moves" kicker="Mechanism" />
          <p className="cs-section-lede">
            The exploit is not a single hack. It is a loop: read the price, withhold the
            denominator, let the signal move, then return before the measurement catches up.
          </p>
          <MechanismStepper />
          <p className="cs-caption">
            A stylised sequence using the toy formula in this case study. It is not a
            reconstruction of any real event, and ordinary breaks are omitted here for clarity.
          </p>
          <div className="cs-reading">
            <p>
              <Tag kind="model">Model</Tag>
              The numbers in the stepper come from the same rule as the simulator: 170 requests,
              150 drivers, a 75-driver coordinated group, and a one-step price-observation lag.
              Change the assumptions and the sequence changes.
            </p>
            <p>
              <Tag kind="documented">Documented</Tag>
              The general possibility of this loop is established in the literature: dynamic
              pricing can create conditions under which drivers are better off acting collectively
              to induce shortages. This sequence is an illustration of that mechanism, not
              evidence that it happened in a particular city or company.
            </p>
          </div>
        </section>

        <section id="cs-incentive" className="cs-section">
          <SectionHead number="02" title="A formula is an invitation" kicker="The incentive problem" />
          <div className="cs-prose">
            <p>
              The toy pricing rule is deliberately simple. It is not Uber&apos;s formula; it is a
              transparent way to see where the leverage sits.
            </p>
          </div>

          <div className="cs-formula-block" aria-labelledby="cs-formula-title">
            <div className="cs-formula-head">
              <p className="cs-formula-label" id="cs-formula-title">
                Toy pricing rule
              </p>
              <Tag kind="model">Model</Tag>
            </div>
            <code className="cs-formula">
              P = clamp(1, 3, 1 + k × max(0, D / S<sub>signal</sub> − 1))
            </code>
            <p>
              <var>P</var> is the multiplier, <var>D</var> is demand in a dispatch interval,{" "}
              <var>S</var><sub>signal</sub> is the supply the pricing system can observe, and{" "}
              <var>k</var> sets how sharply price reacts. The multiplier is capped at 3× and
              floored at 1×.
            </p>
          </div>

          <div className="cs-variable-grid" aria-label="Variables in the incentive problem">
            <div className="cs-variable">
              <span className="cs-variable-letter">D</span>
              <h3>Demand</h3>
              <p>Requests arriving in a dispatch interval. In this model, demand is generated.</p>
            </div>
            <div className="cs-variable">
              <span className="cs-variable-letter">S</span>
              <h3>Observed supply</h3>
              <p>
                Drivers the platform can see as available. This is the denominator — and the
                weakest point.
              </p>
            </div>
            <div className="cs-variable">
              <span className="cs-variable-letter">P</span>
              <h3>Price multiplier</h3>
              <p>The signal that rations rides and, in theory, attracts more drivers.</p>
            </div>
            <div className="cs-variable">
              <span className="cs-variable-letter">A</span>
              <h3>Driver action</h3>
              <p>
                Stay online, go offline, or return. The platform observes availability, not intent.
              </p>
            </div>
          </div>

          <div className="cs-prose">
            <p>
              When demand is at or below observed supply, the multiplier is 1×. When demand
              exceeds supply, the multiplier rises with the ratio. That makes{" "}
              <var>S</var> a lever: reducing the denominator without reducing demand can raise the
              price without creating any new willingness to pay. The group does not need to fake
              requests. It only needs to become invisible to the measurement.
            </p>
            <p>
              The action variable is what makes this a mechanism-design problem rather than a
              forecasting problem. A driver who goes offline for a legitimate reason and a driver
              who goes offline to move the price look identical in the supply count. The platform
              sees the effect, not the intention. A countermeasure that cannot distinguish them
              will impose costs on both.
            </p>
          </div>

          <blockquote className="cs-pullquote">
            <p>
              The price is supposed to describe the market. Once participants can act on it, it
              becomes part of the market&apos;s strategy space.
            </p>
            <footer>
              <Tag kind="analysis">Analysis</Tag>
            </footer>
          </blockquote>

          <div className="cs-research-summary">
            <h3>What the research does — and does not — establish</h3>
            <ul>
              <li>
                <Tag kind="documented">Documented</Tag>
                Schröder et al. (2020) combine game theory with price time-series from 137
                locations and show that dynamic pricing can induce, rather than prevent,
                demand–supply imbalances. Their phase diagram identifies conditions under which
                collective driver action to create shortages becomes attractive. The paper is
                evidence of a mechanism, not proof of manipulation in any specific market.
              </li>
              <li>
                <Tag kind="documented">Documented · model</Tag>
                Tripathy, Bai, and Heese (2023) develop an analytical model of coordinated
                deactivation. They find collusion is more likely when customers have moderate
                sensitivity to waiting time — for example, at airports or concert venues — and that
                the platform may sometimes benefit from higher surge prices. Their proposed freeze
                period and bonus payment are model results, not field deployments.
              </li>
              <li>
                <Tag kind="documented">Documented · preprint</Tag>
                Yu, Ma, and Wierman (2022) prove in a many-agent model that coordinated
                offline/online behaviour can be a Nash equilibrium, producing repeated price
                cycles; in dense markets it can reduce total driver payoff. They show price floors
                can limit the cycles. This is a working paper, not peer-reviewed field evidence.
              </li>
              <li>
                <Tag kind="documented">Documented · qualitative</Tag>
                Möhlmann and Zalmanson (2017) use interviews with Uber drivers and forum data to
                identify “guessing, resisting, switching, and gaming the Uber system” as tactics
                for navigating algorithmic management. Qualitative research can show that a
                practice is discussed; it cannot establish its prevalence or price impact.
              </li>
              <li>
                <Tag kind="hypothesis">Hypothesis</Tag>
                That coordinated withholding explains a particular real surge event, or that any
                specific platform has been gamed at scale, is not established by these sources.
                This case study does not test that hypothesis against field data.
              </li>
            </ul>
          </div>
        </section>

        <section id="cs-simulation" className="cs-section cs-section--wide">
          <SectionHead number="03" title="Simulation" kicker="Interactive model" />
          <SurgeSimulator />
          <div className="cs-try">
            <h3>Three things to try</h3>
            <ol>
              <li>
                Set <strong>strategic share</strong> to 0. The withholding cycles disappear; what
                remains is ordinary demand noise and legitimate breaks.
              </li>
              <li>
                Move <strong>freeze duration</strong> across 5, 6, and 8 steps. Watch the
                deterrence assumption switch on — and watch the friction cost keep rising.
              </li>
              <li>
                Raise <strong>demand</strong> above the fleet without withholding. A genuine
                shortage can produce a high multiplier too; the model does not label motive for
                you.
              </li>
            </ol>
          </div>
        </section>

        <section id="cs-interventions" className="cs-section">
          <SectionHead number="04" title="Three interventions, no free lunch" kicker="Policy comparison" />
          <div className="cs-prose">
            <p>
              The simulator compares three simplified mechanisms under identical demand and
              ordinary-break schedules. They are not an exhaustive policy menu, and none is a
              recommendation to deploy as-is.
            </p>
          </div>

          <div className="cs-policy-grid">
            <article className="cs-policy-card cs-policy-card--baseline">
              <div className="cs-policy-top">
                <span className="cs-policy-dot" aria-hidden="true" />
                <p>01 / Baseline</p>
              </div>
              <h3>Dynamic pricing, no extra mechanism</h3>
              <p>
                Price responds to the last observed supply–demand ratio. There is no additional
                check on returning drivers and no signal smoothing.
              </p>
              <dl>
                <div>
                  <dt>What the model shows</dt>
                  <dd>
                    Repeated withholding cycles: the group leaves, the price rises, the group
                    returns into the elevated step. Unmet demand and price volatility both rise.
                  </dd>
                </div>
                <div>
                  <dt>What it costs</dt>
                  <dd>
                    Riders absorb the shortage, and the signal remains available as a lever. The
                    model gives the group a higher earnings rate per online step than it would get
                    by staying online.
                  </dd>
                </div>
              </dl>
              <Tag kind="model">Model output</Tag>
            </article>

            <article className="cs-policy-card cs-policy-card--freeze">
              <div className="cs-policy-top">
                <span className="cs-policy-dot" aria-hidden="true" />
                <p>02 / Freeze period</p>
              </div>
              <h3>Delay the return to the matching pool</h3>
              <p>
                After a driver goes offline, a set number of steps must pass before they can
                return. The duration is a policy parameter; the model does not estimate it.
              </p>
              <dl>
                <div>
                  <dt>What the model shows</dt>
                  <dd>
                    A freeze shorter than the group&apos;s patience horizon can prolong the outage
                    and even raise its per-hour payoff. At 6 steps or more, the model assumes the
                    group does not initiate a switch-off at all.
                  </dd>
                </div>
                <div>
                  <dt>What it costs</dt>
                  <dd>
                    Legitimate breaks are treated like coordination: every ordinary break is
                    extended, producing measurable driver friction. The deterrence result is an
                    assumption, not an empirical finding.
                  </dd>
                </div>
              </dl>
              <Tag kind="hypothesis">Proposed in model</Tag>
            </article>

            <article className="cs-policy-card cs-policy-card--smoothed">
              <div className="cs-policy-top">
                <span className="cs-policy-dot" aria-hidden="true" />
                <p>03 / Smoothed signal</p>
              </div>
              <h3>Price from a robust supply estimate</h3>
              <p>
                Instead of reacting to the latest supply observation, pricing uses the median of
                the last ten observations. Short dips should move the signal less.
              </p>
              <dl>
                <div>
                  <dt>What the model shows</dt>
                  <dd>
                    In the default run, average multiplier and unmet demand fall, but the peak
                    remains; the group&apos;s earnings rate can rise because it returns into a
                    longer high-price window. Smoothing changes timing, not necessarily the
                    incentive.
                  </dd>
                </div>
                <div>
                  <dt>What it costs</dt>
                  <dd>
                    Genuine supply shortages are also slower to move the price, which can leave
                    riders waiting. The policy is not a matching mechanism and does not identify
                    coordination.
                  </dd>
                </div>
              </dl>
              <Tag kind="analysis">Analysis of model output</Tag>
            </article>
          </div>

          <div className="cs-note cs-note--analysis">
            <h3>Why FIFO is not automatically the answer</h3>
            <p>
              A first-in, first-out queue changes who gets matched, not whether withholding can
              be profitable. If priority is earned by time online, drivers may still benefit from
              exiting and re-entering at the right moment; if priority ignores reliability, it can
              reward the behaviour it was meant to discourage. FIFO also creates its own fairness
              questions: the front of the queue becomes valuable, waiting time is hard to verify,
              and drivers with legitimate breaks are penalised. This model does not test FIFO, and
              the literature reviewed here does not establish that Uber implemented FIFO as an
              anti-collusion measure. Treating it as a solution would be an assumption, not a
              finding.
            </p>
            <p>
              <Tag kind="analysis">Analysis</Tag>
            </p>
          </div>
        </section>

        <section id="cs-tradeoffs" className="cs-section">
          <SectionHead number="05" title="Every fix moves the cost" kicker="Trade-offs" />
          <div className="cs-prose">
            <p>
              The comparison is not a scoreboard because the metrics do not share a single
              objective. A policy can reduce the average multiplier while increasing the group&apos;s
              per-hour payoff. It can reduce unmet demand while making ordinary breaks more
              expensive for drivers. The question is which cost is acceptable, to whom, and with
              what evidence.
            </p>
          </div>

          <div className="cs-tradeoff-grid">
            <article>
              <span>01</span>
              <h3>Rider wait vs. driver flexibility</h3>
              <p>
                A freeze reduces the return options available to everyone, including drivers who
                simply stopped for a break, a safety issue, or a connectivity problem.
              </p>
              <p className="cs-cost-line">Cost lands on: legitimate drivers.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Price stability vs. signal fidelity</h3>
              <p>
                Smoothing dampens short spikes, but it also dampens the response to a real
                shortage. A stable price can be a slow price.
              </p>
              <p className="cs-cost-line">Cost lands on: riders during genuine shortages.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Deterrence vs. adaptation</h3>
              <p>
                A published freeze threshold tells a coordinated group what to avoid. It may
                shift behaviour toward longer withholding, different timing, or another platform.
              </p>
              <p className="cs-cost-line">Cost lands on: the durability of the policy.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Detection vs. due process</h3>
              <p>
                Finding coordination requires watching patterns across drivers. False positives
                can penalise innocent people, especially those with irregular schedules.
              </p>
              <p className="cs-cost-line">Cost lands on: drivers and platform trust.</p>
            </article>
            <article>
              <span>05</span>
              <h3>Platform revenue vs. rider trust</h3>
              <p>
                Surge revenue can make a platform a beneficiary of the dynamic. Research
                suggests collusion may sometimes benefit the platform; that is a model-based
                hypothesis, not a claim about any company&apos;s motives.
              </p>
              <p className="cs-cost-line">Cost lands on: the incentive to intervene.</p>
            </article>
          </div>

          <p className="cs-caption">
            <Tag kind="analysis">Analysis</Tag>
            The trade-offs are a synthesis of the model and the cited research. They are not
            measured company outcomes.
          </p>
        </section>

        <section id="cs-recommendation" className="cs-section">
          <SectionHead number="06" title="What I would test, not what I would ship" kicker="Recommendation" />
          <div className="cs-recommendation">
            <div className="cs-prose">
              <p>
                The model points toward a calibrated freeze as the most promising of the three
                mechanisms — but only under a deterrence assumption that it cannot validate. In
                the default run, a freeze below the patience horizon makes rider outcomes worse.
                A freeze at or above it suppresses the switch-off because the model says the group
                will not start one. That assumption is doing most of the work.
              </p>
              <p>
                So the recommendation is not “deploy a freeze.” It is a research protocol for
                deciding whether a freeze, a signal change, or neither is justified.
              </p>
            </div>

            <ol className="cs-recommendation-list">
              <li>
                <h3>Measure the pattern, not just the surge.</h3>
                <p>
                  Look for synchronised offline transitions, repeated returns around price peaks,
                  and concentration at venues with moderate waiting-time sensitivity. Measure
                  false positives before acting.
                </p>
              </li>
              <li>
                <h3>Estimate the real parameters.</h3>
                <p>
                  The patience horizon, the distribution of legitimate breaks, and the share of
                  drivers who could coordinate are empirical questions. Do not import the
                  simulator&apos;s six-step horizon into a real policy.
                </p>
              </li>
              <li>
                <h3>Run a controlled, pre-registered pilot.</h3>
                <p>
                  Compare a freeze, a smoothed signal, and a combination against a baseline, with
                  outcomes fixed in advance: rider wait, unmet requests, price volatility, driver
                  earnings, and fairness. Do not judge success by surge revenue alone.
                </p>
              </li>
              <li>
                <h3>Protect legitimate breaks.</h3>
                <p>
                  Pair any freeze with exemptions, verification, and an appeals path. A policy
                  that cannot distinguish a safety stop from coordination will punish the wrong
                  people.
                </p>
              </li>
              <li>
                <h3>Expect adaptation.</h3>
                <p>
                  A visible threshold is a target. Monitor for longer withholding, changed timing,
                  multi-homing, and shifts to less-observed venues; re-test rather than assuming
                  the first result holds.
                </p>
              </li>
              <li>
                <h3>Separate the simulation from the validation.</h3>
                <p>
                  The simulator can generate hypotheses and make assumptions legible. It cannot
                  establish that a countermeasure works in the world. Only field evidence can do
                  that.
                </p>
              </li>
            </ol>

            <div className="cs-note cs-note--recommendation">
              <h3>A defensible position today</h3>
              <p>
                Coordinated withholding is a credible mechanism-design risk, not a proven
                epidemic. The evidence supports measuring it, testing a calibrated freeze with
                safeguards, and evaluating rider outcomes alongside driver fairness. It does not
                support announcing a freeze as a fix, claiming a real-world validation, or
                treating FIFO as an anti-collusion solution.
              </p>
              <p>
                <Tag kind="analysis">Analysis</Tag>
              </p>
            </div>

            <div className="cs-would-change">
              <h3>What would change my mind</h3>
              <ul>
                <li>Coordination is too rare, or too indistinguishable from ordinary breaks, to justify intervention.</li>
                <li>Freezes reduce measured waits only by harming drivers with legitimate breaks.</li>
                <li>A smoothed signal improves rider outcomes without shifting the incentive elsewhere.</li>
                <li>Detection produces unacceptable false-positive rates or requires surveillance disproportionate to the harm.</li>
                <li>The platform&apos;s revenue incentive is misaligned enough that voluntary intervention is not credible.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="cs-limitations" className="cs-section">
          <SectionHead number="07" title="What this cannot tell you" kicker="Limitations" />
          <div className="cs-limitations-grid">
            <div>
              <h3>Model limitations</h3>
              <ul>
                <li>Demand is exogenous, smooth, and non-spatial; there are no city zones or routes.</li>
                <li>There are no queues, repositioning, matching constraints, or driver learning.</li>
                <li>Drivers are homogeneous, work one platform, and follow a fixed behavioural protocol.</li>
                <li>Each driver serves at most one request per step; there is no base fare, cost, or incentive structure.</li>
                <li>Pricing has a one-step observation lag and a hard 3× cap; both are assumptions.</li>
                <li>Patience, deterrence, strategic share, and break rates are parameters, not estimates.</li>
                <li>“Unmet requests” and “earnings rate” are proxies, not rider welfare or actual pay.</li>
              </ul>
            </div>
            <div>
              <h3>Research and evidence limitations</h3>
              <ul>
                <li>No internal platform data, source code, or production metrics were used.</li>
                <li>The literature is model-based or qualitative; it does not provide a field estimate of coordination prevalence.</li>
                <li>Tripathy et al. and Yu et al. are analytical results; Yu et al. is a working paper.</li>
                <li>Möhlmann and Zalmanson are qualitative and do not measure price effects.</li>
                <li>Schröder et al. analyse price time-series and game theory, not company intent or enforcement.</li>
                <li>No source establishes that Uber implemented FIFO or a freeze as an anti-collusion measure.</li>
              </ul>
            </div>
            <div>
              <h3>Ethical and measurement limits</h3>
              <ul>
                <li>Detecting coordination can require surveillance of workers; false positives can harm livelihoods.</li>
                <li>Rider outcomes are not reducible to a single unmet-demand proxy; equity and access matter.</li>
                <li>A policy that improves averages can worsen outcomes for specific drivers or riders.</li>
                <li>This page is not an accusation, a replication, a forecast, or a policy endorsement.</li>
              </ul>
            </div>
          </div>
          <div className="cs-note">
            <p>
              <strong>The brief&apos;s source note.</strong> The provided PMC link (PMC10676015)
              resolves to Jiao (2018), a study of Uber price surges during a special event in
              Austin, Texas. It does not study coordinated switch-offs, FIFO, or freeze periods.
              It is cited only as context and is not used to support the mechanism claims on this
              page.
            </p>
          </div>
        </section>

        <section id="cs-sources" className="cs-section">
          <SectionHead number="08" title="Sources and research notes" kicker="References" />
          <ol className="cs-sources">
            <li>
              <p>
                Schröder, M., Storch, D.-M., Marszal, P., &amp; Timme, M. (2020). Anomalous supply
                shortages from dynamic pricing in on-demand mobility.{" "}
                <em>Nature Communications, 11</em>, 4831.
              </p>
              <a
                href="https://doi.org/10.1038/s41467-020-18370-3"
                target="_blank"
                rel="noreferrer"
              >
                doi.org/10.1038/s41467-020-18370-3
              </a>
            </li>
            <li>
              <p>
                Tripathy, M., Bai, J., &amp; Heese, H. S. (2023). Driver collusion in ride-hailing
                platforms. <em>Decision Sciences, 54</em>(4), 434–446.
              </p>
              <a href="https://doi.org/10.1111/deci.12561" target="_blank" rel="noreferrer">
                doi.org/10.1111/deci.12561
              </a>
            </li>
            <li>
              <p>
                Yu, C., Ma, H., &amp; Wierman, A. (2022). Price cycles in ridesharing platforms
                (arXiv:2202.07086) [Working paper].
              </p>
              <a href="https://arxiv.org/abs/2202.07086" target="_blank" rel="noreferrer">
                arxiv.org/abs/2202.07086
              </a>
            </li>
            <li>
              <p>
                Möhlmann, M., &amp; Zalmanson, L. (2017). Hands on the wheel: Navigating
                algorithmic management and Uber drivers&apos; autonomy. In{" "}
                <em>Proceedings of the 38th International Conference on Information Systems</em>.
              </p>
              <a
                href="https://aisel.aisnet.org/icis2017/DigitalPlatforms/Presentations/3/"
                target="_blank"
                rel="noreferrer"
              >
                aisel.aisnet.org/icis2017/DigitalPlatforms/Presentations/3
              </a>
            </li>
            <li>
              <p>
                Jiao, J. (2018). Investigating Uber price surges during a special event in Austin,
                TX. <em>Research in Transportation Business &amp; Management, 29</em>, 101–107.
                Cited as context only.
              </p>
              <a
                href="https://doi.org/10.1016/j.rtbm.2018.02.008"
                target="_blank"
                rel="noreferrer"
              >
                doi.org/10.1016/j.rtbm.2018.02.008
              </a>
            </li>
          </ol>

          <div className="cs-research-notes">
            <h3>Research notes</h3>
            <ul>
              <li>
                <strong>Source mismatch in the brief.</strong> The supplied PMC10676015 link
                resolves to Jiao (2018), not to a study of coordinated switch-offs. Jiao analyses
                surge prices around a special event in Austin; it does not support claims about
                withholding, FIFO, or freeze periods. It is included here for transparency and
                context only.
              </li>
              <li>
                <strong>No deployment claim.</strong> Tripathy et al. propose a freeze period in
                an analytical model. No source reviewed here establishes that Uber or any other
                platform has implemented a freeze or FIFO as an anti-collusion measure. The
                simulator&apos;s freeze policy is a toy version of the proposed mechanism.
              </li>
              <li>
                <strong>No field validation.</strong> The fact that a mechanism performs well in
                the toy model is not evidence that it works in production. The recommendation is a
                research protocol, not a claim of effectiveness.
              </li>
              <li>
                <strong>Status of the evidence.</strong> Schröder et al. is peer-reviewed;
                Tripathy et al. is peer-reviewed analytical work; Yu et al. is a preprint;
                Möhlmann and Zalmanson is a peer-reviewed qualitative study; Jiao is
                peer-reviewed contextual research.
              </li>
              <li>
                <strong>Author&apos;s note.</strong> This is an independent portfolio case study by
                Rishabh Bassi (2026). It is not affiliated with, endorsed by, or based on internal
                information from Uber or any ride-hailing platform.
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="cs-footer">
        <div>
          <p className="cs-footer-eyebrow">End of case study 001</p>
          <h2>The signal is only as honest as the supply behind it.</h2>
          <p className="cs-footer-lede">
            A model can make an assumption visible. It cannot turn that assumption into a fact.
          </p>
        </div>
        <div className="cs-footer-actions">
          <button type="button" className="cs-footer-primary" onClick={onBack}>
            ← Back to case studies
          </button>
          <button type="button" className="cs-footer-secondary" onClick={onClosePortfolio}>
            Back to portfolio
          </button>
        </div>
        <div className="cs-footer-meta">
          <span>Independent research and interactive simulation</span>
          <span>Research prototype · 2026</span>
          <span>Not affiliated with Uber</span>
        </div>
      </footer>
    </div>
  );
}
