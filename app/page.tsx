import Link from "next/link";

export default function Home() {
  return (
    <div className="section-wrapper">
      {/* Hero Section */}
      <div className="animate-in">
        <h1 className="hero-title">
          DESIGN<br />
          THROUGH<br />
          <span className="glow-text">CALCULUS</span>
        </h1>

        <div className="hero-subtitle animate-in delay-1">
          <p>
            CS student at <strong>UT Dallas</strong>, graduating December 2025.
            Founding engineer at two startups. Building at the intersection of
            <span className="text-accent"> AI</span>,
            <span className="text-accent"> mathematics</span>, and
            <span className="text-accent"> elegant code</span>.
          </p>
        </div>
      </div>

      {/* Math Formula Display */}
      <div className="animate-in delay-2 mt-16 max-w-xl">
        <div className="glass-subtle p-6 rounded-lg">
          <div className="text-xs uppercase tracking-widest text-muted mb-3 font-mono">
            Perlin Noise • Flow Field Generation
          </div>
          <div className="formula">
            <code>
              f(x,y,t) = Σ (1/2ⁿ) · noise(2ⁿx, 2ⁿy, t)
            </code>
          </div>
          <p className="text-sm text-muted mt-4 leading-relaxed">
            The particles flowing behind this page follow a noise-based vector field,
            creating organic, fluid motion that responds to your cursor.
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="animate-in delay-3 mt-16">
        <div className="text-xs uppercase tracking-widest text-muted mb-6 font-mono">
          Navigate
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/projects" className="glass-card hover:glow-border">
            <h3 className="text-lg font-medium">Projects →</h3>
            <p className="text-sm text-muted mt-1">mcpcode, browser-agent, and more</p>
          </Link>
          <Link href="/chaos" className="glass-card hover:glow-border border-amber-500/20">
            <h3 className="text-lg font-medium text-amber-400">Chaos →</h3>
            <p className="text-sm text-muted mt-1">Lorenz attractor visualization</p>
          </Link>
        </div>
      </div>

      {/* Floating Status Card */}
      <div className="info-card animate-in delay-4">
        <h3 className="text-accent text-xs uppercase tracking-wider mb-2">Simulation</h3>
        <div className="text-sm text-muted space-y-1">
          <div className="flex justify-between">
            <span>Mode:</span>
            <span className="text-foreground font-mono">Flow Field</span>
          </div>
          <div className="flex justify-between">
            <span>Particles:</span>
            <span className="text-foreground font-mono">1,500</span>
          </div>
        </div>
      </div>
    </div>
  );
}
