"use client";

import { useSimulation } from "../context/SimulationContext";
import { useEffect, useState } from "react";

type Mode = "off" | "boids" | "lorenz";

export default function ModeToggle() {
    const { mode, setMode } = useSimulation();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by only rendering dynamic content after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    const getSliderPosition = (m: Mode) => {
        switch (m) {
            case "off": return "4px";
            case "boids": return "calc(4px + (100% - 8px) / 3)";
            case "lorenz": return "calc(4px + 2 * (100% - 8px) / 3)";
        }
    };

    // Use default "boids" for SSR, actual mode after mount
    const displayMode = mounted ? mode : "boids";

    return (
        <div className="mode-toggle">
            <button
                onClick={() => setMode("off")}
                className={`mode-option ${displayMode === "off" ? "active" : ""}`}
            >
                Off
            </button>
            <button
                onClick={() => setMode("boids")}
                className={`mode-option ${displayMode === "boids" ? "active" : ""}`}
            >
                Boids
            </button>
            <button
                onClick={() => setMode("lorenz")}
                className={`mode-option ${displayMode === "lorenz" ? "active" : ""}`}
            >
                Lorenz
            </button>
            <div
                className="mode-slider"
                style={{ left: getSliderPosition(displayMode) }}
            />
        </div>
    );
}
