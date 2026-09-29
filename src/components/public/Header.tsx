"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { id: "servicos", label: "Serviços" },
  { id: "agendar", label: "Agendar" },
  { id: "sobre", label: "A Barbearia" },
  { id: "galeria", label: "Fotos" },
  { id: "barbeiros", label: "Barbeiros" },
  { id: "horarios", label: "Horários" },
  { id: "localizacao", label: "Onde Estamos" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
      setMobileOpen(false);
    } else {
      setMobileOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="DN Barbearia"
              width={130}
              height={65}
              className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={pathname === "/" ? `#${link.id}` : `/#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-amber-400 hover:bg-zinc-900/80 transition-all cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <a
              href={pathname === "/" ? "#agendar" : "/#agendar"}
              onClick={(e) => handleNavClick(e, "agendar")}
              className="ml-3 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_22px_rgba(245,158,11,0.5)] flex items-center gap-2 cursor-pointer"
            >
              <Calendar size={16} />
              <span>Agendar Agora</span>
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button
            aria-label="Abrir menu"
            className="lg:hidden p-2.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-amber-400 hover:bg-zinc-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Suspenso */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-zinc-800/80 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={pathname === "/" ? `#${link.id}` : `/#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-200 hover:text-amber-400 hover:bg-zinc-900 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-zinc-800/60 mt-1">
                <a
                  href={pathname === "/" ? "#agendar" : "/#agendar"}
                  onClick={(e) => handleNavClick(e, "agendar")}
                  className="w-full px-4 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-sm font-bold text-center transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <Calendar size={18} />
                  <span>Agendar Horário</span>
                </a>
                <a
                  href="https://wa.me/5548988750947"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold text-center transition-all flex items-center justify-center gap-2"
                >
                  <span>Chamar no WhatsApp (48) 98875-0947</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
