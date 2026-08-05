import Link from "next/link";
import { getAllBlogs } from "./lib/blogs";
import { getAllProjects } from "./lib/projects";

const experiences = [
  { company: "’Sup", role: "Full Stack Intern" },
  { company: "UT Dallas", role: "LLM Research" },
  { company: "XNode.AI", role: "AI Intern" },
];

export default async function Home() {
  const [projects, blogs] = await Promise.all([getAllProjects(), getAllBlogs()]);

  return (
    <main className="home">
      <header className="home-header">
        <h1>Abhinav Malkoochi</h1>
        <nav aria-label="Links">
          <a href="https://github.com/AbhinavMalkoochi" target="_blank" rel="noreferrer">GitHub</a>
          <a href="mailto:abhinav.malkoochi@gmail.com">Email</a>
          <a href="/resume.pdf" target="_blank">Résumé</a>
        </nav>
      </header>

      <div className="home-sections">
        <section aria-labelledby="projects-title">
          <h2 id="projects-title">Projects</h2>
          <div className="entries">
            {projects.map((project) => (
              <Link className="entry" href={`/projects/${project.slug}`} key={project.slug}>
                <strong>{project.name}</strong>
                <p>{project.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="experience-title">
          <h2 id="experience-title">Experience</h2>
          <div className="entries">
            {experiences.map(({ company, role }) => (
              <article className="experience" key={company}>
                <strong>{company}</strong>
                <p>{role}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="writing-title">
          <h2 id="writing-title">Writing</h2>
          <div className="entries">
            {blogs.map((post) => (
              <Link className="entry" href={`/blog/${post.slug}`} key={post.slug}>
                <strong>{post.title}</strong>
                <p>{post.dateLabel}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <footer>© 2026</footer>
    </main>
  );
}
