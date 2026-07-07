"use client";

import { useStore } from "@/lib/store";
import AuthPage from "@/components/auth/AuthPage";
import DashboardPage from "@/app/dashboard-content";

export default function Home() {
  const { state } = useStore();

  if (!state.isAuthenticated) {
    return <AuthPage />;
  }

  return <DashboardPage />;
}
