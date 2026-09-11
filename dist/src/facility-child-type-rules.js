"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityChildTypeHelper = exports.ALLOWED_CHILDREN_BY_PARENT = void 0;
exports.getAllowedChildLevelTypesForMode = getAllowedChildLevelTypesForMode;
exports.isAllowedChildLevelTypeForMode = isAllowedChildLevelTypeForMode;
exports.getAllowedChildTypesUnderParent = getAllowedChildTypesUnderParent;
exports.isAllowedChildTypeUnderParent = isAllowedChildTypeUnderParent;
const facility_helpers_1 = require("./facility-helpers");
/**
 * Which node types may be placed directly under a given parent type.
 * Floor contains wings/rooms — wing cannot contain floor.
 * House under floor is estate-only (see getAllowedChildLevelTypesForMode).
 */
exports.ALLOWED_CHILDREN_BY_PARENT = {
    SITE: ["BLOCK", "BUILDING", "ZONE", "HOUSE"],
    BLOCK: ["BUILDING", "WING", "WARD", "FLOOR", "ZONE", "SECTION", "HOUSE"],
    BUILDING: ["FLOOR", "WING", "WARD", "UNIT", "ROOM", "ZONE", "SECTION"],
    FLOOR: ["WING", "WARD", "UNIT", "ROOM", "SECTION", "ZONE"],
    WING: ["WARD", "UNIT", "ROOM", "SECTION"],
    WARD: ["ROOM", "UNIT", "SECTION"],
    UNIT: ["ROOM", "SECTION"],
    ROOM: ["BED", "TABLE", "SECTION"],
    SECTION: ["ROOM", "UNIT", "BED", "TABLE", "CHAIR"],
    ZONE: ["BLOCK", "BUILDING", "WING", "WARD", "SECTION", "ROOM", "TABLE", "CHAIR"],
    HOUSE: ["FLOOR", "UNIT", "ROOM"],
    BED: [],
    TABLE: ["CHAIR"],
    CHAIR: [],
};
/** Types that may be added at branch root (no parent node). */
const ROOT_CHILD_TYPES = [
    "SITE",
    "BLOCK",
    "BUILDING",
    "ZONE",
    "HOUSE",
];
/**
 * Suggested next types under a parent. Hierarchy save no longer requires this
 * chain — operators can order levels however they need.
 */
function getAllowedChildLevelTypesForMode(mode, parent) {
    if (mode === "RESTAURANT") {
        switch (parent) {
            case "ZONE":
            case "SITE":
                // Prefer Zone → Table; Section kept for legacy dining layouts.
                return ["TABLE", "SECTION", "CHAIR"];
            case "SECTION":
                return ["TABLE", "CHAIR"];
            case "TABLE":
                return ["CHAIR"];
            default:
                return [];
        }
    }
    if (parent === "HOUSE" && mode === "ESTATE") {
        return [];
    }
    const base = [...(exports.ALLOWED_CHILDREN_BY_PARENT[parent] ?? [])];
    if (mode === "ESTATE") {
        if ((parent === "BUILDING" || parent === "FLOOR" || parent === "BLOCK") &&
            !base.includes("HOUSE")) {
            base.push("HOUSE");
        }
    }
    return base;
}
function isAllowedChildLevelTypeForMode(mode, parent, child) {
    return getAllowedChildLevelTypesForMode(mode, parent).includes(child);
}
function getAllowedChildTypesUnderParent(parentType) {
    if (!parentType)
        return [...ROOT_CHILD_TYPES];
    const parent = (0, facility_helpers_1.normalizeFacilityNodeType)(parentType);
    if (parent === "FACILITY_NODE_TYPE_UNSPECIFIED")
        return [...ROOT_CHILD_TYPES];
    return [...(exports.ALLOWED_CHILDREN_BY_PARENT[parent] ?? [])];
}
function isAllowedChildTypeUnderParent(parentType, childType) {
    const child = (0, facility_helpers_1.normalizeFacilityNodeType)(childType);
    if (child === "FACILITY_NODE_TYPE_UNSPECIFIED")
        return false;
    const allowed = getAllowedChildTypesUnderParent(parentType);
    return allowed.includes(child);
}
class FacilityChildTypeHelper {
}
exports.FacilityChildTypeHelper = FacilityChildTypeHelper;
FacilityChildTypeHelper.ALLOWED_CHILDREN_BY_PARENT = exports.ALLOWED_CHILDREN_BY_PARENT;
FacilityChildTypeHelper.getAllowedChildLevelTypesForMode = getAllowedChildLevelTypesForMode;
FacilityChildTypeHelper.isAllowedChildLevelTypeForMode = isAllowedChildLevelTypeForMode;
FacilityChildTypeHelper.getAllowedChildTypesUnderParent = getAllowedChildTypesUnderParent;
FacilityChildTypeHelper.isAllowedChildTypeUnderParent = isAllowedChildTypeUnderParent;
//# sourceMappingURL=facility-child-type-rules.js.map