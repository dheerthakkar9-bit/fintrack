import { NextRequest } from "next/server";
import { updateUser } from "@/lib/db";
import { getUserIdFromRequest, successResponse, errorResponse } from "@/lib/api-utils";

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const { name, email, currency, theme } = body;

    const updated = updateUser(userId, {
      ...(name && { name }),
      ...(email && { email }),
      ...(currency && { currency }),
      ...(theme && { theme }),
    });

    if (!updated) return errorResponse("User not found", 404);

    return successResponse({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      currency: updated.currency,
      theme: updated.theme,
    });
  } catch (error) {
    return errorResponse("Failed to update settings", 500);
  }
}
