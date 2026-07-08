import { ArrowDownRight } from "lucide-react";
import { HeaderNav } from "./HeaderNav";
import { HeroDecor } from "./HeroDecor";

export function HeroSection() {
  return (
    <section className="section-shell hero-section" aria-labelledby="hero-title">
      <HeaderNav />
      <div className="hero-content">
        <p className="hero-kicker">
          CS Graduate from UT Dallas
          <span aria-hidden="true" />
        </p>
        <h1 id="hero-title" className="hero-title">
          Abhinav
          <br />
          Malkoochi
        </h1>
        <p className="hero-copy">
          I build software, AI tools, and thoughtful digital experiences that are
          simple, useful, and a little bit unexpected.
        </p>
        <a href="#experience" className="hero-cta">
          Learn more
          <ArrowDownRight size={17} strokeWidth={1.7} aria-hidden="true" />
        </a>
      </div>
      <HeroDecor />
    </section>
  );
}
