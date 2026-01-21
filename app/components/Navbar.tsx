"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSimulation } from "../context/SimulationContext";

const navItems = [
    { name: "Intro", href: "/" },
    { name: "Work", href: "/projects" },
    { name: "About", href: "/about" },
    { name: "Resume", href: "/resume" },
    { name: "Chaos", href: "/chaos" },
];

export default function Navbar() {
    const pathname = usePathname();
    const { isPaused, togglePause } = useSimulation();

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:bg-black/50 hover:border-white/20">
            {/* Navigation Links */}
            <div className="flex items-center gap-1 px-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
              relative px-4 py-2 rounded-full text-xs font-medium transition-all duration-300
              ${isActive(item.href)
                                ? "text-white bg-white/10"
                                : "text-neutral-400 hover:text-white hover:bg-white/5"
                            }
            `}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-white/10 mx-1" />

            {/* Simulation Toggle */}
            <button
                onClick={togglePause}
                className={`
          flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300
          ${isPaused
                        ? "bg-white/5 text-neutral-500 hover:bg-white/10 hover:text-neutral-300"
                        : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300"
                    }
        `}
                title={isPaused ? "Play Simulation" : "Pause Simulation"}
            >
                {isPaused ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                ) : (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                )}
            </button>
        </nav>
    );
}
