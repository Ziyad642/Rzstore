import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbRepository from "./db";
import { User, Role } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "rz-store-secure-jwt-token-production-2026";
const COOKIE_NAME = "rz_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
}

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.userId) return null;

    const user = dbRepository.users.findById(payload.userId);
    if (!user || !user.isActive) return null;

    return user;
  } catch (err) {
    console.error("Error retrieving current user:", err);
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
