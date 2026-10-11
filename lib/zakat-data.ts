// Zakat calculation reference data for Dhualqarnayn.
//
// Nisab (the minimum threshold above which Zakat becomes due) is traditionally
// measured in gold or silver weight:
//   - Gold nisab:   85 grams of pure gold
//   - Silver nisab: 595 grams of pure silver
// Using the silver nisab is more cautious (lower threshold, Zakat due more
// often) and is the view many scholars recommend for cash/savings today.
//
// Gold and silver market prices change constantly and this app has no live
// price feed, so the person enters today's price per gram themselves (their
// bank app, a local jeweler, or a quick web search all give this instantly).
// We never fabricate a "current" price — that would be guaranteed wrong.

export const GOLD_NISAB_GRAMS = 85;
export const SILVER_NISAB_GRAMS = 595;
export const ZAKAT_RATE = 0.025; // 2.5%

export type NisabBasis = "gold" | "silver";

export interface ZakatInputs {
  cash: number; // cash on hand + bank savings
  goldGrams: number; // gold owned beyond everyday personal use jewelry (per most views) — simplified: all gold weight
  goldPricePerGram: number;
  silverGrams: number;
  silverPricePerGram: number;
  investments: number; // stocks, mutual funds, crypto, etc. at current market value
  businessStock: number; // trade goods / business inventory at current market value
  receivables: number; // money owed to you that you expect to be repaid
  debts: number; // short-term debts you owe, due now or soon
}

export interface ZakatResult {
  grossWealth: number;
  netWealth: number;
  nisabValue: number;
  nisabBasis: NisabBasis;
  isDue: boolean;
  zakatDue: number;
}

export function calculateZakat(inputs: ZakatInputs, basis: NisabBasis): ZakatResult {
  const goldValue = Math.max(0, inputs.goldGrams) * Math.max(0, inputs.goldPricePerGram);
  const silverValue = Math.max(0, inputs.silverGrams) * Math.max(0, inputs.silverPricePerGram);

  const grossWealth =
    Math.max(0, inputs.cash) +
    goldValue +
    silverValue +
    Math.max(0, inputs.investments) +
    Math.max(0, inputs.businessStock) +
    Math.max(0, inputs.receivables);

  const netWealth = Math.max(0, grossWealth - Math.max(0, inputs.debts));

  const nisabValue =
    basis === "gold"
      ? GOLD_NISAB_GRAMS * Math.max(0, inputs.goldPricePerGram)
      : SILVER_NISAB_GRAMS * Math.max(0, inputs.silverPricePerGram);

  const isDue = nisabValue > 0 && netWealth >= nisabValue;
  const zakatDue = isDue ? netWealth * ZAKAT_RATE : 0;

  return { grossWealth, netWealth, nisabValue, nisabBasis: basis, isDue, zakatDue };
}

export interface ZakatFieldDef {
  key: keyof Pick<ZakatInputs, "cash" | "investments" | "businessStock" | "receivables" | "debts">;
  labelAr: string;
  labelEn: string;
  helpAr: string;
  helpEn: string;
}

export const ZAKAT_FIELDS: ZakatFieldDef[] = [
  {
    key: "cash",
    labelAr: "النقد والمدخرات البنكية",
    labelEn: "Cash & bank savings",
    helpAr: "ما يحمله الشخص نقداً وما في حساباته البنكية",
    helpEn: "Cash on hand plus balances in bank/savings accounts",
  },
  {
    key: "investments",
    labelAr: "الأسهم والاستثمارات",
    labelEn: "Stocks & investments",
    helpAr: "القيمة السوقية الحالية للأسهم والصناديق والعملات الرقمية",
    helpEn: "Current market value of stocks, funds, crypto, etc.",
  },
  {
    key: "businessStock",
    labelAr: "بضائع التجارة",
    labelEn: "Business trade goods",
    helpAr: "قيمة البضائع المعروضة للبيع بسعر السوق الحالي",
    helpEn: "Market value of goods held for resale in a business",
  },
  {
    key: "receivables",
    labelAr: "ديون لك عند الآخرين",
    labelEn: "Money owed to you",
    helpAr: "ديون تتوقع تحصيلها بشكل شبه مؤكد",
    helpEn: "Loans you expect to be repaid with reasonable certainty",
  },
  {
    key: "debts",
    labelAr: "ديون عليك (مستحقة قريباً)",
    labelEn: "Debts you owe (due soon)",
    helpAr: "تُخصم من إجمالي المال قبل حساب الزكاة",
    helpEn: "Deducted from total wealth before calculating Zakat",
  },
];
