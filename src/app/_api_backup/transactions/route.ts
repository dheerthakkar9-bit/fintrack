import { NextRequest } from "next/server";
import { listEntities, createEntity, FILES } from "@/lib/db";
import { getUserIdFromRequest, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as "income" | "expense" | null;
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "date-desc";

    let transactions = listEntities(userId, FILES.transactions);

    if (type) transactions = transactions.filter((t: any) => t.type === type);
    if (categoryId) transactions = transactions.filter((t: any) => t.categoryId === categoryId);
    if (search) {
      const q = search.toLowerCase();
      transactions = transactions.filter(
        (t: any) =>
          (t.description && t.description.toLowerCase().includes(q)) ||
          (Array.isArray(t.tags) && t.tags.some((tag: string) => tag.toLowerCase().includes(q)))
      );
    }

    switch (sortBy) {
      case "date-asc":
        transactions.sort((a: any, b: any) => (a.date || "").localeCompare(b.date || ""));
        break;
      case "amount-desc":
        transactions.sort((a: any, b: any) => (b.amount || 0) - (a.amount || 0));
        break;
      case "amount-asc":
        transactions.sort((a: any, b: any) => (a.amount || 0) - (b.amount || 0));
        break;
      default:
        transactions.sort((a: any, b: any) => (b.date || "").localeCompare(a.date || ""));
    }

    return successResponse(transactions);
  } catch (error) {
    return errorResponse("Failed to fetch transactions", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const { type, amount, categoryId, accountId, description, date, isRecurring, tags } = body;

    if (!type || !amount || !categoryId || !description || !date) {
      return errorResponse("Missing required fields", 400);
    }

    const transaction = createEntity(userId, FILES.transactions, {
      type,
      amount: parseFloat(amount),
      categoryId,
      accountId: accountId || null,
      description,
      date,
      isRecurring: isRecurring || false,
      tags: tags || [],
      userId,
    });

    return successResponse(transaction, 201);
  } catch (error) {
    return errorResponse("Failed to create transaction", 500);
  }
}
