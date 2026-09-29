"use client";

import { useEffect, useState } from "react";
import { Check, Scissors, Calendar, Clock, User, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/hooks/useBookingStore";

import ServiceStep from "@/components/public/booking/ServiceStep";
import BarberDateStep from "@/components/public/booking/BarberDateStep";
import ClientInfoStep from "@/components/public/booking/ClientInfoStep";
import SummaryStep from "@/components/public/booking/SummaryStep";
import SuccessStep from "@/components/public/booking/SuccessStep";

const STEPS = [
  { id: 1, title: "Corte / Serviço", icon: Scissors },
  { id: 2, title: "Barbeiro e Hora", icon: Clock },
  { id: 3, title: "Seus Dados", icon: User },
  { id: 4, title: "Confirmação", icon: Calendar },
  { id: 5, title: "Pronto!", icon: CheckCircle },
];

export default function BookingSection() {
  const [mounted, setMounted] = useState(false);
  const { step, setStep } = useBookingStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Stepper Progress Bar */}
      <div className="mb-10 px-2">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-800 z-0 rounded-full"></div>
          
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 z-0 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          ></div>

          {STEPS.map((s) => {
            const isCompleted = step > s.id;
            const isCurrent = step === s.id;
            const Icon = s.icon;
            
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (isCompleted) {
                      setStep(s.id);
                    }
                  }}
                  disabled={!isCompleted && !isCurrent}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md",
                    isCompleted ? "bg-amber-500 text-zinc-950 hover:bg-amber-400 cursor-pointer" : 
                    isCurrent ? "bg-amber-500 text-zinc-950 ring-4 ring-amber-500/30" : 
                    "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  )}
                >
                  {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                </button>
                <span className={cn(
                  "absolute top-12 text-xs font-semibold whitespace-nowrap hidden sm:block transition-colors",
                  isCurrent || isCompleted ? "text-amber-400" : "text-zinc-500"
                )}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Step Title Badge */}
      <div className="sm:hidden flex items-center justify-between px-1 mb-3 text-xs bg-zinc-900/80 border border-zinc-800 rounded-lg py-2 px-3">
        <span className="text-zinc-400 font-medium">Passo {step} de {STEPS.length}</span>
        <span className="text-amber-400 font-bold">{STEPS[step - 1]?.title}</span>
      </div>

      {/* Step Container */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        {step === 1 && <ServiceStep />}
        {step === 2 && <BarberDateStep />}
        {step === 3 && <ClientInfoStep />}
        {step === 4 && <SummaryStep />}
        {step === 5 && <SuccessStep />}
      </div>
    </div>
  );
}
