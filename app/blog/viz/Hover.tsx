"use client";

import { useState, type ReactNode } from "react";

interface Tip { x: number; y: number; value: string; label: string }

/** Shows a tooltip for any descendant carrying data-value / data-label, on hover and on keyboard focus. */
export function Hover({ children }: { children: ReactNode }) {
  const [tip, setTip] = useState<Tip | null>(null);

  function show(target: EventTarget | null, frame: HTMLElement) {
    const mark = target instanceof Element ? target.closest<HTMLElement | SVGElement>("[data-value]") : null;
    if (!mark) return setTip(null);
    const box = mark.getBoundingClientRect();
    const origin = frame.getBoundingClientRect();
    setTip({
      x: box.left + box.width / 2 - origin.left,
      y: box.top - origin.top,
      value: mark.dataset.value ?? "",
      label: mark.dataset.label ?? "",
    });
  }

  return (
    <div
      className="viz-hover"
      onPointerOver={(event) => show(event.target, event.currentTarget)}
      onPointerLeave={() => setTip(null)}
      onFocus={(event) => show(event.target, event.currentTarget)}
      onBlur={() => setTip(null)}
    >
      {children}
      {tip && (
        <div className="viz-tip" role="status" style={{ left: tip.x, top: tip.y }}>
          <strong>{tip.value}</strong>
          {tip.label && <span>{tip.label}</span>}
        </div>
      )}
    </div>
  );
}
