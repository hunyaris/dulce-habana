// Seed de datos demo para DULCE HABANA - dulcería cubana
// Ejecutar: bun run scripts/seed.ts

import { db } from "../src/lib/db";
import { DEFAULT_DELIVERY_ZONES } from "../src/lib/store-config";

async function main() {
  console.log("🍰 Iniciando seed de DULCE HABANA...");

  // Limpiar datos existentes
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.cartItem.deleteMany();
  await db.cart.deleteMany();
  await db.product.deleteMany();
  await db.deliveryZone.deleteMany();
  await db.user.deleteMany();

  // === USUARIO ADMIN ===
  const admin = await db.user.create({
    data: {
      email: "admin@dulcehabana.cu",
      name: "Admin Dulce Habana",
      password: "admin123",
      role: "ADMIN",
      phone: "+53 5 123 4567",
    },
  });
  console.log("✓ Admin creado:", admin.email);

  // === ZONAS DE ENTREGA ===
  for (const z of DEFAULT_DELIVERY_ZONES) {
    await db.deliveryZone.create({
      data: {
        name: z.name,
        fee: z.fee,
        estimatedMin: z.estimatedMin,
        active: true,
      },
    });
  }
  console.log(`✓ ${DEFAULT_DELIVERY_ZONES.length} zonas de entrega creadas`);

  // === PRODUCTOS DEMO ===
  const products = [
    // PANETELAS
    {
      name: "Panetela Borracha",
      description: "Clásica panetela cubana bañada en almíbar con ron añejo. Esponjosa, húmeda, con un toquecito que despierta el paladar. Perfecta para después del almuerzo o con un cafecito.",
      category: "PANETELAS",
      price: 250,
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80",
      ingredients: "Harina, huevos, azúcar, ron añejo, almíbar, vainilla",
      portions: 1,
      prepTime: 1,
    },
    {
      name: "Panetela de Chocolate",
      description: "Bizcocho húmedo de chocolate oscuro con cobertura ganache. Intensa, sedosa, con ese toque amargo que equilibra el dulzor. Una porción y vas a querer otra.",
      category: "PANETELAS",
      price: 280,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
      ingredients: "Chocolate 70%, harina, huevos, mantequilla, azúcar, crema de leche",
      portions: 1,
      prepTime: 1,
    },
    {
      name: "Panetela de Novia",
      description: "Tradicional panetela cubana de bodas. Bizcocho blanco ligero cubierto con merengue italiano suave y decorado con frutas confitadas. Elegante y deliciosa.",
      category: "PANETELAS",
      price: 300,
      image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",
      ingredients: "Harina, claras de huevo, azúcar, almendras, vainilla, frutas confitadas",
      portions: 1,
      prepTime: 2,
    },
    {
      name: "Panetela de Guayaba",
      description: "Bizcocho relleno de dulce de guayaba cubano. El contraste entre el dulzor tropical de la guayaba y el bizcocho suave es simplemente adictivo.",
      category: "PANETELAS",
      price: 270,
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
      ingredients: "Harina, huevos, dulce de guayaba, mantequilla, azúcar",
      portions: 1,
      prepTime: 1,
    },
    // PANQUES
    {
      name: "Panqué de Naranja",
      description: "Panqué casero aromatizado con jugo y ralladura de naranja cubana. Húmedo, perfumado, con esa acidez cítrica que lo hace perfecto para el desayuno o la merienda.",
      category: "PANQUES",
      price: 480,
      image: "https://images.unsplash.com/photo-1612203985729-70726954388c?w=800&q=80",
      ingredients: "Harina, huevos, naranjas cubanas, mantequilla, azúcar, levadura",
      portions: 8,
      prepTime: 2,
    },
    {
      name: "Panqué de Mantequilla",
      description: "El panqué clásico de la abuela. Mantequilla pura, vainilla, bizcocho denso y amarillo. El acompañante ideal de un café con leche por la mañana.",
      category: "PANQUES",
      price: 450,
      image: "https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=800&q=80",
      ingredients: "Harina, huevos, mantequilla, azúcar, vainilla, levadura",
      portions: 8,
      prepTime: 2,
    },
    {
      name: "Panqué de Zanahoria",
      description: "Panqué húmedo de zanahoria fresca con nueces y cobertura de queso crema. Especiado con canela y nuez moscada. Casi un postre saludable, casi.",
      category: "PANQUES",
      price: 520,
      image: "https://images.unsplash.com/photo-1591985666643-1ecc67616216?w=800&q=80",
      ingredients: "Zanahoria, harina, huevos, nueces, canela, queso crema, azúcar",
      portions: 8,
      prepTime: 2,
    },
    // FLAN
    {
      name: "Flan de Caramelo",
      description: "Flan casero de leche entera con caramelo dorado hecho en sartén. Sedoso, cremoso, se deshace en la boca. La receta de la abuela, sin atajos.",
      category: "FLAN",
      price: 350,
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
      ingredients: "Leche entera, huevos, azúcar, vainilla, caramelo",
      portions: 6,
      prepTime: 4,
    },
    {
      name: "Flan de Coco",
      description: "Variante tropical del flan clásico. Hecho con coco fresco rallado y leche de coco. Textura firme, sabor intenso a coco, con caramelo suave.",
      category: "FLAN",
      price: 380,
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
      ingredients: "Coco fresco, leche de coco, huevos, azúcar, vainilla",
      portions: 6,
      prepTime: 4,
    },
    // BEBIDAS
    {
      name: "Batido de Mango",
      description: "Batido espeso de mango cubano maduro con leche helada. Dulce, refrescante, color dorado intenso. Perfecto para los días calurosos de La Habana.",
      category: "BEBIDAS",
      price: 120,
      image: "https://images.unsplash.com/photo-1545048702-793625964f8f?w=800&q=80",
      ingredients: "Mango cubano, leche, azúcar, hielo",
      portions: 1,
      prepTime: 0,
    },
    {
      name: "Café Cubano",
      description: "Cafecito cubano bien cargado, endulzado con espumita de azúcar. Un shot pequeño pero intenso. Lo que nos despierta cada mañana en la isla.",
      category: "BEBIDAS",
      price: 50,
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&q=80",
      ingredients: "Café cubano tostado, azúcar",
      portions: 1,
      prepTime: 0,
    },
    {
      name: "Jugo Natural de Guayaba",
      description: "Jugo recién exprimido de guayaba cubana. Sin azúcar añadida, solo la dulzura natural de la fruta. Vitamina C pura en vaso.",
      category: "BEBIDAS",
      price: 100,
      image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80",
      ingredients: "Guayaba cubana fresca",
      portions: 1,
      prepTime: 0,
    },
    // COMBOS
    {
      name: "Combo Familiar",
      description: "El combo perfecto para compartir en familia. Incluye 4 panetelas surtidas, 1 panqué de naranja (8 porciones) y 4 jugos naturales. Suficiente para 6-8 personas.",
      category: "COMBOS",
      price: 1500,
      image: "https://images.unsplash.com/photo-1565956632347-3971756c5c84?w=800&q=80",
      isCombo: true,
      comboItems: "4 panetelas surtidas, 1 panqué de naranja (8 porciones), 4 jugos naturales",
      portions: 8,
      prepTime: 2,
    },
    {
      name: "Combo Cumpleaños",
      description: "Todo lo que necesitas para celebrar. Incluye 1 panqué decorado, 6 panetelas individuales, 1 flan de caramelo (6 porciones) y 6 cafés cubanos.",
      category: "COMBOS",
      price: 2200,
      image: "https://images.unsplash.com/photo-1535254973040-607b474cbaff?w=800&q=80",
      isCombo: true,
      comboItems: "1 panqué decorado, 6 panetelas, 1 flan (6 porciones), 6 cafés cubanos",
      portions: 12,
      prepTime: 24,
    },
  ];

  let count = 0;
  for (const p of products) {
    await db.product.create({
      data: {
        name: p.name,
        description: p.description,
        category: p.category,
        price: p.price,
        image: p.image,
        ingredients: p.ingredients || null,
        portions: p.portions || null,
        prepTime: p.prepTime ?? 0,
        isCombo: p.isCombo || false,
        comboItems: p.comboItems || null,
        stock: 99, // disponible bajo demanda
        status: "ACTIVE",
      },
    });
    count++;
  }
  console.log(`✓ ${count} productos de dulcería creados`);

  // === ORDEN DEMO ===
  const demoOrder = await db.order.create({
    data: {
      orderNumber: "DH-20261029-DEMO1",
      status: "PENDING_WHATSAPP",
      customerName: "María Pérez",
      customerPhone: "+53 5 987 6543",
      deliveryZoneName: "Vedado",
      deliveryAddress: "Calle 23 #456 apto 3, entre G y H, Vedado",
      deliveryTime: "Hoy entre 16:00 y 18:00",
      deliveryFee: 150,
      notes: "Llamar al llegar, no timbrar",
      subtotal: 530,
      total: 680,
      paymentMethod: "WHATSAPP",
      paymentStatus: "PENDING",
    },
  });
  const flanProduct = await db.product.findFirst({
    where: { name: "Flan de Caramelo" },
  });
  const batidoProduct = await db.product.findFirst({
    where: { name: "Batido de Mango" },
  });
  if (flanProduct) {
    await db.orderItem.create({
      data: {
        orderId: demoOrder.id,
        productId: flanProduct.id,
        productName: flanProduct.name,
        productImage: flanProduct.image,
        price: flanProduct.price,
        quantity: 1,
      },
    });
  }
  if (batidoProduct) {
    await db.orderItem.create({
      data: {
        orderId: demoOrder.id,
        productId: batidoProduct.id,
        productName: batidoProduct.name,
        productImage: batidoProduct.image,
        price: batidoProduct.price,
        quantity: 1,
        notes: "Sin azúcar extra",
      },
    });
  }
  console.log("✓ Orden demo creada");

  console.log("\n=== ACCESO ADMIN ===");
  console.log("Email: admin@dulcehabana.cu");
  console.log("Password: admin123");
  console.log("\n✅ Seed completado");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
