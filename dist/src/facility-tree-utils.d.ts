import type { FacilityNodeLike } from "./facility-types";
export declare const FACILITY_TREE_ROOT_KEY = "__root__";
export type FacilityTreeVisibleRow<T extends FacilityNodeLike = FacilityNodeLike> = {
    node: T;
    depth: number;
    hasChildren: boolean;
    childCount: number;
    isLoadingChildren: boolean;
};
export declare function nodeChildCount(node: FacilityNodeLike): number;
export declare function flattenLazyFacilityTree<T extends FacilityNodeLike>(rootNodes: T[], childrenByParentId: Record<string, T[]>, expandedIds: Set<string>, loadingParentIds: Set<string>, depth?: number): FacilityTreeVisibleRow<T>[];
/** Filter loaded visible rows by search (name, code, description). */
export declare function filterVisibleRows<T extends FacilityNodeLike>(rows: FacilityTreeVisibleRow<T>[], query: string): FacilityTreeVisibleRow<T>[];
export declare class FacilityTreeHelper {
    static readonly FACILITY_TREE_ROOT_KEY = "__root__";
    static nodeChildCount: typeof nodeChildCount;
    static flattenLazyFacilityTree: typeof flattenLazyFacilityTree;
    static filterVisibleRows: typeof filterVisibleRows;
}
//# sourceMappingURL=facility-tree-utils.d.ts.map