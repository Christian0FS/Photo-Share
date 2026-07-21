import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request) {
  try {
    const { name, password } = await request.json();

    if (!name || !password) {
      return NextResponse.json(
        { error: "Informe nome e senha." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { name } });
    if (!user) {
      return NextResponse.json(
        { error: "Nome ou senha inválidos." },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Nome ou senha inválidos." },
        { status: 401 }
      );
    }

    const token = createToken(user.id);

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, avatarUrl: user.avatarUrl },
    });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao entrar." }, { status: 500 });
  }
}
