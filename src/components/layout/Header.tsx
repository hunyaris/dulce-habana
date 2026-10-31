"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CATEGORIES } from "@/lib/format";
import { CategoryIcon } from "@/lib/category-icons";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const {
    view,
    setView,
    setCatalogCategory,
    cartCount,
    user,
    logout,
    openCart,
  } = useAppStore();

  const goToCatalog = (cat: string | null) => {
    setCatalogCategory(cat);
    setView("catalog");
    setMobileOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCatalogCategory(null);
    setView("catalog");
    setSearchOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("dh-search", searchValue);
    }
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--dh-green)] text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 max-w-full bg-[var(--dh-green)] text-white border-white/10">
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <div className="mt-6 flex flex-col gap-1">
              <Button
                variant="ghost"
                className="justify-start text-base font-medium hover:bg-white/10 text-white"
                onClick={() => {
                  setView("home");
                  setMobileOpen(false);
                }}
              >
                Inicio
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-base font-medium hover:bg-white/10 text-white"
                onClick={() => goToCatalog(null)}
              >
                Ver todo el menú
              </Button>
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <Button
                  key={key}
                  variant="ghost"
                  className="justify-start text-base font-normal hover:bg-white/10 text-white"
                  onClick={() => goToCatalog(key)}
                >
                  <CategoryIcon category={key} className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              ))}
              <div className="my-2 h-px bg-white/20" />
              <Button
                variant="ghost"
                className="justify-start text-base font-medium hover:bg-white/10 text-white"
                onClick={() => {
                  setView("delivery-zones");
                  setMobileOpen(false);
                }}
              >
                Zonas de entrega
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-base font-medium hover:bg-white/10 text-white"
                onClick={() => {
                  setView("about");
                  setMobileOpen(false);
                }}
              >
                Sobre nosotras
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo Elvina's */}
        <button
          onClick={() => setView("home")}
          className="font-display text-2xl font-semibold tracking-wider text-white md:text-3xl"
        >
          Elvira's
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-medium text-white hover:bg-white/10"
            onClick={() => goToCatalog(null)}
          >
            Menú
          </Button>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-white hover:bg-white/10"
              onClick={() => goToCatalog(key)}
            >
              {label}
            </Button>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-white hover:bg-white/10"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Admin access */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  aria-label="Cuenta"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setView("admin")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Panel administrativo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          {/* Cart button - ahora abre drawer en lugar de navegar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            className="relative text-white hover:bg-white/10"
            aria-label="Carrito"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount() > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--dh-gold)] px-1 text-[10px] font-bold text-[var(--dh-green)]">
                {cartCount()}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Search bar expandable */}
      {searchOpen && (
        <div className="border-t border-white/10 bg-[var(--dh-green)]">
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 md:px-6"
          >
            <Search className="h-4 w-4 text-white/70" />
            <input
              autoFocus
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Busca un dulce..."
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/60"
            />
            <Button type="submit" size="sm" className="bg-white text-[var(--dh-green)] hover:bg-white/90">
              Buscar
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </header>
  );
}
