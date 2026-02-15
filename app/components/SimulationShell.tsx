"use client";

import { useEffect, type ReactNode } from "react";
import { useSimulation } from "../context/SimulationContext";

export default function SimulationShell({ children }: { children: ReactNode }) {
    const { mode } = useSimulation();

    useEffect(() => {
        document.documentElement.setAttribute("data-sim-mode", mode);
    }, [mode]);

    return <div data-sim-mode={mode}>{children}</div>;
}
