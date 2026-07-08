interface GraphicMotifsProps {
  tone?: "sky" | "paper" | "blue";
}

export function GraphicMotifs({ tone = "paper" }: GraphicMotifsProps) {
  return (
    <div className={`graphic-motifs graphic-motifs-${tone}`} aria-hidden="true">
      <span className="motif-corner motif-corner-top" />
      <span className="motif-corner motif-corner-bottom" />
      <span className="motif-tape motif-tape-coral" />
      <span className="motif-tape motif-tape-yellow" />
      <span className="motif-sticker">Keep building</span>
      <span className="motif-barcode" />
    </div>
  );
}
