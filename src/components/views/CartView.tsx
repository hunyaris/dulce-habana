"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCUP, STORE_CONFIG } from "@/lib/store-config";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";

export function CartView() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    setView,
  } = useAppStore();

  if (cart.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-20 text-center md:py-32">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--dh-green-light)]">
          <ShoppingBag className="h-8 w-8 text-[var(--dh-green)]" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-[var(--dh-green)]">
          Tu carrito está vacío
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Explora nuestro menú de dulces cubanos artesanales y añade tus favoritos.
        </p>
        <Button
          size="lg"
          className="mt-4 rounded-full bg-[var(--dh-green)] hover:bg-[var(--dh-green-bright)]"
          onClick={() => setView("catalog")}
        >
          Ver el menú
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  const subtotal = cartTotal();

  const handleCheckout = () => {
    setView("checkout");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <h1 className="mb-8 font-serif text-3xl font-semibold tracking-tight md:text-4xl text-[var(--dh-green)]">
        Tu pedido
      </h1>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Items */}
        <div className="md:col-span-2 space-y-3">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-xl border border-border bg-card p-3"
            >
              <button
                onClick={() => useAppStore.getState().openProduct(item.productId)}
                className="relative aspect-square w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted md:w-28"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </button>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--dh-green)]">{item.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatCUP(item.price)} c/u
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-600"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-[var(--dh-green)] text-[var(--dh-green)]"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="min-w-8 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-[var(--dh-green)] text-[var(--dh-green)]"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-base font-bold text-[var(--dh-green)]">
                    {formatCUP(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="md:col-span-1">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-lg font-semibold text-[var(--dh-green)]">
              Resumen
            </h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCUP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Envío</span>
                <span>Se calcula al confirmar</span>
              </div>
            </div>

            <Separator className="my-4" />

            <p className="text-xs text-muted-foreground">
              Total aproximado: <span className="font-bold text-[var(--dh-green)]">{formatCUP(subtotal)}</span> + envío
            </p>

            <Button
              size="lg"
              className="mt-6 w-full rounded-full bg-[var(--dh-green)] hover:bg-[var(--dh-green-bright)]"
              onClick={handleCheckout}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Continuar por WhatsApp
            </Button>

            <Button
              variant="ghost"
              className="mt-3 w-full text-[var(--dh-green)]"
              onClick={() => setView("catalog")}
            >
              Seguir comprando
            </Button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              {STORE_CONFIG.paymentNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
