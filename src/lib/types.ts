export type TransactionType = "income" | "expense";
export type AccountType = "cash" | "bank" | "upi" | "wallet" | "card";
export type RecurringFrequency = "daily" | "weekly" | "monthly" | "yearly";
export type BillStatus = "upcoming" | "paid" | "overdue";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currency: string;
  theme: "light" | "dark" | "system";
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  isCustom: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  description: string;
  date: string;
  isRecurring: boolean;
  recurringId?: string;
  tags: string[];
  createdAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: "monthly" | "weekly" | "yearly";
  startDate: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  dueDate: string;
  frequency: RecurringFrequency;
  status: BillStatus;
  isAutoPay: boolean;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
}

export interface AIInsight {
  id: string;
  type: "tip" | "warning" | "achievement" | "suggestion";
  title: string;
  message: string;
  icon: string;
}

export interface AppState {
  user: User;
  isAuthenticated: boolean;
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  budgets: Budget[];
  bills: Bill[];
  savingsGoals: SavingsGoal[];
}
