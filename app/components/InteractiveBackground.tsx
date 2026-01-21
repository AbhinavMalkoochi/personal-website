"use client";

import { useLayoutEffect, useRef } from "react";
import { SimplexNoise } from "@/app/lib/SimplexNoise";
import { useSimulation } from "../context/SimulationContext";

const PARTICLE_COUNT = 500;
const SCALE = 25;

// Lorenz attractor constants
const LORENZ_SIGMA = 10;
const LORENZ_RHO = 28;
const LORENZ_BETA = 8 / 3;

interface FlowParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseSpeed: number;
    opacity: number;
}

interface ChaosParticle {
    x: number;
    y: number;
    z: number;
    history: { x: number; y: number; z: number }[];
}

interface LorenzCluster {
    cx: number;
    cy: number;
    scale: number;
    rotOffset: number;
    particles: ChaosParticle[];
    isHovered: boolean;
}

interface AnimationState {
    animationId: number;
    mouse: { x: number; y: number; active: boolean };
    particles: FlowParticle[];
    lorenzClusters: LorenzCluster[];
    flowField: number[];
    zOffset: number;
    dimensions: { width: number; height: number; cols: number; rows: number };
}

// Pure factory functions
const createFlowParticle = (width: number, height: number): FlowParticle => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: 0,
    vy: 0,
    baseSpeed: 0.8 + Math.random() * 0.5,
    opacity: 0.12 + Math.random() * 0.18,
});

const createChaosParticle = (): ChaosParticle => ({
    x: 0.1 + (Math.random() - 0.5) * 0.3,
    y: (Math.random() - 0.5) * 0.3,
    z: (Math.random() - 0.5) * 0.3,
    history: [],
});

const createLorenzCluster = (cx: number, cy: number, scale: number): LorenzCluster => ({
    cx,
    cy,
    scale,
    rotOffset: Math.random() * Math.PI * 2,
    particles: Array.from({ length: 8 }, createChaosParticle),
    isHovered: false,
});

// Pure update functions (mutate in place for performance)
const updateFlowParticle = (
    p: FlowParticle,
    flowField: number[],
    cols: number,
    scale: number,
    mouse: { x: number; y: number; active: boolean },
    width: number,
    height: number
): void => {
    const xCol = Math.max(0, Math.min(Math.floor(p.x / scale), cols - 1));
    const yRow = Math.max(0, Math.min(Math.floor(p.y / scale), Math.floor(height / scale)));
    const index = xCol + yRow * cols;
    let angle = flowField[index] || 0;

    // Mouse repulsion
    if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        const radius = 12000;

        if (distSq < radius) {
            const angleToMouse = Math.atan2(dy, dx);
            const force = (radius - distSq) / radius;
            angle = angleToMouse + Math.PI;
            p.vx += Math.cos(angle) * 0.12 * force;
            p.vy += Math.sin(angle) * 0.12 * force;
        }
    }

    p.vx += Math.cos(angle) * 0.06;
    p.vy += Math.sin(angle) * 0.06;
    p.vx *= 0.97;
    p.vy *= 0.97;

    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (speed > p.baseSpeed) {
        p.vx = (p.vx / speed) * p.baseSpeed;
        p.vy = (p.vy / speed) * p.baseSpeed;
    }

    p.x += p.vx;
    p.y += p.vy;

    // Wrap around edges
    if (p.x > width) p.x = 0;
    if (p.x < 0) p.x = width;
    if (p.y > height) p.y = 0;
    if (p.y < 0) p.y = height;
};

const updateChaosParticle = (p: ChaosParticle, speed: number = 1): void => {
    const dt = 0.004 * speed;
    const dx = LORENZ_SIGMA * (p.y - p.x) * dt;
    const dy = (p.x * (LORENZ_RHO - p.z) - p.y) * dt;
    const dz = (p.x * p.y - LORENZ_BETA * p.z) * dt;

    p.x += dx;
    p.y += dy;
    p.z += dz;

    p.history.push({ x: p.x, y: p.y, z: p.z });
    if (p.history.length > 50) p.history.shift();
};

