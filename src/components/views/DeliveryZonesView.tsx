"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { STORE_CONFIG, formatCUP } from "@/lib/store-config";
import { MapPin, Clock, MessageCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeliveryZonesView() {
  const { setView } = useAppStore();
  const [zones, setZones] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/zones")
      .then((r) => r.json())
      .then((d) => setZones(d.zones || []));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Entregas
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight md:text-4xl text-[var(--dh-green)]">
          Zonas de entrega en La Habana
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {STORE_CONFIG.deliveryHours}. Coordinamos todo por WhatsApp.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {zones.map((z) => (
          <Card key={z.id} className="p-5 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--dh-green-light)]">
                <MapPin className="h-5 w-5 text-[var(--dh-green)]" />
              </div>
              <p className="text-2xl font-bold text-[var(--dh-green)]">
                {z.fee === 0 ? "Gratis" : formatCUP(z.fee)}
              </p>
            </div>
            <h3 className="mt-3 font-serif text-lg font-semibold">
              {z.name}
            </h3>
            {z.estimatedMin > 0 && (
              <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Entrega estimada: {z.estimatedMin} min
              </p>
            )}
            {z.estimatedMin === 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Recoger en tienda
              </p>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-[var(--dh-green)] p-6 md:p-8 text-white">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h2 className="font-serif text-2xl font-semibold">
              ¿No ves tu zona en la lista?
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Escríbenos por WhatsApp. Hacemos entregas especiales y coordinamos
              recogidas en tienda si vives fuera de La Habana.
            </p>
          </div>
          <div className="md:text-right">
            <Button
              size="lg"
              className="rounded-full bg-white text-[var(--dh-green)] hover:bg-white/90"
              onClick={() => {
                const msg = encodeURIComponent("Hola DULCE HABANA! Quiero consultar entrega en mi zona.");
                window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${msg}`, "_blank");
              }}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Consultar por WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <InfoCard
          icon={<Truck className="h-5 w-5" />}
          title="Entrega misma día"
          text="Pedidos antes de las 2pm se entregan el mismo día. Después de esa hora, al día siguiente."
        />
        <InfoCard
          icon={<MessageCircle className="h-5 w-5" />}
          title="Pago por WhatsApp"
          text="Aceptamos transferencia, efectivo contra entrega y otras opciones que coordinamos por WhatsApp."
        />
        <InfoCard
          icon={<Clock className="h-5 w-5" />}
          title="Pedidos anticipados"
          text="Combos y pedidos grandes requieren anticipación de 24h. Lo coordinamos al confirmar."
        />
      </div>
    </div>
  );
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--dh-green-light)] text-[var(--dh-green)]">
        {icon}
      </div>
      <h3 className="mt-3 font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
