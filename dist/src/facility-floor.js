"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityFloorHelper = void 0;
exports.isFloorNodeType = isFloorNodeType;
exports.getFloorMetadata = getFloorMetadata;
exports.defaultFloorDisplayName = defaultFloorDisplayName;
exports.nextFloorIndexFromSiblings = nextFloorIndexFromSiblings;
exports.sortNodesByFloorIndex = sortNodesByFloorIndex;
exports.buildFloorMetadataPatch = buildFloorMetadataPatch;
exports.getSpatialLayoutHint = getSpatialLayoutHint;
exports.formatFloorSummary = formatFloorSummary;
const facility_helpers_1 = require("./facility-helpers");
const facility_node_metadata_1 = require("./facility-node-metadata");
const ORDINAL_FLOOR_NAMES = [
    "Ground floor",
    "First floor",
    "Second floor",
    "Third floor",
    "Fourth floor",
    "Fifth floor",
];
function isFloorNodeType(nodeType) {
    return (0, facility_helpers_1.normalizeFacilityNodeType)(nodeType) === "FLOOR";
}
function getFloorMetadata(node) {
    const meta = (0, facility_node_metadata_1.parseFacilityMetadata)(node.metadata_json);
    const floor = meta.floor;
    if (!floor || typeof floor.floor_index !== "number")
        return undefined;
    if (!Number.isFinite(floor.floor_index) || floor.floor_index < 0) {
        return undefined;
    }
    return {
        floor_index: Math.floor(floor.floor_index),
        floor_label: floor.floor_label?.trim() || undefined,
    };
}
/** Default display name for a new floor at the given index. */
function defaultFloorDisplayName(floorIndex) {
    if (floorIndex >= 0 && floorIndex < ORDINAL_FLOOR_NAMES.length) {
        return ORDINAL_FLOOR_NAMES[floorIndex];
    }
    return `Level ${floorIndex}`;
}
/** Next index after existing floor siblings (by metadata, then count). */
function nextFloorIndexFromSiblings(siblings) {
    const floors = siblings.filter((n) => isFloorNodeType(n.node_level?.node_type ?? n.node_type));
    if (floors.length === 0)
        return 0;
    const indices = floors
        .map((n) => getFloorMetadata(n)?.floor_index)
        .filter((i) => typeof i === "number");
    if (indices.length > 0) {
        return Math.max(...indices) + 1;
    }
    return floors.length;
}
function sortNodesByFloorIndex(nodes) {
    if (!nodes.some((n) => isFloorNodeType(n.node_level?.node_type ?? n.node_type))) {
        return nodes;
    }
    return [...nodes].sort((a, b) => {
        const ia = getFloorMetadata(a)?.floor_index;
        const ib = getFloorMetadata(b)?.floor_index;
        if (ia != null && ib != null && ia !== ib)
            return ia - ib;
        if (ia != null && ib == null)
            return -1;
        if (ia == null && ib != null)
            return 1;
        return (a.name ?? "").localeCompare(b.name ?? "", undefined, { sensitivity: "base" });
    });
}
function buildFloorMetadataPatch(floorIndex, displayName) {
    return {
        floor: {
            floor_index: floorIndex,
            floor_label: displayName.trim() || defaultFloorDisplayName(floorIndex),
        },
    };
}
/** UI copy for spatial layout / plan vs hierarchy. */
function getSpatialLayoutHint(params) {
    const { currentContainerType, displayedNodes, viewMode } = params;
    const container = (0, facility_helpers_1.normalizeFacilityNodeType)(currentContainerType);
    const childTypes = displayedNodes.map((n) => (0, facility_helpers_1.normalizeFacilityNodeType)(n.node_level?.node_type ?? n.node_type));
    const allFloors = displayedNodes.length > 0 && childTypes.every((t) => t === "FLOOR");
    if (allFloors) {
        if (viewMode === "plan") {
            return {
                variant: "warn",
                title: "Floors are not placed on the 2D plan",
                body: "Open a floor in 3D explore (or the tree), then switch to 2D plan to lay out rooms and beds on that floor only.",
            };
        }
        return {
            title: "Floors stacked in 3D",
            body: "Ground floor sits at the bottom; higher floor_index levels stack upward like a building. Double-click a floor to open its rooms — each floor has its own 2D plan.",
        };
    }
    if (container === "FLOOR") {
        if (viewMode === "plan") {
            return {
                title: "Plan for this floor only",
                body: "Drag locations on the compass grid for this floor. Other floors use their own plan when you open them — not the same x/z coordinates.",
            };
        }
        return {
            title: "Inside a floor",
            body: "3D shows siblings on this floor only. Use 2D plan to position rooms horizontally; go up in the breadcrumb to see floors stacked as a building.",
        };
    }
    if (viewMode === "plan" && displayedNodes.length > 0) {
        return {
            title: "2D plan at this level",
            body: "Positions apply to locations shown here only. Parent levels (e.g. building or floor) are navigated via the breadcrumb, not by grid placement.",
        };
    }
    return null;
}
function formatFloorSummary(node) {
    const nodeType = node.node_level?.node_type ?? node.node_type;
    const meta = getFloorMetadata(node);
    if (!meta && !isFloorNodeType(nodeType))
        return null;
    const name = node.name?.trim();
    if (meta) {
        const label = meta.floor_label ?? defaultFloorDisplayName(meta.floor_index);
        if (name && name.toLowerCase() !== label.toLowerCase()) {
            return `${label} · #${meta.floor_index}`;
        }
        return `${label} (#${meta.floor_index})`;
    }
    return name ?? null;
}
class FacilityFloorHelper {
}
exports.FacilityFloorHelper = FacilityFloorHelper;
FacilityFloorHelper.isFloorNodeType = isFloorNodeType;
FacilityFloorHelper.getFloorMetadata = getFloorMetadata;
FacilityFloorHelper.defaultFloorDisplayName = defaultFloorDisplayName;
FacilityFloorHelper.nextFloorIndexFromSiblings = nextFloorIndexFromSiblings;
FacilityFloorHelper.sortNodesByFloorIndex = sortNodesByFloorIndex;
FacilityFloorHelper.buildFloorMetadataPatch = buildFloorMetadataPatch;
FacilityFloorHelper.getSpatialLayoutHint = getSpatialLayoutHint;
FacilityFloorHelper.formatFloorSummary = formatFloorSummary;
//# sourceMappingURL=facility-floor.js.map