"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { SimplexNoise } from "@/app/lib/SimplexNoise";
import { useSimulation } from "../context/SimulationContext";

// Page-specific configuration
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

// Flow field particle
class FlowParticle {
    x: number;
    y: number;
    vx: number = 0;
    vy: number = 0;
    baseSpeed: number;

    constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseSpeed = 1 + Math.random();
    }

    update(
        flowField: number[],
        cols: number,
        scale: number,
        config: PageConfig,
        mouse: { x: number; y: number; active: boolean },
        width: number,
        height: number,
        pagePath: string
    ) {
        let xCol = Math.floor(this.x / scale);
        let yRow = Math.floor(this.y / scale);
        xCol = Math.max(0, Math.min(xCol, cols - 1));
        yRow = Math.max(0, Math.min(yRow, Math.floor(height / scale)));

        const index = xCol + yRow * cols;
        let angle = flowField[index] || 0;

        // Vertical bias for resume page
        if (config.verticalBias > 0) {
            const biasStrength = 0.1;
            const target = Math.PI / 2;
            angle = angle * (1 - biasStrength) + target * biasStrength;
        }

        // Mouse interaction
        if (mouse.active) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distSq = dx * dx + dy * dy;
            const radius = pagePath === "/projects" ? 40000 : 20000;

            if (distSq < radius) {
                const angleToMouse = Math.atan2(dy, dx);
                const force = (radius - distSq) / radius;

                if (pagePath === "/projects") {
                    angle = angleToMouse;
                    this.vx += Math.cos(angle) * 0.5 * force;
                    this.vy += Math.sin(angle) * 0.5 * force;
                } else {
                    angle = angleToMouse + Math.PI;
                    this.vx += Math.cos(angle) * 0.2 * force;
                    this.vy += Math.sin(angle) * 0.2 * force;
                }
            }
        }

        this.vx += Math.cos(angle) * 0.1;
        this.vy += Math.sin(angle) * 0.1;
        this.vy += config.verticalBias * 0.05;

        // Speed limiting
        const maxSpeed = this.baseSpeed * config.speedMod;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
    }

    draw(ctx: CanvasRenderingContext2D, config: PageConfig) {
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
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
            default: // blue
                r = Math.floor(50 + norm * 100);
                g = Math.floor(50 + norm * 100);
                b = Math.floor(200 + norm * 55);
        }

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.4 + norm * 0.6})`;
        ctx.fillRect(this.x, this.y, 1.5, 1.5);
    }
}

// Lorenz attractor particle
class ChaosParticle {
    x: number;
    y: number;
    z: number;
    hue: number;
    history: { x: number; y: number; z: number }[];

    private static readonly SIGMA = 10;
    private static readonly RHO = 28;
    private static readonly BETA = 8 / 3;

    constructor() {
        this.x = 0.1 + (Math.random() - 0.5) * 0.1;
        this.y = 0;
        this.z = 0;
        this.hue = Math.random() * 60 + 10;
        this.history = [{ x: this.x, y: this.y, z: this.z }];
    }

    update() {
        const dt = 0.006;
        const dx = ChaosParticle.SIGMA * (this.y - this.x) * dt;
        const dy = (this.x * (ChaosParticle.RHO - this.z) - this.y) * dt;
        const dz = (this.x * this.y - ChaosParticle.BETA * this.z) * dt;

        this.x += dx;
        this.y += dy;
        this.z += dz;

        this.history.push({ x: this.x, y: this.y, z: this.z });
        if (this.history.length > 50) this.history.shift();
    }

    draw(ctx: CanvasRenderingContext2D, rotY: number, cx: number, cy: number) {
        const scale = 15;
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${this.hue}, 80%, 60%, 0.5)`;
        ctx.lineWidth = 1;

        for (let i = 0; i < this.history.length; i++) {
            const p = this.history[i];
            const rx = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
            const rz = p.x * Math.sin(rotY) + p.z * Math.cos(rotY);
            const projX = cx + rx * scale;
            const projY = cy - p.y * scale + rz * 0.5;

            if (i === 0) {
                ctx.moveTo(projX, projY);
            } else {
                ctx.lineTo(projX, projY);
            }
        }
        ctx.stroke();
    }
}

