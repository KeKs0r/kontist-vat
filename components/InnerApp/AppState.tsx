import React, { createContext, Reducer, useContext, useReducer } from "react";
import { getQuarter } from "date-fns";

export type AppContext = {
  state: AppState;
  changeYear: (fullYear: number) => void;
  changeIstOrSoll: (istOrSoll: "ist" | "soll") => void;
  changePeriod: (period: number) => void;
  changePeriodSchedule: (schedule: PeriodSchedule) => void;
};

export type AppState = {
  istOrSoll: "ist" | "soll";
  periodSchedule: PeriodSchedule;
  selectedPeriod: number;
  selectedYear: number;
};

export type PeriodSchedule = "year" | "quarter" | "month";

const AppContext = createContext<AppContext>();

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const initialState: AppState = {
    istOrSoll: "ist",
    periodSchedule: "month",
    selectedPeriod: getSelectedPeriodForSchedule("month"),
    selectedYear: new Date().getFullYear(),
  };
  const [state, dispatch] = useReducer<Reducer<AppState, Action>>(
    appReducer,
    initialState
  );
  console.log("state", state);

  function changeYear(fullYear: number) {
    dispatch({ type: "changeYear", value: fullYear });
  }
  function changeIstOrSoll(istOrSoll: "ist" | "soll") {
    dispatch({ type: "changeIstOrSoll", value: istOrSoll });
  }
  function changePeriod(selectedPeriod: number) {
    dispatch({ type: "changeselectedPeriod", value: selectedPeriod });
  }
  function changePeriodSchedule(schedule: PeriodSchedule) {
    dispatch({ type: "changePeriodSchedule", value: schedule });
  }

  const value: AppContext = {
    state,
    changeYear,
    changeIstOrSoll,
    changePeriodSchedule,
    changePeriod,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}

type ChangeIstOrSoll = {
  type: "changeIstOrSoll";
  value: "ist" | "soll";
};

type ChangePeriodSchedule = {
  type: "changePeriodSchedule";
  value: "year" | "quarter" | "month";
};
type ChangeselectedPeriod = {
  type: "changeselectedPeriod";
  value: number;
};

type ChangeYear = {
  type: "changeYear";
  value: number;
};

type Action =
  | ChangeIstOrSoll
  | ChangePeriodSchedule
  | ChangeselectedPeriod
  | ChangeYear;

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "changeIstOrSoll":
      return {
        ...state,
        istOrSoll: action.value,
      };
    case "changePeriodSchedule":
      return {
        ...state,
        periodSchedule: action.value,
        selectedPeriod: getSelectedPeriodForSchedule(action.value),
      };
    case "changeselectedPeriod": {
      return {
        ...state,
        selectedPeriod: action.value,
      };
    }
    case "changeYear":
      return {
        ...state,
        selectedYear: action.value,
      };
  }
}

function getSelectedPeriodForSchedule(periodSchedule: PeriodSchedule) {
  switch (periodSchedule) {
    case "year":
      return new Date().getFullYear();
    case "quarter":
      const quarter = getQuarter(new Date());
      return quarter;
    case "month":
      return new Date().getMonth();
  }
}
