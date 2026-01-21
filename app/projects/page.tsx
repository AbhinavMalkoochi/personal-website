import Link from "next/link";

const projects = [
    {
        slug: "browser-agent",
        name: "Browser Agent",
        description: "TypeScript-based autonomous browser agent enabling LLMs to perform real web actions with <150ms latency and 95% reliability.",
        tags: ["TypeScript", "Python", "CDP"],
    },
    {
        slug: "mcpcode",
        name: "MCP Code",
        description: "TypeScript system for on-demand MCP tool loading, reducing context usage by 90% and token overhead by 50-95%.",
        tags: ["TypeScript", "AI", "CLI"],
    },
];

export default function ProjectsPage() {
    return (
        <div className="section-wrapper">
            <div className="animate-in">
                <h1 className="section-title">Work</h1>
                <p className="text-body mb-12">Selected technical projects.</p>
            </div>

            <div className="bento-grid animate-in delay-1">
                {projects.map((project) => (
                    <Link
                        key={project.slug}
                        href={`/projects/${project.slug}`}
                        className="bento-card group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-2 flex-wrap">
                                {project.tags.map(tag => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                            <span className="text-muted group-hover:text-white transition-colors">↗</span>
                        </div>

                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
