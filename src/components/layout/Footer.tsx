"use client";

import { useAppStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/format";
import { STORE_CONFIG } from "@/lib/store-config";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const { setView, setCatalogCategory } = useAppStore();

  return (
    <footer className="mt-auto bg-[var(--dh-green)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl tracking-wider">
              Elvina's
            </span>
            <p className="mt-3 max-w-xs text-sm text-white/70">
              Sabor casero. Artesanal. Recetas tradicionales hechas a mano
              con ingredientes frescos de la isla.
            </p>
          </div>

          {/* Menú */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--dh-gold)]">
              Menú
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <li key={key}>
                  <button
                    className="hover:text-white transition-colors"
                    onClick={() => {
                      setCatalogCategory(key);
                      setView("catalog");
                    }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--dh-gold)]">
              Información
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <button
                  className="hover:text-white transition-colors"
                  onClick={() => setView("delivery-zones")}
                >
                  Zonas de entrega
                </button>
              </li>
              <li>
                <button
                  className="hover:text-white transition-colors"
                  onClick={() => setView("about")}
                >
                  Sobre nosotras
                </button>
              </li>
              <li className="text-white/70">{STORE_CONFIG.hours}</li>
              <li className="text-white/70">{STORE_CONFIG.deliveryHours}</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--dh-gold)]">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>{STORE_CONFIG.instagram}</li>
              <li>{STORE_CONFIG.email}</li>
              <li>{STORE_CONFIG.city}</li>
            </ul>
            {/* Staff link discreto */}
            <button
              onClick={() => setView("login")}
              className="mt-4 text-xs text-white/40 underline hover:text-white/70"
            >
              Acceso staff
            </button>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} DULCE HABANA. Hecho con azúcar y amor en La Habana.</p>
          <div className="flex gap-6">
            <span>Pedidos solo por WhatsApp</span>
            <span>Sin pagos online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
