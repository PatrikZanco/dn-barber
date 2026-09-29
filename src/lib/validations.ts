import { z } from "zod";

// ============================================================
// Service Schemas
// ============================================================

export const createServiceSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  price: z.coerce.number().positive("Preço deve ser positivo"),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(15, "Duração mínima de 15 minutos")
    .max(480, "Duração máxima de 8 horas"),
  icon: z.string().optional(),
  photo: z.string().optional().or(z.literal("")),
  active: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

// ============================================================
// Barber Schemas
// ============================================================

const workScheduleDaySchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/, "Formato inválido (HH:MM)"),
  end: z.string().regex(/^\d{2}:\d{2}$/, "Formato inválido (HH:MM)"),
});

const workScheduleSchema = z.object({
  monday: workScheduleDaySchema.optional(),
  tuesday: workScheduleDaySchema.optional(),
  wednesday: workScheduleDaySchema.optional(),
  thursday: workScheduleDaySchema.optional(),
  friday: workScheduleDaySchema.optional(),
  saturday: workScheduleDaySchema.optional(),
  sunday: workScheduleDaySchema.optional(),
});

export const createBarberSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  photo: z.string().optional().or(z.literal("")),
  specialty: z.string().optional(),
  active: z.boolean().default(true),
  workSchedule: workScheduleSchema.default({}),
  serviceIds: z.array(z.string()).optional(),
});

export const updateBarberSchema = createBarberSchema.partial();

// ============================================================
// Client Schemas
// ============================================================

export const clientInfoSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  whatsapp: z
    .string()
    .min(10, "WhatsApp deve ter no mínimo 10 dígitos")
    .max(15, "WhatsApp deve ter no máximo 15 dígitos")
    .regex(/^[\d()\s-+]+$/, "WhatsApp inválido"),
});

// ============================================================
// Appointment Schemas
// ============================================================

export const createAppointmentSchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço"),
  barberId: z.string().min(1, "Selecione um barbeiro"),
  dateTime: z.string().min(1, "Selecione data e hora"),
  clientName: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  clientWhatsapp: z
    .string()
    .min(10, "WhatsApp inválido")
    .regex(/^[\d()\s-+]+$/, "WhatsApp inválido"),
  notes: z.string().max(500, "Observações devem ter no máximo 500 caracteres").optional(),
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

// ============================================================
// Availability Query Schema
// ============================================================

export const availabilityQuerySchema = z.object({
  barberId: z.string().min(1, "Barbeiro obrigatório"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data no formato YYYY-MM-DD"),
  serviceId: z.string().min(1, "Serviço obrigatório"),
});

// ============================================================
// Gallery Schemas
// ============================================================

export const createGalleryImageSchema = z.object({
  url: z.string().min(1, "URL ou imagem obrigatória"),
  caption: z.string().optional(),
  order: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});

export const updateGalleryImageSchema = createGalleryImageSchema.partial();

// ============================================================
// Settings Schema
// ============================================================

export const shopWorkingHoursDaySchema = z.object({
  open: z.string().optional(),
  close: z.string().optional(),
  closed: z.boolean().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
}).passthrough();

export const shopWorkingHoursSchema = z.record(z.string(), z.any());

export const updateSettingsSchema = z.object({
  id: z.string().optional(),
  shopName: z.string().min(1, "Nome da barbearia é obrigatório").optional(),
  phone: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  workingHours: shopWorkingHoursSchema.optional(),
  updatedAt: z.any().optional(),
  createdAt: z.any().optional(),
});

// ============================================================
// Auth Schemas
// ============================================================

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6, "Nova senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

// ============================================================
// Types inferred from schemas
// ============================================================

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type CreateBarberInput = z.infer<typeof createBarberSchema>;
export type UpdateBarberInput = z.infer<typeof updateBarberSchema>;
export type ClientInfoInput = z.infer<typeof clientInfoSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;
export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
