import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request) {
  try {
    const { name, password } = await request.json();

    if (!name || !password) {
      return NextResponse.json(
        { error: "Preencha nome e senha." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha precisa ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json(
        { error: "Já existe uma conta com esse nome." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, password: hashed },
    });

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
    return NextResponse.json(
      { error: "Erro ao criar conta." },
      { status: 500 }
    );
  }
}
