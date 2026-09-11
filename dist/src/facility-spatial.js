"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilitySpatialHelper = exports.ORIENTATION_OPTIONS = exports.FLOOR_STACK_GAP = exports.PLAN_NODE_DEFAULT_WORLD_FOOTPRINT = exports.PLAN_NODE_WORLD_FOOTPRINT = exports.PLAN_NODE_H = exports.PLAN_NODE_W = exports.PLAN_CELL_WORLD = exports.PLAN_CELL_PX = void 0;
exports.normalizeSpatialOrientation = normalizeSpatialOrientation;
exports.spatialOrientationLabel = spatialOrientationLabel;
exports.parseFacilitySpatialPosition = parseFacilitySpatialPosition;
exports.isSpatialPlaced = isSpatialPlaced;
exports.serializeFacilitySpatialPosition = serializeFacilitySpatialPosition;
exports.computeLevelNodeWorldSizes = computeLevelNodeWorldSizes;
exports.planNodeWorldHeight = planNodeWorldHeight;
exports.planCellCenter = planCellCenter;
exports.planToFlowPosition = planToFlowPosition;
exports.flowToPlanGrid = flowToPlanGrid;
exports.snapFlowPositionToCell = snapFlowPositionToCell;
exports.compassSectorFromGrid = compassSectorFromGrid;
exports.formatPlanGridCell = formatPlanGridCell;
exports.viewBearingFromLookDirection = viewBearingFromLookDirection;
exports.planToWorldPosition = planToWorldPosition;
exports.floorStackBaseY = floorStackBaseY;
exports.orientationToApi = orientationToApi;
const facility_node_metadata_1 = require("./facility-node-metadata");
const ORIENTATION_LABELS = {
    NORTH: "North",
    EAST: "East",
    SOUTH: "South",
    WEST: "West",
};
/** Proto SpatialOrientation numeric values */
const ORIENTATION_BY_NUMBER = {
    0: "UNSPECIFIED",
    1: "NORTH",
    2: "EAST",
    3: "SOUTH",
    4: "WEST",
};
/** API may return enum number, SCREAMING_SNAKE, or prefixed proto name. */
function normalizeSpatialOrientation(orientation) {
    if (orientation === undefined || orientation === null || orientation === "") {
        return "UNSPECIFIED";
    }
    if (typeof orientation === "number") {
        return ORIENTATION_BY_NUMBER[orientation] ?? "UNSPECIFIED";
    }
    const raw = String(orientation).trim();
    const asNum = Number(raw);
    if (raw !== "" && !Number.isNaN(asNum) && ORIENTATION_BY_NUMBER[asNum]) {
        return ORIENTATION_BY_NUMBER[asNum];
    }
    const key = raw.replace(/^SPATIAL_ORIENTATION_/, "").toUpperCase();
    if (key === "NORTH" ||
        key === "EAST" ||
        key === "SOUTH" ||
        key === "WEST" ||
        key === "UNSPECIFIED") {
        return key;
    }
    return "UNSPECIFIED";
}
function spatialOrientationLabel(orientation) {
    const key = normalizeSpatialOrientation(orientation);
    if (key === "UNSPECIFIED")
        return null;
    return ORIENTATION_LABELS[key] ?? key;
}
function parseFacilitySpatialPosition(json) {
    if (!json?.trim())
        return null;
    try {
        const raw = JSON.parse(json);
        const gridX = typeof raw.grid_x === "number"
            ? raw.grid_x
            : typeof raw.x === "number"
                ? raw.x
                : null;
        const gridZ = typeof raw.grid_z === "number"
            ? raw.grid_z
            : typeof raw.z === "number"
                ? raw.z
                : null;
        if (gridX == null || gridZ == null)
            return null;
        return {
            grid_x: gridX,
            grid_z: gridZ,
            rotation_deg: typeof raw.rotation_deg === "number" ? raw.rotation_deg : undefined,
            placed: raw.placed === true,
        };
    }
    catch {
        return null;
    }
}
function isSpatialPlaced(json, position) {
    const pos = position ?? parseFacilitySpatialPosition(json);
    if (!pos)
        return false;
    return pos.placed === true;
}
function serializeFacilitySpatialPosition(pos) {
    return JSON.stringify({
        grid_x: Math.round(pos.grid_x),
        grid_z: Math.round(pos.grid_z),
        rotation_deg: Math.round(pos.rotation_deg ?? 0),
        placed: true,
    });
}
/** Pixels per grid cell on the 2D plan only (3D uses PLAN_CELL_WORLD).
 * Larger = roomier Lego slots for cards; stored grid_x/grid_z stay unchanged. */
