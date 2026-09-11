"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityAssetPricingHelper = exports.ASSET_BILLING_PERIOD_LABELS = void 0;
exports.billingPeriodOptionsForNodeType = billingPeriodOptionsForNodeType;
exports.parseAssetRateFromMetadata = parseAssetRateFromMetadata;
exports.formatAssetRate = formatAssetRate;
exports.defaultBillingPeriodForNodeType = defaultBillingPeriodForNodeType;
exports.ASSET_BILLING_PERIOD_LABELS = {
    PER_NIGHT: "per night",
    PER_HOUR: "per hour",
    PER_STAY: "per stay",
    PER_DAY: "per day",
    PER_WEEK: "per week",
    PER_MONTH: "per month",
    PER_YEAR: "per year",
};
/** Lease / hospitality / F&B billing choices shown per occupiable node type. */
function billingPeriodOptionsForNodeType(nodeType) {
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
function parseAssetRateFromMetadata(metadataJson) {
    if (!metadataJson?.trim())
        return null;
    try {
        const raw = JSON.parse(metadataJson);
        const amount = Number(raw.rate_amount ??
            raw.price_per_night ??
            raw.pricePerNight ??
            raw.price ??
            0);
        if (!Number.isFinite(amount) || amount <= 0)
            return null;
        const billing = String(raw.billing_period ?? raw.billingPeriod ?? "PER_NIGHT")
            .trim()
            .toUpperCase();
        return {
            rate_amount: amount,
            billing_period: billing || "PER_NIGHT",
        };
    }
    catch {
        return null;
    }
}
function formatAssetRate(rate, currencyCode = "") {
    if (!rate?.rate_amount)
        return "—";
    const label = exports.ASSET_BILLING_PERIOD_LABELS[rate.billing_period] ?? "";
    const amount = rate.rate_amount.toLocaleString();
    const currency = currencyCode.trim();
    return currency
        ? `${currency} ${amount} ${label}`.trim()
        : `${amount} ${label}`.trim();
}
function defaultBillingPeriodForNodeType(nodeType) {
    const t = nodeType.toUpperCase();
    if (t.includes("TABLE"))
        return "PER_HOUR";
    if (t.includes("UNIT") || t.includes("HOUSE"))
        return "PER_MONTH";
    return "PER_NIGHT";
}
class FacilityAssetPricingHelper {
}
exports.FacilityAssetPricingHelper = FacilityAssetPricingHelper;
FacilityAssetPricingHelper.ASSET_BILLING_PERIOD_LABELS = exports.ASSET_BILLING_PERIOD_LABELS;
FacilityAssetPricingHelper.billingPeriodOptionsForNodeType = billingPeriodOptionsForNodeType;
FacilityAssetPricingHelper.parseAssetRateFromMetadata = parseAssetRateFromMetadata;
FacilityAssetPricingHelper.formatAssetRate = formatAssetRate;
FacilityAssetPricingHelper.defaultBillingPeriodForNodeType = defaultBillingPeriodForNodeType;
//# sourceMappingURL=facility-asset-pricing.js.map