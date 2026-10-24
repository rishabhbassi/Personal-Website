import React, { useId } from "react";
import globeSvg from "../assets/globe 1.svg";
import "./HeroMark.css";

const LATITUDES = [-264, -198, -132, -66, 0, 66, 132, 198, 264];
const LONGITUDES = [44, 88, 132, 176, 220, 264, 308];
const OUTER_PETALS = Array.from({ length: 12 }, (_, index) => index * 30);
const INNER_PETALS = Array.from({ length: 12 }, (_, index) => index * 30 + 15);

export default function MotionMark() {
  const uid = useId().replace(/:/g, "");
  const petalId = `hd-petal-${uid}`;
  const coreId = `hd-core-${uid}`;

  return (
    <div className="hd-mark" aria-hidden="true">
      <svg className="hd-mark-rings" viewBox="0 0 800 800" fill="none">
        <g className="hd-mark-rings-inner">
          <circle
            cx="400"
            cy="400"
            r="330"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.62"
            strokeDasharray="3 9"
          />
          <ellipse
            cx="400"
            cy="400"
            rx="376"
            ry="148"
            stroke="currentColor"
            strokeWidth="1.25"
            opacity="0.42"
            transform="rotate(-18 400 400)"
          />
          <ellipse
            cx="400"
            cy="400"
            rx="352"
            ry="198"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.22"
            transform="rotate(34 400 400)"
          />
          <ellipse
            cx="400"
            cy="400"
            rx="326"
            ry="238"
            stroke="currentColor"
            strokeWidth="0.6"
            opacity="0.13"
            transform="rotate(76 400 400)"
          />
          <circle
            className="hd-mark-ring-orb"
            cx="400"
            cy="202"
            r="2.2"
            fill="currentColor"
            opacity="0.5"
            transform="rotate(34 400 400)"
          />
          <circle
            className="hd-mark-ring-orb"
            cx="726"
            cy="400"
            r="2"
            fill="currentColor"
            opacity="0.4"
            transform="rotate(76 400 400)"
          />
          <circle
            className="hd-mark-ring-orb"
            cx="24"
            cy="400"
            r="3"
            fill="currentColor"
            transform="rotate(-18 400 400)"
          />
          <circle
            className="hd-mark-ring-orb"
            cx="776"
            cy="400"
            r="2"
            fill="currentColor"
            opacity="0.7"
            transform="rotate(-18 400 400)"
          />
        </g>
        <g className="hd-mark-satellite hd-mark-satellite--one">
          <circle cx="400" cy="70" r="5" fill="currentColor" />
        </g>
        <g className="hd-mark-satellite hd-mark-satellite--two">
          <circle cx="730" cy="400" r="3.5" fill="currentColor" />
        </g>
      </svg>

      <svg className="hd-grid" viewBox="0 0 800 800" fill="none">
        <g className="hd-grid-sphere" stroke="currentColor">
          <circle cx="400" cy="400" r="330" strokeWidth="1.3" opacity="0.82" />
          {LATITUDES.map((offset) => (
            <ellipse
              key={offset}
              cx="400"
              cy={400 + offset}
              rx={Math.sqrt(330 ** 2 - offset ** 2)}
              ry={12 + Math.abs(offset) * 0.035}
              strokeWidth="0.9"
              opacity={0.4 - Math.abs(offset) / 2400}
            />
          ))}
          {LONGITUDES.map((rx) => (
            <ellipse
              key={rx}
              cx="400"
              cy="400"
              rx={rx}
              ry="330"
              strokeWidth="0.9"
              opacity={0.3 - rx / 3000}
            />
          ))}
        </g>
      </svg>

      <svg className="hd-bloom" viewBox="0 0 800 800" fill="none">
        <defs>
          <linearGradient
            id={petalId}
            x1="400"
            y1="112"
            x2="400"
            y2="400"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#f6f1ff" stopOpacity="0.95" />
            <stop offset="46%" stopColor="#c9b8ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8b73e8" stopOpacity="0.04" />
          </linearGradient>
          <radialGradient id={coreId} cx="50%" cy="40%" r="64%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="42%" stopColor="#e7ddff" />
            <stop offset="100%" stopColor="#9d86ee" />
          </radialGradient>
        </defs>

        <g className="hd-bloom-outer">
          {OUTER_PETALS.map((angle) => (
            <path
              key={angle}
              d="M400 400 C452 326 452 206 400 132 C348 206 348 326 400 400Z"
              fill={`url(#${petalId})`}
              transform={`rotate(${angle} 400 400)`}
            />
          ))}
        </g>

        <g className="hd-bloom-inner">
          {INNER_PETALS.map((angle) => (
            <path
              key={angle}
              d="M400 400 C431 348 431 274 400 228 C369 274 369 348 400 400Z"
              fill="none"
              stroke={`url(#${petalId})`}
              strokeWidth="1.4"
              transform={`rotate(${angle} 400 400)`}
            />
          ))}
        </g>

        <circle
          className="hd-bloom-halo"
          cx="400"
          cy="400"
          r="58"
          stroke="rgba(243, 241, 234, 0.32)"
          strokeWidth="1"
        />
        <circle
          className="hd-bloom-core"
          cx="400"
          cy="400"
          r="32"
          fill={`url(#${coreId})`}
        />
      </svg>

      <span className="hd-mark-dot hd-mark-dot--a" />
      <span className="hd-mark-dot hd-mark-dot--b" />
      <span className="hd-mark-dot hd-mark-dot--c" />

      <span className="hd-ambient hd-ambient--a" />
      <span className="hd-ambient hd-ambient--b" />
      <span className="hd-ambient hd-ambient--c" />
      <span className="hd-ambient hd-ambient--d" />
      <span className="hd-ambient hd-ambient--e" />
      <span className="hd-ambient hd-ambient--f" />
    </div>
  );
}

export function LocationPill({ tone = "glass" }) {
  return (
    <div className={`hd-location hd-location--${tone}`}>
      <span className="hd-location-globe" aria-hidden="true">
        <img src={globeSvg} alt="" />
      </span>
      <span className="hd-location-copy">
        <span className="hd-location-label">Timezone</span>
        <span className="hd-location-value">IST · GMT+5:30</span>
      </span>
    </div>
  );
}
