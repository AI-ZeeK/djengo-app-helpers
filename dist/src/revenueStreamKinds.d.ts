export type RevenueStreamKindOption = {
    id: string;
    name: string;
};
/** Fallback catalog when kinds API is unavailable. */
export declare const REVENUE_STREAM_KIND_CATALOG: RevenueStreamKindOption[];
export declare function labelForRevenueStreamKind(kind: string | undefined | null, options?: RevenueStreamKindOption[]): string;
export declare class RevenueStreamHelper {
    static readonly REVENUE_STREAM_KIND_CATALOG: RevenueStreamKindOption[];
    static labelForRevenueStreamKind: typeof labelForRevenueStreamKind;
}
//# sourceMappingURL=revenueStreamKinds.d.ts.map