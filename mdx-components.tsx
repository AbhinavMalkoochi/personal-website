import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1 className="text-4xl font-semibold tracking-tight mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl font-medium mt-6 mb-3">{children}</h3>
        ),
        p: ({ children }) => (
            <p className="text-lg leading-relaxed text-foreground font-light mb-4">{children}</p>
        ),
        ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4">{children}</ol>
        ),
        li: ({ children }) => (
            <li className="text-lg leading-relaxed text-foreground font-light">{children}</li>
        ),
        a: ({ href, children }) => (
            <a href={href} className="text-accent underline hover:opacity-70 transition-opacity">{children}</a>
        ),
        code: ({ children }) => (
            <code className="bg-subtle px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
        ),
        pre: ({ children }) => (
            <pre className="bg-subtle p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-border pl-4 italic text-muted mb-4">{children}</blockquote>
        ),
        ...components,
    }
}
