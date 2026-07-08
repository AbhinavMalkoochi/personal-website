import { Github, Mail, MapPin } from "lucide-react";
import Image from "next/image";

const email = "abhinav.malkoochi@gmail.com";

export function ContactSection() {
  return (
    <footer id="contact" className="section-shell contact-section" aria-labelledby="contact-title">
      <div className="section-index" aria-hidden="true">
        04
      </div>
      <div className="section-inner contact-inner">
        <div className="contact-copy">
          <h2 id="contact-title">Let&apos;s connect.</h2>
          <p>
            I&apos;m always open to talking about new ideas, interesting
            problems, or potential collaborations.
          </p>
          <a className="contact-primary" href={`mailto:${email}`}>
            {email}
          </a>
        </div>
        <address className="contact-links">
          <a href={`mailto:${email}`}>
            <Mail size={18} strokeWidth={1.6} aria-hidden="true" />
            <span>Email</span>
            {email}
          </a>
          <a href="https://github.com/AbhinavMalkoochi" target="_blank" rel="noopener noreferrer">
            <Github size={18} strokeWidth={1.6} aria-hidden="true" />
            <span>GitHub</span>
            github.com/abhinavmalkoochi
          </a>
          <span>
            <MapPin size={18} strokeWidth={1.6} aria-hidden="true" />
            <span>Location</span>
            Dallas, Texas
          </span>
        </address>
        <div className="contact-art" aria-hidden="true">
          <Image
            src="/assets/portfolio/summer/contact-doorway.webp"
            alt=""
            fill
            aria-hidden="true"
            sizes="(max-width: 720px) 70vw, 430px"
          />
        </div>
      </div>
      <div className="footer-baseline">
        <span>© 2026 Abhinav Malkoochi</span>
        <span aria-hidden="true" />
      </div>
    </footer>
  );
}
