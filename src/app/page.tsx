"use client";

import { useAppStore } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/shared/CartDrawer";
import { AnimatedView } from "@/components/shared/AnimatedView";
import { HomeView } from "@/components/views/HomeView";
import { CatalogView } from "@/components/views/CatalogView";
import { ProductView } from "@/components/views/ProductView";
import { CartView } from "@/components/views/CartView";
import { CheckoutView, OrderSuccessView } from "@/components/views/CheckoutView";
import { LoginView } from "@/components/views/LoginView";
import { AdminView } from "@/components/views/AdminView";
import { AboutView } from "@/components/views/AboutView";
import { DeliveryZonesView } from "@/components/views/DeliveryZonesView";

export default function Home() {
  const { view } = useAppStore();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AnimatedView>
          {view === "home" && <HomeView />}
          {view === "catalog" && <CatalogView />}
          {view === "product" && <ProductView />}
          {view === "cart" && <CartView />}
          {view === "checkout" && <CheckoutView />}
          {view === "order-success" && <OrderSuccessView />}
          {view === "login" && <LoginView />}
          {view === "admin" && <AdminView />}
          {view === "about" && <AboutView />}
          {view === "delivery-zones" && <DeliveryZonesView />}
        </AnimatedView>
      </main>
      <Footer />
      {/* Cart drawer global - desliza desde la derecha */}
      <CartDrawer />
    </div>
  );
}
