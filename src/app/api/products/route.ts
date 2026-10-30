import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/products - Listar productos con filtros
// ?category=PANETELAS&search=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100");

    const where: any = { status: "ACTIVE" };
    if (category && category !== "ALL") where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { ingredients: { contains: search } },
      ];
    }

    const products = await db.product.findMany({
      where,
      orderBy: { category: "asc" },
      take: limit,
    });

    return NextResponse.json({ products });
  } catch (e) {
    console.error("GET products error:", e);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

// POST /api/products - Crear producto (admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      category,
      price,
      image,
      ingredients,
      portions,
      prepTime,
      isCombo,
      comboItems,
    } = body;

    if (!name || !description || !category || !price) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        category,
        price: Number(price),
        image,
        ingredients: ingredients || null,
        portions: portions ? Number(portions) : null,
        prepTime: prepTime ? Number(prepTime) : 0,
        isCombo: isCombo || false,
        comboItems: comboItems || null,
        stock: 99,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ product });
  } catch (e) {
    console.error("POST products error:", e);
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}
