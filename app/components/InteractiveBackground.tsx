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

const PARTICLE_COUNT = 1500;
const CHAOS_PARTICLE_COUNT = 30;
const SCALE = 25;
const LORENZ_SIGMA = 10;
const LORENZ_RHO = 28;
const LORENZ_BETA = 8 / 3;
const LORENZ_DT = 0.005;
const LORENZ_SUBSTEPS = 5;
const LORENZ_HISTORY = 300;
const LORENZ_SCALE = 10;
const PULSE_DURATION_MS = 2000;
const PULSE_SPEED_BOOST = 1.8;
const CONNECT_RADIUS = 100;
const CONNECT_RADIUS_SQ = CONNECT_RADIUS * CONNECT_RADIUS;
const MOUSE_GLOW_RADIUS = 200;

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
        x: (Math.random() - 0.5) * 30,
        y: (Math.random() - 0.5) * 40,
        z: 5 + Math.random() * 40,
        hueOffset: Math.random() * 60 - 30,
        history: [],
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
    if (p.history.length > LORENZ_HISTORY) p.history.shift();
}

// ============ Lorenz Rendering ============

function drawChaosParticle(
    ctx: CanvasRenderingContext2D, p: ChaosParticle,
    rotY: number, cx: number, cy: number, baseHue: number,
): void {
    const hue = (baseHue + p.hueOffset + 360) % 360;
    const len = p.history.length;
    if (len < 2) return;

    const cosR = Math.cos(rotY);
    const sinR = Math.sin(rotY);

    // Draw trail in 3 fading segments for gradient effect
    const third = Math.floor(len / 3);
    const segments = [
        { start: 0, end: third, alpha: 0.12, width: 0.6 },
        { start: third, end: third * 2, alpha: 0.35, width: 1.0 },
        { start: third * 2, end: len, alpha: 0.6, width: 1.5 },
    ];

    for (const seg of segments) {
        if (seg.end <= seg.start) continue;
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${seg.alpha})`;
        ctx.lineWidth = seg.width;

        for (let i = seg.start; i < seg.end; i++) {
            const pt = p.history[i];
            const rx = pt.x * cosR - pt.z * sinR;
            const rz = pt.x * sinR + pt.z * cosR;
            const px = cx + rx * LORENZ_SCALE;
            const py = cy - pt.y * LORENZ_SCALE + rz * 0.3;
            if (i === seg.start) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }

    // Bright head dot
    const head = p.history[len - 1];
    const hx = cx + (head.x * cosR - head.z * sinR) * LORENZ_SCALE;
    const hy = cy - head.y * LORENZ_SCALE + (head.x * sinR + head.z * cosR) * 0.3;

    ctx.beginPath();
    ctx.arc(hx, hy, 2, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue}, 90%, 80%, 0.9)`;
    ctx.fill();
}

// ============ Boid Connection Lines ============

