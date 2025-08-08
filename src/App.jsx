import React, { useState } from "react";
import Loader from "./components/Loader";
import Hero from "./components/Hero";
import WhiteSection from "./components/WhiteSection"; // ⬅️ Add this line

export default function App() {
  const [loadingDone, setLoadingDone] = useState(false);

  return (
    <>
      {!loadingDone && <Loader onFinish={() => setLoadingDone(true)} />}
      {loadingDone && (
        <>
          <Hero />
          <WhiteSection /> {/* ⬅️ Add this below Hero */}
        </>
      )}
    </>
  );
}
