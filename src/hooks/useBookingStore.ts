import { create } from "zustand";
import type { BookingState, BookingActions, ServiceResponse, BarberResponse } from "@/types";

const initialState: BookingState = {
  step: 1,
  selectedService: null,
  selectedBarber: null,
  selectedDate: null,
  selectedTime: null,
  clientName: "",
  clientWhatsapp: "",
  notes: "",
  appointmentId: null,
};

export const useBookingStore = create<BookingState & BookingActions>((set) => ({
  ...initialState,

  setStep: (step: number) => set({ step }),

  nextStep: () =>
    set((state) => ({ step: Math.min(state.step + 1, 5) })),

  prevStep: () =>
    set((state) => ({ step: Math.max(state.step - 1, 1) })),

  setService: (service: ServiceResponse) =>
    set({ selectedService: service }),

  setBarber: (barber: BarberResponse) =>
    set({ selectedBarber: barber, selectedDate: null, selectedTime: null }),

  setDate: (date: string) =>
    set({ selectedDate: date, selectedTime: null }),

  setTime: (time: string) =>
    set({ selectedTime: time }),

  setClientInfo: (name: string, whatsapp: string) =>
    set({ clientName: name, clientWhatsapp: whatsapp }),

  setNotes: (notes: string) =>
    set({ notes }),

  setAppointmentId: (id: string) =>
    set({ appointmentId: id }),

  reset: () => set(initialState),
}));
