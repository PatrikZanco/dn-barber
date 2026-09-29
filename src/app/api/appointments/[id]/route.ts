import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateAppointmentStatusSchema } from "@/lib/validations";
import { z } from "zod";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        barber: true,
        service: true,
      }
    });

    if (!appointment) {
      return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 });
    }

    const formattedAppointment = {
      ...appointment,
      price: Number(appointment.price),
      service: {
        ...appointment.service,
        price: Number(appointment.service.price)
      }
    };

    return NextResponse.json({ data: formattedAppointment });
  } catch (error) {
    console.error("GET /api/appointments/[id] error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateAppointmentStatusSchema.parse(body);

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: validatedData.status },
      include: {
        client: true,
        barber: true,
        service: true,
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

    return NextResponse.json({ data: formattedAppointment });
  } catch (error) {
    console.error("PATCH /api/appointments/[id] error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE /api/appointments/[id] error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
