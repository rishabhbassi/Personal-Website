import React, { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import FlowingMenu from "./FlowingMenu"; // adjust the path based on your folder structure
import Footer from "./Footer";
import PDFViewer from "./PDFViewer";
import ResearchSection from "./ResearchSection";
import AboutMe from "./AboutMe";
import "./HomePage.css";


export default function HomePage() {
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [showResearchSection, setShowResearchSection] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState({ url: null, title: "Design", fileName: null });
  const [showCaseStudiesPopup, setShowCaseStudiesPopup] = useState(false);
  const [showAboutMePopup, setShowAboutMePopup] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const rightTextLines = [
    "By combining Analytics, AI, and design, I navigate a unique intersection in today’s technology landscape.",
  ];

  const sectionRef = useRef(null);
  const rightColRef = useRef(null);
  const buttonRef = useRef(null);

  const [offset, setOffset] = useState(0); // vertical offset for button
  const [maxOffset, setMaxOffset] = useState(0); // max vertical distance button can move

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  // Combine refs
  const setRefs = (el) => {
    sectionRef.current = el;
    inViewRef(el);
  };

  // Old demo items - commented out
  // const demoItems = [
  //   {
  //     link: "#",
  //     text: "Analytics",
  //     image: "https://picsum.photos/600/400?random=1",
  //   },
  //   { link: "#", text: "AI", image: "https://picsum.photos/600/400?random=2" },
  //   {
  //     link: "#",
  //     text: "Design",
  //     image: "https://picsum.photos/600/400?random=3",
  //   },
  //   {
  //     link: "#",
  //     text: "Case Studies",
  //     image: "https://picsum.photos/600/400?random=4",
  //   },
  // ];

  // New work items
  const workItems = [
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

  useEffect(() => {
    // On mount and resize, calculate maxOffset:
    const updateMaxOffset = () => {
      if (!rightColRef.current || !buttonRef.current || !sectionRef.current) {
        return;
      }

      const sectionHeight = sectionRef.current.offsetHeight;

      // Allow full travel area (e.g. 50% of section height)
      const travelDistance = sectionHeight * 0.5;

      setMaxOffset(travelDistance);
    };

    updateMaxOffset();
    window.addEventListener("resize", updateMaxOffset);
    return () => window.removeEventListener("resize", updateMaxOffset);
  }, []);

  // Handle body scroll when popup is open
  useEffect(() => {
    if (showCaseStudiesPopup || showAboutMePopup || showResearchSection || showContactPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCaseStudiesPopup, showAboutMePopup, showResearchSection, showContactPopup]);

  // Listen for About Me popup open event
  useEffect(() => {
    const handleOpenAboutMe = () => {
      setShowAboutMePopup(true);
    };

    window.addEventListener('openAboutMe', handleOpenAboutMe);
    return () => {
      window.removeEventListener('openAboutMe', handleOpenAboutMe);
    };
  }, []);

  // Listen for Contact popup open event
  useEffect(() => {
    const handleOpenContactPopup = () => {
      setShowContactPopup(true);
    };

    window.addEventListener('openContactPopup', handleOpenContactPopup);
    return () => {
      window.removeEventListener('openContactPopup', handleOpenContactPopup);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !buttonRef.current) {
        return;
      }

      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const sectionBottom = sectionRef.current.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;

      const sectionHeight = sectionRef.current.offsetHeight;

      // Get scroll progress (0 to 1)
      let progress =
        (windowHeight - sectionTop) / (windowHeight + sectionHeight);
      progress = Math.min(Math.max(progress, 0), 1);

      let newOffset = maxOffset * (1 - progress); // inverse movement

      // Calculate the button’s absolute bottom position
      const buttonY = sectionTop + newOffset + buttonRef.current.offsetHeight;

      // Prevent the button from going below the section’s bottom
      if (buttonY > sectionBottom) {
        newOffset = sectionBottom - sectionTop - buttonRef.current.offsetHeight;
      }

      setOffset(newOffset);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // init
    return () => window.removeEventListener("scroll", handleScroll);
  }, [maxOffset]);

  return (
    <>
      <div
        ref={setRefs}
        style={{
          padding: "15vh 15vw 1vh 15vw",
          minHeight: "10vh",
          boxSizing: "border-box",
          backgroundColor: "white",
          position: "relative",
        }}
        className="homepage-main-section"
      >
        <div
          style={{
            color: "#111",
            fontFamily: "'Dennis Sans', sans-serif",
            display: "flex",
            alignItems: "flex-start",
            gap: "30px",
            justifyContent: "space-between",
          }}
          className="homepage-content-wrapper"
        >
          {/* Left column */}
          <div
            style={{
              flex: 2,
              textAlign: "left",
              fontSize: "2rem",
              lineHeight: 1.6,
              margin: 0,
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0px)" : "translateY(60px)",
              transition:
                "opacity 0.9s cubic-bezier(0.19, 1, 0.22, 1), transform 0.9s cubic-bezier(0.19, 1, 0.22, 1)",
              transitionDelay: inView ? "0.3s" : "0s",
            }}
            className="homepage-left-column"
          >
            I craft human-centered products by combining clean design, smart systems, 
            and a deep respect for how people actually interact with technology.
          </div>

          {/* Right column */}
          <div
            ref={rightColRef}
            style={{
              width: "240px",
              flexShrink: 0,
              textAlign: "left",
              fontSize: "1rem",
              lineHeight: "1.8",
              fontWeight: "500",
              position: "relative", // Required for absolute positioning inside
              minHeight: "20rem", // Ensures space for button
            }}
            className="homepage-right-column"
          >
            <div>
              {rightTextLines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>

            {/* Moving button */}
            <div
              ref={buttonRef}
              style={{
                position: "absolute",
                bottom: "5rem",
                left: 0,
                right: 0,
                margin: "auto",
                transform: `translateY(${offset}px)`,
                transition: "background-position 0.4s ease-in-out",

                width: "170px",
                height: "170px",
                borderRadius: "50%",
                background: "linear-gradient(to top, #000 50%, #5d0dffff 50%)",
                backgroundSize: "100% 200%",
                backgroundPosition: "bottom",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Dennis Sans', sans-serif",
                fontWeight: "300",
                cursor: "pointer",
                zIndex: 2, // ensure it's above text
              }}
              className="homepage-about-button"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundPosition = "top";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundPosition = "bottom";
              }}
              onClick={() => setShowAboutMePopup(true)}
            >
              About Me
            </div>
          </div>
        </div>
      </div>

      {/* Recent Work Section - Commented out */}
      {/* <div style={{ padding: "2rem 15vw", backgroundColor: "#ffffff" }} className="recent-work-section">
        <h2
          style={{
            marginBottom: "1rem",
            marginTop: 0,
            fontFamily: "'Dennis Sans', sans-serif",
            color: "#060010",
            fontWeight: "300",
            textAlign: "left",
          }}
          className="recent-work-heading"
        >
          Recent Work
        </h2>
        <div style={{ height: "600px", position: "relative" }} className="recent-work-container">
          <FlowingMenu 
            items={demoItems} 
            onItemClick={() => setIsPDFViewerOpen(true)}
          />
        </div>
      </div> */}

      {/* New Work Section */}
      <div id="recent-work" style={{ padding: "2rem 15vw", backgroundColor: "#ffffff" }} className="recent-work-section">
        <h2
          style={{
            marginBottom: "1rem",
            marginTop: 0,
            fontFamily: "'Dennis Sans', sans-serif",
            color: "#060010",
            fontWeight: "300",
            textAlign: "left",
          }}
          className="recent-work-heading"
        >
          Recent Work
        </h2>
        <div style={{ height: "600px", position: "relative" }} className="recent-work-container">
          <FlowingMenu 
            items={workItems} 
            onItemClick={(itemText) => {
              if (itemText.toLowerCase() === "design") {
                setSelectedPDF({ url: null, title: "Design", fileName: null });
                setIsPDFViewerOpen(true);
              } else if (itemText.toLowerCase() === "research") {
                setShowResearchSection(true);
                // Scroll to research section
                setTimeout(() => {
                  const researchSection = document.querySelector('.research-section');
                  if (researchSection) {
                    researchSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              } else if (itemText.toLowerCase() === "case studies") {
                setShowCaseStudiesPopup(true);
              }
            }}
          />
        </div>
      </div>

      {showResearchSection && (
        <ResearchSection 
          onPaperClick={(paper) => {
            setSelectedPDF({
              url: paper.pdfUrl,
              title: paper.title,
              fileName: `${paper.title}.pdf`
            });
            setIsPDFViewerOpen(true);
            setShowResearchSection(false);
          }}
          onClose={() => setShowResearchSection(false)}
        />
      )}

      <PDFViewer 
        isOpen={isPDFViewerOpen} 
        onClose={() => {
          setIsPDFViewerOpen(false);
          setSelectedPDF({ url: null, title: "Design", fileName: null });
        }}
        pdfUrl={selectedPDF.url}
        title={selectedPDF.title}
        downloadFileName={selectedPDF.fileName}
      />

      {/* Case Studies Popup */}
      {showCaseStudiesPopup && (
        <div className="case-studies-popup-overlay" onClick={() => setShowCaseStudiesPopup(false)}>
          <div className="case-studies-popup" onClick={(e) => e.stopPropagation()}>
            <button className="case-studies-popup-close" onClick={() => setShowCaseStudiesPopup(false)}>
              −
            </button>
            <div className="case-studies-popup-content">
              <h2 className="case-studies-popup-title">Case Studies</h2>
              <p className="case-studies-popup-message">
                This section is currently being developed. Please check back soon!
              </p>
              <button className="case-studies-popup-button" onClick={() => setShowCaseStudiesPopup(false)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Me Page */}
      {showAboutMePopup && (
        <AboutMe 
          onClose={() => setShowAboutMePopup(false)}
          onViewResume={(resumeUrl) => {
            setSelectedPDF({ 
              url: resumeUrl, 
              title: "Resume", 
              fileName: "Rishabh_Bassi_Resume.pdf" 
            });
            setIsPDFViewerOpen(true);
            setShowAboutMePopup(false);
          }}
        />
      )}

      {/* Contact Popup */}
      {showContactPopup && (
        <div className="contact-popup-overlay" onClick={() => setShowContactPopup(false)}>
          <div className="contact-popup" onClick={(e) => e.stopPropagation()}>
            <button className="contact-popup-close" onClick={() => setShowContactPopup(false)}>
              −
            </button>
            <div className="contact-popup-content">
              <h2 className="contact-popup-title">Get in Touch</h2>
              <p className="contact-popup-message">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out—let's create something amazing together.
              </p>
              <div className="contact-popup-links">
                <a href="mailto:rishabhb.career@gmail.com" className="contact-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>rishabhb.career@gmail.com</span>
                </a>
                <a href="tel:+918529177707" className="contact-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span>+91 8529177707</span>
                </a>
                <a href="https://www.linkedin.com/in/rishabh-bassi-5981a9223/" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
              <button className="contact-popup-button" onClick={() => setShowContactPopup(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer/>
    </>
  );
}
