export type AssetBillingPeriod = "PER_NIGHT" | "PER_HOUR" | "PER_STAY" | "PER_DAY" | "PER_WEEK" | "PER_MONTH" | "PER_YEAR" | "";
export type AssetRateInfo = {
    rate_amount: number;
    billing_period: AssetBillingPeriod;
};
export declare const ASSET_BILLING_PERIOD_LABELS: Record<string, string>;
export type BillingPeriodOption = {
    value: AssetBillingPeriod;
    label: string;
};
/** Lease / hospitality / F&B billing choices shown per occupiable node type. */
export declare function billingPeriodOptionsForNodeType(nodeType: string): BillingPeriodOption[];
export declare function parseAssetRateFromMetadata(metadataJson?: string | null): AssetRateInfo | null;
export declare function formatAssetRate(rate: AssetRateInfo | null | undefined, currencyCode?: string): string;
export declare function defaultBillingPeriodForNodeType(nodeType: string): AssetBillingPeriod;
export declare class FacilityAssetPricingHelper {
    static readonly ASSET_BILLING_PERIOD_LABELS: Record<string, string>;
    static billingPeriodOptionsForNodeType: typeof billingPeriodOptionsForNodeType;
    static parseAssetRateFromMetadata: typeof parseAssetRateFromMetadata;
    static formatAssetRate: typeof formatAssetRate;
    static defaultBillingPeriodForNodeType: typeof defaultBillingPeriodForNodeType;
}
//# sourceMappingURL=facility-asset-pricing.d.ts.map