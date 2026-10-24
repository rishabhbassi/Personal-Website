import React, { useEffect, useRef, useState } from "react";
import runNavigation from "./heroNavigation";

const NAV_ITEMS = [
  { label: "Work", action: "work" },
  { label: "About", action: "about" },
  { label: "Research", action: "research" },
  { label: "Case Studies", action: "case-studies" },
  { label: "Side Quests", action: "side-quests" },
];

export default function HeroHeader({ floating = false, contained = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!floating || contained) return undefined;

    const update = () => setStuck(window.scrollY > 24);

    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => window.removeEventListener("scroll", update);
  }, [floating, contained]);

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

  const isStuck = stuck || contained;

  return (
    <header
      className={`hero-header${isStuck ? " is-stuck" : ""}${menuOpen ? " has-menu" : ""}${
        contained ? " is-contained" : ""
      }`}
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
          <span className="hero-brand-role">Data · Product · Interface</span>
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
  );
}
