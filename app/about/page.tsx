import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="section-wrapper">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start animate-in">
                {/* Bio Section */}
                <div className="md:col-span-7">
                    <h1 className="section-title mb-8">About</h1>
                    <div className="space-y-6 text-body">
                        <p>
                            I believe that software should feel inevitable. When you use a well-designed tool,
                            it disappears, leaving only the task at hand. That is the kind of software I strive to build.
                        </p>
                        <p>
                            Currently, I am a Computer Science student at <strong className="text-white">UT Dallas</strong> (graduating Dec 2025)
                            and have helped build two startups as a founding engineer. My work serves as a bridge between
                            complex AI infrastructure and intuitive user experiences.
                        </p>
                        <p>
                            When I'm not coding, I'm exploring the mathematics of chaos, reading about interface design,
                            or optimizing my own workflows.
                        </p>
                    </div>

                    <div className="mt-12 flex gap-4">
                        <a href="mailto:abhinav.malkoochi@gmail.com" className="btn-minimal">
                            Get in Touch
                        </a>
                        <a href="https://github.com/AbhinavMalkoochi" target="_blank" rel="noopener noreferrer" className="btn-outline">
                            GitHub
                        </a>
                    </div>
                </div>

                {/* Stack Section */}
                <div className="md:col-span-5 md:pt-20">
                    <div className="p-8 rounded-3xl bg-neutral-900/40 border border-white/5 backdrop-blur-md">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Technical Stack</h3>

                        <div className="space-y-8">
                            <div>
                                <p className="text-xs text-neutral-500 font-mono mb-2 uppercase">Core</p>
                                <p className="text-neutral-300">TypeScript, Python, Java, SQL</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500 font-mono mb-2 uppercase">Frontend</p>
                                <p className="text-neutral-300">Next.js, React, Tailwind, Framer Motion</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500 font-mono mb-2 uppercase">Backend & AI</p>
                                <p className="text-neutral-300">FastAPI, Neo4j, PostgreSQL, LangChain</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500 font-mono mb-2 uppercase">Infrastructure</p>
                                <p className="text-neutral-300">AWS, Docker, Vercel, Git</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
