import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// POST: alterna (curte se ainda não curtiu, descurte se já tinha curtido)
export async function POST(request, { params }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      { error: "Você precisa estar logado para curtir." },
      { status: 401 }
    );
  }

  const photoId = params.id;
  const photo = await prisma.photo.findUnique({ where: { id: photoId } });
  if (!photo) {
    return NextResponse.json(
      { error: "Foto não encontrada." },
      { status: 404 }
    );
  }

  const existingLike = await prisma.like.findUnique({
    where: { userId_photoId: { userId: currentUser.id, photoId } },
  });

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
  } else {
    await prisma.like.create({
      data: { userId: currentUser.id, photoId },
    });
  }

  const likeCount = await prisma.like.count({ where: { photoId } });

  return NextResponse.json({ liked: !existingLike, likeCount });
}
