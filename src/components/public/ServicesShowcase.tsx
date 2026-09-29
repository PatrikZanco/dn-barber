"use client";

import { Scissors, Clock, ArrowRight, Sparkles } from "lucide-react";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { useBookingStore } from "@/hooks/useBookingStore";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description?: string | null;
  photo?: string | null;
}

interface ServicesShowcaseProps {
  services: ServiceItem[];
}

export default function ServicesShowcase({ services }: ServicesShowcaseProps) {
  const { setService, setStep } = useBookingStore();

  const handleSelectService = (service: ServiceItem) => {
    setService(service as any);
    setStep(2); // Go directly to Barber & Date/Time step
    const agendarElem = document.getElementById("agendar");
    if (agendarElem) {
      agendarElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-12">
      {/* Grid of services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-zinc-900/90 border border-zinc-800/90 hover:border-amber-500/60 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_10px_30px_rgba(245,158,11,0.12)] group hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Ambient hover glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/0 group-hover:bg-amber-500/5 rounded-full blur-2xl transition-all duration-500 pointer-events-none"></div>

            <div>
              {/* Header card */}
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-zinc-950 transition-all duration-300">
                  <Scissors size={22} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/70 border border-zinc-700/50 text-zinc-400 text-xs font-medium">
                  <Clock size={13} className="text-amber-500" />
                  <span>{formatDuration(service.durationMinutes)}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                {service.name}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                {service.description || "Corte detalhado e finalização de primeira para alinhar o seu visual."}
              </p>
            </div>

            {/* Price & Action */}
            <div className="pt-5 border-t border-zinc-800/80 flex items-center justify-between mt-auto">
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider block font-semibold">Valor</span>
                <span className="text-2xl font-extrabold text-amber-500">
                  {formatCurrency(service.price)}
                </span>
              </div>

              <button
                onClick={() => handleSelectService(service)}
                className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 border border-amber-500/30 hover:border-amber-500 text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Agendar</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick notice under cards */}
      <div className="text-center">
        <p className="text-sm text-zinc-400 flex items-center justify-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          <span>Clique em <strong>Agendar</strong> no seu serviço para escolher o profissional e o melhor horário abaixo</span>
        </p>
      </div>
    </div>
  );
}
