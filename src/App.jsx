import React, { useState } from "react";
import Loader from "./components/Loader";
import Hero from "./components/Hero";
import HomePage from "./components/HomePage"; // ⬅️ Add this line

export default function App() {
  const [loadingDone, setLoadingDone] = useState(false);

  return (
    <>
      {!loadingDone && <Loader onFinish={() => setLoadingDone(true)} />}
      {loadingDone && (
        <>
          <Hero />
          <HomePage /> {/* ⬅️ Add this below Hero */}
        </>
      )}
    </>
  );
}
