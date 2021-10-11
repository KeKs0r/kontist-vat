import { Select } from "../ui/Select";
import { useApp } from "./AppState";
import { useDataContext, useTransactions } from "./AppData";
import { getEarliest } from "./transaction-utils";

export function PeriodSwitcher() {
  const { state, changeIstOrSoll, changePeriodSchedule, changeYear } = useApp();
  const yearOptions = useYearOptions();

  return (
    <div className="grid grid-flow-col justify-start gap-3">
      <Select
        onSelect={(value) => changePeriodSchedule(value as any)}
        label="Zeitraum"
        value={state.periodSchedule}
        options={[
          { value: "month", label: "Monatlich" },
          { value: "quarter", label: "Vierteljährlich" },
          { value: "year", label: " Jährlich" },
        ]}
      />
      <Select
        onSelect={(value) => changeYear(parseInt(value))}
        label="Jahr"
        value={`${state.selectedYear}`}
        options={yearOptions}
      />

      <Select
        onSelect={(value) => changeIstOrSoll(value as any)}
        label="Besteuerung"
        value={state.istOrSoll}
        options={[
          { value: "ist", label: "Ist Besteuerung" },
          { value: "soll", label: "Soll Besteuerung" },
        ]}
      />
    </div>
  );
}

function useYearOptions() {
  const currentYear = new Date().getFullYear();
  const transactions = useTransactions();
  const earliestDate = getEarliest(transactions) || new Date();
  const earliestYear = earliestDate.getFullYear();

  const years = [0, 1, 2, 3, 4, 5]
    .map((sub) => currentYear - sub)
    .filter((year) => year >= earliestYear);

  return years.map((year) => ({ label: `${year}`, value: `${year}` }));
}
