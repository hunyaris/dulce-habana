import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/zones - Lista de zonas de entrega activas
export async function GET() {
  try {
    const zones = await db.deliveryZone.findMany({
      where: { active: true },
      orderBy: { fee: "asc" },
    });
    return NextResponse.json({ zones });
  } catch (e) {
    console.error("GET zones error:", e);
    return NextResponse.json(
      { error: "Error al obtener zonas" },
      { status: 500 }
    );
  }
}
