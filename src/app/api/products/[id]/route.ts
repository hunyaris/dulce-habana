import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/products/[id] - Detalle de producto
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (e) {
    console.error("GET product error:", e);
    return NextResponse.json(
      { error: "Error al obtener producto" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Actualizar producto
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data: any = { ...body };
    if (data.price) data.price = Number(data.price);
    if (data.portions) data.portions = Number(data.portions);
    if (data.prepTime !== undefined) data.prepTime = Number(data.prepTime);

    const updated = await db.product.update({ where: { id }, data });
    return NextResponse.json({ product: updated });
  } catch (e) {
    console.error("PUT product error:", e);
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.product.update({
      where: { id },
      data: { status: "INACTIVE" },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE product error:", e);
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}
