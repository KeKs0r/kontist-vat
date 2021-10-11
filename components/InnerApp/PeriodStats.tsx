import { Schema } from "kontist";
import { Stat } from "../ui/Stat";
import { useRelevantTransactions } from "./AppData";
import { calculateNetRevenueForVAT, calculatePaidVAT } from "./calculate-vat";

export function PeriodStats() {
  const relevantTransactions = useRelevantTransactions();
  return (
    <div className="stats border border-base-300">
      <Stat
        title="Gesamt Netto 19%"
        value={calculateNetRevenueForVAT(
          relevantTransactions,
          Schema.TransactionCategory.Vat_19
        )}
      />
      <Stat
        title="Gesamt Netto 7%"
        value={calculateNetRevenueForVAT(
          relevantTransactions,
          Schema.TransactionCategory.Vat_7
        )}
      />
      <Stat
        title="Summe gazahlte Umsatzsteuer"
        value={calculatePaidVAT(relevantTransactions)}
      />
    </div>
  );
}
