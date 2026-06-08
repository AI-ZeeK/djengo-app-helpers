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
const facility_enums_1 = require("./facility-enums");
/** Node types that receive a 1:1 occupancy asset profile. */
exports.OCCUPIABLE_FACILITY_NODE_TYPES = [
    facility_enums_1.FACILITY_NODE_TYPE_ENUM.BED,
    facility_enums_1.FACILITY_NODE_TYPE_ENUM.ROOM,
    facility_enums_1.FACILITY_NODE_TYPE_ENUM.TABLE,
    facility_enums_1.FACILITY_NODE_TYPE_ENUM.HOUSE,
    facility_enums_1.FACILITY_NODE_TYPE_ENUM.UNIT,
    facility_enums_1.FACILITY_NODE_TYPE_ENUM.SECTION,
];
const NODE_TYPE_TO_ASSET_KIND = {
    [facility_enums_1.FACILITY_NODE_TYPE_ENUM.BED]: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_BED,
    [facility_enums_1.FACILITY_NODE_TYPE_ENUM.ROOM]: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_ROOM,
    [facility_enums_1.FACILITY_NODE_TYPE_ENUM.TABLE]: facility_enums_1.FACILITY_ASSET_KIND_ENUM.ASSET_KIND_TABLE,
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
//# sourceMappingURL=facility-helpers.js.map