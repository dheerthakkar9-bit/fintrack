import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function successResponse(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function getUserIdFromRequest(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  const payload = await verifyToken(token);
  if (!payload) return null;

  return payload.userId;
}