const PARTICLE_COUNT = 1500;
const CHAOS_PARTICLE_COUNT = 30;
const SCALE = 25;

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pathname = usePathname();
    const animationRef = useRef<number>(0);
    const mouseRef = useRef({ x: 0, y: 0, active: false });
    const particlesRef = useRef<FlowParticle[]>([]);
    const chaosParticlesRef = useRef<ChaosParticle[]>([]);
    const flowFieldRef = useRef<number[]>([]);
    const zOffRef = useRef(0);
    const dimensionsRef = useRef({ width: 0, height: 0, cols: 0, rows: 0 });
    const { isPaused } = useSimulation();

    const getConfig = useCallback((): PageConfig => {
        if (PAGE_CONFIGS[pathname]) return PAGE_CONFIGS[pathname];
        for (const key of Object.keys(PAGE_CONFIGS)) {
            if (pathname.startsWith(key) && key !== "/") return PAGE_CONFIGS[key];
        }
        return PAGE_CONFIGS["/"];
    }, [pathname]);

    // Initialize
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            const cols = Math.floor(width / SCALE) + 1;
            const rows = Math.floor(height / SCALE) + 1;

            dimensionsRef.current = { width, height, cols, rows };
            flowFieldRef.current = new Array(cols * rows);

            particlesRef.current = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particlesRef.current.push(new FlowParticle(width, height));
            }
        };

        resize();
        window.addEventListener("resize", resize);

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    // Initialize chaos particles
    useEffect(() => {
        if (pathname === "/chaos") {
            chaosParticlesRef.current = [];
            for (let i = 0; i < CHAOS_PARTICLE_COUNT; i++) {
                setTimeout(() => {
                    if (pathname === "/chaos") {
                        chaosParticlesRef.current.push(new ChaosParticle());
                    }
                }, i * 50);
            }
        }
    }, [pathname]);

    // Animation loop
    useEffect(() => {
        if (isPaused) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const animate = (timestamp: number) => {
            const { width, height, cols, rows } = dimensionsRef.current;
            const config = getConfig();

            ctx.fillStyle = pathname === "/chaos"
                ? "rgba(5, 5, 5, 0.15)"
                : "rgba(0, 0, 0, 0.2)";
            ctx.fillRect(0, 0, width, height);

            if (pathname === "/chaos") {
                const rotY = (mouseRef.current.x / width) * Math.PI * 4 + timestamp * 0.0002;
                const cx = width / 2;
                const cy = height / 2;

                chaosParticlesRef.current.forEach((p) => {
                    p.update();
                    p.draw(ctx, rotY, cx, cy);
                });

                if (Math.random() > 0.97 && chaosParticlesRef.current.length < 50) {
                    chaosParticlesRef.current.push(new ChaosParticle());
                }
            } else {
                const zoom = config.noiseZoom;
                let yOff = 0;

                for (let y = 0; y < rows; y++) {
                    let xOff = 0;
                    for (let x = 0; x < cols; x++) {
                        const index = x + y * cols;
                        const angle = SimplexNoise.noise2D(xOff, yOff + zOffRef.current) * Math.PI * 4;
                        flowFieldRef.current[index] = angle;
                        xOff += zoom;
                    }
                    yOff += zoom;
                }
                zOffRef.current += 0.003 * config.speedMod;

                particlesRef.current.forEach((p) => {
                    p.update(
                        flowFieldRef.current,
                        cols,
                        SCALE,
                        config,
                        mouseRef.current,
                        width,
                        height,
                        pathname
                    );
                    p.draw(ctx, config);
                });
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [pathname, getConfig, isPaused]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 z-0 transition-opacity duration-700 ease-in-out ${isPaused ? 'opacity-0' : 'opacity-100'}`}
            style={{ pointerEvents: "none" }}
        />
    );
}
