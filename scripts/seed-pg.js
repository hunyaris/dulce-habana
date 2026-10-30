// Seed usando pg directamente (sin Prisma query engine)
// Correr con: node scripts\seed-pg.js
// Requiere: npm install pg

const { Client } = require("pg");
require("dotenv").config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL no encontrada en .env");
  process.exit(1);
}

// Quitar parámetros pgbouncer si los tiene (pg no los necesita)
const cleanUrl = DATABASE_URL.replace(/\?pgbouncer=true&connection_limit=1/g, "").replace(/\?pgbouncer=true/g, "").replace(/\?connection_limit=1/g, "").replace(/\?connect_timeout=300/g, "");

console.log("URL (oculta):", cleanUrl.replace(/:[^:@]+@/, ":***@"));

async function main() {
  console.log("🍰 Iniciando seed (via pg)...");

  const client = new Client({
    connectionString: cleanUrl,
    connectionTimeoutMillis: 60000,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Conectando a Supabase...");
    await client.connect();
    console.log("✓ Conectado");

    // Limpiar datos existentes
    console.log("Limpiando datos...");
    await client.query("DELETE FROM \"OrderItem\"");
    await client.query("DELETE FROM \"Order\"");
    await client.query("DELETE FROM \"CartItem\"");
    await client.query("DELETE FROM \"Cart\"");
    await client.query("DELETE FROM \"Product\"");
    await client.query("DELETE FROM \"DeliveryZone\"");
    await client.query("DELETE FROM \"User\"");

    // === ADMIN ===
    console.log("Creando admin...");
    const adminResult = await client.query(
      `INSERT INTO "User" (id, email, name, password, role, phone, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id`,
      ["admin@dulcehabana.cu", "Admin Dulce Habana", "admin123", "ADMIN", "+53 5 123 4567"]
    );
    console.log("✓ Admin creado:", adminResult.rows[0].id);

    // === ZONAS ===
    console.log("Creando zonas...");
    const zones = [
      { name: "Habana Vieja", fee: 100, est: 45 },
      { name: "Centro Habana", fee: 100, est: 45 },
      { name: "Vedado", fee: 150, est: 60 },
      { name: "Miramar", fee: 200, est: 60 },
      { name: "Playa", fee: 250, est: 75 },
      { name: "Plaza de la Revolución", fee: 150, est: 60 },
      { name: "Cerro", fee: 200, est: 75 },
      { name: "Diez de Octubre", fee: 200, est: 75 },
      { name: "Otro municipio (recoger en tienda)", fee: 0, est: 0 },
    ];
    for (const z of zones) {
      await client.query(
        `INSERT INTO "DeliveryZone" (id, name, fee, "estimatedMin", active, "createdAt")
         VALUES (gen_random_uuid(), $1, $2, $3, true, NOW())`,
        [z.name, z.fee, z.est]
      );
    }
    console.log(`✓ ${zones.length} zonas creadas`);

    // === PRODUCTOS ===
    console.log("Creando productos...");
    const products = [
      {
        name: "Panetela Borracha",
        description: "Clasica panetela cubana banyada en almibar con ron anejo. Esponjosa, humeda, con un toquecito que despierta el paladar. Perfecta para despues del almuerzo o con un cafecito.",
        category: "PANETELAS", price: 250, portions: 1, prepTime: 1,
        image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80",
        ingredients: "Harina, huevos, azucar, ron anejo, almibar, vainilla",
      },
      {
        name: "Panetela de Chocolate",
        description: "Bizcocho humedo de chocolate oscuro con cobertura ganache. Intensa, sedosa, con ese toque amargo que equilibra el dulzor. Una porcion y vas a querer otra.",
        category: "PANETELAS", price: 280, portions: 1, prepTime: 1,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
        ingredients: "Chocolate 70%, harina, huevos, mantequilla, azucar, crema de leche",
      },
      {
        name: "Panetela de Novia",
        description: "Tradicional panetela cubana de bodas. Bizcocho blanco ligero cubierto con merengue italiano suave y decorado con frutas confitadas. Elegante y deliciosa.",
        category: "PANETELAS", price: 300, portions: 1, prepTime: 2,
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",
        ingredients: "Harina, claras de huevo, azucar, almendras, vainilla, frutas confitadas",
      },
      {
        name: "Panetela de Guayaba",
        description: "Bizcocho relleno de dulce de guayaba cubano. El contraste entre el dulzor tropical de la guayaba y el bizcocho suave es simplemente adictivo.",
        category: "PANETELAS", price: 270, portions: 1, prepTime: 1,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
        ingredients: "Harina, huevos, dulce de guayaba, mantequilla, azucar",
      },
      {
        name: "Panque de Naranja",
        description: "Panque casero aromatizado con jugo y ralladura de naranja cubana. Humedo, perfumado, con esa acidez citrica que lo hace perfecto para el desayuno.",
        category: "PANQUES", price: 480, portions: 8, prepTime: 2,
        image: "https://images.unsplash.com/photo-1612203985729-70726954388c?w=800&q=80",
        ingredients: "Harina, huevos, naranjas cubanas, mantequilla, azucar, levadura",
      },
      {
        name: "Panque de Mantequilla",
        description: "El panque clasico de la abuela. Mantequilla pura, vainilla, bizcocho denso y amarillo. El acompanante ideal de un cafe con leche por la manana.",
        category: "PANQUES", price: 450, portions: 8, prepTime: 2,
        image: "https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=800&q=80",
        ingredients: "Harina, huevos, mantequilla, azucar, vainilla, levadura",
      },
      {
        name: "Panque de Zanahoria",
        description: "Panque humedo de zanahoria fresca con nueces y cobertura de queso crema. Especiado con canela y nuez moscada. Casi un postre saludable, casi.",
        category: "PANQUES", price: 520, portions: 8, prepTime: 2,
        image: "https://images.unsplash.com/photo-1591985666643-1ecc67616216?w=800&q=80",
        ingredients: "Zanahoria, harina, huevos, nueces, canela, queso crema, azucar",
      },
      {
        name: "Flan de Caramelo",
        description: "Flan casero de leche entera con caramelo dorado hecho en sarten. Sedoso, cremoso, se deshace en la boca. La receta de la abuela, sin atajos.",
        category: "FLAN", price: 350, portions: 6, prepTime: 4,
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
        ingredients: "Leche entera, huevos, azucar, vainilla, caramelo",
      },
      {
        name: "Flan de Coco",
        description: "Variante tropical del flan clasico. Hecho con coco fresco rallado y leche de coco. Textura firme, sabor intenso a coco, con caramelo suave.",
        category: "FLAN", price: 380, portions: 6, prepTime: 4,
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
        ingredients: "Coco fresco, leche de coco, huevos, azucar, vainilla",
      },
      {
        name: "Batido de Mango",
        description: "Batido espeso de mango cubano maduro con leche helada. Dulce, refrescante, color dorado intenso. Perfecto para los dias calurosos de La Habana.",
        category: "BEBIDAS", price: 120, portions: 1, prepTime: 0,
        image: "https://images.unsplash.com/photo-1545048702-793625964f8f?w=800&q=80",
        ingredients: "Mango cubano, leche, azucar, hielo",
      },
      {
        name: "Cafe Cubano",
        description: "Cafecito cubano bien cargado, endulzado con espumita de azucar. Un shot pequeno pero intenso. Lo que nos despierta cada manana en la isla.",
        category: "BEBIDAS", price: 50, portions: 1, prepTime: 0,
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&q=80",
        ingredients: "Cafe cubano tostado, azucar",
      },
      {
        name: "Jugo Natural de Guayaba",
        description: "Jugo recien exprimido de guayaba cubana. Sin azucar anadida, solo la dulzura natural de la fruta. Vitamina C pura en vaso.",
        category: "BEBIDAS", price: 100, portions: 1, prepTime: 0,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80",
        ingredients: "Guayaba cubana fresca",
      },
      {
        name: "Combo Familiar",
        description: "El combo perfecto para compartir en familia. Incluye 4 panetelas surtidas, 1 panque de naranja (8 porciones) y 4 jugos naturales.",
        category: "COMBOS", price: 1500, portions: 8, prepTime: 2, isCombo: true,
        comboItems: "4 panetelas surtidas, 1 panque de naranja (8 porciones), 4 jugos naturales",
        image: "https://images.unsplash.com/photo-1565956632347-3971756c5c84?w=800&q=80",
      },
      {
        name: "Combo Cumpleanos",
        description: "Todo lo que necesitas para celebrar. Incluye 1 panque decorado, 6 panetelas individuales, 1 flan de caramelo (6 porciones) y 6 cafes cubanos.",
        category: "COMBOS", price: 2200, portions: 12, prepTime: 24, isCombo: true,
        comboItems: "1 panque decorado, 6 panetelas, 1 flan (6 porciones), 6 cafes cubanos",
        image: "https://images.unsplash.com/photo-1535254973040-607b474cbaff?w=800&q=80",
      },
    ];

    for (const p of products) {
      await client.query(
        `INSERT INTO "Product" (id, name, description, category, price, image, ingredients, portions, "prepTime", "isCombo", "comboItems", stock, status, "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 99, 'ACTIVE', NOW(), NOW())`,
        [
          p.name, p.description, p.category, p.price, p.image,
          p.ingredients || null, p.portions || null, p.prepTime || 0,
          p.isCombo || false, p.comboItems || null,
        ]
      );
    }
    console.log(`✓ ${products.length} productos creados`);

    // === ORDEN DEMO ===
    console.log("Creando orden demo...");
    const orderResult = await client.query(
      `INSERT INTO "Order" (id, "orderNumber", status, "customerName", "customerPhone", "deliveryZoneName", "deliveryAddress", "deliveryTime", "deliveryFee", notes, subtotal, total, "paymentMethod", "paymentStatus", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), 'DH-DEMO-001', 'PENDING_WHATSAPP', 'Maria Perez', '+53 5 987 6543', 'Vedado', 'Calle 23 #456 apto 3, Vedado', 'Hoy entre 16:00 y 18:00', 150, 'Llamar al llegar', 530, 680, 'WHATSAPP', 'PENDING', NOW(), NOW()) RETURNING id`
    );
    const orderId = orderResult.rows[0].id;

    // Items de la orden
    const flanResult = await client.query(`SELECT id FROM "Product" WHERE name = 'Flan de Caramelo' LIMIT 1`);
    const batidoResult = await client.query(`SELECT id FROM "Product" WHERE name = 'Batido de Mango' LIMIT 1`);

    if (flanResult.rows[0]) {
      await client.query(
        `INSERT INTO "OrderItem" (id, "orderId", "productId", "productName", "productImage", price, quantity)
         VALUES (gen_random_uuid(), $1, $2, 'Flan de Caramelo', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80', 350, 1)`,
        [orderId, flanResult.rows[0].id]
      );
    }
    if (batidoResult.rows[0]) {
      await client.query(
        `INSERT INTO "OrderItem" (id, "orderId", "productId", "productName", "productImage", price, quantity, notes)
         VALUES (gen_random_uuid(), $1, $2, 'Batido de Mango', 'https://images.unsplash.com/photo-1545048702-793625964f8f?w=800&q=80', 120, 1, 'Sin azucar extra')`,
        [orderId, batidoResult.rows[0].id]
      );
    }
    console.log("✓ Orden demo creada");

    console.log("\n=== ACCESO ADMIN ===");
    console.log("Email: admin@dulcehabana.cu");
    console.log("Password: admin123");
    console.log("\n✅ Seed completado exitosamente!");

  } catch (err) {
    console.error("❌ Error:", err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();