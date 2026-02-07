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

// ============ Dynamic Color System ============

function hashToHue(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return ((hash % 360) + 360) % 360;
}

function getTimeOfDayHue(): number {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 30 + ((hour - 6) / 6) * 30;   // morning: amber
    if (hour >= 12 && hour < 17) return 200 + ((hour - 12) / 5) * 40; // afternoon: blue
    if (hour >= 17 && hour < 21) return 280 + ((hour - 17) / 4) * 50; // evening: purple
    const nightHour = hour >= 21 ? hour - 21 : hour + 3;
    return 220 + (nightHour / 9) * 40;                                 // night: deep blue
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

const PARTICLE_COUNT = 1500;
const CHAOS_PARTICLE_COUNT = 30;
const SCALE = 25;
const LORENZ_SIGMA = 10;
const LORENZ_RHO = 28;
const LORENZ_BETA = 8 / 3;
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

function createFlowParticle(w: number, h: number): FlowParticle {
    return { x: Math.random() * w, y: Math.random() * h, vx: 0, vy: 0, baseSpeed: 1 + Math.random() };
}

function createChaosParticle(): ChaosParticle {
    return {
        x: 0.1 + (Math.random() - 0.5) * 0.1, y: 0, z: 0,
        hueOffset: Math.random() * 60 - 30, history: [],
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
    const dt = 0.006;
    p.x += LORENZ_SIGMA * (p.y - p.x) * dt;
    p.y += (p.x * (LORENZ_RHO - p.z) - p.y) * dt;
    p.z += (p.x * p.y - LORENZ_BETA * p.z) * dt;
    p.history.push({ x: p.x, y: p.y, z: p.z });
    if (p.history.length > 50) p.history.shift();
}

function drawChaosParticle(
    ctx: CanvasRenderingContext2D, p: ChaosParticle,
    rotY: number, cx: number, cy: number, baseHue: number,
): void {
    const hue = (baseHue + p.hueOffset + 360) % 360;
    ctx.beginPath();
    ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.5)`;
    ctx.lineWidth = 1;

    for (let i = 0; i < p.history.length; i++) {
        const pt = p.history[i];
        const rx = pt.x * Math.cos(rotY) - pt.z * Math.sin(rotY);
        const rz = pt.x * Math.sin(rotY) + pt.z * Math.cos(rotY);
        const px = cx + rx * 15;
        const py = cy - pt.y * 15 + rz * 0.5;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();
}

// ============ Component ============

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pathname = usePathname();
    const { mode, isPaused } = useSimulation();
    const nowPlaying = useQuery(api.spotify.currentlyPlaying);

    const stateRef = useRef({
        animationId: 0,
        mouse: { x: 0, y: 0, active: false },
        particles: [] as FlowParticle[],
        chaosParticles: [] as ChaosParticle[],
        flowField: [] as number[],
        zOffset: 0,
        dimensions: { width: 0, height: 0, cols: 0, rows: 0 },
        chaosInitialized: false,
        lastTrackName: "",
        pulseUntil: 0,
        baseHue: getTimeOfDayHue(),
    });

    // Store latest now-playing in ref for animation loop access + detect song changes
    const nowPlayingRef = useRef(nowPlaying);
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
            const cols = Math.floor(w / SCALE) + 1;
            const rows = Math.floor(h / SCALE) + 1;
            state.dimensions = { width: w, height: h, cols, rows };
            state.flowField = new Array(cols * rows);
            state.particles = Array.from({ length: PARTICLE_COUNT }, () => createFlowParticle(w, h));
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
            state.chaosParticles = [];
            state.chaosInitialized = true;
            for (let i = 0; i < CHAOS_PARTICLE_COUNT; i++) {
                setTimeout(() => state.chaosParticles.push(createChaosParticle()), i * 50);
            }
        } else if (mode !== "lorenz") {
            state.chaosInitialized = false;
        }
    }, [mode]);

    // Main animation loop
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
        const config = getPageConfig(pathname);

        const animate = (timestamp: number) => {
            const { width, height, cols, rows } = state.dimensions;
            const track = nowPlayingRef.current;

            // Dynamic hue: song overrides time-of-day
            const hue = track?.trackName ? hashToHue(track.trackName) : state.baseHue;

            // Pulse: boost speed on song change
            const pulseActive = Date.now() < state.pulseUntil;
            const pulseFade = pulseActive
                ? (state.pulseUntil - Date.now()) / PULSE_DURATION_MS
                : 0;
            const speedMultiplier = 1 + pulseFade * (PULSE_SPEED_BOOST - 1);

            // Clear with trail effect
            ctx.fillStyle = isLorenz ? "rgba(5,5,5,0.15)" : "rgba(0,0,0,0.2)";
            ctx.fillRect(0, 0, width, height);

            if (isLorenz) {
                const rotY = (state.mouse.x / width) * Math.PI * 4 + timestamp * 0.0002;
                const cx = width / 2;
                const cy = height / 2;

                for (const p of state.chaosParticles) {
                    updateChaosParticle(p);
                    drawChaosParticle(ctx, p, rotY, cx, cy, hue);
                }

                if (Math.random() > 0.97 && state.chaosParticles.length < 50) {
                    state.chaosParticles.push(createChaosParticle());
                }
            } else {
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
    }, [pathname, isPaused, mode]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 z-0 transition-opacity duration-700 ease-in-out ${isPaused ? "opacity-0" : "opacity-100"}`}
            style={{ pointerEvents: "none" }}
        />
    );
}
