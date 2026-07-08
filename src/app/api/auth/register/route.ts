import { NextRequest } from "next/server";
import {
  findUserByEmail,
  createUser,
  listEntities,
  createEntity,
  genId,
} from "@/lib/db";
import { signToken, hashPassword } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-utils";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  DEFAULT_ACCOUNTS,
} from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, currency } = await req.json();

    if (!name) return errorResponse("Name is required");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return errorResponse("Valid email is required");
    if (!password || password.length < 6)
      return errorResponse("Password must be at least 6 characters");

    const existing = await findUserByEmail(email);
    if (existing) return errorResponse("Email already in use", 409);

    const hashedPassword = await hashPassword(password);
    const userId = genId();

    await createUser({
      id: userId,
      name,
      email,
      password: hashedPassword,
      currency: currency || "USD",
      theme: "system",
    });

    for (const c of INCOME_CATEGORIES) {
      await createEntity(userId, "categories", {
        name: c.name,
        icon: c.icon,
        color: c.color,
        type: "income",
        isCustom: false,
        userId,
      });
    }
    for (const c of EXPENSE_CATEGORIES) {
      await createEntity(userId, "categories", {
        name: c.name,
        icon: c.icon,
        color: c.color,
        type: "expense",
        isCustom: false,
        userId,
      });
    }
    for (const acc of DEFAULT_ACCOUNTS) {
      await createEntity(userId, "accounts", {
        name: acc.name,
        type: acc.type,
        balance: 0,
        currency: acc.currency,
        color: acc.color,
        icon: acc.icon,
        userId,
      });
    }

    const token = await signToken({ userId, email });

    return successResponse(
      {
        user: { id: userId, name, email, currency: currency || "USD", theme: "system" },
        token,
      },
      201
    );
  } catch (error: any) {
    console.error("Register error:", error.message, error.stack);
    return errorResponse("Internal server error", 500);
  }
}
