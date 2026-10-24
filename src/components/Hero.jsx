import React from "react";
import heroAvatar from "../assets/hero-avatar.jpg";
import globeSvg from "../assets/globe 1.svg";
import ScrollVelocity from "./ScrollVelocity";
import HeroHeader from "./HeroHeader";
import runNavigation from "./heroNavigation";
import "./Hero.css";

export default function Hero() {
  return (
    <div id="top" className="hero-container">
      <HeroHeader />

      <div className="hero-stage">
        <div className="hero-copy">
          <div className="hero-copy-main">
            <p className="hero-eyebrow">
              <span className="hero-eyebrow-dot" aria-hidden="true" />
              Portfolio / 2026
              <span className="hero-eyebrow-rule" aria-hidden="true" />
              Selected work
            </p>

            <h1 className="hero-title">
              Rishabh
              <br />
              <span>Bassi</span>.
            </h1>

            <p className="hero-role">
              Engineer · Data · AI · Product
            </p>

            <p className="hero-lede">
              I design and build data-rich products where analytics, AI, and
              interface design meet — turning complex systems into clear,
              human experiences.
            </p>

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

            <p className="hero-scroll-note">
              <span className="hero-scroll-line" aria-hidden="true" />
              Scroll to explore
            </p>
          </div>
        </div>

        <figure className="hero-portrait">
          <img
            className="hero-portrait-image"
            src={heroAvatar}
            alt="3D portrait of Rishabh Bassi against a gray studio background"
            fetchPriority="high"
          />
          <figcaption className="hero-portrait-caption">
            Portrait / 2026
          </figcaption>

          <div className="hero-location">
            <span className="hero-location-globe" aria-hidden="true">
              <img src={globeSvg} alt="" />
            </span>
            <span className="hero-location-copy">
              <span className="hero-location-label">Based in</span>
              <span className="hero-location-value">New Delhi, India</span>
            </span>
          </div>
        </figure>
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
