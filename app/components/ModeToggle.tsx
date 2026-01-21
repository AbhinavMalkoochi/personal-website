"use client";

import { useSimulation } from "../context/SimulationContext";

export default function ModeToggle() {
    const { mode, setMode } = useSimulation();

    return (
        <div className="mode-toggle">
            <button
                onClick={() => setMode("off")}
                className={`mode-option ${mode === "off" ? "active" : ""}`}
            >
                Off
            </button>
            <button
                onClick={() => setMode("boids")}
                className={`mode-option ${mode === "boids" ? "active" : ""}`}
            >
                Boids
            </button>
            <button
                onClick={() => setMode("lorenz")}
                className={`mode-option ${mode === "lorenz" ? "active" : ""}`}
            >
                Lorenz
            </button>
            <div
                className="mode-slider"
                style={{
                    left: mode === "off" ? "4px" : mode === "boids" ? "calc(4px + (100% - 8px) / 3)" : "calc(4px + 2 * (100% - 8px) / 3)"
                }}
            />
        </div>
    );
}
