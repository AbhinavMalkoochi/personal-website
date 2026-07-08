import Image from "next/image";
import { Orbit } from "lucide-react";
import { type ProjectMeta } from "@/app/lib/projects";

interface ProjectSectionProps {
  projects: ProjectMeta[];
}

export function ProjectSection({ projects }: ProjectSectionProps) {
  return (
    <section className="blue-section projects-section" aria-labelledby="projects-title">
      <div className="section-inner">
        <div className="section-label-row project-label-row">
          <h2 id="projects-title" className="section-label">Projects</h2>
          <span aria-hidden="true" />
        </div>

        <div className="project-grid">
          {projects.map((project, index) => {
            return (
              <article key={project.slug} className="project-card">
                <div className="project-card-copy">
                  <div className="card-index">{String(index + 1).padStart(2, "0")}</div>
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                  <div className="project-tags" aria-label={`${project.name} technology`}>
                    {project.tech.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
                {index % 2 === 0 ? (
                  <Orbit className="project-symbol project-symbol-orbit" size={92} strokeWidth={1} aria-hidden="true" />
                ) : (
                  <Image
                    src="/assets/portfolio/lightning-sticker-orange.png"
                    alt=""
                    width={300}
                    height={363}
                    className="project-sticker project-sticker-lightning"
                    sizes="130px"
                  />
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
