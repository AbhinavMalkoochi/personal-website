import Image from "next/image";
import { type ProjectMeta } from "@/app/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { SectionShell } from "./SectionShell";

interface ProjectSectionProps {
  projects: ProjectMeta[];
}

export function ProjectSection({ projects }: ProjectSectionProps) {
  return (
    <SectionShell id="projects" titleId="projects-title" label="03" className="blue-section projects-section">
      <Image
        src="/assets/portfolio/summer/projects-coastal-background.webp"
        alt=""
        fill
        aria-hidden="true"
        sizes="100vw"
        className="project-scene-image"
      />
      <div className="project-atmosphere" aria-hidden="true" />
      <div className="project-sky" aria-hidden="true">
        <span className="bird bird-four" />
        <span className="bird bird-five" />
      </div>
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
      <ProjectForeground />
    </SectionShell>
  );
}

function ProjectForeground() {
  return (
    <>
      <Image
        src="/assets/portfolio/summer/project-wall-cat-cutout.png"
        alt=""
        width={1500}
        height={643}
        aria-hidden="true"
        sizes="100vw"
        className="project-wall-cat"
      />
      <Image
        src="/assets/portfolio/summer/project-students-cutout.png"
        alt=""
        width={520}
        height={650}
        aria-hidden="true"
        sizes="(max-width: 720px) 180px, 260px"
        className="project-students"
      />
      <Image
        src="/assets/portfolio/summer/project-corner-foliage-cutout.png"
        alt=""
        width={560}
        height={700}
        aria-hidden="true"
        sizes="(max-width: 720px) 220px, 360px"
        className="project-corner-foliage"
      />
    </>
  );
}
