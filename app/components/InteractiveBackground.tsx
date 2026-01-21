"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SimplexNoise } from "@/app/lib/SimplexNoise";
import { useSimulation } from "../context/SimulationContext";

interface PageConfig {
    speedMod: number;
    noiseZoom: number;
    verticalBias: number;
    colorBase: "blue" | "gold" | "cyan" | "white" | "chaos";
}

const PAGE_CONFIGS: Record<string, PageConfig> = {
    "/": { speedMod: 1.0, noiseZoom: 0.05, verticalBias: 0, colorBase: "blue" },
    "/projects": { speedMod: 1.8, noiseZoom: 0.1, verticalBias: 0, colorBase: "gold" },
    "/resume": { speedMod: 0.8, noiseZoom: 0.02, verticalBias: 2.0, colorBase: "cyan" },
    "/blog": { speedMod: 0.6, noiseZoom: 0.03, verticalBias: 0, colorBase: "white" },
    "/chaos": { speedMod: 0, noiseZoom: 0, verticalBias: 0, colorBase: "chaos" },
    "/about": { speedMod: 0.5, noiseZoom: 0.01, verticalBias: 0, colorBase: "white" },
};

const DEFAULT_CONFIG = PAGE_CONFIGS["/"];

function getPageConfig(pathname: string): PageConfig {
    if (PAGE_CONFIGS[pathname]) return PAGE_CONFIGS[pathname];
    for (const key of Object.keys(PAGE_CONFIGS)) {
        if (pathname.startsWith(key) && key !== "/") return PAGE_CONFIGS[key];
    }
    return DEFAULT_CONFIG;
}

function getParticleColor(config: PageConfig, speed: number): { r: number; g: number; b: number; a: number } {
    const norm = Math.min(speed / 3, 1);
    let r: number, g: number, b: number;

    switch (config.colorBase) {
        case "gold":
            r = 255;
            g = 215;
            b = Math.floor(norm * 100);
            break;
        case "cyan":
            r = 0;
            g = Math.floor(200 + norm * 55);
            b = 255;
            break;
        case "white":
            r = g = b = 200;
            break;
        default:
            r = Math.floor(50 + norm * 100);
            g = Math.floor(50 + norm * 100);
            b = Math.floor(200 + norm * 55);
    }

    return { r, g, b, a: 0.4 + norm * 0.6 };
}

const PARTICLE_COUNT = 1500;
const CHAOS_PARTICLE_COUNT = 30;
const SCALE = 25;
const LORENZ_SIGMA = 10;
const LORENZ_RHO = 28;
const LORENZ_BETA = 8 / 3;

interface FlowParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseSpeed: number;
}

interface ChaosParticle {
    x: number;
    y: number;
    z: number;
    hue: number;
    history: { x: number; y: number; z: number }[];
}

function createFlowParticle(width: number, height: number): FlowParticle {
    return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        baseSpeed: 1 + Math.random(),
    };
}

function createChaosParticle(): ChaosParticle {
    return {
        x: 0.1 + (Math.random() - 0.5) * 0.1,
        y: 0,
        z: 0,
        hue: Math.random() * 60 + 10,
        history: [],
    };
}

