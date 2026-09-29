'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Play, Clock, User, Calendar as CalendarIcon, Scissors, MessageSquare, Phone } from 'lucide-react';
import { getStatusLabel, getStatusColor, formatTime, formatCurrency } from '@/lib/utils';

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DAYS_SHORT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const DAYS_FULL = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

function toISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function AgendaPage() {
  const todayDateStr = toISODate(new Date());
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [filterBarberId, setFilterBarberId] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Fetch barbers
  useEffect(() => {
    fetch('/api/barbers?active=true')
      .then(res => res.json())
      .then(data => {
        if (data.data) setBarbers(data.data);
      })
      .catch(console.error);
  }, []);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        let url = '/api/appointments?limit=1000';
        if (filterBarberId !== 'ALL') {
          url += `&barberId=${filterBarberId}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (data.data) {
          setAppointments(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [filterBarberId]);

  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    setAppointments(prev => 
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    );
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const goToPrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(todayDateStr);
  };

  // Calendar logic
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const startDayOfWeek = startOfMonth.getDay(); 
  const daysInMonth = endOfMonth.getDate();

  const calendarDays = [];
  
  // Prev month days
  const prevMonthEnd = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - 1, prevMonthEnd - i);
    calendarDays.push({
      date: d,
      dateString: toISODate(d),
      isCurrentMonth: false,
      isToday: toISODate(d) === todayDateStr,
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(currentYear, currentMonth, i);
    calendarDays.push({
      date: d,
      dateString: toISODate(d),
      isCurrentMonth: true,
      isToday: toISODate(d) === todayDateStr,
    });
  }
  
  // Next month days
  const remainingSlots = 42 - calendarDays.length;
  for (let i = 1; i <= remainingSlots; i++) {
    const d = new Date(currentYear, currentMonth + 1, i);
    calendarDays.push({
      date: d,
      dateString: toISODate(d),
      isCurrentMonth: false,
      isToday: toISODate(d) === todayDateStr,
    });
  }

  const currentMonthDays = calendarDays.filter(d => d.isCurrentMonth);

  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, appt) => {
    // appt.dateTime is ISO string, we need to extract date in local timezone equivalent
    // The API might return UTC, so parsing it as Date object first is safer
    const d = new Date(appt.dateTime);
    const dateStr = toISODate(d);
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(appt);
    return acc;
  }, {} as Record<string, any[]>);

  // Sort daily appointments by time
  (Object.values(appointmentsByDate) as any[][]).forEach((arr: any[]) => {
    arr.sort((a: any, b: any) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  });

  const getFormattedSelectedDate = () => {
    const [y, m, d] = selectedDate.split('-');
    const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
    return `${DAYS_FULL[dateObj.getDay()]}, ${dateObj.getDate()} de ${MONTHS[dateObj.getMonth()]}`;
  };

  const selectedDayAppointments = appointmentsByDate[selectedDate] || [];

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className="flex-1 space-y-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <select 
              value={filterBarberId}
              onChange={(e) => setFilterBarberId(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-100 focus:border-amber-500 focus:outline-none w-full sm:w-auto"
            >
              <option value="ALL">Todos os Barbeiros</option>
              {barbers.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <button 
              onClick={goToToday}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors whitespace-nowrap text-zinc-100"
            >
              Hoje
            </button>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <button 
              onClick={goToPrevMonth}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-zinc-100 w-40 text-center">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <button 
              onClick={goToNextMonth}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Mobile: Horizontal Day List */}
        <div className="md:hidden flex overflow-x-auto gap-2 pb-2 snap-x">
          {currentMonthDays.map((day, i) => {
            const hasAppts = appointmentsByDate[day.dateString]?.length > 0;
            const isSelected = day.dateString === selectedDate;
            
            return (
              <button
                key={day.dateString}
                onClick={() => setSelectedDate(day.dateString)}
                className={`snap-center flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl border transition-all
                  ${isSelected 
                    ? 'border-amber-500 bg-amber-500/10' 
                    : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                  }
                  ${day.isToday && !isSelected ? 'ring-1 ring-amber-500/50' : ''}
                `}
              >
                <span className="text-xs text-zinc-400 font-medium mb-1">{DAYS_SHORT[day.date.getDay()]}</span>
                <span className={`text-xl font-bold ${isSelected ? 'text-amber-500' : 'text-zinc-100'}`}>
                  {day.date.getDate()}
                </span>
                <div className="h-1.5 mt-1">
                  {hasAppts && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Desktop: Calendar Grid */}
        <div className="hidden md:block bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-zinc-800 bg-zinc-950/50">
            {DAYS_SHORT.map((day) => (
              <div key={day} className="py-3 text-center text-sm font-medium text-zinc-400">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 auto-rows-[120px]">
            {calendarDays.map((day, i) => {
              const dayAppointments = appointmentsByDate[day.dateString] || [];
              const visibleAppointments = dayAppointments.slice(0, 3);
              const hiddenCount = dayAppointments.length - 3;
              const isSelected = day.dateString === selectedDate;
              
              return (
                <div 
                  key={i}
                  onClick={() => setSelectedDate(day.dateString)}
                  className={`relative p-2 border-r border-b border-zinc-800 cursor-pointer transition-colors hover:bg-zinc-800/30 overflow-hidden
                    ${!day.isCurrentMonth ? 'bg-zinc-950/50' : ''}
                    ${isSelected ? 'border-2 border-amber-500 z-10' : ''}
                    ${day.isToday && !isSelected ? 'bg-amber-500/5 ring-1 ring-inset ring-amber-500/30' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="opacity-0">-</span>
                    <span className={`text-sm font-medium ${
                      !day.isCurrentMonth ? 'text-zinc-600' : 
                      day.isToday ? 'text-amber-500' : 'text-zinc-300'
                    }`}>
                      {day.date.getDate()}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {visibleAppointments.map((appt: any) => (
                      <div 
                        key={appt.id} 
                        className={`text-[10px] px-1.5 py-0.5 rounded border truncate ${getStatusColor(appt.status)}`}
                        title={`${formatTime(appt.dateTime)} - ${appt.client?.name}`}
                      >
                        <span className="font-medium">{formatTime(appt.dateTime)}</span> {appt.client?.name?.split(' ')[0]}
                      </div>
                    ))}
                    {hiddenCount > 0 && (
                      <div className="text-[10px] text-zinc-500 font-medium pl-1">
                        +{hiddenCount} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Appointment Detail Panel */}
      <div className="xl:w-96 w-full flex flex-col">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full sticky top-6">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <CalendarIcon size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-100">{getFormattedSelectedDate()}</h3>
              <p className="text-sm text-zinc-400">{selectedDayAppointments.length} agendamentos</p>
            </div>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto max-h-[600px] space-y-4">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-zinc-500">
                <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-3" />
                <p>Carregando...</p>
              </div>
            ) : selectedDayAppointments.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 flex flex-col items-center">
                <CalendarIcon className="mb-2 opacity-20" size={48} />
                <p>Nenhum agendamento neste dia</p>
              </div>
            ) : (
              selectedDayAppointments.map((appt: any) => (
                <div key={appt.id} className="p-4 rounded-lg border border-zinc-800 bg-zinc-950/50 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-zinc-100 font-medium">
                      <Clock size={16} className="text-amber-500" />
                      {formatTime(appt.dateTime)}
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(appt.status)}`}>
                      {getStatusLabel(appt.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-zinc-200 font-semibold">
                        <User size={14} className="text-zinc-400" />
                        {appt.client?.name}
                      </div>
                      {appt.client?.whatsapp && (
                        <a
                          href={`https://wa.me/55${appt.client.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                          title="Chamar no WhatsApp"
                        >
                          <Phone size={12} />
                          <span>{appt.client.whatsapp}</span>
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                      <Scissors size={14} className="text-amber-500" />
                      {appt.service?.name} ({formatCurrency(appt.price)})
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400 pt-1 border-t border-zinc-800/50">
                      Barbeiro: <span className="text-zinc-200 font-medium">{appt.barber?.name}</span>
                    </div>
                    {appt.notes && (
                      <div className="mt-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
                        <MessageSquare size={14} className="text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-400 block">Mensagem do Cliente:</span>
                          <span className="text-zinc-300 leading-relaxed">{appt.notes}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-3 border-t border-zinc-800">
                    {appt.status === 'CONFIRMED' || appt.status === 'PENDING' || appt.status === 'SCHEDULED' ? (
                      <button 
                        onClick={() => updateStatus(appt.id, 'IN_PROGRESS')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-md transition-colors"
                      >
                        <Play size={14} /> Iniciar
                      </button>
                    ) : null}
                    
                    {appt.status === 'IN_PROGRESS' ? (
                      <button 
                        onClick={() => updateStatus(appt.id, 'COMPLETED')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-md transition-colors"
                      >
                        <Check size={14} /> Concluir
                      </button>
                    ) : null}

                    {['PENDING', 'CONFIRMED', 'SCHEDULED', 'IN_PROGRESS'].includes(appt.status) ? (
                      <button 
                        onClick={() => updateStatus(appt.id, 'CANCELLED')}
                        className="flex items-center justify-center p-1.5 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                        title="Cancelar Agendamento"
                      >
                        <X size={16} />
                      </button>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
