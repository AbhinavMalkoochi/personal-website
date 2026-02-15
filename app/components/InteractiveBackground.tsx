"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SimplexNoise } from "@/app/lib/SimplexNoise";
import { useSimulation } from "../context/SimulationContext";

// ============ Page Config ============

interface PageConfig {
    speedMod: number;
    noiseZoom: number;
    verticalBias: number;
}

const PAGE_CONFIGS: Record<string, PageConfig> = {
    "/": { speedMod: 1.0, noiseZoom: 0.05, verticalBias: 0 },
    "/projects": { speedMod: 1.1, noiseZoom: 0.06, verticalBias: 0 },
    "/resume": { speedMod: 0.8, noiseZoom: 0.03, verticalBias: 0 },
    "/blog": { speedMod: 0.7, noiseZoom: 0.04, verticalBias: 0 },
    "/about": { speedMod: 0.6, noiseZoom: 0.03, verticalBias: 0 },
};

function getPageConfig(pathname: string): PageConfig {
    if (PAGE_CONFIGS[pathname]) return PAGE_CONFIGS[pathname];
    for (const key of Object.keys(PAGE_CONFIGS)) {
        if (pathname.startsWith(key) && key !== "/") return PAGE_CONFIGS[key];
    }
    return PAGE_CONFIGS["/"];
}

// ============ Color System ============

const DEFAULT_HUE = 220;

function hashToHue(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return ((hash % 360) + 360) % 360;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h /= 360;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h * 12) % 12;
        return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };
    return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function getParticleColor(hue: number, speed: number): string {
    const norm = Math.min(speed / 3, 1);
    const [r, g, b] = hslToRgb(hue, 0.5 + norm * 0.3, 0.4 + norm * 0.2);
    return `rgba(${r},${g},${b},${0.4 + norm * 0.6})`;
}

// ============ Constants ============

const DESKTOP_PARTICLE_COUNT = 1500;
const TABLET_PARTICLE_COUNT = 900;
const MOBILE_PARTICLE_COUNT = 200;
const DESKTOP_CHAOS_PARTICLE_COUNT = 20;
const MOBILE_CHAOS_PARTICLE_COUNT = 10;
const SCALE = 25;
const LORENZ_SIGMA = 10;
const LORENZ_RHO = 28;
const LORENZ_BETA = 8 / 3;
const LORENZ_DT = 0.005;
const LORENZ_SUBSTEPS = 3;
const LORENZ_TRAIL_LEN = 20;
const PULSE_DURATION_MS = 2000;
const PULSE_SPEED_BOOST = 1.8;

// ============ Particle Types ============

interface FlowParticle {
    x: number; y: number; vx: number; vy: number; baseSpeed: number;
}

interface ChaosParticle {
    x: number; y: number; z: number; hueOffset: number;
    history: { x: number; y: number; z: number }[];
}

interface RendererProfile {
    particleCount: number;
    chaosParticleCount: number;
    lorenzScale: number;
}

function createFlowParticle(w: number, h: number): FlowParticle {
    return { x: Math.random() * w, y: Math.random() * h, vx: 0, vy: 0, baseSpeed: 1 + Math.random() };
}

function createChaosParticle(): ChaosParticle {
    return {
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 40,
        z: 5 + Math.random() * 40,
        hueOffset: Math.random() * 60 - 30,
        history: [],
    };
}

function getRendererProfile(width: number, height: number): RendererProfile {
    const isMobile = width <= 768;
    const isTablet = width > 768 && width <= 1100;
    const shortest = Math.min(width, height);

    if (isMobile) {
        return {
            particleCount: MOBILE_PARTICLE_COUNT,
            chaosParticleCount: MOBILE_CHAOS_PARTICLE_COUNT,
            lorenzScale: Math.max(10, Math.min(16, shortest / 28)),
        };
    }

    if (isTablet) {
        return {
            particleCount: TABLET_PARTICLE_COUNT,
            chaosParticleCount: 14,
            lorenzScale: Math.max(12, Math.min(18, shortest / 34)),
        };
    }

    return {
        particleCount: DESKTOP_PARTICLE_COUNT,
        chaosParticleCount: DESKTOP_CHAOS_PARTICLE_COUNT,
        lorenzScale: Math.max(14, Math.min(22, shortest / 34)),
    };
}

// ============ Particle Physics ============

