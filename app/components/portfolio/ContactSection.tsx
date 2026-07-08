import { Github, Mail, MapPin } from "lucide-react";
import { GraphicMotifs } from "./GraphicMotifs";

export function ContactSection() {
  return (
    <footer className="contact-section" aria-labelledby="contact-title">
      <GraphicMotifs tone="paper" />
      <div className="section-inner contact-inner">
        <h2 id="contact-title">Let&apos;s connect.</h2>
        <p>
          I&apos;m always open to talking about new ideas, interesting problems,
          or potential collaborations.
        </p>
        <address className="contact-links">
          <a href="mailto:abhinav.malkoochi@gmail.com">
            <Mail size={18} strokeWidth={1.8} aria-hidden="true" />
            hello@abhinavmalkoochi.dev
          </a>
          <a href="https://github.com/AbhinavMalkoochi" target="_blank" rel="noopener noreferrer">
            <Github size={18} strokeWidth={1.8} aria-hidden="true" />
            github.com/abhinavmalkoochi
          </a>
          <span>
            <MapPin size={18} strokeWidth={1.8} aria-hidden="true" />
            Dallas, Texas
          </span>
        </address>
      </div>
      <div className="footer-baseline">
        <span>© 2024 Abhinav Malkoochi</span>
        <span aria-hidden="true" />
      </div>
    </footer>
  );
}
