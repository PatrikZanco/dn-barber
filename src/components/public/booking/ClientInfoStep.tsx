"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, User, Phone, AlignLeft } from "lucide-react";
import { useBookingStore } from "@/hooks/useBookingStore";
import { cn } from "@/lib/utils";

export default function ClientInfoStep() {
  const { clientName, clientWhatsapp, setClientInfo, setNotes, notes, nextStep, prevStep } = useBookingStore();
  const [errors, setErrors] = useState<{name?: string, phone?: string}>({});

  const validate = () => {
    const newErrors: {name?: string, phone?: string} = {};
    if (!clientName.trim()) newErrors.name = "Nome é obrigatório";
    if (!clientWhatsapp.trim() || clientWhatsapp.replace(/\D/g, '').length < 10) {
      newErrors.phone = "WhatsApp válido é obrigatório";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      nextStep();
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simple mask for brazilian phone (11) 99999-9999
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    let formatted = value;
    if (value.length > 2) formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 7) formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    
    setClientInfo(clientName, formatted);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-white">Seus Dados</h2>
      
      <div className="space-y-5">
        <div>
          <label className="flex items-center text-sm font-medium text-zinc-400 mb-2">
            <User size={16} className="mr-2" />
            Nome Completo
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientInfo(e.target.value, clientWhatsapp)}
            placeholder="Digite seu nome"
            className={cn(
              "w-full bg-zinc-950 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all",
              errors.name ? "border-red-500" : "border-zinc-800 focus:border-amber-500"
            )}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-zinc-400 mb-2">
            <Phone size={16} className="mr-2" />
            WhatsApp
          </label>
          <input
            type="tel"
            value={clientWhatsapp}
            onChange={handlePhoneChange}
            placeholder="(11) 99999-9999"
            className={cn(
              "w-full bg-zinc-950 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all",
              errors.phone ? "border-red-500" : "border-zinc-800 focus:border-amber-500"
            )}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-zinc-400 mb-2">
            <AlignLeft size={16} className="mr-2" />
            Observações (Opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Alguma preferência especial?"
            rows={3}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none"
          />
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-zinc-800">
        <button
          onClick={prevStep}
          className="text-zinc-400 hover:text-white px-6 py-3 font-medium transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        <button
          onClick={handleNext}
          className="bg-amber-500 hover:bg-amber-600 text-zinc-950 px-8 py-3 rounded-lg font-bold transition-colors flex items-center space-x-2"
        >
          <span>Continuar</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
