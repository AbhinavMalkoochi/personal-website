"use client";

import { createContext, useContext, useState, useSyncExternalStore, useCallback, type ReactNode } from "react";

interface SimulationContextType {
    isPaused: boolean;
    togglePause: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

function getStoredPausedState(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sim-paused") === "true";
}

function subscribe(callback: () => void): () => void {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
}

function getServerSnapshot(): boolean {
    return false;
}

export function SimulationProvider({ children }: { children: ReactNode }) {
    const storedValue = useSyncExternalStore(subscribe, getStoredPausedState, getServerSnapshot);
    const [localPaused, setLocalPaused] = useState(false);
    const [hasLocalOverride, setHasLocalOverride] = useState(false);

    const isPaused = hasLocalOverride ? localPaused : storedValue;

    const togglePause = useCallback(() => {
        const newState = !isPaused;
        localStorage.setItem("sim-paused", String(newState));
        setLocalPaused(newState);
        setHasLocalOverride(true);
    }, [isPaused]);

    return (
        <SimulationContext.Provider value={{ isPaused, togglePause }}>
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
