import type { FacilityNodeLike } from "./facility-types";
import {
  parseFacilitySpatialPosition,
  serializeFacilitySpatialPosition,
  type FacilitySpatialPosition,
} from "./facility-spatial";

export type SpatialCopyPatch = {
  facilityNodeId: string;
  spatial_position_json: string;
  orientation?: string;
};

/**
 * Map placed positions from source children onto target children by sorted name
 * index (bulk create often yields parallel Table 1…N under each zone).
 */
export function buildSpatialCopyPatches<T extends FacilityNodeLike>(
  sourceChildren: T[],
  targetChildren: T[],
): SpatialCopyPatch[] {
  const sources = [...sourceChildren]
    .map((n) => ({
      node: n,
      pos: parseFacilitySpatialPosition(n.spatial_position_json),
    }))
    .filter((x) => Boolean(x.pos?.placed))
    .map((x) => ({ node: x.node, pos: x.pos! }))
    .sort((a, b) =>
      (a.node.name ?? "").localeCompare(b.node.name ?? "", undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );

  const targets = [...targetChildren].sort((a, b) =>
    (a.name ?? "").localeCompare(b.name ?? "", undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

  const count = Math.min(sources.length, targets.length);
  const patches: SpatialCopyPatch[] = [];
  for (let i = 0; i < count; i++) {
    const src = sources[i]!;
    const tgt = targets[i]!;
    if (!tgt.facility_node_id) continue;
    patches.push({
      facilityNodeId: tgt.facility_node_id,
      spatial_position_json: serializeFacilitySpatialPosition({
        grid_x: src.pos.grid_x,
        grid_z: src.pos.grid_z,
        rotation_deg: src.pos.rotation_deg ?? 0,
        placed: true,
      }),
      orientation: tgt.orientation ? String(tgt.orientation) : undefined,
    });
  }
  return patches;
}

export class FacilitySpatialCopyHelper {
  static buildSpatialCopyPatches = buildSpatialCopyPatches;
}


