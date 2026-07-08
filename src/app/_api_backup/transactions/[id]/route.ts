import { NextRequest } from "next/server";
import { findEntity, updateEntity, deleteEntity, FILES } from "@/lib/db";
import { getUserIdFromRequest, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const transaction = findEntity(userId, FILES.transactions, id);

    if (!transaction) return errorResponse("Transaction not found", 404);
    return successResponse(transaction);
  } catch (error) {
    return errorResponse("Failed to fetch transaction", 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const existing = findEntity(userId, FILES.transactions, id);
    if (!existing) return errorResponse("Transaction not found", 404);

    const body = await req.json();
    const { type, amount, categoryId, accountId, description, date, isRecurring, tags } = body;

    const transaction = updateEntity(userId, FILES.transactions, id, {
      ...(type && { type }),
      ...(amount && { amount: parseFloat(amount) }),
      ...(categoryId && { categoryId }),
      ...(accountId !== undefined && { accountId: accountId || null }),
      ...(description && { description }),
      ...(date && { date }),
      ...(isRecurring !== undefined && { isRecurring }),
      ...(tags !== undefined && { tags }),
    });

    return successResponse(transaction);
  } catch (error) {
    return errorResponse("Failed to update transaction", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const existing = findEntity(userId, FILES.transactions, id);
    if (!existing) return errorResponse("Transaction not found", 404);

    deleteEntity(userId, FILES.transactions, id);
    return successResponse({ message: "Transaction deleted" });
  } catch (error) {
    return errorResponse("Failed to delete transaction", 500);
  }
}
