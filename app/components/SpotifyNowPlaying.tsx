"use client";

import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { X, Music } from "lucide-react";

function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
}

const STORAGE_KEY = "spotify-widget-hidden";
const VISIBILITY_EVENT = "spotify-widget-visibility";
const POLL_INTERVAL_MS = 10_000;

function subscribeVisibility(onStoreChange: () => void) {
    window.addEventListener("storage", onStoreChange);
    window.addEventListener(VISIBILITY_EVENT, onStoreChange);
    return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(VISIBILITY_EVENT, onStoreChange);
    };
}

const getHiddenSnapshot = () => localStorage.getItem(STORAGE_KEY) === "1";

const setHidden = (nextHidden: boolean) => {
    localStorage.setItem(STORAGE_KEY, nextHidden ? "1" : "0");
    window.dispatchEvent(new Event(VISIBILITY_EVENT));
};

function SoundBars() {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="flex items-end gap-0.5 h-4">
                <div className="w-0.5 bg-[#1DB954] rounded-full animate-[soundBar_1.2s_ease-in-out_infinite] h-1/2" />
                <div className="w-0.5 bg-[#1DB954] rounded-full animate-[soundBar_1.2s_ease-in-out_infinite_0.25s] h-full" />
                <div className="w-0.5 bg-[#1DB954] rounded-full animate-[soundBar_1.2s_ease-in-out_infinite_0.5s] h-[70%]" />
            </div>
        </div>
    );
}

export default function SpotifyNowPlaying() {
    const data = useQuery(api.spotify.currentlyPlaying);
    const ensureFresh = useAction(api.spotify.ensureFreshNowPlaying);
    const timeRef = useRef<HTMLSpanElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const isHidden = useSyncExternalStore(subscribeVisibility, getHiddenSnapshot, () => false);

    // Stable 10s polling interval + refresh on mount and tab re-focus
    useEffect(() => {
        const refresh = () => {
            if (document.visibilityState === "visible") {
                ensureFresh().catch(() => {});
            }
        };

        refresh();

        const intervalId = setInterval(refresh, POLL_INTERVAL_MS);

        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") refresh();
        };
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, [ensureFresh]);

    // Predictive fetch: fire right when the current song should end
    useEffect(() => {
        if (!data?.isPlaying || !data.durationMs) return;

        const elapsed = Date.now() - data.fetchedAt;
        const estimatedProgress = data.progressMs + elapsed;
        const msRemaining = data.durationMs - estimatedProgress;

        if (msRemaining <= 0 || msRemaining > 600_000) return;

        const timeoutId = setTimeout(() => {
            ensureFresh().catch(() => {});
        }, msRemaining + 1_000);

        return () => clearTimeout(timeoutId);
    }, [data, ensureFresh]);

    // Smooth progress bar via requestAnimationFrame
    useEffect(() => {
        if (!data?.isPlaying) {
            if (timeRef.current && data) timeRef.current.textContent = formatTime(data.progressMs);
            if (barRef.current && data) {
                const pct = data.durationMs > 0 ? (data.progressMs / data.durationMs) * 100 : 0;
                barRef.current.style.width = `${pct}%`;
            }
            return;
        }

        let rafId: number;
        const startedAt = Date.now();
        const baseProgress = data.progressMs;
        const duration = data.durationMs;

        const tick = () => {
            const elapsed = Math.max(0, Date.now() - startedAt);
            const current = Math.min(baseProgress + elapsed, duration);
            const percent = duration > 0 ? (current / duration) * 100 : 0;

            if (timeRef.current) timeRef.current.textContent = formatTime(current);
            if (barRef.current) barRef.current.style.width = `${percent}%`;

            rafId = requestAnimationFrame(tick);
        };

        tick();
        return () => cancelAnimationFrame(rafId);
    }, [data]);

    if (isHidden) {
        return (
            <button
                onClick={() => setHidden(false)}
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 px-5 py-2.5 bg-white border border-gray-200 rounded-full shadow-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2"
            >
                <div className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
                Show Player
            </button>
        );
    }

    if (!data) return null;

    const initialPercent = data.durationMs > 0
        ? (data.progressMs / data.durationMs) * 100
        : 0;

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 left-4 sm:left-auto z-50 group">
            <div className="relative w-full sm:w-[320px] bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-3 sm:p-4 transition-all duration-300">

                <button
                    onClick={() => setHidden(true)}
                    className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:text-gray-500 active:scale-90"
                >
                    <X size={14} />
                </button>

                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 shadow-sm bg-gray-50 border border-black/5">
                        {data.albumArt ? (
                            <Image
                                src={data.albumArt}
                                alt="Album Art"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : data.isPlaying ? (
                            <SoundBars />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Music size={20} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="mb-2">
                            <h3 className="text-sm font-bold text-gray-900 truncate leading-tight">
                                {data.trackName || "Not Playing"}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <p className="text-xs font-medium text-gray-500 truncate">
                                    {data.artistName || "Spotify"}
                                </p>
                                {data.trackUrl && (
                                    <a
                                        href={data.trackUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="shrink-0 hover:brightness-110 transition-all"
                                    >
                                        <Image src="/Spotify.png" alt="Spotify" width={12} height={12} className="opacity-80" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="relative h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    ref={barRef}
                                    style={{ width: `${initialPercent}%` }}
                                    className="absolute h-full bg-[#1DB954] transition-all duration-300 ease-linear"
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-medium text-gray-400 tabular-nums">
                                <span ref={timeRef}>{formatTime(data.progressMs || 0)}</span>
                                <span>{formatTime(data.durationMs)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