exports.PLAN_CELL_PX = 80;
/**
 * World units per grid cell in 3D. Same grid indices as 2D; lower value = closer blocks.
 * Keep PLAN_NODE_WORLD_FOOTPRINT near ~0.85–0.9 of this so aisles stay narrow in 3D.
 */
exports.PLAN_CELL_WORLD = 3;
/** Plan node card size — inset inside one 2D cell (Lego stud), not full bleed. */
exports.PLAN_NODE_W = Math.round(exports.PLAN_CELL_PX * 0.78);
exports.PLAN_NODE_H = Math.round(exports.PLAN_CELL_PX * 0.72);
/** Width/depth of 3D block meshes — most of one cell, narrow aisle to neighbours. */
exports.PLAN_NODE_WORLD_FOOTPRINT = exports.PLAN_CELL_WORLD * 0.9;
/** Default square footprint — median-sized node at this level uses this (grid-safe). */
exports.PLAN_NODE_DEFAULT_WORLD_FOOTPRINT = exports.PLAN_NODE_WORLD_FOOTPRINT;
const SIZE_SCALE_MIN = 0.58;
const SIZE_SCALE_MAX = 1.38;
/** Max block width/depth as fraction of one grid cell (avoids overlap). */
const MAX_FOOTPRINT_CELL_FRACTION = 0.92;
function medianOf(values) {
    if (values.length === 0)
        return 1;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
}
/**
 * Per-node 3D box sizes: default footprint at the median; others scale by m² / edge
 * length vs that median. Single-node levels stay at default. Sizes stay within grid cell.
 */
function computeLevelNodeWorldSizes(nodes) {
    const out = new Map();
    const defaultFootprint = exports.PLAN_NODE_DEFAULT_WORLD_FOOTPRINT;
    const maxFootprint = exports.PLAN_CELL_WORLD * MAX_FOOTPRINT_CELL_FRACTION;
    for (const node of nodes) {
        const id = node.facility_node_id ?? "";
        const nodeType = node.node_level?.node_type ?? node.node_type;
        out.set(id, {
            footprint: defaultFootprint,
            height: planNodeWorldHeight(nodeType),
        });
    }
    if (nodes.length <= 1)
        return out;
    const entries = nodes.map((node) => ({
        id: node.facility_node_id ?? "",
        metric: (0, facility_node_metadata_1.getNodeSpatialSizeMetric)(node),
        hasSpace: (0, facility_node_metadata_1.hasNodeSpaceData)(node),
        nodeType: node.node_level?.node_type ?? node.node_type,
    }));
    const metricsForMedian = entries.filter((e) => e.hasSpace).length >= 2
        ? entries.filter((e) => e.hasSpace).map((e) => e.metric)
        : entries.map((e) => e.metric);
    const medianMetric = Math.max(medianOf(metricsForMedian), 1e-6);
    for (const { id, metric, nodeType, hasSpace } of entries) {
        const baseHeight = planNodeWorldHeight(nodeType);
        if (!hasSpace && entries.filter((e) => e.hasSpace).length >= 2) {
            continue;
        }
        let scale = metric / medianMetric;
        scale = Math.min(SIZE_SCALE_MAX, Math.max(SIZE_SCALE_MIN, scale));
        const footprint = Math.min(defaultFootprint * scale, maxFootprint);
        const height = Math.min(baseHeight * scale, exports.PLAN_CELL_WORLD * 1.05);
        out.set(id, { footprint, height });
    }
    return out;
}
/** Vertical size of 3D blocks by level type (scales with PLAN_CELL_WORLD). */
function planNodeWorldHeight(nodeType) {
    switch (nodeType) {
        case "BLOCK":
            return exports.PLAN_CELL_WORLD * 0.78;
        case "BUILDING":
            return exports.PLAN_CELL_WORLD * 0.62;
        case "FLOOR":
            // Story slab — stacked in 3D by floor_index (see buildLayout).
            return exports.PLAN_CELL_WORLD * 0.48;
        default:
            return exports.PLAN_CELL_WORLD * 0.42;
    }
}
/**
 * Shared campus axes (2D plan and 3D ground plane):
 * +X = East, +Z = South, North = −Z, West = −X.
 * Grid index (gx, gz) is the cell; world/plan center is (gx + 0.5, gz + 0.5).
 */
