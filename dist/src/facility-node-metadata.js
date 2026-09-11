"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityNodeMetadataHelper = exports.LISTING_OFFER_OPTIONS = void 0;
exports.parseFacilityMetadata = parseFacilityMetadata;
exports.getNodeDescription = getNodeDescription;
exports.getNodeSpaceMetrics = getNodeSpaceMetrics;
exports.hasNodeSpaceData = hasNodeSpaceData;
exports.getNodeSpatialSizeMetric = getNodeSpatialSizeMetric;
exports.getNodeAreaSqM = getNodeAreaSqM;
exports.formatNodeSpaceSummary = formatNodeSpaceSummary;
exports.buildMetadataJson = buildMetadataJson;
exports.LISTING_OFFER_OPTIONS = [
    { id: "RENT", name: "Monthly rent" },
    { id: "LEASE", name: "Lease" },
    { id: "BUY", name: "For sale" },
    { id: "BNB", name: "Airbnb-style" },
    { id: "SHORT_STAY", name: "Short stay" },
];
function normalizeListingOffer(value) {
    if (typeof value !== "string")
        return undefined;
    const v = value.trim().toUpperCase();
    if (v === "AIRBNB")
        return "BNB";
    if (v === "SALE")
        return "BUY";
    if (v === "RENT" || v === "LEASE" || v === "BUY" || v === "BNB" || v === "SHORT_STAY")
        return v;
    return undefined;
}
function readPositiveNumber(value) {
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
        return undefined;
    }
    return value;
}
function parseFloorMetadata(raw) {
    if (!raw || typeof raw !== "object")
        return undefined;
    const f = raw;
    const idx = typeof f.floor_index === "number"
        ? f.floor_index
        : typeof f.index === "number"
            ? f.index
            : null;
    if (idx == null || !Number.isFinite(idx) || idx < 0)
        return undefined;
    return {
        floor_index: Math.floor(idx),
        floor_label: typeof f.floor_label === "string"
            ? f.floor_label
            : typeof f.label === "string"
                ? f.label
                : undefined,
    };
}
function parseSpaceMetrics(raw) {
    if (!raw || typeof raw !== "object")
        return undefined;
    const s = raw;
    const space = {
        area_sq_m: readPositiveNumber(s.area_sq_m),
        usable_area_sq_m: readPositiveNumber(s.usable_area_sq_m),
        length_m: readPositiveNumber(s.length_m),
        width_m: readPositiveNumber(s.width_m),
        height_m: readPositiveNumber(s.height_m),
        volume_m3: readPositiveNumber(s.volume_m3),
        measurement_unit: typeof s.measurement_unit === "string" ? s.measurement_unit : undefined,
    };
    const hasValue = Object.values(space).some((v) => v !== undefined);
    return hasValue ? space : undefined;
}
function parseFacilityMetadata(metadataJson) {
    let parsed = null;
    if (metadataJson && typeof metadataJson === "object") {
        parsed = metadataJson;
    }
    else if (typeof metadataJson === "string" && metadataJson.trim()) {
        try {
            const value = JSON.parse(metadataJson);
            if (value && typeof value === "object") {
                parsed = value;
            }
        }
        catch {
            return {};
        }
    }
    if (!parsed)
        return {};
    const description = typeof parsed.description === "string" ? parsed.description : undefined;
    const space = parseSpaceMetrics(parsed.space);
    const floor = parseFloorMetadata(parsed.floor);
    const operationKind = typeof parsed.operation_kind === "string"
        ? parsed.operation_kind
        : typeof parsed.operationKind === "string"
            ? parsed.operationKind
            : undefined;
    const listingOffer = normalizeListingOffer(parsed.listing_offer ?? parsed.listingOffer);
    return { description, space, floor, operationKind, listingOffer };
}
function getNodeDescription(node) {
    if (node.description?.trim())
        return node.description.trim();
    return parseFacilityMetadata(node.metadata_json).description?.trim() ?? "";
}
function getNodeSpaceMetrics(node) {
    return parseFacilityMetadata(node.metadata_json).space;
}
/** Whether the node has any usable space / dimension metadata. */
function hasNodeSpaceData(node) {
    const space = getNodeSpaceMetrics(node);
    if (!space)
        return false;
    return ((space.usable_area_sq_m ?? space.area_sq_m) != null ||
        (space.length_m != null && space.width_m != null) ||
        space.length_m != null ||
        space.width_m != null);
}
/**
 * Single positive size score for relative 3D scaling (≈ characteristic edge length in m).
 * Nodes without space data return `1` (neutral vs median).
 */
