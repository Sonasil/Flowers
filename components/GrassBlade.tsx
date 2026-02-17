import React from 'react';
import { motion } from 'framer-motion';

interface GrassProps {
  x: number;
  height: number;
  lean: number;
  delay: number;
  dark?: boolean;
}

export const GrassBlade: React.FC<GrassProps> = ({ x, height, lean, delay, dark = false }) => {
  const startX = x;
  const startY = 600;
  const endX = x + lean;
  const endY = 600 - height;
  const cpX = x + lean * 0.3;
  const cpY = 600 - height * 0.3;

  const path = `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;

  return (
    <motion.path
      d={path}
      stroke={dark ? '#064e3b' : '#0d9488'}
      strokeWidth={dark ? 2 : 1.5}
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: 1,
        opacity: dark ? 0.4 : 0.7,
        d: [
          `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`,
          `M ${startX} ${startY} Q ${cpX + 5} ${cpY} ${endX + 10} ${endY}`,
          `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`
        ]
      }}
      transition={{
        pathLength: { duration: 1, delay },
        opacity: { duration: 0.5, delay },
        d: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }
      }}
    />
  );
};