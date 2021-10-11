import { Schema } from "kontist";

/**
 * Zeile 26 & 27
 */
export function calculateNetRevenueForVAT(
  transactions: Schema.Transaction[],
  vatCategory:
    | Schema.TransactionCategory.Vat_19
    | Schema.TransactionCategory.Vat_7
) {
  const totalNet = transactions.reduce((sum, t) => {
    if (t.amount > 0 && t.category && t.category === vatCategory) {
      const net = calcNet(t.amount, t.category);
      return sum + net;
    }
    return sum;
  }, 0);
  return Math.round(totalNet) / 100;
}

export function calculatePaidVAT(transactions: Schema.Transaction[]) {
  const paid = transactions.reduce((sum, t) => {
    if (t.amount < 0 && t.category && isRelevantCategory(t.category)) {
      const paidVat = calcVat(t.amount, t.category);
      return sum + paidVat;
    }
    return sum;
  }, 0);
  return Math.round(paid) / 100;
}

function isRelevantCategory(
  category: Schema.TransactionCategory
): category is
  | Schema.TransactionCategory.Vat_19
  | Schema.TransactionCategory.Vat_7 {
  return [
    Schema.TransactionCategory.Vat_19,
    Schema.TransactionCategory.Vat_7,
  ].includes(category);
}

// netto * 1.19 = brutto
function calcNet(
  brutto: number,
  vatCategory:
    | Schema.TransactionCategory.Vat_19
    | Schema.TransactionCategory.Vat_7
) {
  const vatRate = VAT_RATES[vatCategory]!;
  return brutto / (vatRate + 1);
}
// brutto = netto * 1.19
// netto = brutto / 1.19
// vat =  brutto / 1.19 * 0.19
function calcVat(
  brutto: number,
  vatCategory:
    | Schema.TransactionCategory.Vat_19
    | Schema.TransactionCategory.Vat_7
) {
  const vatRate = VAT_RATES[vatCategory]!;
  return (brutto / (vatRate + 1)) * vatRate;
}

const VAT_RATES: Partial<Record<Schema.TransactionCategory, number>> = {
  [Schema.TransactionCategory.Vat_19]: 0.19,
  [Schema.TransactionCategory.Vat_7]: 0.07,
};
