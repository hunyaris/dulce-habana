import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { rateLimit, getClientIP, RATE_LIMITS, getRateLimitHeaders } from "@/lib/rate-limit";

// Función para verificar password hasheado
function verifyPassword(password: string, stored: string): boolean {
  if (stored.includes(":")) {
    const [salt, hash] = stored.split(":");
    const newHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return hash === newHash;
  }
  return password === stored;
}

// POST /api/auth?action=login - Solo para admin (con rate limiting)
export async function POST(req: NextRequest) {
  try {
    // === RATE LIMITING ===
    const clientIP = getClientIP(req);
    const rateResult = rateLimit(clientIP, RATE_LIMITS.LOGIN);

    if (!rateResult.success) {
      const retryAfter = Math.ceil((rateResult.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: "Demasiados intentos de inicio de sesión. Intenta de nuevo en " +
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

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action") || "login";
    const body = await req.json();

    if (action === "login") {
      const { email, password } = body;
      const user = await db.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Credenciales incorrectas" },
          {
            status: 401,
            headers: getRateLimitHeaders(rateResult),
          }
        );
      }

      const isCorrect = verifyPassword(password, user.password);
      if (!isCorrect) {
        return NextResponse.json(
          { error: "Credenciales incorrectas" },
          {
            status: 401,
            headers: getRateLimitHeaders(rateResult),
          }
        );
      }

      if (user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Acceso solo para administradores" },
          {
            status: 403,
            headers: getRateLimitHeaders(rateResult),
          }
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
