"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OCCUPIABLE_FACILITY_NODE_TYPES = void 0;
exports.normalizeFacilityAssetKind = normalizeFacilityAssetKind;
exports.isEnumMember = isEnumMember;
exports.coerceEnumValue = coerceEnumValue;
exports.nodeTypeToAssetKind = nodeTypeToAssetKind;
exports.isOccupiableFacilityNodeType = isOccupiableFacilityNodeType;
exports.defaultFacilityAssetCapacity = defaultFacilityAssetCapacity;
exports.formatFacilityAssetKindLabel = formatFacilityAssetKindLabel;
exports.formatEnumOptionLabel = formatEnumOptionLabel;
exports.enumSelectOptions = enumSelectOptions;
exports.normalizeFacilityNodeType = normalizeFacilityNodeType;
exports.normalizeSpaceUsage = normalizeSpaceUsage;
exports.facilityNodeTypeLabel = facilityNodeTypeLabel;
const facility_enums_1 = require("./facility-enums");
/** Node types that receive a 1:1 occupancy asset profile. */
exports.OCCUPIABLE_FACILITY_NODE_TYPES = [
    facility_enums_1.FACILITY_NODE_TYPE_ENUM.BED,
    facility_enums_1.FACILITY_NODE_TYPE_ENUM.ROOM,
    facility_enums_1.FACILITY_NODE_TYPE_ENUM.TABLE,
    facility_enums_1.FACILITY_NODE_TYPE_ENUM.CHAIR,
    facility_enums_1.FACILITY_NODE_TYPE_ENUM.HOUSE,
    facility_enums_1.FACILITY_NODE_TYPE_ENUM.UNIT,
    facility_enums_1.FACILITY_NODE_TYPE_ENUM.SECTION,
];
const NODE_TYPE_TO_ASSET_KIND = {
    [facility_enums_1.FACILITY_NODE_TYPE_ENUM.BED]: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_BED,
    [facility_enums_1.FACILITY_NODE_TYPE_ENUM.ROOM]: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_ROOM,
    [facility_enums_1.FACILITY_NODE_TYPE_ENUM.TABLE]: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_TABLE,
    [facility_enums_1.FACILITY_NODE_TYPE_ENUM.CHAIR]: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_CHAIR,
    [facility_enums_1.FACILITY_NODE_TYPE_ENUM.HOUSE]: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_HOUSE,
    [facility_enums_1.FACILITY_NODE_TYPE_ENUM.UNIT]: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_UNIT,
    [facility_enums_1.FACILITY_NODE_TYPE_ENUM.SECTION]: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_SECTION,
};
/** Proto FacilityAssetKind numeric values → string enum (facility.proto). */
const FACILITY_ASSET_KIND_BY_NUMBER = {
    0: facility_enums_1.FACILITY_ASSET_KIND_ENUM.FACILITY_ASSET_KIND_UNSPECIFIED,
    1: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_BED,
    2: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_ROOM,
    3: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_TABLE,
    4: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_HOUSE,
    5: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_UNIT,
    6: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_SECTION,
    7: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_CHAIR,
};
/** Normalize API/proto asset kind (number, "1", ASSET_KIND_BED) to string enum. */
function normalizeFacilityAssetKind(value) {
    if (value == null || value === "")
        return "";
    if (typeof value === "number" && Number.isFinite(value)) {
        return FACILITY_ASSET_KIND_BY_NUMBER[value] ?? "";
    }
    const raw = String(value).trim();
    const asNum = Number(raw);
    if (raw !== "" && !Number.isNaN(asNum) && String(asNum) === raw) {
        return FACILITY_ASSET_KIND_BY_NUMBER[asNum] ?? "";
    }
    return coerceEnumValue(facility_enums_1.FACILITY_ASSET_KIND_ENUM, raw, "");
}
function isEnumMember(enumObj, value) {
    if (value == null)
        return false;
    const s = String(value);
    return Object.values(enumObj).includes(s);
}
/** Parse unknown JSON value to an enum member, or return fallback (often ""). */
function coerceEnumValue(enumObj, raw, fallback = "") {
    if (raw == null || raw === "")
        return fallback;
    const s = String(raw).trim();
    return isEnumMember(enumObj, s) ? s : fallback;
}
function nodeTypeToAssetKind(nodeType) {
    if (!nodeType)
        return null;
    const kind = NODE_TYPE_TO_ASSET_KIND[nodeType];
    return kind ?? null;
}
function isOccupiableFacilityNodeType(nodeType) {
    if (!nodeType)
        return false;
    return exports.OCCUPIABLE_FACILITY_NODE_TYPES.includes(nodeType);
}
/** Default capacity_max when creating an occupiable asset (mirrors FacilityAssetRules.cs). */
function defaultFacilityAssetCapacity(nodeType, facilityMode = facility_enums_1.FACILITY_MODE_ENUM.GENERAL) {
    switch (nodeType) {
        case facility_enums_1.FACILITY_NODE_TYPE_ENUM.BED:
            return 1;
        case facility_enums_1.FACILITY_NODE_TYPE_ENUM.TABLE:
            return 4;
        case facility_enums_1.FACILITY_NODE_TYPE_ENUM.CHAIR:
            return 1;
        case facility_enums_1.FACILITY_NODE_TYPE_ENUM.ROOM:
            return facilityMode === facility_enums_1.FACILITY_MODE_ENUM.HOSPITAL ? 1 : 2;
        case facility_enums_1.FACILITY_NODE_TYPE_ENUM.HOUSE:
            return facilityMode === facility_enums_1.FACILITY_MODE_ENUM.ESTATE ? 6 : 1;
        case facility_enums_1.FACILITY_NODE_TYPE_ENUM.UNIT:
            return facilityMode === facility_enums_1.FACILITY_MODE_ENUM.ESTATE ? 4 : 1;
        case facility_enums_1.FACILITY_NODE_TYPE_ENUM.SECTION:
            return 8;
        default:
            return 1;
    }
}
/** Human-readable asset kind label from ASSET_KIND_* value (string or proto number). */
function formatFacilityAssetKindLabel(assetKind) {
    const normalized = normalizeFacilityAssetKind(assetKind);
    if (!normalized ||
        normalized === facility_enums_1.FACILITY_ASSET_KIND_ENUM.FACILITY_ASSET_KIND_UNSPECIFIED) {
        return "asset";
    }
    return normalized
        .replace(/^ASSET_KIND_/, "")
        .replace(/_/g, " ")
        .toLowerCase();
}
/** Labels for enum option UIs (e.g. "icu" → "ICU"). */
function formatEnumOptionLabel(value) {
    if (!value)
        return "";
    return value
        .split("_")
        .map((part) => part.length <= 3 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}
function enumSelectOptions(enumObj) {
    return Object.values(enumObj).map((value) => ({
        value,
        label: formatEnumOptionLabel(value),
    }));
}
const FACILITY_NODE_TYPE_BY_NUMBER = {
    0: facility_enums_1.FACILITY_NODE_TYPE_ENUM.FACILITY_NODE_TYPE_UNSPECIFIED,
    1: facility_enums_1.FACILITY_NODE_TYPE_ENUM.BLOCK,
    2: facility_enums_1.FACILITY_NODE_TYPE_ENUM.BUILDING,
    3: facility_enums_1.FACILITY_NODE_TYPE_ENUM.WARD,
    4: facility_enums_1.FACILITY_NODE_TYPE_ENUM.UNIT,
    5: facility_enums_1.FACILITY_NODE_TYPE_ENUM.ROOM,
    6: facility_enums_1.FACILITY_NODE_TYPE_ENUM.BED,
    7: facility_enums_1.FACILITY_NODE_TYPE_ENUM.FLOOR,
    8: facility_enums_1.FACILITY_NODE_TYPE_ENUM.WING,
    9: facility_enums_1.FACILITY_NODE_TYPE_ENUM.HOUSE,
    10: facility_enums_1.FACILITY_NODE_TYPE_ENUM.TABLE,
    11: facility_enums_1.FACILITY_NODE_TYPE_ENUM.ZONE,
    12: facility_enums_1.FACILITY_NODE_TYPE_ENUM.SECTION,
    13: facility_enums_1.FACILITY_NODE_TYPE_ENUM.SITE,
    14: facility_enums_1.FACILITY_NODE_TYPE_ENUM.CHAIR,
};
const KNOWN_NODE_TYPES = new Set(Object.values(facility_enums_1.FACILITY_NODE_TYPE_ENUM));
/** Normalize API/proto node type (number, "6", BED) to the string enum. */
function normalizeFacilityNodeType(value) {
    if (value === undefined || value === null || value === "") {
        return facility_enums_1.FACILITY_NODE_TYPE_ENUM.FACILITY_NODE_TYPE_UNSPECIFIED;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        return (FACILITY_NODE_TYPE_BY_NUMBER[value] ??
            facility_enums_1.FACILITY_NODE_TYPE_ENUM.FACILITY_NODE_TYPE_UNSPECIFIED);
    }
    const raw = String(value).trim();
    const asNum = Number(raw);
    if (raw !== "" && !Number.isNaN(asNum) && String(asNum) === raw) {
        return (FACILITY_NODE_TYPE_BY_NUMBER[asNum] ??
            facility_enums_1.FACILITY_NODE_TYPE_ENUM.FACILITY_NODE_TYPE_UNSPECIFIED);
    }
    const upper = raw.toUpperCase();
    if (KNOWN_NODE_TYPES.has(upper))
        return upper;
    return facility_enums_1.FACILITY_NODE_TYPE_ENUM.FACILITY_NODE_TYPE_UNSPECIFIED;
}
/** Normalize API/proto space_usage (number or string) to the string enum. */
function normalizeSpaceUsage(raw) {
    if (raw === undefined || raw === null || raw === "")
        return "UNSPECIFIED";
    if (typeof raw === "number") {
        switch (raw) {
            case 1:
                return "BOOKABLE";
            case 2:
                return "DEPARTMENT";
            case 3:
                return "OPERATIONAL";
            default:
                return "UNSPECIFIED";
        }
    }
    const u = String(raw).trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (u === "1" || u.includes("BOOKABLE"))
        return "BOOKABLE";
    if (u === "2" || u.includes("DEPARTMENT"))
        return "DEPARTMENT";
    if (u === "3" || u.includes("OPERATIONAL"))
        return "OPERATIONAL";
    return "UNSPECIFIED";
}
/** Default display label for a node type (Room, Bed, …). */
function facilityNodeTypeLabel(nodeType) {
    const key = normalizeFacilityNodeType(nodeType);
    if (key === facility_enums_1.FACILITY_NODE_TYPE_ENUM.FACILITY_NODE_TYPE_UNSPECIFIED) {
        return "Location";
    }
    return formatEnumOptionLabel(key);
}
//# sourceMappingURL=facility-helpers.js.map