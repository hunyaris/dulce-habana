"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { ProductCard } from "@/components/shared/ProductCard";
import { Marquee } from "@/components/shared/Marquee";
import { Sticker } from "@/components/shared/Sticker";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { CATEGORIES } from "@/lib/format";
import { CategoryIcon } from "@/lib/category-icons";

export function CatalogView() {
  const { catalogCategory, setCatalogCategory } = useAppStore();
  const [sort, setSort] = useState("CATEGORY");
  const [search, setSearch] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const s = window.localStorage.getItem("dh-search");
    if (s) {
      window.localStorage.removeItem("dh-search");
      return s;
    }
    return "";
  });

  const fetchKey = `${catalogCategory || "all"}|${search || ""}`;
  const [data, setData] = useState<{ key: string; products: any[] }>({
    key: "",
    products: [],
  });
  const loading = data.key !== fetchKey;
  const products = data.key === fetchKey ? data.products : [];

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (catalogCategory) params.set("category", catalogCategory);
    if (search) params.set("search", search);

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setData({ key: fetchKey, products: d.products || [] });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData({ key: fetchKey, products: [] });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetchKey]);

  // Agrupar por categoría si no hay filtro
  const grouped = useMemo(() => {
    if (catalogCategory) return [{ cat: catalogCategory, items: products }];
    const groups: { cat: string; items: any[] }[] = [];
    for (const cat of Object.keys(CATEGORIES)) {
      const items = products.filter((p) => p.category === cat);
      if (items.length > 0) groups.push({ cat, items });
    }
    return groups;
  }, [products, catalogCategory]);

  // Ordenar dentro de cada grupo
  const sortedGroups = useMemo(() => {
    return grouped.map((g) => ({
      ...g,
      items: [...g.items].sort((a, b) => {
        if (sort === "PRICE_ASC") return a.price - b.price;
        if (sort === "PRICE_DESC") return b.price - a.price;
        if (sort === "NAME") return a.name.localeCompare(b.name);
        return 0; // CATEGORY - mantener orden
      }),
    }));
  }, [grouped, sort]);

  const title = catalogCategory
    ? CATEGORIES[catalogCategory as keyof typeof CATEGORIES]
    : search
    ? `Resultados para "${search}"`
    : "Todo el menú";

  return (
    <div>
      {/* Banner superior con marquee */}
      {!catalogCategory && (
        <div className="bg-[var(--dh-green)] py-3 border-y-2 border-[var(--dh-gold)]">
          <Marquee
            items={["PANETELAS", "PANQUES", "FLAN", "BEBIDAS", "COMBOS", "TODO FRESCO"]}
            variant="filled"
            textColor="white"
            speed="fast"
            separator="★"
          />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Header con sticker */}
        <ScrollReveal className="mb-6">
          <div>
            <Sticker variant={catalogCategory ? "yellow" : "mint"} rotate={-3} className="inline-block mb-2">
              ✦ Menu ✦
            </Sticker>
            <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl text-[var(--dh-green)] text-pop">
              {title.toUpperCase()}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? "producto" : "productos"} disponibles
            </p>
          </div>
        </ScrollReveal>

        {/* Category pills estilo Starbucks con hover scale */}
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-border pb-4">
          <button
            onClick={() => setCatalogCategory(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all hover:scale-105 flex items-center gap-1.5 ${
              !catalogCategory
                ? "bg-[var(--dh-green)] text-white"
                : "bg-[var(--dh-cream)] text-[var(--dh-green)] hover:bg-[var(--dh-green-light)]"
            }`}
          >
            Todo
          </button>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCatalogCategory(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all hover:scale-105 flex items-center gap-1.5 ${
                catalogCategory === key
                  ? "bg-[var(--dh-green)] text-white"
                  : "bg-[var(--dh-cream)] text-[var(--dh-green)] hover:bg-[var(--dh-green-light)]"
              }`}
            >
              <CategoryIcon category={key} className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="ml-auto rounded-full border border-border bg-card px-3 py-1.5 text-sm"
          >
            <option value="CATEGORY">Por categoría</option>
            <option value="PRICE_ASC">Precio: menor a mayor</option>
            <option value="PRICE_DESC">Precio: mayor a menor</option>
            <option value="NAME">Nombre (A-Z)</option>
          </select>
        </div>

      {/* Grid por categorías */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : sortedGroups.length === 0 || sortedGroups.every((g) => g.items.length === 0) ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <span className="text-4xl font-display text-[var(--dh-green)]">SIN RESULTADOS</span>
          <p className="text-muted-foreground">
            No encontramos dulces con estos filtros.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {sortedGroups.map((group) => (
            <ScrollReveal key={group.cat}>
              <div>
                {!catalogCategory && (
                  <div className="mb-4 flex items-center gap-3">
                    <Sticker variant="mint" rotate={-2}>
                      <CategoryIcon category={group.cat} className="h-3 w-3" />
                      {CATEGORIES[group.cat as keyof typeof CATEGORIES]}
                    </Sticker>
                    <span className="text-xs text-muted-foreground">
                      {group.items.length} {group.items.length === 1 ? "opcion" : "opciones"}
                    </span>
                  </div>
                )}
                <ScrollReveal stagger>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {group.items.map((p, i) => (
                      <ProductCard key={p.id} product={p} index={i} />
                    ))}
                  </div>
                </ScrollReveal>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
