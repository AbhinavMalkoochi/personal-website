import { GraphicMotifs } from "./GraphicMotifs";

const experiences = [
  {
    company: "'Sup",
    title: "Full Stack Intern",
    detail:
      "Worked on internal tools and customer-facing features across web and mobile. Shipped end-to-end features and improved dev productivity.",
  },
  {
    company: "UT Dallas",
    title: "LLM Research",
    detail:
      "Researched prompt optimization, hallucination mitigation, and evaluation frameworks for large language models.",
  },
  {
    company: "XNode.AI",
    title: "AI Intern",
    detail:
      "Built AI-powered workflows and backend services. Integrated models into production systems and improved inference pipelines.",
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="paper-section experience-section" aria-labelledby="experience-title">
      <GraphicMotifs tone="paper" />
      <div className="section-inner">
        <div className="section-label-row">
          <h2 id="experience-title" className="section-label">Experience</h2>
          <span aria-hidden="true" />
        </div>
        <div className="experience-grid">
          {experiences.map((experience, index) => (
            <article key={experience.company} className="experience-card">
              <span className="card-tape" aria-hidden="true" />
              <span className="card-accent" aria-hidden="true" />
              <div className="card-index">{String(index + 1).padStart(2, "0")}</div>
              <h3>{experience.company}</h3>
              <p className="role-title">{experience.title}</p>
              <p>{experience.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
