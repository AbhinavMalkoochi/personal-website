import type { ReactNode } from "react";
import { Hover } from "./Hover";

const fmt = new Intl.NumberFormat("en");

/** A figure: title, optional note, the chart, and an always-available table view. */
export function Figure({ title, note, table, children }: { title: string; note?: string; table?: ReactNode; children: ReactNode }) {
  return (
    <figure className="viz">
      <figcaption>
        <strong>{title}</strong>
        {note && <span>{note}</span>}
      </figcaption>
      <Hover>{children}</Hover>
      {table && (
        <details className="viz-table">
          <summary>Table</summary>
          {table}
        </details>
      )}
    </figure>
  );
}

export interface Series { name: string; color: string; values: number[] }

/** Lines over real dates (x spacing follows the calendar), one shared y-axis, hover per date. */
export function LineChart({ dates, series, marks = [], unit, height = 240 }: {
  dates: string[];
  series: Series[];
  marks?: { date: string; label: string }[];
  unit: string;
  height?: number;
}) {
  const width = 640;
  const pad = { top: 26, right: 118, bottom: 28, left: 52 };
  const day = (mmdd: string) => Date.UTC(2026, Number(mmdd.slice(0, 2)) - 1, Number(mmdd.slice(3)));
  const t0 = day(dates[0]);
  const t1 = day(dates[dates.length - 1]);
  const x = (mmdd: string) => pad.left + ((day(mmdd) - t0) / (t1 - t0)) * (width - pad.left - pad.right);
  const max = niceMax(Math.max(...series.flatMap((s) => s.values)));
  const y = (v: number) => pad.top + (1 - v / max) * (height - pad.top - pad.bottom);
  const ticks = [0, max / 2, max];
  const label = (mmdd: string) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(day(mmdd)));

  return (
    <>
    <svg viewBox={`0 0 ${width} ${height}`} className="viz-svg" role="img" aria-label={series.map((s) => s.name).join(" and ")}>
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)} className="viz-grid" />
          <text x={pad.left - 8} y={y(tick)} className="viz-axis" textAnchor="end" dominantBaseline="middle">{compact(tick)}</text>
        </g>
      ))}
      {[dates[0], dates[Math.floor(dates.length / 2)], dates[dates.length - 1]].map((d) => (
        <text key={d} x={x(d)} y={height - 8} className="viz-axis" textAnchor="middle">{label(d)}</text>
      ))}
      {marks.map((m, i) => (
        <g key={m.date}>
          <line x1={x(m.date)} x2={x(m.date)} y1={pad.top} y2={height - pad.bottom} className="viz-mark-line" />
          <text x={x(m.date)} y={pad.top - 8} className="viz-mark-num" textAnchor="middle">{i + 1}</text>
        </g>
      ))}
      {series.map((s) => (
        <g key={s.name}>
          <polyline fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" points={s.values.map((v, i) => `${x(dates[i])},${y(v)}`).join(" ")} />
          <circle cx={x(dates[dates.length - 1])} cy={y(s.values[s.values.length - 1])} r={4} fill={s.color} stroke="var(--viz-surface)" strokeWidth={2} />
          <text x={x(dates[dates.length - 1]) + 10} y={y(s.values[s.values.length - 1])} className="viz-end" dominantBaseline="middle">
            {s.name} {compact(s.values[s.values.length - 1])}
          </text>
        </g>
      ))}
      {dates.map((d, i) => {
        const left = i === 0 ? pad.left : (x(dates[i - 1]) + x(d)) / 2;
        const right = i === dates.length - 1 ? width - pad.right : (x(d) + x(dates[i + 1])) / 2;
        const note = marks.find((m) => m.date === d)?.label;
        return (
          <rect key={d} x={left} y={pad.top} width={right - left} height={height - pad.top - pad.bottom} className="viz-hit" tabIndex={0}
            data-value={series.map((s) => `${s.name} ${fmt.format(s.values[i])}`).join(" · ")}
            data-label={`${label(d)}${note ? ` — ${note}` : ""} (${unit})`} />
        );
      })}
    </svg>
    {marks.length > 0 && (
      <ol className="viz-marks">
        {marks.map((m) => <li key={m.date}><time>{label(m.date)}</time> {m.label}</li>)}
      </ol>
    )}
    </>
  );
}

/** Horizontal bars with the value at the tip; optional per-bar color and hover detail. */
export function Bars({ rows, max, unit = "", color = "var(--viz-ink)" }: {
  rows: { label: string; value: number; color?: string; detail?: string; display?: string }[];
  max?: number;
  unit?: string;
  color?: string;
}) {
  const top = max ?? niceMax(Math.max(...rows.map((r) => r.value)));
  return (
    <div className="viz-bars">
      {rows.map((r) => (
        <div className="viz-bar-row" key={r.label} tabIndex={0} data-value={`${r.display ?? fmt.format(r.value)}${unit}`} data-label={r.detail ?? r.label}>
          <span className="viz-bar-label">{r.label}</span>
          <span className="viz-bar-track">
            <span className="viz-bar" style={{ width: `${(r.value / top) * 100}%`, background: r.color ?? color }} />
            <span className="viz-bar-value" style={{ left: `calc((100% - var(--viz-value-room)) * ${r.value / top} + 8px)` }}>{r.display ?? fmt.format(r.value)}{unit}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/** A row of headline numbers. */
export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="viz-stats">
      {items.map((s) => (
        <div key={s.label}>
          <dt>{s.label}</dt>
          <dd>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A vertical timeline of phases. */
export function Timeline({ steps }: { steps: { when: string; title: string; body: string; tone?: "bad" | "good" }[] }) {
  return (
    <ol className="viz-timeline">
      {steps.map((s) => (
        <li key={s.title} data-tone={s.tone}>
          <time>{s.when}</time>
          <strong>{s.title}</strong>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** A short quote with where it came from. */
export function Quote({ who, children }: { who: string; children: ReactNode }) {
  return (
    <blockquote className="viz-quote">
      <p>{children}</p>
      <cite>{who}</cite>
    </blockquote>
  );
}

function niceMax(v: number) {
  const step = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / step) * step;
}

function compact(v: number) {
  return v >= 1000 ? `${fmt.format(Math.round(v / 100) / 10)}k` : fmt.format(v);
}
