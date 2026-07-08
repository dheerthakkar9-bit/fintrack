import { NextRequest } from "next/server";
import { findEntity, updateEntity, deleteEntity, FILES } from "@/lib/db";
import { getUserIdFromRequest, successResponse, errorResponse } from "@/lib/api-utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const existing = await findEntity(userId, FILES.savings, id);
    if (!existing) return errorResponse("Savings goal not found", 404);

    const body = await req.json();
    const { name, targetAmount, currentAmount, deadline, icon, color } = body;

    const goal = await updateEntity(userId, FILES.savings, id, {
      ...(name && { name }),
      ...(targetAmount && { targetAmount: parseFloat(targetAmount) }),
      ...(currentAmount !== undefined && { currentAmount: parseFloat(currentAmount) }),
      ...(deadline && { deadline }),
      ...(icon !== undefined && { icon }),
      ...(color !== undefined && { color }),
    });

    return successResponse(goal);
  } catch (error) {
    return errorResponse("Failed to update savings goal", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const existing = await findEntity(userId, FILES.savings, id);
    if (!existing) return errorResponse("Savings goal not found", 404);

    await deleteEntity(userId, FILES.savings, id);
    return successResponse({ message: "Savings goal deleted" });
  } catch (error) {
    return errorResponse("Failed to delete savings goal", 500);
  }
}
