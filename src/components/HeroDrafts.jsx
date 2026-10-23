import React, { useEffect } from "react";
import heroAvatar from "../assets/hero-avatar.jpg";
import globeSvg from "../assets/globe 1.svg";
import "./HeroDrafts.css";

const ROLE = "Data Analyst · Product Engineer · UI/UX Designer";
const LEDE =
  "I design and build data-rich products where analytics, AI, and interface design meet — turning complex systems into clear, human experiences.";
const TICKER_TEXT = "Design — Development — Analytics —";

function DraftBrand({ tone = "ink" }) {
  return (
    <a
      className={`hd-brand hd-brand--${tone}`}
      href="/"
      aria-label="Rishabh Bassi — back to portfolio"
    >
      <span className="hd-brand-mark" aria-hidden="true">
        RB
      </span>
      <span className="hd-brand-copy">
        <span className="hd-brand-name">Rishabh Bassi</span>
        <span className="hd-brand-role">Data · Product · Interface</span>
      </span>
    </a>
  );
}

function LocationPill({ tone = "glass" }) {
  return (
    <div className={`hd-location hd-location--${tone}`}>
      <span className="hd-location-globe" aria-hidden="true">
        <img src={globeSvg} alt="" />
      </span>
      <span className="hd-location-copy">
        <span className="hd-location-label">Based in</span>
        <span className="hd-location-value">Haryana, India</span>
      </span>
    </div>
  );
}

function DraftTopbar({ tone = "light", label, nextHref, nextLabel }) {
  return (
    <header className={`hd-topbar hd-topbar--${tone}`}>
      <DraftBrand tone={tone === "dark" ? "paper" : "ink"} />
      <div className="hd-topbar-meta">
        <span className="hd-draft-chip">{label}</span>
        <a className="hd-next-link" href={nextHref}>
          {nextLabel} <span aria-hidden="true">↓</span>
        </a>
      </div>
    </header>
  );
}

