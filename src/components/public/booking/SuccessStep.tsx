"use client";

import { CheckCircle, Calendar, Clock, MapPin, MessageCircle } from "lucide-react";
import { useBookingStore } from "@/hooks/useBookingStore";
import { formatDate } from "@/lib/utils";

export default function SuccessStep() {
  const { selectedDate, selectedTime, selectedService, appointmentId, reset } = useBookingStore();

  const formattedDate = selectedDate ? (formatDate ? formatDate(new Date(selectedDate)) : selectedDate) : "";
  const shopPhone = "5511987654321"; // Replace with actual shop number
  
  const whatsappMessage = encodeURIComponent(
    `Olá! Meu agendamento está confirmado para ${formattedDate} às ${selectedTime} para o serviço de ${selectedService?.name}. Código: ${appointmentId}`
  );
  const whatsappUrl = `https://wa.me/${shopPhone}?text=${whatsappMessage}`;

  return (
    <div className="text-center space-y-8 py-8 animate-fade-in">
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center animate-bounce-short">
          <CheckCircle className="w-12 h-12 text-amber-500" />
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Agendamento Confirmado!</h2>
        <p className="text-zinc-400 max-w-md mx-auto">
          Tudo certo! Te esperamos na data e horário marcados. Um comprovante foi gerado abaixo.
        </p>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-left max-w-sm mx-auto shadow-lg relative overflow-hidden">
        {/* Ticket styling accents */}
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
        <div className="absolute -left-3 top-1/2 w-6 h-6 bg-zinc-900 rounded-full border-r border-zinc-800"></div>
        <div className="absolute -right-3 top-1/2 w-6 h-6 bg-zinc-900 rounded-full border-l border-zinc-800"></div>
        
        <div className="border-b border-dashed border-zinc-800 pb-4 mb-4 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Código do Agendamento</p>
          <p className="font-mono text-white font-bold tracking-widest">{appointmentId}</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center text-zinc-300">
            <Calendar size={18} className="text-amber-500 mr-3 shrink-0" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center text-zinc-300">
            <Clock size={18} className="text-amber-500 mr-3 shrink-0" />
            <span className="font-medium">{selectedTime}</span>
          </div>
          <div className="flex items-start text-zinc-300">
            <MapPin size={18} className="text-amber-500 mr-3 shrink-0 mt-0.5" />
            <span className="text-sm">R. Mar Del Plata, 843 - Barreiros<br/>São José - SC, 88117-410</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 max-w-sm mx-auto">
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-4 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
        >
          <MessageCircle size={20} />
          <span>Salvar no WhatsApp</span>
        </a>
        
        <button 
          type="button"
          onClick={() => {
            reset();
            const elem = document.getElementById("agendar") || document.getElementById("servicos");
            elem?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 px-6 py-4 rounded-lg font-bold transition-colors cursor-pointer"
        >
          Fazer Outro Agendamento
        </button>
        
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              reset();
              const elem = document.getElementById("servicos") || document.body;
              elem?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-amber-500 hover:text-amber-400 font-semibold underline-offset-4 hover:underline cursor-pointer text-sm"
          >
            ← Voltar ao Início
          </button>
        </div>
      </div>
    </div>
  );
}
