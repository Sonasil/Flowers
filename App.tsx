import React, { useState, useEffect } from 'react';
import { StarryBackground } from './components/StarryBackground';
import { EnchantedGarden } from './components/EnchantedGarden';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617] overflow-hidden text-white selection:bg-cyan-500/30">
      <StarryBackground />

      <main className="relative z-10 w-full h-full flex items-end justify-center pb-0 md:pb-12">
        <AnimatePresence>
          {mounted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="w-full h-full flex items-end justify-center"
            >
              <EnchantedGarden />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}