import { NextRequest } from "next/server";
import { listEntities, createEntity, FILES } from "@/lib/db";
import { getUserIdFromRequest, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const goals = await listEntities(userId, FILES.savings);
    goals.sort((a: any, b: any) => (a.deadline || "").localeCompare(b.deadline || ""));

    return successResponse(goals);
  } catch (error) {
    return errorResponse("Failed to fetch savings goals", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const { name, targetAmount, currentAmount, deadline, icon, color } = body;

    if (!name || !targetAmount || !deadline) {
      return errorResponse("Missing required fields", 400);
    }

    const goal = await createEntity(userId, FILES.savings, {
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      deadline,
      icon: icon || null,
      color: color || null,
      userId,
    });

    return successResponse(goal, 201);
  } catch (error) {
    return errorResponse("Failed to create savings goal", 500);
  }
}
