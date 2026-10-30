"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";

interface AnimatedViewProps {
  children: React.ReactNode;
}

/**
 * Wrapper que aplica animaciones de transición entre vistas.
 * Usa Framer Motion AnimatePresence con fade + slide.
 */
export function AnimatedView({ children }: AnimatedViewProps) {
  const { view } = useAppStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