function planCellCenter(gridX, gridZ) {
    return {
        x: (gridX + 0.5) * exports.PLAN_CELL_WORLD,
        z: (gridZ + 0.5) * exports.PLAN_CELL_WORLD,
    };
}
function planToFlowPosition(gridX, gridZ) {
    const cx = (gridX + 0.5) * exports.PLAN_CELL_PX;
    const cz = (gridZ + 0.5) * exports.PLAN_CELL_PX;
    return {
        x: cx - exports.PLAN_NODE_W / 2,
        y: cz - exports.PLAN_NODE_H / 2,
    };
}
/**
 * Nearest cell for a React Flow node position (top-left), using the card center.
 * Same integer indices as 3D — only the 2D pixel scale differs.
 */
function flowToPlanGrid(x, y) {
    const cx = x + exports.PLAN_NODE_W / 2;
    const cz = y + exports.PLAN_NODE_H / 2;
    return {
        grid_x: Math.floor(cx / exports.PLAN_CELL_PX),
        grid_z: Math.floor(cz / exports.PLAN_CELL_PX),
    };
}
/** Snap a flow top-left so the card centers on the nearest Lego cell. */
function snapFlowPositionToCell(x, y) {
    const { grid_x, grid_z } = flowToPlanGrid(x, y);
    const pos = planToFlowPosition(grid_x, grid_z);
    return { ...pos, grid_x, grid_z };
}
/** Compass sector from grid position (North = smaller grid_z, East = larger grid_x). */
function compassSectorFromGrid(gridX, gridZ, originX = 0, originZ = 0) {
    const dx = gridX - originX;
    const dz = gridZ - originZ;
    if (dx === 0 && dz === 0)
        return "Origin";
    const parts = [];
    if (dz < 0)
        parts.push("North");
    else if (dz > 0)
        parts.push("South");
    if (dx > 0)
        parts.push("East");
    else if (dx < 0)
        parts.push("West");
    return parts.join(" · ") || "Origin";
}
function formatPlanGridCell(gridX, gridZ) {
    return `(${gridX}, ${gridZ})`;
}
const VIEW_BEARING_LABELS = [
    "North",
    "North-East",
    "East",
    "South-East",
    "South",
    "South-West",
    "West",
    "North-West",
];
/** Camera look direction on the XZ ground plane (Three.js Y-up, north = −Z). */
function viewBearingFromLookDirection(lookX, lookZ) {
    const len = Math.hypot(lookX, lookZ);
    const x = len > 1e-6 ? lookX / len : 0;
    const z = len > 1e-6 ? lookZ / len : -1;
    const yawRad = Math.atan2(x, -z);
    const deg = ((yawRad * 180) / Math.PI + 360) % 360;
    const idx = Math.round(deg / 45) % 8;
    return {
        yawRad,
        label: VIEW_BEARING_LABELS[idx],
        dialRotationDeg: (-yawRad * 180) / Math.PI,
    };
}
function planToWorldPosition(gridX, gridZ, 
/** Bottom of the block (floors stack by raising this). */
baseY = 0) {
    const { x, z } = planCellCenter(gridX, gridZ);
    return [x, baseY, z];
}
/** Vertical gap between stacked floor slabs in world units. */
exports.FLOOR_STACK_GAP = exports.PLAN_CELL_WORLD * 0.06;
/**
 * World Y for the bottom of a floor slab when siblings are stacked in 3D.
 * `storyHeight` is the slab thickness; index 0 sits on the ground.
 */
