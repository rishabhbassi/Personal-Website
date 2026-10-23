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

const VARIANT_KEY = "rb-loader-variant";

// Timings are intentionally short — the opener is a handshake, not a wait.
const EXIT_MS = 650;
const OPENER_FIRST_HOLD = 700;
const OPENER_SECOND_HOLD = 700;
const INNER_HOLD = 1200;

const INDEX = "index";
const GREETING = "greeting";

/**
 * Refreshing on an inner route (About, Research, Case Studies) counts as an
 * in-site load, so it gets the index card. The homepage opener plays both
 * loaders, one after the other, alternating which one goes first each visit.
 */
const IS_INNER_LOAD = window.location.hash.startsWith("#/");

function pickOpenerOrder() {
  try {
    const previousFirst = window.localStorage.getItem(VARIANT_KEY);
    const first = previousFirst === INDEX ? GREETING : INDEX;
    window.localStorage.setItem(VARIANT_KEY, first);
    return [first, first === INDEX ? GREETING : INDEX];
  } catch {
    const first = Math.random() < 0.5 ? INDEX : GREETING;
    return [first, first === INDEX ? GREETING : INDEX];
  }
}

const VISIT_ORDER = IS_INNER_LOAD ? [INDEX] : pickOpenerOrder();

function LoaderPanel({ variant, leaving, announce = false, layer = 1 }) {
  const isIndex = variant === INDEX;
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isIndex) {
      const startedAt = window.performance.now();
      const duration = 1400;
      const interval = window.setInterval(() => {
        const percent = Math.min(
          100,
          Math.round(
            ((window.performance.now() - startedAt) / duration) * 100,
          ),
        );
        setProgress(percent);
        if (percent >= 100) window.clearInterval(interval);
      }, 40);

      return () => window.clearInterval(interval);
    }

    const interval = window.setInterval(() => {
      setGreetingIndex((previous) => (previous + 1) % greetings.length);
    }, 150);

    return () => window.clearInterval(interval);
  }, [isIndex]);

  return (
    <div
      className={`site-loader site-loader--${variant}${leaving ? " is-leaving" : ""}`}
      style={{ zIndex: 30000 + layer }}
    >
      {announce ? (
        <p className="sr-only" role="status">
          Loading portfolio…
        </p>
      ) : null}

      {isIndex ? (
        <>
          <div className="site-loader-index-center" aria-hidden="true">
            <p className="site-loader-index-kicker">Rishabh Bassi / Portfolio</p>
            <p className="site-loader-index-mark">
              RB<span>.</span>
            </p>
            <p className="site-loader-index-note">Index / Selected work</p>
          </div>

          <div className="site-loader-meta" aria-hidden="true">
            <p>Preparing the page</p>
            <p className="site-loader-count">
              {String(progress).padStart(3, "0")}
              <span> / 100</span>
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="site-loader-center" aria-hidden="true">
            <span className="site-loader-dot" />
            <span className="site-loader-greeting">
              {greetings[greetingIndex]}
            </span>
          </div>

          <div className="site-loader-meta" aria-hidden="true">
            <p>Rishabh Bassi / Portfolio</p>
            <p>Loading</p>
          </div>
        </>
      )}

      <div className="site-loader-progress" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}

export default function Loader({ onFinish }) {
  const [stage, setStage] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    if (
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      VISIT_ORDER.length === 1
    ) {
      // One card is enough with reduced motion; otherwise it is a single
      // in-site load, which still gets its hold before sliding away.
      const hold = window.matchMedia?.("(prefers-reduced-motion: reduce)")
        .matches
        ? 300
        : INNER_HOLD;
      const timeout = window.setTimeout(
        VISIT_ORDER.length === 1 ? () => setLeaving(true) : finish,
        hold,
      );
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [finish]);

  useEffect(() => {
    if (VISIT_ORDER.length === 1) return undefined;

    if (leaving) {
      const timeout = window.setTimeout(() => {
        if (stage + 1 < VISIT_ORDER.length) {
          setStage(stage + 1);
          setLeaving(false);
        } else {
          finish();
        }
      }, EXIT_MS + 30);
      return () => window.clearTimeout(timeout);
    }

    const hold = stage === 0 ? OPENER_FIRST_HOLD : OPENER_SECOND_HOLD;
    const timeout = window.setTimeout(() => setLeaving(true), hold);
    return () => window.clearTimeout(timeout);
  }, [finish, leaving, stage]);

  // The single in-site card needs its own exit hand-off.
  useEffect(() => {
    if (VISIT_ORDER.length !== 1 || !leaving) return undefined;
    const timeout = window.setTimeout(finish, EXIT_MS + 30);
    return () => window.clearTimeout(timeout);
  }, [finish, leaving]);

  const reducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const current = VISIT_ORDER[stage];
  const next = leaving ? VISIT_ORDER[stage + 1] : null;

  if (reducedMotion) return null;

  return (
    <>
      {next ? (
        <LoaderPanel key={`loader-${stage + 1}`} variant={next} layer={1} />
      ) : null}
      {current ? (
        <LoaderPanel
          key={`loader-${stage}`}
          variant={current}
          leaving={leaving}
          announce
          layer={next ? 2 : 1}
        />
      ) : null}
    </>
  );
}
