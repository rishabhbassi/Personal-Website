import React, { useState, useEffect } from "react";
import Loader from "./components/Loader";
import Hero from "./components/Hero";
import HomePage from "./components/HomePage";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  const [loadingDone, setLoadingDone] = useState(false);

  useEffect(() => {
    // Hide the script's output until loader is done
    if (!loadingDone) {
      // Hide any elements created by the script
      const style = document.createElement('style');
      style.textContent = `
        [id*="noupe"], [class*="noupe"], iframe[src*="noupe"] {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    } else {
      // Show the script's output after loader is done
      const style = document.createElement('style');
      style.textContent = `
        [id*="noupe"], [class*="noupe"], iframe[src*="noupe"] {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
          transition: opacity 0.3s ease-in-out;
        }
      `;
      document.head.appendChild(style);
    }
  }, [loadingDone]);

  return (
    <>
      {/* Hero and HomePage are always mounted */}
      <Hero />
      <HomePage />

      {/* Loader overlays everything, removed only after animation */}
      {!loadingDone && <Loader onFinish={() => setLoadingDone(true)} />}
        <Analytics />
        <SpeedInsights />
    </>
  );
}
