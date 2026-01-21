export default function ChaosPage() {
    return (
        <div className="section-wrapper">
            <div className="animate-in">
                <h1 className="hero-title">
                    STRANGE<br />
                    <span className="text-amber-400">ATTRACTORS</span>
                </h1>
            </div>

            <div className="chaos-card mt-12 animate-in delay-1">
                <h2 className="chaos-text font-semibold text-xl mb-4">The Lorenz System</h2>

                <p className="text-gray-300 leading-relaxed mb-6">
                    A system of ordinary differential equations first studied by
                    Edward Lorenz in 1963. It is notable for having chaotic solutions
                    for certain parameter values and initial conditions.
                </p>

                {/* Lorenz Equations */}
                <div className="formula mb-6 space-y-2">
                    <div><code>dx/dt = σ(y - x)</code></div>
                    <div><code>dy/dt = x(ρ - z) - y</code></div>
                    <div><code>dz/dt = xy - βz</code></div>
                </div>

                <div className="text-sm text-muted mb-4">
                    <span className="text-amber-400 font-mono">σ = 10</span> •
                    <span className="text-amber-400 font-mono"> ρ = 28</span> •
                    <span className="text-amber-400 font-mono"> β = 8/3</span>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed">
                    The resulting butterfly shape is a "strange attractor" — trajectories
                    are attracted to it but never repeat. Small changes in initial conditions
                    lead to vastly different outcomes (the butterfly effect).
                </p>
            </div>

            <div className="animate-in delay-2 mt-8 glass-subtle p-6 rounded-lg max-w-md">
                <h3 className="text-amber-400 text-sm uppercase tracking-wider mb-3">Interaction</h3>
                <ul className="text-sm text-muted space-y-2">
                    <li className="flex items-center gap-2">
                        <span className="text-amber-400">◆</span>
                        Move mouse horizontally to rotate the structure in 3D
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-amber-400">◆</span>
                        Watch trajectories emerge and diverge over time
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-amber-400">◆</span>
                        The gold trails trace paths through phase space
                    </li>
                </ul>
            </div>

            {/* Floating Info Card */}
            <div className="info-card animate-in delay-3">
                <h3 className="text-amber-400 text-xs uppercase tracking-wider mb-2">Simulation</h3>
                <div className="text-sm text-muted space-y-1">
                    <div className="flex justify-between">
                        <span>Mode:</span>
                        <span className="text-foreground font-mono">Lorenz Attractor</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Particles:</span>
                        <span className="text-foreground font-mono">30 (3D)</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Trail Length:</span>
                        <span className="text-foreground font-mono">50 points</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
