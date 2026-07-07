"use client";

import ProtectedPage from "@/components/ProtectedPage";
import AppShell from "@/components/layout/AppShell";
import SettingsPanel from "@/components/settings/SettingsPanel";

export default function SettingsPage() {
  return (
    <ProtectedPage>
      <AppShell>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your preferences and profile</p>
          </div>
          <SettingsPanel />
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
