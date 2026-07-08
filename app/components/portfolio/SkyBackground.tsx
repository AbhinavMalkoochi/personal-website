import Image from "next/image";
import { FloatingGeometry } from "./FloatingGeometry";

export function SkyBackground() {
  return (
    <div className="sky-background" aria-hidden="true">
      <Image
        src="/assets/portfolio/sky-background.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="sky-image"
      />
      <div className="sky-grain" />
      <div className="contrail contrail-one" />
      <div className="contrail contrail-two" />
      <div className="cloud cloud-left" />
      <div className="cloud cloud-right" />
      <div className="cloud cloud-horizon" />
      <div className="halftone sky-halftone" />
      <FloatingGeometry />
      <div className="orbit-doodle orbit-one" />
      <div className="tiny-symbol tiny-symbol-one">+</div>
      <div className="tiny-symbol tiny-symbol-two">.</div>
      <div className="tiny-symbol tiny-symbol-three">▾</div>
      <Image
        src="/assets/portfolio/road-sign-blue.png"
        alt=""
        width={360}
        height={891}
        className="road-sign-asset"
        sizes="(max-width: 720px) 76px, 128px"
      />
      <Image
        src="/assets/portfolio/railing-keep-going.png"
        alt=""
        width={900}
        height={588}
        className="railing-asset"
        sizes="(max-width: 720px) 330px, 620px"
      />
    </div>
  );
}
