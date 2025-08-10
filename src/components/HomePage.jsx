import React, { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import FlowingMenu from "./FlowingMenu"; // adjust the path based on your folder structure
import Footer from "./Footer";


export default function HomePage() {
  const rightTextLines = [
    "The combination of my passion for design, code & interaction positions me in a unique place in the web design world.",
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

  const demoItems = [
    {
      link: "#",
      text: "Analytics",
      image: "https://picsum.photos/600/400?random=1",
    },
    { link: "#", text: "AI", image: "https://picsum.photos/600/400?random=2" },
    {
      link: "#",
      text: "Design",
      image: "https://picsum.photos/600/400?random=3",
    },
    {
      link: "#",
      text: "Case Studies",
      image: "https://picsum.photos/600/400?random=4",
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
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundPosition = "top";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundPosition = "bottom";
              }}
            >
              About Me
            </div>
          </div>
        </div>
      </div>

      {/* Recent Work Section */}
      <div style={{ padding: "2rem 15vw", backgroundColor: "#ffffff" }}>
        <h2
          style={{
            marginBottom: "1rem",
            marginTop: 0,
            fontFamily: "'Dennis Sans', sans-serif",
            color: "#060010",
            fontWeight: "300",
            textAlign: "left",
          }}
        >
          Recent Work
        </h2>
        <div style={{ height: "600px", position: "relative" }}>
          <FlowingMenu items={demoItems} />
        </div>
      </div>
      <Footer/>
    </>
  );
}
