import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Bot,
  Boxes,
  BriefcaseBusiness,
  FileText,
  Github,
  GraduationCap,
  Mail,
  Sparkles,
} from "lucide-react";
import { getAllBlogs } from "./lib/blogs";
import { getAllProjects, type ProjectMeta } from "./lib/projects";

const experiences = [
  { company: "’Sup", role: "Full Stack Intern", icon: BriefcaseBusiness },
  { company: "UT Dallas", role: "LLM Research", icon: GraduationCap },
  { company: "XNode.AI", role: "AI Intern", icon: Sparkles },
];

const projectIcons: Record<string, typeof Bot> = {
  "Browser Agent": Bot,
  "MCP Code": Boxes,
};

function Project({ project }: { project: ProjectMeta }) {
  const Icon = projectIcons[project.name] ?? Boxes;

  return (
    <Link href={`/projects/${project.slug}`} className="item-card">
      <span className="item-icon" aria-hidden="true">
        <Icon size={21} strokeWidth={1.7} />
      </span>
      <span className="item-copy">
        <strong>{project.name}</strong>
        <small>{project.summary}</small>
      </span>
      <ArrowUpRight className="item-arrow" size={18} aria-hidden="true" />
    </Link>
  );
}

export default async function Home() {
  const [projects, blogs] = await Promise.all([getAllProjects(), getAllBlogs()]);

  return (
    <div className="site-shell">
      <header className="topbar">
        <Link href="/" className="monogram" aria-label="Abhinav Malkoochi home">
          AM
        </Link>
        <nav className="icon-nav" aria-label="Links">
          <a href="https://github.com/AbhinavMalkoochi" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">
            <Github size={18} />
          </a>
          <a href="mailto:abhinav.malkoochi@gmail.com" aria-label="Email" title="Email">
            <Mail size={18} />
          </a>
          <a href="/resume.pdf" target="_blank" aria-label="Resume" title="Resume">
            <FileText size={18} />
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <p><span className="status-dot" aria-hidden="true" />Software · AI</p>
          <h1 id="hero-title">Abhinav<br />Malkoochi</h1>
        </section>

        <section className="content-section" id="projects" aria-labelledby="projects-title">
          <div className="section-heading">
            <span className="section-icon"><Boxes size={17} aria-hidden="true" /></span>
            <h2 id="projects-title">Projects</h2>
          </div>
          <div className="card-grid">
            {projects.map((project) => <Project key={project.slug} project={project} />)}
          </div>
        </section>

        <section className="content-section" id="experience" aria-labelledby="experience-title">
          <div className="section-heading">
            <span className="section-icon"><BriefcaseBusiness size={17} aria-hidden="true" /></span>
            <h2 id="experience-title">Experience</h2>
          </div>
          <div className="experience-list">
            {experiences.map(({ company, role, icon: Icon }) => (
              <article className="experience-row" key={company}>
                <span className="item-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.7} /></span>
                <strong>{company}</strong>
                <span>{role}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section" id="blog" aria-labelledby="blog-title">
          <div className="section-heading">
            <span className="section-icon"><BookOpen size={17} aria-hidden="true" /></span>
            <h2 id="blog-title">Blog</h2>
          </div>
          <div className="blog-list">
            {blogs.map((post) => (
              <Link href={`/blog/${post.slug}`} className="blog-row" key={post.slug}>
                <time dateTime={post.date}>{post.dateLabel}</time>
                <span>
                  <strong>{post.title}</strong>
                  <small>{post.summary}</small>
                </span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026</span>
        <div>
          <a href="https://github.com/AbhinavMalkoochi" target="_blank" rel="noreferrer">GitHub</a>
          <a href="mailto:abhinav.malkoochi@gmail.com">Email</a>
          <a href="/resume.pdf" target="_blank">Résumé</a>
        </div>
      </footer>
    </div>
  );
}
