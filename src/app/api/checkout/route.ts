import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/format";
import { rateLimit, getClientIP, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";

// POST /api/checkout - Crea orden SIEMPRE con método WhatsApp
// Body: { items: [{productId, quantity, notes?}], customer, delivery }
export async function POST(req: NextRequest) {
  try {
    // === RATE LIMITING ===
    const clientIP = getClientIP(req);
    const rateResult = rateLimit(clientIP, RATE_LIMITS.CHECKOUT);

    if (!rateResult.success) {
      const retryAfter = Math.ceil((rateResult.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: "Demasiados pedidos en poco tiempo. Intenta de nuevo en " +
            Math.ceil(retryAfter / 60) + " minutos.",
        },
        {
          status: 429,
          headers: {
            ...getRateLimitHeaders(rateResult),
            "Retry-After": retryAfter.toString(),
          },
        }
      );
    }

    const body = await req.json();
    const { items, customer, delivery } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    if (!customer?.name || !customer?.phone || !delivery?.address) {
      return NextResponse.json(
        { error: "Faltan datos del cliente o entrega" },
        { status: 400 }
      );
    }

    // Validar productos
    const productIds = items.map((i: any) => i.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds }, status: "ACTIVE" },
    });

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: "Uno o más productos no están disponibles" },
        { status: 400 }
      );
    }

    // Calcular subtotal
    const subtotal = items.reduce((sum: number, item: any) => {
      const p = products.find((pr) => pr.id === item.productId);
      return sum + (p?.price || 0) * item.quantity;
    }, 0);

    // Buscar zona de entrega para obtener tarifa
    let deliveryFee = 0;
    let deliveryZoneName = delivery.zone || "Sin especificar";
    if (delivery.zoneId) {
      const zone = await db.deliveryZone.findUnique({
        where: { id: delivery.zoneId },
      });
      if (zone) {
        deliveryFee = zone.fee;
        deliveryZoneName = zone.name;
      }
    } else if (delivery.zone) {
      // buscar por nombre
      const zone = await db.deliveryZone.findFirst({
        where: { name: delivery.zone },
      });
      if (zone) {
        deliveryFee = zone.fee;
        deliveryZoneName = zone.name;
      }
    }

    const total = subtotal + deliveryFee;

    // Crear orden SIEMPRE con método WhatsApp
    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        status: "PENDING_WHATSAPP",
        customerName: customer.name,
        customerPhone: customer.phone,
        deliveryZoneId: delivery.zoneId || null,
        deliveryZoneName,
        deliveryAddress: delivery.address,
        deliveryTime: delivery.time || "Lo antes posible",
        deliveryFee,
        notes: delivery.notes || null,
        subtotal,
        total,
        paymentMethod: "WHATSAPP",
        paymentStatus: "PENDING",
      },
    });

    // Crear items
    for (const item of items) {
      const p = products.find((pr) => pr.id === item.productId);
      if (!p) continue;
      await db.orderItem.create({
        data: {
          orderId: order.id,
          productId: p.id,
          productName: p.name,
          productImage: p.image,
          price: p.price,
          quantity: item.quantity,
          notes: item.notes || null,
        },
      });
    }

    return NextResponse.json({ order, success: true });
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json(
      { error: "Error al crear la orden" },
      { status: 500 }
    );
  }
}
