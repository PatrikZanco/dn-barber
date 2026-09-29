import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServiceSchema } from "@/lib/validations";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const services = await prisma.service.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: { name: "asc" },
    });

    const formattedServices = services.map(service => ({
      ...service,
      price: Number(service.price)
    }));

    return NextResponse.json({ data: formattedServices });
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createServiceSchema.parse(body);

    const service = await prisma.service.create({
      data: validatedData,
    });

    return NextResponse.json({ data: { ...service, price: Number(service.price) } }, { status: 201 });
  } catch (error) {
    console.error("POST /api/services error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
