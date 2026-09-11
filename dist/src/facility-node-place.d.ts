import type { FacilityNodeLike } from "./facility-types";
import type { FacilitySpaceUsage } from "./facility-helpers";
import { type ListingOffer } from "./facility-node-metadata";
export type NodePlaceKind = "bookable" | "office" | "department" | "unlisted";
export type ResolvedNodePlaceRole = {
    kind: NodePlaceKind;
    /** Short table label: Bookable, Office, Department, Not listed. */
    label: string;
    /** True when inferred from node type (space_usage unset). */
    inferred: boolean;
};
export declare function listingOfferLabel(offer: ListingOffer | string | null | undefined): string | null;
export declare function resolveNodePlaceRole(node: FacilityNodeLike): ResolvedNodePlaceRole;
export declare function nodeListingOffer(node: FacilityNodeLike): ListingOffer | undefined;
/** Parent place role that children should inherit unless set themselves. */
export declare function inheritablePlaceUsage(node?: {
    space_usage?: string | number | null;
} | null): Extract<FacilitySpaceUsage, "BOOKABLE" | "OPERATIONAL" | "DEPARTMENT"> | null;
export declare function isEstateBookablePlace(facilityMode: string | null | undefined, node: FacilityNodeLike, spaceUsage?: FacilitySpaceUsage): boolean;
/** Own department_id, or the nearest ancestor’s when the table has them expanded. */
export declare function inheritedDepartmentIdFromTree(nodeId: string, rows: {
    node: FacilityNodeLike;
    depth: number;
}[]): string | null;
export declare class FacilityNodePlaceHelper {
    static listingOfferLabel: typeof listingOfferLabel;
    static resolveNodePlaceRole: typeof resolveNodePlaceRole;
    static nodeListingOffer: typeof nodeListingOffer;
    static inheritablePlaceUsage: typeof inheritablePlaceUsage;
    static isEstateBookablePlace: typeof isEstateBookablePlace;
    static inheritedDepartmentIdFromTree: typeof inheritedDepartmentIdFromTree;
}
//# sourceMappingURL=facility-node-place.d.ts.map