function updateFlowParticle(
    p: FlowParticle, flowField: number[], cols: number, scale: number,
    config: PageConfig, mouse: { x: number; y: number; active: boolean },
    width: number, height: number,
): void {
    const xCol = Math.max(0, Math.min(Math.floor(p.x / scale), cols - 1));
    const yRow = Math.max(0, Math.min(Math.floor(p.y / scale), Math.floor(height / scale)));
    let angle = flowField[xCol + yRow * cols] || 0;

    if (config.verticalBias > 0) {
        angle = angle * 0.9 + (Math.PI / 2) * 0.1;
    }

    if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 20000) {
            const force = (20000 - distSq) / 20000;
            const mouseAngle = Math.atan2(dy, dx) + Math.PI;
            p.vx += Math.cos(mouseAngle) * 0.2 * force;
            p.vy += Math.sin(mouseAngle) * 0.2 * force;
        }
    }

    p.vx += Math.cos(angle) * 0.1;
    p.vy += Math.sin(angle) * 0.1;
    p.vy += config.verticalBias * 0.05;

    const maxSpeed = p.baseSpeed * config.speedMod;
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
    }

    p.x += p.vx;
    p.y += p.vy;

    if (p.x > width) p.x = 0;
    if (p.x < 0) p.x = width;
    if (p.y > height) p.y = 0;
    if (p.y < 0) p.y = height;
}

function updateChaosParticle(p: ChaosParticle): void {
    for (let i = 0; i < LORENZ_SUBSTEPS; i++) {
        const dx = LORENZ_SIGMA * (p.y - p.x) * LORENZ_DT;
        const dy = (p.x * (LORENZ_RHO - p.z) - p.y) * LORENZ_DT;
        const dz = (p.x * p.y - LORENZ_BETA * p.z) * LORENZ_DT;
        p.x += dx;
        p.y += dy;
        p.z += dz;
    }
    p.history.push({ x: p.x, y: p.y, z: p.z });
    if (p.history.length > LORENZ_TRAIL_LEN) p.history.shift();
}

// ============ Lorenz Rendering ============
// Each frame draws only the short bright "head" of each trail.
// The canvas clear (rgba overlay) naturally fades previous frames,
// creating long ghostly tails without storing or re-drawing old points.

