import React, { useState } from "react";
import Loader from "./components/Loader";
import Hero from "./components/Hero";
import HomePage from "./components/HomePage";

export default function App() {
  const [loadingDone, setLoadingDone] = useState(false);

  return (
    <>
      {/* Hero and HomePage are always mounted */}
      <Hero />
      <HomePage />

      {/* Loader overlays everything, removed only after animation */}
      {!loadingDone && <Loader onFinish={() => setLoadingDone(true)} />}
    </>
  );
}
