"use client";

import { cn } from "@/lib/utils";

interface StickerProps {
  children: React.ReactNode;
  /** Color de fondo del sticker */
  variant?: "cream" | "yellow" | "green" | "mint";
  /** Rotación en grados (-10 a 10) */
  rotate?: number;
  className?: string;
}

/**
 * Etiqueta estilo sticker - rotada con borde y sombra hard.
 * Inspirado en los badges de CRAV burgers.
 */
export function Sticker({ children, variant = "cream", rotate = -3, className }: StickerProps) {
  const variantClass = {
    cream: "",
    yellow: "sticker-yellow",
    green: "sticker-green",
    mint: "sticker-mint",
  }[variant];

  return (
    <span
      className={cn("sticker", variantClass, className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}
