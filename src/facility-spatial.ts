/** Compass facing stored on facility_nodes.orientation */
export type SpatialOrientation =
  | "SPATIAL_ORIENTATION_UNSPECIFIED"
  | "NORTH"
  | "EAST"
  | "SOUTH"
  | "WEST"
  | "UNSPECIFIED";

import type { FacilityNodeLike } from "./facility-types";
import {
  getNodeSpatialSizeMetric,
  hasNodeSpaceData,
} from "./facility-node-metadata";

/** 2D plan grid placement — persisted in spatial_position_json */
export interface FacilitySpatialPosition {
  grid_x: number;
  grid_z: number;
  rotation_deg?: number;
  /** True once placed on the 2D plan (vs auto-layout fallback). */
  placed?: boolean;
}

const ORIENTATION_LABELS: Record<string, string> = {
  NORTH: "North",
  EAST: "East",
  SOUTH: "South",
  WEST: "West",
};

/** Proto SpatialOrientation numeric values */
const ORIENTATION_BY_NUMBER: Record<number, SpatialOrientation> = {
  0: "UNSPECIFIED",
  1: "NORTH",
  2: "EAST",
  3: "SOUTH",
  4: "WEST",
};

/** API may return enum number, SCREAMING_SNAKE, or prefixed proto name. */
export function normalizeSpatialOrientation(
  orientation?: string | number | null,
): SpatialOrientation {
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
  if (
    key === "NORTH" ||
    key === "EAST" ||
    key === "SOUTH" ||
    key === "WEST" ||
    key === "UNSPECIFIED"
  ) {
    return key as SpatialOrientation;
  }

  return "UNSPECIFIED";
}

export function spatialOrientationLabel(
  orientation?: string | number | null,
): string | null {
  const key = normalizeSpatialOrientation(orientation);
  if (key === "UNSPECIFIED") return null;
  return ORIENTATION_LABELS[key] ?? key;
}

export function parseFacilitySpatialPosition(
  json?: string | null,
): FacilitySpatialPosition | null {
  if (!json?.trim()) return null;
  try {
    const raw = JSON.parse(json) as Record<string, unknown>;
    const gridX =
      typeof raw.grid_x === "number"
        ? raw.grid_x
        : typeof raw.x === "number"
          ? raw.x
          : null;
    const gridZ =
      typeof raw.grid_z === "number"
        ? raw.grid_z
        : typeof raw.z === "number"
          ? raw.z
          : null;
    if (gridX == null || gridZ == null) return null;
    return {
      grid_x: gridX,
      grid_z: gridZ,
      rotation_deg:
        typeof raw.rotation_deg === "number" ? raw.rotation_deg : undefined,
      placed: raw.placed === true,
    };
  } catch {
    return null;
  }
}

export function isSpatialPlaced(
  json?: string | null,
  position?: FacilitySpatialPosition | null,
): boolean {
  const pos = position ?? parseFacilitySpatialPosition(json);
  if (!pos) return false;
  return pos.placed === true;
}

export function serializeFacilitySpatialPosition(
  pos: FacilitySpatialPosition,
): string {
  return JSON.stringify({
    grid_x: Math.round(pos.grid_x),
    grid_z: Math.round(pos.grid_z),
    rotation_deg: Math.round(pos.rotation_deg ?? 0),
    placed: true,
  });
}

/** Pixels per grid cell on the 2D plan only (3D uses PLAN_CELL_WORLD).
 * Larger = roomier Lego slots for cards; stored grid_x/grid_z stay unchanged. */
export const PLAN_CELL_PX = 80;

/**
 * World units per grid cell in 3D. Same grid indices as 2D; lower value = closer blocks.
 * Keep PLAN_NODE_WORLD_FOOTPRINT near ~0.85–0.9 of this so aisles stay narrow in 3D.
 */
export const PLAN_CELL_WORLD = 3;

/** Plan node card size — inset inside one 2D cell (Lego stud), not full bleed. */
export const PLAN_NODE_W = Math.round(PLAN_CELL_PX * 0.78);
export const PLAN_NODE_H = Math.round(PLAN_CELL_PX * 0.72);

/** Width/depth of 3D block meshes — most of one cell, narrow aisle to neighbours. */
export const PLAN_NODE_WORLD_FOOTPRINT = PLAN_CELL_WORLD * 0.9;

export type FacilityNodeWorldSize = {
  footprint: number;
  height: number;
};

/** Default square footprint — median-sized node at this level uses this (grid-safe). */
export const PLAN_NODE_DEFAULT_WORLD_FOOTPRINT = PLAN_NODE_WORLD_FOOTPRINT;

