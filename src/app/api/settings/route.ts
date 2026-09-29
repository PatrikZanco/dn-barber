import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateSettingsSchema } from "@/lib/validations";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    let settings = await prisma.shopSettings.findFirst();

    if (!settings) {
      settings = await prisma.shopSettings.create({
        data: {
          shopName: "DN Barbearia",
          whatsapp: "",
          address: "",
          instagram: "",
          workingHours: {},
        }
      });
    }

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validatedData = updateSettingsSchema.parse(body);

    const existingSettings = await prisma.shopSettings.findFirst();

    if (!existingSettings) {
      return NextResponse.json({ error: "Configurações não encontradas" }, { status: 404 });
    }

    const { id, updatedAt, createdAt, ...updateFields } = validatedData as any;

    // Normalize nulls to empty strings since Prisma columns are String @default("")
    if (updateFields.phone === null) updateFields.phone = "";
    if (updateFields.whatsapp === null) updateFields.whatsapp = "";
    if (updateFields.address === null) updateFields.address = "";
    if (updateFields.instagram === null) updateFields.instagram = "";
    if (updateFields.facebook === null) updateFields.facebook = "";

    const settings = await prisma.shopSettings.update({
      where: { id: existingSettings.id },
      data: updateFields,
    });

    return NextResponse.json({ data: settings });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
