"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

export type Mode = "off" | "boids" | "lorenz";

interface SimulationContextType {
    mode: Mode;
    setMode: (mode: Mode) => void;
    isPaused: boolean;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const DEFAULT_MODE: Mode = "boids";
const STORAGE_KEY = "sim-mode";
const MODE_EVENT = "sim-mode-change";

function isValidMode(value: string | null): value is Mode {
    return value === "off" || value === "boids" || value === "lorenz";
}

export function SimulationProvider({ children }: { children: ReactNode }) {
    const mode = useSyncExternalStore(
        (onStoreChange) => {
            window.addEventListener("storage", onStoreChange);
            window.addEventListener(MODE_EVENT, onStoreChange);
            return () => {
                window.removeEventListener("storage", onStoreChange);
                window.removeEventListener(MODE_EVENT, onStoreChange);
            };
        },
        () => {
            const stored = localStorage.getItem(STORAGE_KEY);
            return isValidMode(stored) ? stored : DEFAULT_MODE;
        },
        () => DEFAULT_MODE,
    );

    const setMode = (newMode: Mode) => {
        localStorage.setItem(STORAGE_KEY, newMode);
        window.dispatchEvent(new Event(MODE_EVENT));
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
