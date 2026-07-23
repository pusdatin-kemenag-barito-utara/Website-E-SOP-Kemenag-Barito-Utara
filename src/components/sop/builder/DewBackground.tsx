"use client";

import React, { useEffect, useRef } from "react";

export function DewBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Floating Dew / Bokeh Drops
    const dewCount = 45;
    const dews: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      speedY: number;
      speedX: number;
      pulseSpeed: number;
      pulsePhase: number;
      color: string;
    }> = [];

    const colors = [
      "rgba(16, 185, 129, ", // Emerald
      "rgba(20, 184, 166, ", // Teal
      "rgba(52, 211, 153, ", // Mint
      "rgba(245, 158, 11, ", // Soft Amber
    ];

    for (let i = 0; i < dewCount; i++) {
      dews.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 8 + 3,
        alpha: Math.random() * 0.4 + 0.15,
        speedY: -(Math.random() * 0.4 + 0.1), // Slow upward float
        speedX: (Math.random() - 0.5) * 0.3,  // Gentle sway
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      dews.forEach((dew) => {
        // Move dew drops
        dew.y += dew.speedY;
        dew.x += Math.sin(dew.pulsePhase) * dew.speedX;
        dew.pulsePhase += dew.pulseSpeed;

        // Wrap around screen
        if (dew.y < -20) {
          dew.y = height + 20;
          dew.x = Math.random() * width;
        }

        // Draw soft glowing dew drop
        const currentAlpha = dew.alpha + Math.sin(dew.pulsePhase) * 0.08;
        const gradient = ctx.createRadialGradient(
          dew.x,
          dew.y,
          0,
          dew.x,
          dew.y,
          dew.radius * 2
        );

        gradient.addColorStop(0, `${dew.color}${Math.max(0, currentAlpha)})`);
        gradient.addColorStop(1, `${dew.color}0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(dew.x, dew.y, dew.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
}
