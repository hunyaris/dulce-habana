"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { ProductCard } from "@/components/shared/ProductCard";
import { WaveDivider } from "@/components/shared/WaveDivider";
import { Marquee } from "@/components/shared/Marquee";
import { Sticker } from "@/components/shared/Sticker";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/format";
import { CategoryIcon } from "@/lib/category-icons";
import { STORE_CONFIG, formatCUP } from "@/lib/store-config";
import {
  ArrowRight,
  MapPin,
  MessageCircle,
  Heart,
  Clock,
  ShoppingBag,
  Truck,
  Sparkles,
} from "lucide-react";

const MARQUEE_ITEMS = [
  "PANETELAS", "FLAN", "PANQUES", "CAFE", "BATIDOS", "COMBOS", "DULCES", "HECHO A MANO",
];

export function HomeView() {
  const { setView, setCatalogCategory } = useAppStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=4")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero verde con decoraciones geométricas (sin emojis) */}
      <section className="relative bg-[var(--dh-green)] text-white overflow-hidden">
        {/* Decoraciones geométricas de fondo */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[5%] top-[15%] h-12 w-12 rounded-full border-4 border-white/20 animate-float-slow" />
          <div className="absolute right-[8%] top-[25%] h-8 w-8 rounded-full bg-[var(--dh-gold)]/30 animate-float-medium" />
          <div className="absolute left-[15%] bottom-[20%] h-6 w-6 rounded-full bg-white/20 animate-float-fast" />
          <div className="absolute right-[20%] bottom-[15%] h-10 w-10 rounded-full border-4 border-[var(--dh-gold)]/40 animate-float-slow" />
          <div className="absolute left-[45%] top-[8%] h-4 w-4 rounded-full bg-white/30 animate-float-medium" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <div className="mb-6">
                <Sticker variant="yellow" rotate={-3}>
                  <Sparkles className="h-3 w-3" />
                  {STORE_CONFIG.tagline}
                </Sticker>
              </div>

              <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tight md:text-8xl">
                <span className="block text-pop-white">ELVIRA'S</span>
              </h1>

              <p className="mt-3 text-base text-white/80 md:text-lg">
                <span className="font-display text-2xl tracking-wider text-[var(--dh-teal-light)]">
                  SABOR CASERO. ARTESANAL.
                </span>
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => {
                    setCatalogCategory(null);
                    setView("catalog");
                  }}
                  className="btn-stamp rounded-full bg-white text-[var(--dh-green)] hover:bg-white/90 text-base"
                >
                  Ver el menu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  onClick={() => setView("delivery-zones")}
                  className="btn-stamp rounded-full border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 text-base backdrop-blur-sm"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Zonas de entrega
                </Button>
              </div>
            </div>

            {/* Logo Elvira's en círculo (sin borde blanco - zoom para recortar margen) */}
            <div className="relative hidden md:block">
              <div className="relative aspect-square overflow-hidden rounded-full animate-float-slow shadow-2xl">
                <img
                  src="/elviras-logo.png"
                  alt="Elvira's - Sabor casero. Artesanal."
                  className="h-full w-full object-cover scale-125"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee infinito */}
      <div className="bg-[var(--dh-cream)] py-4 border-y-2 border-[var(--dh-green)]">
        <Marquee
          items={["ELVIRA'S", "PANETELAS", "FLAN", "PANQUES", "CAFE", "BATIDOS", "COMBOS", "SABOR CASERO"]}
          variant="filled"
          textColor="var(--dh-teal)"
          speed="normal"
        />
      </div>

      {/* Categorías */}
      {/* Sección ELIGE TU ANTOJO con fondo teal del logo */}
      <section className="bg-[var(--dh-teal)] py-12 relative overflow-hidden">
        <ScrollReveal className="mx-auto max-w-7xl px-4 md:px-6 relative">
          <div className="text-center mb-8">
            <span className="inline-block mb-3 px-4 py-1.5 rounded-full bg-white text-[var(--dh-teal)] text-xs font-bold uppercase tracking-wider border-2 border-white">
              Explora
            </span>
            <h2 className="font-display text-4xl font-bold text-white md:text-6xl">
              ELIGE TU ANTOJO
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {Object.entries(CATEGORIES).map(([key, label], i) => (
              <button
                key={key}
                onClick={() => {
                  setCatalogCategory(key);
                  setView("catalog");
                }}
                className="group card-hover-lift flex flex-col items-center gap-2 rounded-2xl bg-white p-6 border-2 border-white/30 transition-all hover:border-white hover:scale-105"
                style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
              >
                <CategoryIcon
                  category={key}
                  className="h-10 w-10 text-[var(--dh-teal)] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12"
                />
                <span className="font-display text-xl text-[var(--dh-teal)]">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <WaveDivider color="var(--dh-cream)" variant="wave" className="-mt-px" />

      {/* Productos destacados */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <ScrollReveal>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <Sticker variant="mint" rotate={-3} className="inline-block mb-2">
                Recien horneado
              </Sticker>
              <h2 className="font-display text-4xl font-bold tracking-tight text-[var(--dh-green)] md:text-6xl">
                NUESTRAS DELICIAS
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setCatalogCategory(null);
                setView("catalog");
              }}
              className="hidden md:flex text-[var(--dh-green)]"
            >
              Ver todo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : (
          <ScrollReveal stagger>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* Cómo funciona - verde con ondas, SIN números */}
      <WaveDivider color="var(--dh-green)" variant="blob" />
      <section className="bg-[var(--dh-green)] py-12 md:py-16 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute right-10 top-10 h-8 w-8 rounded-full border-4 border-white/20 animate-float-medium" />
          <div className="absolute left-10 bottom-10 h-6 w-6 rounded-full bg-[var(--dh-gold)]/40 animate-float-slow" />
        </div>

        <div className="mx-auto max-w-7xl px-4 md:px-6 relative">
          <ScrollReveal className="text-center mb-10">
            <Sticker variant="yellow" rotate={-3} className="inline-block mb-3">
              Simple
            </Sticker>
            <h2 className="font-display text-4xl font-bold md:text-6xl">
              PEDIR ES FACIL
            </h2>
            <p className="mt-2 text-white/80">
              Tres pasos y listo. Pago y entrega se coordinan por WhatsApp.
            </p>
          </ScrollReveal>

          <ScrollReveal stagger className="grid gap-8 md:grid-cols-3">
            <Step
              icon={<ShoppingBag className="h-7 w-7" />}
              title="Elige tus dulces"
              text="Navega el menu y añade lo que te antoje al carrito. Panetelas, panques, flan y mas."
            />
            <Step
              icon={<MessageCircle className="h-7 w-7" />}
              title="Confirma por WhatsApp"
              text="Al finalizar, se abre WhatsApp con tu pedido completo. Solo revisas y envias."
            />
            <Step
              icon={<Truck className="h-7 w-7" />}
              title="Recibe en casa"
              text="Coordinamos pago y entrega por WhatsApp. Entregamos en toda La Habana."
            />
          </ScrollReveal>
        </div>
      </section>
      <WaveDivider color="var(--dh-green)" variant="wave" flip />

      {/* Compromiso */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <ScrollReveal stagger className="grid gap-6 md:grid-cols-3">
          <ValueCard
            icon={<Heart className="h-6 w-6" />}
            title="Hecho a mano"
            text="Cada panetela, panque y flan se prepara artesanalmente en pequeñas tandas. Sin atajos industriales."
            sticker="Artesanal"
            rotate={-1}
          />
          <ValueCard
            icon={<Clock className="h-6 w-6" />}
            title="Recetas tradicionales"
            text="Las recetas pasaron de abuelas a madres a hijas. Sabores cubanos autenticos que despiertan recuerdos."
            sticker="Tradicional"
            rotate={1}
          />
          <ValueCard
            icon={<MessageCircle className="h-6 w-6" />}
            title="Atencion cercana"
            text="No eres un numero de orden. Te atendemos por WhatsApp como en la vecindad: con nombre y cariño."
            sticker="Cercana"
            rotate={-1}
          />
        </ScrollReveal>
      </section>

      {/* Marquee outline text */}
      <div className="bg-[var(--dh-green-light)] py-8 border-y-2 border-[var(--dh-green)]">
        <Marquee
          items={["ELVIRA'S", "SABOR CASERO", "ARTESANAL", "HECHO A MANO"]}
          variant="outline"
          textColor="var(--dh-green)"
          separator="★"
          speed="slow"
        />
      </div>

      {/* CTA WhatsApp */}
      <section className="bg-[var(--dh-cream)] py-12 md:py-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-10 top-10 h-6 w-6 rounded-full border-4 border-[var(--dh-green)]/30 animate-float-slow" />
          <div className="absolute right-10 bottom-10 h-8 w-8 rounded-full bg-[var(--dh-gold)]/40 animate-float-medium" />
        </div>

        <ScrollReveal className="mx-auto max-w-4xl px-4 text-center md:px-6 relative">
          <h2 className="font-display text-5xl font-bold text-[var(--dh-green)] md:text-7xl text-pop">
            ¿UN PEDIDO ESPECIAL?
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Escribenos directamente por WhatsApp. Respondemos rapido.
          </p>
          <Button
            size="lg"
            className="mt-6 btn-stamp rounded-full bg-[var(--dh-green)] hover:bg-[var(--dh-green-bright)] text-base"
            onClick={() => {
              const msg = encodeURIComponent("Hola DULCE HABANA! Tengo una consulta.");
              window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${msg}`, "_blank");
            }}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Escribir por WhatsApp
          </Button>
        </ScrollReveal>
      </section>
    </div>
  );
}

function Step({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="text-center">
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-[var(--dh-green)] shadow-md border-4 border-[var(--dh-gold)]">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-2xl text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/70">{text}</p>
    </div>
  );
}

function ValueCard({ icon, title, text, sticker, rotate }: { icon: React.ReactNode; title: string; text: string; sticker: string; rotate: number }) {
  return (
    <div
      className="card-hover-lift relative rounded-2xl border-2 border-[var(--dh-green)]/15 bg-card p-6"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="absolute -top-3 -right-3 animate-wiggle">
        <span className="sticker sticker-mint text-[10px]">
          {sticker}
        </span>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--dh-green-light)] text-[var(--dh-green)]">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-2xl text-[var(--dh-green)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
