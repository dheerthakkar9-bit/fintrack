"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import AuthPage from "@/components/auth/AuthPage";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { state, dispatch, loadAllData } = useStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = api.token.get();
    if (token && !state.isAuthenticated) {
      api.auth.me()
        .then((user) => {
          dispatch({ type: "LOGIN", payload: { user, token } });
          return loadAllData();
        })
        .catch(() => {
          api.token.clear();
        })
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!state.isAuthenticated) return <AuthPage />;
  return <>{children}</>;
}
