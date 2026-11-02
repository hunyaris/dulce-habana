// Hash el password del admin usando crypto (Node.js built-in)
// Correr con: node scripts/hash-password.js

const crypto = require("crypto");
const { Client } = require("pg");
require("dotenv").config();

// Función para hashear password con scrypt (built-in Node.js, sin dependencias)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// Función para verificar password
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const newHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return hash === newHash;
}

async function main() {
  const newPassword = process.argv[2] || "admin123";
  
  console.log("Hasheando password para admin@dulcehabana.cu...");
  console.log("Nuevo password:", newPassword);
  
  const hashedPassword = hashPassword(newPassword);
  console.log("Hash generado (oculto por seguridad)");
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Conectado a Supabase");
    
    // Actualizar password hasheado
    const result = await client.query(
      `UPDATE "User" SET password = $1 WHERE email = 'admin@dulcehabana.cu' RETURNING id, email`,
      [hashedPassword]
    );
    
    if (result.rows.length > 0) {
      console.log("✓ Password actualizado para:", result.rows[0].email);
      console.log("✓ Password hasheado correctamente (no en texto plano)");
      
      // Verificar que funciona
      const verify = await client.query(`SELECT password FROM "User" WHERE email = 'admin@dulcehabana.cu'`);
      const isCorrect = verifyPassword(newPassword, verify.rows[0].password);
      console.log("✓ Verificación:", isCorrect ? "PASS" : "FAIL");
    } else {
      console.log("❌ No se encontró el usuario admin");
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
