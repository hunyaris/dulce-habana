// Rate limiting en memoria para proteger APIs críticas
// Funciona en Vercel (warm starts reutilizan instancias)

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Map: IP → endpoint → { count, resetTime }
const rateLimitMap = new Map<string, Map<string, RateLimitEntry>>();

// Limpiar entries expirados cada 5 minutos
let lastCleanup = Date.now();
function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return; // 5 min
  lastCleanup = now;
  for (const [ip, endpoints] of rateLimitMap.entries()) {
    for (const [endpoint, entry] of endpoints.entries()) {
      if (now > entry.resetTime) {
        endpoints.delete(endpoint);
      }
    }
    if (endpoints.size === 0) {
      rateLimitMap.delete(ip);
    }
  }
}

interface RateLimitOptions {
  // Máximo de requests permitidas en la ventana
  maxRequests: number;
  // Ventana de tiempo en milisegundos
  windowMs: number;
  // Nombre del endpoint (para agrupar)
  endpoint: string;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
}

/**
 * Verifica si una IP puede hacer una petición al endpoint.
 * Llamar al inicio de cada API route protegida.
 */
export function rateLimit(ip: string, options: RateLimitOptions): RateLimitResult {
  cleanupExpired();

  const now = Date.now();
  const resetTime = now + options.windowMs;

  // Obtener o crear el map de endpoints para esta IP
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, new Map());
  }
  const ipEndpoints = rateLimitMap.get(ip)!;

  // Obtener o crear la entrada para este endpoint
  const existing = ipEndpoints.get(options.endpoint);

  if (!existing || now > existing.resetTime) {
    // Primera request o ventana expirada
    ipEndpoints.set(options.endpoint, { count: 1, resetTime });
    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetTime,
      limit: options.maxRequests,
    };
  }

  // Incrementar contador
  existing.count++;

  if (existing.count > options.maxRequests) {
    // Rate limit excedido
    return {
      success: false,
      remaining: 0,
      resetTime: existing.resetTime,
      limit: options.maxRequests,
    };
  }

  return {
    success: true,
    remaining: options.maxRequests - existing.count,
    resetTime: existing.resetTime,
    limit: options.maxRequests,
  };
}

/**
 * Obtiene la IP del cliente desde el request.
 * Funciona en Vercel y en desarrollo local.
 */
export function getClientIP(req: Request): string {
  // Vercel pone la IP real en estos headers
  const headers = req.headers;
  
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for puede tener múltiples IPs: "client, proxy1, proxy2"
    return forwarded.split(",")[0].trim();
  }
  
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  
  const vercelIp = headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    return vercelIp.split(",")[0].trim();
  }
  
  // Fallback para desarrollo local
  return "127.0.0.1";
}

/**
 * Configuraciones predefinidas para cada endpoint crítico
 */
export const RATE_LIMITS = {
  // Login: 5 intentos cada 15 minutos (contra brute force)
  LOGIN: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 min
    endpoint: "auth-login",
  },
  // Checkout: 10 pedidos por hora (contra spam de pedidos)
  CHECKOUT: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hora
    endpoint: "checkout",
  },
  // Crear producto: 20 por hora (admin)
  PRODUCT_CREATE: {
    maxRequests: 20,
    windowMs: 60 * 60 * 1000, // 1 hora
    endpoint: "product-create",
  },
  // API general (productos GET): 100 por minuto
  API_GENERAL: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 min
    endpoint: "api-general",
  },
} as const;

/**
 * Construye los headers de rate limit para la respuesta HTTP
 */
export function getRateLimitHeaders(result: RateLimitResult) {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.floor(result.resetTime / 1000).toString(),
  };
}
