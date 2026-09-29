import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} às ${formatTime(date)}`;
}

export function formatDuration(minutes: number | string | undefined | null): string {
  const mNum = typeof minutes === "string" ? parseInt(minutes, 10) : Number(minutes);
  if (!mNum || isNaN(mNum)) return "30min";
  if (mNum < 60) return `${mNum}min`;
  const h = Math.floor(mNum / 60);
  const m = mNum % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function formatWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export function getDayOfWeek(date: Date): string {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[date.getDay()];
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes: number = 30
): string[] {
  const slots: string[] = [];
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (currentMinutes + intervalMinutes <= endMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    currentMinutes += intervalMinutes;
  }

  return slots;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    SCHEDULED: "Agendado",
    IN_PROGRESS: "Em Andamento",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    SCHEDULED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    IN_PROGRESS: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    COMPLETED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return colors[status] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
}
