import Image from "next/image";
import { type ProjectMeta } from "@/app/lib/projects";

const artworkByName: Record<string, string> = {
  "Browser Agent": "/assets/portfolio/summer/project-browser-agent.webp",
  "MCP Code": "/assets/portfolio/summer/project-mcp-code.webp",
};

interface ProjectCardProps {
  project: ProjectMeta;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const number = String(index + 1).padStart(2, "0");
  const image = artworkByName[project.name];

  return (
    <article className="project-card">
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          aria-hidden="true"
          sizes="(max-width: 720px) 100vw, 560px"
          className="project-art"
        />
      ) : null}
      <div className="project-card-shade" aria-hidden="true" />
      <div className="project-card-copy">
        <div className="card-index">{number}</div>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        <div className="project-tags" aria-label={`${project.name} technology`}>
          {project.tech.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
