export default function ResumePage() {
  return (
    <div className="section-wrapper">
      <div className="painting-frame animate-reveal max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 border-b border-white/10 pb-12">
          <h1 className="gallery-title mb-4">Abhinav Malkoochi</h1>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-400 font-serif italic">
            <a href="mailto:abhinav.malkoochi@gmail.com" className="hover:text-amber-400 transition-colors">abhinav.malkoochi@gmail.com</a>
            <span>•</span>
            <a href="https://github.com/AbhinavMalkoochi" className="hover:text-amber-400 transition-colors">github.com/AbhinavMalkoochi</a>
            <span>•</span>
            <span>6307310098</span>
          </div>
        </div>

        {/* Education */}
        <section className="mb-16">
          <h3 className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-6 font-sans">Education</h3>
          <div className="paper-card">
            <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
              <h2 className="text-xl font-serif font-bold">University of Texas at Dallas</h2>
              <span className="font-mono text-sm text-neutral-600">Aug 2023 – Dec 2025</span>
            </div>
            <p className="text-neutral-700 italic">BS in Computer Science</p>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-16">
          <h3 className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-6 font-sans">Experience</h3>
          <div className="space-y-6">

            {/* Sup */}
            <div className="paper-card">
              <div className="flex justify-between items-baseline mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-serif font-bold">Full Stack Intern, ‘Sup</h2>
                <span className="font-mono text-sm text-neutral-600">Remote | Feb 2025 – July 2025</span>
              </div>
              <ul className="list-disc pl-5 space-y-2 leading-relaxed text-sm">
                <li>Engineered a robust web scraping system using Python and Selenium to extract and analyze data from 30,000+ LinkedIn profiles, boosting targeted outreach efficiency by 40%.</li>
                <li>Developed an AI-driven cold email automation pipeline with Next.js that leveraged enriched data to generate personalized messages, increasing engagement rates by 35% and cutting manual outreach time by 50%.</li>
              </ul>
            </div>

            {/* UTD Research */}
            <div className="paper-card">
              <div className="flex justify-between items-baseline mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-serif font-bold">LLM Research, UT Dallas</h2>
                <span className="font-mono text-sm text-neutral-600">Richardson, TX | Jan 2025 – May 2025</span>
              </div>
              <ul className="list-disc pl-5 space-y-2 leading-relaxed text-sm">
                <li>Designed and executed large-scale experiments on context length scaling for LLMs.</li>
                <li>Achieved 2x faster convergence and 50% lower compute vs. fixed 24k training while improving benchmark accuracy (+6% on AIME/AMC/MATH-500).</li>
                <li>Introduced an iterative curriculum for context scaling for more efficient long-context reasoning, lower clipping ratio, and efficient token utilization on small models.</li>
              </ul>
            </div>

            {/* XNode */}
            <div className="paper-card">
              <div className="flex justify-between items-baseline mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-serif font-bold">Artificial Intelligence Intern, XNode.AI</h2>
                <span className="font-mono text-sm text-neutral-600">Remote | Jun 2024 – Aug 2024</span>
              </div>
              <ul className="list-disc pl-5 space-y-2 leading-relaxed text-sm">
                <li>Developed a Neo4j knowledge graph with vector embeddings, centralizing company data (product, GitHub, specs).</li>
                <li>Built an agentic chatbot with an LLM and RAG for knowledge graph interaction, enabling queries and insights.</li>
                <li>Boosted knowledge graph query accuracy by 75% via RAG implementation.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Skills */}
        <section>
          <h3 className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-6 font-sans">Skills</h3>
          <div className="paper-card">
            <div className="space-y-4">
              <div>
                <span className="font-bold text-neutral-800 uppercase text-xs tracking-wider block mb-1">Languages</span>
                <p className="text-sm">Java, Python, C/C++, SQL (Postgres), JavaScript/Typescript, HTML/CSS, R</p>
              </div>
              <div>
                <span className="font-bold text-neutral-800 uppercase text-xs tracking-wider block mb-1">Frameworks</span>
                <p className="text-sm">React, Next.js, Node.js, Flask, FastAPI, Unity, Firebase, Pytorch, Supabase, Docker, Kafka, Redis, AWS</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
