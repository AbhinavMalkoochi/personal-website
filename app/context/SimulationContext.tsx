"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SimulationContextType {
    isPaused: boolean;
    togglePause: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
    const [isPaused, setIsPaused] = useState(false);

    // Optional: Persist preference
    useEffect(() => {
        const saved = localStorage.getItem("sim-paused");
        if (saved) setIsPaused(saved === "true");
    }, []);

    const togglePause = () => {
        setIsPaused((prev) => {
            const newState = !prev;
            localStorage.setItem("sim-paused", String(newState));
            return newState;
        });
    };

    return (
        <SimulationContext.Provider value={{ isPaused, togglePause }}>
            {children}
        </SimulationContext.Provider>
    );
}

export function useSimulation() {
    const context = useContext(SimulationContext);
    if (context === undefined) {
        throw new Error("useSimulation must be used within a SimulationProvider");
    }
    return context;
}
