import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createGalleryImageSchema } from "@/lib/validations";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const images = await prisma.galleryImage.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ data: images });
  } catch (error) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createGalleryImageSchema.parse(body);

    const image = await prisma.galleryImage.create({
      data: validatedData,
    });

    return NextResponse.json({ data: image }, { status: 201 });
  } catch (error) {
    console.error("POST /api/gallery error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
