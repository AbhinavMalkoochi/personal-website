import Link from "next/link";

const projects = [
  {
    slug: "browser-agent",
    name: "Browser Agent",
    description: "Built a TypeScript-based autonomous browser agent enabling LLMs to perform real web actions (DOM traversal, form fills, navigation), achieving <150ms action latency and completing multi-page workflows with 95% reliability. Architected a multi-session isolated runtime with deterministic action queues, sandboxed JS execution, and concurrency-safe state propagation, supporting 10 fully parallel browser agents.",
    tags: ["Typescript", "Python"],
  },
  {
    slug: "mcpcode",
    name: "MCP Code",
    description: "Built a TypeScript system that let AI agents load MCP tools on-demand, reducing context usage by 90% compared to direct tool calls. Implemented code-execution workflows that filtered large datasets before reaching the model, cutting token overhead by 50–95% depending on workload. Created a filesystem-based tool interface for dozens of MCP servers, improving tool discovery speed.",
    tags: ["Typescript"],
  },
];

export default function ProjectsPage() {
  return (
    <div className="section-wrapper">
      <div className="painting-frame animate-reveal">
        <h1 className="gallery-title mb-12 text-center">Selected Works</h1>

        <div className="space-y-12">
          {projects.map((project) => (
            <div key={project.slug} className="group border-b border-white/10 pb-12 last:border-0 last:pb-0">
              <div className="flex justify-between items-baseline mb-4">
                <Link href={`/projects/${project.slug}`} className="text-2xl font-serif text-white hover:text-amber-400 transition-colors">
                  {project.name}
                </Link>
                <div className="flex gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs uppercase tracking-wider text-neutral-500 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-neutral-300 leading-relaxed max-w-3xl">
                {project.description}
              </p>

              <div className="mt-4">
                <Link href={`/projects/${project.slug}`} className="text-sm text-neutral-500 hover:text-white italic font-serif">
                  View Detail →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
