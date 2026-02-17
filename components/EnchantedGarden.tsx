import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flower } from './Flower';
import { GrassBlade } from './GrassBlade';

export const EnchantedGarden: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const flowers = useMemo(() => {
    return [
      { x: 0, height: 460, scale: 1.6, delay: 0.5, color: 'blue' },
      { x: -55, height: 390, scale: 1.2, delay: 1.2, color: 'cyan' },
      { x: 50, height: 410, scale: 1.3, delay: 0.8, color: 'pink' },
      { x: -25, height: 280, scale: 0.9, delay: 1.8, color: 'purple' },
      { x: 25, height: 260, scale: 0.8, delay: 2.1, color: 'cyan' },
      { x: -95, height: 210, scale: 0.75, delay: 2.5, color: 'blue' },
      { x: 90, height: 190, scale: 0.7, delay: 2.8, color: 'purple' },
    ] as const;
  }, []);

  const grass = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      x: (i - 16) * 18 + (Math.random() * 20 - 10),
      height: 80 + Math.random() * 100,
      lean: (Math.random() - 0.5) * 40,
      delay: Math.random() * 1.5,
    }));
  }, []);

  return (
    <div className="relative w-full h-full flex justify-center items-end">
      <svg
        viewBox="-400 0 800 600"
        className="w-full h-full max-h-[85vh] md:max-h-[95vh]"
        style={{ filter: 'drop-shadow(0 0 30px rgba(6,182,212,0.1))' }}
        preserveAspectRatio={isMobile ? "xMidYMax slice" : "xMidYMax meet"}
      >
        <defs>
          <filter id="glow-intense" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="stem-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0.1" />
          </linearGradient>

          <radialGradient id="flower-core-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="20%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="opacity-50 blur-[1px]">
          {grass.filter((_, i) => i % 2 === 0).map((blade, i) => (
            <GrassBlade key={`bg-grass-${i}`} {...blade} dark />
          ))}
        </g>

        <g>
          {flowers.map((flower, i) => (
            <Flower key={i} {...flower} />
          ))}
        </g>

        <g className="opacity-80">
          {grass.filter((_, i) => i % 2 !== 0).map((blade, i) => (
            <GrassBlade key={`fg-grass-${i}`} {...blade} />
          ))}
        </g>
      </svg>
    </div>
  );
};