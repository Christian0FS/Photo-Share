import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(request) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.json({ error: "Você precisa estar logado." }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim() || "";
    const avatar = formData.get("avatar");

    if (!name) {
        return NextResponse.json({ error: "Informe um nome." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { name } });
    if (existing && existing.id !== currentUser.id) {
        return NextResponse.json({ error: "Este nome já está em uso." }, { status: 409 });
    }

    const updateData = { name };

    if (avatar && typeof avatar !== "string") {
        if (!ALLOWED_TYPES.includes(avatar.type)) {
            return NextResponse.json(
                { error: "Formato de avatar não suportado. Use JPG, PNG, WEBP ou GIF." },
                { status: 400 }
            );
        }
        if (avatar.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "O avatar precisa ter no máximo 4MB." },
                { status: 400 }
            );
        }

        const bytes = await avatar.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext = avatar.name.split(".").pop();
        const filename = `${uuid()}.${ext}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);
        updateData.avatarUrl = `/uploads/avatars/${filename}`;
    }

    const user = await prisma.user.update({
        where: { id: currentUser.id },
        data: updateData,
    });

    return NextResponse.json({ user: { id: user.id, name: user.name, avatarUrl: user.avatarUrl } });
}
