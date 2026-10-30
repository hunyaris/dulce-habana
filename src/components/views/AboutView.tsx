"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { STORE_CONFIG } from "@/lib/store-config";
import { Heart, Sparkles, Clock, ArrowRight } from "lucide-react";

export function AboutView() {
  const { setView, setCatalogCategory } = useAppStore();

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-[var(--dh-green)]/70" />
        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center text-white">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--dh-gold)]">
              Nuestra historia
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Nacimos en una cocina habanera
            </h1>
            <p className="mt-4 text-base text-white/90 md:text-lg">
              Con las recetas de la abuela, un horno casero y muchas ganas de
              endulzar la isla.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <div className="space-y-6 text-base leading-relaxed text-foreground/80">
          <p>
            DULCE HABANA empezó en una cocina pequeña de Centro Habana, donde
            doña Carmen horneaba panetelas borrachas los domingos para la familia.
            Los vecinos olían el ron y el azúcar desde la calle, y pronto empezaron
            a tocar la puerta preguntando si sobraba alguna.
          </p>
          <p>
            Tres generaciones después, seguimos usando las mismas recetas: panetelas
            con ron añejo, flan de coco con coco fresco rallado, panqués de naranja
            con fruta cubana. Nada de mezclas industriales, nada de conservadores.
            Cada dulce se hace en pequeñas tandas, a mano, como se debe.
          </p>
          <p>
            Hoy vendemos por WhatsApp porque así nos gusta: hablar con cada cliente,
            saber para quién es el pedido (¿cumpleaños? ¿antigüo de alguien? ¿un
            domingo de mimos?), coordinar la entrega en moto o bicicleta por toda
            La Habana. No usamos apps de pago ni plataformas raras. El trato es
            cercano, como el barrio.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[var(--dh-green-light)]">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <h2 className="text-center font-serif text-3xl font-semibold tracking-tight text-[var(--dh-green)] md:text-4xl">
            Lo que nos mueve
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <ValueItem
              icon={<Heart className="h-7 w-7" />}
              title="Hecho a mano"
              text="Cada panetela se hornea en budare pequeño. Cada flan se baña en caramelo hecho en sartén. Cada panqué se bate a mano cuando hace falta. Sin atajos."
            />
            <ValueItem
              icon={<Sparkles className="h-7 w-7" />}
              title="Ingredientes cubanos"
              text="Mango de la isla, guayaba cubana, ron añejo, coco fresco. Compramos a productores locales cuando podemos. Sabor que solo crece aquí."
            />
            <ValueItem
              icon={<Clock className="h-7 w-7" />}
              title="Recetas heredadas"
              text="Las recetas pasaron de Carmen a su hija, de ella a nosotras. Las respetamos: nada de versiones light, nada de sustitutos. Azúcar, huevos, mantequilla y amor."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center md:px-6 md:py-24">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-[var(--dh-green)] md:text-4xl">
          ¿List@ para endulzar tu día?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          Explora el menú o escríbenos directamente por WhatsApp para un pedido
          especial.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            className="rounded-full bg-[var(--dh-green)] hover:bg-[var(--dh-green-bright)]"
            onClick={() => {
              setCatalogCategory(null);
              setView("catalog");
            }}
          >
            Ver el menú
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-[var(--dh-green)] text-[var(--dh-green)]"
            onClick={() => {
              const msg = encodeURIComponent("Hola DULCE HABANA! Quiero hacer un pedido especial.");
              window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${msg}`, "_blank");
            }}
          >
            Escribir por WhatsApp
          </Button>
        </div>
      </section>
    </div>
  );
}

function ValueItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-5">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-[var(--dh-green)]">
        {icon}
      </div>
      <div>
        <h3 className="font-serif text-xl font-semibold text-[var(--dh-green)]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--dh-green)]/70">{text}</p>
      </div>
    </div>
  );
}
