import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Logo Ali - Serviços Públicos SP",
  description: "Encontre serviços públicos de São Paulo próximos ao seu endereço",
  keywords: ["São Paulo", "serviços públicos", "cata-bagulho", "coleta de lixo", "zeladoria"],
  authors: [{ name: "Logo Ali Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}