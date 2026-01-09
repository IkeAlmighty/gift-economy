import React from "react";

/**
 * A reusable toggle button group for switching between two modes.
 * @param {string} value - The current selected value ("left" or "right").
 * @param {function} onChange - Callback when a button is clicked.
 * @param {string} leftLabel - Label for the left button.
 * @param {string} rightLabel - Label for the right button.
 * @param {string} [className] - Optional extra class names for the wrapper.
 */
export default function ToggleButtonGroup({
  value,
  onChange,
  leftLabel = "Left",
  rightLabel = "Right",
  className = "",
}) {
  return (
    <div className={`inline-flex items-center rounded overflow-hidden border ${className}`}>
      <button
        className={`px-3 py-1 ${value === "left" ? "bg-cyan-800 text-white" : "bg-white"}`}
        onClick={() => onChange("left")}
        type="button"
      >
        {leftLabel}
      </button>
      <button
        className={`px-3 py-1 ${value === "right" ? "bg-cyan-800 text-white" : "bg-white"}`}
        onClick={() => onChange("right")}
        type="button"
      >
        {rightLabel}
      </button>
    </div>
  );
}
