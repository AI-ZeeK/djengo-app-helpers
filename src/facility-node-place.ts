import type { FacilityNodeLike } from "./facility-types";
import type { FacilitySpaceUsage } from "./facility-helpers";
import { isOccupiableFacilityNodeType, normalizeSpaceUsage } from "./facility-helpers";
import {
  LISTING_OFFER_OPTIONS,
  parseFacilityMetadata,
  type ListingOffer,
} from "./facility-node-metadata";

export type NodePlaceKind = "bookable" | "office" | "department" | "unlisted";

export type ResolvedNodePlaceRole = {
  kind: NodePlaceKind;
  /** Short table label: Bookable, Office, Department, Not listed. */
  label: string;
  /** True when inferred from node type (space_usage unset). */
  inferred: boolean;
};

export function listingOfferLabel(
  offer: ListingOffer | string | null | undefined,
): string | null {
  if (!offer) return null;
  const id = String(offer).trim().toUpperCase();
  return LISTING_OFFER_OPTIONS.find((o) => o.id === id)?.name ?? null;
}

export function resolveNodePlaceRole(
  node: FacilityNodeLike,
): ResolvedNodePlaceRole {
  const usage = normalizeSpaceUsage(node.space_usage);
  if (usage === "BOOKABLE") {
    return { kind: "bookable", label: "Bookable", inferred: false };
  }
  if (usage === "OPERATIONAL") {
    return { kind: "office", label: "Office", inferred: false };
  }
  if (usage === "DEPARTMENT") {
    return { kind: "department", label: "Department", inferred: false };
  }

  if (isOccupiableFacilityNodeType(node.node_level?.node_type ?? node.node_type)) {
    return { kind: "bookable", label: "Bookable", inferred: true };
  }
  return { kind: "unlisted", label: "Not listed", inferred: true };
}

export function nodeListingOffer(
  node: FacilityNodeLike,
): ListingOffer | undefined {
  return parseFacilityMetadata(node.metadata_json).listingOffer;
}

/** Parent place role that children should inherit unless set themselves. */
export function inheritablePlaceUsage(
  node?: { space_usage?: string | number | null } | null,
): Extract<FacilitySpaceUsage, "BOOKABLE" | "OPERATIONAL" | "DEPARTMENT"> | null {
  const usage = normalizeSpaceUsage(node?.space_usage);
  if (usage === "BOOKABLE" || usage === "OPERATIONAL" || usage === "DEPARTMENT")
    return usage;
  return null;
}

export function isEstateBookablePlace(
  facilityMode: string | null | undefined,
  node: FacilityNodeLike,
  spaceUsage?: FacilitySpaceUsage,
): boolean {
  if (facilityMode !== "ESTATE") return false;
  const usage = spaceUsage ?? normalizeSpaceUsage(node.space_usage);
  if (usage === "BOOKABLE") return true;
  return resolveNodePlaceRole(node).kind === "bookable";
}

/** Own department_id, or the nearest ancestor’s when the table has them expanded. */
export function inheritedDepartmentIdFromTree(
  nodeId: string,
  rows: { node: FacilityNodeLike; depth: number }[],
): string | null {
  const idx = rows.findIndex((r) => r.node.facility_node_id === nodeId);
  if (idx < 0) return null;

  const own = rows[idx].node.department_id?.trim();
  if (own) return own;

  let wantDepth = rows[idx].depth - 1;
  for (let i = idx - 1; i >= 0 && wantDepth >= 0; i--) {
    if (rows[i].depth !== wantDepth) continue;
    const inherited = rows[i].node.department_id?.trim();
    if (inherited) return inherited;
    wantDepth -= 1;
  }
  return null;
}

export class FacilityNodePlaceHelper {
  static listingOfferLabel = listingOfferLabel;
  static resolveNodePlaceRole = resolveNodePlaceRole;
  static nodeListingOffer = nodeListingOffer;
  static inheritablePlaceUsage = inheritablePlaceUsage;
  static isEstateBookablePlace = isEstateBookablePlace;
  static inheritedDepartmentIdFromTree = inheritedDepartmentIdFromTree;
}

