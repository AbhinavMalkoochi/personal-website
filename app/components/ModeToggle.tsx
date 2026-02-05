"use client";

import { useSimulation } from "../context/SimulationContext";

type Mode = "off" | "boids" | "lorenz";

export default function ModeToggle() {
    const { mode, setMode } = useSimulation();

    const getSliderPosition = (m: Mode) => {
        switch (m) {
            case "off": return "4px";
            case "boids": return "calc(4px + (100% - 8px) / 3)";
            case "lorenz": return "calc(4px + 2 * (100% - 8px) / 3)";
        }
    };

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
                style={{ left: getSliderPosition(mode) }}
            />
        </div>
    );
}
