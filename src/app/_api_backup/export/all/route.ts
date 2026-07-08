import fs from "fs";
import path from "path";
import { successResponse, errorResponse, getUserIdFromRequest } from "@/lib/api-utils";

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      return successResponse({ users: [], transactions: [], categories: [], accounts: [], budgets: [], bills: [], savingsGoals: [] });
    }

    const userFolders = fs.readdirSync(dataDir).filter((d) => {
      const fp = path.join(dataDir, d, "profile.json");
      return fs.existsSync(fp);
    });

    const users: any[] = [];
    const transactions: any[] = [];
    const categories: any[] = [];
    const accounts: any[] = [];
    const budgets: any[] = [];
    const bills: any[] = [];
    const savingsGoals: any[] = [];

    for (const folder of userFolders) {
      const userDir = path.join(dataDir, folder);

      try {
        const profile = JSON.parse(fs.readFileSync(path.join(userDir, "profile.json"), "utf-8"));
        users.push({ id: profile.id, name: profile.name, email: profile.email, currency: profile.currency, theme: profile.theme, createdAt: profile.createdAt });
      } catch {
        continue;
      }

      const readJsonFile = (filename: string): any[] => {
        const fp = path.join(userDir, `${filename}.json`);
        if (!fs.existsSync(fp)) return [];
        try {
          return JSON.parse(fs.readFileSync(fp, "utf-8"));
        } catch {
          return [];
        }
      };

      transactions.push(...readJsonFile("transactions"));
      categories.push(...readJsonFile("categories"));
      accounts.push(...readJsonFile("accounts"));
      budgets.push(...readJsonFile("budgets"));
      bills.push(...readJsonFile("bills"));
      savingsGoals.push(...readJsonFile("savings"));
    }

    return successResponse({
      exportedAt: new Date().toISOString(),
      summary: {
        totalUsers: users.length,
        totalTransactions: transactions.length,
        totalCategories: categories.length,
        totalAccounts: accounts.length,
        totalBudgets: budgets.length,
        totalBills: bills.length,
        totalSavingsGoals: savingsGoals.length,
      },
      users,
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
