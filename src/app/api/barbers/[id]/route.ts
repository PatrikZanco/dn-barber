import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateBarberSchema } from "@/lib/validations";
import { z } from "zod";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const barber = await prisma.barber.findUnique({
      where: { id },
      include: {
        services: {
          include: { service: true }
        }
      }
    });

    if (!barber) {
      return NextResponse.json({ error: "Barbeiro não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: barber });
  } catch (error) {
    console.error("GET /api/barbers/[id] error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateBarberSchema.parse(body);
    
    const { serviceIds, ...barberData } = validatedData;

    const barber = await prisma.barber.update({
      where: { id },
      data: {
        ...barberData,
        services: serviceIds ? {
          deleteMany: {},
          create: serviceIds.map(serviceId => ({
            service: { connect: { id: serviceId } }
          }))
        } : undefined
      },
      include: {
        services: {
          include: { service: true }
        }
      }
    });

    return NextResponse.json({ data: barber });
  } catch (error) {
    console.error("PATCH /api/barbers/[id] error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Delete associated appointments first to satisfy foreign key constraint
    await prisma.appointment.deleteMany({
      where: { barberId: id },
    });

    // Delete associated service relations
    await prisma.barberService.deleteMany({
      where: { barberId: id },
    });

    // Permanently delete the barber
    try {
      await prisma.barber.delete({
        where: { id },
      });
    } catch (err: any) {
      if (err.code !== 'P2025') throw err;
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE /api/barbers/[id] error:", error);
    return NextResponse.json({ error: "Erro ao excluir barbeiro do banco de dados" }, { status: 500 });
  }
}
