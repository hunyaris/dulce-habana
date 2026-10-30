import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin?action=stats - Estadísticas
// GET /api/admin?action=products - Lista productos
// GET /api/admin?action=orders - Lista órdenes
// GET /api/admin?action=zones - Lista zonas
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "stats") {
      const [products, activeProducts, orders, pendingOrders, zones] =
        await Promise.all([
          db.product.count(),
          db.product.count({ where: { status: "ACTIVE" } }),
          db.order.count(),
          db.order.count({ where: { status: "PENDING_WHATSAPP" } }),
          db.deliveryZone.count({ where: { active: true } }),
        ]);

      const revenue = await db.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"] } },
      });

      // Productos por categoría
      const byCategory = await db.product.groupBy({
        by: ["category"],
        _count: { id: true },
        where: { status: "ACTIVE" },
      });

      // Ventas últimos 6 meses
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const recentOrders = await db.order.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        orderBy: { createdAt: "asc" },
      });
      const monthlyData: Record<string, { revenue: number; orders: number }> = {};
      for (const o of recentOrders) {
        const key = o.createdAt.toISOString().slice(0, 7);
        if (!monthlyData[key]) monthlyData[key] = { revenue: 0, orders: 0 };
        monthlyData[key].revenue += o.total;
        monthlyData[key].orders += 1;
      }

      // Top productos vendidos
      const topItems = await db.orderItem.groupBy({
        by: ["productId", "productName"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      });

      return NextResponse.json({
        counts: { products, activeProducts, orders, pendingOrders, zones },
        revenue: revenue._sum.total || 0,
        byCategory: byCategory.map((c) => ({
          category: c.category,
          count: c._count.id,
        })),
        monthlyData: Object.entries(monthlyData).map(([month, data]) => ({
          month,
          ...data,
        })),
        topProducts: topItems.map((t) => ({
          name: t.productName,
          quantity: t._sum.quantity,
        })),
      });
    }

    if (action === "products") {
      const products = await db.product.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ products });
    }

    if (action === "orders") {
      const orders = await db.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({
        orders: orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          status: o.status,
          customerName: o.customerName,
          customerPhone: o.customerPhone,
          deliveryZoneName: o.deliveryZoneName,
          deliveryAddress: o.deliveryAddress,
          deliveryTime: o.deliveryTime,
          deliveryFee: o.deliveryFee,
          notes: o.notes,
          subtotal: o.subtotal,
          total: o.total,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          createdAt: o.createdAt,
          items: o.items.map((i) => ({
            id: i.id,
            productName: i.productName,
            productImage: i.productImage,
            price: i.price,
            quantity: i.quantity,
            notes: i.notes,
          })),
        })),
      });
    }

    if (action === "zones") {
      const zones = await db.deliveryZone.findMany({
        orderBy: { fee: "asc" },
      });
      return NextResponse.json({ zones });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (e) {
    console.error("Admin GET error:", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST /api/admin?action=update-order-status - Cambiar estado de orden
// POST /api/admin?action=create-zone - Crear zona
// POST /api/admin?action=update-zone - Actualizar zona
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const body = await req.json();

    if (action === "update-order-status") {
      const { orderId, status } = body;
      const updated = await db.order.update({
        where: { id: orderId },
        data: { status },
      });
      return NextResponse.json({ order: updated });
    }

    if (action === "confirm-payment") {
      const { orderId } = body;
      const updated = await db.order.update({
        where: { id: orderId },
        data: {
          status: "CONFIRMED",
          paymentStatus: "CONFIRMED",
        },
      });
      return NextResponse.json({ order: updated });
    }

    if (action === "create-zone") {
      const { name, fee, estimatedMin } = body;
      const zone = await db.deliveryZone.create({
        data: {
          name,
          fee: Number(fee),
          estimatedMin: Number(estimatedMin) || 60,
          active: true,
        },
      });
      return NextResponse.json({ zone });
    }

    if (action === "update-zone") {
      const { zoneId, name, fee, estimatedMin, active } = body;
      const data: any = {};
      if (name !== undefined) data.name = name;
      if (fee !== undefined) data.fee = Number(fee);
      if (estimatedMin !== undefined) data.estimatedMin = Number(estimatedMin);
      if (active !== undefined) data.active = active;
      const updated = await db.deliveryZone.update({
        where: { id: zoneId },
        data,
      });
      return NextResponse.json({ zone: updated });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (e) {
    console.error("Admin POST error:", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