function updateFlowParticle(
    p: FlowParticle,
    flowField: number[],
    cols: number,
    scale: number,
    config: PageConfig,
    mouse: { x: number; y: number; active: boolean },
    width: number,
    height: number,
    isProjectsPage: boolean
): void {
    const xCol = Math.max(0, Math.min(Math.floor(p.x / scale), cols - 1));
    const yRow = Math.max(0, Math.min(Math.floor(p.y / scale), Math.floor(height / scale)));

    const index = xCol + yRow * cols;
    let angle = flowField[index] || 0;

    if (config.verticalBias > 0) {
        const biasStrength = 0.1;
        const target = Math.PI / 2;
        angle = angle * (1 - biasStrength) + target * biasStrength;
    }

    if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        const radius = isProjectsPage ? 40000 : 20000;

        if (distSq < radius) {
            const angleToMouse = Math.atan2(dy, dx);
            const force = (radius - distSq) / radius;

            if (isProjectsPage) {
                angle = angleToMouse;
                p.vx += Math.cos(angle) * 0.5 * force;
                p.vy += Math.sin(angle) * 0.5 * force;
            } else {
                angle = angleToMouse + Math.PI;
                p.vx += Math.cos(angle) * 0.2 * force;
                p.vy += Math.sin(angle) * 0.2 * force;
            }
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
    const dx = LORENZ_SIGMA * (p.y - p.x) * dt;
    const dy = (p.x * (LORENZ_RHO - p.z) - p.y) * dt;
    const dz = (p.x * p.y - LORENZ_BETA * p.z) * dt;

    p.x += dx;
    p.y += dy;
    p.z += dz;

    p.history.push({ x: p.x, y: p.y, z: p.z });
    if (p.history.length > 50) p.history.shift();
}

function drawChaosParticle(
    ctx: CanvasRenderingContext2D,
    p: ChaosParticle,
    rotY: number,
    cx: number,
    cy: number
): void {
    const scale = 15;
    ctx.beginPath();
    ctx.strokeStyle = `hsla(${p.hue}, 80%, 60%, 0.5)`;
    ctx.lineWidth = 1;

    for (let i = 0; i < p.history.length; i++) {
        const pt = p.history[i];
        const rx = pt.x * Math.cos(rotY) - pt.z * Math.sin(rotY);
        const rz = pt.x * Math.sin(rotY) + pt.z * Math.cos(rotY);
        const projX = cx + rx * scale;
        const projY = cy - pt.y * scale + rz * 0.5;

        if (i === 0) {
            ctx.moveTo(projX, projY);
        } else {
            ctx.lineTo(projX, projY);
        }
    }
    ctx.stroke();
}

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pathname = usePathname();
    const { isPaused } = useSimulation();
    
    const stateRef = useRef({
        animationId: 0,
        mouse: { x: 0, y: 0, active: false },
        particles: [] as FlowParticle[],
        chaosParticles: [] as ChaosParticle[],
        flowField: [] as number[],
        zOffset: 0,
        dimensions: { width: 0, height: 0, cols: 0, rows: 0 },
        chaosInitialized: false,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const state = stateRef.current;

        const resize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            const cols = Math.floor(width / SCALE) + 1;
            const rows = Math.floor(height / SCALE) + 1;

            state.dimensions = { width, height, cols, rows };
            state.flowField = new Array(cols * rows);
            state.particles = Array.from({ length: PARTICLE_COUNT }, () => createFlowParticle(width, height));
        };

        const handleMouseMove = (e: MouseEvent) => {
            state.mouse = { x: e.clientX, y: e.clientY, active: true };
        };

        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const state = stateRef.current;
        const isChaosPage = pathname === "/chaos";

        if (isChaosPage && !state.chaosInitialized) {
            state.chaosParticles = [];
            state.chaosInitialized = true;
            
            for (let i = 0; i < CHAOS_PARTICLE_COUNT; i++) {
                setTimeout(() => {
                    if (pathname === "/chaos") {
                        state.chaosParticles.push(createChaosParticle());
                    }
                }, i * 50);
            }
        } else if (!isChaosPage) {
            state.chaosInitialized = false;
        }
    }, [pathname]);

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
        const isChaosPage = pathname === "/chaos";
        const isProjectsPage = pathname === "/projects";
        const config = getPageConfig(pathname);

        const animate = (timestamp: number) => {
            const { width, height, cols, rows } = state.dimensions;

            ctx.fillStyle = isChaosPage ? "rgba(5, 5, 5, 0.15)" : "rgba(0, 0, 0, 0.2)";
            ctx.fillRect(0, 0, width, height);

            if (isChaosPage) {
                const rotY = (state.mouse.x / width) * Math.PI * 4 + timestamp * 0.0002;
                const cx = width / 2;
                const cy = height / 2;

                for (const p of state.chaosParticles) {
                    updateChaosParticle(p);
                    drawChaosParticle(ctx, p, rotY, cx, cy);
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
                        const index = x + y * cols;
                        const angle = SimplexNoise.noise2D(xOff, yOff + state.zOffset) * Math.PI * 4;
                        state.flowField[index] = angle;
                        xOff += zoom;
                    }
                    yOff += zoom;
                }
                state.zOffset += 0.003 * config.speedMod;

                for (const p of state.particles) {
                    updateFlowParticle(p, state.flowField, cols, SCALE, config, state.mouse, width, height, isProjectsPage);
                    
                    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                    const color = getParticleColor(config, speed);
                    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
                    ctx.fillRect(p.x, p.y, 1.5, 1.5);
                }
            }

            state.animationId = requestAnimationFrame(animate);
        };

        state.animationId = requestAnimationFrame(animate);

        return () => {
            if (state.animationId) {
                cancelAnimationFrame(state.animationId);
            }
        };
    }, [pathname, isPaused]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 z-0 transition-opacity duration-700 ease-in-out ${isPaused ? "opacity-0" : "opacity-100"}`}
            style={{ pointerEvents: "none" }}
        />
    );
}
