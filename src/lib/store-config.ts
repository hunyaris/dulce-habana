// =====================================================
// DULCE HABANA - Configuración de la dulcería
// =====================================================

export const STORE_CONFIG = {
  // Marca
  name: "Elvina's",
  tagline: "Sabor casero. Artesanal.",
  slogan: "Sabor casero. Artesanal.",

  // WhatsApp de la dulcería (formato internacional sin + ni espacios)
  // 53 + 5XXXXXXXX = Cuba móvil
  whatsappNumber: "53512345678",

  // Email e Instagram
  email: "pedidos@dulcehabana.cu",
  instagram: "@dulcehabana",
  city: "La Habana, Cuba",

  // Horario
  hours: "Lun-Dom · 9:00 AM - 8:00 PM",
  deliveryHours: "Entregas: 10:00 AM - 7:00 PM",

  // Moneda (precios en CUP)
  currency: "CUP",

  // Pago SIEMPRE por WhatsApp - sin excepciones, sin plataformas
  paymentNote: "Pago y entrega se coordinan por WhatsApp",

  // Tarifa de envío base (se suma a la tarifa por zona)
  baseDeliveryFee: 0,
};

// Zonas de entrega con sus tarifas (también se cargan desde BD en runtime)
export const DEFAULT_DELIVERY_ZONES = [
  { name: "Habana Vieja", fee: 100, estimatedMin: 45 },
  { name: "Centro Habana", fee: 100, estimatedMin: 45 },
  { name: "Vedado", fee: 150, estimatedMin: 60 },
  { name: "Miramar", fee: 200, estimatedMin: 60 },
  { name: "Playa", fee: 250, estimatedMin: 75 },
  { name: "Plaza de la Revolución", fee: 150, estimatedMin: 60 },
  { name: "Cerro", fee: 200, estimatedMin: 75 },
  { name: "Diez de Octubre", fee: 200, estimatedMin: 75 },
  { name: "Otro municipio (recoger en tienda)", fee: 0, estimatedMin: 0 },
];

// Opciones de horario de entrega
export const DELIVERY_TIME_OPTIONS = [
  "Lo antes posible",
  "Hoy entre 12:00 y 14:00",
  "Hoy entre 14:00 y 16:00",
  "Hoy entre 16:00 y 18:00",
  "Hoy entre 18:00 y 20:00",
  "Mañana por la mañana",
  "Mañana por la tarde",
];

// Construye el mensaje de WhatsApp con los datos de la orden
export function buildWhatsAppMessage(params: {
  orderNumber: string;
  customerName: string;
  items: { name: string; quantity: number; price: number; notes?: string }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryZone: string;
  address: string;
  deliveryTime: string;
  notes?: string;
}): string {
  const lines: string[] = [];
  lines.push(`Hola ${STORE_CONFIG.name}!`);
  lines.push(`Quiero hacer este pedido:`);
  lines.push("");
  lines.push(`*Orden:* ${params.orderNumber}`);
  lines.push("");
  lines.push("*Productos:*");
  params.items.forEach((it) => {
    lines.push(
      `• ${it.quantity}x ${it.name} — ${formatCUP(it.price * it.quantity)}`
    );
    if (it.notes) {
      lines.push(`   Notas: ${it.notes}`);
    }
  });
  lines.push("");
  lines.push(`*Subtotal:* ${formatCUP(params.subtotal)}`);
  lines.push(`*Envío (${params.deliveryZone}):* ${formatCUP(params.deliveryFee)}`);
  lines.push(`*Total:* ${formatCUP(params.total)}`);
  lines.push("");
  lines.push("*Entrega:*");
  lines.push(`• ${params.address}`);
  lines.push(`• Zona: ${params.deliveryZone}`);
  lines.push(`• Horario: ${params.deliveryTime}`);
  if (params.notes) {
    lines.push(`• Notas: ${params.notes}`);
  }
  lines.push("");
  lines.push(`*Mi nombre:* ${params.customerName}`);
  lines.push("");
  lines.push("¿Cómo procedemos con el pago? Gracias.");

  return lines.join("\n");
}

// Construye la URL de WhatsApp con el mensaje pre-lleno
export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encoded}`;
}

// Formatea precio en CUP
export function formatCUP(amount: number): string {
  return `${Math.round(amount)} CUP`;
}