function getNodeSpatialSizeMetric(node) {
    const space = getNodeSpaceMetrics(node);
    if (!space)
        return 1;
    const area = space.usable_area_sq_m ?? space.area_sq_m;
    if (area != null && area > 0)
        return Math.sqrt(area);
    if (space.length_m != null && space.width_m != null) {
        const lw = space.length_m * space.width_m;
        if (lw > 0)
            return Math.sqrt(lw);
    }
    if (space.length_m != null && space.length_m > 0)
        return space.length_m;
    if (space.width_m != null && space.width_m > 0)
        return space.width_m;
    return 1;
}
/** Primary area for display (usable preferred over gross). */
function getNodeAreaSqM(node) {
    const space = getNodeSpaceMetrics(node);
    if (!space)
        return undefined;
    return space.usable_area_sq_m ?? space.area_sq_m;
}
/** Human-readable size summary for tables / inspector (empty when unset). */
function formatNodeSpaceSummary(node, options) {
    const space = getNodeSpaceMetrics(node);
    if (!space)
        return "";
    const parts = [];
    const area = space.usable_area_sq_m ?? space.area_sq_m;
    if (area != null) {
        parts.push(options?.compact ? `${area} m²` : `${area} m²${space.usable_area_sq_m ? " usable" : ""}`);
    }
    if (space.length_m != null && space.width_m != null) {
        parts.push(`${space.length_m} × ${space.width_m} m`);
    }
    else if (space.length_m != null) {
        parts.push(`L ${space.length_m} m`);
    }
    else if (space.width_m != null) {
        parts.push(`W ${space.width_m} m`);
    }
    if (space.height_m != null) {
        parts.push(options?.compact ? `H ${space.height_m}m` : `height ${space.height_m} m`);
    }
    if (space.volume_m3 != null && !options?.compact) {
        parts.push(`${space.volume_m3} m³`);
    }
    return parts.join(options?.compact ? " · " : ", ");
}
function buildMetadataJson(patch, existingJson) {
    const base = parseFacilityMetadata(existingJson);
    const description = patch.description?.trim();
    if (description)
        base.description = description;
    else if (patch.description === "")
        delete base.description;
    if (patch.space !== undefined) {
        const hasSpace = patch.space &&
            Object.values(patch.space).some((v) => v !== undefined && v !== null && v !== "");
        if (hasSpace)
            base.space = patch.space;
        else
            delete base.space;
    }
    if (patch.floor !== undefined) {
        if (patch.floor &&
            typeof patch.floor.floor_index === "number" &&
            patch.floor.floor_index >= 0) {
            base.floor = {
                floor_index: Math.floor(patch.floor.floor_index),
                floor_label: patch.floor.floor_label?.trim() || undefined,
            };
        }
        else {
            delete base.floor;
        }
    }
    if (patch.operationKind !== undefined) {
        if (patch.operationKind?.trim())
            base.operationKind = patch.operationKind.trim();
        else
            delete base.operationKind;
    }
    if (patch.listingOffer !== undefined) {
        if (patch.listingOffer)
            base.listingOffer = patch.listingOffer;
        else
            delete base.listingOffer;
    }
    const out = {};
    if (base.description?.trim())
        out.description = base.description.trim();
    if (base.space)
        out.space = base.space;
    if (base.floor)
        out.floor = base.floor;
    if (base.operationKind)
        out.operation_kind = base.operationKind;
    if (base.listingOffer)
        out.listing_offer = base.listingOffer;
    if (Object.keys(out).length === 0)
        return undefined;
    return JSON.stringify(out);
}
class FacilityNodeMetadataHelper {
}
exports.FacilityNodeMetadataHelper = FacilityNodeMetadataHelper;
FacilityNodeMetadataHelper.LISTING_OFFER_OPTIONS = exports.LISTING_OFFER_OPTIONS;
FacilityNodeMetadataHelper.parseFacilityMetadata = parseFacilityMetadata;
FacilityNodeMetadataHelper.getNodeDescription = getNodeDescription;
FacilityNodeMetadataHelper.getNodeSpaceMetrics = getNodeSpaceMetrics;
FacilityNodeMetadataHelper.hasNodeSpaceData = hasNodeSpaceData;
FacilityNodeMetadataHelper.getNodeSpatialSizeMetric = getNodeSpatialSizeMetric;
FacilityNodeMetadataHelper.getNodeAreaSqM = getNodeAreaSqM;
FacilityNodeMetadataHelper.formatNodeSpaceSummary = formatNodeSpaceSummary;
FacilityNodeMetadataHelper.buildMetadataJson = buildMetadataJson;
//# sourceMappingURL=facility-node-metadata.js.map