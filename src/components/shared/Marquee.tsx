"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  /** Separador entre items - por defecto estrella */
  separator?: string;
  /** Velocidad: slow | normal | fast */
  speed?: "slow" | "normal" | "fast";
  reverse?: boolean;
  className?: string;
  /** Color de texto */
  textColor?: string;
  /** Estilo visual */
  variant?: "default" | "outline" | "filled" | "stickers";
}

/**
 * Marquee infinito horizontal - estilo CRAV burgers.
 * Repite los items dos veces para loop continuo.
 */
export function Marquee({
  items,
  separator = "★",
  speed = "normal",
  reverse = false,
  className,
  textColor = "var(--dh-green)",
  variant = "default",
}: MarqueeProps) {
  // Duplicar items para crear loop continuo
  const doubled = [...items, ...items, ...items, ...items];

  const speedClass = speed === "fast"
    ? "animate-marquee-fast"
    : speed === "slow"
    ? "animate-marquee"
    : "animate-marquee";

  const reverseClass = reverse ? "animate-marquee-reverse" : speedClass;

  return (
    <div className={cn("marquee-pause relative w-full overflow-hidden", className)}>
      <div className={cn("flex w-max flex-nowrap", reverseClass)}>
        {doubled.map((item, i) => (
          <span
            key={i}
            className={cn(
              "mx-4 inline-flex items-center gap-4 whitespace-nowrap",
              variant === "outline" && "outline-text font-display text-4xl md:text-6xl",
              variant === "filled" && "font-display text-4xl md:text-6xl font-bold",
              variant === "stickers" && "font-display text-3xl md:text-5xl",
              variant === "default" && "font-display text-3xl md:text-5xl"
            )}
            style={{ color: textColor }}
          >
            <span className="inline-block">{item}</span>
            <span
              className="inline-block text-2xl opacity-60"
              style={{ color: textColor }}
              aria-hidden="true"
            >
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
