import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAppointmentSchema } from "@/lib/validations";
import { z } from "zod";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const barberId = searchParams.get("barberId");
    const status = searchParams.get("status") as any;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.dateTime = { gte: startOfDay, lte: endOfDay };
    }
    if (barberId) where.barberId = barberId;
    if (status) where.status = status;

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: true,
        barber: true,
        service: true,
      },
      orderBy: { dateTime: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedAppointments = appointments.map(appt => ({
      ...appt,
      price: Number(appt.price),
      service: {
        ...appt.service,
        price: Number(appt.service.price)
      }
    }));

    return NextResponse.json({ data: formattedAppointments });
  } catch (error) {
    console.error("GET /api/appointments error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createAppointmentSchema.parse(body);

    const { clientName, clientWhatsapp, barberId, serviceId, dateTime, notes } = validatedData;

    // 1. Find or create client
    const client = await prisma.client.upsert({
      where: { whatsapp: clientWhatsapp },
      update: { name: clientName },
      create: { name: clientName, whatsapp: clientWhatsapp },
    });

    // 2. Fetch service
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    }

    // 3. Calculate endTime
    const startDateTime = new Date(dateTime);
    const endDateTime = new Date(startDateTime.getTime() + service.durationMinutes * 60000);

    // 4. Check conflicts
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        barberId,
        status: { not: "CANCELLED" },
        OR: [
          {
            dateTime: { lt: endDateTime },
            endTime: { gt: startDateTime },
          }
        ]
      }
    });

    if (conflictingAppointment) {
      return NextResponse.json({ error: "Horário não disponível" }, { status: 400 });
    }

    // 5. Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        clientId: client.id,
        barberId,
        serviceId,
        dateTime: startDateTime,
        endTime: endDateTime,
        price: service.price,
        status: "SCHEDULED",
        notes: notes || null,
      },
      include: {
        client: true,
        barber: true,
        service: true
      }
    });

    const formattedAppointment = {
      ...appointment,
      price: Number(appointment.price),
      service: {
        ...appointment.service,
        price: Number(appointment.service.price)
      }
    };

    return NextResponse.json({ data: formattedAppointment }, { status: 201 });
  } catch (error) {
    console.error("POST /api/appointments error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
