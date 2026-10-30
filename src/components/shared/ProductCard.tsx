"use client";

import { useAppStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/format";
import { CategoryIcon } from "@/lib/category-icons";
import { formatCUP } from "@/lib/store-config";
import { Card } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    image: string;
    portions?: number | null;
    isCombo?: boolean;
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { openProduct, addToCart, cart, updateQuantity } = useAppStore();

  const cartItem = cart.find((c) => c.productId === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity === 0) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
      toast.success("Añadido al carrito", { description: product.name });
    } else {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 0) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  // Rotación variable sutil para sticker stack
  const rotations = [0, -1, 1, -0.5, 0.5, 0, -1.5, 1.5];
  const rotation = rotations[index % rotations.length];

  return (
    <Card
      className="group card-hover-lift relative cursor-pointer overflow-hidden border-border bg-card rounded-xl"
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={() => openProduct(product.id)}
    >
      {/* Imagen cuadrada */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <CategoryIcon category={product.category} className="h-10 w-10" />
          </div>
        )}

        {/* Sticker badge categoría (sin emoji, solo icono + texto) */}
        <div
          className="absolute left-3 top-3 z-10"
          style={{ transform: "rotate(-4deg)" }}
        >
          <span className="sticker sticker-mint text-[10px] gap-1">
            <CategoryIcon category={product.category} className="h-3 w-3" />
            {CATEGORIES[product.category as keyof typeof CATEGORIES]}
          </span>
        </div>

        {/* Sticker "Combo" si aplica (sin emoji) */}
        {product.isCombo && (
          <div
            className="absolute right-3 top-3 animate-wiggle z-10"
            style={{ transform: "rotate(8deg)" }}
          >
            <span className="sticker sticker-yellow text-[10px]">
              COMBO
            </span>
          </div>
        )}

        {/* Selector de cantidad o botón + */}
        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--dh-green)] text-white shadow-lg transition-all duration-300 hover:bg-[var(--dh-green-bright)] hover:scale-125 hover:rotate-90"
            aria-label="Añadir al carrito"
          >
            <Plus className="h-5 w-5" />
          </button>
        ) : (
          <div
            className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white p-1 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleRemove}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--dh-green-light)] text-[var(--dh-green)] transition hover:bg-[var(--dh-green)] hover:text-white"
              aria-label="Quitar uno"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-8 text-center text-base font-bold text-[var(--dh-green)]">
              {quantity}
            </span>
            <button
              onClick={handleAdd}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--dh-green)] text-white transition hover:bg-[var(--dh-green-bright)] hover:scale-110"
              aria-label="Añadir otro"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-foreground">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="font-display text-2xl font-bold text-[var(--dh-green)]">
            {formatCUP(product.price)}
          </p>
          {product.portions && product.portions > 1 && (
            <span className="text-xs text-muted-foreground">
              {product.portions} porciones
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
