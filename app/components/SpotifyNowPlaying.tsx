"use client";

import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
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

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                const result = await getNowPlaying();
                if (mounted) setData(result);
            } catch {
                if (mounted) setData(null);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, POLL_INTERVAL_MS);
        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [getNowPlaying]);

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
                    <Image
                        src={data.albumArt}
                        alt={data.albumName}
                        width={48}
                        height={48}
                        unoptimized
                    />
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
