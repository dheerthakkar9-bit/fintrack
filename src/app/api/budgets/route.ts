import { NextRequest } from "next/server";
import { listEntities, createEntity, FILES } from "@/lib/db";
import { getUserIdFromRequest, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const budgets = await listEntities(userId, FILES.budgets);
    budgets.sort((a: any, b: any) => (b.startDate || "").localeCompare(a.startDate || ""));

    return successResponse(budgets);
  } catch (error) {
    return errorResponse("Failed to fetch budgets", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const { categoryId, amount, period, startDate } = body;

    if (!categoryId || !amount || !period || !startDate) {
      return errorResponse("Missing required fields", 400);
    }

    const budget = await createEntity(userId, FILES.budgets, {
      categoryId,
      amount: parseFloat(amount),
      period,
      startDate,
      userId,
    });

    return successResponse(budget, 201);
  } catch (error) {
    return errorResponse("Failed to create budget", 500);
  }
}
