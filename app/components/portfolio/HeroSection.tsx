import { ArrowDownRight, FileText, Github, Mail } from "lucide-react";
import Link from "next/link";
import { GraphicMotifs } from "./GraphicMotifs";
import { SkyBackground } from "./SkyBackground";

const links = [
  {
    label: "GitHub",
    href: "https://github.com/AbhinavMalkoochi",
    icon: Github,
    external: true,
  },
  {
    label: "Email",
    href: "mailto:abhinav.malkoochi@gmail.com",
    icon: Mail,
  },
  {
    label: "Resume",
    href: "/resume.pdf",
    icon: FileText,
    external: true,
  },
];

export function HeroSection() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="browser-strip" aria-hidden="true">
        <span />
        <span />
        <span />
        <i />
      </div>
      <SkyBackground />
      <GraphicMotifs tone="sky" />

      <header className="site-nav" aria-label="Primary navigation">
        <Link href="/" className="brand-mark" aria-label="Abhinav Malkoochi home">
          <span className="brand-arrow" aria-hidden="true" />
          <span>AM</span>
        </Link>
        <span className="nav-rule" aria-hidden="true" />
        <nav className="nav-links">
          {links.map(({ label, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="nav-link"
            >
              <Icon size={15} strokeWidth={1.7} aria-hidden="true" />
              {label}
            </a>
          ))}
        </nav>
      </header>

      <div className="hero-content">
        <p className="hero-kicker">
          Software engineer
          <span aria-hidden="true" />
        </p>
        <h1 id="hero-title" className="hero-title">
          Abhinav
          <br />
          Malkoochi
        </h1>
        <p className="hero-tag">CS Graduate from UT Dallas</p>
        <p className="hero-copy">
          I build software, AI tools, and thoughtful digital experiences that are
          simple, useful, and a little bit unexpected.
        </p>
        <a href="#experience" className="hero-cta">
          Learn more
          <ArrowDownRight size={17} strokeWidth={1.7} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
