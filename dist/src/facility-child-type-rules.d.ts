import type { FacilityMode, FacilityNodeType } from "./facility-enums";
/**
 * Which node types may be placed directly under a given parent type.
 * Floor contains wings/rooms — wing cannot contain floor.
 * House under floor is estate-only (see getAllowedChildLevelTypesForMode).
 */
export declare const ALLOWED_CHILDREN_BY_PARENT: Partial<Record<FacilityNodeType, FacilityNodeType[]>>;
/**
 * Suggested next types under a parent. Hierarchy save no longer requires this
 * chain — operators can order levels however they need.
 */
export declare function getAllowedChildLevelTypesForMode(mode: FacilityMode | null | undefined, parent: FacilityNodeType): FacilityNodeType[];
export declare function isAllowedChildLevelTypeForMode(mode: FacilityMode | null | undefined, parent: FacilityNodeType, child: FacilityNodeType): boolean;
export declare function getAllowedChildTypesUnderParent(parentType: FacilityNodeType | string | null | undefined): FacilityNodeType[];
export declare function isAllowedChildTypeUnderParent(parentType: FacilityNodeType | string | null | undefined, childType: FacilityNodeType | string): boolean;
export declare class FacilityChildTypeHelper {
    static readonly ALLOWED_CHILDREN_BY_PARENT: Partial<Record<"FACILITY_NODE_TYPE_UNSPECIFIED" | "BLOCK" | "BUILDING" | "WARD" | "UNIT" | "ROOM" | "BED" | "FLOOR" | "WING" | "HOUSE" | "TABLE" | "ZONE" | "SECTION" | "SITE" | "CHAIR" | "BAR", ("FACILITY_NODE_TYPE_UNSPECIFIED" | "BLOCK" | "BUILDING" | "WARD" | "UNIT" | "ROOM" | "BED" | "FLOOR" | "WING" | "HOUSE" | "TABLE" | "ZONE" | "SECTION" | "SITE" | "CHAIR" | "BAR")[]>>;
    static getAllowedChildLevelTypesForMode: typeof getAllowedChildLevelTypesForMode;
    static isAllowedChildLevelTypeForMode: typeof isAllowedChildLevelTypeForMode;
    static getAllowedChildTypesUnderParent: typeof getAllowedChildTypesUnderParent;
    static isAllowedChildTypeUnderParent: typeof isAllowedChildTypeUnderParent;
}
//# sourceMappingURL=facility-child-type-rules.d.ts.map