function floorStackBaseY(floorIndex, storyHeight, gap = exports.FLOOR_STACK_GAP) {
    const i = Math.max(0, Math.floor(floorIndex));
    return i * (storyHeight + gap);
}
exports.ORIENTATION_OPTIONS = [
    { value: "NORTH", label: "North", deg: 0 },
    { value: "EAST", label: "East", deg: 90 },
    { value: "SOUTH", label: "South", deg: 180 },
    { value: "WEST", label: "West", deg: 270 },
];
function orientationToApi(orientation) {
    if (orientation === "UNSPECIFIED")
        return "SPATIAL_ORIENTATION_UNSPECIFIED";
    if (orientation.startsWith("SPATIAL_"))
        return orientation;
    return orientation;
}
/** Class facade for spatial layout helpers. */
class FacilitySpatialHelper {
}
exports.FacilitySpatialHelper = FacilitySpatialHelper;
FacilitySpatialHelper.PLAN_CELL_PX = exports.PLAN_CELL_PX;
FacilitySpatialHelper.PLAN_CELL_WORLD = exports.PLAN_CELL_WORLD;
FacilitySpatialHelper.PLAN_NODE_W = exports.PLAN_NODE_W;
FacilitySpatialHelper.PLAN_NODE_H = exports.PLAN_NODE_H;
FacilitySpatialHelper.PLAN_NODE_WORLD_FOOTPRINT = exports.PLAN_NODE_WORLD_FOOTPRINT;
FacilitySpatialHelper.PLAN_NODE_DEFAULT_WORLD_FOOTPRINT = exports.PLAN_NODE_DEFAULT_WORLD_FOOTPRINT;
FacilitySpatialHelper.normalizeSpatialOrientation = normalizeSpatialOrientation;
FacilitySpatialHelper.spatialOrientationLabel = spatialOrientationLabel;
FacilitySpatialHelper.parseFacilitySpatialPosition = parseFacilitySpatialPosition;
FacilitySpatialHelper.isSpatialPlaced = isSpatialPlaced;
FacilitySpatialHelper.serializeFacilitySpatialPosition = serializeFacilitySpatialPosition;
FacilitySpatialHelper.computeLevelNodeWorldSizes = computeLevelNodeWorldSizes;
FacilitySpatialHelper.planNodeWorldHeight = planNodeWorldHeight;
FacilitySpatialHelper.planCellCenter = planCellCenter;
FacilitySpatialHelper.planToFlowPosition = planToFlowPosition;
FacilitySpatialHelper.flowToPlanGrid = flowToPlanGrid;
FacilitySpatialHelper.snapFlowPositionToCell = snapFlowPositionToCell;
FacilitySpatialHelper.compassSectorFromGrid = compassSectorFromGrid;
FacilitySpatialHelper.formatPlanGridCell = formatPlanGridCell;
FacilitySpatialHelper.viewBearingFromLookDirection = viewBearingFromLookDirection;
FacilitySpatialHelper.planToWorldPosition = planToWorldPosition;
FacilitySpatialHelper.floorStackBaseY = floorStackBaseY;
FacilitySpatialHelper.orientationToApi = orientationToApi;
FacilitySpatialHelper.FLOOR_STACK_GAP = exports.FLOOR_STACK_GAP;
FacilitySpatialHelper.ORIENTATION_OPTIONS = exports.ORIENTATION_OPTIONS;
//# sourceMappingURL=facility-spatial.js.map