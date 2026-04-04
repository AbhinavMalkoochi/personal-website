"use client";

import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useSyncExternalStore } from "react";
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
const POLL_INTERVAL_MS = 5_000;

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
    const [now, setNow] = useState(() => Date.now());
    const isHidden = useSyncExternalStore(subscribeVisibility, getHiddenSnapshot, () => false);

    // Simple polling + refresh on mount/tab focus.
    useEffect(() => {
        const refresh = () => {
            if (document.visibilityState === "visible") {
                ensureFresh().catch(console.warn);
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

    useEffect(() => {
        if (!data?.isPlaying) return;

        const intervalId = window.setInterval(() => {
            setNow(Date.now());
        }, 1_000);

        return () => window.clearInterval(intervalId);
    }, [data?.isPlaying]);

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

    const progressMs = data.isPlaying
        ? Math.min(data.durationMs, data.progressMs + Math.max(0, now - data.fetchedAt))
        : 0;
    const progressPercent = data.durationMs > 0
        ? (progressMs / data.durationMs) * 100
        : 0;
    const title = data.isPlaying ? data.trackName : "Not Playing";
    const subtitle = data.isPlaying ? data.artistName : "Spotify";
    const trackUrl = data.isPlaying ? data.trackUrl : null;

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
                        {data.isPlaying && data.albumArt ? (
                            <Image
                                src={data.albumArt}
                                alt="Album Art"
                                fill
                                sizes="(max-width: 640px) 48px, 56px"
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
                                {title}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <p className="text-xs font-medium text-gray-500 truncate">
                                    {subtitle}
                                </p>
                                {trackUrl && (
                                    <a
                                        href={trackUrl}
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
                                    style={{ width: `${progressPercent}%` }}
                                    className="absolute h-full bg-[#1DB954] transition-all duration-300 ease-linear"
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-medium text-gray-400 tabular-nums">
                                <span>{formatTime(progressMs)}</span>
                                <span>{formatTime(data.durationMs)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
