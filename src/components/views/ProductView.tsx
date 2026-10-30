"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CATEGORIES,
} from "@/lib/format";
import { CategoryIcon } from "@/lib/category-icons";
import { STORE_CONFIG, formatCUP } from "@/lib/store-config";
import {
  ShoppingBag,
  Heart,
  Share2,
  ChevronLeft,
  Clock,
  Users,
  Plus,
  Minus,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/shared/ProductCard";

export function ProductView() {
  const { selectedProductId, addToCart, setView } = useAppStore();
  const [data, setData] = useState<{ id: string | null; product: any }>({
    id: null,
    product: null,
  });
  const [related, setRelated] = useState<any[]>([]);
  const loading = data.id !== selectedProductId;
  const product = data.id === selectedProductId ? data.product : null;
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!selectedProductId) {
      setView("catalog");
      return;
    }
    let cancelled = false;
    fetch(`/api/products/${selectedProductId}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setData({ id: selectedProductId, product: d });
        return fetch(`/api/products?category=${d.category}&limit=5`)
          .then((r) => r.json())
          .then((rd) => {
            if (cancelled) return;
            setRelated(
              (rd.products || []).filter((p: any) => p.id !== d.id).slice(0, 4)
            );
          });
      })
      .catch(() => {
        if (cancelled) return;
        setData({ id: selectedProductId, product: null });
      });
    return () => {
      cancelled = true;
    };
  }, [selectedProductId, setView]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-xl bg-muted" />
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="h-32 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Producto no encontrado.</p>
        <Button className="mt-4" onClick={() => setView("catalog")}>
          Volver al menú
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
    toast.success("Añadido al carrito", { description: `${quantity} × ${product.name}` });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setView("cart");
  };

  const ingredients = product.ingredients
    ? product.ingredients.split(",").map((s: string) => s.trim())
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
      <button
        onClick={() => setView("catalog")}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver al menú
      </button>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        {/* Imagen estilo Starbucks */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <CategoryIcon category={product.category} className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            <div className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium uppercase tracking-wide text-[var(--dh-green)] flex items-center gap-1.5">
              <CategoryIcon category={product.category} className="h-3 w-3" />
              {CATEGORIES[product.category as keyof typeof CATEGORIES]}
            </div>
            <button
              onClick={() => {
                setLiked(!liked);
                toast(liked ? "Quitado de favoritos" : "Añadido a favoritos");
              }}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur transition hover:bg-white"
              aria-label="Favorito"
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "text-[var(--dh-green)]"}`} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {CATEGORIES[product.category as keyof typeof CATEGORIES]}
              {product.isCombo && " · Combo"}
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold leading-tight tracking-tight text-[var(--dh-green)] md:text-4xl">
              {product.name}
            </h1>
          </div>

          <p className="text-3xl font-bold text-[var(--dh-green)]">
            {formatCUP(product.price)}
          </p>

          <p className="text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3">
            {product.portions && product.portions > 1 && (
              <div className="flex items-center gap-2 rounded-full bg-[var(--dh-cream)] px-3 py-1.5 text-xs text-[var(--dh-green)]">
                <Users className="h-4 w-4" />
                {product.portions} porciones
              </div>
            )}
            {product.prepTime && product.prepTime > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-[var(--dh-cream)] px-3 py-1.5 text-xs text-[var(--dh-green)]">
                <Clock className="h-4 w-4" />
                {product.prepTime < 24
                  ? `${product.prepTime}h preparación`
                  : `${Math.round(product.prepTime / 24)} día(s) anticipación`}
              </div>
            )}
          </div>

          {/* Combo items */}
          {product.isCombo && product.comboItems && (
            <div className="rounded-xl border border-border bg-[var(--dh-cream)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--dh-green)]">
                Incluye
              </p>
              <p className="mt-2 text-sm text-foreground">{product.comboItems}</p>
            </div>
          )}

          {/* Ingredientes */}
          {ingredients.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ingredientes
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ingredients.map((ing: string, i: number) => (
                  <Badge key={i} variant="outline" className="rounded-full text-xs">
                    {ing}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Selector de cantidad */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              Cantidad
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-[var(--dh-green)] text-[var(--dh-green)]"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-10 text-center text-lg font-semibold">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-[var(--dh-green)] text-[var(--dh-green)]"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="ml-auto text-lg font-bold text-[var(--dh-green)]">
              {formatCUP(product.price * quantity)}
            </span>
          </div>

          {/* Acciones */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 rounded-full bg-[var(--dh-green)] hover:bg-[var(--dh-green-bright)]"
              onClick={handleBuyNow}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Pedir ahora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-[var(--dh-green)] text-[var(--dh-green)] hover:bg-[var(--dh-green-light)]"
              onClick={handleAddToCart}
            >
              Añadir
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(window.location.href);
                }
                toast.success("Enlace copiado");
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Nota WhatsApp */}
          <div className="rounded-xl bg-[var(--dh-green-light)] p-4 text-sm">
            <p className="flex items-center gap-2 font-medium text-[var(--dh-green)]">
              <MessageCircle className="h-4 w-4" />
              Pago y entrega por WhatsApp
            </p>
            <p className="mt-1 text-xs text-[var(--dh-green)]/80">
              Al finalizar la compra se abre WhatsApp con tu pedido. Coordinamos
              pago y entrega ahí. Sin pagos online.
            </p>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight text-[var(--dh-green)]">
            También te puede gustar
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
