"use client";

import ProtectedPage from "@/components/ProtectedPage";
import AppShell from "@/components/layout/AppShell";
import CalendarView from "@/components/calendar/CalendarView";

export default function CalendarPage() {
  return (
    <ProtectedPage>
      <AppShell>
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
            <p className="text-sm text-muted-foreground mt-0.5">View transactions by date</p>
          </div>
          <CalendarView />
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
