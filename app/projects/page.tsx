import Link from "next/link";

const projects = [
  {
    slug: "mcpcode",
    name: "mcpcode",
    tagline: "TypeScript code generation for MCP servers",
    tags: ["typescript", "mcp", "cli"],
  },
  {
    slug: "browser-agent",
    name: "browser-agent",
    tagline: "Browser automation library for LLM agents",
    tags: ["python", "cdp", "automation"],
  },
];

export default function ProjectsPage() {
  return (
    <div className="notion-content">
      <div className="animate-in">
        <h1 className="notion-title">Projects</h1>
        <p className="notion-subtitle">
          Open source tools and libraries I've built.
        </p>
      </div>

      <div className="space-y-3 animate-in delay-1">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="notion-card"
          >
            <div className="notion-card-title">{project.name}</div>
            <div className="notion-card-desc">{project.tagline}</div>
            <div className="flex flex-wrap">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
