import Link from "next/link";

export default function Home() {
  return (
    <div className="notion-content">
      <div className="animate-in">
        <h1 className="notion-title">Abhinav Malkoochi</h1>
        <p className="notion-subtitle">
          CS student at UT Dallas, graduating December 2025. Founding engineer at two startups.
        </p>
      </div>

      <section className="notion-section animate-in delay-1">
        <h2 className="notion-section-title">Pages</h2>
        <div className="space-y-2">
          <Link href="/projects" className="notion-card">
            <div className="flex items-center gap-3">
              <span className="text-lg">◇</span>
              <div>
                <div className="notion-card-title">Projects</div>
                <div className="notion-card-desc">Things I've built</div>
              </div>
            </div>
          </Link>
          <Link href="/blog" className="notion-card">
            <div className="flex items-center gap-3">
              <span className="text-lg">◁</span>
              <div>
                <div className="notion-card-title">Writing</div>
                <div className="notion-card-desc">Notes and thoughts</div>
              </div>
            </div>
          </Link>
          <Link href="/resume" className="notion-card">
            <div className="flex items-center gap-3">
              <span className="text-lg">▢</span>
              <div>
                <div className="notion-card-title">Resume</div>
                <div className="notion-card-desc">Experience and skills</div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="notion-section animate-in delay-2">
        <h2 className="notion-section-title">Recent</h2>
        <div className="space-y-2">
          <Link href="/projects/mcpcode" className="notion-card">
            <div className="notion-card-title">mcpcode</div>
            <div className="notion-card-desc">
              TypeScript code generation for MCP servers
            </div>
          </Link>
          <Link href="/projects/browser-agent" className="notion-card">
            <div className="notion-card-title">browser-agent</div>
            <div className="notion-card-desc">
              Browser automation library for LLM agents
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
