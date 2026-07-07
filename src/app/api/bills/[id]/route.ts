import { NextRequest } from "next/server";
import { findEntity, updateEntity, deleteEntity, FILES } from "@/lib/db";
import { getUserIdFromRequest, successResponse, errorResponse } from "@/lib/api-utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const existing = findEntity(userId, FILES.bills, id);
    if (!existing) return errorResponse("Bill not found", 404);

    const body = await req.json();
    const { name, amount, categoryId, dueDate, frequency, isAutoPay, notes } = body;

    const bill = updateEntity(userId, FILES.bills, id, {
      ...(name && { name }),
      ...(amount && { amount: parseFloat(amount) }),
      ...(categoryId && { categoryId }),
      ...(dueDate && { dueDate }),
      ...(frequency && { frequency }),
      ...(isAutoPay !== undefined && { isAutoPay }),
      ...(notes !== undefined && { notes }),
    });

    return successResponse(bill);
  } catch (error) {
    return errorResponse("Failed to update bill", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const existing = findEntity(userId, FILES.bills, id);
    if (!existing) return errorResponse("Bill not found", 404);

    deleteEntity(userId, FILES.bills, id);
    return successResponse({ message: "Bill deleted" });
  } catch (error) {
    return errorResponse("Failed to delete bill", 500);
  }
}
