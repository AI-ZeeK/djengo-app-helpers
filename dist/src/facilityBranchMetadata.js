"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityBranchMetadataHelper = exports.OPERATIONS_BY_FACILITY_MODE = exports.DEFAULT_OPERATION_POLICY = exports.EMPTY_ON_SITE_OPERATIONS = exports.OCCUPIABLE_NODE_TYPES = void 0;
exports.defaultOccupancyAnchorForMode = defaultOccupancyAnchorForMode;
exports.pickOccupancyAnchor = pickOccupancyAnchor;
exports.needsDiningHierarchy = needsDiningHierarchy;
exports.getDiningOccupancyAnchor = getDiningOccupancyAnchor;
exports.parsePublicListingMetadata = parsePublicListingMetadata;
exports.mergePublicListingMetadata = mergePublicListingMetadata;
exports.parseBranchProfileMetadata = parseBranchProfileMetadata;
exports.ensureKitchenWithFoodService = ensureKitchenWithFoodService;
exports.resolveOnSiteOperations = resolveOnSiteOperations;
exports.sanitizeOperationsForMode = sanitizeOperationsForMode;
exports.operationsHintForFacilityMode = operationsHintForFacilityMode;
exports.resolveOperationPolicy = resolveOperationPolicy;
exports.suggestedOnSiteOperations = suggestedOnSiteOperations;
exports.buildBranchProfileMetadataJson = buildBranchProfileMetadataJson;
exports.allowedOperationsForFacilityMode = allowedOperationsForFacilityMode;
exports.operationAllowedForFacilityMode = operationAllowedForFacilityMode;
exports.countEnabledOperations = countEnabledOperations;
exports.branchWizardTypeToOnSiteOperations = branchWizardTypeToOnSiteOperations;
/** Node types that can hold occupancy / stays. */
exports.OCCUPIABLE_NODE_TYPES = new Set([
    "BED",
    "ROOM",
    "TABLE",
    "CHAIR",
    "HOUSE",
    "UNIT",
    "SECTION",
]);
function defaultOccupancyAnchorForMode(mode) {
    if (mode === "HOSPITAL")
        return "BED";
    if (mode === "RESTAURANT")
        return "TABLE";
    if (mode === "ESTATE")
        return "HOUSE";
    return "ROOM";
}
function pickOccupancyAnchor(occupiableNodeTypes, mode, existing) {
    const preferred = existing?.trim() || defaultOccupancyAnchorForMode(mode);
    if (occupiableNodeTypes.includes(preferred))
        return preferred;
    return occupiableNodeTypes[0] ?? preferred;
}
/** True when branch needs a dining hierarchy (pure restaurant or hotel/estate + F&B ops). */
function needsDiningHierarchy(mode, ops) {
    if (mode === "RESTAURANT")
        return true;
    return Boolean(ops?.has_restaurant || ops?.has_bar);
}
/** Dining bookable leaf from metadata — defaults to TABLE. */
function getDiningOccupancyAnchor(meta) {
    const fromDining = meta?.dining?.occupancy_anchor?.node_type?.trim();
    if (fromDining) {
        return { node_type: fromDining.toUpperCase() };
    }
    const fromPrimary = meta?.occupancy_anchor?.node_type?.trim()?.toUpperCase();
    if (fromPrimary === "TABLE" || fromPrimary === "CHAIR") {
        return { node_type: fromPrimary };
    }
    return { node_type: "TABLE" };
}
exports.EMPTY_ON_SITE_OPERATIONS = {
    has_hotel: false,
    has_restaurant: false,
    has_bar: false,
    has_lounge: false,
    has_kitchen: false,
    has_spa: false,
    has_gym: false,
    has_pool: false,
    has_conference_rooms: false,
    has_supermarket: false,
    has_clinical: false,
    other: [],
};
exports.DEFAULT_OPERATION_POLICY = {
    f_and_b_combined: false,
    lounge_shares_bar_staff: false,
    kitchen_shared: true,
};
function parsePublicListingMetadata(metadataJson) {
    return parseBranchProfileMetadata(metadataJson).public_listing ?? {};
}
function mergePublicListingMetadata(existingJson, patch) {
    const existing = parseBranchProfileMetadata(existingJson);
    return JSON.stringify({
        ...existing,
        public_listing: {
            ...existing.public_listing,
            ...patch,
        },
    });
}
function parseBranchProfileMetadata(metadataJson) {
    if (!metadataJson?.trim())
        return {};
    try {
        return JSON.parse(metadataJson);
    }
    catch {
        return {};
    }
}
/** Restaurant / bar outlets imply a kitchen queue at the branch. */
const FOOD_SERVICE_KITCHEN_TRIGGERS = [
    "has_restaurant",
    "has_bar",
];
function ensureKitchenWithFoodService(ops, mode) {
    if (!operationAllowedForFacilityMode(mode, "has_kitchen"))
        return ops;
    const needsKitchen = FOOD_SERVICE_KITCHEN_TRIGGERS.some((k) => ops[k]);
    if (needsKitchen && !ops.has_kitchen) {
        return { ...ops, has_kitchen: true };
    }
    return ops;
}
function resolveOnSiteOperations(metadataJson, facilityMode) {
    const meta = parseBranchProfileMetadata(metadataJson);
    const fromMeta = meta.on_site_operations ?? {};
    const merged = {
        ...exports.EMPTY_ON_SITE_OPERATIONS,
        ...fromMeta,
        other: fromMeta.other ?? [],
    };
    const hasAny = Object.entries(merged).some(([k, v]) => k !== "other" && v === true);
    const sanitized = sanitizeOperationsForMode(facilityMode, merged);
    const withKitchen = ensureKitchenWithFoodService(sanitized, facilityMode);
    if (hasAny || !facilityMode)
        return withKitchen;
    return ensureKitchenWithFoodService(suggestedOnSiteOperations(facilityMode), facilityMode);
}
/** Drop operation flags that are not valid for this facility / company type. */
function sanitizeOperationsForMode(mode, ops) {
    const allowed = new Set(allowedOperationsForFacilityMode(mode));
    const next = { ...exports.EMPTY_ON_SITE_OPERATIONS, other: ops.other ?? [] };
    if (!allowed.size)
        return next;
    allowed.forEach((key) => {
        next[key] = ops[key];
    });
    return next;
}
function operationsHintForFacilityMode(mode) {
    switch (mode) {
        case "HOSPITALITY":
            return "Hotel — guest rooms, housekeeping, F&B outlets, and kitchen.";
        case "HOSPITAL":
            return "Clinical — wards, beds, and patient flow.";
        case "RESTAURANT":
            return "F&B — restaurant, bar, lounge, and kitchen.";
        case "ESTATE":
            return "Estate amenities — gym, pool, retail/supermarket, conference, and community spaces.";
        default:
            return "Operations available for your company type.";
    }
}
function resolveOperationPolicy(metadataJson) {
    const meta = parseBranchProfileMetadata(metadataJson);
    return {
        ...exports.DEFAULT_OPERATION_POLICY,
        ...meta.operation_policy,
    };
}
/** Suggested toggles when nothing is saved yet — not persisted until user saves. */
function suggestedOnSiteOperations(mode) {
    const base = { ...exports.EMPTY_ON_SITE_OPERATIONS, other: [] };
    switch (mode) {
        case "HOSPITALITY":
            return { ...base, has_hotel: true };
        case "RESTAURANT":
            return { ...base, has_restaurant: true, has_kitchen: true };
        case "HOSPITAL":
            return { ...base, has_clinical: true };
        case "ESTATE":
            return base;
        default:
            return base;
    }
}
function buildBranchProfileMetadataJson(options) {
    const existing = parseBranchProfileMetadata(options.existingJson);
    const ops = { ...options.onSiteOperations };
    const other = (ops.other ?? []).filter(Boolean);
    const payload = {
        ...existing,
        on_site_operations: {
            has_hotel: ops.has_hotel,
            has_restaurant: ops.has_restaurant,
            has_bar: ops.has_bar,
            has_lounge: ops.has_lounge,
            has_kitchen: ops.has_kitchen,
            has_spa: ops.has_spa,
            has_gym: ops.has_gym,
            has_pool: ops.has_pool,
            has_conference_rooms: ops.has_conference_rooms,
            has_supermarket: ops.has_supermarket,
            has_clinical: ops.has_clinical,
            ...(other.length ? { other } : {}),
        },
        operation_policy: { ...options.operationPolicy },
    };
    if ("occupancyAnchor" in options) {
        if (options.occupancyAnchor?.node_type?.trim()) {
            payload.occupancy_anchor = {
                node_type: options.occupancyAnchor.node_type.trim().toUpperCase(),
            };
        }
        else {
            delete payload.occupancy_anchor;
        }
    }
    if ("diningOccupancyAnchor" in options) {
        const dining = { ...(payload.dining ?? {}) };
        if (options.diningOccupancyAnchor?.node_type?.trim()) {
            dining.occupancy_anchor = {
                node_type: options.diningOccupancyAnchor.node_type.trim().toUpperCase(),
            };
            payload.dining = dining;
        }
        else {
            delete dining.occupancy_anchor;
            if (Object.keys(dining).length === 0) {
                delete payload.dining;
            }
            else {
                payload.dining = dining;
            }
        }
    }
    return JSON.stringify(payload);
}
/** Operations a branch may declare for each facility / company layout type. */
exports.OPERATIONS_BY_FACILITY_MODE = {
    HOSPITAL: ["has_clinical", "has_spa"],
    HOSPITALITY: [
        "has_hotel",
        "has_restaurant",
        "has_bar",
        "has_lounge",
        "has_kitchen",
        "has_spa",
        "has_gym",
        "has_pool",
    ],
    RESTAURANT: ["has_restaurant", "has_bar", "has_lounge", "has_kitchen"],
    ESTATE: [
        "has_gym",
        "has_pool",
        "has_spa",
        "has_supermarket",
        "has_conference_rooms",
    ],
};
function allowedOperationsForFacilityMode(mode) {
    if (!mode || mode === "GENERAL")
        return [];
    return exports.OPERATIONS_BY_FACILITY_MODE[mode] ?? [];
}
function operationAllowedForFacilityMode(mode, key) {
    return allowedOperationsForFacilityMode(mode).includes(key);
}
function countEnabledOperations(ops) {
    return Object.keys(exports.EMPTY_ON_SITE_OPERATIONS).filter((k) => ops[k]).length;
}
/** Map branch wizard facility toggles to on-site operations metadata. */
function branchWizardTypeToOnSiteOperations(input) {
    const ops = {
        ...exports.EMPTY_ON_SITE_OPERATIONS,
        has_hotel: !!input.has_hotel,
        has_restaurant: !!input.has_restaurant,
        has_spa: !!input.has_spa,
        has_gym: !!input.has_gym,
        has_pool: !!input.has_pool,
        has_conference_rooms: !!input.has_conference_rooms,
        other: (input.other_facilities ?? []).filter(Boolean),
    };
    return ensureKitchenWithFoodService(ops);
}
class FacilityBranchMetadataHelper {
}
exports.FacilityBranchMetadataHelper = FacilityBranchMetadataHelper;
FacilityBranchMetadataHelper.OCCUPIABLE_NODE_TYPES = exports.OCCUPIABLE_NODE_TYPES;
FacilityBranchMetadataHelper.EMPTY_ON_SITE_OPERATIONS = exports.EMPTY_ON_SITE_OPERATIONS;
FacilityBranchMetadataHelper.DEFAULT_OPERATION_POLICY = exports.DEFAULT_OPERATION_POLICY;
FacilityBranchMetadataHelper.OPERATIONS_BY_FACILITY_MODE = exports.OPERATIONS_BY_FACILITY_MODE;
FacilityBranchMetadataHelper.defaultOccupancyAnchorForMode = defaultOccupancyAnchorForMode;
FacilityBranchMetadataHelper.pickOccupancyAnchor = pickOccupancyAnchor;
FacilityBranchMetadataHelper.needsDiningHierarchy = needsDiningHierarchy;
FacilityBranchMetadataHelper.getDiningOccupancyAnchor = getDiningOccupancyAnchor;
FacilityBranchMetadataHelper.parsePublicListingMetadata = parsePublicListingMetadata;
FacilityBranchMetadataHelper.mergePublicListingMetadata = mergePublicListingMetadata;
FacilityBranchMetadataHelper.parseBranchProfileMetadata = parseBranchProfileMetadata;
FacilityBranchMetadataHelper.ensureKitchenWithFoodService = ensureKitchenWithFoodService;
FacilityBranchMetadataHelper.resolveOnSiteOperations = resolveOnSiteOperations;
FacilityBranchMetadataHelper.sanitizeOperationsForMode = sanitizeOperationsForMode;
FacilityBranchMetadataHelper.operationsHintForFacilityMode = operationsHintForFacilityMode;
FacilityBranchMetadataHelper.resolveOperationPolicy = resolveOperationPolicy;
FacilityBranchMetadataHelper.suggestedOnSiteOperations = suggestedOnSiteOperations;
FacilityBranchMetadataHelper.buildBranchProfileMetadataJson = buildBranchProfileMetadataJson;
FacilityBranchMetadataHelper.allowedOperationsForFacilityMode = allowedOperationsForFacilityMode;
FacilityBranchMetadataHelper.operationAllowedForFacilityMode = operationAllowedForFacilityMode;
FacilityBranchMetadataHelper.countEnabledOperations = countEnabledOperations;
FacilityBranchMetadataHelper.branchWizardTypeToOnSiteOperations = branchWizardTypeToOnSiteOperations;
//# sourceMappingURL=facilityBranchMetadata.js.map