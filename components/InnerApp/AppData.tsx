import React, { createContext, useContext, useEffect, useState } from "react";
import { Schema } from "kontist";
import {
  endOfYear,
  startOfYear,
  setQuarter,
  startOfQuarter,
  endOfQuarter,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { useKontist, useKontistContext } from "./KontistContext";
import { PeriodSchedule, useApp } from "./AppState";

type AppData = {
  transactions: Schema.Transaction[];
  loadData: () => void;
  isLoading: boolean;
};

const AppDataContext = createContext<AppData>({
  transactions: [],
  loadData: () => {},
  isLoading: false,
});

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { client, onUnauthorized } = useKontistContext();
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Schema.Transaction[]>([]);

  async function loadAllData() {
    try {
      setIsLoading(true);
      const allFetch = client.models.transaction.fetchAll();

      for await (let res of allFetch) {
        setTransactions((t) => [...t, res].filter(isTruthy));
      }
      setIsLoading(false);
    } catch (e: any) {
      if (e.message === "Unauthorized") {
        onUnauthorized();
      }
      console.error(e);
    }
  }

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppDataContext.Provider
      value={{ transactions, loadData: loadAllData, isLoading }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

function isTruthy<T>(
  value: T
): value is Exclude<T, null | undefined | false | ""> {
  return Boolean(value);
}

export function useDataContext() {
  return useContext(AppDataContext);
}

export function useTransactions() {
  const { transactions } = useContext(AppDataContext);
  return transactions;
}

export function useRelevantTransactions() {
  const { state } = useApp();
  const transactions = useTransactions();

  const { start, end } = getPeriodDates(
    state.periodSchedule,
    state.selectedPeriod,
    state.selectedYear
  );

  const filteredTransaction = transactions.filter((a) => {
    const d = new Date(a.valutaDate);
    return start < d && d < end;
  });

  return filteredTransaction;
}

function getPeriodDates(
  schedule: PeriodSchedule,
  period: number,
  year: number
) {
  switch (schedule) {
    case "year":
      return {
        start: startOfYear(new Date(year, 1, 1)),
        end: endOfYear(new Date(year, 1, 1)),
      };
    case "quarter":
      const changedQuarter = setQuarter(new Date(year, 1, 1), period);
      return {
        start: startOfQuarter(changedQuarter),
        end: endOfQuarter(changedQuarter),
      };
    case "month":
      return {
        start: startOfMonth(new Date(year, period)),
        end: endOfMonth(new Date(year, period)),
      };
  }
}