function DraftActions({ tone = "light" }) {
  const primaryClass = tone === "dark" ? "hd-btn--paper" : "hd-btn--ink";
  const secondaryClass =
    tone === "dark" ? "hd-btn--outline-light" : "hd-btn--ghost";

  return (
    <div className="hd-actions">
      <a className={`hd-btn ${primaryClass}`} href="/#recent-work">
        View selected work <span aria-hidden="true">↗</span>
      </a>
      <a className={`hd-btn ${secondaryClass}`} href="/">
        About me <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

function DraftTicker({ tone = "ink" }) {
  return (
    <div className={`hd-ticker hd-ticker--${tone}`}>
      <p className="hd-ticker-label">
        <span className="hd-ticker-dot" aria-hidden="true" />
        Disciplines
      </p>
      <div className="hd-ticker-track" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span className="hd-ticker-copy" key={index}>
            {TICKER_TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}

function FullBleedDraft() {
  return (
    <section
      id="draft-full"
      className="hd-draft hd-a"
      aria-labelledby="hd-a-title"
    >
      <div className="hd-a-media" aria-hidden="true">
        <img src={heroAvatar} alt="" fetchPriority="high" />
      </div>

      <DraftTopbar
        tone="dark"
        label="Draft A / Full bleed"
        nextHref="#draft-center"
        nextLabel="Next draft"
      />

      <div className="hd-a-body">
        <div className="hd-a-copy">
          <p className="hd-eyebrow hd-eyebrow--light">
            <span className="hd-dot" aria-hidden="true" />
            Portfolio / 2026
            <span className="hd-rule" aria-hidden="true" />
            Selected work
          </p>

          <h2 id="hd-a-title" className="hd-title hd-title--light">
            Rishabh
            <br />
            <span>Bassi</span>.
          </h2>

          <p className="hd-role hd-role--light">{ROLE}</p>
          <p className="hd-lede hd-lede--light">{LEDE}</p>
          <DraftActions tone="dark" />
        </div>
      </div>

      <div className="hd-a-foot">
        <LocationPill tone="glass" />
        <span className="hd-caption hd-caption--plain">
          <span className="hd-caption-dot" aria-hidden="true" />
          Portrait / 2026
        </span>
      </div>

      <DraftTicker tone="paper" />
    </section>
  );
}

function CenterlineDraft() {
  return (
    <section
      id="draft-center"
      className="hd-draft hd-b"
      aria-labelledby="hd-b-title"
    >
      <DraftTopbar
        tone="light"
        label="Draft B / Centerline"
        nextHref="#draft-masthead"
        nextLabel="Next draft"
      />

      <div className="hd-b-body">
        <p className="hd-eyebrow hd-eyebrow--center">
          <span className="hd-dot" aria-hidden="true" />
          Portfolio / 2026
          <span className="hd-rule" aria-hidden="true" />
          Selected work
        </p>

        <h2 id="hd-b-title" className="hd-title hd-title--center">
          Rishabh
          <br />
          <span>Bassi</span>.
        </h2>

        <p className="hd-role hd-role--center">{ROLE}</p>
        <p className="hd-lede hd-lede--center">{LEDE}</p>
        <DraftActions />
      </div>

      <figure className="hd-b-band">
        <img
          src={heroAvatar}
          alt="3D portrait of Rishabh Bassi against a gray studio background"
          loading="lazy"
        />
        <figcaption className="hd-caption">
          <span className="hd-caption-dot" aria-hidden="true" />
          Portrait / 2026
        </figcaption>
        <div className="hd-b-location">
          <LocationPill tone="glass" />
        </div>
      </figure>

      <DraftTicker tone="ink" />
    </section>
  );
}

function MastheadDraft() {
  return (
    <section
      id="draft-masthead"
      className="hd-draft hd-c"
      aria-labelledby="hd-c-title"
    >
      <DraftTopbar
        tone="light"
        label="Draft C / Masthead"
        nextHref="#draft-masthead-bleed"
        nextLabel="Next draft"
      />

      <div className="hd-c-masthead">
        <p className="hd-eyebrow">
          <span className="hd-dot" aria-hidden="true" />
          Portfolio / 2026
          <span className="hd-rule" aria-hidden="true" />
          Selected work
        </p>

        <h2 id="hd-c-title" className="hd-title hd-title--wide">
          Rishabh <span>Bassi</span>.
        </h2>

        <p className="hd-role">{ROLE}</p>
      </div>

      <figure className="hd-c-band">
        <img
          src={heroAvatar}
          alt="3D portrait of Rishabh Bassi against a gray studio background"
          loading="lazy"
        />
        <figcaption className="hd-caption">
          <span className="hd-caption-dot" aria-hidden="true" />
          Portrait / 2026
        </figcaption>
        <div className="hd-c-location">
          <LocationPill tone="glass" />
        </div>
      </figure>

      <div className="hd-c-deck">
        <p className="hd-c-lede">{LEDE}</p>
        <DraftActions />
        <dl className="hd-c-meta">
          <div>
            <dt>Based in</dt>
            <dd>Haryana, India</dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>Data · Product · Interface</dd>
          </div>
        </dl>
      </div>

      <DraftTicker tone="ink" />
    </section>
  );
}

function MastheadBleedDraft() {
  return (
    <section
      id="draft-masthead-bleed"
      className="hd-draft hd-d"
      aria-labelledby="hd-d-title"
    >
      <div className="hd-d-media" aria-hidden="true">
        <img src={heroAvatar} alt="" loading="lazy" />
      </div>

      <DraftTopbar
        tone="dark"
        label="Draft D / Masthead bleed"
        nextHref="#draft-blend"
        nextLabel="Next draft"
      />

      <div className="hd-d-masthead">
        <p className="hd-eyebrow hd-eyebrow--light">
          <span className="hd-dot" aria-hidden="true" />
          Portfolio / 2026
          <span className="hd-rule" aria-hidden="true" />
          Selected work
        </p>

        <h2 id="hd-d-title" className="hd-title hd-title--wide hd-title--light">
          Rishabh <span>Bassi</span>.
        </h2>

        <p className="hd-role hd-role--light">{ROLE}</p>
      </div>

      <div className="hd-d-spacer" aria-hidden="true" />

      <div className="hd-d-deck">
        <p className="hd-c-lede">{LEDE}</p>
        <DraftActions tone="dark" />
        <dl className="hd-c-meta">
          <div>
            <dt>Based in</dt>
            <dd>Haryana, India</dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>Data · Product · Interface</dd>
          </div>
        </dl>
      </div>

      <div className="hd-d-foot">
        <LocationPill tone="glass" />
        <span className="hd-caption hd-caption--plain">
          <span className="hd-caption-dot" aria-hidden="true" />
          Portrait / 2026
        </span>
      </div>

      <DraftTicker tone="paper" />
    </section>
  );
}

function BlendedDraft() {
  return (
    <section
      id="draft-blend"
      className="hd-draft hd-e"
      aria-labelledby="hd-e-title"
    >
      <DraftTopbar
        tone="light"
        label="Draft E / Blended"
        nextHref="#draft-masthead-blend"
        nextLabel="Next draft"
      />

      <div className="hd-e-main">
        <div className="hd-e-copy">
          <p className="hd-eyebrow hd-e-eyebrow">
            <span className="hd-dot" aria-hidden="true" />
            Portfolio / 2026
            <span className="hd-rule" aria-hidden="true" />
            Selected work
          </p>

          <h2 id="hd-e-title" className="hd-title hd-title--stack">
            Rishabh
            <br />
            <span>Bassi</span>.
          </h2>

          <p className="hd-role hd-e-role">{ROLE}</p>
          <p className="hd-lede">{LEDE}</p>
          <DraftActions />
        </div>

        <figure className="hd-e-media">
          <img
            src={heroAvatar}
            alt="3D portrait of Rishabh Bassi on a gray studio background"
            loading="lazy"
          />
          <figcaption className="hd-caption">
            <span className="hd-caption-dot" aria-hidden="true" />
            Portrait / 2026
          </figcaption>
          <div className="hd-e-location">
            <LocationPill tone="glass" />
          </div>
        </figure>
      </div>

      <DraftTicker tone="ink" />
    </section>
  );
}

function MastheadBlendDraft() {
  return (
    <section
      id="draft-masthead-blend"
      className="hd-draft hd-f"
      aria-labelledby="hd-f-title"
    >
      <DraftTopbar
        tone="light"
        label="Draft F / Masthead blend"
        nextHref="#draft-full"
        nextLabel="Back to draft A"
      />

      <div className="hd-f-masthead">
        <p className="hd-eyebrow">
          <span className="hd-dot" aria-hidden="true" />
          Portfolio / 2026
          <span className="hd-rule" aria-hidden="true" />
          Selected work
        </p>

        <h2 id="hd-f-title" className="hd-title hd-title--wide">
          Rishabh <span>Bassi</span>.
        </h2>

        <p className="hd-role">{ROLE}</p>
      </div>

      <div className="hd-f-main">
        <div className="hd-f-copy">
          <p className="hd-c-lede hd-f-lede">{LEDE}</p>
          <DraftActions />
          <dl className="hd-c-meta hd-f-meta">
            <div>
              <dt>Based in</dt>
              <dd>Haryana, India</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>Data · Product · Interface</dd>
            </div>
          </dl>
        </div>

        <figure className="hd-f-media">
          <img
            src={heroAvatar}
            alt="3D portrait of Rishabh Bassi on a gray studio background"
            loading="lazy"
          />
          <figcaption className="hd-caption">
            <span className="hd-caption-dot" aria-hidden="true" />
            Portrait / 2026
          </figcaption>
          <div className="hd-f-location">
            <LocationPill tone="glass" />
          </div>
        </figure>
      </div>

      <DraftTicker tone="ink" />
    </section>
  );
}

export default function HeroDrafts() {
  useEffect(() => {
    const [routePart, anchorPart] = window.location.hash
      .replace(/^#\/?/, "")
      .split("#");
    const anchor =
      anchorPart ||
      (/^draft-(full|center|masthead|masthead-bleed|masthead-blend|blend)$/.test(
        routePart,
      )
        ? routePart
        : "");

    if (anchor) {
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      document.getElementById(anchor)?.scrollIntoView({ block: "start" });
      root.style.scrollBehavior = previous;
    }
  }, []);

  return (
    <main className="hero-drafts-page">
      <nav className="hd-switcher" aria-label="Hero draft previews">
        <a className="hd-switcher-back" href="/" aria-label="Back to portfolio">
          <span aria-hidden="true">←</span>
          <span className="hd-switcher-back-text">Portfolio</span>
        </a>

        <h1 className="hd-switcher-title">Hero drafts</h1>

        <div className="hd-switcher-links">
          <a href="#draft-full">
            <span className="hd-switcher-letter">A</span>
            <span className="hd-switcher-name">Full bleed</span>
          </a>
          <a href="#draft-center">
            <span className="hd-switcher-letter">B</span>
            <span className="hd-switcher-name">Centerline</span>
          </a>
          <a href="#draft-masthead">
            <span className="hd-switcher-letter">C</span>
            <span className="hd-switcher-name">Masthead</span>
          </a>
          <a href="#draft-masthead-bleed">
            <span className="hd-switcher-letter">D</span>
            <span className="hd-switcher-name">Masthead bleed</span>
          </a>
          <a href="#draft-blend">
            <span className="hd-switcher-letter">E</span>
            <span className="hd-switcher-name">Blended</span>
          </a>
          <a href="#draft-masthead-blend">
            <span className="hd-switcher-letter">F</span>
            <span className="hd-switcher-name">Masthead blend</span>
          </a>
        </div>
      </nav>

      <FullBleedDraft />
      <CenterlineDraft />
      <MastheadDraft />
      <MastheadBleedDraft />
      <BlendedDraft />
      <MastheadBlendDraft />
    </main>
  );
}
