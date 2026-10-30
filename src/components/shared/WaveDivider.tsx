"use client";

import { cn } from "@/lib/utils";

interface WaveDividerProps {
  /** Color del wave (fill) */
  color?: string;
  /** Color de fondo superior - se usa para flip si es necesario */
  flip?: boolean;
  /** Variante de forma */
  variant?: "wave" | "blob" | "curve" | "drip";
  className?: string;
}

/**
 * Divisor de sección con forma orgánica (estilo CRAV burgers).
 * Genera un SVG que separa dos secciones con una curva.
 */
export function WaveDivider({
  color = "var(--dh-green)",
  flip = false,
  variant = "wave",
  className,
}: WaveDividerProps) {
  const paths: Record<string, string> = {
    wave: "M0,32 C180,80 360,0 600,40 C840,80 1020,16 1200,48 L1200,120 L0,120 Z",
    blob: "M0,40 C150,90 300,10 450,50 C600,90 750,20 900,50 C1050,80 1150,30 1200,50 L1200,120 L0,120 Z",
    curve: "M0,60 Q300,120 600,60 T1200,60 L1200,120 L0,120 Z",
    drip: "M0,30 C200,70 400,10 600,40 C700,55 750,30 800,50 C900,80 1000,20 1200,50 L1200,120 L0,120 Z",
  };

  return (
    <div
      className={cn("relative w-full overflow-hidden leading-[0]", className)}
      style={{ transform: flip ? "rotate(180deg)" : undefined }}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block h-[40px] w-full md:h-[60px]"
        aria-hidden="true"
      >
        <path d={paths[variant]} fill={color} />
      </svg>
    </div>
  );
}
