/** Physical size stored under `metadata_json.space` on facility nodes (metres). */
export type FacilityNodeSpaceMetrics = {
    /** Gross floor area (m²) */
    area_sq_m?: number;
    /** Net / usable area when different from gross (m²) */
    usable_area_sq_m?: number;
    length_m?: number;
    width_m?: number;
    /** Ceiling or clear height (m) */
    height_m?: number;
    volume_m3?: number;
    /** Display hint: `m` (default) or `ft` */
    measurement_unit?: "m" | "ft" | string;
};
/** Floor level stored under `metadata_json.floor` (hierarchy, not 2D grid). */
export type FacilityFloorMetadata = {
    floor_index: number;
    floor_label?: string;
};
/** Optional fields stored in facility_nodes.metadata_json */
export type FacilityNodeMetadata = {
    description?: string;
    space?: FacilityNodeSpaceMetrics;
    floor?: FacilityFloorMetadata;
    /** On-site operation — restaurant, bar, hotel, spa, … */
    operationKind?: string;
    /** Estate / unit public offer: monthly rent, lease, sale, Airbnb-style, or short stay. */
    listingOffer?: "RENT" | "LEASE" | "BUY" | "BNB" | "SHORT_STAY";
};
export declare const LISTING_OFFER_OPTIONS: readonly [{
    readonly id: "RENT";
    readonly name: "Monthly rent";
}, {
    readonly id: "LEASE";
    readonly name: "Lease";
}, {
    readonly id: "BUY";
    readonly name: "For sale";
}, {
    readonly id: "BNB";
    readonly name: "Airbnb-style";
}, {
    readonly id: "SHORT_STAY";
    readonly name: "Short stay";
}];
export type ListingOffer = (typeof LISTING_OFFER_OPTIONS)[number]["id"];
export declare function parseFacilityMetadata(metadataJson?: string | Record<string, unknown> | null): FacilityNodeMetadata;
export declare function getNodeDescription(node: {
    metadata_json?: string;
    description?: string;
}): string;
export declare function getNodeSpaceMetrics(node: {
    metadata_json?: string;
}): FacilityNodeSpaceMetrics | undefined;
/** Whether the node has any usable space / dimension metadata. */
export declare function hasNodeSpaceData(node: {
    metadata_json?: string;
}): boolean;
/**
 * Single positive size score for relative 3D scaling (≈ characteristic edge length in m).
 * Nodes without space data return `1` (neutral vs median).
 */
export declare function getNodeSpatialSizeMetric(node: {
    metadata_json?: string;
}): number;
/** Primary area for display (usable preferred over gross). */
export declare function getNodeAreaSqM(node: {
    metadata_json?: string;
}): number | undefined;
/** Human-readable size summary for tables / inspector (empty when unset). */
export declare function formatNodeSpaceSummary(node: {
    metadata_json?: string;
}, options?: {
    compact?: boolean;
}): string;
export declare function buildMetadataJson(patch: FacilityNodeMetadata, existingJson?: string | null): string | undefined;
export declare class FacilityNodeMetadataHelper {
    static readonly LISTING_OFFER_OPTIONS: readonly [{
        readonly id: "RENT";
        readonly name: "Monthly rent";
    }, {
        readonly id: "LEASE";
        readonly name: "Lease";
    }, {
        readonly id: "BUY";
        readonly name: "For sale";
    }, {
        readonly id: "BNB";
        readonly name: "Airbnb-style";
    }, {
        readonly id: "SHORT_STAY";
        readonly name: "Short stay";
    }];
    static parseFacilityMetadata: typeof parseFacilityMetadata;
    static getNodeDescription: typeof getNodeDescription;
    static getNodeSpaceMetrics: typeof getNodeSpaceMetrics;
    static hasNodeSpaceData: typeof hasNodeSpaceData;
    static getNodeSpatialSizeMetric: typeof getNodeSpatialSizeMetric;
    static getNodeAreaSqM: typeof getNodeAreaSqM;
    static formatNodeSpaceSummary: typeof formatNodeSpaceSummary;
    static buildMetadataJson: typeof buildMetadataJson;
}
//# sourceMappingURL=facility-node-metadata.d.ts.map