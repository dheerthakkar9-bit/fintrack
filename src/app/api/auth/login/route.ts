import { NextRequest } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { signToken, comparePassword } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return errorResponse("Email and password are required");

    const user = findUserByEmail(email);
    if (!user) return errorResponse("Invalid email or password", 401);

    const isValid = await comparePassword(password, user.password);
    if (!isValid) return errorResponse("Invalid email or password", 401);

    const token = await signToken({ userId: user.id, email: user.email });

    return successResponse({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        theme: user.theme,
      },
      token,
    });
  } catch (error) {
    return errorResponse("Internal server error", 500);
  }
}
