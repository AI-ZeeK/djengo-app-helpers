export type AssetBillingPeriod =
  | "PER_NIGHT"
  | "PER_HOUR"
  | "PER_STAY"
  | "PER_DAY"
  | "PER_WEEK"
  | "PER_MONTH"
  | "PER_YEAR"
  | "";

export type AssetRateInfo = {
  rate_amount: number;
  billing_period: AssetBillingPeriod;
};

export const ASSET_BILLING_PERIOD_LABELS: Record<string, string> = {
  PER_NIGHT: "per night",
  PER_HOUR: "per hour",
  PER_STAY: "per stay",
  PER_DAY: "per day",
  PER_WEEK: "per week",
  PER_MONTH: "per month",
  PER_YEAR: "per year",
};

export type BillingPeriodOption = {
  value: AssetBillingPeriod;
  label: string;
};

/** Lease / hospitality / F&B billing choices shown per occupiable node type. */
export function billingPeriodOptionsForNodeType(
  nodeType: string,
): BillingPeriodOption[] {
  const t = nodeType.toUpperCase();
  if (t.includes("TABLE")) {
    return [
      { value: "PER_HOUR", label: "Per hour" },
      { value: "PER_DAY", label: "Per day" },
    ];
  }
  if (t.includes("HOUSE") || t.includes("UNIT")) {
    return [
      { value: "PER_WEEK", label: "Per week (lease)" },
      { value: "PER_MONTH", label: "Per month (lease)" },
      { value: "PER_YEAR", label: "Per year (lease)" },
    ];
  }
  if (t.includes("BED") || t.includes("ROOM")) {
    return [
      { value: "PER_NIGHT", label: "Per night" },
      { value: "PER_DAY", label: "Per day" },
      { value: "PER_WEEK", label: "Per week" },
      { value: "PER_MONTH", label: "Per month" },
    ];
  }
  return [
    { value: "PER_NIGHT", label: "Per night" },
    { value: "PER_DAY", label: "Per day" },
    { value: "PER_WEEK", label: "Per week" },
    { value: "PER_MONTH", label: "Per month" },
    { value: "PER_YEAR", label: "Per year" },
  ];
}

export function parseAssetRateFromMetadata(
  metadataJson?: string | null,
): AssetRateInfo | null {
  if (!metadataJson?.trim()) return null;
  try {
    const raw = JSON.parse(metadataJson) as Record<string, unknown>;
    const amount = Number(
      raw.rate_amount ??
        raw.price_per_night ??
        raw.pricePerNight ??
        raw.price ??
        0,
    );
    if (!Number.isFinite(amount) || amount <= 0) return null;
    const billing = String(
      raw.billing_period ?? raw.billingPeriod ?? "PER_NIGHT",
    )
      .trim()
      .toUpperCase() as AssetBillingPeriod;
    return {
      rate_amount: amount,
      billing_period: billing || "PER_NIGHT",
    };
  } catch {
    return null;
  }
}

export function formatAssetRate(
  rate: AssetRateInfo | null | undefined,
  currencyCode = "",
): string {
  if (!rate?.rate_amount) return "—";
  const label = ASSET_BILLING_PERIOD_LABELS[rate.billing_period] ?? "";
  const amount = rate.rate_amount.toLocaleString();
  const currency = currencyCode.trim();
  return currency
    ? `${currency} ${amount} ${label}`.trim()
    : `${amount} ${label}`.trim();
}

export function defaultBillingPeriodForNodeType(
  nodeType: string,
): AssetBillingPeriod {
  const t = nodeType.toUpperCase();
  if (t.includes("TABLE")) return "PER_HOUR";
  if (t.includes("UNIT") || t.includes("HOUSE")) return "PER_MONTH";
  return "PER_NIGHT";
}

export class FacilityAssetPricingHelper {
  static readonly ASSET_BILLING_PERIOD_LABELS = ASSET_BILLING_PERIOD_LABELS;
  static billingPeriodOptionsForNodeType = billingPeriodOptionsForNodeType;
  static parseAssetRateFromMetadata = parseAssetRateFromMetadata;
  static formatAssetRate = formatAssetRate;
  static defaultBillingPeriodForNodeType = defaultBillingPeriodForNodeType;
}

