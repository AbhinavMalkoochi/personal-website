export default function ResumePage() {
  return (
    <div className="section-wrapper max-w-3xl">
      <div className="animate-in">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="section-title">Experience</h1>
            <p className="text-muted mt-2">A timeline of technical evolution.</p>
          </div>
          <a
            href="mailto:abhinav.malkoochi@gmail.com"
            className="btn-primary"
          >
            Contact Me
          </a>
        </div>

        <div className="flex gap-4 text-sm mt-4">
          <a
            href="mailto:abhinav.malkoochi@gmail.com"
            className="text-muted hover:text-accent transition-colors"
          >
            abhinav.malkoochi@gmail.com
          </a>
          <a
            href="https://github.com/AbhinavMalkoochi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors"
          >
            github
          </a>
        </div>
      </div>

      {/* Education */}
      <div className="mt-16 animate-in delay-1">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted mb-8 font-mono">
          Education
        </h2>

        <div className="timeline">
          <div className="timeline-item">
            <span className="timeline-date">Aug 2023 — Dec 2025</span>
            <h3 className="timeline-title">B.S. Computer Science</h3>
            <p className="timeline-desc">University of Texas at Dallas</p>
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="mt-16 animate-in delay-2">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted mb-8 font-mono">
          Experience
        </h2>

        <div className="timeline">
          <div className="timeline-item">
            <span className="timeline-date">Feb 2025 — Jul 2025</span>
            <h3 className="timeline-title">Full Stack Intern</h3>
            <p className="text-sm text-muted mb-4">'Sup · Remote</p>
            <ul className="text-sm text-muted space-y-3">
              <li className="flex gap-3">
                <span className="text-accent mt-0.5">→</span>
                <span>Engineered a web scraping system using Python and Selenium to extract data from 30,000+ LinkedIn profiles, boosting targeted outreach efficiency by 40%</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent mt-0.5">→</span>
                <span>Developed an AI-driven cold email automation pipeline with Next.js, increasing engagement rates by 35% and cutting manual outreach time by 50%</span>
              </li>
            </ul>
          </div>

          <div className="timeline-item">
            <span className="timeline-date">Jan 2025 — May 2025</span>
            <h3 className="timeline-title">LLM Research</h3>
            <p className="text-sm text-muted mb-4">UT Dallas · Richardson, TX</p>
            <ul className="text-sm text-muted space-y-3">
              <li className="flex gap-3">
                <span className="text-accent mt-0.5">→</span>
                <span>Designed and executed large-scale experiments on context length scaling for LLMs</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent mt-0.5">→</span>
                <span>Achieved 2x faster convergence and 50% lower compute vs. fixed 24k training while improving benchmark accuracy (+6% on AIME/AMC/MATH-500)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent mt-0.5">→</span>
                <span>Introduced an iterative curriculum for context scaling for more efficient long-context reasoning</span>
              </li>
            </ul>
          </div>

          <div className="timeline-item">
            <span className="timeline-date">Jun 2024 — Aug 2024</span>
            <h3 className="timeline-title">AI Intern</h3>
            <p className="text-sm text-muted mb-4">XNode.AI · Remote</p>
            <ul className="text-sm text-muted space-y-3">
              <li className="flex gap-3">
                <span className="text-accent mt-0.5">→</span>
                <span>Developed a Neo4j knowledge graph with vector embeddings, centralizing company data (product, GitHub, specs)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent mt-0.5">→</span>
                <span>Built an agentic chatbot with LLM and RAG for knowledge graph interaction</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent mt-0.5">→</span>
                <span>Boosted knowledge graph query accuracy by 75% via RAG implementation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-16 animate-in delay-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted mb-8 font-mono">
          Skills
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="glass-subtle p-4 rounded-lg">
            <h3 className="text-sm font-medium text-foreground mb-3">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {["TypeScript", "Python", "JavaScript", "SQL", "Java"].map((skill) => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
          </div>
          <div className="glass-subtle p-4 rounded-lg">
            <h3 className="text-sm font-medium text-foreground mb-3">Frameworks</h3>
            <div className="flex flex-wrap gap-2">
              {["React", "Next.js", "Node.js", "FastAPI", "Selenium"].map((skill) => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
          </div>
          <div className="glass-subtle p-4 rounded-lg">
            <h3 className="text-sm font-medium text-foreground mb-3">Data & AI</h3>
            <div className="flex flex-wrap gap-2">
              {["PostgreSQL", "Neo4j", "Redis", "LLMs", "RAG"].map((skill) => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
          </div>
          <div className="glass-subtle p-4 rounded-lg">
            <h3 className="text-sm font-medium text-foreground mb-3">Tools</h3>
            <div className="flex flex-wrap gap-2">
              {["AWS", "Docker", "Git", "Linux"].map((skill) => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
