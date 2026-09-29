"use client";

import { useEffect, useState } from "react";
import { Scissors, Zap, Award, Sparkles, ChevronDown } from "lucide-react";

export default function HeroSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollTo = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-28 pb-16 overflow-hidden bg-zinc-950">
      {/* Background radial glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950/80 to-zinc-950"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-1000 transform ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold tracking-wide animate-pulse">
            <Sparkles size={16} />
            <span>A barbearia mais braba de Barreiros • São José</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
            <span className="text-white block">Cabelo na régua.</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300">
              Sem fila e sem enrolação.
            </span>
          </h1>
          
          {/* Subtext */}
          <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Chega de perder sábado em fila de espera. Escolha seu corte, marque seu horário em 1 minuto e cola aqui pra tomar uma gelada enquanto a gente cuida do seu estilo.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo("servicos")}
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-lg font-bold transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Scissors size={20} />
              <span>Ver Serviços & Cortes</span>
            </button>
            <button
              onClick={() => scrollTo("sobre")}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white rounded-xl text-lg font-semibold transition-all cursor-pointer"
            >
              Conhecer a Barbearia
            </button>
          </div>

          {/* Highlights */}
          <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-900/80 max-w-3xl mx-auto text-left">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">Agendou, cortou</h4>
                <p className="text-xs text-zinc-400">Sem esperar na fila</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Award size={20} />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">Na navalha afiada</h4>
                <p className="text-xs text-zinc-400">Corte e barba no detalhe</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/40">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Scissors size={20} />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">Vibe autêntica</h4>
                <p className="text-xs text-zinc-400">Resenha e café/gelada</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Down indicator */}
      <div className="pt-12 text-zinc-600 animate-bounce cursor-pointer" onClick={() => scrollTo("servicos")}>
        <ChevronDown size={28} />
      </div>
    </section>
  );
}
