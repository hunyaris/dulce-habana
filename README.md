# DULCE HABANA

Dulcería cubana artesanal. Panetelas, panqués, flan, bebidas y combos. Pedidos por WhatsApp con entrega en La Habana.

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: Prisma ORM (SQLite en dev, PostgreSQL en producción)
- **State**: Zustand + persist middleware
- **Animations**: Framer Motion + animaciones CSS custom
- **Icons**: Lucide React
- **Backend futuro**: Supabase SDK instalado (Auth OAuth + Storage)

## Funcionalidades

### Cliente (sin login)
- Catálogo agrupado por categorías (Panetelas, Panqués, Flan, Bebidas, Combos)
- Detalle de producto con ingredientes y porciones
- Selector de cantidad directo en cada card
- Carrito drawer deslizante desde la derecha
- Checkout en un solo paso con selección de zona de entrega
- Pago SIEMPRE por WhatsApp (sin plataformas de pago)
- Animaciones entre vistas, scroll reveal, marquee, stickers

### Admin (login requerido)
- Acceso discreto: botón "Acceso staff" en footer
- Dashboard con stats (ingresos, órdenes pendientes, productos activos)
- Gestión de órdenes: confirmar pago, cambiar estados (preparando → en camino → entregada)
- Gestión de productos: crear/editar/desactivar
- Gestión de zonas de entrega
- Analítica: ventas mensuales, top productos, distribución por categoría
- Botón directo de WhatsApp para contactar al cliente

## Desarrollo local

### Requisitos
- Node.js 18+ o Bun
- Un editor de código

### Instalación
```bash
# 1. Instalar dependencias
bun install

# 2. Copiar variables de entorno
cp .env.example .env
# Edita .env si necesitas cambiar algo

# 3. Crear la base de datos y cargar datos demo
bun run db:push
bun run scripts/seed.ts

# 4. Arrancar el servidor
bun run dev
```

Abre http://localhost:3000

### Credenciales demo
- **Admin**: `admin@dulcehabana.cu` / `admin123`

## Personalización rápida

Edita `src/lib/store-config.ts`:

```typescript
export const STORE_CONFIG = {
  whatsappNumber: "535XXXXXXXX",  // Tu WhatsApp real (formato: 53 + 5XXXXXXXX)
  email: "tu-email@gmail.com",
  instagram: "@tu_instagram",
  city: "La Habana, Cuba",
};

// Zonas de entrega con tarifas
export const DEFAULT_DELIVERY_ZONES = [
  { name: "Tu Zona", fee: 100, estimatedMin: 45 },
  // ...
];
```

## Deployment a producción (Vercel + Supabase)

### Paso 1: Subir a GitHub
```bash
git init
git add .
git commit -m "DULCE HABANA - dulcería cubana"
git remote add origin https://github.com/TU_USUARIO/dulce-habana.git
git branch -M main
git push -u origin main
```

### Paso 2: Crear base de datos en Supabase
1. Ve a [supabase.com](https://supabase.com) → New Project
2. Nombre: `dulce-habana`
3. Genera un password fuerte para la BD
4. Región: **US East** (más cerca de Cuba)
5. Espera a que se cree (~2 min)
6. En Project Settings → Database → "Connection string" → copia la URL
   (algo como: `postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres`)

### Paso 3: Probar la conexión local
```bash
# Actualiza tu .env local con la URL de Supabase
DATABASE_URL="postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres"

# Crea las tablas en Supabase
bun run db:push

# Carga los productos demo
bun run scripts/seed.ts

# Prueba que todo funcione
bun run dev
```

### Paso 4: Deploy en Vercel
1. Ve a [vercel.com](https://vercel.com) → Sign up with GitHub
2. "Add New Project" → importa el repo `dulce-habana`
3. Vercel detecta Next.js automáticamente
4. Antes de "Deploy", abre **Environment Variables** y añade:
   - `DATABASE_URL` = tu URL de Supabase
5. Click **Deploy** → espera 2-3 min
6. ¡Listo! Tu URL pública: `https://dulce-habana.vercel.app`

### Paso 5: Verificar producción
- Abre tu URL pública
- Verifica: home carga con animaciones
- Navega menú → añade al carrito
- Llega al checkout → confirma por WhatsApp
- Login admin → entra al panel
- Si hay errores: Vercel dashboard → "Logs"

## Activar Supabase Auth (Opcional - para futuro)

Si quieres probar Auth con OAuth (Google, etc.) o magic links:

1. En tu proyecto de Supabase → **Authentication** → **Providers**
2. Activa Google (o el que quieras)
3. Configura las URLs de redirect:
   - `https://dulce-habana.vercel.app/auth/callback`
4. Añade estas env vars en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://xxx.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu anon key (Project Settings → API)
5. El cliente ya está configurado en `src/lib/supabase.ts`
6. En tu código:
   ```typescript
   import { supabase } from "@/lib/supabase";
   await supabase.auth.signInWithOAuth({ provider: "google" });
   ```

## Activar Storage de Supabase (Opcional - para subir fotos)

Para subir fotos reales de los dulces desde el panel admin:

1. En Supabase → **Storage** → Create bucket → nombre: `products`
2. Set as public
3. Subir foto desde el código:
   ```typescript
   import { supabase } from "@/lib/supabase";
   const { data } = await supabase.storage
     .from("products")
     .upload("flan-caramelo.jpg", file);
   ```

## Scripts disponibles

```bash
bun run dev        # Servidor de desarrollo
bun run build      # Build de producción
bun run lint       # ESLint
bun run db:push    # Aplicar schema a la BD
bun run db:generate # Regenerar Prisma client
bun run scripts/seed.ts  # Cargar datos demo
```

## Estructura del proyecto

```
src/
├── app/
│   ├── api/              # API routes (auth, products, checkout, admin, zones)
│   ├── layout.tsx        # Layout raíz con fuentes
│   ├── page.tsx          # SPA con routing por estado + CartDrawer
│   └── globals.css       # Variables CSS + animaciones
├── components/
│   ├── layout/           # Header, Footer
│   ├── shared/           # ProductCard, CartDrawer, Marquee, Sticker, etc.
│   └── views/            # HomeView, CatalogView, ProductView, etc.
├── lib/
│   ├── store.ts          # Zustand store
│   ├── store-config.ts   # CONFIGURACIÓN DE TIENDA (WhatsApp, zonas)
│   ├── format.ts         # Utilidades y constantes
│   ├── category-icons.tsx # Iconos Lucide por categoría
│   ├── supabase.ts       # Cliente Supabase (lazy)
│   ├── db.ts             # Prisma client
│   └── utils.ts          # cn() helper
└── prisma/
    └── schema.prisma     # Schema de base de datos
```

## Paleta de colores

Definida en `src/app/globals.css` (variables CSS):

- `--dh-charcoal: #2a2f33` — Header, footer, texto principal
- `--dh-gray: #6f7a7e` — Textos muted
- `--dh-sand: #d5c7b1` — Fondos suaves, bordes
- `--dh-cream: #f5f1ea` — Background principal
- `--dh-terracotta: #a36f4e` — CTAs, acentos primarios

Para cambiar un color, solo edita el HEX en globals.css y se propaga a toda la tienda.

## Licencia

MIT — libre de usar y modificar.
