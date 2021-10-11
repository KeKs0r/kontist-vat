import { useApp, PeriodSchedule } from "./AppState";
import { useTransactions } from "./AppData";
import clsx from "clsx";
import { getEarliest } from "./transaction-utils";

export function PeriodTabs() {
  const { state, changePeriod, changeYear } = useApp();
  const transactions = useTransactions();
  const tabs = getTabs(state.periodSchedule, state.selectedYear);

  const earliestDate = getEarliest(transactions) || new Date();
  const earliestYear = earliestDate.getFullYear();

  const previousYear = state.selectedYear - 1;
  const currentYear = new Date().getFullYear();
  const nextYear = state.selectedYear + 1;

  return (
    <div className="tabs tabs-boxed">
      <button
        className={clsx("tab", { "btn-disabled": currentYear <= earliestYear })}
        disabled={currentYear <= earliestYear}
        onClick={() => changeYear(previousYear)}
      >
        {previousYear}
      </button>
      <div className="divider divider-vertical"></div>
      {tabs.map((tab) => (
        <button
          key={tab.title}
          className={clsx("tab", {
            "tab-active": tab.value === state.selectedPeriod,
          })}
          onClick={() => changePeriod(tab.value)}
        >
          {tab.title}
        </button>
      ))}
      <div className="divider divider-vertical"></div>
      <button
        className={clsx("tab", { "btn-disabled": nextYear > currentYear })}
        disabled={nextYear > currentYear}
        onClick={() => changeYear(nextYear)}
      >
        {nextYear}
      </button>
    </div>
  );
}

type Tab = {
  title: string;
  value: number;
};

function getTabs(schedule: PeriodSchedule, selectedYear: number): Tab[] {
  if (schedule === "year") {
    return [{ title: `${selectedYear}`, value: selectedYear }];
  }
  if (schedule === "quarter") {
    return [
      {
        title: "Q1 (Jan-Mär)",
        value: 0,
      },
      {
        title: "Q2 (Apr-Jun)",
        value: 1,
      },
      {
        title: "Q3 (Jul-Sep)",
        value: 2,
      },
      {
        title: "Q4 (Okt-Dez)",
        value: 3,
      },
    ];
  }

  return MONTH_NAMES.map((title, idx) => ({
    title,
    value: idx,
  }));
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mär",
  "Apr",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
];
