import { type ProjectMeta } from "@/app/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { SectionShell } from "./SectionShell";

interface ProjectSectionProps {
  projects: ProjectMeta[];
}

export function ProjectSection({ projects }: ProjectSectionProps) {
  return (
    <SectionShell id="projects" titleId="projects-title" label="03" className="blue-section projects-section">
      <div className="project-sky" aria-hidden="true">
        <span className="bird bird-four" />
        <span className="bird bird-five" />
      </div>
      <ImageBackdrop />
      <div className="section-inner project-inner">
        <div className="section-label-row project-label-row">
          <h2 id="projects-title" className="section-label">Projects</h2>
          <span aria-hidden="true" />
        </div>

        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function ImageBackdrop() {
  return (
    <>
      <div className="project-clouds" aria-hidden="true" />
      <div className="project-wall" aria-hidden="true" />
    </>
  );
}
