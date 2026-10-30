import type { Metadata } from "next";
import { Inter, Playfair_Display, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DULCE HABANA · Dulcería Artesanal",
  description: "Dulcería cubana artesanal. Panetelas, panqués, flan, bebidas y combos. Pedidos por WhatsApp con entrega en La Habana.",
  keywords: ["dulcería", "panetelas", "pan cubano", "flan", "dulces cubanos", "La Habana"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${bebas.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
