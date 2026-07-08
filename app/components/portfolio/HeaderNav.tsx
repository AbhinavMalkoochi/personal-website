import { FileText, Github, Mail } from "lucide-react";
import Link from "next/link";

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

export function HeaderNav() {
  return (
    <header className="site-header" aria-label="Site header">
      <Link href="/" className="brand-mark" aria-label="Abhinav Malkoochi home">
        <span className="brand-arrow" aria-hidden="true" />
        <span>A.M.</span>
      </Link>
      <span className="nav-rule" aria-hidden="true" />
      <nav className="nav-links" aria-label="Primary navigation">
        {links.map(({ label, href, icon: Icon, external }) => (
          <a
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="nav-link"
            aria-label={external ? `${label} (opens in a new tab)` : label}
          >
            <Icon size={15} strokeWidth={1.7} aria-hidden="true" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
