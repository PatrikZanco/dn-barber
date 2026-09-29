import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const originalName = file.name || "upload.png";
    const ext = path.extname(originalName) || ".png";
    const cleanExt = ext.toLowerCase().replace(/[^a-z0-9.]/g, "") || ".png";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${cleanExt}`;

    // 1. Se estiver na Vercel com Vercel Blob conectado
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${filename}`, file, {
        access: "public",
      });
      return NextResponse.json({ url: blob.url, success: true });
    }

    // 2. Fallback para ambiente local de desenvolvimento
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: fileUrl, success: true });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json({ error: "Erro ao fazer upload da imagem" }, { status: 500 });
  }
}