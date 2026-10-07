/** A cycle of steps drawn around a circle, with a caption in the middle. */
export function Loop({ steps, center, sub }: { steps: string[]; center: string; sub: string }) {
  const size = 420;
  const c = size / 2;
  const r = 140;
  const at = (i: number) => {
    const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
    return { x: c + r * Math.cos(a), y: c + r * Math.sin(a) };
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="viz-svg viz-loop" role="img" aria-label={`${steps.join(", then ")}, and back to the start`}>
      <defs>
        <marker id="loop-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="var(--viz-muted)" />
        </marker>
      </defs>
      <circle cx={c} cy={c} r={r} fill="none" className="viz-grid" />
      {steps.map((_, i) => {
        const a0 = ((i + 0.22) / steps.length) * Math.PI * 2 - Math.PI / 2;
        const a1 = ((i + 0.78) / steps.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <path key={i} d={`M${c + r * Math.cos(a0)},${c + r * Math.sin(a0)} A${r},${r} 0 0 1 ${c + r * Math.cos(a1)},${c + r * Math.sin(a1)}`}
            fill="none" stroke="var(--viz-muted)" strokeWidth={1.5} markerEnd="url(#loop-arrow)" />
        );
      })}
      {steps.map((step, i) => {
        const p = at(i);
        return (
          <foreignObject key={step} x={p.x - 74} y={p.y - 26} width={148} height={52}>
            <div className="viz-loop-node" tabIndex={0} data-value={`Step ${i + 1}`} data-label={step}>{step}</div>
          </foreignObject>
        );
      })}
      <text x={c} y={c - 6} textAnchor="middle" className="viz-loop-center">{center}</text>
      <text x={c} y={c + 18} textAnchor="middle" className="viz-axis">{sub}</text>
    </svg>
  );
}
