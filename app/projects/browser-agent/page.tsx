import Link from "next/link";

export default function BrowserAgentPage() {
  return (
    <div className="notion-content">
      <div className="animate-in">
        <Link
          href="/projects"
          className="text-sm text-muted hover:text-foreground transition-colors mb-6 inline-block"
        >
          ← Projects
        </Link>
        <h1 className="notion-title">browser-agent</h1>
        <p className="notion-subtitle">
          Browser automation library for LLM agents
        </p>
        <div className="flex gap-4 mb-8">
          <a
            href="https://github.com/AbhinavMalkoochi/browser-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-foreground transition-colors underline underline-offset-2"
          >
            github
          </a>
        </div>
      </div>

      <div className="prose-custom animate-in delay-1">
        <h2>Overview</h2>
        <p>
          A Python library for browser automation using Chrome DevTools Protocol (CDP). 
          Designed specifically for LLM-driven interaction, with built-in support for 
          OpenAI, Anthropic, and Google Gemini backends.
        </p>

        <h2>Problem</h2>
        <p>
          Existing browser automation tools weren't designed for LLM agents. They lack 
          structured element representation, confidence scoring, and native integration 
          with language model APIs.
        </p>

        <h2>Solution</h2>
        <p>
          browser-agent correlates data from the DOM, DOMSnapshot, and Accessibility 
          tree to build a unified view of interactive elements. Each element receives 
          a confidence score (0-1) indicating its actionability.
        </p>

        <h2>Architecture</h2>
        <ul>
          <li><strong>CDP Client</strong> — WebSocket connection to Chrome</li>
          <li><strong>Data Merger</strong> — Correlates DOM, snapshot, and accessibility data</li>
          <li><strong>Serialization</strong> — Converts page state to LLM-friendly text</li>
          <li><strong>Tool Executor</strong> — Maps LLM tool calls to browser actions</li>
        </ul>

        <h2>Usage</h2>
        <pre><code>{`from browser_agent import Browser, Agent, OpenAIBackend

backend = OpenAIBackend(model="gpt-4o")
agent = Agent(backend)

history = await agent.run(
    task="Search for Python tutorials",
    start_url="https://google.com"
)`}</code></pre>

        <h2>Features</h2>
        <ul>
          <li>Async API with context manager support</li>
          <li>Tool schemas for OpenAI and Anthropic formats</li>
          <li>Click, type, scroll, select, and keyboard actions</li>
          <li>Screenshot capture (viewport or full-page)</li>
          <li>Configurable agent with step limits and failure handling</li>
        </ul>
      </div>
    </div>
  );
}

