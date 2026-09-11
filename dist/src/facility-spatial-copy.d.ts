import type { FacilityNodeLike } from "./facility-types";
export type SpatialCopyPatch = {
    facilityNodeId: string;
    spatial_position_json: string;
    orientation?: string;
};
/**
 * Map placed positions from source children onto target children by sorted name
 * index (bulk create often yields parallel Table 1…N under each zone).
 */
export declare function buildSpatialCopyPatches<T extends FacilityNodeLike>(sourceChildren: T[], targetChildren: T[]): SpatialCopyPatch[];
export declare class FacilitySpatialCopyHelper {
    static buildSpatialCopyPatches: typeof buildSpatialCopyPatches;
}
//# sourceMappingURL=facility-spatial-copy.d.ts.map