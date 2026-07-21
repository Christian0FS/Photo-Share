import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

// GET: lista todas as fotos, mais recentes primeiro, com contagem de likes
export async function GET() {
  const currentUser = await getCurrentUser();

  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      likes: { select: { userId: true } },
    },
  });

  const result = photos.map((photo) => ({
    id: photo.id,
    url: photo.url,
    description: photo.description,
    createdAt: photo.createdAt,
    author: photo.author,
    likeCount: photo.likes.length,
    likedByMe: currentUser
      ? photo.likes.some((l) => l.userId === currentUser.id)
      : false,
  }));

  return NextResponse.json({ photos: result });
}

// POST: recebe multipart/form-data com o arquivo "photo" e o campo "description"
export async function POST(request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      { error: "Você precisa estar logado para publicar uma foto." },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("photo");
  const description = formData.get("description")?.toString() || "";

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { error: "Nenhuma foto enviada." },
      { status: 400 }
    );
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato de imagem não suportado. Use JPG, PNG, WEBP ou GIF." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "A imagem precisa ter no máximo 8MB." },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop();
  const filename = `${uuid()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await writeFile(path.join(uploadDir, filename), buffer);

  const photo = await prisma.photo.create({
    data: {
      url: `/uploads/${filename}`,
      description,
      authorId: currentUser.id,
    },
  });

  return NextResponse.json({ photo });
}
