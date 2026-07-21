import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET;
export const COOKIE_NAME = "session_token";

// Cria um token JWT contendo o id do usuário
export function createToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

// Verifica o token e retorna o payload (ou null se inválido/expirado)
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Lê o cookie de sessão da requisição atual e retorna o usuário logado (sem a senha)
export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, avatarUrl: true, createdAt: true },
  });

  return user;
}
