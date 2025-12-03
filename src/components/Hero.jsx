import React, { useState, useRef, useEffect } from "react";
import bgSvg from "../assets/finalimage.svg";
import globeSvg from "../assets/globe 1.svg";
import ScrollVelocity from "./ScrollVelocity";
import "./Hero.css";

export default function Hero() {
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        zIndex: 0,
      }}
      className="hero-container"
    >
      {/* Background SVG */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#999D9E",
          backgroundImage: `url(${bgSvg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "60%",
          backgroundPosition: "center bottom",
          zIndex: 0,
        }}
        className="hero-background"
      />

      {/* Uncomment this div below if you want a dark overlay */}
      {/* <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.13)",
          zIndex: 1,
        }}
      /> */}

      {/* Container for SVG + arrow+text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "0",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "40px",
          zIndex: 1,
          color: "black",
        }}
        className="hero-left-container"
      >
        <MyShape fillColor="black" />
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          paddingRight: "50px",
          zIndex: 1,
        }}
        className="hero-right-container"
      >
        <ArrowAndText
          arrowColor="white"
          textColor="white"
          heading="Rishabh Bassi"
          subtext="AI | Analytics | Design"
        />
      </div>

      {/* UI content above everything */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          width: "100%",
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto" }} className="hero-nav-container">
          <CopyrightLogo />
          <TopRightNav />
        </div>
        <div className="hero-scroll-velocity">
          <ScrollVelocity
            texts={["Design — Development — Analytics —"]}
            // texts={["Rishabh Bassi —"]}
            velocity={100}
            parallaxStyle={{
              position: "absolute",
              bottom: "7%",
              left: 0,
              width: "100vw",
              zIndex: 999,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden", // prevents scroll overflow
            }}
            scrollerStyle={{
              fontFamily: "'Dennis Sans', sans-serif",
              color: "white",
              fontWeight: 500,
              fontSize: "10rem",
              lineHeight: 1.2, // ensures proper vertical sizing
              whiteSpace: "nowrap",
              display: "inline-block", // helps container measure height correctly
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Your SVG shape with optional fill color prop
function MyShape({ fillColor = "white" }) {
  return (
    <div
      style={{
        position: "relative",
        width: 300,
        height: 120,
        overflow: "visible",
      }}
      className="my-shape-container"
    >
      {/* Your SVG shape */}
      <svg
        width="300"
        height="120"
        viewBox="0 0 300 120"
        fill={fillColor}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
        className="my-shape-svg"
      >
        <path d="M239.633657,0 C272.770742,0 299.633657,26.862915 299.633657,60 C299.633657,93.137085 272.770742,120 239.633657,120 L0,120 L0,0 L239.633657,0 Z M239.633657,18.7755102 C216.866,18.7755102 198.409167,37.232343 198.409167,60 C198.409167,82.767657 216.866,101.22449 239.633657,101.22449 C262.401314,101.22449 280.858147,82.767657 280.858147,60 C280.858147,37.232343 262.401314,18.7755102 239.633657,18.7755102 Z" />
        <text
          x="120"
          y="60"
          fill="white"
          fontSize="24"
          fontFamily="'Dennis Sans', sans-serif"
          fontWeight="400"
          textAnchor="middle"
          className="located-text"
        >
          <tspan x="120" dy="0">
            Located
          </tspan>
          <tspan x="120" dy="1.3em">
            in India
          </tspan>
        </text>
      </svg>

      {/* Globe positioned inside the shape */}
      <FloatingGlobeWithTooltip
        src={globeSvg}
      />
    </div>
  );
}

// Arrow + Text stacked vertically with color customization
function ArrowAndText({ arrowColor = "white", textColor = "white" }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1px",
        justifyContent: "center",
        alignItems: "flex-start", // left aligned
        color: textColor,
        fontFamily: "'Dennis Sans', sans-serif",
        paddingRight: "80px",
      }}
      className="arrow-and-text"
    >
      {/* Arrow with shifted Y axis and bigger size, rotated right */}
      <div className="arrow-container">
        <svg
          width="30"
          height="30"
          viewBox="0 0 20 10"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke={arrowColor}
          strokeWidth="1.5"
          className="arrow-svg"
        >
          <polyline points="2.769 0 12 0 12 9.23" />
          <line x1="12" y1="0" x2="0" y2="12" />
        </svg>
      </div>

      {/* Text split vertically */}
      <h2
        style={{
          margin: 0,
          fontWeight: 700,
          fontSize: "2.5rem",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
        className="arrow-heading"
      >
        Rishabh Bassi
      </h2>
      <h3
        style={{
          margin: 0,
          fontWeight: 500,
          fontSize: "2rem",
          lineHeight: 1.2,
        }}
        className="arrow-subheading"
      >
        Designer & Developer
      </h3>
    </div>
  );
}

// === Your existing components below unchanged ===

function CopyrightLogo() {
  const [hovered, setHovered] = useState(false);
  const [stretchX, setStretchX] = useState(0);

  const CodeByRef = useRef(null);
  const CodeByRishabhRef = useRef(null);
  const fullTextRef = useRef(null);
  const containerRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [slideDistance, setSlideDistance] = useState(0);

  useEffect(() => {
    if (CodeByRef.current && CodeByRishabhRef.current && fullTextRef.current) {
      const CodeByWidth = CodeByRef.current.offsetWidth;
      const CodeByRishabhWidth = CodeByRishabhRef.current.offsetWidth;
      setContainerWidth(CodeByRishabhWidth);
      setSlideDistance(CodeByWidth);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percentage = (mouseX / rect.width - 0.5) * 2; // -1 to 1
    setStretchX(percentage * 5); // max 5px left/right
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setStretchX(0);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "50px",
        zIndex: 1000,
      }}
      className="copyright-logo"
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          fontFamily: "'Dennis Sans', sans-serif",
          color: "white",
          gap: "0.2rem",
          fontWeight: "500",
          height: "1.5rem",
        }}
      >
        <span
          style={{
            display: "inline-block",
            transition: "transform 1s ease",
            transform: hovered ? "rotate(360deg)" : "rotate(0deg)",
            width: "1.2rem",
            textAlign: "center",
            flexShrink: 0,
          }}
          className="copyright-symbol"
        >
          &copy;
        </span>

        <div
          ref={containerRef}
          style={{
            width: "8.5rem",
            overflow: "hidden",
            whiteSpace: "nowrap",
            position: "relative",
          }}
        >
          <div
            ref={fullTextRef}
            style={{
              display: "inline-block",
              transition: "transform 0.3s ease",
              transform: `translateX(${
                hovered ? -slideDistance : 0
              }px) translateX(${stretchX}px)`,
            }}
            className="copyright-text"
          >
            <span
              ref={CodeByRef}
              style={{
                position: "absolute",
                visibility: "hidden",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              Code by{" "}
            </span>
            <span
              ref={CodeByRishabhRef}
              style={{
                position: "absolute",
                visibility: "hidden",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              Code by Rishabh
            </span>
            Code by Rishabh Bassi
          </div>
        </div>
      </div>
    </div>
  );
}

function TopRightNav() {
  const handleNavClick = (label) => {
    if (label === "About") {
      // Dispatch custom event to open About Me popup
      window.dispatchEvent(new CustomEvent('openAboutMe'));
      return;
    }
    
    let targetId = "";
    if (label === "Work") {
      targetId = "recent-work";
    } else if (label === "Contact") {
      targetId = "contact";
    }
    
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        right: "50px",
        display: "flex",
        gap: "2rem",
        zIndex: 1000,
        fontFamily: "'Dennis Sans', sans-serif",
        fontWeight: "500",
        color: "white",
      }}
      className="top-right-nav"
    >
      {["Work", "About", "Contact"].map((label) => (
        <button key={label} style={buttonStyle} onClick={() => handleNavClick(label)}>
          {label}
          <span className="bullet" />
        </button>
      ))}

      <style>{`
        .top-right-nav button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          position: relative;
          padding: 0;
          outline: none;
          font-family: 'Dennis Sans', sans-serif;
          font-weight: 500;
        }
        .top-right-nav button .bullet {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background-color: white;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .top-right-nav button:hover .bullet {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

const buttonStyle = {
  position: "relative",
  padding: "0",
  background: "none",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontSize: "1.1rem",
  outline: "none",
};

function FloatingGlobeWithTooltip({ src, className = "" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        cursor: "pointer",
      }}
      className={`floating-globe ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={src}
        alt="Globe"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          zIndex: 10,
          display: "block",
          transformOrigin: "center center",
          transition: "transform 0.3s ease",
        }}
      />

      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: 12,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "6px 14px",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: "500",
            whiteSpace: "nowrap",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
          }}
        >
          Haryana, India
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              marginLeft: -8,
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid rgba(0, 0, 0, 0.8)",
            }}
          />
        </div>
      )}

      <style>{`
        .floating-globe {
          animation: floatUpDown 3s ease-in-out infinite;
        }

        .floating-globe:hover img {
          animation: spinContinuous 2s linear infinite;
        }

        @keyframes floatUpDown {
          0%, 100% {
            transform: translate(-50%, calc(-50% + 10px));
          }
          50% {
            transform: translate(-50%, calc(-50% - 10px));
          }
        }

        @keyframes spinContinuous {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
