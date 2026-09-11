import type { FacilityNodeLike } from "./facility-types";
import { type FacilityFloorMetadata } from "./facility-node-metadata";
export type { FacilityFloorMetadata };
export declare function isFloorNodeType(nodeType: unknown): boolean;
export declare function getFloorMetadata(node: {
    metadata_json?: string;
}): FacilityFloorMetadata | undefined;
/** Default display name for a new floor at the given index. */
export declare function defaultFloorDisplayName(floorIndex: number): string;
/** Next index after existing floor siblings (by metadata, then count). */
export declare function nextFloorIndexFromSiblings<T extends FacilityNodeLike>(siblings: T[]): number;
export declare function sortNodesByFloorIndex<T extends FacilityNodeLike>(nodes: T[]): T[];
export declare function buildFloorMetadataPatch(floorIndex: number, displayName: string): {
    floor: FacilityFloorMetadata;
};
export type SpatialLayoutHint = {
    title: string;
    body: string;
    variant?: "info" | "warn";
};
/** UI copy for spatial layout / plan vs hierarchy. */
export declare function getSpatialLayoutHint(params: {
    currentContainerType: string | null;
    displayedNodes: FacilityNodeLike[];
    viewMode: "plan" | "explore";
}): SpatialLayoutHint | null;
export declare function formatFloorSummary(node: FacilityNodeLike): string | null;
export declare class FacilityFloorHelper {
    static isFloorNodeType: typeof isFloorNodeType;
    static getFloorMetadata: typeof getFloorMetadata;
    static defaultFloorDisplayName: typeof defaultFloorDisplayName;
    static nextFloorIndexFromSiblings: typeof nextFloorIndexFromSiblings;
    static sortNodesByFloorIndex: typeof sortNodesByFloorIndex;
    static buildFloorMetadataPatch: typeof buildFloorMetadataPatch;
    static getSpatialLayoutHint: typeof getSpatialLayoutHint;
    static formatFloorSummary: typeof formatFloorSummary;
}
//# sourceMappingURL=facility-floor.d.ts.map