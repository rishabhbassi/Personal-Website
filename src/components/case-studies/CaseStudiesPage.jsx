import { useEffect, useRef } from "react";
import "./CaseStudiesPage.css";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

export default function CaseStudiesPage({ onBack, onOpenCaseStudy }) {
  const pageRef = useRef(null);
  const closeRef = useRef(null);
  const backCallbackRef = useRef(onBack);

  useEffect(() => {
    backCallbackRef.current = onBack;
  }, [onBack]);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;
    const previousFocus = document.activeElement;
    closeRef.current?.focus();

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

  return (
    <div
      className="csi-page"
      ref={pageRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="csi-title"
    >
      <header className="csi-topbar">
        <div className="csi-topbar-inner">
          <button type="button" className="csi-back" ref={closeRef} onClick={onBack}>
            <span aria-hidden="true">←</span> Back to portfolio
          </button>
          <p className="csi-topbar-label">Selected investigations</p>
          <p className="csi-topbar-count">01 published</p>
        </div>
      </header>

      <main className="csi-main">
        <section className="csi-hero" aria-labelledby="csi-title">
          <div>
            <p className="csi-eyebrow">Independent research / Interactive investigations</p>
            <h1 id="csi-title">
              Case
              <br />
              Studies
            </h1>
          </div>
          <div className="csi-hero-side">
            <p>
              Long-form investigations of the systems behind everyday decisions. Each study
              separates what is documented from what is hypothesised, builds a transparent model,
              and makes the assumptions visible.
            </p>
            <p>
              The first study examines dynamic pricing and coordinated supply withholding in
              ride-hailing marketplaces. It combines published research with an interactive,
              deterministic simulation.
            </p>
            <p className="csi-hero-note">
              No placeholder projects. Additional studies appear only when the research and the
              interactive work are finished.
            </p>
          </div>
        </section>

        <section className="csi-list" aria-labelledby="csi-list-title">
          <div className="csi-list-head">
            <h2 id="csi-list-title">Published</h2>
            <span>01 study</span>
          </div>

          <article className="csi-card">
            <div className="csi-card-visual" aria-hidden="true">
              <div className="csi-visual-top">
                <span>Case study 001</span>
                <span>Fig. 01 / price signal</span>
              </div>
              <div className="csi-visual-price">
                <span>Illustrative multiplier</span>
                <strong>2.52<span>×</span></strong>
              </div>
              <svg className="csi-visual-chart" viewBox="0 0 320 132" preserveAspectRatio="none">
                <line x1="0" y1="118" x2="320" y2="118" stroke="rgba(255,255,255,0.16)" />
                <line x1="0" y1="76" x2="320" y2="76" stroke="rgba(255,255,255,0.06)" />
                <line x1="0" y1="34" x2="320" y2="34" stroke="rgba(255,255,255,0.06)" />
                <path
                  d="M0 108 L48 104 L84 106 L108 100 L128 30 L154 26 L188 32 L222 28 L264 30 L320 24"
                  fill="none"
                  stroke="#b9a6ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="128" cy="30" r="4" fill="#b9a6ff" stroke="#101010" strokeWidth="2" />
              </svg>
              <div className="csi-visual-stats">
                <div>
                  <span>Demand</span>
                  <strong>170</strong>
                </div>
                <div>
                  <span>Available</span>
                  <strong>75</strong>
                </div>
                <div>
                  <span>Unmet</span>
                  <strong>95</strong>
                </div>
              </div>
              <p className="csi-visual-note">Toy model values. Not observed data.</p>
            </div>

            <div className="csi-card-body">
              <p className="csi-card-kicker">Case study 001 / Marketplace mechanisms</p>
              <h3>The Surge Pricing Exploit</h3>
              <p className="csi-card-subtitle">
                What happens when people learn to game the algorithm?
              </p>
              <p className="csi-card-description">
                A price signal is also a target. When drivers can act on the number the platform
                uses to measure supply, a manufactured shortage can become a strategy. This study
                maps the mechanism, simulates three responses, and asks what the evidence can
                actually support.
              </p>

              <ul className="csi-tags" aria-label="Topics">
                <li>Dynamic pricing</li>
                <li>Game theory</li>
                <li>Marketplace economics</li>
                <li>Mechanism design</li>
                <li>Simulation</li>
              </ul>

              <dl className="csi-card-meta">
                <div>
                  <dt>Type</dt>
                  <dd>Independent research and interactive simulation</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>Research prototype</dd>
                </div>
                <div>
                  <dt>Contents</dt>
                  <dd>Five-step explainer · interactive model · policy comparison</dd>
                </div>
              </dl>

              <button type="button" className="csi-card-cta" onClick={onOpenCaseStudy}>
                Open case study <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        </section>

        <section className="csi-method" aria-labelledby="csi-method-title">
          <div className="csi-method-head">
            <p className="csi-method-kicker">Method</p>
            <h2 id="csi-method-title">How these are made</h2>
          </div>
          <div className="csi-method-grid">
            <div>
              <span>01</span>
              <h3>Research first</h3>
              <p>
                Claims are traced to published sources. Evidence labels distinguish documented
                findings, authors&apos; hypotheses, my analysis, and model assumptions.
              </p>
            </div>
            <div>
              <span>02</span>
              <h3>Make the model legible</h3>
              <p>
                Simulations are deterministic, parameterised, and disclosed. The goal is to expose
                the mechanism and its assumptions, not to forecast a real market.
              </p>
            </div>
            <div>
              <span>03</span>
              <h3>Separate the conclusions</h3>
              <p>
                A toy model can generate hypotheses. It cannot validate a policy. Recommendations
                are framed as things to test, not as proven fixes.
              </p>
            </div>
          </div>
        </section>

        <section className="csi-progress" aria-labelledby="csi-progress-title">
          <div>
            <p className="csi-progress-kicker">In progress</p>
            <h2 id="csi-progress-title">More investigations are being researched.</h2>
            <p>
              They are not listed here until they are finished. The empty space is deliberate:
              this section contains one completed case study, not a grid of mock projects.
            </p>
          </div>
          <button type="button" className="csi-progress-back" onClick={onBack}>
            Back to portfolio <span aria-hidden="true">→</span>
          </button>
        </section>
      </main>

      <footer className="csi-footer">
        <p>Rishabh Bassi / Independent research and interactive simulation</p>
        <p>All simulations are illustrative. No internal platform data was used.</p>
      </footer>
    </div>
  );
}
