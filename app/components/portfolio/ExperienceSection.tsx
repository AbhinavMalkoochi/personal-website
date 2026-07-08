import { ExperienceCard } from "./ExperienceCard";
import { SectionShell } from "./SectionShell";

const experiences = [
  {
    company: "’Sup",
    title: "Full Stack Intern",
    detail:
      "Worked on internal tools and customer-facing features across web and mobile. Shipped end-to-end features and improved dev productivity.",
    image: "/assets/portfolio/summer/experience-sup.webp",
  },
  {
    company: "UT Dallas",
    title: "LLM Research",
    detail:
      "Researched prompt optimization, hallucination mitigation, and evaluation frameworks for large language models.",
    image: "/assets/portfolio/summer/experience-utd.webp",
  },
  {
    company: "XNode.AI",
    title: "AI Intern",
    detail:
      "Built AI-powered workflows and backend services. Integrated models into production systems and improved inference pipelines.",
    image: "/assets/portfolio/summer/experience-xnode.webp",
  },
];

export function ExperienceSection() {
  return (
    <SectionShell id="experience" titleId="experience-title" label="02" className="paper-section experience-section">
      <div className="section-inner experience-inner">
        <div className="section-label-row">
          <h2 id="experience-title" className="section-label">Experience</h2>
          <span aria-hidden="true" />
        </div>
        <div className="experience-timeline" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="experience-stack">
          {experiences.map((experience, index) => (
            <ExperienceCard key={experience.company} index={index} {...experience} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