function drawConnections(
    ctx: CanvasRenderingContext2D,
    particles: FlowParticle[],
    width: number, height: number,
    hue: number,
): void {
    const cellSize = CONNECT_RADIUS;
    const gridCols = Math.ceil(width / cellSize) + 1;
    const gridRows = Math.ceil(height / cellSize) + 1;
    const gridSize = gridCols * gridRows;
    const n = particles.length;

    // Counting sort into spatial grid
    const counts = new Uint16Array(gridSize);
    for (let i = 0; i < n; i++) {
        const gx = Math.min(Math.floor(particles[i].x / cellSize), gridCols - 1);
        const gy = Math.min(Math.floor(particles[i].y / cellSize), gridRows - 1);
        counts[gx + gy * gridCols]++;
    }

    const offsets = new Uint32Array(gridSize);
    for (let i = 1; i < gridSize; i++) offsets[i] = offsets[i - 1] + counts[i - 1];

    const sorted = new Uint16Array(n);
    const pos = new Uint32Array(gridSize);
    for (let i = 0; i < gridSize; i++) pos[i] = offsets[i];

    for (let i = 0; i < n; i++) {
        const gx = Math.min(Math.floor(particles[i].x / cellSize), gridCols - 1);
        const gy = Math.min(Math.floor(particles[i].y / cellSize), gridRows - 1);
        const cell = gx + gy * gridCols;
        sorted[pos[cell]++] = i;
    }

    // Batch all connection lines into one path
    const [r, g, b] = hslToRgb(hue, 0.6, 0.5);
    ctx.strokeStyle = `rgba(${r},${g},${b},0.04)`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    for (let gy = 0; gy < gridRows; gy++) {
        for (let gx = 0; gx < gridCols; gx++) {
            const cell = gx + gy * gridCols;
            const cStart = offsets[cell];
            const cEnd = cStart + counts[cell];

            for (let a = cStart; a < cEnd; a++) {
                const i = sorted[a];
                const pi = particles[i];

                // Check all 9 neighboring cells, skip duplicates via j > i
                for (let ny = Math.max(0, gy - 1); ny <= Math.min(gy + 1, gridRows - 1); ny++) {
                    for (let nx = Math.max(0, gx - 1); nx <= Math.min(gx + 1, gridCols - 1); nx++) {
                        const nCell = nx + ny * gridCols;
                        const nStart = offsets[nCell];
                        const nEnd = nStart + counts[nCell];

                        for (let bIdx = nStart; bIdx < nEnd; bIdx++) {
                            const j = sorted[bIdx];
                            if (j <= i) continue;
                            const pj = particles[j];
                            const dx = pi.x - pj.x;
                            const dy = pi.y - pj.y;
                            if (dx * dx + dy * dy < CONNECT_RADIUS_SQ) {
                                ctx.moveTo(pi.x, pi.y);
                                ctx.lineTo(pj.x, pj.y);
                            }
                        }
                    }
                }
            }
        }
    }

    ctx.stroke();
}

// ============ Mouse Glow ============

function drawMouseGlow(
    ctx: CanvasRenderingContext2D,
    mouse: { x: number; y: number; active: boolean },
    hue: number,
): void {
    if (!mouse.active) return;
    const [r, g, b] = hslToRgb(hue, 0.6, 0.5);
    const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, MOUSE_GLOW_RADIUS,
    );
    gradient.addColorStop(0, `rgba(${r},${g},${b},0.08)`);
    gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(
        mouse.x - MOUSE_GLOW_RADIUS, mouse.y - MOUSE_GLOW_RADIUS,
        MOUSE_GLOW_RADIUS * 2, MOUSE_GLOW_RADIUS * 2,
    );
}

// ============ Component ============

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pathname = usePathname();
    const { mode, isPaused } = useSimulation();
    const nowPlaying = useQuery(api.spotify.currentlyPlaying);

    // Mutable refs read inside animation loop (no effect restarts needed)
    const pathnameRef = useRef(pathname);
    pathnameRef.current = pathname;

    const nowPlayingRef = useRef(nowPlaying);

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
            const track = nowPlayingRef.current;
            const config = getPageConfig(pathnameRef.current);

            // Hue: song-derived when playing, otherwise fixed cool blue
            const hue = track?.trackName ? hashToHue(track.trackName) : DEFAULT_HUE;

            // Pulse speed boost on song change
            const pulseActive = Date.now() < state.pulseUntil;
            const pulseFade = pulseActive ? (state.pulseUntil - Date.now()) / PULSE_DURATION_MS : 0;
            const speedMultiplier = 1 + pulseFade * (PULSE_SPEED_BOOST - 1);

            // Clear with trail effect
            ctx.fillStyle = isLorenz ? "rgba(5,5,5,0.12)" : "rgba(0,0,0,0.15)";
            ctx.fillRect(0, 0, width, height);

            if (isLorenz) {
                const rotY = (state.mouse.x / width) * Math.PI * 2 + timestamp * 0.00015;
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

                // Constellation connection lines
                drawConnections(ctx, state.particles, width, height, hue);
            }

            // Mouse glow
            drawMouseGlow(ctx, state.mouse, hue);

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
