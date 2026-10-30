import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/auth?action=login - Solo para admin
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action") || "login";
    const body = await req.json();

    if (action === "login") {
      const { email, password } = body;
      const user = await db.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (!user || user.password !== password) {
        return NextResponse.json(
          { error: "Credenciales incorrectas" },
          { status: 401 }
        );
      }
      if (user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Acceso solo para administradores" },
          { status: 403 }
        );
      }
      return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (e) {
    console.error("Auth error:", e);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
