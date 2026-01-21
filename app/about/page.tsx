import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="section-wrapper">
            <div className="animate-in">
                <h1 className="section-title mb-6">About Me</h1>
            </div>

            <div className="glass-subtle p-8 rounded-lg max-w-2xl animate-in delay-1">
                <p className="text-lg text-gray-200 leading-relaxed mb-6">
                    I'm <strong className="text-accent">Abhinav Malkoochi</strong>, a Computer Science
                    student at the University of Texas at Dallas, graduating in December 2025.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                    I believe that <span className="text-accent">code is the closest thing we have to magic</span>.
                    By defining simple rules, we can create complex, emergent behaviors that feel alive —
                    like the particle flow field you see right now.
                </p>

                <p className="text-gray-300 leading-relaxed mb-6">
                    I've been a founding engineer at two startups, working on everything from
                    AI-driven automation to web scraping at scale. My work focuses on the intersection
                    of <strong>AI, mathematics, and elegant engineering</strong>.
                </p>

                <p className="text-gray-400 leading-relaxed">
                    Currently exploring: LLM reasoning, context length scaling,
                    and building tools that make developers more productive.
                </p>
            </div>

            {/* Skills Grid */}
            <div className="animate-in delay-2 mt-12">
                <h2 className="text-xs uppercase tracking-widest text-muted mb-6 font-mono">
                    Core Stack
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl">
                    <div className="glass-subtle p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-foreground mb-3">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                            {["TypeScript", "Python", "JavaScript", "SQL"].map((skill) => (
                                <span key={skill} className="tag">{skill}</span>
                            ))}
                        </div>
                    </div>

                    <div className="glass-subtle p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-foreground mb-3">Frameworks</h3>
                        <div className="flex flex-wrap gap-2">
                            {["React", "Next.js", "FastAPI", "Node.js"].map((skill) => (
                                <span key={skill} className="tag">{skill}</span>
                            ))}
                        </div>
                    </div>

                    <div className="glass-subtle p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-foreground mb-3">Data & AI</h3>
                        <div className="flex flex-wrap gap-2">
                            {["LLMs", "RAG", "Neo4j", "PostgreSQL"].map((skill) => (
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

            {/* Connect */}
            <div className="animate-in delay-3 mt-12">
                <h2 className="text-xs uppercase tracking-widest text-muted mb-6 font-mono">
                    Connect
                </h2>

                <div className="flex gap-4">
                    <a
                        href="mailto:abhinav.malkoochi@gmail.com"
                        className="btn-primary"
                    >
                        Email Me
                    </a>
                    <a
                        href="https://github.com/AbhinavMalkoochi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://linkedin.com/in/abhinav-malkoochi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                    >
                        LinkedIn
                    </a>
                </div>
            </div>
        </div>
    );
}
