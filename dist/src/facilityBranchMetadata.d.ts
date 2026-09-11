import type { FacilityMode } from "./facility-enums";
export type OnSiteOperationKey = "has_hotel" | "has_restaurant" | "has_bar" | "has_lounge" | "has_kitchen" | "has_spa" | "has_gym" | "has_pool" | "has_conference_rooms" | "has_supermarket" | "has_clinical";
export type FacilityOnSiteOperations = Record<OnSiteOperationKey, boolean> & {
    other?: string[];
};
export type FacilityOperationPolicy = {
    f_and_b_combined: boolean;
    lounge_shares_bar_staff: boolean;
    kitchen_shared: boolean;
};
export type FacilityOccupancyAnchor = {
    /** Node type where stays are created (BED, ROOM, TABLE, …). */
    node_type: string;
};
export type PublicListingHospitalInfo = {
    has_emergency_department?: boolean;
    er_hours?: "24_7" | "SCHEDULED";
    accepts_ambulance?: boolean;
    specialties?: string[];
    public_phone?: string;
    public_phone_dial_code?: string;
};
export type PublicListingHospitalityInfo = {
    listing_style?: "HOTEL" | "SHORT_STAY" | "BNB";
};
export type PublicListingEstateInfo = {
    listing_style?: "RENTAL" | "SALE" | "MIXED" | "LEASE";
};
export type PublicListingMetadata = {
    is_listed?: boolean;
    tagline?: string;
    description?: string;
    /** Public browse card cover for this branch. */
    cover_image_url?: string | null;
    /** Branch operation kinds published to guest explore. */
    public_operation_kinds?: string[];
    hospital?: PublicListingHospitalInfo;
    hospitality?: PublicListingHospitalityInfo;
    estate?: PublicListingEstateInfo;
};
/** Node types that can hold occupancy / stays. */
export declare const OCCUPIABLE_NODE_TYPES: Set<string>;
export declare function defaultOccupancyAnchorForMode(mode: FacilityMode | null | undefined): string;
export declare function pickOccupancyAnchor(occupiableNodeTypes: string[], mode: FacilityMode | null | undefined, existing?: string | null): string;
export type FacilityDiningMetadata = {
    occupancy_anchor?: FacilityOccupancyAnchor;
};
export type FacilityBranchProfileMetadata = {
    on_site_operations?: Partial<FacilityOnSiteOperations> & {
        other?: string[];
    };
    operation_policy?: Partial<FacilityOperationPolicy>;
    occupancy_policy?: unknown;
    occupancy_anchor?: FacilityOccupancyAnchor;
    /** F&B bookable leaf when dining hierarchy (or pure restaurant) is in use. */
    dining?: FacilityDiningMetadata;
    public_listing?: PublicListingMetadata;
};
/** True when branch needs a dining hierarchy (pure restaurant or hotel/estate + F&B ops). */
export declare function needsDiningHierarchy(mode: FacilityMode | null | undefined, ops?: Partial<FacilityOnSiteOperations> | null): boolean;
/** Dining bookable leaf from metadata — defaults to TABLE. */
export declare function getDiningOccupancyAnchor(meta: FacilityBranchProfileMetadata | null | undefined): FacilityOccupancyAnchor;
export declare const EMPTY_ON_SITE_OPERATIONS: FacilityOnSiteOperations;
export declare const DEFAULT_OPERATION_POLICY: FacilityOperationPolicy;
export declare function parsePublicListingMetadata(metadataJson?: string | null): PublicListingMetadata;
export declare function mergePublicListingMetadata(existingJson: string | null | undefined, patch: PublicListingMetadata): string;
export declare function parseBranchProfileMetadata(metadataJson?: string | null): FacilityBranchProfileMetadata;
export declare function ensureKitchenWithFoodService(ops: FacilityOnSiteOperations, mode?: FacilityMode | null): FacilityOnSiteOperations;
export declare function resolveOnSiteOperations(metadataJson?: string | null, facilityMode?: FacilityMode | null): FacilityOnSiteOperations;
/** Drop operation flags that are not valid for this facility / company type. */
export declare function sanitizeOperationsForMode(mode: FacilityMode | null | undefined, ops: FacilityOnSiteOperations): FacilityOnSiteOperations;
export declare function operationsHintForFacilityMode(mode: FacilityMode | null | undefined): string;
export declare function resolveOperationPolicy(metadataJson?: string | null): FacilityOperationPolicy;
/** Suggested toggles when nothing is saved yet — not persisted until user saves. */
export declare function suggestedOnSiteOperations(mode: FacilityMode): FacilityOnSiteOperations;
export declare function buildBranchProfileMetadataJson(options: {
    onSiteOperations: FacilityOnSiteOperations;
    operationPolicy: FacilityOperationPolicy;
    occupancyAnchor?: FacilityOccupancyAnchor | null;
    diningOccupancyAnchor?: FacilityOccupancyAnchor | null;
    existingJson?: string | null;
}): string;
/** Operations a branch may declare for each facility / company layout type. */
export declare const OPERATIONS_BY_FACILITY_MODE: Record<Exclude<FacilityMode, "GENERAL">, OnSiteOperationKey[]>;
export declare function allowedOperationsForFacilityMode(mode: FacilityMode | null | undefined): OnSiteOperationKey[];
export declare function operationAllowedForFacilityMode(mode: FacilityMode | null | undefined, key: OnSiteOperationKey): boolean;
export declare function countEnabledOperations(ops: FacilityOnSiteOperations): number;
/** Map branch wizard facility toggles to on-site operations metadata. */
export declare function branchWizardTypeToOnSiteOperations(input: {
    has_hotel?: boolean;
    has_restaurant?: boolean;
    has_spa?: boolean;
    has_gym?: boolean;
    has_pool?: boolean;
    has_conference_rooms?: boolean;
    other_facilities?: string[];
}): FacilityOnSiteOperations;
export declare class FacilityBranchMetadataHelper {
    static readonly OCCUPIABLE_NODE_TYPES: Set<string>;
    static readonly EMPTY_ON_SITE_OPERATIONS: FacilityOnSiteOperations;
    static readonly DEFAULT_OPERATION_POLICY: FacilityOperationPolicy;
    static readonly OPERATIONS_BY_FACILITY_MODE: Record<"HOSPITAL" | "ESTATE" | "HOSPITALITY" | "RESTAURANT", OnSiteOperationKey[]>;
    static defaultOccupancyAnchorForMode: typeof defaultOccupancyAnchorForMode;
    static pickOccupancyAnchor: typeof pickOccupancyAnchor;
    static needsDiningHierarchy: typeof needsDiningHierarchy;
    static getDiningOccupancyAnchor: typeof getDiningOccupancyAnchor;
    static parsePublicListingMetadata: typeof parsePublicListingMetadata;
    static mergePublicListingMetadata: typeof mergePublicListingMetadata;
    static parseBranchProfileMetadata: typeof parseBranchProfileMetadata;
    static ensureKitchenWithFoodService: typeof ensureKitchenWithFoodService;
    static resolveOnSiteOperations: typeof resolveOnSiteOperations;
    static sanitizeOperationsForMode: typeof sanitizeOperationsForMode;
    static operationsHintForFacilityMode: typeof operationsHintForFacilityMode;
    static resolveOperationPolicy: typeof resolveOperationPolicy;
    static suggestedOnSiteOperations: typeof suggestedOnSiteOperations;
    static buildBranchProfileMetadataJson: typeof buildBranchProfileMetadataJson;
    static allowedOperationsForFacilityMode: typeof allowedOperationsForFacilityMode;
    static operationAllowedForFacilityMode: typeof operationAllowedForFacilityMode;
    static countEnabledOperations: typeof countEnabledOperations;
    static branchWizardTypeToOnSiteOperations: typeof branchWizardTypeToOnSiteOperations;
}
//# sourceMappingURL=facilityBranchMetadata.d.ts.map