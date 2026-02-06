"use client";

import { createContext, useContext, useSyncExternalStore, useCallback, type ReactNode } from "react";

type Mode = "off" | "boids" | "lorenz";

interface SimulationContextType {
    mode: Mode;
    setMode: (mode: Mode) => void;
    isPaused: boolean;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

function getStoredMode(): Mode {
    if (typeof window === "undefined") return "boids";
    const stored = localStorage.getItem("sim-mode");
    if (stored === "off" || stored === "boids" || stored === "lorenz") return stored;
    return "boids";
}

function subscribe(callback: () => void): () => void {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
}

function getServerSnapshot(): Mode {
    return "boids";
}

export function SimulationProvider({ children }: { children: ReactNode }) {
    const mode = useSyncExternalStore(subscribe, getStoredMode, getServerSnapshot);

    const setMode = useCallback((newMode: Mode) => {
        localStorage.setItem("sim-mode", newMode);
        // Dispatch storage event to trigger re-render
        window.dispatchEvent(new StorageEvent("storage", { key: "sim-mode", newValue: newMode }));
    }, []);

    const isPaused = mode === "off";

    return (
        <SimulationContext.Provider value={{ mode, setMode, isPaused }}>
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
