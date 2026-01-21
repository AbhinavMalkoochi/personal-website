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
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 animate-reveal">
            {/* Gallery Label Style Nav */}
            <div className="flex items-center gap-6 px-8 py-3 bg-black/80 backdrop-blur-md rounded-sm border border-white/10 shadow-2xl">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
              nav-label transition-all duration-300
              ${isActive(item.href) ? "text-amber-400 active scale-110" : "text-neutral-400 hover:text-white"}
            `}
                    >
                        {item.name}
                    </Link>
                ))}

                <div className="w-px h-3 bg-white/20 mx-2" />

                <button
                    onClick={togglePause}
                    className="text-neutral-500 hover:text-amber-400 transition-colors"
                    title={isPaused ? "Play" : "Pause"}
                >
                    {isPaused ? "▶" : "⏸"}
                </button>
            </div>
        </nav>
    );
}
