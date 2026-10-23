import React, { useEffect, useRef, useState } from "react";
import heroAvatar from "../assets/hero-avatar.jpg";
import globeSvg from "../assets/globe 1.svg";
import ScrollVelocity from "./ScrollVelocity";
import "./Hero.css";

const NAV_ITEMS = [
  { label: "Work", action: "work" },
  { label: "About", action: "about" },
  { label: "Research", action: "research" },
  { label: "Case Studies", action: "case-studies" },
  { label: "Side Quests", action: "side-quests" },
];

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function scrollToSection(targetId) {
  const targetElement = document.getElementById(targetId);

  if (!targetElement) return;

  targetElement.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

function runNavigation(action) {
  if (action === "work") {
    scrollToSection("recent-work");
    return;
  }

  if (action === "about") {
    window.dispatchEvent(new CustomEvent("openAboutMe"));
    return;
  }

  if (action === "research") {
    window.dispatchEvent(new CustomEvent("openResearchSection"));
    return;
  }

  if (action === "case-studies") {
    window.dispatchEvent(new CustomEvent("openCaseStudies"));
    return;
  }

  if (action === "side-quests") {
    scrollToSection("side-quests");
    return;
  }

  if (action === "contact") {
    window.dispatchEvent(new CustomEvent("openContactPopup"));
  }
}

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus({ preventScroll: true });
      }
    };

    const closeOnOutsidePress = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const desktopQuery = window.matchMedia("(min-width: 861px)");
    const closeOnDesktop = () => {
      if (desktopQuery.matches) setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    desktopQuery.addEventListener?.("change", closeOnDesktop);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      desktopQuery.removeEventListener?.("change", closeOnDesktop);
    };
  }, [menuOpen]);

  const handleNavigation = (action) => {
    if (menuOpen) {
      setMenuOpen(false);
      menuButtonRef.current?.focus({ preventScroll: true });
    }

    runNavigation(action);
  };

  return (
    <div id="top" className="hero-container">
      <header
        className="hero-header"
        ref={headerRef}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setMenuOpen(false);
          }
        }}
      >
        <a
          className="hero-brand"
          href="#top"
          aria-label="Rishabh Bassi — back to top"
          onClick={() => setMenuOpen(false)}
        >
          <span className="hero-brand-mark" aria-hidden="true">
            RB
          </span>
          <span className="hero-brand-copy">
            <span className="hero-brand-name">Rishabh Bassi</span>
            <span className="hero-brand-role">
              Data · Product · Interface
            </span>
          </span>
        </a>

        <nav className="hero-nav" aria-label="Primary">
          {NAV_ITEMS.map((item, index) => (
            <button
              key={item.action}
              type="button"
              className="hero-nav-link"
              onClick={() => handleNavigation(item.action)}
              aria-haspopup={
                item.action === "work" || item.action === "side-quests"
                  ? undefined
                  : "dialog"
              }
            >
              <span className="hero-nav-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{item.label}</span>
            </button>
          ))}

          <button
            type="button"
            className="hero-nav-contact"
            onClick={() => handleNavigation("contact")}
            aria-haspopup="dialog"
          >
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </button>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className={`hero-menu-toggle${menuOpen ? " is-open" : ""}`}
          aria-expanded={menuOpen}
          aria-controls="hero-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <span className="hero-menu-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>

        {menuOpen && (
          <nav
            id="hero-mobile-menu"
            className="hero-mobile-menu"
            aria-label="Mobile"
          >
            {NAV_ITEMS.map((item, index) => (
              <button
                key={item.action}
                type="button"
                className="hero-mobile-link"
                onClick={() => handleNavigation(item.action)}
                aria-haspopup={
                  item.action === "work" || item.action === "side-quests"
                    ? undefined
                    : "dialog"
                }
              >
                <span className="hero-mobile-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
                <span className="hero-mobile-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            ))}

            <button
              type="button"
              className="hero-mobile-contact"
              onClick={() => handleNavigation("contact")}
              aria-haspopup="dialog"
            >
              Let&apos;s talk <span aria-hidden="true">↗</span>
            </button>
          </nav>
        )}
      </header>

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
              Data, AI & Product Engineer
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
                onClick={() => handleNavigation("work")}
              >
                View selected work <span aria-hidden="true">↗</span>
              </button>
              <button
                type="button"
                className="hero-action hero-action-secondary"
                onClick={() => handleNavigation("about")}
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
            texts={["Design — Development — Analytics —"]}
            velocity={85}
            parallaxClassName="hero-marquee-parallax"
            scrollerClassName="hero-marquee-scroller"
          />
        </div>
      </div>
    </div>
  );
}
