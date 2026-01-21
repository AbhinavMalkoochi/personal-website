import Link from "next/link";

export default function BrowserAgentPage() {
  return (
    <div className="project-detail animate-in">
      <Link href="/projects" className="text-sm text-muted hover:text-white transition-colors mb-8 inline-block">
        ← Back to Projects
      </Link>

      <h1>Browser Agent</h1>

      <div className="flex gap-2 mb-8">
        <span className="tag">TypeScript</span>
        <span className="tag">Python</span>
        <span className="tag">CDP</span>
      </div>

      <p className="description">
        A TypeScript-based autonomous browser agent enabling LLMs to perform real web actions
        with DOM traversal, form fills, and navigation.
      </p>

      <h2>Performance</h2>
      <ul>
        <li>&lt;150ms action latency for browser interactions</li>
        <li>95% reliability on multi-page workflows</li>
        <li>Supports 10 fully parallel browser agents</li>
      </ul>

      <h2>Architecture</h2>
      <ul>
        <li>Multi-session isolated runtime with deterministic action queues</li>
        <li>Sandboxed JS execution for safety</li>
        <li>Concurrency-safe state propagation</li>
        <li>WebSocket connection via Chrome DevTools Protocol</li>
      </ul>

      <h2>Features</h2>
      <ul>
        <li>Click, type, scroll, select, and keyboard actions</li>
        <li>Screenshot capture (viewport or full-page)</li>
        <li>Tool schemas for OpenAI and Anthropic formats</li>
        <li>Async API with context manager support</li>
      </ul>

      <div className="mt-12">
        <a
          href="https://github.com/AbhinavMalkoochi/browser-agent"
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
