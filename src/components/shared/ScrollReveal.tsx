"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
}

/**
 * Componente que revela su contenido cuando entra en el viewport.
 * Usa IntersectionObserver, sin dependencias externas.
 */
export function ScrollReveal({ children, className, stagger = false, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -80px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        stagger ? "stagger-children" : "reveal-on-scroll",
        visible && "is-visible",
        className
      )}
    >
      {children}
    </div>
  );
}
