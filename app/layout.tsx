import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Za-🦆🦆🦆 — Búsqueda de Productos",
  description: "Busca productos de tennis con descuentos especiales para palíndromos. ¡Encuentra tu equipo ideal con hasta 50% de descuento!",
  keywords: ["tennis", "productos deportivos", "palíndromo", "descuento", "búsqueda"],
  authors: [{ name: "Za-🦆🦆🦆 Team" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background text-foreground antialiased font-light tracking-wide">
        {children}
      </body>
    </html>
  );
}
