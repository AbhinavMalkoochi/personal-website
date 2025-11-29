import Link from "next/link";

export default function McpcodePage() {
  return (
    <div className="notion-content">
      <div className="animate-in">
        <Link
          href="/projects"
          className="text-sm text-muted hover:text-foreground transition-colors mb-6 inline-block"
        >
          ← Projects
        </Link>
        <h1 className="notion-title">mcpcode</h1>
        <p className="notion-subtitle">
          TypeScript code generation for MCP servers
        </p>
        <div className="flex gap-4 mb-8">
          <a
            href="https://www.npmjs.com/package/@abmalk/mcpcode"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-foreground transition-colors underline underline-offset-2"
          >
            npm
          </a>
          <a
            href="https://github.com/AbhinavMalkoochi/mcpcode"
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
          mcpcode generates type-safe TypeScript wrappers for MCP (Model Context Protocol) 
          servers. Instead of loading all tool definitions into an agent's context window, 
          the generated code can be imported on-demand, reducing token usage by up to 98%.
        </p>

        <h2>Problem</h2>
        <p>
          When connecting agents to multiple MCP servers, loading all tool definitions 
          upfront consumes significant context. This limits the number of tools an agent 
          can access and increases costs.
        </p>

        <h2>Solution</h2>
        <p>
          mcpcode reads your MCP server configuration and generates TypeScript modules 
          for each server. Agents can then:
        </p>
        <ul>
          <li>Import only the tools they need</li>
          <li>Process data in code before returning results</li>
          <li>Use familiar programming constructs</li>
          <li>Keep intermediate results private</li>
        </ul>

        <h2>Usage</h2>
        <p>
          Install the CLI tool and run it against your <code>mcp.config.json</code>:
        </p>
        <pre><code>npm install -g @abmalk/mcpcode
mcpcode generate</code></pre>
        <p>
          This generates a <code>servers/</code> directory with typed functions for each 
          tool. Import and call them directly in your agent code.
        </p>

        <h2>Features</h2>
        <ul>
          <li>STDIO, HTTP, and SSE transport support</li>
          <li>Full TypeScript type inference</li>
          <li>Watch mode for development</li>
          <li>Search utilities for tool discovery</li>
          <li>IDE integration rules for AI coding assistants</li>
        </ul>
      </div>
    </div>
  );
}

