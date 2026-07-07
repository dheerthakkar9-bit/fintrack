import { NextRequest } from "next/server";
import { listEntities, createEntity, FILES } from "@/lib/db";
import { getUserIdFromRequest, successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const categories = listEntities(userId, FILES.categories);
    categories.sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));

    return successResponse(categories);
  } catch (error) {
    return errorResponse("Failed to fetch categories", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const { name, icon, color, type } = body;

    if (!name || !type) {
      return errorResponse("Name and type are required", 400);
    }

    const category = createEntity(userId, FILES.categories, {
      name,
      icon: icon || null,
      color: color || null,
      type,
      isCustom: true,
      userId,
    });

    return successResponse(category, 201);
  } catch (error) {
    return errorResponse("Failed to create category", 500);
  }
}
