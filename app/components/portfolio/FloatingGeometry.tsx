import Image from "next/image";

export function FloatingGeometry() {
  return (
    <div className="floating-geometry" aria-hidden="true">
      <Image
        src="/assets/portfolio/floating-monolith-clean.png"
        alt=""
        width={468}
        height={1009}
        priority
        className="monolith-asset"
        sizes="(max-width: 720px) 170px, 310px"
      />
      <div className="geometry-small" />
      <div className="geometry-line" />
      <div className="geometry-dot" />
      <div className="geometry-pin" />
    </div>
  );
}
