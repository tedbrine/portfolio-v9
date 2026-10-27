"use client";

import { useEffect, useRef } from "react";

const CELL = 7;
const WAVE_MS = 380;
const FALL_WAVE_MS = 240;
const SETTLE_MS = 160;
const MAX_DOTS = 8000;

type Phase = "idle" | "rise" | "settle" | "hold" | "fall";

type Dot = {
  col: number;
  row: number;
  rowT: number;
  drift: number;
  peak: number;
  settle: number;
  alpha: number;
  from: number;
  phase: Phase;
  start: number;
  end: number;
};

const easeOut = (amount: number) => 1 - (1 - amount) ** 3;

const waveDelay = (dot: Dot, travel: number) => {
  const jitter = (Math.random() - 0.5) * 130;
  const drip = Math.random() < 0.3 ? 60 + Math.random() * 170 : 0;
  return Math.max(0, dot.rowT * travel + dot.drift + jitter + drip);
};

const assignBrightness = (dot: Dot) => {
  dot.settle = 0.16 + Math.random() * 0.36;
  dot.peak = Math.min(0.74, dot.settle + 0.18 + Math.random() * 0.22);
};

const buildDots = (width: number, height: number): Dot[] => {
  const cols = Math.ceil(width / CELL);
  const rows = Math.ceil(height / CELL);
  if (cols < 1 || rows < 1 || cols * rows > MAX_DOTS) return [];

  const dots: Dot[] = [];
  for (let row = 0; row < rows; row += 1) {
    const rowT = rows === 1 ? 0 : row / (rows - 1);
    for (let col = 0; col < cols; col += 1) {
      const dot: Dot = {
        col,
        row,
        rowT,
        drift:
          Math.sin(col * 0.47) * 36 + Math.sin(col * 0.13 + row * 0.41) * 24,
        peak: 0,
        settle: 0,
        alpha: 0,
        from: 0,
        phase: "idle",
        start: 0,
        end: 0,
      };
      assignBrightness(dot);
      dots.push(dot);
    }
  }
  return dots;
};

const sample = (dot: Dot, now: number) => {
  if (dot.phase === "idle") {
    dot.alpha = 0;
    return;
  }
  if (dot.phase === "hold") {
    dot.alpha = dot.settle;
    return;
  }
  if (now <= dot.start) {
    dot.alpha = dot.from;
    return;
  }

  const eased = easeOut(
    Math.min(1, (now - dot.start) / Math.max(1, dot.end - dot.start)),
  );

  if (dot.phase === "rise") {
    dot.alpha = dot.from + (dot.peak - dot.from) * eased;
    return;
  }
  if (dot.phase === "settle") {
    dot.alpha = dot.peak + (dot.settle - dot.peak) * eased;
    return;
  }
  dot.alpha = dot.from * (1 - eased);
};

const advance = (dot: Dot, now: number) => {
  if (now < dot.end) return;

  if (dot.phase === "rise") {
    dot.phase = "settle";
    dot.alpha = dot.peak;
    dot.start = dot.end;
    dot.end = dot.start + SETTLE_MS;
    return;
  }
  if (dot.phase === "settle") {
    dot.phase = "hold";
    dot.alpha = dot.settle;
    return;
  }
  if (dot.phase === "fall") {
    dot.phase = "idle";
    dot.alpha = 0;
  }
};

export const AdBannerHoverDots = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = canvas.closest(".ad-banner-link");
    const field = canvas.parentElement;
    if (!(link instanceof HTMLElement) || !field) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let bitmapScale = 0;
    let engaged = false;
    let pointerInside = false;
    let keyboardInside = false;
    let frame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const paint = () => {
      context.clearRect(0, 0, width, height);
      // White, clipped by the same dot mask as the pattern, lightens each dot.
      context.fillStyle = "#fff";
      for (const dot of dots) {
        if (dot.alpha < 0.004) continue;
        context.globalAlpha = dot.alpha;
        context.fillRect(dot.col * CELL, dot.row * CELL, CELL, CELL);
      }
      context.globalAlpha = 1;
    };

    const tick = (now: number) => {
      frame = 0;
      for (const dot of dots) {
        advance(dot, now);
        sample(dot, now);
      }
      paint();

      const moving = dots.some((dot) =>
        engaged ? dot.phase !== "hold" : dot.phase !== "idle",
      );
      if (moving) frame = requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (frame !== 0) return;
      frame = requestAnimationFrame(tick);
    };

    const rise = (now: number) => {
      const instant = reducedMotion.matches;
      for (const dot of dots) {
        sample(dot, now);
        if (dot.alpha < 0.05) assignBrightness(dot);
        dot.from = dot.alpha;
        if (instant) {
          dot.phase = "hold";
          dot.alpha = dot.settle;
          continue;
        }
        dot.phase = "rise";
        dot.start = now + waveDelay(dot, WAVE_MS);
        dot.end = dot.start + 55 + Math.random() * 65;
      }
    };

    const fall = (now: number) => {
      const instant = reducedMotion.matches;
      for (const dot of dots) {
        sample(dot, now);
        dot.from = dot.alpha;
        if (instant || dot.alpha < 0.004) {
          dot.phase = "idle";
          dot.alpha = 0;
          continue;
        }
        dot.phase = "fall";
        dot.start = now + waveDelay(dot, FALL_WAVE_MS);
        dot.end = dot.start + 70 + Math.random() * 50;
      }
    };

    const setEngaged = (next: boolean) => {
      if (next === engaged) return;
      engaged = next;
      const now = performance.now();
      if (next) rise(now);
      else fall(now);
      schedule();
    };

    const rebuild = () => {
      const nextWidth = field.clientWidth;
      const nextHeight = field.clientHeight;
      const nextScale = Math.min(window.devicePixelRatio || 1, 3);
      if (
        nextWidth === width &&
        nextHeight === height &&
        nextScale === bitmapScale &&
        dots.length > 0
      ) {
        return;
      }
      if (nextWidth < 1 || nextHeight < 1) return;

      width = nextWidth;
      height = nextHeight;
      bitmapScale = nextScale;
      canvas.width = Math.round(width * bitmapScale);
      canvas.height = Math.round(height * bitmapScale);
      context.setTransform(bitmapScale, 0, 0, bitmapScale, 0, 0);
      dots = buildDots(width, height);

      if (engaged) {
        for (const dot of dots) {
          dot.phase = "hold";
          dot.alpha = dot.settle;
        }
      }
      paint();
    };

    const onEnter = () => {
      pointerInside = true;
      setEngaged(pointerInside || keyboardInside);
    };
    const onLeave = () => {
      pointerInside = false;
      setEngaged(pointerInside || keyboardInside);
    };
    const onFocus = () => {
      keyboardInside = link.matches(":focus-visible");
      setEngaged(pointerInside || keyboardInside);
    };
    const onBlur = () => {
      keyboardInside = false;
      setEngaged(pointerInside || keyboardInside);
    };

    rebuild();
    const observer = new ResizeObserver(rebuild);
    observer.observe(field);
    link.addEventListener("pointerenter", onEnter);
    link.addEventListener("pointerleave", onLeave);
    link.addEventListener("focus", onFocus);
    link.addEventListener("blur", onBlur);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      observer.disconnect();
      link.removeEventListener("pointerenter", onEnter);
      link.removeEventListener("pointerleave", onLeave);
      link.removeEventListener("focus", onFocus);
      link.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="ad-banner-hover-dots" aria-hidden />
  );
};
