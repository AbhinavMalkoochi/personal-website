"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type AnimationMode = "off" | "boids" | "lorenz";

interface SimulationContextType {
    mode: AnimationMode;
    setMode: (mode: AnimationMode) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
    // Always start with "boids" to match server render
    const [mode, setModeState] = useState<AnimationMode>("boids");

    // Hydrate from localStorage after mount (client-side only)
    useEffect(() => {
        const stored = localStorage.getItem("sim-mode");
        if (stored === "off" || stored === "lorenz") {
            setModeState(stored);
        }
    }, []);

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
