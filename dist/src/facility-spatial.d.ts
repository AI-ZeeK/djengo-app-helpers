/** Compass facing stored on facility_nodes.orientation */
export type SpatialOrientation = "SPATIAL_ORIENTATION_UNSPECIFIED" | "NORTH" | "EAST" | "SOUTH" | "WEST" | "UNSPECIFIED";
import type { FacilityNodeLike } from "./facility-types";
/** 2D plan grid placement — persisted in spatial_position_json */
export interface FacilitySpatialPosition {
    grid_x: number;
    grid_z: number;
    rotation_deg?: number;
    /** True once placed on the 2D plan (vs auto-layout fallback). */
    placed?: boolean;
}
/** API may return enum number, SCREAMING_SNAKE, or prefixed proto name. */
export declare function normalizeSpatialOrientation(orientation?: string | number | null): SpatialOrientation;
export declare function spatialOrientationLabel(orientation?: string | number | null): string | null;
export declare function parseFacilitySpatialPosition(json?: string | null): FacilitySpatialPosition | null;
export declare function isSpatialPlaced(json?: string | null, position?: FacilitySpatialPosition | null): boolean;
export declare function serializeFacilitySpatialPosition(pos: FacilitySpatialPosition): string;
/** Pixels per grid cell on the 2D plan only (3D uses PLAN_CELL_WORLD).
 * Larger = roomier Lego slots for cards; stored grid_x/grid_z stay unchanged. */
export declare const PLAN_CELL_PX = 80;
/**
 * World units per grid cell in 3D. Same grid indices as 2D; lower value = closer blocks.
 * Keep PLAN_NODE_WORLD_FOOTPRINT near ~0.85–0.9 of this so aisles stay narrow in 3D.
 */
export declare const PLAN_CELL_WORLD = 3;
/** Plan node card size — inset inside one 2D cell (Lego stud), not full bleed. */
export declare const PLAN_NODE_W: number;
export declare const PLAN_NODE_H: number;
/** Width/depth of 3D block meshes — most of one cell, narrow aisle to neighbours. */
export declare const PLAN_NODE_WORLD_FOOTPRINT: number;
export type FacilityNodeWorldSize = {
    footprint: number;
    height: number;
};
/** Default square footprint — median-sized node at this level uses this (grid-safe). */
export declare const PLAN_NODE_DEFAULT_WORLD_FOOTPRINT: number;
/**
 * Per-node 3D box sizes: default footprint at the median; others scale by m² / edge
 * length vs that median. Single-node levels stay at default. Sizes stay within grid cell.
 */
export declare function computeLevelNodeWorldSizes<T extends FacilityNodeLike>(nodes: T[]): Map<string, FacilityNodeWorldSize>;
/** Vertical size of 3D blocks by level type (scales with PLAN_CELL_WORLD). */
export declare function planNodeWorldHeight(nodeType: string | undefined): number;
/**
 * Shared campus axes (2D plan and 3D ground plane):
 * +X = East, +Z = South, North = −Z, West = −X.
 * Grid index (gx, gz) is the cell; world/plan center is (gx + 0.5, gz + 0.5).
 */
export declare function planCellCenter(gridX: number, gridZ: number): {
    x: number;
    z: number;
};
export declare function planToFlowPosition(gridX: number, gridZ: number): {
    x: number;
    y: number;
};
/**
 * Nearest cell for a React Flow node position (top-left), using the card center.
 * Same integer indices as 3D — only the 2D pixel scale differs.
 */
export declare function flowToPlanGrid(x: number, y: number): {
    grid_x: number;
    grid_z: number;
};
/** Snap a flow top-left so the card centers on the nearest Lego cell. */
export declare function snapFlowPositionToCell(x: number, y: number): {
    x: number;
    y: number;
    grid_x: number;
    grid_z: number;
};
/** Compass sector from grid position (North = smaller grid_z, East = larger grid_x). */
export declare function compassSectorFromGrid(gridX: number, gridZ: number, originX?: number, originZ?: number): string;
export declare function formatPlanGridCell(gridX: number, gridZ: number): string;
export type ViewBearing = {
    /** Horizontal view yaw (0 = looking toward world north / −Z). */
    yawRad: number;
    label: string;
    /** Rotate compass dial so N tracks world north on screen. */
    dialRotationDeg: number;
};
/** Camera look direction on the XZ ground plane (Three.js Y-up, north = −Z). */
export declare function viewBearingFromLookDirection(lookX: number, lookZ: number): ViewBearing;
export declare function planToWorldPosition(gridX: number, gridZ: number, 
/** Bottom of the block (floors stack by raising this). */
baseY?: number): [number, number, number];
/** Vertical gap between stacked floor slabs in world units. */
export declare const FLOOR_STACK_GAP: number;
/**
 * World Y for the bottom of a floor slab when siblings are stacked in 3D.
 * `storyHeight` is the slab thickness; index 0 sits on the ground.
 */
export declare function floorStackBaseY(floorIndex: number, storyHeight: number, gap?: number): number;
export declare const ORIENTATION_OPTIONS: {
    value: SpatialOrientation;
    label: string;
    deg: number;
}[];
export declare function orientationToApi(orientation: SpatialOrientation): string;
/** Class facade for spatial layout helpers. */
export declare class FacilitySpatialHelper {
    static readonly PLAN_CELL_PX = 80;
    static readonly PLAN_CELL_WORLD = 3;
    static readonly PLAN_NODE_W: number;
    static readonly PLAN_NODE_H: number;
    static readonly PLAN_NODE_WORLD_FOOTPRINT: number;
    static readonly PLAN_NODE_DEFAULT_WORLD_FOOTPRINT: number;
    static normalizeSpatialOrientation: typeof normalizeSpatialOrientation;
    static spatialOrientationLabel: typeof spatialOrientationLabel;
    static parseFacilitySpatialPosition: typeof parseFacilitySpatialPosition;
    static isSpatialPlaced: typeof isSpatialPlaced;
    static serializeFacilitySpatialPosition: typeof serializeFacilitySpatialPosition;
    static computeLevelNodeWorldSizes: typeof computeLevelNodeWorldSizes;
    static planNodeWorldHeight: typeof planNodeWorldHeight;
    static planCellCenter: typeof planCellCenter;
    static planToFlowPosition: typeof planToFlowPosition;
    static flowToPlanGrid: typeof flowToPlanGrid;
    static snapFlowPositionToCell: typeof snapFlowPositionToCell;
    static compassSectorFromGrid: typeof compassSectorFromGrid;
    static formatPlanGridCell: typeof formatPlanGridCell;
    static viewBearingFromLookDirection: typeof viewBearingFromLookDirection;
    static planToWorldPosition: typeof planToWorldPosition;
    static floorStackBaseY: typeof floorStackBaseY;
    static orientationToApi: typeof orientationToApi;
    static readonly FLOOR_STACK_GAP: number;
    static readonly ORIENTATION_OPTIONS: {
        value: SpatialOrientation;
        label: string;
        deg: number;
    }[];
}
//# sourceMappingURL=facility-spatial.d.ts.map