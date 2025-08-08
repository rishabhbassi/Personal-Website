import React, { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function WhiteSection() {
  const rightTextLines = [
    "The combination of my passion for design, code & interaction positions me in a unique place in the web design world.",
  ];

  const sectionRef = useRef(null);
  const buttonRef = useRef(null);

  const [scrollDir, setScrollDir] = useState("down");
  const [offset, setOffset] = useState(0); // Button vertical offset

  const prevScrollY = useRef(window.scrollY);

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  // Combine section and inView refs
  const setRefs = (el) => {
    sectionRef.current = el;
    inViewRef(el);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      const direction = currentScrollY > prevScrollY.current ? "down" : "up";
      setScrollDir(direction);

      // Update offset in opposite direction of scroll
      setOffset((prevOffset) => {
        const delta = direction === "down" ? 5 : -5;
        const newOffset = prevOffset + delta;

        // Clamp the offset between 0 and a max (e.g., 100px movement range)
        return Math.max(0, Math.min(100, newOffset));
      });

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={setRefs}
      style={{
        padding: "25vh 15vw",
        minHeight: "100vh",
        boxSizing: "border-box",
        backgroundColor: "white",
        position: "relative",
      }}
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
        >
          Helping brands to stand out in the digital era. Together we will set
          the new status quo. No nonsense, always on the cutting edge.
        </div>

        {/* Right column */}
        <div
          style={{
            width: "240px",
            flexShrink: 0,
            textAlign: "left",
            fontSize: "1rem",
            lineHeight: "1.8",
            fontWeight: "500",
            position: "relative",
          }}
        >
          {rightTextLines.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}

          {/* Moving button container */}
          <div
  ref={buttonRef}
  style={{
    marginTop: "40px",
    transform: `translateY(${offset}px)`,
    transition: "transform 0.2s ease-out",
    width: "160px", // Increased size
    height: "160px",
    borderRadius: "50%",
    background: "linear-gradient(to top, #000 50%, #5d0dffff 50%)",
    backgroundSize: "100% 200%",
    backgroundPosition: "bottom", // Start from bottom
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    cursor: "pointer",
    position: "relative",
    transitionProperty: "transform, background-position",
    transitionDuration: "0.4s",
    transitionTimingFunction: "ease-in-out",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundPosition = "top"; // animate up
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundPosition = "bottom"; // animate down
  }}
>
  About Me
</div>

        </div>
      </div>
    </div>
  );
}