const drawChaosParticle = (
    ctx: CanvasRenderingContext2D,
    p: ChaosParticle,
    rotY: number,
    cx: number,
    cy: number,
    scale: number,
    opacity: number
): void => {
    if (p.history.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
    ctx.lineWidth = 1;

    for (let i = 0; i < p.history.length; i++) {
        const pt = p.history[i];
        const rx = pt.x * Math.cos(rotY) - pt.z * Math.sin(rotY);
        const rz = pt.x * Math.sin(rotY) + pt.z * Math.cos(rotY);
        const projX = cx + rx * scale;
        const projY = cy - pt.y * scale + rz * 0.3;

        if (i === 0) {
            ctx.moveTo(projX, projY);
        } else {
            ctx.lineTo(projX, projY);
        }
    }
    ctx.stroke();
};

// Animation renderers
const renderBoids = (ctx: CanvasRenderingContext2D, state: AnimationState): void => {
    const { width, height, cols, rows } = state.dimensions;
    const zoom = 0.025;

    // Update flow field
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const index = x + y * cols;
            const xOff = x * zoom;
            const yOff = y * zoom + state.zOffset;
            state.flowField[index] = SimplexNoise.noise2D(xOff, yOff) * Math.PI * 4;
        }
    }
    state.zOffset += 0.0015;

    // Update and draw particles
    for (const p of state.particles) {
        updateFlowParticle(p, state.flowField, cols, SCALE, state.mouse, width, height);
        ctx.fillStyle = `rgba(0, 0, 0, ${p.opacity})`;
        ctx.fillRect(p.x, p.y, 1.5, 1.5);
    }
};

const renderLorenz = (ctx: CanvasRenderingContext2D, state: AnimationState, timestamp: number): void => {
    const { width, height } = state.dimensions;

    for (const cluster of state.lorenzClusters) {
        const clusterX = cluster.cx * width;
        const clusterY = cluster.cy * height;

        // Check hover distance
        const dx = state.mouse.x - clusterX;
        const dy = state.mouse.y - clusterY;
        cluster.isHovered = state.mouse.active && Math.sqrt(dx * dx + dy * dy) < 120;

        // Calculate rotation with mouse influence
        let rotY = timestamp * 0.0003 + cluster.rotOffset;
        if (cluster.isHovered) {
            rotY += (state.mouse.x / width - 0.5) * Math.PI;
        }

        const scale = cluster.isHovered ? cluster.scale * 2.5 : cluster.scale * 2;
        const opacity = cluster.isHovered ? 0.18 : 0.12;
        const speed = cluster.isHovered ? 1.5 : 1.0;

        for (const p of cluster.particles) {
            updateChaosParticle(p, speed);
            drawChaosParticle(ctx, p, rotY, clusterX, clusterY, scale, opacity);
        }

        // Add particles on hover
        if (cluster.isHovered && Math.random() > 0.97 && cluster.particles.length < 15) {
            cluster.particles.push(createChaosParticle());
        }
    }
};

const initializeState = (width: number, height: number): Partial<AnimationState> => {
    const cols = Math.floor(width / SCALE) + 1;
    const rows = Math.floor(height / SCALE) + 1;

    return {
        dimensions: { width, height, cols, rows },
        flowField: new Array(cols * rows),
        particles: Array.from({ length: PARTICLE_COUNT }, () => createFlowParticle(width, height)),
        lorenzClusters: [
            createLorenzCluster(0.15, 0.25, 4),
            createLorenzCluster(0.85, 0.20, 5),
            createLorenzCluster(0.75, 0.70, 4),
            createLorenzCluster(0.20, 0.80, 3),
            createLorenzCluster(0.50, 0.50, 3),
        ],
    };
};

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { mode } = useSimulation();
    const modeRef = useRef(mode);
    modeRef.current = mode;

    const stateRef = useRef<AnimationState>({
        animationId: 0,
        mouse: { x: 0, y: 0, active: false },
        particles: [],
        lorenzClusters: [],
        flowField: [],
        zOffset: 0,
        dimensions: { width: 0, height: 0, cols: 0, rows: 0 },
    });

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const state = stateRef.current;

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            Object.assign(state, initializeState(width, height));
        };

        const handleMouseMove = (e: MouseEvent) => {
            state.mouse = { x: e.clientX, y: e.clientY, active: true };
        };

        const animate = (timestamp: number) => {
            const { width, height } = state.dimensions;
            const currentMode = modeRef.current;

            // Clear canvas
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            ctx.fillRect(0, 0, width, height);

            // Render based on mode
            if (currentMode === "boids") {
                renderBoids(ctx, state);
            } else if (currentMode === "lorenz") {
                renderLorenz(ctx, state, timestamp);
            }
            // "off" mode: just clear, no animation

            state.animationId = requestAnimationFrame(animate);
        };

        // Initialize
        handleResize();
        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        state.animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(state.animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 transition-opacity duration-700 ease-in-out opacity-100"
            style={{ pointerEvents: "none" }}
        />
    );
}
