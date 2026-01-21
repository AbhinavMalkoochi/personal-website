export default function ResumePage() {
    return (
        <div className="section-wrapper max-w-3xl mx-auto">
            <div className="animate-in flex justify-between items-baseline mb-12">
                <h1 className="section-title mb-0">Resume</h1>
                <div className="flex gap-4 text-sm">
                    <a href="mailto:abhinav.malkoochi@gmail.com" className="text-muted hover:text-white transition-colors">
                        abhinav.malkoochi@gmail.com
                    </a>
                    <a href="https://github.com/AbhinavMalkoochi" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors">
                        GitHub
                    </a>
                </div>
            </div>

            <div className="space-y-16 animate-in delay-1">

                {/* Education */}
                <section className="resume-section">
                    <h2>Education</h2>
                    <div className="resume-item">
                        <div className="flex justify-between items-baseline flex-wrap gap-2">
                            <h3>University of Texas at Dallas</h3>
                            <span className="date">Aug 2023 – Dec 2025</span>
                        </div>
                        <p className="company">BS in Computer Science</p>
                    </div>
                </section>

                {/* Experience */}
                <section className="resume-section">
                    <h2>Experience</h2>

                    <div className="resume-item">
                        <div className="flex justify-between items-baseline flex-wrap gap-2">
                            <h3>Full Stack Intern</h3>
                            <span className="date">Feb 2025 – Jul 2025</span>
                        </div>
                        <p className="company">&apos;Sup · Remote</p>
                        <ul>
                            <li>Engineered a robust web scraping system using Python and Selenium to extract and analyze data from 30,000+ LinkedIn profiles, boosting targeted outreach efficiency by 40%.</li>
                            <li>Developed an AI-driven cold email automation pipeline with Next.js that leveraged enriched data to generate personalized messages, increasing engagement rates by 35% and cutting manual outreach time by 50%.</li>
                        </ul>
                    </div>

                    <div className="resume-item">
                        <div className="flex justify-between items-baseline flex-wrap gap-2">
                            <h3>LLM Research</h3>
                            <span className="date">Jan 2025 – May 2025</span>
                        </div>
                        <p className="company">UT Dallas · Richardson, TX</p>
                        <ul>
                            <li>Designed and executed large-scale experiments on context length scaling for LLMs.</li>
                            <li>Achieved 2x faster convergence and 50% lower compute vs. fixed 24k training while improving benchmark accuracy (+6% on AIME/AMC/MATH-500).</li>
                            <li>Introduced an iterative curriculum for context scaling for more efficient long-context reasoning, lower clipping ratio, and efficient token utilization on small models.</li>
                        </ul>
                    </div>

                    <div className="resume-item">
                        <div className="flex justify-between items-baseline flex-wrap gap-2">
                            <h3>Artificial Intelligence Intern</h3>
                            <span className="date">Jun 2024 – Aug 2024</span>
                        </div>
                        <p className="company">XNode.AI · Remote</p>
                        <ul>
                            <li>Developed a Neo4j knowledge graph with vector embeddings, centralizing company data (product, GitHub, specs).</li>
                            <li>Built an agentic chatbot with an LLM and RAG for knowledge graph interaction, enabling queries and insights.</li>
                            <li>Boosted knowledge graph query accuracy by 75% via RAG implementation.</li>
                        </ul>
                    </div>
                </section>

                {/* Projects */}
                <section className="resume-section">
                    <h2>Projects</h2>

                    <div className="resume-item">
                        <div className="flex justify-between items-baseline flex-wrap gap-2">
                            <h3>Browser Agent</h3>
                            <span className="text-xs text-accent">TypeScript, Python</span>
                        </div>
                        <ul>
                            <li>Built a TypeScript-based autonomous browser agent enabling LLMs to perform real web actions (DOM traversal, form fills, navigation), achieving &lt;150ms action latency and completing multi-page workflows with 95% reliability.</li>
                            <li>Architected a multi-session isolated runtime with deterministic action queues, sandboxed JS execution, and concurrency-safe state propagation, supporting 10 fully parallel browser agents.</li>
                        </ul>
                    </div>

                    <div className="resume-item">
                        <div className="flex justify-between items-baseline flex-wrap gap-2">
                            <h3>MCP Code</h3>
                            <span className="text-xs text-accent">TypeScript</span>
                        </div>
                        <ul>
                            <li>Built a TypeScript system that let AI agents load MCP tools on-demand, reducing context usage by 90% compared to direct tool calls.</li>
                            <li>Implemented code-execution workflows that filtered large datasets before reaching the model, cutting token overhead by 50–95% depending on workload.</li>
                            <li>Created a filesystem-based tool interface for dozens of MCP servers, improving tool discovery speed.</li>
                        </ul>
                    </div>
                </section>

                {/* Skills */}
                <section className="resume-section">
                    <h2>Skills</h2>
                    <div className="space-y-4">
                        <div>
                            <span className="text-sm font-medium text-white">Languages: </span>
                            <span className="text-sm text-muted">Java, Python, C/C++, SQL (Postgres), JavaScript/TypeScript, HTML/CSS, R</span>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-white">Frameworks: </span>
                            <span className="text-sm text-muted">React, Next.js, Node.js, Flask, FastAPI, Unity, Firebase, PyTorch, Supabase, Docker, Kafka, Redis, AWS</span>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
