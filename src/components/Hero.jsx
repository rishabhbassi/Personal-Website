import React, { useState, useRef, useEffect } from "react";
import bgSvg from "../assets/finalimage.svg";
import globeSvg from "../assets/globe 1.svg";

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
    >
      {/* Background SVG */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#999D9E",
          backgroundImage: `url(${bgSvg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          zIndex: 0,
        }}
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
          left: "0", // adjust left margin here
          transform: "translateY(-50%)", // center vertically only
          display: "flex",
          alignItems: "center",
          gap: "40px", // space between SVG and arrow+text container
          zIndex: 1,
          color: "black", // default color for SVG (MyShape uses currentColor)
        }}
      >
        <MyShape fillColor="black" />
      </div>

      <div
        style={{
          position: "absolute",
          top: "47%",
          right: 0,
          transform: "translateY(-50%)",
          paddingRight: "50px", // optional padding from right edge
          zIndex: 1,
        }}
      >
        <ArrowAndText
          arrowColor="white"
          textColor="white"
          heading="Freelance"
          subtext="Designer & Developer"
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
        <div style={{ pointerEvents: "auto" }}>
        <CopyrightLogo />
        <TopRightNav />
        </div>
        <ScrollingName />
      </div>
    </div>
  );
}

// Your SVG shape with optional fill color prop
function MyShape({ fillColor = "white" }) {
  return (
    <div style={{ position: "relative", width: 300, height: 120, overflow: "visible" }}>
      {/* Your SVG shape */}
      <svg
        width="300"
        height="120"
        viewBox="0 0 300 120"
        fill={fillColor}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <path d="M239.633657,0 C272.770742,0 299.633657,26.862915 299.633657,60 C299.633657,93.137085 272.770742,120 239.633657,120 L0,120 L0,0 L239.633657,0 Z M239.633657,18.7755102 C216.866,18.7755102 198.409167,37.232343 198.409167,60 C198.409167,82.767657 216.866,101.22449 239.633657,101.22449 C262.401314,101.22449 280.858147,82.767657 280.858147,60 C280.858147,37.232343 262.401314,18.7755102 239.633657,18.7755102 Z" />
        <text
          x="80"
          y="55"
          fill="white"
          fontSize="20"
          fontFamily="'Dennis Sans', sans-serif"
          fontWeight="300"
        >
          <tspan x="80" dy="0">
            Located
          </tspan>
          <tspan x="80" dy="1.2em">
            in India
          </tspan>
        </text>
      </svg>

      {/* Globe positioned inside the shape */}
      <FloatingGlobeWithTooltip
  src={globeSvg}
  style={{
    top: "35px",
    left: "215px",
    width: "50px",
    height: "50px",
  }}
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
    >
      {/* Arrow with shifted Y axis and bigger size, rotated right */}
      <div style={{ transform: "translateY(-90px)" }}>
        <svg
          width="30"
          height="30"
          viewBox="0 0 20 10"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke={arrowColor}
          strokeWidth="1.5"
          style={{ flexShrink: 0, transform: "rotate(90deg)" }} // arrow pointing right
        >
          <polyline points="2.769 0 12 0 12 9.23" />
          <line x1="12" y1="0" x2="0" y2="12" />
        </svg>
      </div>

      {/* Text split vertically */}
      <h4
        style={{
          margin: 0,
          fontWeight: 500,
          fontSize: "2rem",
          lineHeight: 1.2,
        }}
      >
        Freelance
      </h4>
      <h5
        style={{
          margin: 0,
          fontWeight: 500,
          fontSize: "2rem",
          lineHeight: 1.2,
        }}
      >
        Designer & Developer
      </h5>
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
        top: "40px",
        left: "50px",
        zIndex: 1000,
      }}
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
            fontSize: "1.0rem",
            transition: "transform 1s ease",
            transform: hovered ? "rotate(360deg)" : "rotate(0deg)",
            width: "1.2rem",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          ©
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
              fontSize: "1.1rem",
            }}
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
  return (
    <div
      style={{
        position: "absolute",
        top: "40px",
        right: "50px",
        display: "flex",
        gap: "2rem",
        zIndex: 1000,
        fontFamily: "'Dennis Sans', sans-serif",
        fontWeight: "500",
        color: "white",
      }}
    >
      {["Work", "About", "Contact"].map((label) => (
        <button key={label} style={buttonStyle}>
          {label}
          <span className="bullet" />
        </button>
      ))}

      <style>{`
        button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 1rem;
          position: relative;
          padding: 0;
          outline: none;
        }
        button .bullet {
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
        button:hover .bullet {
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


function ScrollingName() {
  const text = "Design — Development — Analytics — ";
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [direction, setDirection] = useState(1); // 1 = left to right (default), -1 = right to left
  const position = useRef(0);
  const speed = 1.7;

  // Duplicate text enough times to cover container width
  const repeatCount = 20; // increase if needed

  // Scroll direction detection
  const lastScrollY = useRef(window.scrollY);
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < lastScrollY.current) {
        setDirection(1);
      } else if (window.scrollY > lastScrollY.current) {
        setDirection(-1);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      if (!contentRef.current || !containerRef.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth; // use scrollWidth for full width

      position.current += speed * direction;

      // Loop logic:
      if (direction === 1 && position.current > 0) {
        // When moving left to right, reset when text fully visible at left edge
        position.current = -contentWidth / 2;
      }
      if (direction === -1 && position.current < -contentWidth / 2) {
        // When moving right to left, reset when half text fully moved left
        position.current = 0;
      }

      contentRef.current.style.transform = `translateX(${position.current}px)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [direction]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        bottom: "3%",
        left: 0,
        width: "100vw",
        overflow: "hidden",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 999,
      }}
    >
      <div
        ref={contentRef}
        style={{
          display: "inline-block",
          fontSize: "13rem",
          fontWeight: "400",
          color: "white",
          fontFamily: "'Dennis Sans', sans-serif",
          letterSpacing: "0.00em",
          willChange: "transform",
          whiteSpace: "nowrap",
        }}
      >
        {[...Array(repeatCount)].map((_, i) => (
          <span key={i}>{text}</span>
        ))}
      </div>
    </div>
  );
}


function FloatingGlobeWithTooltip({ src, style }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        cursor: "pointer",
        ...style,
        animation: "floatUpDown 3s ease-in-out infinite",
      }}
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
          animation: hovered ? "spinOnce 1s ease forwards" : "none",
          transformOrigin: "center center",
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
        @keyframes floatUpDown {
          0%, 100% {
            transform: translateY(7px);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes spinOnce {
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
