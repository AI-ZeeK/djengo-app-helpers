"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityTreeHelper = exports.FACILITY_TREE_ROOT_KEY = void 0;
exports.nodeChildCount = nodeChildCount;
exports.flattenLazyFacilityTree = flattenLazyFacilityTree;
exports.filterVisibleRows = filterVisibleRows;
const facility_node_metadata_1 = require("./facility-node-metadata");
exports.FACILITY_TREE_ROOT_KEY = "__root__";
function nodeChildCount(node) {
    return node.child_count ?? node.children?.length ?? 0;
}
function flattenLazyFacilityTree(rootNodes, childrenByParentId, expandedIds, loadingParentIds, depth = 0) {
    const rows = [];
    const walk = (nodes, level) => {
        for (const node of nodes) {
            const count = nodeChildCount(node);
            const id = node.facility_node_id ?? "";
            const loadedKids = childrenByParentId[id];
            const hasChildren = count > 0;
            const expanded = expandedIds.has(id);
            rows.push({
                node,
                depth: level,
                hasChildren,
                childCount: count,
                isLoadingChildren: loadingParentIds.has(id) && !loadedKids,
            });
            if (hasChildren && expanded && loadedKids) {
                walk(loadedKids, level + 1);
            }
        }
    };
    walk(rootNodes, depth);
    return rows;
}
/** Filter loaded visible rows by search (name, code, description). */
function filterVisibleRows(rows, query) {
    const q = query.trim().toLowerCase();
    if (!q)
        return rows;
    return rows.filter((r) => {
        const desc = (0, facility_node_metadata_1.getNodeDescription)(r.node).toLowerCase();
        return ((r.node.name ?? "").toLowerCase().includes(q) ||
            (r.node.code ?? "").toLowerCase().includes(q) ||
            desc.includes(q));
    });
}
class FacilityTreeHelper {
}
exports.FacilityTreeHelper = FacilityTreeHelper;
FacilityTreeHelper.FACILITY_TREE_ROOT_KEY = exports.FACILITY_TREE_ROOT_KEY;
FacilityTreeHelper.nodeChildCount = nodeChildCount;
FacilityTreeHelper.flattenLazyFacilityTree = flattenLazyFacilityTree;
FacilityTreeHelper.filterVisibleRows = filterVisibleRows;
//# sourceMappingURL=facility-tree-utils.js.map