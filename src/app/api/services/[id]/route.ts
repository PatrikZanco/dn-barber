import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateServiceSchema } from "@/lib/validations";
import { z } from "zod";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: { ...service, price: Number(service.price) } });
  } catch (error) {
    console.error("GET /api/services/[id] error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateServiceSchema.parse(body);

    const service = await prisma.service.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ data: { ...service, price: Number(service.price) } });
  } catch (error) {
    console.error("PATCH /api/services/[id] error:", error);
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
      where: { serviceId: id },
    });

    // Delete associated barber relations
    await prisma.barberService.deleteMany({
      where: { serviceId: id },
    });

    // Permanently delete the service
    try {
      await prisma.service.delete({
        where: { id },
      });
    } catch (err: any) {
      if (err.code !== 'P2025') throw err;
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("DELETE /api/services/[id] error:", error);
    return NextResponse.json({ error: "Erro ao excluir serviço do banco de dados" }, { status: 500 });
  }
}
