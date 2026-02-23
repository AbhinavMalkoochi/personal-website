"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef, useSyncExternalStore, useMemo } from "react";
import Image from "next/image";
import { X, Music } from "lucide-react";

// --- Helpers ---
function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
}

const STORAGE_KEY = "spotify-widget-hidden";
const VISIBILITY_EVENT = "spotify-widget-visibility";
const VIEWER_SESSION_STORAGE_KEY = "spotify-viewer-session-id";

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

function getOrCreateViewerSessionId(): string {
    const existing = localStorage.getItem(VIEWER_SESSION_STORAGE_KEY);
    if (existing) return existing;

    const nextId = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(VIEWER_SESSION_STORAGE_KEY, nextId);
    return nextId;
}

// --- Sub-components ---
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

// --- Main Component ---
export default function SpotifyNowPlaying() {
    const data = useQuery(api.spotify.currentlyPlaying);
    const ensureFreshNowPlaying = useAction(api.spotify.ensureFreshNowPlaying);
    const reportViewerPresence = useMutation(api.spotify.reportViewerPresence);
    const timeRef = useRef<HTMLSpanElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const viewerSessionRef = useRef<string | null>(null);
    const refreshInFlightRef = useRef(false);
    const lastRefreshAttemptRef = useRef(0);
    const snapshotRef = useRef(safeData);
    const isHidden = useSyncExternalStore(subscribeVisibility, getHiddenSnapshot, () => false);
    const safeData = useMemo(() => {
        if (!data) return null;
        return {
            ...data,
            progressMs: Math.max(0, data.progressMs),
            durationMs: Math.max(0, data.durationMs),
            trackUrl: data.trackUrl ?? null,
            fetchedAt: Math.max(0, data.fetchedAt),
        };
    }, [data]);
    const isPlaying = Boolean(safeData?.isPlaying);

    useEffect(() => {
        snapshotRef.current = safeData;
    }, [safeData]);

    useEffect(() => {
        if (!viewerSessionRef.current) {
            viewerSessionRef.current = getOrCreateViewerSessionId();
        }

        const reportPresence = () => {
            if (document.visibilityState !== "visible" || !viewerSessionRef.current) {
                return;
            }

            void reportViewerPresence({ sessionId: viewerSessionRef.current }).catch(() => {
                // Presence should be best-effort and never block rendering.
            });
        };

        const refresh = (force: boolean) => {
            const now = Date.now();
            if (refreshInFlightRef.current) return;
            if (!force && now - lastRefreshAttemptRef.current < 5000) return;

            const snapshot = snapshotRef.current;
            if (!force && snapshot) {
                const staleAfterMs = snapshot.isPlaying ? 15_000 : 120_000;
                if (now - snapshot.fetchedAt < staleAfterMs) {
                    return;
                }
            }

            lastRefreshAttemptRef.current = now;
            refreshInFlightRef.current = true;
            void ensureFreshNowPlaying().catch(() => {
                // Ignore transient action failures; the safety cron continues to backfill.
            }).finally(() => {
                refreshInFlightRef.current = false;
            });
        };

        const onVisible = () => {
            if (document.visibilityState === "visible") {
                reportPresence();
                refresh(true);
            }
        };

        const intervalMs = isPlaying ? 20_000 : 90_000;

        reportPresence();
        refresh(true);

        const presenceIntervalId = window.setInterval(() => {
            reportPresence();
        }, 60_000);

        document.addEventListener("visibilitychange", onVisible);
        window.addEventListener("focus", onVisible);

        const intervalId = window.setInterval(() => {
            if (document.visibilityState === "visible") {
                refresh(false);
            }
        }, intervalMs);

        return () => {
            document.removeEventListener("visibilitychange", onVisible);
            window.removeEventListener("focus", onVisible);
            window.clearInterval(intervalId);
            window.clearInterval(presenceIntervalId);
        };
    }, [ensureFreshNowPlaying, isPlaying, reportViewerPresence]);

    useEffect(() => {
        if (!isPlaying || !safeData) return;
        let rafId: number;

        const tick = () => {
            const elapsed = Math.max(0, Date.now() - safeData.fetchedAt);
            const current = Math.min(safeData.progressMs + elapsed, safeData.durationMs);
            const percent = safeData.durationMs > 0 ? (current / safeData.durationMs) * 100 : 0;

            if (timeRef.current) timeRef.current.textContent = formatTime(current);
            if (barRef.current) barRef.current.style.width = `${percent}%`;

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [safeData, isPlaying]);

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

    const initialPercent = safeData && safeData.durationMs > 0
        ? (safeData.progressMs / safeData.durationMs) * 100
        : 0;

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 left-4 sm:left-auto z-50 group">
            <div className="relative w-full sm:w-[320px] bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-3 sm:p-4 transition-all duration-300">

                {/* Close Button — always visible on touch, hover-reveal on desktop */}
                <button
                    onClick={() => setHidden(true)}
                    className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:text-gray-500 active:scale-90"
                >
                    <X size={14} />
                </button>

                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Artwork */}
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 shadow-sm bg-gray-50 border border-black/5">
                        {safeData?.albumArt ? (
                            <Image
                                src={safeData.albumArt}
                                alt="Album Art"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            isPlaying ? <SoundBars /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><Music size={20} /></div>
                        )}
                    </div>

                    {/* Metadata Content */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-2">
                            <h3 className="text-sm font-bold text-gray-900 truncate leading-tight">
                                {safeData?.trackName || "Not Playing"}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <p className="text-xs font-medium text-gray-500 truncate">
                                    {safeData?.artistName || "Spotify"}
                                </p>
                                {safeData?.trackUrl && (
                                    <a
                                        href={safeData.trackUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="shrink-0 hover:brightness-110 transition-all"
                                    >
                                        <Image src="/Spotify.png" alt="Spotify" width={12} height={12} className="opacity-80" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-1">
                            <div className="relative h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    ref={barRef}
                                    style={{ width: `${initialPercent}%` }}
                                    className="absolute h-full bg-[#1DB954] transition-all duration-300 ease-linear"
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-medium text-gray-400 tabular-nums">
                                <span ref={timeRef}>{formatTime(safeData?.progressMs || 0)}</span>
                                <span>{safeData ? formatTime(safeData.durationMs) : "0:00"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}