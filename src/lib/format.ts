// Utilidades para la dulcería DULCE HABANA

// Categorías de productos
export const CATEGORIES = {
  PANETELAS: "Panetelas",
  PANQUES: "Panqués",
  FLAN: "Flan",
  BEBIDAS: "Bebidas",
  COMBOS: "Combos",
} as const;

// Los iconos ahora se manejan con Lucide en src/lib/category-icons.tsx

export const ORDER_STATUS = {
  PENDING_WHATSAPP: "Esperando confirmación",
  CONFIRMED: "Confirmada",
  PREPARING: "Preparando",
  OUT_FOR_DELIVERY: "En camino",
  DELIVERED: "Entregada",
  CANCELLED: "Cancelada",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  REFUNDED: "Reembolsado",
} as const;

export const PRODUCT_STATUS = {
  ACTIVE: "Disponible",
  INACTIVE: "No disponible",
} as const;

// Formatear fecha en español
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-CU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-CU", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// Generar número de orden
export function generateOrderNumber(): string {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DH-${ymd}-${rand}`;
}

// Sluggify
export function slugify(str: string): string {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
