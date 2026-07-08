import { NextRequest } from "next/server";
import { listEntities, createEntity, FILES } from "@/lib/db";
import { getUserIdFromRequest, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const accounts = listEntities(userId, FILES.accounts);
    accounts.sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));

    return successResponse(accounts);
  } catch (error) {
    return errorResponse("Failed to fetch accounts", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const { name, type, balance, currency, color, icon } = body;

    if (!name || !type || balance === undefined) {
      return errorResponse("Name, type, and balance are required", 400);
    }

    const account = createEntity(userId, FILES.accounts, {
      name,
      type,
      balance: parseFloat(balance),
      currency: currency || "USD",
      color: color || null,
      icon: icon || null,
      userId,
    });

    return successResponse(account, 201);
  } catch (error) {
    return errorResponse("Failed to create account", 500);
  }
}
