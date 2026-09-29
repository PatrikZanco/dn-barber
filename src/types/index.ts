import type { Decimal } from "@prisma/client/runtime/library";

// ============================================================
// Enums
// ============================================================

export type UserRole = "ADMIN" | "MANAGER";
export type AppointmentStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

// ============================================================
// Model Types (API responses)
// ============================================================

export interface ServiceResponse {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  icon: string | null;
  photo: string | null;
  active: boolean;
  createdAt: string;
}

export interface BarberResponse {
  id: string;
  name: string;
  photo: string | null;
  specialty: string | null;
  active: boolean;
  workSchedule: WorkSchedule;
  createdAt: string;
  services?: ServiceResponse[];
}

export interface ClientResponse {
  id: string;
  name: string;
  whatsapp: string;
  createdAt: string;
}

export interface AppointmentResponse {
  id: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  dateTime: string;
  endTime: string;
  status: AppointmentStatus;
  price: number;
  notes: string | null;
  createdAt: string;
  client: ClientResponse;
  barber: { id: string; name: string; photo: string | null };
  service: { id: string; name: string; durationMinutes: number };
}

export interface GalleryImageResponse {
  id: string;
  url: string;
  caption: string | null;
  order: number;
  active: boolean;
  createdAt: string;
}

export interface ShopSettingsResponse {
  id: string;
  shopName: string;
  phone: string;
  whatsapp: string;
  address: string;
  instagram: string;
  facebook: string;
  workingHours: WorkSchedule;
}

// ============================================================
// Work Schedule Types
// ============================================================

export interface WorkScheduleDay {
  start: string; // "08:00"
  end: string;   // "18:00"
}

export interface WorkSchedule {
  monday?: WorkScheduleDay;
  tuesday?: WorkScheduleDay;
  wednesday?: WorkScheduleDay;
  thursday?: WorkScheduleDay;
  friday?: WorkScheduleDay;
  saturday?: WorkScheduleDay;
  sunday?: WorkScheduleDay;
}

// ============================================================
// Dashboard Types
// ============================================================

export interface DashboardKPIs {
  todayRevenue: number;
  monthRevenue: number;
  todayAppointments: number;
  monthAppointments: number;
  newClientsMonth: number;
  completionRate: number;
}

export interface DashboardChartData {
  label: string;
  revenue: number;
  appointments: number;
}

export interface UpcomingAppointment {
  id: string;
  time: string;
  clientName: string;
  serviceName: string;
  barberName: string;
  status: AppointmentStatus;
}

// ============================================================
// Availability Types
// ============================================================

export interface TimeSlot {
  time: string;      // "09:00"
  available: boolean;
}

// ============================================================
// Booking Store Types
// ============================================================

export interface BookingState {
  step: number;
  selectedService: ServiceResponse | null;
  selectedBarber: BarberResponse | null;
  selectedDate: string | null;
  selectedTime: string | null;
  clientName: string;
  clientWhatsapp: string;
  notes: string;
  appointmentId: string | null;
}

export interface BookingActions {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setService: (service: ServiceResponse) => void;
  setBarber: (barber: BarberResponse) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setClientInfo: (name: string, whatsapp: string) => void;
  setNotes: (notes: string) => void;
  setAppointmentId: (id: string) => void;
  reset: () => void;
}

// ============================================================
// API Response Wrapper
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}
