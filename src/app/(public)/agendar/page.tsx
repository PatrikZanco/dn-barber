"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/hooks/useBookingStore";

// Steps components (we'll import these once created)
import ServiceStep from "@/components/public/booking/ServiceStep";
import BarberDateStep from "@/components/public/booking/BarberDateStep";
import ClientInfoStep from "@/components/public/booking/ClientInfoStep";
import SummaryStep from "@/components/public/booking/SummaryStep";
import SuccessStep from "@/components/public/booking/SuccessStep";

const STEPS = [
  { id: 1, title: "Serviço" },
  { id: 2, title: "Horário" },
  { id: 3, title: "Seus Dados" },
  { id: 4, title: "Confirmação" },
  { id: 5, title: "Sucesso" },
];

export default function BookingPage() {
  const [mounted, setMounted] = useState(false);
  const { step } = useBookingStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen pt-20 bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Agende seu Horário</h1>
          <p className="text-zinc-400">Complete os passos abaixo para garantir seu atendimento.</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-800 z-0 rounded-full"></div>
            
            {/* Active Progress Bar */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 z-0 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            ></div>

            {STEPS.map((s, index) => {
              const isCompleted = step > s.id;
              const isCurrent = step === s.id;
              
              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center">
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300",
                      isCompleted ? "bg-amber-500 text-zinc-950" : 
                      isCurrent ? "bg-amber-500 text-zinc-950 ring-4 ring-amber-500/20" : 
                      "bg-zinc-800 text-zinc-500"
                    )}
                  >
                    {isCompleted ? <Check size={20} /> : s.id}
                  </div>
                  <span className={cn(
                    "absolute top-12 text-xs font-medium whitespace-nowrap hidden sm:block",
                    isCurrent || isCompleted ? "text-amber-500" : "text-zinc-500"
                  )}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in">
          {step === 1 && <ServiceStep />}
          {step === 2 && <BarberDateStep />}
          {step === 3 && <ClientInfoStep />}
          {step === 4 && <SummaryStep />}
          {step === 5 && <SuccessStep />}
        </div>
      </div>
    </div>
  );
}
