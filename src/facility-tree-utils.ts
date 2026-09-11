import { getNodeDescription } from "./facility-node-metadata";
import type { FacilityNodeLike } from "./facility-types";

export const FACILITY_TREE_ROOT_KEY = "__root__";

export type FacilityTreeVisibleRow<T extends FacilityNodeLike = FacilityNodeLike> = {
  node: T;
  depth: number;
  hasChildren: boolean;
  childCount: number;
  isLoadingChildren: boolean;
};

export function nodeChildCount(node: FacilityNodeLike): number {
  return node.child_count ?? node.children?.length ?? 0;
}

export function flattenLazyFacilityTree<T extends FacilityNodeLike>(
  rootNodes: T[],
  childrenByParentId: Record<string, T[]>,
  expandedIds: Set<string>,
  loadingParentIds: Set<string>,
  depth = 0,
): FacilityTreeVisibleRow<T>[] {
  const rows: FacilityTreeVisibleRow<T>[] = [];

  const walk = (nodes: T[], level: number) => {
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
        isLoadingChildren:
          loadingParentIds.has(id) && !loadedKids,
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
export function filterVisibleRows<T extends FacilityNodeLike>(
  rows: FacilityTreeVisibleRow<T>[],
  query: string,
): FacilityTreeVisibleRow<T>[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((r) => {
    const desc = getNodeDescription(r.node).toLowerCase();
    return (
      (r.node.name ?? "").toLowerCase().includes(q) ||
      (r.node.code ?? "").toLowerCase().includes(q) ||
      desc.includes(q)
    );
  });
}

export class FacilityTreeHelper {
  static readonly FACILITY_TREE_ROOT_KEY = FACILITY_TREE_ROOT_KEY;
  static nodeChildCount = nodeChildCount;
  static flattenLazyFacilityTree = flattenLazyFacilityTree;
  static filterVisibleRows = filterVisibleRows;
}

