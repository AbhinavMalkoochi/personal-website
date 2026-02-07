"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Mode = "off" | "boids" | "lorenz";

interface SimulationContextType {
    mode: Mode;
    setMode: (mode: Mode) => void;
    isPaused: boolean;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

function readStoredMode(): Mode {
    if (typeof window === "undefined") return "boids";
    const stored = localStorage.getItem("sim-mode");
    return stored === "off" || stored === "boids" || stored === "lorenz" ? stored : "boids";
}

export function SimulationProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<Mode>(readStoredMode);

    // Sync mode to HTML element for CSS-driven color adaptation
    useEffect(() => {
        document.documentElement.dataset.simMode = mode;
    }, [mode]);

    const setMode = (newMode: Mode) => {
        localStorage.setItem("sim-mode", newMode);
        setModeState(newMode);
    };

    return (
        <SimulationContext.Provider value={{ mode, setMode, isPaused: mode === "off" }}>
            {children}
        </SimulationContext.Provider>
    );
}

export function useSimulation() {
    const context = useContext(SimulationContext);
    if (!context) throw new Error("useSimulation must be used within SimulationProvider");
    return context;
}