const SIZE_SCALE_MIN = 0.58;
const SIZE_SCALE_MAX = 1.38;
/** Max block width/depth as fraction of one grid cell (avoids overlap). */
const MAX_FOOTPRINT_CELL_FRACTION = 0.92;

function medianOf(values: number[]): number {
  if (values.length === 0) return 1;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2;
  }
  return sorted[mid]!;
}

/**
 * Per-node 3D box sizes: default footprint at the median; others scale by m² / edge
 * length vs that median. Single-node levels stay at default. Sizes stay within grid cell.
 */
export function computeLevelNodeWorldSizes<T extends FacilityNodeLike>(
  nodes: T[],
): Map<string, FacilityNodeWorldSize> {
  const out = new Map<string, FacilityNodeWorldSize>();
  const defaultFootprint = PLAN_NODE_DEFAULT_WORLD_FOOTPRINT;
  const maxFootprint = PLAN_CELL_WORLD * MAX_FOOTPRINT_CELL_FRACTION;

  for (const node of nodes) {
    const id = node.facility_node_id ?? "";
    const nodeType = node.node_level?.node_type ?? node.node_type;
    out.set(id, {
      footprint: defaultFootprint,
      height: planNodeWorldHeight(nodeType),
    });
  }

  if (nodes.length <= 1) return out;

  const entries = nodes.map((node) => ({
    id: node.facility_node_id ?? "",
    metric: getNodeSpatialSizeMetric(node),
    hasSpace: hasNodeSpaceData(node),
    nodeType: node.node_level?.node_type ?? node.node_type,
  }));

  const metricsForMedian =
    entries.filter((e) => e.hasSpace).length >= 2
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
    const height = Math.min(baseHeight * scale, PLAN_CELL_WORLD * 1.05);

    out.set(id, { footprint, height });
  }

  return out;
}

/** Vertical size of 3D blocks by level type (scales with PLAN_CELL_WORLD). */
export function planNodeWorldHeight(nodeType: string | undefined): number {
  switch (nodeType) {
    case "BLOCK":
      return PLAN_CELL_WORLD * 0.78;
    case "BUILDING":
      return PLAN_CELL_WORLD * 0.62;
    case "FLOOR":
      // Story slab — stacked in 3D by floor_index (see buildLayout).
      return PLAN_CELL_WORLD * 0.48;
    default:
      return PLAN_CELL_WORLD * 0.42;
  }
}

/**
 * Shared campus axes (2D plan and 3D ground plane):
 * +X = East, +Z = South, North = −Z, West = −X.
 * Grid index (gx, gz) is the cell; world/plan center is (gx + 0.5, gz + 0.5).
 */

export function planCellCenter(
  gridX: number,
  gridZ: number,
): { x: number; z: number } {
  return {
    x: (gridX + 0.5) * PLAN_CELL_WORLD,
    z: (gridZ + 0.5) * PLAN_CELL_WORLD,
  };
}

export function planToFlowPosition(
  gridX: number,
  gridZ: number,
): { x: number; y: number } {
  const cx = (gridX + 0.5) * PLAN_CELL_PX;
  const cz = (gridZ + 0.5) * PLAN_CELL_PX;
  return {
    x: cx - PLAN_NODE_W / 2,
    y: cz - PLAN_NODE_H / 2,
  };
}

/**
 * Nearest cell for a React Flow node position (top-left), using the card center.
 * Same integer indices as 3D — only the 2D pixel scale differs.
 */
export function flowToPlanGrid(
  x: number,
  y: number,
): { grid_x: number; grid_z: number } {
  const cx = x + PLAN_NODE_W / 2;
  const cz = y + PLAN_NODE_H / 2;
  return {
    grid_x: Math.floor(cx / PLAN_CELL_PX),
    grid_z: Math.floor(cz / PLAN_CELL_PX),
  };
}

/** Snap a flow top-left so the card centers on the nearest Lego cell. */
export function snapFlowPositionToCell(
  x: number,
  y: number,
): { x: number; y: number; grid_x: number; grid_z: number } {
  const { grid_x, grid_z } = flowToPlanGrid(x, y);
  const pos = planToFlowPosition(grid_x, grid_z);
  return { ...pos, grid_x, grid_z };
}