function drawChaosParticle(
    ctx: CanvasRenderingContext2D, p: ChaosParticle,
    cosR: number, sinR: number, cx: number, cy: number, baseHue: number, lorenzScale: number,
): void {
    const hue = (baseHue + p.hueOffset + 360) % 360;
    const len = p.history.length;
    if (len < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = `hsla(${hue}, 85%, 65%, 0.7)`;
    ctx.lineWidth = 2;

    for (let i = 0; i < len; i++) {
        const pt = p.history[i];
        const rx = pt.x * cosR - pt.z * sinR;
        const rz = pt.x * sinR + pt.z * cosR;
        const px = cx + rx * lorenzScale;
        const py = cy - pt.y * lorenzScale + rz * 0.3;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Bright head dot
    const head = p.history[len - 1];
    const hx = cx + (head.x * cosR - head.z * sinR) * lorenzScale;
    const hy = cy - head.y * lorenzScale + (head.x * sinR + head.z * cosR) * 0.3;

    ctx.beginPath();
    ctx.arc(hx, hy, 3, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue}, 95%, 85%, 0.95)`;
    ctx.fill();
}

// ============ Component ============

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pathname = usePathname();
    const { mode, isPaused } = useSimulation();
    const nowPlaying = useQuery(api.spotify.currentlyPlaying);

    // Mutable refs read inside animation loop (no effect restarts needed)
    const pathnameRef = useRef(pathname);
    const nowPlayingRef = useRef(nowPlaying);

    // Keep refs in sync without restarting the animation loop
    useEffect(() => { pathnameRef.current = pathname; }, [pathname]);

    const stateRef = useRef({
        animationId: 0,
        mouse: { x: 0, y: 0, active: false },
        particles: [] as FlowParticle[],
        chaosParticles: [] as ChaosParticle[],
        flowField: [] as number[],
        zOffset: 0,
        dimensions: { width: 0, height: 0, cols: 0, rows: 0 },
        profile: getRendererProfile(1440, 900),
        chaosInitialized: false,
        lastTrackName: "",
        pulseUntil: 0,
    });

    // Sync now-playing ref + detect song changes for pulse effect
    useEffect(() => {
        nowPlayingRef.current = nowPlaying;
        const state = stateRef.current;
        const trackName = nowPlaying?.trackName ?? "";
        if (trackName && trackName !== state.lastTrackName && state.lastTrackName !== "") {
            state.pulseUntil = Date.now() + PULSE_DURATION_MS;
        }
        state.lastTrackName = trackName;
    }, [nowPlaying]);

    // Canvas setup (runs once)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const state = stateRef.current;

        const resize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
            state.profile = getRendererProfile(w, h);
            const cols = Math.floor(w / SCALE) + 1;
            const rows = Math.floor(h / SCALE) + 1;
            state.dimensions = { width: w, height: h, cols, rows };
            state.flowField = new Array(cols * rows);
            state.particles = Array.from(
                { length: state.profile.particleCount },
                () => createFlowParticle(w, h),
            );
        };

        const onMouseMove = (e: MouseEvent) => {
            state.mouse = { x: e.clientX, y: e.clientY, active: true };
        };

        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", onMouseMove);
        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    // Lorenz particle initialization
    useEffect(() => {
        const state = stateRef.current;
        if (mode === "lorenz" && !state.chaosInitialized) {
            const { chaosParticleCount } = state.profile;
            state.chaosParticles = Array.from(
                { length: chaosParticleCount },
                () => createChaosParticle(),
            );
            state.chaosInitialized = true;
        } else if (mode !== "lorenz") {
            state.chaosInitialized = false;
        }
    }, [mode]);

    // Main animation loop — depends only on mode/isPaused (not pathname)
    useEffect(() => {
        if (isPaused) {
            const id = stateRef.current.animationId;
            if (id) cancelAnimationFrame(id);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const state = stateRef.current;
        const isLorenz = mode === "lorenz";

        const animate = (timestamp: number) => {
            const { width, height, cols, rows } = state.dimensions;
            const { lorenzScale, chaosParticleCount } = state.profile;
            const track = nowPlayingRef.current;
            const config = getPageConfig(pathnameRef.current);

            // Hue: song-derived when playing, otherwise fixed cool blue
            const hue = track?.trackName ? hashToHue(track.trackName) : DEFAULT_HUE;

            // Pulse speed boost on song change
            const pulseActive = Date.now() < state.pulseUntil;
            const pulseFade = pulseActive ? (state.pulseUntil - Date.now()) / PULSE_DURATION_MS : 0;
            const speedMultiplier = 1 + pulseFade * (PULSE_SPEED_BOOST - 1);

            // Clear with trail effect (slower fade for Lorenz = longer ghostly tails)
            ctx.fillStyle = isLorenz ? "rgba(5,5,5,0.06)" : "rgba(0,0,0,0.15)";
            ctx.fillRect(0, 0, width, height);

            if (isLorenz) {
                const rotY = (state.mouse.x / width) * Math.PI * 2 + timestamp * 0.00015;
                const cosR = Math.cos(rotY);
                const sinR = Math.sin(rotY);
                const cx = width / 2;
                const cy = height / 2;

                for (const p of state.chaosParticles) {
                    updateChaosParticle(p);
                    drawChaosParticle(ctx, p, cosR, sinR, cx, cy, hue, lorenzScale);
                }

                if (Math.random() > 0.98 && state.chaosParticles.length < chaosParticleCount + 6) {
                    state.chaosParticles.push(createChaosParticle());
                }
            } else {
                // Update flow field
                const zoom = config.noiseZoom;
                let yOff = 0;
                for (let y = 0; y < rows; y++) {
                    let xOff = 0;
                    for (let x = 0; x < cols; x++) {
                        state.flowField[x + y * cols] = SimplexNoise.noise2D(xOff, yOff + state.zOffset) * Math.PI * 4;
                        xOff += zoom;
                    }
                    yOff += zoom;
                }
                state.zOffset += 0.003 * config.speedMod * speedMultiplier;

                // Update + draw particles
                for (const p of state.particles) {
                    updateFlowParticle(p, state.flowField, cols, SCALE, config, state.mouse, width, height);
                    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                    ctx.fillStyle = getParticleColor(hue, speed * speedMultiplier);
                    ctx.fillRect(p.x, p.y, 1.5, 1.5);
                }
            }

            state.animationId = requestAnimationFrame(animate);
        };

        state.animationId = requestAnimationFrame(animate);
        return () => { if (state.animationId) cancelAnimationFrame(state.animationId); };
    }, [isPaused, mode]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 z-0 transition-opacity duration-700 ease-in-out ${isPaused ? "opacity-0" : "opacity-100"}`}
            style={{ pointerEvents: "none" }}
        />
    );
}
