import {
  ContactSection,
  ExperienceSection,
  HeroSection,
  ProjectSection,
} from "./components/portfolio";
import { type ProjectMeta } from "./lib/projects";

const projectOrder = ["Browser Agent", "MCP Code"];

interface Props {
  projects: ProjectMeta[];
}

export default function HomeClient({ projects }: Props) {
  const selectedProjects = [...projects].sort((a, b) => {
    const aIndex = projectOrder.indexOf(a.name);
    const bIndex = projectOrder.indexOf(b.name);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });

  return (
    <div className="portfolio-shell">
      <HeroSection />
      <ExperienceSection />
      <ProjectSection projects={selectedProjects} />
      <ContactSection />
    </div>
  );
}
