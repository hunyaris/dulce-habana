"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  STORE_CONFIG,
  DEFAULT_DELIVERY_ZONES,
  DELIVERY_TIME_OPTIONS,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  formatCUP,
} from "@/lib/store-config";
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  MapPin,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export function CheckoutView() {
  const { cart, cartTotal, clearCart, setView, setLastOrderId } = useAppStore();
  const [zones, setZones] = useState(DEFAULT_DELIVERY_ZONES);
  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    zone: "",
    time: DELIVERY_TIME_OPTIONS[0],
    notes: "",
  });

  useEffect(() => {
    fetch("/api/zones")
      .then((r) => r.json())
      .then((d) => {
        if (d.zones && d.zones.length > 0) {
          setZones(d.zones.map((z: any) => ({
            name: z.name,
            fee: z.fee,
            estimatedMin: z.estimatedMin,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const subtotal = cartTotal();
  const selectedZone = zones.find((z) => z.name === form.zone);
  const deliveryFee = selectedZone?.fee ?? 0;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    setView("cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.zone) {
      toast.error("Completa todos los campos requeridos");
      return;
    }
    setProcessing(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((c) => ({
            productId: c.productId,
            quantity: c.quantity,
            notes: c.notes,
          })),
          customer: {
            name: form.name,
            phone: form.phone,
          },
          delivery: {
            address: form.address,
            zone: form.zone,
            time: form.time,
            notes: form.notes,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al crear la orden");
      }

      setLastOrderId(data.order.id);

      // Construir mensaje de WhatsApp
      const message = buildWhatsAppMessage({
        orderNumber: data.order.orderNumber,
        customerName: form.name,
        items: cart.map((c) => ({
          name: c.name,
          quantity: c.quantity,
          price: c.price,
          notes: c.notes,
        })),
        subtotal,
        deliveryFee,
        total,
        deliveryZone: form.zone,
        address: form.address,
        deliveryTime: form.time,
        notes: form.notes,
      });

      // Abrir WhatsApp
      const waUrl = buildWhatsAppUrl(message);
      window.open(waUrl, "_blank");

      clearCart();
      setView("order-success");
    } catch (err: any) {
      toast.error(err.message || "Error al procesar la orden");
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      <button
        onClick={() => setView("cart")}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al carrito
      </button>

      <h1 className="mb-2 font-serif text-3xl font-semibold tracking-tight md:text-4xl text-[var(--dh-green)]">
        Datos de entrega
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Completa tus datos y confirma por WhatsApp. Coordinamos pago y entrega ahí.
      </p>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Datos personales */}
            <div>
              <h2 className="font-serif text-lg font-semibold text-[var(--dh-green)] mb-3">
                Tus datos
              </h2>
              <div>
                <Label htmlFor="name">Nombre completo *</Label>
                <Input
                  id="name"
                  placeholder="María Pérez"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div className="mt-3">
                <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
                <Input
                  id="phone"
                  placeholder="+53 5 123 4567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1"
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Te contactaremos por aquí para coordinar todo
                </p>
              </div>
            </div>

            <Separator />

            {/* Datos de entrega */}
            <div>
              <h2 className="font-serif text-lg font-semibold text-[var(--dh-green)] mb-3">
                Entrega
              </h2>
              <div>
                <Label htmlFor="address">Dirección completa *</Label>
                <Input
                  id="address"
                  placeholder="Calle, número, apartamento, entre calles"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>

              <div className="mt-3">
                <Label>Zona de entrega *</Label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {zones.map((z) => (
                    <button
                      key={z.name}
                      type="button"
                      onClick={() => setForm({ ...form, zone: z.name })}
                      className={`flex items-center justify-between rounded-lg border p-3 text-left transition ${
                        form.zone === z.name
                          ? "border-[var(--dh-green)] bg-[var(--dh-green-light)]"
                          : "border-border bg-card hover:border-[var(--dh-green)]/40"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {z.name}
                        </p>
                        {z.estimatedMin > 0 && (
                          <p className="text-xs text-muted-foreground">
                            ~{z.estimatedMin} min
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-bold text-[var(--dh-green)]">
                        {z.fee === 0 ? "Gratis" : formatCUP(z.fee)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <Label>Horario de entrega</Label>
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {DELIVERY_TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Input
                  id="notes"
                  placeholder="Llamar al llegar, sin timbre, etc."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="rounded-xl bg-[var(--dh-green-light)] p-4 text-sm">
              <p className="flex items-center gap-2 font-medium text-[var(--dh-green)]">
                <MessageCircle className="h-4 w-4" />
                Confirmación por WhatsApp
              </p>
              <p className="mt-1 text-xs text-[var(--dh-green)]/80">
                Al enviar, se abre WhatsApp con tu pedido completo y datos de
                entrega. Solo revisas y envías. El pago se coordina con nosotras,
                nunca por plataformas.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full bg-[var(--dh-green)] hover:bg-[var(--dh-green-bright)]"
              disabled={processing}
            >
              {processing ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Procesando...
                </>
              ) : (
                <>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Confirmar pedido por WhatsApp
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Order summary */}
        <div>
          <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
            <h2 className="font-serif text-lg font-semibold text-[var(--dh-green)]">
              Tu pedido
            </h2>
            <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-medium line-clamp-2 text-foreground">{item.name}</p>
                    <p className="mt-1 text-muted-foreground">
                      {item.quantity} × {formatCUP(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCUP(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                {form.zone ? (
                  deliveryFee === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    <span>{formatCUP(deliveryFee)}</span>
                  )
                ) : (
                  <span className="text-xs text-muted-foreground">Elige zona</span>
                )}
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-bold">
                <span className="text-[var(--dh-green)]">Total</span>
                <span className="text-[var(--dh-green)]">{formatCUP(total)}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-lg bg-[var(--dh-cream)] p-3 text-xs text-[var(--dh-green)]">
              <p className="flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Entrega en {STORE_CONFIG.city}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-3 w-3" /> {STORE_CONFIG.deliveryHours}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderSuccessView() {
  const { lastOrderId, setView } = useAppStore();

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 px-4 py-20 text-center md:py-32">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="font-serif text-3xl font-semibold md:text-4xl text-[var(--dh-green)]">
        ¡Pedido enviado!
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Abrimos WhatsApp con tu pedido completo. Envíalo y nosotras confirmamos
        disponibilidad, pago y horario de entrega.
      </p>
      {lastOrderId && (
        <p className="text-xs text-muted-foreground">
          Número de orden:{" "}
          <span className="font-mono font-medium text-[var(--dh-green)]">
            {lastOrderId.slice(-8).toUpperCase()}
          </span>
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <Button
          size="lg"
          className="rounded-full bg-[var(--dh-green)] hover:bg-[var(--dh-green-bright)]"
          onClick={() => {
            const msg = encodeURIComponent("Hola DULCE HABANA! Quiero seguir con mi pedido.");
            window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${msg}`, "_blank");
          }}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Reenviar por WhatsApp
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full border-[var(--dh-green)] text-[var(--dh-green)]"
          onClick={() => setView("catalog")}
        >
          Seguir comprando
        </Button>
      </div>
    </div>
  );
}
