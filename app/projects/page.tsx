import Link from "next/link";

const projects = [
  {
    slug: "mcpcode",
    name: "mcpcode",
    tagline: "TypeScript code generation for MCP servers",
    description: "A CLI tool that generates type-safe TypeScript code from MCP (Model Context Protocol) server definitions. Makes building AI tool integrations faster and more reliable.",
    tags: ["TypeScript", "MCP", "CLI", "AI"],
  },
  {
    slug: "browser-agent",
    name: "browser-agent",
    tagline: "Browser automation library for LLM agents",
    description: "A Python library using Chrome DevTools Protocol for browser automation. Designed specifically for LLM agents to interact with web pages programmatically.",
    tags: ["Python", "CDP", "Automation", "AI Agents"],
  },
];

export default function ProjectsPage() {
  return (
    <div className="section-wrapper">
      <div className="animate-in">
        <h1 className="section-title">Selected Projects</h1>
        <p className="text-muted mt-2">
          Open source tools and libraries, built with precision.
        </p>
      </div>

      <div className="projects-grid animate-in delay-1">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="glass-card group"
          >
            <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
              {project.name}
            </h3>
            <p className="text-muted text-sm mt-2 mb-4 leading-relaxed">
              {project.description}
            </p>
            <div className="tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Future Projects Teaser */}
      <div className="animate-in delay-2 mt-12">
        <div className="glass-subtle p-6 rounded-lg max-w-md">
          <h3 className="text-sm uppercase tracking-wider text-muted mb-3 font-mono">
            Coming Soon
          </h3>
          <p className="text-gray-400 text-sm">
            More projects in development, including work on LLM context scaling
            and knowledge graph systems.
          </p>
        </div>
      </div>
    </div>
  );
}
