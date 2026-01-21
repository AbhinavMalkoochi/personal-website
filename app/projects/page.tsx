import Link from "next/link";

const projects = [
  {
    slug: "mcpcode",
    name: "mcpcode",
    description: "Generate type-safe TypeScript clients for Model Context Protocol servers. Eliminates runtime errors in AI agent integration.",
    tags: ["TypeScript", "AI", "CLI"],
    featured: true,
  },
  {
    slug: "browser-agent",
    name: "browser-agent",
    description: "Headless browser automation library designed specifically for LLMs. Built on top of Chrome DevTools Protocol.",
    tags: ["Python", "CDP", "Automation"],
    featured: false,
  },
  {
    slug: "personal-website",
    name: "Portfolio V3",
    description: "This website. Built with Next.js, Simplex Noise, and Apple-inspired minimalist design principles.",
    tags: ["React", "Design", "Graphics"],
    featured: false,
  }
];

export default function ProjectsPage() {
  return (
    <div className="section-wrapper">
      <div className="animate-in mb-12">
        <h1 className="section-title">Work</h1>
        <p className="text-body max-w-xl">
          A selection of tools and libraries I've engineered. Open source and built for production.
        </p>
      </div>

      <div className="bento-grid animate-in delay-1">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={`bento-card group flex flex-col justify-between ${project.featured ? 'md:col-span-2' : ''}`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-mono text-muted bg-white/5 px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-muted group-hover:text-white transition-colors">↗</span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-white mb-3">
                {project.name}
              </h3>

              <p className="text-muted leading-relaxed">
                {project.description}
              </p>
            </div>

            {project.featured && (
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-sm text-accent">Featured Project</p>
              </div>
            )}
          </Link>
        ))}

        {/* Placeholder for future work */}
        <div className="bento-card flex items-center justify-center min-h-[200px] border-dashed border-neutral-800 bg-transparent">
          <p className="text-neutral-600 text-sm font-mono uppercase tracking-widest">
            More Coming Soon
          </p>
        </div>
      </div>
    </div>
  );
}
