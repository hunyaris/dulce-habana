"use client";

import { useAppStore } from "@/lib/store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCUP, STORE_CONFIG } from "@/lib/store-config";
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const {
    cartOpen,
    closeCart,
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    setView,
    openProduct,
  } = useAppStore();

  const subtotal = cartTotal();

  const handleCheckout = () => {
    closeCart();
    setView("checkout");
  };

  return (
    <Sheet open={cartOpen} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent
        side="right"
        className="w-[100vw] sm:w-[500px] md:w-[600px] max-w-full flex flex-col p-0 bg-background"
      >
        {/* Header del drawer */}
        <SheetHeader className="px-5 py-4 border-b border-border bg-[var(--dh-green)] text-white">
          <SheetTitle className="font-display text-2xl tracking-wide text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            TU PEDIDO
          </SheetTitle>
          <SheetDescription className="text-white/70 text-xs">
            {cart.length === 0
              ? "Tu carrito está vacío"
              : `${cart.reduce((s, i) => s + i.quantity, 0)} producto(s) en tu carrito`}
          </SheetDescription>
        </SheetHeader>

        {/* Items scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-3 bg-[var(--dh-cream)]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                <ShoppingBag className="h-7 w-7 text-[var(--dh-green)]" />
              </div>
              <div>
                <p className="font-display text-xl text-[var(--dh-green)]">
                  CARRITO VACÍO
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Explora el menú y añade tus dulces favoritos.
                </p>
              </div>
              <Button
                onClick={() => {
                  closeCart();
                  setView("catalog");
                }}
                className="rounded-full bg-[var(--dh-green)] hover:bg-[var(--dh-green-bright)]"
              >
                Ver el menú
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 rounded-xl border border-border bg-white p-3 shadow-sm"
                >
                  <button
                    onClick={() => {
                      closeCart();
                      openProduct(item.productId);
                    }}
                    className="relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </button>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-semibold text-[var(--dh-green)]">
                        {item.name}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-red-600"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatCUP(item.price)} c/u
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full border-[var(--dh-green)] text-[var(--dh-green)] p-0"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="min-w-7 text-center text-sm font-bold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-full border-[var(--dh-green)] text-[var(--dh-green)] p-0"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-bold text-[var(--dh-green)]">
                        {formatCUP(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con total y checkout */}
        {cart.length > 0 && (
          <div className="border-t border-border bg-white px-4 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatCUP(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Envío</span>
              <span>Se calcula al confirmar</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-display text-lg text-[var(--dh-green)]">TOTAL</span>
              <span className="font-display text-2xl font-bold text-[var(--dh-green)]">
                {formatCUP(subtotal)}
              </span>
            </div>

            <Button
              size="lg"
              className="w-full rounded-full bg-[var(--dh-green)] hover:bg-[var(--dh-green-bright)]"
              onClick={handleCheckout}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Continuar por WhatsApp
            </Button>

            <Button
              variant="ghost"
              className="w-full text-[var(--dh-green)]"
              onClick={closeCart}
            >
              Seguir comprando
            </Button>

            <p className="text-center text-[10px] text-muted-foreground">
              {STORE_CONFIG.paymentNote}
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
