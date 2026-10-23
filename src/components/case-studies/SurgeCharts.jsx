import { useEffect, useId, useMemo, useRef, useState } from "react";
import { POLICIES } from "../../simulation/surgePricing";
import { CHART_COLORS, formatInteger, formatMultiplier } from "./chartUtils";
import "./SurgeCharts.css";

const POLICY_COLORS = {
  baseline: CHART_COLORS.baseline,
  freeze: CHART_COLORS.freeze,
  smoothed: CHART_COLORS.smoothed,
};

const INK = {
  primary: "#0b0b0b",
  secondary: "#52514e",
  muted: "#898781",
  grid: "#e6e4dc",
  axis: "#c3c2b7",
};

function useElementWidth(initialWidth = 640) {
  const ref = useRef(null);
  const [width, setWidth] = useState(initialWidth);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const measure = () => {
      const next = Math.round(element.getBoundingClientRect().width);
      if (next > 0) setWidth(next);
    };
    measure();

    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, Math.max(220, width)];
}

function buildTicks(min, max, count = 4) {
  return Array.from({ length: count + 1 }, (_, index) => min + ((max - min) * index) / count);
}

/**
 * A responsive line chart with a crosshair tooltip, keyboard inspection and a
 * table-view twin. Values are drawn from the simulation only; nothing is
 * smoothed for presentation.
 */
