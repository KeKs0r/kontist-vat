import { Schema } from "kontist";

export function getEarliest(
  transactions: Schema.Transaction[]
): Date | undefined {
  const dates = transactions.map((a) => new Date(a.valutaDate)).sort();
  return dates[0];
}
