"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewName =
  | "home"
  | "catalog"
  | "product"
  | "cart"
  | "checkout"
  | "order-success"
  | "login"
  | "admin"
  | "about"
  | "delivery-zones";

interface CartItemState {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  notes?: string;
}

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN";
}

interface AppState {
  // Navigation
  view: ViewName;
  selectedProductId: string | null;
  catalogCategory: string | null;
  setView: (v: ViewName) => void;
  openProduct: (id: string) => void;
  setCatalogCategory: (cat: string | null) => void;

  // Cart (no requiere login)
  cart: CartItemState[];
  addToCart: (item: CartItemState) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Cart drawer (desliza desde la derecha)
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  // Session (solo admin)
  user: SessionUser | null;
  setUser: (u: SessionUser | null) => void;
  logout: () => void;

  // Last order
  lastOrderId: string | null;
  setLastOrderId: (id: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: "home",
      selectedProductId: null,
      catalogCategory: null,

      setView: (v) => {
        set({ view: v });
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },

      openProduct: (id) => {
        set({ selectedProductId: id, view: "product" });
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },

      setCatalogCategory: (cat) => set({ catalogCategory: cat }),

      cart: [],

      addToCart: (item) => {
        const existing = get().cart.find((c) => c.productId === item.productId);
        if (existing) {
          set({
            cart: get().cart.map((c) =>
              c.productId === item.productId ? { ...c, quantity: c.quantity + 1 } : c
            ),
          });
        } else {
          set({ cart: [...get().cart, item] });
        }
      },

      removeFromCart: (productId) =>
        set({ cart: get().cart.filter((c) => c.productId !== productId) }),

      updateQuantity: (productId, qty) => {
        if (qty <= 0) {
          set({ cart: get().cart.filter((c) => c.productId !== productId) });
          return;
        }
        set({
          cart: get().cart.map((c) =>
            c.productId === productId ? { ...c, quantity: qty } : c
          ),
        });
      },

      updateNotes: (productId, notes) =>
        set({
          cart: get().cart.map((c) =>
            c.productId === productId ? { ...c, notes } : c
          ),
        }),

      clearCart: () => set({ cart: [] }),

      cartTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),

      // Cart drawer
      cartOpen: false,
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),

      user: null,
      setUser: (u) => set({ user: u }),
      logout: () => set({ user: null, view: "home" }),

      lastOrderId: null,
      setLastOrderId: (id) => set({ lastOrderId: id }),
    }),
    {
      name: "dulce-habana-store",
      partialize: (state) => ({
        cart: state.cart,
        user: state.user,
      }),
    }
  )
);
