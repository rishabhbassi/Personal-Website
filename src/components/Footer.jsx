import React, { useEffect, useState } from "react";
import "./Footer.css";

const NAV_ITEMS = [
  { key: "work", label: "Work" },
  { key: "about", label: "About" },
  { key: "research", label: "Research" },
  { key: "case-studies", label: "Case Studies" },
  { key: "side-quests", label: "Side Quests" },
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export default function Footer({
  onOpenAbout,
  onOpenResearch,
  onOpenCaseStudies,
  onOpenContact,
}) {
  const [time, setTime] = useState("");
  const year = new Date().getFullYear();

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
      timeZoneName: "short",
    });

    const updateTime = () => setTime(formatter.format(new Date()));
    updateTime();
    const interval = window.setInterval(updateTime, 30000);
    return () => window.clearInterval(interval);
  }, []);

  const openContact = () => {
    if (onOpenContact) {
      onOpenContact();
      return;
    }
    window.dispatchEvent(new CustomEvent("openContactPopup"));
  };

  const openOverlay = (key) => {
    if (key === "work") {
      document.getElementById("recent-work")?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
      return;
    }

    if (key === "about") {
      if (onOpenAbout) onOpenAbout();
      else window.dispatchEvent(new CustomEvent("openAboutMe"));
      return;
    }

    if (key === "research") {
      if (onOpenResearch) onOpenResearch();
      else window.dispatchEvent(new CustomEvent("openResearchSection"));
      return;
    }

    if (key === "case-studies") {
      if (onOpenCaseStudies) onOpenCaseStudies();
      else window.dispatchEvent(new CustomEvent("openCaseStudies"));
      return;
    }

    if (key === "side-quests") {
      document.getElementById("side-quests")?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <footer id="contact" className="site-footer" aria-labelledby="footer-heading">
      <div className="footer-inner">
        <div className="footer-main">
          <div className="footer-intro">
            <p className="footer-kicker">
              <span className="footer-kicker-dot" aria-hidden="true" />
              Contact / Start a conversation
            </p>

            <h2 className="footer-heading" id="footer-heading">
              Let&apos;s build <span>something great</span> together.
            </h2>

            <p className="footer-intro-copy">
              I&apos;m open to new projects, creative ideas, and opportunities
              to make thoughtful work with good people.
            </p>

            <div className="footer-contact-actions">
              <a
                className="footer-pill footer-pill-primary"
                href="mailto:rishabhb.career@gmail.com"
              >
                Email me
                <span aria-hidden="true">↗</span>
              </a>
              <a className="footer-pill" href="tel:+918529177707">
                +91 8529177707
              </a>
            </div>
          </div>

          <div className="footer-contact-panel">
            <button
              type="button"
              className="footer-contact-button"
              onClick={openContact}
            >
              <span>
                Get in
                <br />
                touch
              </span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 19 19 5M9 5h10v10" />
              </svg>
            </button>

            <dl className="footer-contact-meta">
              <div>
                <dt>Based in</dt>
                <dd>New Delhi, India</dd>
              </div>
              <div>
                <dt>Local time</dt>
                <dd>{time || "—"}</dd>
              </div>
            </dl>
          </div>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <p className="footer-nav-label">Index</p>
          <div className="footer-nav-links">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => openOverlay(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="footer-bottom">
          <p>
            © {year} Rishabh Bassi
            <span className="footer-edition">Portfolio / Edition {year}</span>
          </p>
          <div className="footer-bottom-links">
            <a
              href="https://www.linkedin.com/in/rishabh-bassi-5981a9223/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://github.com/rishabhbassi"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <button type="button" onClick={backToTop}>
              Back to top <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
