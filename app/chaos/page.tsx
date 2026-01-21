export default function ChaosPage() {
    return (
        <>
            {/* Minimal overlay in bottom-left corner - not blocking the animation */}
            <div className="chaos-overlay animate-in">
                <h2 className="text-sm font-semibold text-white mb-3">Lorenz Attractor</h2>
                <p className="text-xs text-muted mb-4">
                    A chaotic dynamical system. Move your mouse to rotate.
                </p>
                <div className="text-xs font-mono text-muted space-y-1">
                    <p>σ = 10, ρ = 28, β = 8/3</p>
                </div>
            </div>
        </>
    );
}
