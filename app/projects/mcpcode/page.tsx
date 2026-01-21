import Link from "next/link";

export default function MCPCodePage() {
    return (
        <div className="project-detail animate-in">
            <Link href="/projects" className="text-sm text-muted hover:text-white transition-colors mb-8 inline-block">
                ← Back to Projects
            </Link>

            <h1>MCP Code</h1>

            <div className="flex gap-2 mb-8">
                <span className="tag">TypeScript</span>
                <span className="tag">AI</span>
                <span className="tag">CLI</span>
            </div>

            <p className="description">
                A TypeScript system that enables AI agents to load MCP (Model Context Protocol) tools
                on-demand, dramatically reducing context usage and improving performance.
            </p>

            <h2>Key Features</h2>
            <ul>
                <li>On-demand tool loading reduces context usage by 90% vs direct tool calls</li>
                <li>Code-execution workflows filter large datasets before reaching the model</li>
                <li>Cuts token overhead by 50-95% depending on workload</li>
                <li>Filesystem-based tool interface for dozens of MCP servers</li>
                <li>Improved tool discovery speed across server ecosystem</li>
            </ul>

            <h2>Technical Stack</h2>
            <ul>
                <li>TypeScript for type-safe code generation</li>
                <li>MCP protocol integration</li>
                <li>CLI interface for easy adoption</li>
            </ul>

            <div className="mt-12">
                <a
                    href="https://github.com/AbhinavMalkoochi/mcpcode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                >
                    View on GitHub →
                </a>
            </div>
        </div>
    );
}
