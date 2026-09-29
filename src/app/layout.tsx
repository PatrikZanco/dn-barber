import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DN Barbearia | Estilo & Tradição",
  description:
    "DN Barbearia - Agende seu horário online. Cortes modernos, barba, tratamentos capilares e muito mais. Experiência premium em barbearia.",
  keywords: ["barbearia", "corte de cabelo", "barba", "agendamento", "DN Barbearia"],
  openGraph: {
    title: "DN Barbearia | Estilo & Tradição",
    description: "Agende seu horário online. Experiência premium em barbearia.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
