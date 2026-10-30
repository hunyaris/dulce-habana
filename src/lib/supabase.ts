// Cliente de Supabase para uso futuro (Auth con OAuth, magic links, Storage de imágenes)
//
// Para activarlo:
// 1. Crea un proyecto en https://supabase.com
// 2. Copia NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY a tu .env
// 3. Importa este cliente donde lo necesites:
//    import { supabase } from "@/lib/supabase";
//
// Ejemplo de Auth con magic link:
//   await supabase.auth.signInWithOtp({ email: "cliente@email.com" })
//
// Ejemplo de OAuth (Google):
//   await supabase.auth.signInWithOAuth({ provider: "google" })
//
// Ejemplo de Storage (subir foto de producto):
//   await supabase.storage.from("products").upload("flan.jpg", file)

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Si las variables no están configuradas, exportamos null
// para que el código no se rompa si Supabase no se usa aún.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseEnabled = supabase !== null;
