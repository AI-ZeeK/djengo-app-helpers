"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilitySpatialCopyHelper = void 0;
exports.buildSpatialCopyPatches = buildSpatialCopyPatches;
const facility_spatial_1 = require("./facility-spatial");
/**
 * Map placed positions from source children onto target children by sorted name
 * index (bulk create often yields parallel Table 1…N under each zone).
 */
function buildSpatialCopyPatches(sourceChildren, targetChildren) {
    const sources = [...sourceChildren]
        .map((n) => ({
        node: n,
        pos: (0, facility_spatial_1.parseFacilitySpatialPosition)(n.spatial_position_json),
    }))
        .filter((x) => Boolean(x.pos?.placed))
        .map((x) => ({ node: x.node, pos: x.pos }))
        .sort((a, b) => (a.node.name ?? "").localeCompare(b.node.name ?? "", undefined, {
        numeric: true,
        sensitivity: "base",
    }));
    const targets = [...targetChildren].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", undefined, {
        numeric: true,
        sensitivity: "base",
    }));
    const count = Math.min(sources.length, targets.length);
    const patches = [];
    for (let i = 0; i < count; i++) {
        const src = sources[i];
        const tgt = targets[i];
        if (!tgt.facility_node_id)
            continue;
        patches.push({
            facilityNodeId: tgt.facility_node_id,
            spatial_position_json: (0, facility_spatial_1.serializeFacilitySpatialPosition)({
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
class FacilitySpatialCopyHelper {
}
exports.FacilitySpatialCopyHelper = FacilitySpatialCopyHelper;
FacilitySpatialCopyHelper.buildSpatialCopyPatches = buildSpatialCopyPatches;
//# sourceMappingURL=facility-spatial-copy.js.map