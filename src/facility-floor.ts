import type { FacilityNodeLike } from "./facility-types";
import { normalizeFacilityNodeType } from "./facility-helpers";
import {
  parseFacilityMetadata,
  type FacilityFloorMetadata,
} from "./facility-node-metadata";

export type { FacilityFloorMetadata };

const ORDINAL_FLOOR_NAMES = [
  "Ground floor",
  "First floor",
  "Second floor",
  "Third floor",
  "Fourth floor",
  "Fifth floor",
] as const;

export function isFloorNodeType(nodeType: unknown): boolean {
  return normalizeFacilityNodeType(nodeType) === "FLOOR";
}

export function getFloorMetadata(node: {
  metadata_json?: string;
}): FacilityFloorMetadata | undefined {
  const meta = parseFacilityMetadata(node.metadata_json);
  const floor = meta.floor;
  if (!floor || typeof floor.floor_index !== "number") return undefined;
  if (!Number.isFinite(floor.floor_index) || floor.floor_index < 0) {
    return undefined;
  }
  return {
    floor_index: Math.floor(floor.floor_index),
    floor_label: floor.floor_label?.trim() || undefined,
  };
}

/** Default display name for a new floor at the given index. */
export function defaultFloorDisplayName(floorIndex: number): string {
  if (floorIndex >= 0 && floorIndex < ORDINAL_FLOOR_NAMES.length) {
    return ORDINAL_FLOOR_NAMES[floorIndex];
  }
  return `Level ${floorIndex}`;
}

/** Next index after existing floor siblings (by metadata, then count). */
export function nextFloorIndexFromSiblings<T extends FacilityNodeLike>(
  siblings: T[],
): number {
  const floors = siblings.filter((n) =>
    isFloorNodeType(n.node_level?.node_type ?? n.node_type),
  );
  if (floors.length === 0) return 0;

  const indices = floors
    .map((n) => getFloorMetadata(n)?.floor_index)
    .filter((i): i is number => typeof i === "number");

  if (indices.length > 0) {
    return Math.max(...indices) + 1;
  }
  return floors.length;
}

export function sortNodesByFloorIndex<T extends FacilityNodeLike>(
  nodes: T[],
): T[] {
  if (!nodes.some((n) => isFloorNodeType(n.node_level?.node_type ?? n.node_type))) {
    return nodes;
  }
  return [...nodes].sort((a, b) => {
    const ia = getFloorMetadata(a)?.floor_index;
    const ib = getFloorMetadata(b)?.floor_index;
    if (ia != null && ib != null && ia !== ib) return ia - ib;
    if (ia != null && ib == null) return -1;
    if (ia == null && ib != null) return 1;
    return (a.name ?? "").localeCompare(b.name ?? "", undefined, { sensitivity: "base" });
  });
}

export function buildFloorMetadataPatch(
  floorIndex: number,
  displayName: string,
): { floor: FacilityFloorMetadata } {
  return {
    floor: {
      floor_index: floorIndex,
      floor_label: displayName.trim() || defaultFloorDisplayName(floorIndex),
    },
  };
}

export type SpatialLayoutHint = {
  title: string;
  body: string;
  variant?: "info" | "warn";
};

/** UI copy for spatial layout / plan vs hierarchy. */
export function getSpatialLayoutHint(params: {
  currentContainerType: string | null;
  displayedNodes: FacilityNodeLike[];
  viewMode: "plan" | "explore";
}): SpatialLayoutHint | null {
  const { currentContainerType, displayedNodes, viewMode } = params;
  const container = normalizeFacilityNodeType(currentContainerType);
  const childTypes = displayedNodes.map(
    (n) => normalizeFacilityNodeType(n.node_level?.node_type ?? n.node_type),
  );
  const allFloors =
    displayedNodes.length > 0 && childTypes.every((t) => t === "FLOOR");

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

export function formatFloorSummary(node: FacilityNodeLike): string | null {
  const nodeType = node.node_level?.node_type ?? node.node_type;
  const meta = getFloorMetadata(node);
  if (!meta && !isFloorNodeType(nodeType)) return null;

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

export class FacilityFloorHelper {
  static isFloorNodeType = isFloorNodeType;
  static getFloorMetadata = getFloorMetadata;
  static defaultFloorDisplayName = defaultFloorDisplayName;
  static nextFloorIndexFromSiblings = nextFloorIndexFromSiblings;
  static sortNodesByFloorIndex = sortNodesByFloorIndex;
  static buildFloorMetadataPatch = buildFloorMetadataPatch;
  static getSpatialLayoutHint = getSpatialLayoutHint;
  static formatFloorSummary = formatFloorSummary;
}

