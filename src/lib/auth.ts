import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

export const JWT_SECRET = "fintrack-jwt-secret-key-2024";

const encoder = new TextEncoder();

export async function signToken(payload: { userId: string; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encoder.encode(JWT_SECRET));
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET));
    return payload as unknown as { userId: string; email: string };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
