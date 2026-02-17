import React, { useEffect, useRef } from 'react';

export const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const stars: { x: number; y: number; radius: number; alpha: number; speed: number }[] = [];
    const fireflies: { x: number; y: number; radius: number; vx: number; vy: number; alpha: number; phase: number }[] = [];

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      stars.length = 0;
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5,
          alpha: Math.random(),
          speed: 0.005 + Math.random() * 0.01,
        });
      }

      fireflies.length = 0;
      for (let i = 0; i < 30; i++) {
        fireflies.push({
          x: Math.random() * width,
          y: height - Math.random() * (height / 2),
          radius: 1 + Math.random() * 2,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          alpha: 0,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();

        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) {
          star.speed = -star.speed;
        }
      });

      fireflies.forEach((fly) => {
        fly.x += fly.vx;
        fly.y += fly.vy;
        fly.phase += 0.05;

        if (fly.x < 0 || fly.x > width) fly.vx *= -1;
        if (fly.y < height / 2 || fly.y > height) fly.vy *= -1;

        const sinePulse = (Math.sin(fly.phase) + 1) / 2;
        fly.alpha = 0.2 + sinePulse * 0.7;

        const glowRadius = fly.radius * (3 + sinePulse * 5);

        const r = Math.floor(40 + sinePulse * 60);
        const g = Math.floor(200 + sinePulse * 55);
        const b = Math.floor(150 + sinePulse * 70);

        // Create gradient for soft glow
        const gradient = ctx.createRadialGradient(fly.x, fly.y, 0, fly.x, fly.y, glowRadius);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${fly.alpha})`); // Core glow
        gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${fly.alpha * 0.3})`); // Mid falloff
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`); // Fade to transparent

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(fly.x, fly.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Solid White Core (Hotspot)
        ctx.fillStyle = `rgba(255, 255, 255, ${fly.alpha + 0.1})`;
        ctx.beginPath();
        ctx.arc(fly.x, fly.y, fly.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    init();
    draw();

    window.addEventListener('resize', init);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};