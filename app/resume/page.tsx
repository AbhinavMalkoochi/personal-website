export default function ResumePage() {
  return (
    <div className="notion-content">
      <div className="animate-in">
        <h1 className="notion-title">Resume</h1>
        <p className="notion-subtitle">
          Experience, education, and skills.
        </p>
        <div className="flex gap-4 text-sm">
          <a
            href="mailto:abhinav.malkoochi@gmail.com"
            className="text-muted hover:text-foreground transition-colors underline underline-offset-2"
          >
            abhinav.malkoochi@gmail.com
          </a>
          <a
            href="https://github.com/AbhinavMalkoochi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground transition-colors underline underline-offset-2"
          >
            github
          </a>
        </div>
      </div>

      <div className="mt-12 animate-in delay-1">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted mb-6">Education</h2>
        
        <div className="border-l-2 border-subtle pl-6 pb-2">
          <div className="relative">
            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-foreground" />
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-base font-medium text-foreground">B.S. Computer Science</h3>
              <span className="text-sm text-muted">Aug 2023 — Dec 2025</span>
            </div>
            <p className="text-sm text-muted">University of Texas at Dallas</p>
          </div>
        </div>
      </div>

      <div className="mt-12 animate-in delay-2">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted mb-6">Experience</h2>
        
        <div className="border-l-2 border-subtle pl-6 space-y-8">
          <div className="relative">
            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-foreground" />
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-base font-medium text-foreground">Full Stack Intern</h3>
              <span className="text-sm text-muted">Feb 2025 — Jul 2025</span>
            </div>
            <p className="text-sm text-muted mb-3">'Sup · Remote</p>
            <ul className="text-sm text-muted space-y-2 list-none">
              <li className="flex gap-2">
                <span className="text-accent">—</span>
                <span>Engineered a web scraping system using Python and Selenium to extract data from 30,000+ LinkedIn profiles, boosting targeted outreach efficiency by 40%</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">—</span>
                <span>Developed an AI-driven cold email automation pipeline with Next.js, increasing engagement rates by 35% and cutting manual outreach time by 50%</span>
              </li>
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-foreground" />
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-base font-medium text-foreground">LLM Research</h3>
              <span className="text-sm text-muted">Jan 2025 — May 2025</span>
            </div>
            <p className="text-sm text-muted mb-3">UT Dallas · Richardson, TX</p>
            <ul className="text-sm text-muted space-y-2 list-none">
              <li className="flex gap-2">
                <span className="text-accent">—</span>
                <span>Designed and executed large-scale experiments on context length scaling for LLMs</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">—</span>
                <span>Achieved 2x faster convergence and 50% lower compute vs. fixed 24k training while improving benchmark accuracy (+6% on AIME/AMC/MATH-500)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">—</span>
                <span>Introduced an iterative curriculum for context scaling for more efficient long-context reasoning and token utilization</span>
              </li>
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-foreground" />
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-base font-medium text-foreground">AI Intern</h3>
              <span className="text-sm text-muted">Jun 2024 — Aug 2024</span>
            </div>
            <p className="text-sm text-muted mb-3">XNode.AI · Remote</p>
            <ul className="text-sm text-muted space-y-2 list-none">
              <li className="flex gap-2">
                <span className="text-accent">—</span>
                <span>Developed a Neo4j knowledge graph with vector embeddings, centralizing company data (product, GitHub, specs)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">—</span>
                <span>Built an agentic chatbot with LLM and RAG for knowledge graph interaction, enabling queries and insights</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent">—</span>
                <span>Boosted knowledge graph query accuracy by 75% via RAG implementation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 animate-in delay-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted mb-6">Skills</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {["TypeScript", "Python", "JavaScript", "SQL", "Java"].map((skill) => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Frameworks</h3>
            <div className="flex flex-wrap gap-2">
              {["React", "Next.js", "Node.js", "FastAPI", "Selenium"].map((skill) => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Data & AI</h3>
            <div className="flex flex-wrap gap-2">
              {["PostgreSQL", "Neo4j", "Redis", "LLMs", "RAG"].map((skill) => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
          </div>
          <div>
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
