"use client";

import { Scissors, Calendar } from "lucide-react";
import { useBookingStore } from "@/hooks/useBookingStore";

interface BarberItem {
  id: string;
  name: string;
  photo?: string | null;
  specialty?: string | null;
}

interface BarbersShowcaseProps {
  barbers: BarberItem[];
}

export default function BarbersShowcase({ barbers }: BarbersShowcaseProps) {
  const { setBarber, setStep } = useBookingStore();

  const handleSelectBarber = (barber: BarberItem) => {
    setBarber(barber as any);
    setStep(2);
    const elem = document.getElementById("agendar");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!barbers || barbers.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {barbers.map((barber) => (
        <div
          key={barber.id}
          className="bg-zinc-900/90 border border-zinc-800/90 hover:border-amber-500/60 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)] flex flex-col"
        >
          {/* Barber Photo */}
          <div className="aspect-[4/3] sm:aspect-square relative bg-zinc-800 flex items-center justify-center overflow-hidden">
            {barber.photo ? (
              <img
                src={barber.photo}
                alt={barber.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-2 bg-gradient-to-br from-zinc-800 to-zinc-900">
                <Scissors size={40} className="text-zinc-500" />
                <span className="text-xs text-zinc-500 font-medium">DN Barbearia</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
              <div>
                <h3 className="text-xl font-bold text-white drop-shadow-md">{barber.name}</h3>
                {barber.specialty && (
                  <p className="text-amber-400 text-xs font-semibold drop-shadow">{barber.specialty}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="p-4 sm:p-5 flex items-center justify-between mt-auto border-t border-zinc-800/60 bg-zinc-950/40">
            <span className="text-xs text-zinc-400">Atendimento com horário</span>
            <button
              onClick={() => handleSelectBarber(barber)}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 border border-amber-500/30 hover:border-amber-500 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar size={13} />
              <span>Agendar com {barber.name.split(" ")[0]}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
