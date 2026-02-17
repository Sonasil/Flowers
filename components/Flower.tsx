import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FlowerProps {
  x: number;
  height: number;
  scale: number;
  delay: number;
  color: 'blue' | 'cyan' | 'pink' | 'purple';
}

const colors = {
  blue: {
    stroke: '#93c5fd',
    fill: '#1e3a8a',
    glow: '#3b82f6',
    secondary: '#60a5fa'
  },
  cyan: {
    stroke: '#67e8f9',
    fill: '#164e63',
    glow: '#06b6d4',
    secondary: '#22d3ee'
  },
  pink: {
    stroke: '#f9a8d4',
    fill: '#831843',
    glow: '#ec4899',
    secondary: '#f472b6'
  },
  purple: {
    stroke: '#d8b4fe',
    fill: '#4c1d95',
    glow: '#8b5cf6',
    secondary: '#a78bfa'
  }
};

export const Flower: React.FC<FlowerProps> = ({ x, height, scale, delay, color }) => {
  const theme = colors[color];

  const geometry = useMemo(() => {
    const startX = x;
    const startY = 600;
    const lean = (Math.random() * 50 - 25);
    const endX = x + lean;
    const endY = 600 - height;
    const cpX = (startX + endX) / 2 + (Math.random() * 30 - 15);
    const cpY = (startY + endY) / 2;

    const pathD = `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;

    const getStateAtT = (t: number) => {
      const invT = 1 - t;
      const posX = (invT * invT * startX) + (2 * invT * t * cpX) + (t * t * endX);
      const posY = (invT * invT * startY) + (2 * invT * t * cpY) + (t * t * endY);
      const tanX = 2 * (1 - t) * (cpX - startX) + 2 * t * (endX - cpX);
      const tanY = 2 * (1 - t) * (cpY - startY) + 2 * t * (endY - cpY);
      const angle = Math.atan2(tanY, tanX) * (180 / Math.PI);

      return { x: posX, y: posY, angle };
    };

    return {
      pathD,
      leaf1: getStateAtT(0.35),
      leaf2: getStateAtT(0.65),
      end: getStateAtT(1.0)
    };
  }, [x, height]);

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay }}
    >
      <motion.path
        d={geometry.pathD}
        fill="none"
        stroke="url(#stem-gradient)"
        strokeWidth={2.5 * scale}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: "easeOut", delay }}
        style={{ filter: 'drop-shadow(0 0 3px rgba(34,211,238,0.2))' }}
      />

      <Leaf config={geometry.leaf1} scale={scale} delay={delay + 0.6} side="left" />
      <Leaf config={geometry.leaf2} scale={scale * 0.9} delay={delay + 1.2} side="right" />

      <g transform={`translate(${geometry.end.x}, ${geometry.end.y}) rotate(${geometry.end.angle + 90})`}>
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: scale }}
          transition={{ duration: 1.8, delay: delay + 1.8, type: "spring", bounce: 0.3 }}
        >
          <Bloom theme={theme} delay={delay + 2} />
        </motion.g>
      </g>
    </motion.g>
  );
};

const Leaf: React.FC<{
  config: { x: number, y: number, angle: number };
  scale: number;
  delay: number;
  side: 'left' | 'right'
}> = ({ config, scale, delay, side }) => {
  const rotationOffset = side === 'left' ? -50 : 50;
  const finalAngle = config.angle + rotationOffset;

  return (
    <motion.path
      d="M 0 0 Q 20 -15 40 0 Q 20 15 0 0"
      fill="url(#stem-gradient)"
      stroke="#2dd4bf"
      strokeWidth={0.5}
      fillOpacity={0.6}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: scale, opacity: 0.8 }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      style={{
        transformBox: 'fill-box',
        transformOrigin: '0 0',
        translateX: config.x,
        translateY: config.y,
        rotate: finalAngle,
      }}
    />
  );
};

// Symmetrical Lotus/Lily Style Bloom
const Bloom: React.FC<{ theme: typeof colors['blue'], delay: number }> = ({ theme, delay }) => {
  return (
    <g>
      <path d="M -4 2 Q 0 8 4 2 L 0 -2 Z" fill="#0d9488" opacity="0.9" />

      <circle
        r="40"
        fill={theme.glow}
        opacity="0.15"
        style={{ filter: 'blur(8px)' }}
      />

      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <Petal
          key={`back-${i}`}
          angle={deg}
          scale={1}
          color={theme.fill}
          border={theme.stroke}
          delay={delay}
        />
      ))}

      {[30, 90, 150, 210, 270, 330].map((deg, i) => (
        <Petal
          key={`front-${i}`}
          angle={deg}
          scale={0.7}
          color={theme.secondary}
          border={theme.stroke}
          delay={delay + 0.2}
          filled
        />
      ))}

      <Stamens delay={delay + 0.8} />

      {/* Bright White Core */}
      <motion.circle
        r="3"
        fill="#fff"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.8, duration: 0.5 }}
        style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }}
      />
    </g>
  )
}

const Petal = ({ angle, scale, color, border, delay, filled }: any) => {
  const path = "M 0 0 C 12 -15 12 -45 0 -60 C -12 -45 -12 -15 0 0";

  return (
    <motion.path
      d={path}
      fill={color}
      fillOpacity={filled ? 0.9 : 0.5}
      stroke={border}
      strokeWidth={0.5}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: scale, opacity: 1 }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      style={{
        transformOrigin: 'center',
        rotate: angle,
        mixBlendMode: 'screen',
        willChange: 'transform, opacity'
      }}
    />
  )
}

const Stamens = ({ delay }: { delay: number }) => (
  <motion.g
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: delay + 0.4, duration: 0.6 }}
  >
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <line
        key={deg}
        x1="0" y1="0" x2="0" y2="-12"
        stroke="#fff"
        strokeWidth="0.5"
        strokeOpacity="0.7"
        style={{ transformOrigin: 'center', rotate: deg }}
      />
    ))}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <circle
        key={`p-${deg}`}
        cx="0" cy="-14" r="1"
        fill="#fef08a"
        style={{ transformOrigin: 'center', rotate: deg }}
      />
    ))}
  </motion.g>
)