"use client";

import { useState, useEffect } from "react";
import { Scissors, ArrowRight } from "lucide-react";
import { useBookingStore } from "@/hooks/useBookingStore";
import { cn, formatCurrency, formatDuration } from "@/lib/utils";

export default function ServiceStep() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedService, setService, nextStep } = useBookingStore();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services?active=true");
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json) ? json : (json.data || []);
          setServices(list);
        }
      } catch (error) {
        console.error("Failed to fetch services", error);
        // Mock data fallback
        setServices([
          { id: '1', name: 'Corte Clássico', price: 45, duration: 30 },
          { id: '2', name: 'Barba', price: 35, duration: 30 },
          { id: '3', name: 'Corte + Barba', price: 75, duration: 60 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleSelect = (service: any) => {
    setService(service);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-zinc-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-white">Escolha o Serviço</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id;
          return (
            <button
              key={service.id}
              onClick={() => handleSelect(service)}
              className={cn(
                "flex flex-col items-start p-5 rounded-xl border transition-all text-left group",
                isSelected 
                  ? "bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                  : "bg-zinc-950 border-zinc-800 hover:border-amber-500/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors",
                isSelected ? "bg-amber-500 text-zinc-950" : "bg-zinc-900 text-amber-500 group-hover:bg-zinc-800"
              )}>
                <Scissors size={20} />
              </div>
              <h3 className={cn(
                "font-bold text-lg mb-1",
                isSelected ? "text-amber-500" : "text-white"
              )}>
                {service.name}
              </h3>
              <div className="flex w-full justify-between items-center mt-auto pt-4">
                <span className="text-zinc-400 text-sm">
                  {formatDuration(service.durationMinutes ?? service.duration)}
                </span>
                <span className="font-bold text-white">
                  {formatCurrency ? formatCurrency(service.price) : `R$ ${service.price}`}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end pt-6 border-t border-zinc-800">
        <button
          onClick={nextStep}
          disabled={!selectedService}
          className="bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 px-8 py-3 rounded-lg font-bold transition-colors flex items-center space-x-2"
        >
          <span>Próximo Passo</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
