export default function ResumePage() {
  return (
    <div className="section-wrapper max-w-3xl mx-auto">
      <div className="animate-in flex justify-between items-baseline mb-16">
        <h1 className="section-title mb-0">Resume</h1>
        <a
          href="/resume.pdf"
          className="text-sm text-accent hover:text-white transition-colors"
          download
        >
          Download PDF ↓
        </a>
      </div>

      <div className="space-y-20 animate-in delay-1">

        {/* Experience Section */}
        <section>
          <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-8">Experience</h2>

          <div className="space-y-12">
            {/* Item 1 */}
            <div className="group">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-accent transition-colors">Full Stack Intern</h3>
                <span className="text-sm text-neutral-500 font-mono">Feb 2025 — Jul 2025</span>
              </div>
              <p className="text-neutral-400 mb-4">'Sup (YC W24) · Remote</p>
              <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-neutral-600 block mt-1">•</span>
                  <span>Engineered a scalable web scraping system using Python and Selenium for 30k+ profiles.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-neutral-600 block mt-1">•</span>
                  <span>Built AI-driven cold email automation pipelines with Next.js, boosting engagement by 35%.</span>
                </li>
              </ul>
            </div>

            {/* Item 2 */}
            <div className="group">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-accent transition-colors">LLM Research</h3>
                <span className="text-sm text-neutral-500 font-mono">Jan 2025 — May 2025</span>
              </div>
              <p className="text-neutral-400 mb-4">UT Dallas · Richardson, TX</p>
              <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-neutral-600 block mt-1">•</span>
                  <span>Executed large-scale experiments on context length scaling, achieving 2x faster convergence.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-neutral-600 block mt-1">•</span>
                  <span>Improved benchmark accuracy by 6% on math datasets through curriculum learning.</span>
                </li>
              </ul>
            </div>

            {/* Item 3 */}
            <div className="group">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-accent transition-colors">AI Intern</h3>
                <span className="text-sm text-neutral-500 font-mono">Jun 2024 — Aug 2024</span>
              </div>
              <p className="text-neutral-400 mb-4">XNode.AI · Remote</p>
              <ul className="space-y-2 text-neutral-400 text-sm leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-neutral-600 block mt-1">•</span>
                  <span>Developed a centralized Neo4j knowledge graph with vector embeddings.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-neutral-600 block mt-1">•</span>
                  <span>Built an agentic RAG chatbot, increasing query accuracy by 75%.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section>
          <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-8">Education</h2>
          <div className="flex justify-between items-baseline">
            <div>
              <h3 className="text-xl font-semibold text-white">B.S. Computer Science</h3>
              <p className="text-neutral-400 mt-1">University of Texas at Dallas</p>
            </div>
            <span className="text-sm text-neutral-500 font-mono">Graduating Dec 2025</span>
          </div>
        </section>

      </div>
    </div>
  );
}
