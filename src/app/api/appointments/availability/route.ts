import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { availabilityQuerySchema } from "@/lib/validations";
import { getDayOfWeek, generateTimeSlots } from "@/lib/utils";
import { z } from "zod";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const barberId = searchParams.get("barberId");
    const serviceId = searchParams.get("serviceId");

    const validatedData = availabilityQuerySchema.parse({ date, barberId, serviceId });

    // 1. Get barber's workSchedule
    const barber = await prisma.barber.findUnique({
      where: { id: validatedData.barberId }
    });

    if (!barber) {
      return NextResponse.json({ error: "Barbeiro não encontrado" }, { status: 404 });
    }

    // 2. Determine day of week safely
    const [year, month, day] = validatedData.date.split("-").map(Number);
    const targetDate = new Date(year, month - 1, day);
    const dayOfWeek = getDayOfWeek(targetDate);

    // 3. Get schedule for that day (barber schedule, shop settings fallback, or default 09:00-19:00)
    const barberSchedule = (barber.workSchedule as any)?.[dayOfWeek];
    const shopSettings = await prisma.shopSettings.findFirst();
    const shopSchedule = (shopSettings?.workingHours as any)?.[dayOfWeek];

    // If day is explicitly marked as closed
    if (barberSchedule?.closed || shopSchedule?.closed) {
      return NextResponse.json({ data: [] });
    }

    const startTime = barberSchedule?.start || barberSchedule?.open || shopSchedule?.open || shopSchedule?.start || "09:00";
    const endTime = barberSchedule?.end || barberSchedule?.close || shopSchedule?.close || shopSchedule?.end || "20:00";

    // 4. Get service duration
    const service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId }
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    }

    const duration = service.durationMinutes;

    // 5. Generate all possible time slots
    const slots = generateTimeSlots(startTime, endTime, 30);

    // 6. Fetch non-cancelled appointments for this date
    const startOfDay = new Date(`${validatedData.date}T00:00:00`);
    const endOfDay = new Date(`${validatedData.date}T23:59:59.999`);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        barberId: validatedData.barberId,
        status: { not: "CANCELLED" },
        dateTime: { gte: startOfDay, lte: endOfDay }
      }
    });

    // 7. Check for conflicts and 8. Filter past slots
    const now = new Date();
    const isToday = targetDate.toDateString() === now.toDateString();

    const availableSlots = slots.map(time => {
      const [hours, minutes] = time.split(":").map(Number);
      const slotStart = new Date(targetDate);
      slotStart.setHours(hours, minutes, 0, 0);
      
      const slotEnd = new Date(slotStart.getTime() + duration * 60000);

      // Filter past times if it's today
      if (isToday && slotStart <= now) {
        return { time, available: false };
      }

      // Check against existing appointments
      const isConflict = existingAppointments.some(appt => {
        return slotStart < appt.endTime && slotEnd > appt.dateTime;
      });

      // Also ensure slot doesn't exceed schedule end
      const scheduleEnd = new Date(targetDate);
      const [endH, endM] = endTime.split(":").map(Number);
      scheduleEnd.setHours(endH, endM, 0, 0);

      return {
        time,
        available: !isConflict && slotEnd <= scheduleEnd
      };
    });

    return NextResponse.json({ data: availableSlots });
  } catch (error) {
    console.error("GET /api/appointments/availability error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Parâmetros inválidos", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
