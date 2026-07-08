import { findUserById } from "@/lib/db";
import { successResponse, errorResponse, getUserIdFromRequest } from "@/lib/api-utils";

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const user = await findUserById(userId);
    if (!user) return errorResponse("User not found", 404);

    return successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      theme: user.theme,
    });
  } catch (error) {
    return errorResponse("Internal server error", 500);
  }
}
