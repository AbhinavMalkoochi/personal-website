import Link from "next/link";

export default function Home() {
  return (
    <div className="section-wrapper items-center text-center">
      {/* Hero Section */}
      <div className="animate-in max-w-2xl mx-auto">
        <h1 className="hero-title mb-6">
          Building tools for the <span className="text-accent">AI era</span>.
        </h1>

        <p className="text-body text-lg mb-12 max-w-xl mx-auto">
          I'm Abhinav. A computer science student and founding engineer focused on
          LLM infrastructure, agentic workflows, and elegant systems.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/projects" className="btn-minimal">
            View Work
          </Link>
          <Link href="/about" className="btn-outline">
            About Me
          </Link>
        </div>
      </div>

      {/* Featured Grid Shortcut */}
      <div className="mt-32 w-full animate-in delay-2">
        <div className="bento-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {/* Featured Project */}
          <Link href="/projects/mcpcode" className="bento-card col-span-1 md:col-span-2 group cursor-pointer text-left">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-mono text-accent bg-blue-500/10 px-2 py-1 rounded">FEATURED</span>
              <span className="text-muted group-hover:text-white transition-colors">↗</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">mcpcode</h3>
            <p className="text-muted">
              TypeScript code generation for MCP servers. Bringing type safety to AI agent interactions.
            </p>
          </Link>

          {/* Current Focus */}
          <div className="bento-card text-left">
            <div className="text-xs font-mono text-muted mb-4 uppercase tracking-wider">Currently Building</div>
            <p className="text-white font-medium mb-2">Browser Agents</p>
            <p className="text-sm text-muted">
              Developing robust automation for LLM-driven web browsing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
