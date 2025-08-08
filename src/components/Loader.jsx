import React, { useEffect, useState } from "react";

const greetings = [
  "Hello",
  "Namaste",
  "Bonjour",
  "Hola",
  "Hallo",
  "Ciao",
  "こんにちは",
];

export default function Loader({ onFinish }) {
  const [index, setIndex] = useState(0);
  const [slideUp, setSlideUp] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 150);

    // After 3 seconds, start slide up animation
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setSlideUp(true);
      // After slide up animation (1.2s), call onFinish
      //   setTimeout(() => {
      //     onFinish();
      //   }, 800);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div
      onTransitionEnd={() => {
        if (slideUp) {
          console.log("Transition ended, calling onFinish");
          onFinish();
        }
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#131313ff",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "4rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        userSelect: "none",
        overflow: "hidden",
        zIndex: 9999,
        flexDirection: "column",
        transition: "transform 1.2s ease-in-out",
        transform: slideUp ? "translateY(-100vh)" : "translateY(0)",
        transition: slideUp
          ? "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), clip-path 1.2s cubic-bezier(0.4, 0, 0.2, 1)"
          : "none",
        clipPath: slideUp ? "ellipse(150% 100% at 50% 0%)" : "inset(0)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            display: "inline-block",
            width: "1.2em",
            marginRight: "0.5em",
            fontWeight: "bold",
            color: "#ffffffff",
            fontSize: "1.5rem",
            lineHeight: "1",
            userSelect: "none",
          }}
        >
          •
        </span>
        {greetings[index]}
      </div>
    </div>
  );
}
