/**
 * Shared chart tokens and formatters. Kept out of the component file so the
 * component module only exports components (React Fast Refresh).
 *
 * Palette validated with the dataviz validator against a white surface:
 * blue #2a78d6, orange #eb6834, violet #5d0dff. Aqua #1baf7a is used for a
 * single supporting series. Text always uses ink tokens, never a series colour.
 */
export const CHART_COLORS = Object.freeze({
  surge: "#5d0dff",
  demand: "#eb6834",
  supply: "#2a78d6",
  strategic: "#1baf7a",
  baseline: "#2a78d6",
  freeze: "#eb6834",
  smoothed: "#5d0dff",
});

export function formatMultiplier(value) {
  return `${value.toFixed(2)}×`;
}

export function formatInteger(value) {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

export function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}
