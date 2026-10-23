import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Loader.css";

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
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      const timeout = window.setTimeout(finish, 300);
      return () => window.clearTimeout(timeout);
    }

    const interval = window.setInterval(() => {
      setIndex((previous) => (previous + 1) % greetings.length);
    }, 150);

    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
      setSlideUp(true);
    }, 1400);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [finish]);

  useEffect(() => {
    if (!slideUp) return undefined;
    const fallback = window.setTimeout(finish, 950);
    return () => window.clearTimeout(fallback);
  }, [finish, slideUp]);

  const handleTransitionEnd = (event) => {
    if (event.propertyName === "transform" && slideUp) {
      finish();
    }
  };

  return (
    <div
      className={`site-loader${slideUp ? " is-leaving" : ""}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <p className="sr-only" role="status">
        Loading portfolio…
      </p>

      <div className="site-loader-center" aria-hidden="true">
        <span className="site-loader-dot" />
        <span className="site-loader-greeting">{greetings[index]}</span>
      </div>

      <div className="site-loader-meta" aria-hidden="true">
        <p>Rishabh Bassi / Portfolio</p>
        <p>Loading</p>
      </div>

      <div className="site-loader-progress" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
