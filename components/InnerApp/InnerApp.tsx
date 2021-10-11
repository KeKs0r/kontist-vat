import React from "react";
import { KontistAuthProvider } from "./KontistContext";
import { AppStateProvider } from "./AppState";
import { AppDataProvider } from "./AppData";
import { PeriodTabs } from "./PeriodTabs";

import { Unauthenticated } from "./UnauthenticatedFallback";
import { PeriodSwitcher } from "./PeriodSwitcher";
import { PeriodStats } from "./PeriodStats";

export function InnerApp() {
  return (
    <KontistAuthProvider fallback={<Unauthenticated />}>
      <AppStateProvider>
        <AppDataProvider>
          <div className="p-2 grid grid-flow-row gap-4">
            <PeriodSwitcher />
            <PeriodTabs />
            <PeriodStats />
          </div>
        </AppDataProvider>
      </AppStateProvider>
    </KontistAuthProvider>
  );
}
