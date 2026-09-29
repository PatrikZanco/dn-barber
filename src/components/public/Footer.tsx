import Link from "next/link";
import Image from "next/image";
import { Camera, Phone, MapPin, Clock, Calendar } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="DN Barbearia" width={140} height={70} className="h-14 w-auto object-contain" />
            </Link>
            <p className="text-zinc-400 max-w-sm text-sm leading-relaxed">
              DN Barbearia — Estilo, tradição e atendimento com hora marcada em Barreiros, São José.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://www.instagram.com/dnbarbearia01/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-amber-500 transition-colors flex items-center gap-2 text-sm"
                title="Siga nosso Instagram"
              >
                <Camera size={20} className="text-amber-500" />
                <span className="font-medium text-zinc-300 hover:text-amber-400">@dnbarbearia01</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wider text-amber-500">Links Rápidos</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#servicos" className="text-zinc-400 hover:text-amber-400 transition-colors">Serviços & Cortes</a>
              </li>
              <li>
                <a href="#agendar" className="text-zinc-400 hover:text-amber-400 transition-colors">Agendar Horário</a>
              </li>
              <li>
                <a href="#sobre" className="text-zinc-400 hover:text-amber-400 transition-colors">A Barbearia</a>
              </li>
              <li>
                <a href="#galeria" className="text-zinc-400 hover:text-amber-400 transition-colors">Galeria de Fotos</a>
              </li>
              <li>
                <a href="#barbeiros" className="text-zinc-400 hover:text-amber-400 transition-colors">Nossos Barbeiros</a>
              </li>
              <li>
                <a href="#localizacao" className="text-zinc-400 hover:text-amber-400 transition-colors">Como Chegar</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wider text-amber-500">Onde Nos Encontrar</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3 text-zinc-400">
                <MapPin size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-zinc-200">R. Mar Del Plata, 843 - Barreiros</p>
                  <p className="text-zinc-400">São José - SC, 88117-410</p>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-zinc-400">
                <Clock size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-zinc-200">Segunda a Sexta: 09h às 20h</p>
                  <p className="text-zinc-400">Sábado: 09h às 18h</p>
                </div>
              </li>
              <li className="pt-2">
                <a
                  href="#agendar"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-zinc-950 font-bold text-xs transition-colors"
                >
                  <Calendar size={14} />
                  <span>Garantir meu horário</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 text-center text-zinc-500 text-xs flex flex-col md:flex-row justify-between items-center gap-2">
          <p>&copy; {currentYear} DN Barbearia. Todos os direitos reservados.</p>
          <p>Feito para quem valoriza estilo e autenticidade.</p>
        </div>
      </div>
    </footer>
  );
}
