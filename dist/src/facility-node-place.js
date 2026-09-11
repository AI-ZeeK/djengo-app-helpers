"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityNodePlaceHelper = void 0;
exports.listingOfferLabel = listingOfferLabel;
exports.resolveNodePlaceRole = resolveNodePlaceRole;
exports.nodeListingOffer = nodeListingOffer;
exports.inheritablePlaceUsage = inheritablePlaceUsage;
exports.isEstateBookablePlace = isEstateBookablePlace;
exports.inheritedDepartmentIdFromTree = inheritedDepartmentIdFromTree;
const facility_helpers_1 = require("./facility-helpers");
const facility_node_metadata_1 = require("./facility-node-metadata");
function listingOfferLabel(offer) {
    if (!offer)
        return null;
    const id = String(offer).trim().toUpperCase();
    return facility_node_metadata_1.LISTING_OFFER_OPTIONS.find((o) => o.id === id)?.name ?? null;
}
function resolveNodePlaceRole(node) {
    const usage = (0, facility_helpers_1.normalizeSpaceUsage)(node.space_usage);
    if (usage === "BOOKABLE") {
        return { kind: "bookable", label: "Bookable", inferred: false };
    }
    if (usage === "OPERATIONAL") {
        return { kind: "office", label: "Office", inferred: false };
    }
    if (usage === "DEPARTMENT") {
        return { kind: "department", label: "Department", inferred: false };
    }
    if ((0, facility_helpers_1.isOccupiableFacilityNodeType)(node.node_level?.node_type ?? node.node_type)) {
        return { kind: "bookable", label: "Bookable", inferred: true };
    }
    return { kind: "unlisted", label: "Not listed", inferred: true };
}
function nodeListingOffer(node) {
    return (0, facility_node_metadata_1.parseFacilityMetadata)(node.metadata_json).listingOffer;
}
/** Parent place role that children should inherit unless set themselves. */
function inheritablePlaceUsage(node) {
    const usage = (0, facility_helpers_1.normalizeSpaceUsage)(node?.space_usage);
    if (usage === "BOOKABLE" || usage === "OPERATIONAL" || usage === "DEPARTMENT")
        return usage;
    return null;
}
function isEstateBookablePlace(facilityMode, node, spaceUsage) {
    if (facilityMode !== "ESTATE")
        return false;
    const usage = spaceUsage ?? (0, facility_helpers_1.normalizeSpaceUsage)(node.space_usage);
    if (usage === "BOOKABLE")
        return true;
    return resolveNodePlaceRole(node).kind === "bookable";
}
/** Own department_id, or the nearest ancestor’s when the table has them expanded. */
function inheritedDepartmentIdFromTree(nodeId, rows) {
    const idx = rows.findIndex((r) => r.node.facility_node_id === nodeId);
    if (idx < 0)
        return null;
    const own = rows[idx].node.department_id?.trim();
    if (own)
        return own;
    let wantDepth = rows[idx].depth - 1;
    for (let i = idx - 1; i >= 0 && wantDepth >= 0; i--) {
        if (rows[i].depth !== wantDepth)
            continue;
        const inherited = rows[i].node.department_id?.trim();
        if (inherited)
            return inherited;
        wantDepth -= 1;
    }
    return null;
}
class FacilityNodePlaceHelper {
}
exports.FacilityNodePlaceHelper = FacilityNodePlaceHelper;
FacilityNodePlaceHelper.listingOfferLabel = listingOfferLabel;
FacilityNodePlaceHelper.resolveNodePlaceRole = resolveNodePlaceRole;
FacilityNodePlaceHelper.nodeListingOffer = nodeListingOffer;
FacilityNodePlaceHelper.inheritablePlaceUsage = inheritablePlaceUsage;
FacilityNodePlaceHelper.isEstateBookablePlace = isEstateBookablePlace;
FacilityNodePlaceHelper.inheritedDepartmentIdFromTree = inheritedDepartmentIdFromTree;
//# sourceMappingURL=facility-node-place.js.map