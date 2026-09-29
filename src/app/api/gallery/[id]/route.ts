import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateGalleryImageSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateGalleryImageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Imagem não encontrada" }, { status: 404 });
    }

    const image = await prisma.galleryImage.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json({ data: image });
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Imagem não encontrada" }, { status: 404 });
    }

    await prisma.galleryImage.delete({ where: { id } });

    return NextResponse.json({ data: { message: "Imagem excluída com sucesso" } });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
