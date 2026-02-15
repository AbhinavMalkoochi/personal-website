"use client";

import type { ReactNode } from "react";
import { useSimulation } from "../context/SimulationContext";

export default function SimulationShell({ children }: { children: ReactNode }) {
    const { mode } = useSimulation();
    return <div data-sim-mode={mode}>{children}</div>;
}
