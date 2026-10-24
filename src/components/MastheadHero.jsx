import React from "react";
import ScrollVelocity from "./ScrollVelocity";
import HeroHeader from "./HeroHeader";
import runNavigation from "./heroNavigation";
import MotionMark, { LocationPill } from "./HeroMark";
import "./Hero.css";
import "./MastheadHero.css";

const LEDE =
  "I design and build data-rich products where analytics, AI, and interface design meet — turning complex systems into clear, human experiences.";

const DISCIPLINES = ["Engineer", "Data", "AI", "Product"];

export default function MastheadHero({ embedded = false }) {
  return (
    <div
      id={embedded ? undefined : "top"}
      className={`hero-container hero-container--masthead${
        embedded ? " hero-container--masthead-preview" : ""
      }`}
    >
      <HeroHeader floating contained={embedded} />

      <div className="hero-masthead">
        <p className="hero-eyebrow">
          <span className="hero-eyebrow-dot" aria-hidden="true" />
          Portfolio / 2026
          <span className="hero-eyebrow-rule" aria-hidden="true" />
          Selected work
          <span className="hero-eyebrow-place">New Delhi, IN</span>
        </p>

        <div className="hero-masthead-row">
          <h1 className="hero-title hero-title--masthead">
            Rishabh <span>Bassi</span>.
          </h1>
        </div>
      </div>

      <div className="hero-main">
        <ul className="hero-cells" aria-label="Disciplines">
          {DISCIPLINES.map((discipline, index) => (
            <li className="hero-cell" key={discipline}>
              <span className="hero-cell-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="hero-cell-label">{discipline}</span>
            </li>
          ))}
        </ul>

        <div className="hero-copy-body">
          <p className="hero-lede">{LEDE}</p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-action hero-action-primary"
              onClick={() => runNavigation("work")}
            >
              View selected work <span aria-hidden="true">↗</span>
            </button>
            <button
              type="button"
              className="hero-action hero-action-secondary"
              onClick={() => runNavigation("about")}
              aria-haspopup="dialog"
            >
              About me <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <figure className="hero-portrait hero-portrait--masthead">
          <MotionMark />
          <figcaption className="hero-portrait-caption">Motion / 2026</figcaption>
          <div className="hero-portrait-badge">
            <LocationPill />
          </div>
        </figure>

        <div className="hero-footer">
          <dl className="hero-meta">
            <div>
              <dt>Based in</dt>
              <dd>New Delhi, India</dd>
            </div>
          </dl>

          <p className="hero-scroll-note">
            <span className="hero-scroll-line" aria-hidden="true" />
            Scroll to explore
          </p>
        </div>
      </div>

      <div className="hero-ticker">
        <p className="hero-ticker-label">
          <span className="hero-ticker-dot" aria-hidden="true" />
          Disciplines
        </p>
        <div className="hero-ticker-track">
          <ScrollVelocity
            texts={["Data engineering — AI systems — Product thinking — Interface craft —"]}
            velocity={85}
            parallaxClassName="hero-marquee-parallax"
            scrollerClassName="hero-marquee-scroller"
          />
        </div>
      </div>
    </div>
  );
}
