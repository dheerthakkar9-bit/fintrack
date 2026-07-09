import { successResponse, errorResponse, getUserIdFromRequest } from "@/lib/api-utils";
import { findUserById, listEntities, FILES } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const user = await findUserById(userId);
    const transactions = await listEntities(userId, FILES.transactions);
    const categories = await listEntities(userId, FILES.categories);
    const accounts = await listEntities(userId, FILES.accounts);
    const budgets = await listEntities(userId, FILES.budgets);
    const bills = await listEntities(userId, FILES.bills);
    const savingsGoals = await listEntities(userId, FILES.savings);

    return successResponse({
      exportedAt: new Date().toISOString(),
      summary: {
        totalUsers: user ? 1 : 0,
        totalTransactions: transactions.length,
        totalCategories: categories.length,
        totalAccounts: accounts.length,
        totalBudgets: budgets.length,
        totalBills: bills.length,
        totalSavingsGoals: savingsGoals.length,
      },
      user: user ? { id: user.id, name: user.name, email: user.email, currency: user.currency, theme: user.theme, createdAt: user.createdAt } : null,
      transactions,
      categories,
      accounts,
      budgets,
      bills,
      savingsGoals,
    });
  } catch (error) {
    return errorResponse("Failed to export data", 500);
  }
}
