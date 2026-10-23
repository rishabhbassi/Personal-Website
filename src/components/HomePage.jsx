import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import FlowingMenu from "./FlowingMenu";
import Footer from "./Footer";
import ResearchSection from "./ResearchSection";
import AboutMe from "./AboutMe";
import ContactPopup from "./ContactPopup";
import useDialogFocus from "../hooks/useDialogFocus";
import "./HomePage.css";

const loadPDFViewer = () => import("./PDFViewer");
const PDFViewer = lazy(loadPDFViewer);
const loadPortfolioViewer = () => import("./PortfolioViewer");
const PortfolioViewer = lazy(loadPortfolioViewer);
const CaseStudiesPage = lazy(() => import("./case-studies/CaseStudiesPage"));
const SurgePricingCaseStudy = lazy(
  () => import("./case-studies/SurgePricingCaseStudy"),
);

const WORK_ITEMS = [
  {
    link: "#",
    text: "Design",
    image: "https://picsum.photos/600/400?random=1",
  },
  {
    link: "#",
    text: "Research",
    image: "https://picsum.photos/600/400?random=2",
  },
  {
    link: "#",
    text: "Case Studies",
    image: "https://picsum.photos/600/400?random=3",
  },
];

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/**
 * A focus-contained holding screen for a lazily loaded full-screen view, so a
 * slow chunk never leaves the page looking unresponsive.
 */