export function TimeSeriesChart({
  title,
  subtitle,
  data = [],
  series,
  yMin = 0,
  yMax,
  yTickCount = 4,
  height = 236,
  yFormat = formatInteger,
  xLabel = "Simulated step",
  ariaLabel,
  tableColumns,
  peakSeriesKey,
  footnote,
}) {
  const [plotRef, width] = useElementWidth();
  const svgRef = useRef(null);
  const titleId = useId();
  const [hoverIndex, setHoverIndex] = useState(null);

  const margin = { top: 18, right: 18, bottom: 30, left: 44 };
  const innerWidth = Math.max(1, width - margin.left - margin.right);
  const innerHeight = Math.max(1, height - margin.top - margin.bottom);
  const count = data?.length ?? 0;

  const computedMax = useMemo(() => {
    const values = (data ?? []).flatMap((row) => series.map((item) => row[item.key] ?? 0));
    return Math.max(yMin + 0.5, ...values);
  }, [data, series, yMin]);

  const top = yMax ?? Math.max(yMin + 0.5, Math.ceil(computedMax * 1.08 * 10) / 10);
  const ticks = buildTicks(yMin, top, yTickCount);

  const xAt = (index) =>
    margin.left + (count <= 1 ? innerWidth / 2 : (index / (count - 1)) * innerWidth);
  const yAt = (value) =>
    margin.top + innerHeight - ((Math.max(yMin, Math.min(top, value)) - yMin) / (top - yMin)) * innerHeight;

  const peakIndex = useMemo(() => {
    if (!peakSeriesKey || data.length === 0) return null;
    let best = 0;
    data.forEach((row, index) => {
      if ((row[peakSeriesKey] ?? 0) > (data[best][peakSeriesKey] ?? 0)) best = index;
    });
    return best;
  }, [data, peakSeriesKey]);

  const xTickIndexes = useMemo(() => {
    if (count === 0) return [];
    const desired = width < 420 ? 3 : 5;
    const indexes = new Set();
    for (let i = 0; i < desired; i += 1) {
      indexes.add(Math.round((i / (desired - 1)) * (count - 1)));
    }
    return [...indexes];
  }, [count, width]);

  if (!data || data.length === 0) {
    return (
      <figure className="chart-card">
        <figcaption className="chart-head">
          <h3 className="chart-title">{title}</h3>
          {subtitle ? <p className="chart-subtitle">{subtitle}</p> : null}
        </figcaption>
        <p className="chart-empty">No simulation data for these settings.</p>
      </figure>
    );
  }

  const hovered = hoverIndex == null ? null : data[Math.min(hoverIndex, count - 1)];
  const hoverX = hoverIndex == null ? null : xAt(Math.min(hoverIndex, count - 1));
  const tooltipWidth = 176;
  const tooltipLeft =
    hoverX == null ? 0 : Math.min(Math.max(hoverX + 12, 8), Math.max(8, width - tooltipWidth - 8));

  const handlePointer = (event) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const localX = ((event.clientX - rect.left) / rect.width) * width;
    const ratio = Math.max(0, Math.min(1, (localX - margin.left) / innerWidth));
    setHoverIndex(Math.round(ratio * (count - 1)));
  };

  const handleKeyDown = (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    setHoverIndex((current) => {
      const start = current == null ? count - 1 : current;
      if (event.key === "Home") return 0;
      if (event.key === "End") return count - 1;
      if (event.key === "ArrowLeft") return Math.max(0, start - 1);
      return Math.min(count - 1, start + 1);
    });
  };

  const peakRow = peakIndex == null ? null : data[peakIndex];
  const peakX = peakIndex == null ? 0 : xAt(peakIndex);
  const peakY = peakRow ? yAt(peakRow[peakSeriesKey]) : 0;
  const peakAnchor = peakX > width - 90 ? "end" : "start";

  return (
    <figure className="chart-card">
      <figcaption className="chart-head">
        <div>
          <h3 className="chart-title" id={titleId}>
            {title}
          </h3>
          {subtitle ? <p className="chart-subtitle">{subtitle}</p> : null}
        </div>
        <ul className="chart-legend" aria-label="Chart series">
          {series.map((item) => (
            <li key={item.key}>
              <span className="chart-swatch" style={{ background: item.color }} aria-hidden="true" />
              {item.label}
            </li>
          ))}
        </ul>
      </figcaption>

      <div
        ref={plotRef}
        className="chart-plot"
        style={{ height }}
        tabIndex={0}
        role="group"
        aria-label={`${ariaLabel ?? title}. Use left and right arrow keys to inspect values. A table view is available below.`}
        onKeyDown={handleKeyDown}
        onFocus={() => setHoverIndex((current) => current ?? count - 1)}
        onBlur={() => setHoverIndex(null)}
      >
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="chart-svg"
          aria-hidden="true"
          onPointerMove={handlePointer}
          onPointerLeave={() => setHoverIndex(null)}
        >
          {ticks.map((tick) => {
            const y = yAt(tick);
            return (
              <g key={`y-${tick}`}>
                <line
                  x1={margin.left}
                  x2={width - margin.right}
                  y1={y}
                  y2={y}
                  stroke={INK.grid}
                  strokeWidth="1"
                />
                <text
                  x={margin.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill={INK.muted}
                  fontSize="10.5"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {yFormat(tick)}
                </text>
              </g>
            );
          })}

          <line
            x1={margin.left}
            x2={width - margin.right}
            y1={margin.top + innerHeight}
            y2={margin.top + innerHeight}
            stroke={INK.axis}
            strokeWidth="1"
          />

          {xTickIndexes.map((index) => (
            <text
              key={`x-${index}`}
              x={xAt(index)}
              y={height - 10}
              textAnchor={index === 0 ? "start" : index === count - 1 ? "end" : "middle"}
              fill={INK.muted}
              fontSize="10.5"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {data[index]?.t ?? index}
            </text>
          ))}

          {series.map((item) => {
            const points = data
              .map((row, index) => `${xAt(index)},${yAt(row[item.key] ?? 0)}`)
              .join(" ");
            return (
              <polyline
                key={item.key}
                points={points}
                fill="none"
                stroke={item.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {peakRow && peakSeriesKey ? (
            <g>
              <circle cx={peakX} cy={peakY} r="4.5" fill={CHART_COLORS[peakSeriesKey] ?? INK.primary} stroke="#ffffff" strokeWidth="2" />
              <text
                x={peakAnchor === "end" ? peakX - 8 : peakX + 8}
                y={Math.max(12, peakY - 10)}
                textAnchor={peakAnchor}
                fill={INK.secondary}
                fontSize="11"
                fontWeight="600"
              >
                peak {yFormat(peakRow[peakSeriesKey])}
              </text>
            </g>
          ) : null}

          {hoverIndex != null ? (
            <g pointerEvents="none">
              <line
                x1={hoverX}
                x2={hoverX}
                y1={margin.top}
                y2={margin.top + innerHeight}
                stroke={INK.axis}
                strokeWidth="1"
              />
              {series.map((item) => (
                <circle
                  key={`dot-${item.key}`}
                  cx={hoverX}
                  cy={yAt(data[Math.min(hoverIndex, count - 1)][item.key] ?? 0)}
                  r="4"
                  fill={item.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              ))}
            </g>
          ) : null}
        </svg>

        {hovered ? (
          <div
            className="chart-tooltip"
            style={{ left: tooltipLeft, top: 8, width: tooltipWidth }}
            role="status"
          >
            <p className="chart-tooltip-step">Step {hovered.t}</p>
            <dl>
              {series.map((item) => (
                <div key={item.key} className="chart-tooltip-row">
                  <dt>
                    <span className="chart-swatch" style={{ background: item.color }} aria-hidden="true" />
                    {item.label}
                  </dt>
                  <dd>{(item.format ?? yFormat)(hovered[item.key] ?? 0)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>

      <p className="chart-axis-caption">
        {xLabel}
        {footnote ? ` · ${footnote}` : ""}
      </p>

      {tableColumns?.length ? (
        <details className="chart-table">
          <summary>View data table</summary>
          <div className="chart-table-scroll">
            <table>
              <caption className="sr-only">
                {title}. Simulated values for every step in the current run.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Step</th>
                  {tableColumns.map((column) => (
                    <th key={column.key} scope="col">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.t}>
                    <th scope="row">{row.t}</th>
                    {tableColumns.map((column) => (
                      <td key={column.key}>
                        {(column.format ?? formatInteger)(row[column.key] ?? 0)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ) : null}
    </figure>
  );
}

/** Small-multiple bars: one measure per panel, three policies in each. */
export function PolicyComparisonBars({ runs }) {
  const panels = [
    {
      key: "peakSurge",
      label: "Peak multiplier",
      format: formatMultiplier,
      max: 3,
      note: "Highest illustrative surge reached.",
    },
    {
      key: "avgSurge",
      label: "Average multiplier",
      format: formatMultiplier,
      max: 3,
      note: "Mean across all simulated steps.",
    },
    {
      key: "unmetTotal",
      label: "Unmet requests",
      format: formatInteger,
      max: null,
      note: "Total demand left unserved (proxy).",
    },
    {
      key: "legitFriction",
      label: "Legit-driver friction",
      format: formatInteger,
      max: null,
      note: "Extra restriction on legitimate breaks (driver-steps).",
    },
  ];

  return (
    <div className="policy-bars">
      <ul className="policy-bars-legend" aria-label="Policy colours">
        {POLICIES.map((policy) => (
          <li key={policy.key}>
            <span
              className="chart-swatch"
              style={{ background: POLICY_COLORS[policy.key] }}
              aria-hidden="true"
            />
            {policy.label}
          </li>
        ))}
      </ul>

      <div className="policy-bars-grid">
        {panels.map((panel) => {
          const maxValue =
            panel.max ??
            Math.max(1, ...POLICIES.map((policy) => runs[policy.key].metrics[panel.key] ?? 0));
          return (
            <figure className="policy-bars-panel" key={panel.key}>
              <figcaption>
                <h4>{panel.label}</h4>
                <p>{panel.note}</p>
              </figcaption>
              <ul>
                {POLICIES.map((policy) => {
                  const value = runs[policy.key].metrics[panel.key] ?? 0;
                  const widthPercent = Math.max(0, Math.min(100, (value / maxValue) * 100));
                  return (
                    <li key={policy.key}>
                      <span className="pcb-label">{policy.shortLabel}</span>
                      <span className="pcb-track" aria-hidden="true">
                        <span
                          className="pcb-fill"
                          style={{
                            width: `${widthPercent}%`,
                            background: POLICY_COLORS[policy.key],
                          }}
                        />
                      </span>
                      <span className="pcb-value">{panel.format(value)}</span>
                    </li>
                  );
                })}
              </ul>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