/** Compass sector from grid position (North = smaller grid_z, East = larger grid_x). */
export function compassSectorFromGrid(
  gridX: number,
  gridZ: number,
  originX = 0,
  originZ = 0,
): string {
  const dx = gridX - originX;
  const dz = gridZ - originZ;
  if (dx === 0 && dz === 0) return "Origin";

  const parts: string[] = [];
  if (dz < 0) parts.push("North");
  else if (dz > 0) parts.push("South");
  if (dx > 0) parts.push("East");
  else if (dx < 0) parts.push("West");
  return parts.join(" · ") || "Origin";
}

export function formatPlanGridCell(gridX: number, gridZ: number): string {
  return `(${gridX}, ${gridZ})`;
}

export type ViewBearing = {
  /** Horizontal view yaw (0 = looking toward world north / −Z). */
  yawRad: number;
  label: string;
  /** Rotate compass dial so N tracks world north on screen. */
  dialRotationDeg: number;
};

const VIEW_BEARING_LABELS = [
  "North",
  "North-East",
  "East",
  "South-East",
  "South",
  "South-West",
  "West",
  "North-West",
] as const;

/** Camera look direction on the XZ ground plane (Three.js Y-up, north = −Z). */
export function viewBearingFromLookDirection(
  lookX: number,
  lookZ: number,
): ViewBearing {
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

export function planToWorldPosition(
  gridX: number,
  gridZ: number,
  /** Bottom of the block (floors stack by raising this). */
  baseY = 0,
): [number, number, number] {
  const { x, z } = planCellCenter(gridX, gridZ);
  return [x, baseY, z];
}

/** Vertical gap between stacked floor slabs in world units. */
export const FLOOR_STACK_GAP = PLAN_CELL_WORLD * 0.06;

/**
 * World Y for the bottom of a floor slab when siblings are stacked in 3D.
 * `storyHeight` is the slab thickness; index 0 sits on the ground.
 */
export function floorStackBaseY(
  floorIndex: number,
  storyHeight: number,
  gap = FLOOR_STACK_GAP,
): number {
  const i = Math.max(0, Math.floor(floorIndex));
  return i * (storyHeight + gap);
}

export const ORIENTATION_OPTIONS: {
  value: SpatialOrientation;
  label: string;
  deg: number;
}[] = [
  { value: "NORTH", label: "North", deg: 0 },
  { value: "EAST", label: "East", deg: 90 },
  { value: "SOUTH", label: "South", deg: 180 },
  { value: "WEST", label: "West", deg: 270 },
];

export function orientationToApi(orientation: SpatialOrientation): string {
  if (orientation === "UNSPECIFIED") return "SPATIAL_ORIENTATION_UNSPECIFIED";
  if (orientation.startsWith("SPATIAL_")) return orientation;
  return orientation;
}

/** Class facade for spatial layout helpers. */
export class FacilitySpatialHelper {
  static readonly PLAN_CELL_PX = PLAN_CELL_PX;
  static readonly PLAN_CELL_WORLD = PLAN_CELL_WORLD;
  static readonly PLAN_NODE_W = PLAN_NODE_W;
  static readonly PLAN_NODE_H = PLAN_NODE_H;
  static readonly PLAN_NODE_WORLD_FOOTPRINT = PLAN_NODE_WORLD_FOOTPRINT;
  static readonly PLAN_NODE_DEFAULT_WORLD_FOOTPRINT =
    PLAN_NODE_DEFAULT_WORLD_FOOTPRINT;
  static normalizeSpatialOrientation = normalizeSpatialOrientation;
  static spatialOrientationLabel = spatialOrientationLabel;
  static parseFacilitySpatialPosition = parseFacilitySpatialPosition;
  static isSpatialPlaced = isSpatialPlaced;
  static serializeFacilitySpatialPosition = serializeFacilitySpatialPosition;
  static computeLevelNodeWorldSizes = computeLevelNodeWorldSizes;
  static planNodeWorldHeight = planNodeWorldHeight;
  static planCellCenter = planCellCenter;
  static planToFlowPosition = planToFlowPosition;
  static flowToPlanGrid = flowToPlanGrid;
  static snapFlowPositionToCell = snapFlowPositionToCell;
  static compassSectorFromGrid = compassSectorFromGrid;
  static formatPlanGridCell = formatPlanGridCell;
  static viewBearingFromLookDirection = viewBearingFromLookDirection;
  static planToWorldPosition = planToWorldPosition;
  static floorStackBaseY = floorStackBaseY;
  static orientationToApi = orientationToApi;
  static readonly FLOOR_STACK_GAP = FLOOR_STACK_GAP;
  static readonly ORIENTATION_OPTIONS = ORIENTATION_OPTIONS;
}
