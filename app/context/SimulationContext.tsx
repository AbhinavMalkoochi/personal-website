"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Mode = "off" | "boids" | "lorenz";

interface SimulationContextType {
    mode: Mode;
    setMode: (mode: Mode) => void;
    isPaused: boolean;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const DEFAULT_MODE: Mode = "boids";

function isValidMode(value: string | null): value is Mode {
    return value === "off" || value === "boids" || value === "lorenz";
}

export function SimulationProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<Mode>(DEFAULT_MODE);

    // Hydrate from localStorage after mount (avoids SSR mismatch)
    useEffect(() => {
        const stored = localStorage.getItem("sim-mode");
        if (isValidMode(stored) && stored !== DEFAULT_MODE) {
            setModeState(stored);
        }
    }, []);

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