function OverlayLoading({ label, dark = false, onCancel }) {
  const dialogRef = useDialogFocus(onCancel);

  return (
    <div
      ref={dialogRef}
      className={`overlay-loading${dark ? " overlay-loading--dark" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
    >
      <span className="overlay-loading-mark" aria-hidden="true" />
      <p className="overlay-loading-label" role="status" aria-live="polite">
        {label}
      </p>
      <button
        type="button"
        className="overlay-loading-cancel"
        onClick={onCancel}
        data-autofocus
      >
        Cancel
      </button>
    </div>
  );
}

export default function HomePage() {
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [isPortfolioViewerOpen, setIsPortfolioViewerOpen] = useState(false);
  const [showResearchSection, setShowResearchSection] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState({
    url: null,
    title: "Document",
    fileName: null,
  });
  const [showCaseStudiesIndex, setShowCaseStudiesIndex] = useState(false);
  const [showSurgeCaseStudy, setShowSurgeCaseStudy] = useState(false);
  const [showAboutMePopup, setShowAboutMePopup] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);

  const sectionRef = useRef(null);
  const buttonRef = useRef(null);
  const pdfTriggerRef = useRef(null);
  const portfolioTriggerRef = useRef(null);

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  const setSectionRefs = (element) => {
    sectionRef.current = element;
    inViewRef(element);
  };

  // Keep the About button inside the section and give it a restrained amount of
  // travel. The transform is written directly to the node so scrolling does not
  // trigger a React render on every frame.
  useEffect(() => {
    const section = sectionRef.current;
    const button = buttonRef.current;
    if (!section || !button) return undefined;

    let frame = 0;

    const update = () => {
      frame = 0;
      if (window.innerWidth <= 900 || prefersReducedMotion()) {
        button.style.transform = "";
        return;
      }

      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const sectionHeight = section.offsetHeight;

      let progress = (windowHeight - sectionTop) / (windowHeight + sectionHeight);
      progress = Math.min(Math.max(progress, 0), 1);

      const shift = 64 * (1 - progress);
      button.style.transform = `translateY(${shift}px)`;
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Warm the portfolio viewer while the loader is still on screen. It stays a
  // separate chunk, so it never blocks the initial render.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadPortfolioViewer().catch(() => {});
    }, 1600);

    return () => window.clearTimeout(timer);
  }, []);

  // Lock the page behind every full-screen surface, including the PDF reader.
  useEffect(() => {
    const overlayIsOpen =
      isPDFViewerOpen ||
      isPortfolioViewerOpen ||
      showCaseStudiesIndex ||
      showSurgeCaseStudy ||
      showAboutMePopup ||
      showResearchSection ||
      showContactPopup;

    document.body.style.overflow = overlayIsOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    isPDFViewerOpen,
    isPortfolioViewerOpen,
    showCaseStudiesIndex,
    showSurgeCaseStudy,
    showAboutMePopup,
    showResearchSection,
    showContactPopup,
  ]);

  // Events keep navigation from the hero and footer working without threading
  // callbacks through every component.
  useEffect(() => {
    const handlers = {
      openAboutMe: () => setShowAboutMePopup(true),
      openContactPopup: () => setShowContactPopup(true),
      openResearchSection: () => setShowResearchSection(true),
      openCaseStudies: () => {
        setShowSurgeCaseStudy(false);
        setShowCaseStudiesIndex(true);
      },
    };

    Object.entries(handlers).forEach(([eventName, handler]) => {
      window.addEventListener(eventName, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([eventName, handler]) => {
        window.removeEventListener(eventName, handler);
      });
    };
  }, []);

  // Remember what opened the document so focus can land back on it reliably,
  // even when the viewer chunk arrives after the underlying view turned inert.
  const openPDF = (pdf) => {
    const activeElement = document.activeElement;
    pdfTriggerRef.current =
      activeElement instanceof HTMLElement ? activeElement : null;
    setSelectedPDF(pdf);
    setIsPDFViewerOpen(true);
  };

  const closePDF = () => {
    const trigger = pdfTriggerRef.current;
    setIsPDFViewerOpen(false);
    setSelectedPDF({ url: null, title: "Document", fileName: null });

    window.requestAnimationFrame(() => {
      if (
        trigger instanceof HTMLElement &&
        document.contains(trigger) &&
        !trigger.closest("[inert]") &&
        trigger.getClientRects().length > 0
      ) {
        trigger.focus({ preventScroll: true });
      }
    });
  };

  const openPortfolio = () => {
    const activeElement = document.activeElement;
    portfolioTriggerRef.current =
      activeElement instanceof HTMLElement ? activeElement : null;
    setIsPortfolioViewerOpen(true);
  };

  const closePortfolio = () => {
    const trigger = portfolioTriggerRef.current;
    setIsPortfolioViewerOpen(false);

    window.requestAnimationFrame(() => {
      if (
        trigger instanceof HTMLElement &&
        document.contains(trigger) &&
        !trigger.closest("[inert]") &&
        trigger.getClientRects().length > 0
      ) {
        trigger.focus({ preventScroll: true });
      }
    });
  };

  const openCaseStudies = () => {
    setShowSurgeCaseStudy(false);
    setShowCaseStudiesIndex(true);
  };

  const handleWorkItemClick = (itemText) => {
    const item = itemText.toLowerCase();

    if (item === "design") {
      openPortfolio();
      return;
    }

    if (item === "research") {
      setShowResearchSection(true);
      return;
    }

    if (item === "case studies") {
      openCaseStudies();
    }
  };

  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <section
          ref={setSectionRefs}
          className="homepage-main-section"
          aria-labelledby="homepage-statement"
        >
          <div className="homepage-content-wrapper">
            <div
              className={`homepage-left-column${inView ? " is-visible" : ""}`}
            >
              <p className="homepage-eyebrow">
                <span className="homepage-eyebrow-index">01</span>
                Approach / What I do
              </p>
              <h2 className="homepage-statement" id="homepage-statement">
                I craft human-centered products by combining clean design, smart
                systems, and a deep respect for how people actually interact with
                technology.
              </h2>
            </div>

            <aside className="homepage-right-column" aria-label="About my work">
              <p className="homepage-aside-label">Working philosophy</p>
              <p className="homepage-aside-copy">
                By combining analytics, AI, and design, I navigate a unique
                intersection in today&apos;s technology landscape.
              </p>

              <button
                ref={buttonRef}
                type="button"
                className="homepage-about-button"
                onClick={() => setShowAboutMePopup(true)}
                aria-haspopup="dialog"
              >
                <span>About me</span>
                <span className="homepage-about-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            </aside>
          </div>
        </section>

        <section
          id="recent-work"
          className="recent-work-section"
          aria-labelledby="recent-work-title"
        >
          <div className="recent-work-header">
            <div>
              <p className="recent-work-eyebrow">
                <span className="homepage-eyebrow-index">02</span>
                Index / Selected disciplines
              </p>
              <h2 className="recent-work-heading" id="recent-work-title">
                Recent Work
              </h2>
            </div>
            <p className="recent-work-note">
              Three disciplines, one way of thinking. Select an item to explore
              the work.
            </p>
          </div>

          <div className="recent-work-container">
            <FlowingMenu items={WORK_ITEMS} onItemClick={handleWorkItemClick} />
          </div>
        </section>
      </main>

      {showResearchSection && (
        <div inert={isPDFViewerOpen ? true : undefined}>
          <ResearchSection onClose={() => setShowResearchSection(false)} />
        </div>
      )}

      {isPDFViewerOpen && (
        <Suspense
          fallback={
            <OverlayLoading
              label="Opening document"
              dark
              onCancel={closePDF}
            />
          }
        >
          <PDFViewer
            isOpen={isPDFViewerOpen}
            onClose={closePDF}
            pdfUrl={selectedPDF.url}
            title={selectedPDF.title}
            downloadFileName={selectedPDF.fileName}
          />
        </Suspense>
      )}

      {isPortfolioViewerOpen && (
        <Suspense
          fallback={
            <OverlayLoading
              label="Opening portfolio"
              dark
              onCancel={closePortfolio}
            />
          }
        >
          <PortfolioViewer onClose={closePortfolio} />
        </Suspense>
      )}

      {showCaseStudiesIndex && !showSurgeCaseStudy && (
        <Suspense
          fallback={
            <OverlayLoading
              label="Opening case studies"
              onCancel={() => setShowCaseStudiesIndex(false)}
            />
          }
        >
          <CaseStudiesPage
            onBack={() => setShowCaseStudiesIndex(false)}
            onOpenCaseStudy={() => setShowSurgeCaseStudy(true)}
          />
        </Suspense>
      )}

      {showSurgeCaseStudy && (
        <Suspense
          fallback={
            <OverlayLoading
              label="Opening case study"
              dark
              onCancel={() => setShowSurgeCaseStudy(false)}
            />
          }
        >
          <SurgePricingCaseStudy
            onBack={() => {
              setShowSurgeCaseStudy(false);
              setShowCaseStudiesIndex(true);
            }}
            onClosePortfolio={() => {
              setShowSurgeCaseStudy(false);
              setShowCaseStudiesIndex(false);
            }}
          />
        </Suspense>
      )}

      {showAboutMePopup && (
        <div inert={isPDFViewerOpen ? true : undefined}>
          <AboutMe
            onClose={() => setShowAboutMePopup(false)}
            onViewResume={(resumeUrl) => {
              openPDF({
                url: resumeUrl,
                title: "Resume",
                fileName: "Rishabh_Bassi_Resume.pdf",
              });
            }}
          />
        </div>
      )}

      {showContactPopup && (
        <ContactPopup onClose={() => setShowContactPopup(false)} />
      )}

      <Footer
        onOpenAbout={() => setShowAboutMePopup(true)}
        onOpenResearch={() => setShowResearchSection(true)}
        onOpenCaseStudies={openCaseStudies}
        onOpenContact={() => setShowContactPopup(true)}
      />
    </>
  );
}
