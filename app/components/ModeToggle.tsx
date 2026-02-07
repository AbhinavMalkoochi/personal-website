"use client";

import { useSimulation, type Mode } from "../context/SimulationContext";

const SLIDER_POSITIONS: Record<Mode, string> = {
    off: "4px",
    boids: "calc(4px + (100% - 8px) / 3)",
    lorenz: "calc(4px + 2 * (100% - 8px) / 3)",
};

const MODES: Mode[] = ["off", "boids", "lorenz"];

export default function ModeToggle() {
    const { mode, setMode } = useSimulation();

    return (
        <div className="mode-toggle">
            {MODES.map((m) => (
                <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`mode-option ${mode === m ? "active" : ""}`}
                >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
            ))}
            <div className="mode-slider" style={{ left: SLIDER_POSITIONS[mode] }} />
        </div>
    );
}
