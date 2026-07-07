import { NextRequest } from "next/server";
import { listEntities, createEntity, FILES } from "@/lib/db";
import { getUserIdFromRequest, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const bills = listEntities(userId, FILES.bills);
    bills.sort((a: any, b: any) => (a.dueDate || "").localeCompare(b.dueDate || ""));

    return successResponse(bills);
  } catch (error) {
    return errorResponse("Failed to fetch bills", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const { name, amount, categoryId, dueDate, frequency, isAutoPay, notes } = body;

    if (!name || !amount || !categoryId || !dueDate || !frequency) {
      return errorResponse("Missing required fields", 400);
    }

    const bill = createEntity(userId, FILES.bills, {
      name,
      amount: parseFloat(amount),
      categoryId,
      dueDate,
      frequency,
      isAutoPay: isAutoPay || false,
      notes: notes || null,
      userId,
    });

    return successResponse(bill, 201);
  } catch (error) {
    return errorResponse("Failed to create bill", 500);
  }
}
