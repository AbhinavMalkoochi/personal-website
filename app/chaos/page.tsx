export default function ChaosPage() {
    return (
        <div className="section-wrapper h-screen flex flex-col justify-end pb-24 pointer-events-none">
            {/* Content strictly at bottom to avoid blocking animation */}
            <div className="animate-reveal pointer-events-auto max-w-md mx-auto text-center backdrop-blur-sm bg-black/30 p-6 rounded-lg border border-white/5">
                <h1 className="font-serif text-3xl italic text-white mb-2">Lorenz System</h1>
                <p className="text-neutral-400 text-sm font-sans mb-4">
                    A chaotic system of ordinary differential equations.
                    <br />
                    <span className="text-amber-400 text-xs uppercase tracking-widest mt-2 block">
                        Drag to Rotate
                    </span>
                </p>

                <div className="flex justify-center gap-6 text-xs font-mono text-neutral-600">
                    <span>σ = 10</span>
                    <span>ρ = 28</span>
                    <span>β = 8/3</span>
                </div>
            </div>
        </div>
    );
}
