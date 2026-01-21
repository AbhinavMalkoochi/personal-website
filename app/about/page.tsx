export default function AboutPage() {
    return (
        <div className="section-wrapper max-w-2xl">
            <div className="animate-in">
                <h1 className="section-title">About</h1>

                <div className="space-y-6 text-body">
                    <p>
                        I&apos;m a Computer Science graduate from UT Dallas. My focus is on AI infrastructure,
                        specifically LLM tooling, browser automation, and building systems that help
                        developers work more efficiently.
                    </p>
                    <p>
                        I&apos;ve worked as a founding engineer at two startups where I built everything from
                        web scraping pipelines to AI-driven automation tools. I enjoy solving hard technical
                        problems and shipping production-ready code.
                    </p>
                </div>

                <div className="mt-12 flex gap-4">
                    <a href="mailto:abhinav.malkoochi@gmail.com" className="btn-primary">
                        Contact
                    </a>
                    <a href="https://github.com/AbhinavMalkoochi" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                        GitHub
                    </a>
                </div>
            </div>

            <div className="mt-16 animate-in delay-1">
                <h2 className="text-sm font-semibold text-accent uppercase tracking-wide mb-6">Stack</h2>
                <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                        <p className="text-white font-medium mb-2">Languages</p>
                        <p className="text-muted">TypeScript, Python, Java, SQL</p>
                    </div>
                    <div>
                        <p className="text-white font-medium mb-2">Frontend</p>
                        <p className="text-muted">Next.js, React, Tailwind</p>
                    </div>
                    <div>
                        <p className="text-white font-medium mb-2">Backend & AI</p>
                        <p className="text-muted">FastAPI, Neo4j, PostgreSQL, LangChain</p>
                    </div>
                    <div>
                        <p className="text-white font-medium mb-2">Tools</p>
                        <p className="text-muted">AWS, Docker, Redis, Kafka</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
