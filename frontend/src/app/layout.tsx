import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

// Supondo que você tenha ou criará esses componentes de layout
const Header = () => <header className="p-4 bg-[var(--secondary-color)] text-center"><h1 className="text-xl font-bold">LogoAli</h1></header>;
const Footer = () => <footer className="p-4 bg-[var(--secondary-color)] text-center text-sm"><p>© 2024 LogoAli. Todos os direitos reservados.</p></footer>;


export const metadata: Metadata = {
  title: "LogoAli - Serviços Públicos SP",
  description: "Encontre serviços públicos em São Paulo de forma fácil.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto p-4">
              {children}
            </main>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}