import type { FacilityNodeLike } from "./facility-types";
import type { FacilityNodeType } from "./facility-enums";
import type { FacilitySpaceUsage } from "./facility-helpers";
export declare const MIN_BULK_CHILD_COUNT = 1;
export declare const MAX_BULK_CHILD_COUNT = 50;
export declare const DEFAULT_BULK_CHILD_COUNT = 3;
export declare function clampBulkChildCount(value: number): number;
export declare function countSameTypeSiblings<T extends FacilityNodeLike>(siblings: T[], childType: FacilityNodeType): number;
/** Preview names for the next N children of this type under the parent. */
export declare function previewBulkChildNames<T extends FacilityNodeLike>(childType: FacilityNodeType, count: number, siblings: T[]): string[];
export type BulkCreateNodeDto = {
    parent_facility_node_id?: string;
    node_level_id: string;
    name: string;
    metadata_json?: string;
    department_id?: string;
    space_usage?: FacilitySpaceUsage;
    branch_id?: string;
    staffScoped?: boolean;
};
export type BulkCreateChildrenParams<T extends FacilityNodeLike = FacilityNodeLike> = {
    count: number;
    childType: FacilityNodeType;
    levelId: string;
    parentFacilityNodeId?: string;
    branchId: string;
    staffScoped?: boolean;
    siblings: T[];
    description?: string;
    departmentId?: string;
    spaceUsage?: FacilitySpaceUsage;
    createNode: (dto: BulkCreateNodeDto) => Promise<unknown>;
    onProgress?: (done: number, total: number) => void;
};
/** Creates N sibling locations under the same parent with auto-generated names. */
export declare function bulkCreateChildrenUnderParent(params: BulkCreateChildrenParams): Promise<number>;
export declare class FacilityBulkCreateHelper {
    static readonly MIN_BULK_CHILD_COUNT = 1;
    static readonly MAX_BULK_CHILD_COUNT = 50;
    static readonly DEFAULT_BULK_CHILD_COUNT = 3;
    static clampBulkChildCount: typeof clampBulkChildCount;
    static countSameTypeSiblings: typeof countSameTypeSiblings;
    static previewBulkChildNames: typeof previewBulkChildNames;
    static bulkCreateChildrenUnderParent: typeof bulkCreateChildrenUnderParent;
}
//# sourceMappingURL=bulk-create-children.d.ts.map