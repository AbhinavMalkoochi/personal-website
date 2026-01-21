export default function ChaosPage() {
    return (
        <div className="section-wrapper items-center justify-center">
            <div className="animate-in text-center mb-8">
                <h1 className="section-title mb-4">Lorenz System</h1>
                <p className="text-body max-w-md mx-auto">
                    A chaotic system of differential equations.
                    <br />
                    <span className="text-sm text-neutral-500">Interact to rotate.</span>
                </p>
            </div>

            <div className="animate-in delay-1 max-w-lg w-full">
                <div className="glass p-8 rounded-3xl backdrop-blur-xl border border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Equations</h3>
                            <div className="font-mono text-xs text-neutral-400 space-y-2">
                                <p>dx/dt = σ(y - x)</p>
                                <p>dy/dt = x(ρ - z) - y</p>
                                <p>dz/dt = xy - βz</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Simulation</h3>
                            <div className="text-xs text-neutral-400 space-y-2">
                                <div className="flex justify-between">
                                    <span>σ (Sigma)</span>
                                    <span className="text-white">10</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>ρ (Rho)</span>
                                    <span className="text-white">28</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>β (Beta)</span>
                                    <span className="text-white">8/3</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-xs text-neutral-600">
                            Butterfly Effect: Sensitive dependence on initial conditions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
