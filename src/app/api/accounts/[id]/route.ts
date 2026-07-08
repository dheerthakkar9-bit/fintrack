import { NextRequest } from "next/server";
import { findEntity, updateEntity, deleteEntity, FILES } from "@/lib/db";
import { getUserIdFromRequest, successResponse, errorResponse } from "@/lib/api-utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const existing = await findEntity(userId, FILES.accounts, id);
    if (!existing) return errorResponse("Account not found", 404);

    const body = await req.json();
    const { name, type, balance, currency, color, icon } = body;

    const account = await updateEntity(userId, FILES.accounts, id, {
      ...(name && { name }),
      ...(type && { type }),
      ...(balance !== undefined && { balance: parseFloat(balance) }),
      ...(currency && { currency }),
      ...(color !== undefined && { color }),
      ...(icon !== undefined && { icon }),
    });

    return successResponse(account);
  } catch (error) {
    return errorResponse("Failed to update account", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const existing = await findEntity(userId, FILES.accounts, id);
    if (!existing) return errorResponse("Account not found", 404);

    await deleteEntity(userId, FILES.accounts, id);
    return successResponse({ message: "Account deleted" });
  } catch (error) {
    return errorResponse("Failed to delete account", 500);
  }
}
