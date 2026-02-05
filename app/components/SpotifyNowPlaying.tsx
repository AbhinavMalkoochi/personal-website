"use client";

import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import type { NowPlayingData } from "@/convex/spotify";
import Image from "next/image";

const POLL_INTERVAL_MS = 10_000;

function SoundBars() {
    return (
        <div className="spotify-playing-indicator">
            <span />
            <span />
            <span />
        </div>
    );
}

export default function SpotifyNowPlaying() {
    const getNowPlaying = useAction(api.spotify.getNowPlaying);
    const [data, setData] = useState<NowPlayingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);

    // Simple polling without useCallback/useEffect
    if (!hasFetched) {
        setHasFetched(true);
        getNowPlaying()
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setIsLoading(false));

        // Set up interval
        if (typeof window !== "undefined") {
            setInterval(() => {
                getNowPlaying()
                    .then(setData)
                    .catch(() => setData(null));
            }, POLL_INTERVAL_MS);
        }
    }

    if (isLoading) {
        return (
            <div className="spotify-widget spotify-loading">
                <Image
                    src="/Spotify.png"
                    alt="Spotify"
                    width={20}
                    height={20}
                    className="spotify-icon-img"
                />
                <span className="spotify-placeholder">Loading...</span>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="spotify-widget spotify-idle">
                <Image
                    src="/Spotify.png"
                    alt="Spotify"
                    width={20}
                    height={20}
                    className="spotify-icon-img"
                />
                <span className="spotify-placeholder">Not playing</span>
            </div>
        );
    }

    const progressPercent = (data.progressMs / data.durationMs) * 100;

    return (
        <a
            href={data.trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="spotify-widget spotify-playing"
        >
            <div className="spotify-album-art">
                {data.albumArt && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.albumArt} alt={data.albumName} />
                )}
                {data.isPlaying && <SoundBars />}
            </div>

            <div className="spotify-info">
                <div className="spotify-track-name">{data.trackName}</div>
                <div className="spotify-artist-name">{data.artistName}</div>
                <div className="spotify-progress">
                    <div
                        className="spotify-progress-bar"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            <Image
                src="/Spotify.png"
                alt="Spotify"
                width={18}
                height={18}
                className="spotify-logo-img"
            />
        </a>
    );
}
