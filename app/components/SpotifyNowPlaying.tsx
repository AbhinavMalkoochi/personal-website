"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef } from "react";
import Image from "next/image";

function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function SoundBars() {
    return (
        <div className="absolute bottom-1 right-1 flex items-end gap-0.5 h-3.5 p-1 bg-black/60 backdrop-blur-sm rounded">
            <span className="w-0.5 bg-[#1DB954] rounded-full animate-[soundBar_1.2s_ease-in-out_infinite] h-1/2" />
            <span className="w-0.5 bg-[#1DB954] rounded-full animate-[soundBar_1.2s_ease-in-out_infinite_0.25s] h-full" />
            <span className="w-0.5 bg-[#1DB954] rounded-full animate-[soundBar_1.2s_ease-in-out_infinite_0.5s] h-[70%]" />
        </div>
    );
}

const WIDGET_BASE = `
    fixed bottom-6 left-1/2 -translate-x-1/2 z-50
    flex items-center gap-3 px-4 py-2.5
    bg-white/80 backdrop-blur-xl
    border border-white/50 rounded-2xl
    shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)]
    transition-all duration-300 ease-out
    hover:bg-white/90 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]
    hover:-translate-x-1/2 hover:-translate-y-1
`;

export default function SpotifyNowPlaying() {
    const data = useQuery(api.spotify.currentlyPlaying);
    const timeRef = useRef<HTMLSpanElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);

    // Smooth progress interpolation via requestAnimationFrame
    // Justified: syncing with an external time source (Spotify playback)
    useEffect(() => {
        if (!data?.isPlaying) return;

        let rafId: number;
        const tick = () => {
            const elapsed = Date.now() - data.fetchedAt;
            const current = Math.min(data.progressMs + elapsed, data.durationMs);
            const percent = (current / data.durationMs) * 100;

            if (timeRef.current) timeRef.current.textContent = formatTime(current);
            if (barRef.current) barRef.current.style.width = `${percent}%`;
            if (knobRef.current) knobRef.current.style.left = `calc(${percent}% - 5px)`;

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [data]);

    if (data === undefined) {
        return (
            <div className={WIDGET_BASE}>
                <Image src="/Spotify.png" alt="Spotify" width={18} height={18} className="opacity-80" />
                <span className="text-sm text-gray-500 font-medium">Loading...</span>
            </div>
        );
    }

    if (!data) {
        return (
            <div className={WIDGET_BASE}>
                <Image src="/Spotify.png" alt="Spotify" width={18} height={18} className="opacity-80" />
                <span className="text-sm text-gray-500 font-medium">Not playing</span>
            </div>
        );
    }

    const initialPercent = (data.progressMs / data.durationMs) * 100;

    return (
        <a
            href={data.trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                flex items-center gap-4
                w-[420px] max-w-[calc(100%-32px)] px-4 py-3
                bg-white/80 backdrop-blur-xl
                border border-white/50 rounded-2xl
                shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)]
                transition-all duration-300 ease-out
                hover:bg-white/90 hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)]
                hover:-translate-x-1/2 hover:-translate-y-1
                no-underline text-inherit group
            `}
        >
            {/* Album Art */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-md bg-linear-to-br from-gray-100 to-gray-200">
                {data.albumArt && (
                    <Image
                        src={data.albumArt}
                        alt={data.albumName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized
                    />
                )}
                {data.isPlaying && <SoundBars />}
            </div>

            {/* Track Info + Progress */}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-black truncate leading-tight">
                            {data.trackName}
                        </p>
                        <p className="text-xs text-gray-500 truncate leading-tight">
                            {data.artistName}
                        </p>
                    </div>
                    <Image
                        src="/Spotify.png"
                        alt="Spotify"
                        width={20}
                        height={20}
                        className="opacity-50 group-hover:opacity-80 transition-opacity shrink-0"
                    />
                </div>

                {/* Progress Bar - interpolated via refs */}
                <div className="flex items-center gap-2">
                    <span
                        ref={timeRef}
                        className="text-[10px] font-medium text-gray-400 min-w-[24px] tabular-nums"
                    >
                        {formatTime(data.progressMs)}
                    </span>

                    <div className="flex-1 h-1 bg-black/10 rounded-full relative group/progress">
                        <div
                            ref={barRef}
                            className="h-full bg-linear-to-r from-[#1DB954] to-[#1ed760] rounded-full"
                            style={{ width: `${initialPercent}%` }}
                        />
                        <div
                            ref={knobRef}
                            className="absolute top-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ left: `calc(${initialPercent}% - 5px)`, transform: "translateY(-50%)" }}
                        />
                    </div>

                    <span className="text-[10px] font-medium text-gray-400 min-w-[24px] tabular-nums text-right">
                        {formatTime(data.durationMs)}
                    </span>
                </div>
            </div>
        </a>
    );
}
