import Image from "next/image";

export function HeroDecor() {
  return (
    <div className="hero-decor" aria-hidden="true">
      <Image
        src="/assets/portfolio/summer/hero-beach-monolith.webp"
        alt=""
        fill
        priority
        aria-hidden="true"
        sizes="100vw"
        className="hero-scene-image"
      />
      <div className="hero-contrast" />
      <span className="hero-arc hero-arc-one" />
      <span className="bird bird-one" />
      <span className="bird bird-two" />
      <span className="bird bird-three" />
      <Image
        src="/assets/portfolio/summer/foliage-cutout.png"
        alt=""
        width={900}
        height={1125}
        aria-hidden="true"
        className="hero-foliage"
        sizes="(max-width: 720px) 300px, 560px"
      />
      <Image
        src="/assets/portfolio/summer/stairs-cutout.png"
        alt=""
        width={900}
        height={1125}
        aria-hidden="true"
        className="hero-stairs"
        sizes="(max-width: 720px) 260px, 520px"
      />
    </div>
  );
}
