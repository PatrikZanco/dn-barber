"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, User, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useBookingStore } from "@/hooks/useBookingStore";
import { cn, formatDate } from "@/lib/utils";

export default function BarberDateStep() {
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loadingBarbers, setLoadingBarbers] = useState(true);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  const { 
    selectedBarber, 
    setBarber, 
    selectedDate, 
    setDate, 
    selectedTime, 
    setTime, 
    nextStep, 
    prevStep,
    selectedService 
  } = useBookingStore();

  // Generate next 14 days
  const nextDays = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const res = await fetch("/api/barbers?active=true");
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json) ? json : (json.data || []);
          setBarbers(list);
          if (!selectedBarber && list.length > 0) {
            setBarber(list[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch barbers", error);
        setBarbers([
          { id: '1', name: 'João Silva' },
          { id: '2', name: 'Pedro Santos' },
        ]);
      } finally {
        setLoadingBarbers(false);
      }
    };
    fetchBarbers();
  }, []);

  useEffect(() => {
    if (!selectedDate && nextDays.length > 0) {
      const d0 = nextDays[0];
      const y = d0.getFullYear();
      const m = String(d0.getMonth() + 1).padStart(2, '0');
      const day = String(d0.getDate()).padStart(2, '0');
      setDate(`${y}-${m}-${day}`);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedBarber && selectedDate && selectedService) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
          const res = await fetch(`/api/appointments/availability?barberId=${selectedBarber.id}&date=${selectedDate}&serviceId=${selectedService.id}`);
          if (res.ok) {
            const json = await res.json();
            const raw = Array.isArray(json) ? json : (json.data || json.availableSlots || []);
            const slots = raw
              .filter((item: any) => typeof item === 'string' || item.available !== false)
              .map((item: any) => typeof item === 'string' ? item : item.time);
            setTimeSlots(slots);
          } else {
            setTimeSlots(['09:00', '10:00', '14:30', '16:00']);
          }
        } catch (error) {
          console.error("Failed to fetch slots", error);
          setTimeSlots(['09:00', '10:00', '14:30', '16:00']);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [selectedBarber, selectedDate, selectedService]);

  const isNextDisabled = !selectedBarber || !selectedDate || !selectedTime;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Barbers */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <User className="mr-2 text-amber-500" size={20} />
          Escolha o Profissional
        </h2>
        {loadingBarbers ? (
          <div className="flex gap-4">
            <div className="w-32 h-32 bg-zinc-800 rounded-xl animate-pulse"></div>
            <div className="w-32 h-32 bg-zinc-800 rounded-xl animate-pulse"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {barbers.map(barber => (
              <button
                key={barber.id}
                onClick={() => setBarber(barber)}
                className={cn(
                  "p-4 rounded-xl border transition-all text-center flex flex-col items-center",
                  selectedBarber?.id === barber.id 
                    ? "bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                    : "bg-zinc-950 border-zinc-800 hover:border-amber-500/50"
                )}
              >
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                  <User className={selectedBarber?.id === barber.id ? "text-amber-500" : "text-zinc-500"} />
                </div>
                <span className={cn(
                  "font-medium text-sm",
                  selectedBarber?.id === barber.id ? "text-amber-500" : "text-zinc-300"
                )}>{barber.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Date & Time (Only show if barber selected) */}
      {selectedBarber && (
        <div className="space-y-8 pt-6 border-t border-zinc-800 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <CalendarIcon className="mr-2 text-amber-500" size={20} />
              Escolha a Data
            </h2>
            <div className="flex overflow-x-auto pb-4 gap-3 snap-x hide-scrollbar">
              {nextDays.map((d, i) => {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const dateString = `${y}-${m}-${day}`;
                const isSelected = selectedDate === dateString;
                const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
                const dayNum = d.getDate();
                
                return (
                  <button
                    key={i}
                    onClick={() => { setDate(dateString); setTime(''); }}
                    className={cn(
                      "snap-start flex-shrink-0 w-16 h-20 rounded-xl border flex flex-col items-center justify-center transition-all",
                      isSelected 
                        ? "bg-amber-500 border-amber-500 text-zinc-950" 
                        : "bg-zinc-950 border-zinc-800 hover:border-amber-500/50 text-zinc-400"
                    )}
                  >
                    <span className="text-xs font-medium uppercase mb-1">{dayName}</span>
                    <span className="text-xl font-bold">{dayNum}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Clock className="mr-2 text-amber-500" size={20} />
                Horários Disponíveis
              </h2>
              
              {loadingSlots ? (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-12 bg-zinc-800 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : timeSlots.length > 0 ? (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {timeSlots.map(t => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={cn(
                        "py-3 rounded-lg border font-medium transition-all text-sm",
                        selectedTime === t
                          ? "bg-amber-500 border-amber-500 text-zinc-950 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                          : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-amber-500/50"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-950/50 text-zinc-400 text-center">
                  Nenhum horário disponível para esta data.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-6 border-t border-zinc-800">
        <button
          onClick={prevStep}
          className="text-zinc-400 hover:text-white px-6 py-3 font-medium transition-colors flex items-center space-x-2"
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        <button
          onClick={nextStep}
          disabled={isNextDisabled}
          className="bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 px-8 py-3 rounded-lg font-bold transition-colors flex items-center space-x-2"
        >
          <span>Próximo Passo</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
