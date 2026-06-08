import { FACILITY_ASSET_KIND_ENUM, type FacilityAssetKind, type FacilityMode, type FacilityNodeType } from "./facility-enums";
/** Node types that receive a 1:1 occupancy asset profile. */
export declare const OCCUPIABLE_FACILITY_NODE_TYPES: readonly FacilityNodeType[];
/** Normalize API/proto asset kind (number, "1", ASSET_KIND_BED) to string enum. */
export declare function normalizeFacilityAssetKind(value: unknown): FACILITY_ASSET_KIND_ENUM | "";
export declare function isEnumMember<E extends Record<string, string>>(enumObj: E, value: unknown): value is E[keyof E];
/** Parse unknown JSON value to an enum member, or return fallback (often ""). */
export declare function coerceEnumValue<E extends Record<string, string>>(enumObj: E, raw: unknown, fallback?: E[keyof E] | ""): E[keyof E] | "";
export declare function nodeTypeToAssetKind(nodeType: string | undefined | null): FacilityAssetKind | null;
export declare function isOccupiableFacilityNodeType(nodeType: string | undefined | null): nodeType is FacilityNodeType;
/** Default capacity_max when creating an occupiable asset (mirrors FacilityAssetRules.cs). */
export declare function defaultFacilityAssetCapacity(nodeType: FacilityNodeType, facilityMode?: FacilityMode): number;
/** Human-readable asset kind label from ASSET_KIND_* value (string or proto number). */
export declare function formatFacilityAssetKindLabel(assetKind: unknown): string;
/** Labels for enum option UIs (e.g. "icu" → "ICU"). */
export declare function formatEnumOptionLabel(value: string): string;
export declare function enumSelectOptions<E extends Record<string, string>>(enumObj: E): {
    value: E[keyof E];
    label: string;
}[];
//# sourceMappingURL=facility-helpers.d.ts.map