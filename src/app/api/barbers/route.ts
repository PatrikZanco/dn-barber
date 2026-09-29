import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createBarberSchema } from "@/lib/validations";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const barbers = await prisma.barber.findMany({
      where: activeOnly ? { active: true } : undefined,
      include: {
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: { name: "asc" },
    });

    const formattedBarbers = barbers.map(barber => ({
      ...barber,
      services: barber.services.map((bs: any) => ({
        ...bs.service,
        price: Number(bs.service.price)
      }))
    }));

    return NextResponse.json({ data: formattedBarbers });
  } catch (error) {
    console.error("GET /api/barbers error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createBarberSchema.parse(body);
    
    const { serviceIds, ...barberData } = validatedData;

    const barber = await prisma.barber.create({
      data: {
        ...barberData,
        services: serviceIds ? {
          create: serviceIds.map(serviceId => ({
            service: { connect: { id: serviceId } }
          }))
        } : undefined
      },
      include: {
        services: {
          include: {
            service: true
          }
        }
      }
    });

    return NextResponse.json({ data: barber }, { status: 201 });
  } catch (error) {
    console.error("POST /api/barbers error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
