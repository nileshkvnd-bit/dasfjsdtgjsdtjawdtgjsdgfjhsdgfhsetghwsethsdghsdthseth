"use client";

import { useEffect, useRef } from "react";

// Drifting red embers, echoing the spark bursts in the Kyron logo.
// Runs on a canvas so it stays cheap even with many particles, and
// pauses entirely when the tab is hidden or reduced-motion is set.
export default function EmberField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Ember = {
      x: number;
      y: number;
      r: number;
      vy: number;
      vx: number;
      alpha: number;
      alphaDir: number;
    };

    let embers: Ember[] = [];

    function resize() {
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvasEl.width = width * dpr;
      canvasEl.height = height * dpr;
      canvasEl.style.width = `${width}px`;
      canvasEl.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(70, Math.floor((width * height) / 18000));
      embers = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        vy: -(Math.random() * 0.15 + 0.03),
        vx: (Math.random() - 0.5) * 0.08,
        alpha: Math.random() * 0.5 + 0.1,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
      }));
    }

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let running = true;

    function draw() {
      if (!running) return;
      ctx!.clearRect(0, 0, width, height);

      for (const e of embers) {
        e.y += e.vy;
        e.x += e.vx;
        e.alpha += e.alphaDir * 0.0025;
        if (e.alpha <= 0.08 || e.alpha >= 0.6) e.alphaDir *= -1;
        if (e.y < -10) {
          e.y = height + 10;
          e.x = Math.random() * width;
        }
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(255, 40, 40, ${e.alpha})`;
        ctx!.shadowColor = "rgba(255, 26, 26, 0.8)";
        ctx!.shadowBlur = 4;
        ctx!.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    if (!prefersReduced) {
      raf = requestAnimationFrame(draw);
    } else {
      // Static single paint, no loop.
      for (const e of embers) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 40, 40, ${e.alpha})`;
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function handleVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!prefersReduced) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-20 pointer-events-none"
    />
  );
}
