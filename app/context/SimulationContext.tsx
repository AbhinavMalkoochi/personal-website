"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type AnimationMode = "off" | "boids" | "lorenz";

interface SimulationContextType {
    mode: AnimationMode;
    setMode: (mode: AnimationMode) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

function getInitialMode(): AnimationMode {
    if (typeof window === "undefined") return "boids";
    const stored = localStorage.getItem("sim-mode");
    if (stored === "off" || stored === "lorenz") return stored;
    return "boids";
}

export function SimulationProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<AnimationMode>(getInitialMode);

    const setMode = (newMode: AnimationMode) => {
        localStorage.setItem("sim-mode", newMode);
        setModeState(newMode);
    };

    return (
        <SimulationContext.Provider value={{ mode, setMode }}>
            {children}
        </SimulationContext.Provider>
    );
}

export function useSimulation() {
    const context = useContext(SimulationContext);
    if (!context) {
        throw new Error("useSimulation must be used within SimulationProvider");
    }
    return context;
}
