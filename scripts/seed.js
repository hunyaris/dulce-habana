// Seed en JavaScript puro (no requiere tsx)
// Correr con: node scripts/seed.js
// o con:       npm run db:seed

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const CONSIGNOR_RATE = 0.70;

function calcConsignorPayout(price) {
  return Math.round(price * CONSIGNOR_RATE * 100) / 100;
}

function generateOrderNumber() {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DH-${ymd}-${rand}`;
}

async function main() {
  console.log("🍰 Iniciando seed de DULCE HABANA...");

  // Limpiar datos existentes
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.deliveryZone.deleteMany();
  await prisma.user.deleteMany();

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@dulcehabana.cu",
      name: "Admin Dulce Habana",
      password: "admin123",
      role: "ADMIN",
      phone: "+53 5 123 4567",
    },
  });
  console.log("✓ Admin creado:", admin.email);

  // Zonas de entrega
  const zones = [
    { name: "Habana Vieja", fee: 100, estimatedMin: 45 },
    { name: "Centro Habana", fee: 100, estimatedMin: 45 },
    { name: "Vedado", fee: 150, estimatedMin: 60 },
    { name: "Miramar", fee: 200, estimatedMin: 60 },
    { name: "Playa", fee: 250, estimatedMin: 75 },
    { name: "Plaza de la Revolución", fee: 150, estimatedMin: 60 },
    { name: "Cerro", fee: 200, estimatedMin: 75 },
    { name: "Diez de Octubre", fee: 200, estimatedMin: 75 },
    { name: "Otro municipio (recoger en tienda)", fee: 0, estimatedMin: 0 },
  ];
  for (const z of zones) {
    await prisma.deliveryZone.create({
      data: { ...z, active: true },
    });
  }
  console.log(`✓ ${zones.length} zonas de entrega creadas`);

  // Productos
  const products = [
    {
      name: "Panetela Borracha",
      description: "Clasica panetela cubana banyada en almibar con ron anejo. Esponjosa, humeda, con un toquecito que despierta el paladar. Perfecta para despues del almuerzo o con un cafecito.",
      category: "PANETELAS",
      price: 250,
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80",
      ingredients: "Harina, huevos, azucar, ron anejo, almibar, vainilla",
      portions: 1,
      prepTime: 1,
    },
    {
      name: "Panetela de Chocolate",
      description: "Bizcocho humedo de chocolate oscuro con cobertura ganache. Intensa, sedosa, con ese toque amargo que equilibra el dulzor. Una porcion y vas a querer otra.",
      category: "PANETELAS",
      price: 280,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
      ingredients: "Chocolate 70%, harina, huevos, mantequilla, azucar, crema de leche",
      portions: 1,
      prepTime: 1,
    },
    {
      name: "Panetela de Novia",
      description: "Tradicional panetela cubana de bodas. Bizcocho blanco ligero cubierto con merengue italiano suave y decorado con frutas confitadas. Elegante y deliciosa.",
      category: "PANETELAS",
      price: 300,
      image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80",
      ingredients: "Harina, claras de huevo, azucar, almendras, vainilla, frutas confitadas",
      portions: 1,
      prepTime: 2,
    },
    {
      name: "Panetela de Guayaba",
      description: "Bizcocho relleno de dulce de guayaba cubano. El contraste entre el dulzor tropical de la guayaba y el bizcocho suave es simplemente adictivo.",
      category: "PANETELAS",
      price: 270,
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
      ingredients: "Harina, huevos, dulce de guayaba, mantequilla, azucar",
      portions: 1,
      prepTime: 1,
    },
    {
      name: "Panque de Naranja",
      description: "Panque casero aromatizado con jugo y ralladura de naranja cubana. Humedo, perfumado, con esa acidez citrica que lo hace perfecto para el desayuno o la merienda.",
      category: "PANQUES",
      price: 480,
      image: "https://images.unsplash.com/photo-1612203985729-70726954388c?w=800&q=80",
      ingredients: "Harina, huevos, naranjas cubanas, mantequilla, azucar, levadura",
      portions: 8,
      prepTime: 2,
    },
    {
      name: "Panque de Mantequilla",
      description: "El panque clasico de la abuela. Mantequilla pura, vainilla, bizcocho denso y amarillo. El acompanante ideal de un cafe con leche por la manana.",
      category: "PANQUES",
      price: 450,
      image: "https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=800&q=80",
      ingredients: "Harina, huevos, mantequilla, azucar, vainilla, levadura",
      portions: 8,
      prepTime: 2,
    },
    {
      name: "Panque de Zanahoria",
      description: "Panque humedo de zanahoria fresca con nueces y cobertura de queso crema. Especiado con canela y nuez moscada. Casi un postre saludable, casi.",
      category: "PANQUES",
      price: 520,
      image: "https://images.unsplash.com/photo-1591985666643-1ecc67616216?w=800&q=80",
      ingredients: "Zanahoria, harina, huevos, nueces, canela, queso crema, azucar",
      portions: 8,
      prepTime: 2,
    },
    {
      name: "Flan de Caramelo",
      description: "Flan casero de leche entera con caramelo dorado hecho en sarten. Sedoso, cremoso, se deshace en la boca. La receta de la abuela, sin atajos.",
      category: "FLAN",
      price: 350,
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
      ingredients: "Leche entera, huevos, azucar, vainilla, caramelo",
      portions: 6,
      prepTime: 4,
    },
    {
      name: "Flan de Coco",
      description: "Variante tropical del flan clasico. Hecho con coco fresco rallado y leche de coco. Textura firme, sabor intenso a coco, con caramelo suave.",
      category: "FLAN",
      price: 380,
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
      ingredients: "Coco fresco, leche de coco, huevos, azucar, vainilla",
      portions: 6,
      prepTime: 4,
    },
    {
      name: "Batido de Mango",
      description: "Batido espeso de mango cubano maduro con leche helada. Dulce, refrescante, color dorado intenso. Perfecto para los dias calurosos de La Habana.",
      category: "BEBIDAS",
      price: 120,
      image: "https://images.unsplash.com/photo-1545048702-793625964f8f?w=800&q=80",
      ingredients: "Mango cubano, leche, azucar, hielo",
      portions: 1,
      prepTime: 0,
    },
    {
      name: "Cafe Cubano",
      description: "Cafecito cubano bien cargado, endulzado con espumita de azucar. Un shot pequeno pero intenso. Lo que nos despierta cada manana en la isla.",
      category: "BEBIDAS",
      price: 50,
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&q=80",
      ingredients: "Cafe cubano tostado, azucar",
      portions: 1,
      prepTime: 0,
    },
    {
      name: "Jugo Natural de Guayaba",
      description: "Jugo recien exprimido de guayaba cubana. Sin azucar anadida, solo la dulzura natural de la fruta. Vitamina C pura en vaso.",
      category: "BEBIDAS",
      price: 100,
      image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80",
      ingredients: "Guayaba cubana fresca",
      portions: 1,
      prepTime: 0,
    },
    {
      name: "Combo Familiar",
      description: "El combo perfecto para compartir en familia. Incluye 4 panetelas surtidas, 1 panque de naranja (8 porciones) y 4 jugos naturales. Suficiente para 6-8 personas.",
      category: "COMBOS",
      price: 1500,
      image: "https://images.unsplash.com/photo-1565956632347-3971756c5c84?w=800&q=80",
      isCombo: true,
      comboItems: "4 panetelas surtidas, 1 panque de naranja (8 porciones), 4 jugos naturales",
      portions: 8,
      prepTime: 2,
    },
    {
      name: "Combo Cumpleanos",
      description: "Todo lo que necesitas para celebrar. Incluye 1 panque decorado, 6 panetelas individuales, 1 flan de caramelo (6 porciones) y 6 cafes cubanos.",
      category: "COMBOS",
      price: 2200,
      image: "https://images.unsplash.com/photo-1535254973040-607b474cbaff?w=800&q=80",
      isCombo: true,
      comboItems: "1 panque decorado, 6 panetelas, 1 flan (6 porciones), 6 cafes cubanos",
      portions: 12,
      prepTime: 24,
    },
  ];

  let count = 0;
  for (const p of products) {
    await prisma.product.create({
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
        stock: 99,
        status: "ACTIVE",
      },
    });
    count++;
  }
  console.log(`✓ ${count} productos de dulceria creados`);

  // Orden demo
  const demoOrder = await prisma.order.create({
    data: {
      orderNumber: "DH-20261029-DEMO1",
      status: "PENDING_WHATSAPP",
      customerName: "Maria Perez",
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
  const flanProduct = await prisma.product.findFirst({
    where: { name: "Flan de Caramelo" },
  });
  const batidoProduct = await prisma.product.findFirst({
    where: { name: "Batido de Mango" },
  });
  if (flanProduct) {
    await prisma.orderItem.create({
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
    await prisma.orderItem.create({
      data: {
        orderId: demoOrder.id,
        productId: batidoProduct.id,
        productName: batidoProduct.name,
        productImage: batidoProduct.image,
        price: batidoProduct.price,
        quantity: 1,
        notes: "Sin azucar extra",
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
    await prisma.$disconnect();
  });
