"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef, useSyncExternalStore } from "react";
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
    fixed right-4 z-40
    flex items-center gap-3 px-4 py-2.5
    bg-white/90 backdrop-blur-xl
    border border-white/60 rounded-2xl
    shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)]
    transition-all duration-300 ease-out
    hover:bg-white/95 hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]
    hover:-translate-y-1
`;

const STORAGE_KEY = "spotify-widget-hidden";
const VISIBILITY_EVENT = "spotify-widget-visibility";
const WIDGET_BOTTOM_STYLE = { bottom: "calc(16px + env(safe-area-inset-bottom))" };

function subscribeVisibility(onStoreChange: () => void) {
    window.addEventListener("storage", onStoreChange);
    window.addEventListener(VISIBILITY_EVENT, onStoreChange);
    return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(VISIBILITY_EVENT, onStoreChange);
    };
}

function getHiddenSnapshot() {
    return localStorage.getItem(STORAGE_KEY) === "1";
}

function setHidden(nextHidden: boolean) {
    localStorage.setItem(STORAGE_KEY, nextHidden ? "1" : "0");
    window.dispatchEvent(new Event(VISIBILITY_EVENT));
}

export default function SpotifyNowPlaying() {
    const data = useQuery(api.spotify.currentlyPlaying);
    const timeRef = useRef<HTMLSpanElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);
    const isHidden = useSyncExternalStore(subscribeVisibility, getHiddenSnapshot, () => false);

    const safeData = data
        ? {
            ...data,
            progressMs: Math.max(0, data.progressMs),
            durationMs: Math.max(0, data.durationMs),
            trackUrl: data.trackUrl ?? null,
            fetchedAt: Math.max(0, data.fetchedAt),
        }
        : null;

    const showAsPlaying = Boolean(safeData?.isPlaying);

    // Smooth progress interpolation via requestAnimationFrame
    // Justified: syncing with an external time source (Spotify playback)
    useEffect(() => {
        if (!showAsPlaying || !data) return;
        const fetchedAt = Math.max(0, data.fetchedAt);
        const progressMs = Math.max(0, data.progressMs);
        const durationMs = Math.max(0, data.durationMs);

        let rafId: number;
        const tick = () => {
            const elapsed = Math.max(0, Date.now() - fetchedAt);
            const current = Math.min(progressMs + elapsed, durationMs);
            const percent = durationMs > 0
                ? Math.max(0, Math.min(100, (current / durationMs) * 100))
                : 0;

            if (timeRef.current) timeRef.current.textContent = formatTime(current);
            if (barRef.current) barRef.current.style.width = `${percent}%`;
            if (knobRef.current) knobRef.current.style.left = `calc(${percent}% - 5px)`;

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [data, showAsPlaying]);

    if (isHidden) {
        return (
            <button
                type="button"
                onClick={() => {
                    setHidden(false);
                }}
                className="
                    fixed right-4 z-40 rounded-full px-3 py-2
                    bg-white/90 border border-white/60 shadow-lg
                    text-xs font-semibold text-gray-700 hover:bg-white
                    transition-colors
                "
                style={WIDGET_BOTTOM_STYLE}
            >
                Show song
            </button>
        );
    }

    if (data === undefined) {
        return (
            <div className={WIDGET_BASE} style={WIDGET_BOTTOM_STYLE}>
                <Image src="/Spotify.png" alt="Spotify" width={18} height={18} className="opacity-80" />
                <span className="text-sm text-gray-600 font-semibold">Loading...</span>
            </div>
        );
    }

    if (!safeData) {
        return (
            <div className={WIDGET_BASE} style={WIDGET_BOTTOM_STYLE}>
                <Image src="/Spotify.png" alt="Spotify" width={18} height={18} className="opacity-80" />
                <button
                    type="button"
                    className="text-xs text-gray-500 font-semibold hover:text-gray-700"
                    onClick={() => {
                        setHidden(true);
                    }}
                >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
                <span className="text-sm text-gray-600 font-semibold">Spotify idle</span>
            </div>
        );
    }

    const initialPercent = safeData.durationMs > 0
        ? Math.max(0, Math.min(100, (safeData.progressMs / safeData.durationMs) * 100))
        : 0;

    const body = (
        <>


            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-md bg-linear-to-br from-gray-100 to-gray-200">
                {safeData.albumArt && (
                    <Image
                        src={safeData.albumArt}
                        alt={safeData.albumName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized
                    />
                )}
                {showAsPlaying && <SoundBars />}
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <p className="text-base font-bold text-gray-900 truncate leading-tight">
                            {safeData.trackName}
                        </p>
                        <p className="text-sm text-gray-600 truncate leading-tight">
                            {safeData.artistName}
                        </p>
                    </div>
                    <Image
                        src="/Spotify.png"
                        alt="Spotify"
                        width={20}
                        height={20}
                        className="opacity-60 group-hover:opacity-90 transition-opacity shrink-0"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span
                        ref={timeRef}
                        className="text-xs font-semibold text-gray-500 min-w-[28px] tabular-nums"
                    >
                        {formatTime(safeData.progressMs)}
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

                    <span className="text-xs font-semibold text-gray-500 min-w-[28px] tabular-nums text-right">
                        {formatTime(safeData.durationMs)}
                    </span>
                </div>

                <p className="text-[11px] font-semibold text-gray-500">
                    {showAsPlaying ? "Now playing" : "Last played"}
                </p>
            </div>
            <div className="shrink-0 self-start">
                <button
                    type="button"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full text-gray-500 hover:text-gray-700 hover:bg-black/5"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setHidden(true);
                    }}
                    aria-label="Hide Spotify widget"
                >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </>
    );

    return (
        <div
            className={`
                fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                flex items-center gap-4
                w-[420px] max-w-[calc(100vw-24px)] px-4 py-3
                bg-white/90 backdrop-blur-xl
                border border-white/60 rounded-2xl
                shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)]
                transition-all duration-300 ease-out
                hover:bg-white/95 hover:shadow-[0_16px_48px_rgba(0,0,0,0.18)]
                hover:-translate-x-1/2 hover:-translate-y-1
                no-underline text-inherit group
                sm:left-auto sm:translate-x-0 sm:hover:translate-x-0 sm:right-4
            `}
            style={WIDGET_BOTTOM_STYLE}
        >
            {safeData.trackUrl ? (
                <a
                    href={safeData.trackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contents"
                >
                    {body}
                </a>
            ) : (
                body
            )}
        </div>
    );
}
