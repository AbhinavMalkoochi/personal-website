export default function McpCodePage() {
  return (
    <div className="section-wrapper">
      <div className="painting-frame animate-reveal max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="gallery-title mb-4">MCP Code</h1>
          <p className="text-neutral-400 font-serif italic text-lg">
            On-demand tool loading for AI agents.
          </p>
        </div>

        <div className="prose prose-invert prose-lg mx-auto text-neutral-300 leading-loose font-sans">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-amber-400 first-letter:mr-2 float-left">
            M
          </p>
          <p>
            CP Code is a TypeScript system architected to solve the context bottleneck in AI agent workflows.
            By enabling agents to load Model Context Protocol (MCP) tools on-demand, it reduces context usage
            by <strong>90%</strong> compared to direct tool calls.
          </p>

          <h3 className="text-white font-serif mt-12 mb-6 text-2xl">Key Engineering</h3>
          <ul className="list-disc pl-6 space-y-4 marker:text-amber-400">
            <li>
              <strong>Context Efficiency:</strong> Implemented code-execution workflows that filter large datasets
              before they reach the model, cutting token overhead by 50–95%.
            </li>
            <li>
              <strong>Filesystem Interface:</strong> Created a unified filesystem-based interface for accessing
              dozens of MCP servers, significantly improving tool discovery speed and developer experience.
            </li>
          </ul>

          <div className="mt-12 p-6 border-l-2 border-amber-400 bg-white/5 italic text-neutral-400">
            "A critical infrastructure piece for scaling agentic systems."
          </div>
        </div>
      </div>
    </div>
  );
}
