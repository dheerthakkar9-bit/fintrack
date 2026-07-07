"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from "react";
import { type AppState, type Transaction, type Category, type Account, type Budget, type Bill, type SavingsGoal, type User } from "./types";
import { api } from "./api-client";
import { setUserCurrency } from "./utils";

type Action =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "SET_USER"; payload: Partial<User> }
  | { type: "SET_THEME"; payload: "light" | "dark" | "system" }
  | { type: "SET_DATA"; payload: Partial<AppState> }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "ADD_ACCOUNT"; payload: Account }
  | { type: "UPDATE_ACCOUNT"; payload: Account }
  | { type: "DELETE_ACCOUNT"; payload: string }
  | { type: "ADD_BUDGET"; payload: Budget }
  | { type: "UPDATE_BUDGET"; payload: Budget }
  | { type: "DELETE_BUDGET"; payload: string }
  | { type: "ADD_BILL"; payload: Bill }
  | { type: "UPDATE_BILL"; payload: Bill }
  | { type: "DELETE_BILL"; payload: string }
  | { type: "ADD_SAVINGS_GOAL"; payload: SavingsGoal }
  | { type: "UPDATE_SAVINGS_GOAL"; payload: SavingsGoal }
  | { type: "DELETE_SAVINGS_GOAL"; payload: string };

const defaultUser: User = {
  id: "",
  name: "",
  email: "",
  avatar: undefined,
  currency: "USD",
  theme: "dark",
};

const initialState: AppState = {
  user: defaultUser,
  isAuthenticated: false,
  transactions: [],
  categories: [],
  accounts: [],
  budgets: [],
  bills: [],
  savingsGoals: [],
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case "LOGOUT":
      return { ...initialState };
    case "SET_USER":
      return { ...state, user: { ...state.user, ...action.payload } };
    case "SET_THEME":
      return { ...state, user: { ...state.user, theme: action.payload } };
    case "SET_DATA":
      return { ...state, ...action.payload };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case "UPDATE_TRANSACTION":
      return { ...state, transactions: state.transactions.map((t) => (t.id === action.payload.id ? action.payload : t)) };
    case "DELETE_TRANSACTION":
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload) };
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] };
    case "DELETE_CATEGORY":
      return { ...state, categories: state.categories.filter((c) => c.id !== action.payload) };
    case "ADD_ACCOUNT":
      return { ...state, accounts: [...state.accounts, action.payload] };
    case "UPDATE_ACCOUNT":
      return { ...state, accounts: state.accounts.map((a) => (a.id === action.payload.id ? action.payload : a)) };
    case "DELETE_ACCOUNT":
      return { ...state, accounts: state.accounts.filter((a) => a.id !== action.payload) };
    case "ADD_BUDGET":
      return { ...state, budgets: [...state.budgets, action.payload] };
    case "UPDATE_BUDGET":
      return { ...state, budgets: state.budgets.map((b) => (b.id === action.payload.id ? action.payload : b)) };
    case "DELETE_BUDGET":
      return { ...state, budgets: state.budgets.filter((b) => b.id !== action.payload) };
    case "ADD_BILL":
      return { ...state, bills: [...state.bills, action.payload] };
    case "UPDATE_BILL":
      return { ...state, bills: state.bills.map((b) => (b.id === action.payload.id ? action.payload : b)) };
    case "DELETE_BILL":
      return { ...state, bills: state.bills.filter((b) => b.id !== action.payload) };
    case "ADD_SAVINGS_GOAL":
      return { ...state, savingsGoals: [...state.savingsGoals, action.payload] };
    case "UPDATE_SAVINGS_GOAL":
      return { ...state, savingsGoals: state.savingsGoals.map((s) => (s.id === action.payload.id ? action.payload : s)) };
    case "DELETE_SAVINGS_GOAL":
      return { ...state, savingsGoals: state.savingsGoals.filter((s) => s.id !== action.payload) };
    default:
      return state;
  }
}

interface StoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  getCategoryById: (id: string) => Category | undefined;
  getAccountById: (id: string) => Account | undefined;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  monthTransactions: Transaction[];
  loadAllData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.user.theme === "dark" || (state.user.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.user.theme]);

  useEffect(() => {
    if (state.user.currency) setUserCurrency(state.user.currency);
  }, [state.user.currency]);

  const loadAllData = useCallback(async () => {
    try {
      const [transactions, categories, accounts, budgets, bills, savingsGoals] = await Promise.all([
        api.transactions.list(),
        api.categories.list(),
        api.accounts.list(),
        api.budgets.list(),
        api.bills.list(),
        api.savings.list(),
      ]);
      dispatch({
        type: "SET_DATA",
        payload: { transactions, categories, accounts, budgets, bills, savingsGoals },
      });
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  }, []);

  const getCategoryById = useCallback((id: string) => state.categories.find((c) => c.id === id), [state.categories]);
  const getAccountById = useCallback((id: string) => state.accounts.find((a) => a.id === id), [state.accounts]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
  const monthTransactions = state.transactions.filter((t) => t.date >= monthStart && t.date <= monthEnd);

  const totalIncome = state.accounts.reduce((sum, a) => sum + Math.max(0, a.balance), 0);
  const totalExpenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const monthlyIncome = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - totalExpenses) / monthlyIncome) * 100 : 0;
  const totalBalance = state.accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <StoreContext.Provider value={{ state, dispatch, getCategoryById, getAccountById, totalBalance, totalIncome: monthlyIncome, totalExpenses, savingsRate, monthTransactions, loadAllData }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
